/* ============================================================
   Hieróglifos — O Enigma do Escriba
   Jogo educativo sobre Matemática Discreta — Arranjos
   ============================================================ */

const app = document.getElementById('app');

const state = {
  completed: new Set(),
  score: 0,
  quizQuestions: [],
  quizIndex: 0,
  quizCorrect: 0,
  currentChamber: null
};

const CHAMBERS = [
  { id: 'c1', glyph: '𓂀', title: 'Câmara do Escriba',
    subtitle: 'Conceito de Arranjo — A Ordem Importa' },
  { id: 'c2', glyph: '𓊪', title: 'Câmara do Hierofante',
    subtitle: 'Arranjo Simples: A(n,p) = n! / (n−p)!' },
  { id: 'c3', glyph: '𓊃', title: 'Câmara do Contador',
    subtitle: 'Arranjo com Repetição: AR(n,p) = nᵖ' },
  { id: 'c4', glyph: '𓋹', title: 'Câmara dos Mistérios',
    subtitle: 'Problemas Aplicados de Arranjo' },
  { id: 'c5', glyph: '𓎛', title: 'Câmara das Relações',
    subtitle: 'Simples ou Com Repetição? Classifique!' },
  { id: 'c6', glyph: '𓁹', title: 'Câmara do Faraó',
    subtitle: 'Quiz final (10 de 20 questões sobre Arranjos)' }
];

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

function render(html) { app.innerHTML = html; }

function hud() {
  const total = CHAMBERS.length;
  const done = state.completed.size;
  return `
    <div class="hud">
      <div>𓉴 Câmaras: <strong>${done}/${total}</strong></div>
      <div class="score">★ Pontos: ${state.score}</div>
      <div><button class="secondary" onclick="goMenu()">Mapa da Pirâmide</button></div>
    </div>
  `;
}

function feedback(msg, type='info') {
  return `<div class="feedback ${type}">${msg}</div>`;
}

function nextChamberId(currentId) {
  const idx = CHAMBERS.findIndex(c => c.id === currentId);
  return (idx >= 0 && idx < CHAMBERS.length - 1) ? CHAMBERS[idx + 1].id : null;
}

function chamberFooterSolved(chamberId) {
  const next = nextChamberId(chamberId);
  const nextLabel = next
    ? `Próxima: ${CHAMBERS.find(c => c.id === next).title} →`
    : null;
  return `<div class="row" style="margin-top: 18px;">
    ${next ? `<button onclick="enterChamber('${next}')">${nextLabel}</button>` : ''}
    <button class="secondary" onclick="goMenu()">Voltar ao Mapa</button>
  </div>`;
}

function completeChamber(points) {
  if (!state.completed.has(state.currentChamber)) {
    state.completed.add(state.currentChamber);
    state.score += points;
  }
}

/* ============================================================
   TELA: Menu / Enredo
   ============================================================ */

