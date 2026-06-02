/* ============================================================
   Hieróglifos — O Enigma do Escriba
   Jogo educativo sobre Matemática Discreta — Arranjos
   ============================================================ */

const app = document.getElementById('app');

const state = {
  completed: new Set(),
  score: 0,          // pontos das câmaras 1–6
  quizPoints: 0,     // pontos do quiz final (substituído, nunca somado em duplicidade)
  quizQuestions: [],
  quizIndex: 0,
  quizCorrect: 0,
  currentChamber: null,
  autoTimer: null
};

/* Item 6 — nomes mais ligados ao conteúdo (sem serem literais demais).
   Item 3 — nova câmara discursiva "do Oráculo" (c6), antes do Faraó (c7).
   Item 1 — a Câmara do Faraó (c7) fica SEMPRE acessível (recurso de
   demonstração para o professor, sem precisar jogar tudo). */
const CHAMBERS = [
  { id: 'c1', glyph: '𓂀', title: 'Câmara da Ordem',
    subtitle: 'A ordem importa — o conceito de Arranjo' },
  { id: 'c2', glyph: '𓊪', title: 'Câmara das Sequências',
    subtitle: 'Arranjo Simples: posições distintas' },
  { id: 'c3', glyph: '𓊃', title: 'Câmara dos Ecos',
    subtitle: 'Arranjo com Repetição: símbolos que retornam' },
  { id: 'c4', glyph: '𓋹', title: 'Câmara dos Enigmas',
    subtitle: 'Problemas aplicados de Arranjo' },
  { id: 'c5', glyph: '𓎛', title: 'Câmara do Discernimento',
    subtitle: 'Simples ou com Repetição? Classifique' },
  { id: 'c6', glyph: '𓁢', title: 'Câmara do Oráculo',
    subtitle: 'Decifre o enigma com suas próprias palavras' },
  { id: 'c7', glyph: '𓁹', title: 'Câmara do Faraó',
    subtitle: 'Julgamento final — 10 de 20 enigmas' }
];

/* Item 1 — câmara sempre aberta (livre acesso ao quiz). */
const ALWAYS_OPEN = 'c7';

/* ============================================================
   Persistência (Item 9) — localStorage
   ============================================================ */

const SAVE_KEY = 'hieroglifos_save_v1';

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      completed: [...state.completed],
      score: state.score,
      quizPoints: state.quizPoints
    }));
  } catch (e) { /* armazenamento indisponível — segue sem persistir */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    state.completed = new Set(Array.isArray(d.completed) ? d.completed : []);
    state.score = Number(d.score) || 0;
    state.quizPoints = Number(d.quizPoints) || 0;
  } catch (e) { /* dados corrompidos — começa do zero */ }
}

function performReset() {
  clearAuto();
  state.completed = new Set();
  state.score = 0;
  state.quizPoints = 0;
  state.quizQuestions = [];
  state.quizIndex = 0;
  state.quizCorrect = 0;
  state.currentChamber = null;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  showMenu();
}
window.resetGame = () => {
  showConfirm({
    glyph: '𓁢',
    title: 'Recomeçar a Jornada?',
    message: 'Dr. Aalim, ao recomeçar você abandonará tudo o que descobriu: as câmaras desvendadas e a sabedoria acumulada se perderão nas areias do tempo. Esta decisão não pode ser desfeita.',
    confirmLabel: 'Sim, recomeçar do início',
    cancelLabel: 'Não, continuar minha jornada',
    onConfirm: performReset
  });
};

/* ============================================================
   Modal temático de confirmação (substitui o confirm() nativo)
   ============================================================ */

function closeModal() {
  const el = document.getElementById('game-modal');
  if (el) el.remove();
  document.removeEventListener('keydown', _modalKeyHandler);
}

function _modalKeyHandler(e) {
  if (e.key === 'Escape') closeModal();
}

