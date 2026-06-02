/* ============================================================
   Banco de questões — 20 questões sobre Arranjos
   (Arranjo Simples e Arranjo com Repetição)
   A cada sessão da Câmara do Faraó, 10 são sorteadas aleatoriamente.
   ============================================================ */

const QUESTION_BANK = [

  /* ===== ARRANJO SIMPLES — CONCEITO E FÓRMULA ===== */
  {
    id: 1,
    topico: 'Arranjo Simples — Conceito',
    enunciado: "Qual das alternativas define corretamente um Arranjo Simples A(n, p)?",
    alternativas: [
      "Seleção de p elementos de n, onde a ordem não importa e não há repetição",
      "Seleção de p elementos de n, onde a ordem importa e não há repetição",
      "Seleção de p elementos de n, onde a ordem importa e há repetição",
      "Seleção de todos os n elementos de um conjunto em qualquer ordem"
    ],
    correta: 1,
    explicacao: "Arranjo Simples: a ordem dos elementos importa (AB ≠ BA) e os elementos não se repetem na sequência. A fórmula é A(n, p) = n! / (n − p)!."
  },
  {
    id: 2,
    topico: 'Arranjo Simples — Fórmula',
    enunciado: "Qual é a fórmula do Arranjo Simples A(n, p)?",
    alternativas: [
      "n! / p!",
      "n! / (n − p)!",
      "nᵖ",
      "n! / (p! · (n − p)!)"
    ],
    correta: 1,
    explicacao: "A(n, p) = n! / (n − p)! = n × (n−1) × … × (n−p+1). Esse produto tem exatamente p fatores decrescentes a partir de n."
  },
  {
    id: 3,
    topico: 'Arranjo Simples — Cálculo',
    enunciado: "Qual o valor de A(5, 2)?",
    alternativas: [
      "16",
      "18",
      "20",
      "24"
    ],
    correta: 2,
    explicacao: "A(5, 2) = 5 × 4 = 20. São dois fatores decrescentes a partir de 5."
  },
  {
    id: 4,
    topico: 'Arranjo Simples — Cálculo',
    enunciado: "Qual o valor de A(6, 3)?",
    alternativas: [
      "96",
      "108",
      "120",
      "132"
    ],
    correta: 2,
    explicacao: "A(6, 3) = 6 × 5 × 4 = 120. São três fatores decrescentes a partir de 6."
  },
  {
    id: 5,
    topico: 'Arranjo Simples — Aplicado',
    enunciado: "Sete atletas competem pelo pódio (1º, 2º e 3º lugares). Cada atleta pode ocupar apenas um lugar. Quantos pódios distintos são possíveis?",
    alternativas: [
      "180",
      "210",
      "240",
      "270"
    ],
    correta: 1,
    explicacao: "A(7, 3) = 7 × 6 × 5 = 210. Usamos Arranjo Simples pois a posição importa (1º ≠ 2º) e não há repetição de atletas."
  },
  {
    id: 6,
    topico: 'Arranjo Simples — Aplicado',
    enunciado: "De quantas formas é possível eleger Presidente, Vice-Presidente e Secretário de uma turma com 10 alunos (um aluno por cargo)?",
    alternativas: [
      "640",
      "720",
      "810",
      "900"
    ],
    correta: 1,
    explicacao: "A(10, 3) = 10 × 9 × 8 = 720. Três cargos distintos escolhidos de 10 pessoas, sem repetição de pessoa."
  },
  {
    id: 7,
    topico: 'Arranjo Simples — Aplicado',
    enunciado: "Quantos números de 3 algarismos distintos podem ser formados com os dígitos {1, 2, 3, 4, 5}?",
    alternativas: [
      "48",
      "54",
      "60",
      "72"
    ],
    correta: 2,
    explicacao: "A(5, 3) = 5 × 4 × 3 = 60. A ordem importa (123 ≠ 321) e os dígitos não se repetem dentro do mesmo número."
  },
  {
    id: 8,
    topico: 'Arranjo Simples — Identificação',
    enunciado: "Em qual das situações abaixo se aplica o Arranjo Simples?",
    alternativas: [
      "Criar uma senha de 4 dígitos (0–9) onde os dígitos podem se repetir",
      "Organizar os 3 primeiros lugares em uma corrida com 8 participantes (sem empate)",
      "Escolher 3 sabores de sorvete de um cardápio com 10 opções (a ordem não importa)",
      "Lançar um dado 4 vezes e anotar os resultados"
    ],
    correta: 1,
    explicacao: "No pódio de uma corrida, a ordem importa (1º ≠ 2º) e cada atleta ocupa uma única posição — isso caracteriza um Arranjo Simples."
  },
  {
    id: 9,
    topico: 'Arranjo Simples — Aplicado',
    enunciado: "De quantas maneiras 4 livros diferentes podem ser dispostos em 4 posições numeradas de uma estante?",
    alternativas: [
      "12",
      "18",
      "24",
      "30"
    ],
    correta: 2,
    explicacao: "A(4, 4) = 4! = 24. Quando p = n, o Arranjo Simples é equivalente à Permutação Simples."
  },
  {
    id: 10,
    topico: 'Arranjo Simples — Aplicado',
    enunciado: "Um código de acesso tem 4 letras distintas escolhidas do alfabeto (26 letras), a ordem importa. Quantos códigos são possíveis?",
    alternativas: [
      "26 × 4 = 104",
      "26 × 25 × 24 × 23 = 358.800",
      "26⁴ = 456.976",
      "C(26, 4) = 14.950"
    ],
    correta: 1,
    explicacao: "A(26, 4) = 26 × 25 × 24 × 23 = 358.800. Letras distintas com ordem → Arranjo Simples."
  },

  /* ===== ARRANJO COM REPETIÇÃO — CONCEITO E FÓRMULA ===== */
  {
    id: 11,
    topico: 'Arranjo com Repetição — Conceito',
    enunciado: "O que diferencia o Arranjo com Repetição do Arranjo Simples?",
    alternativas: [
      "No Arranjo com Repetição, a ordem dos elementos não importa",
      "No Arranjo com Repetição, o mesmo elemento pode aparecer mais de uma vez na sequência",
      "No Arranjo com Repetição, escolhemos todos os n elementos",
      "No Arranjo com Repetição, a fórmula é n! / (n − p)!"
    ],
    correta: 1,
    explicacao: "No Arranjo com Repetição, cada posição pode ser preenchida por qualquer dos n elementos, inclusive aquele já utilizado. A fórmula é AR(n, p) = nᵖ."
  },
  {
    id: 12,
    topico: 'Arranjo com Repetição — Fórmula',
    enunciado: "Qual é a fórmula do Arranjo com Repetição AR(n, p)?",
    alternativas: [
      "n! / (n − p)!",
      "n! / (p! · (n − p)!)",
      "nᵖ",
      "p! / n!"
    ],
    correta: 2,
    explicacao: "AR(n, p) = nᵖ. Cada uma das p posições tem n opções independentes; portanto multiplicamos n por si mesmo p vezes."
  },
  {
    id: 13,
    topico: 'Arranjo com Repetição — Cálculo',
    enunciado: "Qual o valor de AR(4, 3)?",
    alternativas: [
      "48",
      "56",
      "64",
      "72"
    ],
    correta: 2,
    explicacao: "AR(4, 3) = 4³ = 64."
  },
  {
    id: 14,
    topico: 'Arranjo com Repetição — Cálculo',
    enunciado: "Qual o valor de AR(3, 4)?",
    alternativas: [
      "64",
      "72",
      "81",
      "96"
    ],
    correta: 2,
    explicacao: "AR(3, 4) = 3⁴ = 81."
  },
  {
    id: 15,
    topico: 'Arranjo com Repetição — Aplicado',
    enunciado: "Uma senha de computador tem 4 dígitos, cada um podendo ser qualquer algarismo de 0 a 9 (com repetição). Quantas senhas distintas existem?",
    alternativas: [
      "8.100",
      "9.000",
      "10.000",
      "11.000"
    ],
    correta: 2,
    explicacao: "AR(10, 4) = 10⁴ = 10.000. Com repetição, cada posição tem 10 opções independentes."
  },
  {
    id: 16,
    topico: 'Arranjo com Repetição — Aplicado',
    enunciado: "Um dado de 6 faces é lançado 3 vezes. Quantas sequências de resultados distintas são possíveis?",
    alternativas: [
      "180",
      "200",
      "216",
      "240"
    ],
    correta: 2,
    explicacao: "AR(6, 3) = 6³ = 216. Cada lançamento é independente e pode repetir faces de lançamentos anteriores."
  },
  {
    id: 17,
    topico: 'Arranjo com Repetição — Identificação',
    enunciado: "Em qual das situações abaixo se aplica o Arranjo com Repetição?",
    alternativas: [
      "Distribuir 3 medalhas distintas entre 8 atletas, sem empate",
      "Eleger 3 cargos distintos de uma turma com 10 alunos",
      "Criar uma sequência de 3 cores usando {Vermelho, Verde, Azul}, podendo repetir a mesma cor",
      "Organizar 5 livros únicos em 5 posições numeradas da estante"
    ],
    correta: 2,
    explicacao: "Quando a mesma cor pode se repetir na sequência, usamos Arranjo com Repetição: AR(3, 3) = 3³ = 27 sequências distintas."
  },
  {
    id: 18,
    topico: 'Arranjo com Repetição — Aplicado',
    enunciado: "Um músico pode compor melodias de 4 notas usando um conjunto de 7 notas musicais, podendo repetir qualquer nota. Quantas melodias distintas pode criar?",
    alternativas: [
      "2.058",
      "2.401",
      "2.744",
      "3.087"
    ],
    correta: 1,
    explicacao: "AR(7, 4) = 7⁴ = 2.401. Cada posição na melodia tem 7 opções, com repetição permitida."
  },

  /* ===== COMPARAÇÃO E APLICAÇÃO COMBINADA ===== */
  {
    id: 19,
    topico: 'Comparação A × AR',
    enunciado: "Um cofre é aberto com um código de 3 dígitos escolhidos de {1, 2, 3, 4}. SEM repetição há A(4,3) = 24 códigos; COM repetição há AR(4,3) = 64. Qual é a diferença entre os dois valores?",
    alternativas: [
      "36",
      "40",
      "44",
      "48"
    ],
    correta: 1,
    explicacao: "AR(4,3) − A(4,3) = 64 − 24 = 40. Com repetição há sempre mais possibilidades, pois o mesmo elemento pode reaparecer em posições distintas."
  },
  {
    id: 20,
    topico: 'Aplicado — Combinado',
    enunciado: "Uma placa de identificação tem 2 letras (A–Z, com repetição) seguidas de 3 dígitos (0–9, sem repetição). Quantas placas distintas existem?",
    alternativas: [
      "468.000  (letras sem rep. × dígitos sem rep.)",
      "486.720  (letras com rep. × dígitos sem rep.)",
      "650.000  (letras sem rep. × dígitos com rep.)",
      "676.000  (letras com rep. × dígitos com rep.)"
    ],
    correta: 1,
    explicacao: "Letras (com repetição): AR(26, 2) = 26² = 676. Dígitos (sem repetição): A(10, 3) = 10 × 9 × 8 = 720. Total: 676 × 720 = 486.720."
  }

];