function showMenu() {
  state.currentChamber = null;
  const cards = CHAMBERS.map((c, i) => {
    const prev = i === 0 ? true : state.completed.has(CHAMBERS[i-1].id);
    const done = state.completed.has(c.id);
    const locked = !prev && !done && c.id !== 'c6';
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
      <div class="hieroglyph-row">𓂀 𓊪 𓊃 𓋹 𓎛 𓁹</div>
      <h2 style="text-align:center;">O Enigma do Escriba</h2>

      <p>
        <strong>Cairo, 1922.</strong> Você é <em>Dr. Aalim</em>, um arqueólogo que acaba
        de descobrir uma pirâmide esquecida nas areias de Saqqara. No interior, seis
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
        <strong>Como jogar:</strong> clique em uma câmara desbloqueada para entrar.
        Cada câmara possui dois desafios. Você pode revisitar câmaras já
        concluídas a qualquer momento.
      </div>

      <h3 style="text-align:center; margin-top:24px;">𓉴 Mapa da Pirâmide 𓉴</h3>
      <div class="chamber-map">${cards}</div>

      <div class="spacer"></div>
      <div class="center">
        <strong>Pontuação atual: ${state.score}</strong>
        ${state.completed.size === CHAMBERS.length
          ? `<div class="feedback ok">𓁿 Você completou TODAS as câmaras! O Faraó honra sua sabedoria.</div>`
          : ''}
      </div>
    </div>
  `);
}

function goMenu() { showMenu(); }

function enterChamber(id) {
  state.currentChamber = id;
  switch (id) {
    case 'c1': return chamberC1();
    case 'c2': return chamberC2();
    case 'c3': return chamberC3();
    case 'c4': return chamberC4();
    case 'c5': return chamberC5();
    case 'c6': return chamberFinalIntro();
  }
}

/* ============================================================
   CÂMARA 1 — Escriba: Conceito de Arranjo
   2 estágios:
     1. Selecionar todos os pares ordenados válidos de A(3,2) de {A,B,C}
     2. Múltipla escolha: calcular A(5,3)
   ============================================================ */

function chamberC1() {
  const allPairs = ['AB','BA','AC','CA','BC','CB','AA','BB','CC'];
  const correctPairs = new Set(['AB','BA','AC','CA','BC','CB']);
  let chosen = new Set();
  let stage1Done = false;

  function drawStage1(msg='') {
    const elems = allPairs.map(p => `
      <span class="element ${chosen.has(p) ? 'selected' : ''} ${stage1Done ? 'disabled' : ''}"
            onclick="${stage1Done ? '' : `window._c1Click('${p}')`}"
            style="min-width:50px; font-family:monospace;">${p}</span>
    `).join('');

    const actionRow = stage1Done
      ? `<div class="row"><button onclick="window._c1ToStage2()">Avançar para Estágio 2 →</button></div>`
      : `<div class="row">
           <button onclick="window._c1Check()">Confirmar</button>
           <button class="secondary" onclick="window._c1Reset()">Limpar</button>
         </div>`;

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓂀 Câmara do Escriba — Estágio 1/2</h2>
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
        <div class="elements-pool">${elems}</div>
        ${msg}
        ${actionRow}
      </div>
    `);
  }

  function drawStage2(msg='') {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓂀 Câmara do Escriba — Estágio 2/2</h2>
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
          ${[10, 20, 60, 120].map((v, i) =>
            `<button class="alt-btn" onclick="window._c1Ans2(${v})">${String.fromCharCode(65+i)}) ${v}</button>`
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
        <h2>𓂀 Câmara do Escriba — Concluída ✓</h2>
        ${feedback('𓋹 Excelente, Dr. Aalim! Você compreendeu a essência dos Arranjos. +20 pontos.', 'ok')}
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
    } else {
      drawStage1(feedback('Ainda não. Lembre: a ordem importa (AB ≠ BA) e elementos NÃO se repetem (AA é inválido).', 'err'));
    }
  };
  window._c1ToStage2 = () => drawStage2();
  window._c1Ans2 = v => {
    if (v === 60) {
      completeChamber(20);
      drawSolved();
    } else {
      drawStage2(feedback('Não. A(5,3) = 5 × 4 × 3 = 60. Multiplique os 3 fatores decrescentes a partir de 5.', 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 2 — Hierofante: Arranjo Simples A(n,p)
   2 estágios:
     1. Múltipla escolha — pódio com 7 atletas, A(7,3)
     2. Multi-seleção — identificar pares ordenados válidos de A(4,2)
   ============================================================ */

function chamberC2() {
  let stage1Done = false;

  function drawStage1(msg='') {
    const altsHtml = stage1Done
      ? `<div class="row"><button onclick="window._c2ToStage2()">Avançar para Estágio 2 →</button></div>`
      : `<div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[35, 105, 210, 840].map((v, i) =>
            `<button class="alt-btn" onclick="window._c2Ans1(${v})">${String.fromCharCode(65+i)}) ${v}</button>`
          ).join('')}
        </div>`;

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊪 Câmara do Hierofante — Estágio 1/2</h2>
        <p>
          Sete escribas se inscrevem em uma competição de caligrafia.
          O júri definirá o <strong>1º, 2º e 3º lugares</strong> (posições distintas,
          uma pessoa por posição).
        </p>
        <div class="tip">
          <strong>A(7, 3) = 7! / (7−3)! = 7 × 6 × 5</strong><br>
          Usamos Arranjo Simples pois a <strong>ordem importa</strong> (1º ≠ 2º lugar)
          e <strong>não há repetição</strong> (um escriba não ocupa dois lugares).
        </div>
        <p class="center"><strong>Desafio:</strong> Quantos pódios distintos são possíveis?</p>
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

  function drawStage2(msg='') {
    const opts = pairCandidates.map(p => `
      <span class="element ${chosenPairs.has(p.id) ? 'selected' : ''}"
            onclick="window._c2PairClick(${p.id})"
            style="min-width:70px; font-family:monospace;">${p.label}</span>
    `).join('');

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊪 Câmara do Hierofante — Estágio 2/2</h2>
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
        <h2>𓊪 Câmara do Hierofante — Concluída ✓</h2>
        ${feedback('𓋹 Sabedoria comprovada! Você domina o Arranjo Simples. +25 pontos.', 'ok')}
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
    } else {
      drawStage1(feedback('Não. A(7, 3) = 7 × 6 × 5. Multiplique os 3 fatores decrescentes a partir de 7.', 'err'));
    }
  };
  window._c2ToStage2 = () => drawStage2();
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
      const err = pairCandidates.find(p => chosenPairs.has(p.id) !== p.valid);
      const hint = err
        ? `Reveja <code>${err.label}</code>: ${err.valid ? 'é válido (elementos distintos).' : 'não é válido (elemento repetido).'}`
        : '';
      drawStage2(feedback(`Não está certo. ${hint}`, 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 3 — Contador: Arranjo com Repetição AR(n,p)
   2 estágios com múltipla escolha:
     1. AR(4,2) = 16
     2. AR(10,3) = 1000
   ============================================================ */

function chamberC3() {
  let stage1Done = false;

  function drawStage1(msg='') {
    const altsHtml = stage1Done
      ? `<div class="row"><button onclick="window._c3ToStage2()">Avançar para Estágio 2 →</button></div>`
      : `<div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[8, 12, 16, 24].map((v, i) =>
            `<button class="alt-btn" onclick="window._c3Ans1(${v})">${String.fromCharCode(65+i)}) ${v}</button>`
          ).join('')}
        </div>`;

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊃 Câmara do Contador — Estágio 1/2</h2>
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

  function drawStage2(msg='') {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊃 Câmara do Contador — Estágio 2/2</h2>
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
          ${[30, 720, 1000, 5040].map((v, i) =>
            `<button class="alt-btn" onclick="window._c3Ans2(${v})">${String.fromCharCode(65+i)}) ${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</button>`
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
        <h2>𓊃 Câmara do Contador — Concluída ✓</h2>
        ${feedback('𓋹 Você dominou o Arranjo com Repetição! +25 pontos.', 'ok')}
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
    } else {
      drawStage1(feedback('Não. AR(n, p) = nᵖ. Portanto AR(4, 2) = 4² = 16.', 'err'));
    }
  };
  window._c3ToStage2 = () => drawStage2();
  window._c3Ans2 = v => {
    if (v === 1000) {
      completeChamber(25);
      drawSolved();
    } else {
      drawStage2(feedback('Não. AR(10, 3) = 10³ = 1.000.', 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 4 — Mistérios: Problemas Aplicados de Arranjo
   2 estágios com múltipla escolha:
     1. A(10,4) = 5040 (galeria de pinturas)
     2. AR(5,3) = 125 (nichos sagrados)
   ============================================================ */

function chamberC4() {
  let stage1Done = false;

  function drawStage1(msg='') {
    const altsHtml = stage1Done
      ? `<div class="row"><button onclick="window._c4ToStage2()">Avançar para Estágio 2 →</button></div>`
      : `<div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[210, 1260, 5040, 10000].map((v, i) =>
            `<button class="alt-btn" onclick="window._c4Ans1(${v})">${String.fromCharCode(65+i)}) ${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</button>`
          ).join('')}
        </div>`;

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓋹 Câmara dos Mistérios — Estágio 1/2</h2>
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

  function drawStage2(msg='') {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓋹 Câmara dos Mistérios — Estágio 2/2</h2>
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
          ${[15, 60, 125, 243].map((v, i) =>
            `<button class="alt-btn" onclick="window._c4Ans2(${v})">${String.fromCharCode(65+i)}) ${v}</button>`
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
        <h2>𓋹 Câmara dos Mistérios — Concluída ✓</h2>
        ${feedback('𓋹 Os mistérios dos Arranjos foram revelados! +30 pontos.', 'ok')}
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
    } else {
      drawStage1(feedback('Não. Calcule A(10, 4) = 10 × 9 × 8 × 7.', 'err'));
    }
  };
  window._c4ToStage2 = () => drawStage2();
  window._c4Ans2 = v => {
    if (v === 125) {
      completeChamber(30);
      drawSolved();
    } else {
      drawStage2(feedback('Não. AR(5, 3) = 5³ = 125.', 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 5 — Classificação: Simples ou Com Repetição?
   3 cenários para classificar interativamente
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

  function draw(msg='') {
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
        <h2>𓎛 Câmara das Relações</h2>
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
        <h2>𓎛 Câmara das Relações — Concluída ✓</h2>
        ${feedback('𓋹 Você classificou corretamente todos os enigmas! +30 pontos.', 'ok')}
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
        draw(feedback(`${sc.label}: classificação incorreta. Releia o enunciado com atenção.`, 'err'));
        return;
      }
    }
    completeChamber(30);
    drawSolved();
  };

  draw();
}

/* ============================================================
   CÂMARA 6 — Quiz Final (10 de 20 questões sobre Arranjos)
   ============================================================ */

function chamberFinalIntro() {
  state.quizQuestions = shuffle(QUESTION_BANK).slice(0, 10);
  state.quizIndex = 0;
  state.quizCorrect = 0;

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
  if (state.quizIndex >= state.quizQuestions.length) return quizEnd();
  const q = state.quizQuestions[state.quizIndex];
  const alts = q.alternativas.map((a, i) => `
    <button class="alt-btn" onclick="quizAnswer(${i})" id="alt-${i}">${String.fromCharCode(65+i)}) ${a}</button>
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
    else if (k === i)  btn.classList.add('wrong');
  }
  if (i === correct) state.quizCorrect++;

  const explBox = document.createElement('div');
  explBox.className = `feedback ${i === correct ? 'ok' : 'err'}`;
  explBox.innerHTML = (i === correct ? '𓋹 Correto! ' : '✗ Incorreto. ') + q.explicacao;
  document.querySelector('.scroll').appendChild(explBox);

  const next = document.createElement('div');
  next.className = 'center';
  next.style.marginTop = '14px';
  const isLast = state.quizIndex === state.quizQuestions.length - 1;
  next.innerHTML = `<button onclick="quizAdvance()">${isLast ? 'Ver Resultado 𓁿' : 'Próxima Pergunta →'}</button>`;
  document.querySelector('.scroll').appendChild(next);
}

function quizAdvance() {
  state.quizIndex++;
  if (state.quizIndex >= state.quizQuestions.length) quizEnd();
  else quizNext();
}

function quizEnd() {
  const total = state.quizQuestions.length;
  const acertos = state.quizCorrect;
  const pontosQuiz = acertos * 2;
  const aprovado = acertos >= 7;

  if (aprovado && !state.completed.has('c6')) {
    state.completed.add('c6');
  }
  state.score += pontosQuiz;

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
        <strong>Pontuação total: ${state.score}</strong> · Câmaras concluídas:
        ${state.completed.size}/${CHAMBERS.length}
      </p>

      <div class="row">
        <button onclick="chamberFinalIntro()">Tentar o Quiz Novamente</button>
        <button class="secondary" onclick="goMenu()">Voltar ao Mapa</button>
      </div>
    </div>
  `);
}

/* ============================================================
   Inicialização
   ============================================================ */

window.addEventListener('DOMContentLoaded', showMenu);
window.goMenu = goMenu;
window.enterChamber = enterChamber;
window.chamberFinalIntro = chamberFinalIntro;
window.quizNext = quizNext;
window.quizAnswer = quizAnswer;
window.quizAdvance = quizAdvance;