function showConfirm({ glyph = '𓂀', title = '', message = '', confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm = () => {} }) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'game-modal';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-glyph">${glyph}</div>
      <h3 class="modal-title">${title}</h3>
      <p class="modal-message">${message}</p>
      <div class="modal-actions">
        <button class="danger" id="modal-confirm">${confirmLabel}</button>
        <button class="secondary" id="modal-cancel">${cancelLabel}</button>
      </div>
    </div>
  `;
  // Clicar fora (no fundo escurecido) cancela.
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.body.appendChild(overlay);
  document.getElementById('modal-confirm').addEventListener('click', () => {
    closeModal();
    onConfirm();
  });
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.addEventListener('keydown', _modalKeyHandler);
}

/* ============================================================
   Utilidades
   ============================================================ */

function setEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

function totalScore() { return state.score + state.quizPoints; }

function allDone() { return state.completed.size === CHAMBERS.length; }

function render(html) { app.innerHTML = html; }

/* Auto-avanço (Item 7) ------------------------------------- */
function clearAuto() {
  if (state.autoTimer) { clearTimeout(state.autoTimer); state.autoTimer = null; }
}
function scheduleAuto(fn, secs = 3) {
  clearAuto();
  state.autoTimer = setTimeout(() => { state.autoTimer = null; fn(); }, secs * 1000);
}
function autoAdvanceRow(handler, label = 'Avançar agora →') {
  return `
    <div class="auto-advance">
      <span class="auto-msg">Avançando automaticamente em 3 segundos…</span>
      <button onclick="${handler}">${label}</button>
    </div>`;
}

function hud() {
  const total = CHAMBERS.length;
  const done = state.completed.size;
  return `
    <div class="hud">
      <div>𓉴 Câmaras: <strong>${done}/${total}</strong></div>
      <div class="score">★ Pontos: ${totalScore()}</div>
      <div><button class="secondary" onclick="goMenu()">Mapa da Pirâmide</button></div>
    </div>
  `;
}

function feedback(msg, type = 'info') {
  return `<div class="feedback ${type}">${msg}</div>`;
}

function nextChamberId(currentId) {
  const idx = CHAMBERS.findIndex(c => c.id === currentId);
  return (idx >= 0 && idx < CHAMBERS.length - 1) ? CHAMBERS[idx + 1].id : null;
}

function chamberFooterSolved(chamberId) {
  // Item 10 — ao concluir TODAS as câmaras, oferece a tela de celebração
  // (somente via botão; sem avanço automático).
  if (allDone()) {
    return `<div class="victory-cta">
      <button onclick="window._goVictory()">𓋹 Entrar na Câmara do Tesouro 𓋹</button>
    </div>
    <div class="row">
      <button class="secondary" onclick="goMenu()">Voltar ao Mapa</button>
    </div>`;
  }
  const next = nextChamberId(chamberId);
  const nextLabel = next
    ? `Próxima: ${CHAMBERS.find(c => c.id === next).title} →`
    : null;
  return `<div class="row" style="margin-top: 18px;">
    ${next ? `<button onclick="enterChamber('${next}')">${nextLabel}</button>` : ''}
    <button class="secondary" onclick="goMenu()">Voltar ao Mapa</button>
  </div>`;
}
window._goVictory = () => { clearAuto(); showVictory(); };

function completeChamber(points) {
  if (!state.completed.has(state.currentChamber)) {
    state.completed.add(state.currentChamber);
    state.score += points;
    saveState();
  }
}

/* Bloco reutilizável: "+X pontos · total" (Item 7) */
function pointsBanner(gained) {
  return `<div class="points-banner">
    <span class="pts-plus">+${gained} pontos</span>
    <span class="pts-total">Pontuação total: <strong>${totalScore()}</strong></span>
  </div>`;
}

/* ============================================================
   TELA: Menu / Enredo
   ============================================================ */

function showMenu() {
  clearAuto();
  state.currentChamber = null;
  const cards = CHAMBERS.map((c, i) => {
    const prev = i === 0 ? true : state.completed.has(CHAMBERS[i - 1].id);
    const done = state.completed.has(c.id);
    const locked = !prev && !done && c.id !== ALWAYS_OPEN;
    const cls = `chamber-card ${locked ? 'locked' : ''} ${done ? 'completed' : ''}`;
    const onclick = locked ? '' : `onclick="enterChamber('${c.id}')"`;
    const check = done ? '<span class="check">✓</span>' : '';
    return `
      <div class="${cls}" ${onclick}>
        ${check}
        <span class="glyph">${c.glyph}</span>
        <strong>${c.title}</strong>
        <div style="font-size:0.85em; opacity:0.8; margin-top:4px;">${c.subtitle}</div>
      </div>
    `;
  }).join('');

  render(`
    <div class="scroll">
      <h1>Hieróglifos</h1>
      <div class="hieroglyph-row">𓂀 𓊪 𓊃 𓋹 𓎛 𓁢 𓁹</div>
      <h2 style="text-align:center;">O Enigma do Escriba</h2>

      <p>
        <strong>Cairo, 1922.</strong> Você é <em>Dr. Aalim</em>, um arqueólogo que acaba
        de descobrir uma pirâmide esquecida nas areias de Saqqara. No interior, sete
        câmaras seladas guardam o saber matemático dos antigos escribas — os segredos dos
        <strong>Arranjos</strong>, a arte de ordenar e selecionar elementos em sequências
        únicas e sagradas.
      </p>
      <p>
        Para abrir cada câmara, você precisará decifrar enigmas sobre <strong>Arranjo
        Simples</strong> e <strong>Arranjo com Repetição</strong>. Ao fim, o próprio Faraó
        testará sua sabedoria com um julgamento de <strong>10 perguntas</strong>.
      </p>

      <div class="tip">
        <strong>Como jogar:</strong> toque em uma câmara desbloqueada para entrar.
        Cada acerto rende pontos e seu progresso é <strong>salvo automaticamente</strong>.
        A <strong>Câmara do Faraó</strong> fica sempre aberta. Você pode revisitar
        câmaras já concluídas a qualquer momento.
      </div>

      <h3 style="text-align:center; margin-top:24px;">𓉴 Mapa da Pirâmide 𓉴</h3>
      <div class="chamber-map">${cards}</div>

      <div class="spacer"></div>
      <div class="center">
        <strong>Pontuação atual: ${totalScore()}</strong>
        ${allDone()
          ? `<div class="feedback ok" style="cursor:pointer;" onclick="window._goVictory()">
               𓁿 Você completou TODAS as câmaras! Toque aqui para entrar na Câmara do Tesouro 𓋹
             </div>`
          : ''}
        <div class="spacer"></div>
        <button class="danger" onclick="resetGame()">Reiniciar Progresso</button>
      </div>
    </div>
  `);
}

function goMenu() {
  clearAuto();
  // Restaura a pontuação salva (caso o jogador saia do quiz antes de finalizá-lo,
  // a contagem parcial mostrada no topo não deve "grudar").
  loadState();
  showMenu();
}

function enterChamber(id) {
  clearAuto();
  state.currentChamber = id;
  switch (id) {
    case 'c1': return chamberC1();
    case 'c2': return chamberC2();
    case 'c3': return chamberC3();
    case 'c4': return chamberC4();
    case 'c5': return chamberC5();
    case 'c6': return chamberDiscursive();
    case 'c7': return chamberFinalIntro();
  }
}

/* Pequena legenda que indica visualmente que se deve clicar (Item 2) */
const CLICK_HINT = `<div class="click-hint">Toque nos símbolos abaixo para selecioná-los</div>`;

/* ============================================================
   CÂMARA 1 — Da Ordem: Conceito de Arranjo
   ============================================================ */

function chamberC1() {
  const allPairs = ['AB', 'BA', 'AC', 'CA', 'BC', 'CB', 'AA', 'BB', 'CC'];
  const correctPairs = new Set(['AB', 'BA', 'AC', 'CA', 'BC', 'CB']);
  let chosen = new Set();
  let stage1Done = false;

  function drawStage1(msg = '') {
    const elems = allPairs.map(p => `
      <span class="element ${chosen.has(p) ? 'selected' : ''} ${stage1Done ? 'disabled' : 'clickable'}"
            onclick="${stage1Done ? '' : `window._c1Click('${p}')`}"
            style="font-family:monospace;">${p}</span>
    `).join('');

    const actionRow = stage1Done
      ? autoAdvanceRow('window._c1ToStage2()', 'Avançar para o Estágio 2 →')
      : `<div class="row">
           <button onclick="window._c1Check()">Confirmar</button>
           <button class="secondary" onclick="window._c1Reset()">Limpar</button>
         </div>`;

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓂀 Câmara da Ordem — Estágio 1/2</h2>
        <p>
          O escriba dispõe de três símbolos: <strong>A</strong>, <strong>B</strong> e <strong>C</strong>.
          Ele quer formar sequências <em>ordenadas</em> de 2 símbolos <strong>distintos</strong>.
        </p>
        <div class="tip">
          <strong>Arranjo Simples A(n, p):</strong> seleção ordenada de <em>p</em> elementos
          distintos de um conjunto de <em>n</em>. A <strong>ordem importa</strong>:
          "AB" e "BA" são arranjos <strong>diferentes</strong>. Elementos <strong>não se repetem</strong>.
        </div>
        <p class="center">
          <strong>Desafio:</strong> selecione TODOS os pares que são arranjos simples de 2
          elementos de {A, B, C}.
        </p>
        ${CLICK_HINT}
        <div class="elements-pool">${elems}</div>
        ${msg}
        ${actionRow}
      </div>
    `);
  }

  function drawStage2(msg = '') {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓂀 Câmara da Ordem — Estágio 2/2</h2>
        <p>Agora aplique a fórmula.</p>
        <div class="tip">
          <strong>Fórmula:</strong> <code>A(n, p) = n! / (n − p)!</code><br>
          Equivale ao produto de <em>p</em> fatores decrescentes a partir de <em>n</em>:
          <code>n × (n−1) × (n−2) × … × (n−p+1)</code>
        </div>
        <p class="center">
          <strong>Desafio:</strong> O escriba agora tem <strong>5 hieróglifos diferentes</strong>
          (𓀀, 𓀁, 𓀂, 𓀃, 𓀄). De quantas formas ele pode escolher e ordenar
          <strong>3 deles</strong> na parede? Calcule <code>A(5, 3)</code>.
        </p>
        <div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[54, 60, 64, 72].map((v, i) =>
            `<button class="alt-btn" onclick="window._c1Ans2(${v})">${String.fromCharCode(65 + i)}) ${v}</button>`
          ).join('')}
        </div>
        ${msg}
      </div>
    `);
  }

  function drawSolved() {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓂀 Câmara da Ordem — Concluída ✓</h2>
        ${feedback('𓋹 Excelente, Dr. Aalim! Você compreendeu a essência dos Arranjos.', 'ok')}
        ${pointsBanner(20)}
        <p>
          De {A, B, C}, os 6 arranjos simples de tamanho 2 são: AB, BA, AC, CA, BC, CB.<br>
          A(5, 3) = 5 × 4 × 3 = <strong>60</strong> hieróglifos ordenados.
        </p>
        ${chamberFooterSolved('c1')}
      </div>
    `);
  }

  window._c1Click = p => {
    if (stage1Done) return;
    if (chosen.has(p)) chosen.delete(p); else chosen.add(p);
    drawStage1();
  };
  window._c1Reset = () => { chosen = new Set(); drawStage1(); };
  window._c1Check = () => {
    if (setEqual(chosen, correctPairs)) {
      stage1Done = true;
      drawStage1(feedback('𓋹 Correto! Há 6 arranjos: AB, BA, AC, CA, BC, CB. A ordem importa e não há repetição!', 'ok'));
      scheduleAuto(() => window._c1ToStage2());
    } else {
      drawStage1(feedback('Ainda não. Lembre-se: a ordem importa (AB e BA contam como diferentes) e nenhum símbolo se repete dentro do par (descarte os pares com letras iguais).', 'err'));
    }
  };
  window._c1ToStage2 = () => { clearAuto(); drawStage2(); };
  window._c1Ans2 = v => {
    if (v === 60) {
      completeChamber(20);
      drawSolved();
    } else {
      drawStage2(feedback('Ainda não. Em A(5, 3), multiplique os 3 primeiros fatores decrescentes a partir do 5. Refaça a conta e escolha novamente.', 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 2 — Das Sequências: Arranjo Simples A(n,p)
   ============================================================ */

function chamberC2() {
  let stage1Done = false;

  function drawStage1(msg = '') {
    const altsHtml = stage1Done
      ? autoAdvanceRow('window._c2ToStage2()', 'Avançar para o Estágio 2 →')
      : `<div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[180, 210, 240, 280].map((v, i) =>
            `<button class="alt-btn" onclick="window._c2Ans1(${v})">${String.fromCharCode(65 + i)}) ${v}</button>`
          ).join('')}
        </div>`;

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊪 Câmara das Sequências — Estágio 1/2</h2>
        <p>
          Ao todo, <strong>7 escribas</strong> se inscrevem em uma competição de caligrafia.
          O júri definirá o <strong>1º, 2º e 3º lugares</strong> (posições distintas,
          uma pessoa por posição).
        </p>
        <div class="tip">
          <strong>A(7, 3) = 7! / (7−3)! = 7 × 6 × 5</strong><br>
          Usamos Arranjo Simples pois a <strong>ordem importa</strong> (1º ≠ 2º lugar)
          e <strong>não há repetição</strong> (um escriba não ocupa dois lugares).
        </div>
        <p class="center"><strong>Desafio:</strong> Entre os <strong>7 escribas</strong>, quantos pódios distintos de 3 lugares são possíveis?</p>
        ${altsHtml}
        ${msg}
      </div>
    `);
  }

  const pairCandidates = [
    { id: 0, label: '(1, 2)', valid: true },
    { id: 1, label: '(2, 1)', valid: true },
    { id: 2, label: '(3, 3)', valid: false },
    { id: 3, label: '(1, 4)', valid: true },
    { id: 4, label: '(4, 1)', valid: true },
    { id: 5, label: '(2, 2)', valid: false },
    { id: 6, label: '(3, 4)', valid: true },
    { id: 7, label: '(4, 3)', valid: true },
  ];
  const correctIds = new Set(pairCandidates.filter(p => p.valid).map(p => p.id));
  let chosenPairs = new Set();

  function drawStage2(msg = '') {
    const opts = pairCandidates.map(p => `
      <span class="element clickable ${chosenPairs.has(p.id) ? 'selected' : ''}"
            onclick="window._c2PairClick(${p.id})"
            style="font-family:monospace;">${p.label}</span>
    `).join('');

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊪 Câmara das Sequências — Estágio 2/2</h2>
        <p>
          Considere o conjunto <code>{1, 2, 3, 4}</code> e arranjos simples de tamanho 2.
        </p>
        <div class="tip">
          <strong>Lembre:</strong> em um Arranjo Simples, os elementos são distintos — o mesmo
          elemento não pode aparecer duas vezes na mesma sequência.
          Logo, (3,3) e (2,2) <strong>não são</strong> arranjos simples.
        </div>
        <p class="center">
          <strong>Desafio:</strong> selecione TODOS os pares ordenados abaixo que são
          arranjos simples válidos de tamanho 2 de {1, 2, 3, 4}.
        </p>
        ${CLICK_HINT}
        <div class="elements-pool">${opts}</div>
        ${msg}
        <div class="row">
          <button onclick="window._c2PairCheck()">Confirmar</button>
          <button class="secondary" onclick="window._c2PairReset()">Limpar</button>
        </div>
      </div>
    `);
  }

  function drawSolved() {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊪 Câmara das Sequências — Concluída ✓</h2>
        ${feedback('𓋹 Sabedoria comprovada! Você domina o Arranjo Simples.', 'ok')}
        ${pointsBanner(25)}
        <p>
          A(7, 3) = 7 × 6 × 5 = <strong>210</strong> pódios possíveis.<br>
          A(4, 2) = 4 × 3 = 12 pares; os inválidos são (3,3) e (2,2), pois repetem o elemento.
        </p>
        ${chamberFooterSolved('c2')}
      </div>
    `);
  }

  window._c2Ans1 = v => {
    if (v === 210) {
      stage1Done = true;
      drawStage1(feedback('𓋹 Correto! A(7, 3) = 7 × 6 × 5 = 210.', 'ok'));
      scheduleAuto(() => window._c2ToStage2());
    } else {
      drawStage1(feedback('Ainda não. Em A(7, 3), multiplique os 3 primeiros fatores decrescentes a partir do 7. Calcule com calma e escolha de novo.', 'err'));
    }
  };
  window._c2ToStage2 = () => { clearAuto(); drawStage2(); };
  window._c2PairClick = id => {
    if (chosenPairs.has(id)) chosenPairs.delete(id); else chosenPairs.add(id);
    drawStage2();
  };
  window._c2PairReset = () => { chosenPairs = new Set(); drawStage2(); };
  window._c2PairCheck = () => {
    if (setEqual(chosenPairs, correctIds)) {
      completeChamber(25);
      drawSolved();
    } else {
      drawStage2(feedback('Ainda não. Reveja cada par: um arranjo simples só é válido quando os dois números são <strong>diferentes</strong>. Pares com números iguais devem ficar de fora.', 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 3 — Dos Ecos: Arranjo com Repetição AR(n,p)
   ============================================================ */

function chamberC3() {
  let stage1Done = false;

  function drawStage1(msg = '') {
    const altsHtml = stage1Done
      ? autoAdvanceRow('window._c3ToStage2()', 'Avançar para o Estágio 2 →')
      : `<div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[12, 14, 16, 18].map((v, i) =>
            `<button class="alt-btn" onclick="window._c3Ans1(${v})">${String.fromCharCode(65 + i)}) ${v}</button>`
          ).join('')}
        </div>`;

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊃 Câmara dos Ecos — Estágio 1/2</h2>
        <p>
          Um artesão cria selos com <strong>2 símbolos</strong> escolhidos de um conjunto de
          <strong>4 hieróglifos sagrados</strong> (𓀀, 𓀁, 𓀂, 𓀃). O mesmo hieróglifo
          <strong>pode aparecer mais de uma vez</strong> no selo (ex.: 𓀀𓀀 é permitido).
        </p>
        <div class="tip">
          <strong>Arranjo com Repetição AR(n, p):</strong> seleção ordenada de <em>p</em>
          elementos de um conjunto de <em>n</em>, com repetição permitida.<br>
          Fórmula: <code>AR(n, p) = nᵖ</code>
        </div>
        <p class="center"><strong>Desafio:</strong> Quantos selos distintos o artesão pode criar? Calcule <code>AR(4, 2)</code>.</p>
        ${altsHtml}
        ${msg}
      </div>
    `);
  }

  function drawStage2(msg = '') {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊃 Câmara dos Ecos — Estágio 2/2</h2>
        <p>
          Um guardião protege o tesouro com um código secreto de <strong>3 dígitos</strong>,
          cada dígito escolhido de <code>{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}</code>,
          <strong>com repetição</strong> permitida.
        </p>
        <div class="tip">
          <strong>AR(n, p) = nᵖ</strong> — com repetição, cada posição é independente:
          há <em>n</em> opções para cada uma das <em>p</em> posições.
        </div>
        <p class="center"><strong>Desafio:</strong> Quantos códigos distintos de 3 dígitos existem? Calcule <code>AR(10, 3)</code>.</p>
        <div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[800, 900, 1000, 1200].map((v, i) =>
            `<button class="alt-btn" onclick="window._c3Ans2(${v})">${String.fromCharCode(65 + i)}) ${fmt(v)}</button>`
          ).join('')}
        </div>
        ${msg}
      </div>
    `);
  }

  function drawSolved() {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊃 Câmara dos Ecos — Concluída ✓</h2>
        ${feedback('𓋹 Você dominou o Arranjo com Repetição!', 'ok')}
        ${pointsBanner(25)}
        <p>
          AR(4, 2) = 4² = <strong>16</strong> selos distintos.<br>
          AR(10, 3) = 10³ = <strong>1.000</strong> códigos possíveis.
        </p>
        ${chamberFooterSolved('c3')}
      </div>
    `);
  }

  window._c3Ans1 = v => {
    if (v === 16) {
      stage1Done = true;
      drawStage1(feedback('𓋹 Correto! AR(4, 2) = 4² = 16.', 'ok'));
      scheduleAuto(() => window._c3ToStage2());
    } else {
      drawStage1(feedback('Ainda não. Use AR(n, p) = nᵖ. Aqui há 4 símbolos (n) e 2 posições (p): eleve o 4 ao quadrado e confira.', 'err'));
    }
  };
  window._c3ToStage2 = () => { clearAuto(); drawStage2(); };
  window._c3Ans2 = v => {
    if (v === 1000) {
      completeChamber(25);
      drawSolved();
    } else {
      drawStage2(feedback('Ainda não. AR(10, 3) = 10³: multiplique o 10 por ele mesmo três vezes e veja o total.', 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 4 — Dos Enigmas: Problemas Aplicados
   ============================================================ */

function chamberC4() {
  let stage1Done = false;

  function drawStage1(msg = '') {
    const altsHtml = stage1Done
      ? autoAdvanceRow('window._c4ToStage2()', 'Avançar para o Estágio 2 →')
      : `<div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[4860, 5040, 5400, 5760].map((v, i) =>
            `<button class="alt-btn" onclick="window._c4Ans1(${v})">${String.fromCharCode(65 + i)}) ${fmt(v)}</button>`
          ).join('')}
        </div>`;

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓋹 Câmara dos Enigmas — Estágio 1/2</h2>
        <p>
          Uma galeria egípcia possui <strong>10 pinturas</strong> diferentes e
          <strong>4 posições de destaque</strong> numeradas (1ª, 2ª, 3ª, 4ª).
          Cada pintura pode ocupar apenas uma posição.
        </p>
        <div class="tip">
          <strong>Arranjo Simples:</strong> a posição importa (1ª ≠ 2ª) e cada pintura é usada no máximo uma vez.<br>
          <code>A(10, 4) = 10 × 9 × 8 × 7</code>
        </div>
        <p class="center"><strong>Desafio:</strong> De quantas formas a galeria pode ser organizada?</p>
        ${altsHtml}
        ${msg}
      </div>
    `);
  }

  function drawStage2(msg = '') {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓋹 Câmara dos Enigmas — Estágio 2/2</h2>
        <p>
          Uma câmara sagrada tem <strong>3 nichos</strong> na parede. O sacerdote
          escolhe hieróglifos para preencher cada nicho, podendo repetir o mesmo
          hieróglifo. Ele dispõe de <strong>5 hieróglifos sagrados</strong>.
        </p>
        <div class="tip">
          <strong>Arranjo com Repetição:</strong> a posição do nicho importa e a
          repetição é permitida.<br>
          <code>AR(5, 3) = 5³ = 5 × 5 × 5</code>
        </div>
        <p class="center"><strong>Desafio:</strong> Quantas configurações distintas dos 3 nichos são possíveis?</p>
        <div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[100, 110, 125, 135].map((v, i) =>
            `<button class="alt-btn" onclick="window._c4Ans2(${v})">${String.fromCharCode(65 + i)}) ${v}</button>`
          ).join('')}
        </div>
        ${msg}
      </div>
    `);
  }

  function drawSolved() {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓋹 Câmara dos Enigmas — Concluída ✓</h2>
        ${feedback('𓋹 Os mistérios dos Arranjos foram revelados!', 'ok')}
        ${pointsBanner(30)}
        <p>
          A(10, 4) = 10 × 9 × 8 × 7 = <strong>5.040</strong> organizações da galeria.<br>
          AR(5, 3) = 5³ = <strong>125</strong> configurações de nichos.
        </p>
        ${chamberFooterSolved('c4')}
      </div>
    `);
  }

  window._c4Ans1 = v => {
    if (v === 5040) {
      stage1Done = true;
      drawStage1(feedback('𓋹 Correto! A(10, 4) = 10 × 9 × 8 × 7 = 5.040.', 'ok'));
      scheduleAuto(() => window._c4ToStage2());
    } else {
      drawStage1(feedback('Ainda não. Em A(10, 4), multiplique os 4 primeiros fatores decrescentes a partir do 10. Refaça com atenção.', 'err'));
    }
  };
  window._c4ToStage2 = () => { clearAuto(); drawStage2(); };
  window._c4Ans2 = v => {
    if (v === 125) {
      completeChamber(30);
      drawSolved();
    } else {
      drawStage2(feedback('Ainda não. AR(5, 3) = 5³: multiplique o 5 por ele mesmo três vezes e confira o resultado.', 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 5 — Do Discernimento: Classificação
   ============================================================ */

function chamberC5() {
  const SCENARIOS = [
    {
      label: 'E₁',
      desc: 'Eleger Presidente, Vice-Presidente e Secretário de uma turma com 15 alunos. Cada aluno pode ocupar apenas <strong>um cargo</strong>.',
      tipo: 'simples',
      formula: 'A(15, 3) = 15 × 14 × 13 = 2.730'
    },
    {
      label: 'E₂',
      desc: 'Criar um código de segurança de <strong>4 dígitos</strong> usando algarismos de 0 a 9, onde o <strong>mesmo dígito pode aparecer mais de uma vez</strong>.',
      tipo: 'repeticao',
      formula: 'AR(10, 4) = 10⁴ = 10.000'
    },
    {
      label: 'E₃',
      desc: 'Distribuir as <strong>5 primeiras colocações</strong> em uma corrida com 8 atletas. Não há empate — <strong>cada posição pertence a um atleta diferente</strong>.',
      tipo: 'simples',
      formula: 'A(8, 5) = 8 × 7 × 6 × 5 × 4 = 6.720'
    }
  ];

  let answers = SCENARIOS.map(() => ({ simples: false, repeticao: false }));

  function draw(msg = '') {
    const blocks = SCENARIOS.map((sc, idx) => {
      const ans = answers[idx];
      return `
        <div class="rel-block">
          <h3>${sc.label}</h3>
          <p>${sc.desc}</p>
          <div class="rel-checks">
            <label><input type="checkbox" ${ans.simples ? 'checked' : ''}
              onchange="window._c5Toggle(${idx}, 'simples')"> Arranjo Simples (sem repetição)</label>
            <label><input type="checkbox" ${ans.repeticao ? 'checked' : ''}
              onchange="window._c5Toggle(${idx}, 'repeticao')"> Arranjo com Repetição</label>
            <div class="rel-eq">
              ${ans.simples && ans.repeticao
                ? '<small style="color:#b04a2f">Escolha apenas UM tipo.</small>'
                : (!ans.simples && !ans.repeticao
                    ? '<small style="opacity:0.5">(selecione o tipo de arranjo)</small>'
                    : '')}
            </div>
          </div>
        </div>
      `;
    }).join('');

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓎛 Câmara do Discernimento</h2>
        <p>
          Três enigmas foram gravados nas paredes. Para cada um, classifique
          se trata de um <strong>Arranjo Simples</strong> ou de um
          <strong>Arranjo com Repetição</strong>.
        </p>
        <div class="tip">
          <ul style="margin: 6px 0 0 20px;">
            <li><strong>Arranjo Simples A(n,p)</strong>: a ordem importa e os elementos <em>não se repetem</em>. Fórmula: n!/(n−p)!</li>
            <li><strong>Arranjo com Repetição AR(n,p)</strong>: a ordem importa e os elementos <em>podem se repetir</em>. Fórmula: nᵖ</li>
          </ul>
        </div>
        ${blocks}
        ${msg}
        <div class="row">
          <button onclick="window._c5Check()">Confirmar Tudo</button>
          <button class="secondary" onclick="window._c5Reset()">Limpar</button>
        </div>
      </div>
    `);
  }

  function drawSolved() {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓎛 Câmara do Discernimento — Concluída ✓</h2>
        ${feedback('𓋹 Você classificou corretamente todos os enigmas!', 'ok')}
        ${pointsBanner(30)}
        <ul>
          ${SCENARIOS.map(sc => `
            <li><strong>${sc.label}</strong>:
              ${sc.tipo === 'simples' ? 'Arranjo Simples' : 'Arranjo com Repetição'}
              — <code>${sc.formula}</code></li>
          `).join('')}
        </ul>
        ${chamberFooterSolved('c5')}
      </div>
    `);
  }

  window._c5Toggle = (idx, prop) => {
    answers[idx][prop] = !answers[idx][prop];
    draw();
  };
  window._c5Reset = () => {
    answers = SCENARIOS.map(() => ({ simples: false, repeticao: false }));
    draw();
  };
  window._c5Check = () => {
    for (let i = 0; i < SCENARIOS.length; i++) {
      const sc = SCENARIOS[i];
      const ans = answers[i];
      if (ans.simples && ans.repeticao) {
        draw(feedback(`${sc.label}: escolha apenas UM tipo de arranjo.`, 'err'));
        return;
      }
      if (!ans.simples && !ans.repeticao) {
        draw(feedback(`${sc.label}: você ainda não classificou este cenário.`, 'err'));
        return;
      }
      const tipoMarcado = ans.simples ? 'simples' : 'repeticao';
      if (tipoMarcado !== sc.tipo) {
        draw(feedback(`${sc.label}: classificação incorreta. Pergunte-se: neste cenário o mesmo elemento pode reaparecer? Se sim, é com repetição; se cada elemento é usado uma única vez, é simples. Releia e tente de novo.`, 'err'));
        return;
      }
    }
    completeChamber(30);
    drawSolved();
  };

  draw();
}

/* ============================================================
   CÂMARA 6 — Do Oráculo: questão discursiva (Item 3)
   O jogador explica o raciocínio e escreve as duas respostas (60 e 125).
   ============================================================ */

function chamberDiscursive() {
  let lastText = '';

  function draw(msg = '') {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓁢 Câmara do Oráculo</h2>
        <p>
          O Oráculo observa em silêncio. Diante de você, <strong>5 hieróglifos
          distintos</strong>: 𓀀 𓀁 𓀂 𓀃 𓀄. Você deve gravar uma <strong>sequência de
          3 deles</strong> em uma tábua sagrada.
        </p>
        <div class="question-box">
          <p style="margin:0 0 8px;"><strong>(a)</strong> Quantas sequências distintas são possíveis se <strong>nenhum</strong> hieróglifo puder se repetir?</p>
          <p style="margin:0;"><strong>(b)</strong> E quantas sequências são possíveis se a <strong>repetição</strong> for permitida?</p>
        </div>
        <div class="tip">
          <strong>Pense:</strong> no item (a), "a ordem importa e nada se repete" — qual fórmula é essa?
          No item (b), "a ordem importa e pode repetir" — qual é a outra?
          Escreva seu raciocínio e <strong>inclua os dois números</strong> que você encontrou.
        </div>
        <div class="discursive">
          <textarea id="oracleAnswer" rows="6"
            placeholder="Ex.: No item (a) usei o Arranjo Simples porque... e cheguei a ___. No item (b) usei o Arranjo com Repetição porque... e cheguei a ___."
            oninput="window._oracleInput(this.value)">${lastText}</textarea>
        </div>
        ${msg}
        <div class="row">
          <button onclick="window._oracleCheck()">Consultar o Oráculo</button>
          <button class="secondary" onclick="goMenu()">Voltar ao Mapa</button>
        </div>
      </div>
    `);
  }

  function drawSolved() {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓁢 Câmara do Oráculo — Concluída ✓</h2>
        ${feedback('𓋹 O Oráculo aprova seu raciocínio!', 'ok')}
        ${pointsBanner(25)}
        <div class="tip">
          <strong>Resposta modelo:</strong><br>
          <strong>(a) Sem repetição → Arranjo Simples:</strong> A(5, 3) = 5 × 4 × 3 = <strong>60</strong> sequências.<br>
          <strong>(b) Com repetição → Arranjo com Repetição:</strong> AR(5, 3) = 5³ = <strong>125</strong> sequências.
        </div>
        ${chamberFooterSolved('c6')}
      </div>
    `);
  }

  window._oracleInput = v => { lastText = v; };
  window._oracleCheck = () => {
    const text = (lastText || '').toLowerCase();
    const nums = text.match(/\d+/g) || [];
    const has60 = nums.includes('60');
    const has125 = nums.includes('125');

    if (has60 && has125) {
      completeChamber(25);
      drawSolved();
      return;
    }
    // Dicas SEM revelar os números (Item 5)
    let dica;
    if (!has60 && !has125) {
      dica = 'O Oráculo ainda não vê as duas respostas. No item (a) use o Arranjo Simples (multiplique os 3 fatores decrescentes a partir do 5). No item (b) use o Arranjo com Repetição (multiplique o 5 por ele mesmo três vezes). Escreva os dois números que encontrar.';
    } else if (!has60) {
      dica = 'Falta o item (a). Sem repetição, use o Arranjo Simples: multiplique os 3 primeiros fatores decrescentes a partir do 5 e registre o resultado.';
    } else {
      dica = 'Falta o item (b). Com repetição, use o Arranjo com Repetição: multiplique o 5 por ele mesmo três vezes (5³) e registre o resultado.';
    }
    draw(feedback(dica, 'err'));
  };

  draw();
}

/* ============================================================
   CÂMARA 7 — Do Faraó: Quiz Final (10 de 20)
   ============================================================ */

function chamberFinalIntro() {
  clearAuto();
  state.quizQuestions = shuffle(QUESTION_BANK).slice(0, 10);
  state.quizIndex = 0;
  state.quizCorrect = 0;
  state.quizPoints = 0; // recomeça a contagem do quiz; o topo sobe a cada acerto

  render(`
    ${hud()}
    <div class="scroll">
      <h2>𓁹 Câmara do Faraó</h2>
      <p>
        A última porta se abre. O <strong>Faraó</strong>, sentado em seu trono dourado,
        ergue a mão. "Provaste tua dedicação, Dr. Aalim. Agora, responde a
        <strong>dez perguntas</strong> sobre os Arranjos Sagrados. Acertando ao menos
        <strong>sete</strong>, terás minha bênção."
      </p>
      <div class="tip">
        São 10 questões sorteadas aleatoriamente de um banco com <strong>20 perguntas</strong>
        sobre <strong>Arranjo Simples</strong> e <strong>Arranjo com Repetição</strong>.
        Cada acerto vale <strong>2 pontos</strong>.
      </div>
      <div class="center"><button onclick="quizNext()">Iniciar o Julgamento 𓁿</button></div>
    </div>
  `);
}

function quizNext() {
  clearAuto();
  if (state.quizIndex >= state.quizQuestions.length) return quizEnd();
  const q = state.quizQuestions[state.quizIndex];
  const alts = q.alternativas.map((a, i) => `
    <button class="alt-btn" onclick="quizAnswer(${i})" id="alt-${i}">${String.fromCharCode(65 + i)}) ${a}</button>
  `).join('');

  render(`
    ${hud()}
    <div class="scroll">
      <h2>𓁹 Pergunta ${state.quizIndex + 1} de ${state.quizQuestions.length}</h2>
      <p style="text-align:right; opacity:0.7;">Tema: <em>${q.topico}</em> · Acertos: <strong>${state.quizCorrect}</strong></p>
      <div class="question-box">${q.enunciado}</div>
      <div class="alternatives">${alts}</div>
    </div>
  `);
}

function quizAnswer(i) {
  const q = state.quizQuestions[state.quizIndex];
  const correct = q.correta;
  for (let k = 0; k < q.alternativas.length; k++) {
    const btn = document.getElementById(`alt-${k}`);
    if (!btn) continue;
    btn.disabled = true;
    if (k === correct) btn.classList.add('correct');
    else if (k === i) btn.classList.add('wrong');
  }

  const acertou = i === correct;
  if (acertou) {
    state.quizCorrect++;
    // Item 5 — pontuação do topo sempre atualizada junto com os acertos.
    state.quizPoints = state.quizCorrect * 2;
    const scoreEl = document.querySelector('.hud .score');
    if (scoreEl) scoreEl.innerHTML = `★ Pontos: ${totalScore()}`;
  }

  const scroll = document.querySelector('.scroll');

  const explBox = document.createElement('div');
  explBox.className = `feedback ${acertou ? 'ok' : 'err'}`;
  explBox.innerHTML = (acertou ? '𓋹 Correto! ' : '✗ Incorreto. ') + q.explicacao;
  scroll.appendChild(explBox);

  const isLast = state.quizIndex === state.quizQuestions.length - 1;

  if (acertou) {
    // Item 7 — mostra pontos ganhos + total e avança sozinho em 3s.
    const banner = document.createElement('div');
    banner.className = 'points-banner';
    banner.innerHTML =
      `<span class="pts-plus">+2 pontos</span>
       <span class="pts-total">Pontuação total: <strong>${totalScore()}</strong></span>`;
    scroll.appendChild(banner);

    const adv = document.createElement('div');
    adv.className = 'auto-advance';
    adv.innerHTML =
      `<span class="auto-msg">Avançando automaticamente em 3 segundos…</span>
       <button onclick="quizAdvance()">${isLast ? 'Ver resultado agora 𓁿' : 'Próxima pergunta agora →'}</button>`;
    scroll.appendChild(adv);

    scheduleAuto(quizAdvance);
  } else {
    // Em caso de erro NÃO avança sozinho: o jogador lê a explicação com calma.
    const next = document.createElement('div');
    next.className = 'center';
    next.style.marginTop = '14px';
    next.innerHTML = `<button onclick="quizAdvance()">${isLast ? 'Ver Resultado 𓁿' : 'Próxima Pergunta →'}</button>`;
    scroll.appendChild(next);
  }
}

function quizAdvance() {
  clearAuto();
  state.quizIndex++;
  if (state.quizIndex >= state.quizQuestions.length) quizEnd();
  else quizNext();
}

function quizEnd() {
  clearAuto();
  const total = state.quizQuestions.length;
  const acertos = state.quizCorrect;
  const pontosQuiz = acertos * 2;
  const aprovado = acertos >= 7;

  // Item 9 (correção de bug) — substitui, não acumula, evitando inflar a pontuação.
  state.quizPoints = pontosQuiz;
  if (aprovado) state.completed.add('c7');
  saveState();

  const venceuTudo = allDone();

  render(`
    ${hud()}
    <div class="scroll">
      <h2>𓁿 Julgamento do Faraó</h2>
      <div class="score-card">
        Você acertou
        <span class="big">${acertos} / ${total}</span>
        e ganhou <strong>${pontosQuiz} pontos</strong> nesta câmara.
      </div>

      ${aprovado
        ? `<div class="feedback ok">
             𓋹 <strong>O Faraó concede sua bênção!</strong> Você dominou os segredos dos
             Arranjos. A pirâmide se ilumina e os hieróglifos cantam seu nome.
           </div>`
        : `<div class="feedback err">
             O Faraó balança a cabeça. "Volta quando estiveres mais preparado."
             Você precisa de pelo menos <strong>7 acertos</strong> para ser aprovado. Tente novamente!
           </div>`}

      <p style="margin-top:18px;">
        <strong>Pontuação total: ${totalScore()}</strong> · Câmaras concluídas:
        ${state.completed.size}/${CHAMBERS.length}
      </p>

      ${venceuTudo
        ? `<div class="victory-cta">
             <button onclick="window._goVictory()">𓋹 Entrar na Câmara do Tesouro 𓋹</button>
           </div>`
        : ''}

      <div class="row">
        <button onclick="chamberFinalIntro()">Tentar o Quiz Novamente</button>
        <button class="secondary" onclick="goMenu()">Voltar ao Mapa</button>
      </div>
    </div>
  `);
}

/* ============================================================
   TELA FINAL — Câmara do Tesouro (Item 10)
   ============================================================ */

function showVictory() {
  clearAuto();
  state.currentChamber = null;

  const breakdown = CHAMBERS.map(c => {
    const done = state.completed.has(c.id);
    return `<li><span class="glyph-mini">${c.glyph}</span> ${c.title}
      <span class="bd-status ${done ? 'ok' : 'no'}">${done ? '✓ concluída' : '— pendente'}</span></li>`;
  }).join('');

  render(`
    <div class="scroll victory">
      <div class="vic-glyphs">𓂀 𓊪 𓊃 𓋹 𓎛 𓁢 𓁹</div>
      <h1 class="vic-title">𓁿 O Enigma foi Decifrado! 𓁿</h1>
      <p class="vic-sub">
        Dr. Aalim, você atravessou todas as sete câmaras da pirâmide e desvendou
        os segredos dos <strong>Arranjos</strong>. Os antigos escribas honram seu nome.
      </p>

      <div class="score-card vic-score">
        Pontuação final
        <span class="big">${totalScore()}</span>
        pontos
      </div>

      <h3 class="center">𓉴 Sua jornada 𓉴</h3>
      <ul class="victory-breakdown">${breakdown}</ul>

      <p class="center vic-instruction">Toque no selo de Hórus para revelar o tesouro do Faraó:</p>
      <div class="center">
        <div id="sarcophagus" class="sarcophagus" onclick="window._revealTreasure()">𓂀</div>
      </div>
      <div id="treasure" class="treasure"></div>

      <div class="row" style="margin-top:24px;">
        <button class="secondary" onclick="goMenu()">Voltar ao Mapa</button>
        <button class="danger" onclick="resetGame()">Jogar Novamente do Início</button>
      </div>
    </div>
  `);
}

window._revealTreasure = () => {
  const sarc = document.getElementById('sarcophagus');
  const box = document.getElementById('treasure');
  if (!box) return;
  if (sarc) sarc.classList.add('opened');
  box.classList.add('show');
  box.innerHTML = `
    <div class="treasure-burst">𓋹 𓂀 𓋹 𓂀 𓋹</div>
    <p>
      O selo se rompe e uma luz dourada preenche a câmara. Diante de você,
      um papiro eterno declara:
    </p>
    <blockquote>
      "Quem entende a <strong>ordem</strong> e a <strong>repetição</strong> detém o poder de
      contar o incontável. Que tua sabedoria, Dr. Aalim, jamais se perca nas areias do tempo."
    </blockquote>
    <p class="center"><strong>𓁿 Parabéns! Você concluiu O Enigma do Escriba. 𓁿</strong></p>
  `;
};

/* ============================================================
   Inicialização
   ============================================================ */

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  showMenu();
});
window.goMenu = goMenu;
window.enterChamber = enterChamber;
window.chamberFinalIntro = chamberFinalIntro;
window.quizNext = quizNext;
window.quizAnswer = quizAnswer;
window.quizAdvance = quizAdvance;
window.showVictory = showVictory;
