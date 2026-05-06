/* ============================================================
   Hieróglifos — O Enigma do Escriba
   Jogo educativo sobre Matemática Discreta
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
    subtitle: 'Definição, União e Interseção' },
  { id: 'c2', glyph: '𓊪', title: 'Câmara do Hierofante',
    subtitle: 'Complemento, Subconjuntos e Diferença' },
  { id: 'c3', glyph: '𓊃', title: 'Câmara do Contador',
    subtitle: 'Cardinalidade e Conjunto das Partes' },
  { id: 'c4', glyph: '𓋹', title: 'Câmara dos Mistérios',
    subtitle: 'Diagrama de Venn e Inclusão-Exclusão' },
  { id: 'c5', glyph: '𓎛', title: 'Câmara das Relações',
    subtitle: 'Reflexiva, Simétrica, Transitiva, Equivalência' },
  { id: 'c6', glyph: '𓁹', title: 'Câmara do Faraó',
    subtitle: 'Quiz final (16 questões)' }
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

function fmtSet(arr) {
  if (arr.length === 0) return '∅';
  return '{ ' + [...arr].sort((a,b)=>a-b).join(', ') + ' }';
}

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
    const locked = !prev && !done;
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
        câmaras seladas guardam o saber matemático dos antigos escribas — desde a
        <strong>arte dos conjuntos</strong> até as <strong>combinações sagradas</strong>.
      </p>
      <p>
        Para abrir cada câmara, você precisará decifrar enigmas cada vez mais difíceis.
        Ao fim, o próprio Faraó testará sua sabedoria com um julgamento de 16 perguntas.
      </p>

      <div class="tip">
        <strong>Como jogar:</strong> clique em uma câmara desbloqueada para entrar.
        Cada câmara possui dois ou três desafios. Você pode revisitar câmaras já
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
   Diagrama de Venn (SVG) — 2 conjuntos com sobreposição real
   ============================================================ */

function vennSVG(A, B, opts={}) {
  const setA = new Set(A);
  const setB = new Set(B);
  const onlyA = [...setA].filter(x => !setB.has(x));
  const onlyB = [...setB].filter(x => !setA.has(x));
  const both  = [...setA].filter(x => setB.has(x));

  const highlight = opts.highlight || null;
  const click = opts.click || null;
  const labelA = opts.labelA || 'A';
  const labelB = opts.labelB || 'B';

  function regionClass(name) {
    let c = 'venn-region';
    if (highlight === name) c += ' active';
    if (highlight === 'union' && (name === 'onlyA' || name === 'onlyB' || name === 'both')) c += ' active';
    return c;
  }

  const onA    = click ? `onclick="${click}('onlyA')" style="cursor:pointer"` : '';
  const onB    = click ? `onclick="${click}('onlyB')" style="cursor:pointer"` : '';
  const onBoth = click ? `onclick="${click}('both')"  style="cursor:pointer"` : '';

  // Geometria: A = (140,140) r=85 ; B = (260,140) r=85
  // Pontos de interseção: (200, 80) e (200, 200)
  const circleA = "M 55,140 a 85,85 0 1,0 170,0 a 85,85 0 1,0 -170,0 Z";
  const circleB = "M 175,140 a 85,85 0 1,0 170,0 a 85,85 0 1,0 -170,0 Z";
  const lens    = "M 200,80 A 85,85 0 0,1 200,200 A 85,85 0 0,1 200,80 Z";

  // Layout linear de elementos em cada região
  function placeText(items, cx, cy, color) {
    const N = items.length;
    if (N === 0) return '';
    const spacing = N === 1 ? 0 : Math.min(28, 70 / N);
    return items.map((it, i) => {
      const x = cx + (i - (N - 1) / 2) * spacing;
      const y = cy + 5;
      return `<text class="venn-element" x="${x}" y="${y}" fill="${color}">${it}</text>`;
    }).join('');
  }

  return `
    <div class="venn-wrap">
      <svg class="venn-svg" viewBox="0 0 400 280" width="100%" style="max-width:480px;">
        <!-- Universo -->
        <rect x="10" y="10" width="380" height="260" fill="#fff8e0"
              stroke="#8b6a3a" stroke-width="2" stroke-dasharray="6,4"/>
        <text x="375" y="28" text-anchor="end" font-size="14"
              fill="#8b6a3a" font-style="italic">U</text>

        <!-- Apenas A (crescente esquerdo) -->
        <path d="${circleA} ${lens}" fill-rule="evenodd"
              class="${regionClass('onlyA')}"
              fill="#1f4e79" stroke="#1f4e79" ${onA} />

        <!-- Apenas B (crescente direito) -->
        <path d="${circleB} ${lens}" fill-rule="evenodd"
              class="${regionClass('onlyB')}"
              fill="#b04a2f" stroke="#b04a2f" ${onB} />

        <!-- Interseção (lente) -->
        <path d="${lens}"
              class="${regionClass('both')}"
              fill="#7a3b9b" stroke="#5a2378" ${onBoth} />

        <!-- Rótulos -->
        <text class="venn-label" x="80"  y="50" fill="#1f4e79">${labelA}</text>
        <text class="venn-label" x="320" y="50" fill="#b04a2f">${labelB}</text>

        <!-- Elementos -->
        ${placeText(onlyA, 95,  140, '#fff')}
        ${placeText(both,  200, 140, '#fff')}
        ${placeText(onlyB, 305, 140, '#fff')}
      </svg>
    </div>
  `;
}

/* ============================================================
   CÂMARA 1 — Escriba: Definição, União e Interseção
   2 estágios:
     1. Selecionar A ∪ B no universo
     2. Clicar na região correta do Venn (interseção)
   ============================================================ */

function chamberC1() {
  let stage = 1;
  let stage1Done = false;
  let stage2Done = false;
  let chosen = new Set();
  let attempts = 0;
  let solved = false;

  const A = [1, 2, 3, 4, 5];
  const B = [4, 5, 6, 7, 8];
  const universe = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const targetUnion = new Set([1, 2, 3, 4, 5, 6, 7, 8]);

  function drawStage1(msg='') {
    const elems = universe.map(n => `
      <span class="element ${chosen.has(n) ? 'selected' : ''}" onclick="window._c1Click(${n})">${n}</span>
    `).join('');

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓂀 Câmara do Escriba — Estágio 1/2</h2>
        <p>
          O escriba inscreve em duas tábuas: <code>A = {1, 2, 3, 4, 5}</code> e
          <code>B = {4, 5, 6, 7, 8}</code>, sobre o universo
          <code>U = {1, 2, …, 10}</code>.
        </p>

        <div class="tip">
          <strong>União (A ∪ B):</strong> contém todos os elementos que estão em A
          <strong>OU</strong> em B (ou em ambos). Cada elemento aparece <strong>uma única vez</strong>.
        </div>

        ${vennSVG(A, B, { highlight: 'union' })}

        <p class="center"><strong>Desafio:</strong> selecione TODOS os elementos de <code>A ∪ B</code>.</p>
        <div class="elements-pool">${elems}</div>
        <p class="center">Selecionados: <strong>${fmtSet([...chosen])}</strong></p>
        ${msg}
        <div class="row">
          <button onclick="window._c1Check()">Confirmar</button>
          <button class="secondary" onclick="window._c1Reset()">Limpar</button>
        </div>
      </div>
    `);
  }

  function drawStage2(msg='', highlight=null) {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓂀 Câmara do Escriba — Estágio 2/2</h2>
        <p>Bom trabalho com a união! Agora um desafio visual.</p>
        <div class="tip">
          <strong>Interseção (A ∩ B):</strong> elementos que pertencem a A
          <strong>E</strong> a B simultaneamente. Visualmente é a "lente" central.
        </div>
        <p class="center"><strong>Desafio:</strong> clique na região do diagrama que representa <code>A ∩ B</code>.</p>
        ${vennSVG(A, B, { click: '_c1RegionClick', highlight })}
        ${msg}
        ${stage2Done ? '' : `<div class="center" style="margin-top:10px; opacity:0.7;"><small>Dica: as três regiões coloridas são clicáveis.</small></div>`}
      </div>
    `);
  }

  function drawSolved() {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓂀 Câmara do Escriba — Concluída ✓</h2>
        ${feedback('𓋹 Excelente, Dr. Aalim! Você dominou a definição, a união e a interseção. Os hieróglifos brilham na parede.', 'ok')}
        <p class="center">A ∪ B = ${fmtSet([...targetUnion])} · A ∩ B = {4, 5}</p>
        ${chamberFooterSolved('c1')}
      </div>
    `);
  }

  window._c1Click = n => {
    if (chosen.has(n)) chosen.delete(n); else chosen.add(n);
    drawStage1();
  };
  window._c1Reset = () => { chosen = new Set(); drawStage1(); };
  window._c1Check = () => {
    attempts++;
    if (setEqual(chosen, targetUnion)) {
      stage1Done = true;
      attempts = 0;
      stage = 2;
      drawStage2(feedback('𓋹 Correto! A ∪ B = {1,2,3,4,5,6,7,8}. Avançando para o próximo desafio…', 'ok'));
    } else {
      drawStage1(feedback('Hmm, ainda não. A união contém TODOS os elementos de A E todos de B (sem repetir os comuns).', 'err'));
    }
  };

  window._c1RegionClick = (region) => {
    if (stage2Done) return;
    if (region === 'both') {
      stage2Done = true;
      solved = true;
      completeChamber(20);
      drawSolved();
    } else {
      const nome = region === 'onlyA' ? 'apenas A (azul)' : 'apenas B (vermelho)';
      drawStage2(feedback(`Essa é a região de ${nome}. Tente clicar na lente roxa central.`, 'err'), region);
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 2 — Hierofante: Complemento, Subconjuntos e Diferença
   2 estágios:
     1. Calcular Aᶜ (em U dado)
     2. Identificar TODOS os subconjuntos de C entre 8 candidatos
   ============================================================ */

function chamberC2() {
  let stage = 1;
  let chosen = new Set();
  let solved = false;

  const universe = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const A = new Set([2, 3, 5, 7]);
  const targetCompl = new Set([1, 4, 6, 8, 9, 10]);

  function drawStage1(msg='') {
    const elems = universe.map(n => {
      const inA = A.has(n);
      return `
        <span class="element ${chosen.has(n) ? 'selected' : ''} ${inA ? 'in-set' : ''}"
              onclick="window._c2Click(${n})"
              title="${inA ? 'Pertence a A' : 'Não pertence a A'}">
          ${n}
        </span>
      `;
    }).join('');

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊪 Câmara do Hierofante — Estágio 1/2</h2>
        <p>
          Universo: <code>U = {1, 2, 3, …, 10}</code>.<br>
          Conjunto: <code>A = {2, 3, 5, 7}</code> (os primos até 10).<br>
          <small>Elementos com borda <span style="color:#b04a2f;font-weight:bold">vermelha</span> pertencem a A.</small>
        </p>
        <div class="tip">
          <strong>Complementar (Aᶜ):</strong> elementos do universo U que NÃO pertencem a A.
          Em símbolos: <code>Aᶜ = U − A</code>.
        </div>
        <p class="center"><strong>Desafio:</strong> selecione todos os elementos de <code>Aᶜ</code>.</p>
        <div class="elements-pool">${elems}</div>
        <p class="center">Selecionados: <strong>${fmtSet([...chosen])}</strong></p>
        ${msg}
        <div class="row">
          <button onclick="window._c2Check()">Confirmar</button>
          <button class="secondary" onclick="window._c2Reset()">Limpar</button>
        </div>
      </div>
    `);
  }

  // Estágio 2 — Subconjuntos
  const C_label = "{a, b, c, d}";
  const candidates = [
    { id: 0, label: '∅',                 isSub: true,  why: '∅ é subconjunto de QUALQUER conjunto.' },
    { id: 1, label: '{a}',               isSub: true,  why: 'a ∈ C, então {a} ⊆ C.' },
    { id: 2, label: '{a, b}',            isSub: true,  why: 'a, b ∈ C.' },
    { id: 3, label: '{a, b, c, d}',      isSub: true,  why: 'O próprio C é subconjunto de si mesmo.' },
    { id: 4, label: '{a, e}',            isSub: false, why: 'e ∉ C, então NÃO é subconjunto.' },
    { id: 5, label: '{b, c, d, e}',      isSub: false, why: 'e ∉ C.' },
    { id: 6, label: '{c, d}',            isSub: true,  why: 'c, d ∈ C.' },
    { id: 7, label: '{∅}',               isSub: false, why: 'O elemento ∅ não pertence a C; este conjunto contém UM elemento (o conjunto vazio), e esse elemento não está em C.' },
    { id: 8, label: '{a, b, c, d, e, f}',isSub: false, why: 'Contém e, f que não estão em C.' },
    { id: 9, label: '{d}',               isSub: true,  why: 'd ∈ C.' }
  ];
  const correctSubs = new Set(candidates.filter(c => c.isSub).map(c => c.id));
  let chosenSubs = new Set();

  function drawStage2(msg='') {
    const opts = candidates.map(c => `
      <span class="element ${chosenSubs.has(c.id) ? 'selected' : ''}"
            onclick="window._c2SubClick(${c.id})"
            style="min-width:90px">${c.label}</span>
    `).join('');

    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊪 Câmara do Hierofante — Estágio 2/2</h2>
        <p>Considere o conjunto <code>C = {a, b, c, d}</code>.</p>
        <div class="tip">
          <strong>Subconjunto (X ⊆ C):</strong> X é subconjunto de C se TODO elemento de X
          também pertence a C. Em particular:
          <ul style="margin: 6px 0 0 20px;">
            <li>∅ ⊆ X para qualquer X</li>
            <li>X ⊆ X (todo conjunto é subconjunto de si mesmo)</li>
            <li>{∅} ⊄ C, pois o "elemento vazio" não está em C</li>
          </ul>
        </div>
        <p class="center"><strong>Desafio:</strong> selecione TODOS os conjuntos abaixo que são subconjuntos de C.</p>
        <div class="elements-pool">${opts}</div>
        ${msg}
        <div class="row">
          <button onclick="window._c2SubCheck()">Confirmar</button>
          <button class="secondary" onclick="window._c2SubReset()">Limpar</button>
        </div>
      </div>
    `);
  }

  function drawSolved() {
    const lista = candidates.filter(c => c.isSub).map(c => c.label).join(', ');
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊪 Câmara do Hierofante — Concluída ✓</h2>
        ${feedback('𓋹 Sabedoria comprovada! Você decifrou complemento e subconjuntos. +25 pontos.', 'ok')}
        <p>Aᶜ = ${fmtSet([...targetCompl])}<br>Subconjuntos de C entre as opções: ${lista}</p>
        ${chamberFooterSolved('c2')}
      </div>
    `);
  }

  window._c2Click = n => {
    if (chosen.has(n)) chosen.delete(n); else chosen.add(n);
    drawStage1();
  };
  window._c2Reset = () => { chosen = new Set(); drawStage1(); };
  window._c2Check = () => {
    if (setEqual(chosen, targetCompl)) {
      stage = 2;
      drawStage2(feedback('𓋹 Correto! Aᶜ = {1, 4, 6, 8, 9, 10}. Próximo desafio: subconjuntos.', 'ok'));
    } else {
      drawStage1(feedback('Não. Aᶜ contém TODOS os elementos de U que NÃO estão em A.', 'err'));
    }
  };

  window._c2SubClick = id => {
    if (chosenSubs.has(id)) chosenSubs.delete(id); else chosenSubs.add(id);
    drawStage2();
  };
  window._c2SubReset = () => { chosenSubs = new Set(); drawStage2(); };
  window._c2SubCheck = () => {
    if (setEqual(chosenSubs, correctSubs)) {
      solved = true;
      completeChamber(25);
      drawSolved();
    } else {
      let dica = '';
      for (const c of candidates) {
        const marc = chosenSubs.has(c.id);
        if (marc !== c.isSub) {
          dica = `Reveja <code>${c.label}</code>: ${c.why}`;
          break;
        }
      }
      drawStage2(feedback(`Não está certo. ${dica}`, 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 3 — Contador: Cardinalidade
   2 estágios com múltipla escolha numérica:
     1. |P(A)| onde A tem 5 elementos
     2. Cardinalidade de conjunto com elementos compostos
   ============================================================ */

function chamberC3() {
  let stage = 1;

  function drawStage1(msg='', disabled=false) {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊃 Câmara do Contador — Estágio 1/2</h2>
        <p>O escriba ergue uma tábua com cinco símbolos.</p>
        <div class="tip">
          <strong>Conjunto das partes (P(A)):</strong> é o conjunto de TODOS os subconjuntos
          de A. Se |A| = n, então <code>|P(A)| = 2ⁿ</code>.
        </div>
        <p class="center">
          <strong>Desafio:</strong> Seja A = {𓀀, 𓀁, 𓀂, 𓀃, 𓀄} (5 hieróglifos).
          Quantos subconjuntos tem A?
        </p>
        <div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[5, 10, 25, 32].map((v, i) =>
            `<button class="alt-btn" ${disabled ? 'disabled' : ''}
                     onclick="window._c3Ans1(${v})" id="c3a${i}">${String.fromCharCode(65+i)}) ${v}</button>`
          ).join('')}
        </div>
        ${msg}
      </div>
    `);
  }

  function drawStage2(msg='', disabled=false) {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓊃 Câmara do Contador — Estágio 2/2</h2>
        <div class="tip">
          <strong>Atenção:</strong> a cardinalidade conta o número de ELEMENTOS distintos.
          Conjuntos podem ter outros conjuntos como elementos — cada um conta como UM.
          Elementos repetidos contam apenas UMA vez.
        </div>
        <p class="center">
          <strong>Desafio:</strong> Qual é a cardinalidade do conjunto<br>
          <code>D = { a, {b, c}, ∅, {∅}, a, 7 }</code> ?
        </p>
        <div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[4, 5, 6, 7].map((v, i) =>
            `<button class="alt-btn" ${disabled ? 'disabled' : ''}
                     onclick="window._c3Ans2(${v})" id="c3b${i}">${String.fromCharCode(65+i)}) ${v}</button>`
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
        ${feedback('𓋹 Você sabe contar como um verdadeiro escriba! +25 pontos.', 'ok')}
        <p>
          |P(A)| = 2⁵ = 32 ·
          |D| = 5 (elementos distintos: a, {b,c}, ∅, {∅}, 7 — o segundo "a" é repetido).
        </p>
        ${chamberFooterSolved('c3')}
      </div>
    `);
  }

  window._c3Ans1 = (v) => {
    if (v === 32) {
      stage = 2;
      drawStage2(feedback('𓋹 Correto! 2⁵ = 32 subconjuntos.', 'ok'));
    } else {
      drawStage1(feedback('Não. Lembre: |P(A)| = 2ⁿ. Para n = 5, são 2⁵.', 'err'));
    }
  };
  window._c3Ans2 = (v) => {
    if (v === 5) {
      completeChamber(25);
      drawSolved();
    } else {
      drawStage2(feedback('Hmm. Liste os elementos distintos: a, {b,c}, ∅, {∅}, 7. O segundo "a" é repetido.', 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 4 — Mistérios: Diagrama de Venn + Inclusão-Exclusão
   2 estágios (problema de 2 conjuntos e de 3 conjuntos)
   ============================================================ */

function chamberC4() {
  function drawStage1(msg='') {
    render(`
      ${hud()}
      <div class="scroll">
        <h2>𓋹 Câmara dos Mistérios — Estágio 1/2</h2>
        <p>
          O escriba relata: numa caravana de <strong>50 camelos</strong>,
          <strong>30</strong> carregam tâmaras e <strong>22</strong> carregam tecidos.
          <strong>10</strong> camelos carregam ambos.
        </p>
        <div class="tip">
          <strong>Princípio da Inclusão-Exclusão (2 conjuntos):</strong>
          <code>|A ∪ B| = |A| + |B| − |A ∩ B|</code>.
          Para descobrir quem NÃO está em nenhum: <code>|U| − |A ∪ B|</code>.
        </div>
        <p class="center">
          <strong>Desafio:</strong> Quantos camelos não carregam NEM tâmaras NEM tecidos?
        </p>
        <div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[2, 8, 12, 18].map((v, i) =>
            `<button class="alt-btn" onclick="window._c4Ans1(${v})">${String.fromCharCode(65+i)}) ${v}</button>`
          ).join('')}
        </div>
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
          Numa pesquisa entre <strong>100 escribas</strong>:
          <ul>
            <li><strong>50</strong> dominam Aritmética (A)</li>
            <li><strong>40</strong> dominam Geometria (G)</li>
            <li><strong>30</strong> dominam Astronomia (S)</li>
            <li><strong>20</strong> dominam A e G &nbsp;·&nbsp; <strong>15</strong> dominam A e S &nbsp;·&nbsp; <strong>10</strong> dominam G e S</li>
            <li><strong>5</strong> dominam as três áreas</li>
          </ul>
        </p>
        <div class="tip">
          <strong>Inclusão-Exclusão (3 conjuntos):</strong><br>
          <code>|A ∪ G ∪ S| = |A| + |G| + |S| − |A∩G| − |A∩S| − |G∩S| + |A∩G∩S|</code>
        </div>
        <p class="center">
          <strong>Desafio:</strong> Quantos escribas dominam pelo menos UMA das três áreas?
        </p>
        <div class="alternatives" style="max-width:420px; margin: 0 auto;">
          ${[60, 75, 80, 120].map((v, i) =>
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
        ${feedback('𓋹 Os mistérios da inclusão-exclusão foram revelados! +30 pontos.', 'ok')}
        <p>
          Estágio 1: |A∪B| = 30 + 22 − 10 = 42 → fora: 50 − 42 = <strong>8</strong>.<br>
          Estágio 2: 50+40+30 − 20−15−10 + 5 = <strong>80</strong>.
        </p>
        ${chamberFooterSolved('c4')}
      </div>
    `);
  }

  window._c4Ans1 = v => {
    if (v === 8) {
      drawStage2(feedback('𓋹 Correto! 50 − 42 = 8 camelos sem carga.', 'ok'));
    } else {
      drawStage1(feedback('Não. Calcule |A ∪ B| = 30 + 22 − 10 = 42, depois 50 − 42.', 'err'));
    }
  };
  window._c4Ans2 = v => {
    if (v === 80) {
      completeChamber(30);
      drawSolved();
    } else {
      drawStage2(feedback('Recalcule: 50+40+30 − 20−15−10 + 5.', 'err'));
    }
  };

  drawStage1();
}

/* ============================================================
   CÂMARA 5 — Relações: Reflexiva, Simétrica, Transitiva, Equivalência
   3 relações sobre A = {1, 2, 3}; classificar cada uma
   ============================================================ */

function chamberC5() {
  const RELS = [
    {
      label: 'R₁',
      pairs: [[1,1],[2,2],[3,3],[1,2],[2,1]],
      reflexiva: true,
      simetrica: true,
      transitiva: true,  // (1,2)(2,1)→(1,1) ✓ ; (2,1)(1,2)→(2,2) ✓
    },
    {
      label: 'R₂',
      pairs: [[1,2],[2,3],[1,3]],
      reflexiva: false,
      simetrica: false,
      transitiva: true,
    },
    {
      label: 'R₃',
      pairs: [[1,1],[2,2],[3,3],[1,2],[2,3]],
      reflexiva: true,
      simetrica: false,
      transitiva: false, // (1,2)(2,3) → (1,3) está faltando
    }
  ];

  // resposta do usuário: para cada relação, um objeto {refl, sim, trans}
  let answers = RELS.map(() => ({ refl: false, sim: false, trans: false }));

  function relMatrix(rel) {
    const set = new Set(rel.pairs.map(p => `${p[0]},${p[1]}`));
    let html = '<table class="rel-matrix"><thead><tr><th></th>';
    for (let j = 1; j <= 3; j++) html += `<th>${j}</th>`;
    html += '</tr></thead><tbody>';
    for (let i = 1; i <= 3; i++) {
      html += `<tr><th>${i}</th>`;
      for (let j = 1; j <= 3; j++) {
        const has = set.has(`${i},${j}`);
        html += `<td class="${has ? 'on' : ''}">${has ? '●' : ''}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

  function draw(msg='') {
    const blocks = RELS.map((rel, idx) => {
      const ans = answers[idx];
      const pairsStr = rel.pairs.map(p => `(${p[0]},${p[1]})`).join(', ');
      return `
        <div class="rel-block">
          <h3>${rel.label} = { ${pairsStr} }</h3>
          <div class="rel-row">
            ${relMatrix(rel)}
            <div class="rel-checks">
              <label><input type="checkbox" ${ans.refl ? 'checked' : ''}
                onchange="window._c5Toggle(${idx}, 'refl')"> Reflexiva</label>
              <label><input type="checkbox" ${ans.sim ? 'checked' : ''}
                onchange="window._c5Toggle(${idx}, 'sim')"> Simétrica</label>
              <label><input type="checkbox" ${ans.trans ? 'checked' : ''}
                onchange="window._c5Toggle(${idx}, 'trans')"> Transitiva</label>
              <div class="rel-eq">
                ${(ans.refl && ans.sim && ans.trans)
                  ? '<strong style="color:var(--green-nile)">⇒ é Equivalência</strong>'
                  : '<small style="opacity:0.6">(equivalência = refl. + sim. + trans.)</small>'}
              </div>
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
          Em A = {1, 2, 3}, três relações foram esculpidas. Para cada uma, marque
          quais propriedades ela satisfaz.
        </p>
        <div class="tip">
          <strong>Definições:</strong>
          <ul style="margin: 6px 0 0 20px;">
            <li><strong>Reflexiva</strong>: para todo a ∈ A, (a,a) ∈ R</li>
            <li><strong>Simétrica</strong>: se (a,b) ∈ R, então (b,a) ∈ R</li>
            <li><strong>Transitiva</strong>: se (a,b) ∈ R e (b,c) ∈ R, então (a,c) ∈ R</li>
            <li><strong>Equivalência</strong>: relação reflexiva, simétrica E transitiva</li>
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
        ${feedback('𓋹 Você desvendou as relações sagradas! +30 pontos.', 'ok')}
        <ul>
          <li><strong>R₁</strong>: reflexiva, simétrica, transitiva → <strong>equivalência</strong> ✓</li>
          <li><strong>R₂</strong>: apenas <strong>transitiva</strong></li>
          <li><strong>R₃</strong>: apenas <strong>reflexiva</strong></li>
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
    answers = RELS.map(() => ({ refl: false, sim: false, trans: false }));
    draw();
  };
  window._c5Check = () => {
    let allOk = true;
    let firstErr = null;
    for (let i = 0; i < RELS.length; i++) {
      const rel = RELS[i];
      const ans = answers[i];
      const ok = ans.refl === rel.reflexiva
              && ans.sim === rel.simetrica
              && ans.trans === rel.transitiva;
      if (!ok && !firstErr) firstErr = rel.label;
      if (!ok) allOk = false;
    }
    if (allOk) {
      completeChamber(30);
      drawSolved();
    } else {
      draw(feedback(`Há erros em ${firstErr}. Reveja par a par usando as definições acima.`, 'err'));
    }
  };

  draw();
}

/* ============================================================
   CÂMARA 6 — Quiz Final (16 questões)
   ============================================================ */

function chamberFinalIntro() {
  state.quizQuestions = shuffle(QUESTION_BANK);  // todas as 16, embaralhadas
  state.quizIndex = 0;
  state.quizCorrect = 0;

  render(`
    ${hud()}
    <div class="scroll">
      <h2>𓁹 Câmara do Faraó</h2>
      <p>
        A última porta se abre. O <strong>Faraó</strong>, sentado em seu trono dourado,
        ergue a mão dourada. "Provaste tua dedicação, Dr. Aalim. Agora, responde a
        <strong>dezesseis perguntas</strong> sobre os mistérios discretos. Acertando ao
        menos <strong>onze</strong>, terás minha bênção."
      </p>
      <div class="tip">
        São ${QUESTION_BANK.length} questões cobrindo Funções, PA, PG, Princípios da
        Contagem, Permutações, Arranjos, Combinações e Binômio de Newton — duas de cada.
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
  const aprovado = acertos >= 11;

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
             𓋹 <strong>O Faraó concede sua bênção!</strong> Você dominou os mistérios
             discretos. A pirâmide se ilumina e os hieróglifos cantam seu nome.
           </div>`
        : `<div class="feedback err">
             O Faraó balança a cabeça. "Volta quando estiveres mais preparado."
             Você precisa de pelo menos 11 acertos. Tente novamente!
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
