/* ============================================================
   Banco de questões — 16 questões (2 por tópico, 8 tópicos)
   Critério 5 (Conteúdo Matemático) + Critério 2 (≥10 questões)
   Tópicos cobertos:
     · Funções (injetora, sobrejetora, bijetora, composta, inversa)
     · Sequências numéricas — Progressão Aritmética (PA)
     · Sequências numéricas — Progressão Geométrica (PG)
     · Princípios da contagem (adição, multiplicação, casa dos pombos)
     · Permutações (simples, com repetição, circular)
     · Arranjos (simples e com repetição)
     · Combinações (simples e com repetição)
     · Binômio de Newton (coef. binomiais, triângulo de Pascal, prod. notáveis)
   ============================================================ */

const QUESTION_BANK = [

  /* ===== FUNÇÕES ===== */
  {
    id: 1,
    topico: 'Funções',
    enunciado: "Considere f: ℝ → ℝ definida por f(x) = 2x + 3. A função f é:",
    alternativas: [
      "Apenas injetora",
      "Apenas sobrejetora",
      "Bijetora",
      "Nem injetora, nem sobrejetora"
    ],
    correta: 2,
    explicacao: "Toda função afim f(x) = ax + b com a ≠ 0 é bijetora em ℝ → ℝ: é injetora (estritamente crescente, pois a > 0) e sobrejetora (sua imagem é todo ℝ)."
  },
  {
    id: 2,
    topico: 'Funções',
    enunciado: "Sejam f(x) = x + 1 e g(x) = x². Quanto vale (f ∘ g)(3) − (g ∘ f)(3)?",
    alternativas: [
      "−6",
      "−4",
      "0",
      "6"
    ],
    correta: 0,
    explicacao: "(f∘g)(3) = f(g(3)) = f(9) = 10. (g∘f)(3) = g(f(3)) = g(4) = 16. Portanto 10 − 16 = −6."
  },

  /* ===== PROGRESSÃO ARITMÉTICA ===== */
  {
    id: 3,
    topico: 'PA',
    enunciado: "Em uma PA, o 5º termo é 17 e o 10º termo é 37. Qual é a razão e o primeiro termo?",
    alternativas: [
      "r = 5, a₁ = −3",
      "r = 4, a₁ = 1",
      "r = 4, a₁ = −3",
      "r = 5, a₁ = 1"
    ],
    correta: 1,
    explicacao: "a₁₀ − a₅ = 5r → 37 − 17 = 20 → r = 4. a₁ = a₅ − 4r = 17 − 16 = 1. Logo r = 4 e a₁ = 1."
  },
  {
    id: 4,
    topico: 'PA',
    enunciado: "Qual a soma dos 20 primeiros termos da PA (3, 7, 11, 15, ...)?",
    alternativas: [
      "780",
      "820",
      "860",
      "900"
    ],
    correta: 1,
    explicacao: "S₂₀ = (a₁ + a₂₀)·20/2. a₂₀ = a₁ + 19r = 3 + 19·4 = 79. Portanto S₂₀ = (3 + 79)·10 = 820."
  },

  /* ===== PROGRESSÃO GEOMÉTRICA ===== */
  {
    id: 5,
    topico: 'PG',
    enunciado: "Em uma PG, a₁ = 3 e a razão é q = 2. Qual o valor de a₈?",
    alternativas: [
      "192",
      "256",
      "384",
      "768"
    ],
    correta: 2,
    explicacao: "aₙ = a₁ · q^(n−1). a₈ = 3 · 2⁷ = 3 · 128 = 384."
  },
  {
    id: 6,
    topico: 'PG',
    enunciado: "Qual o limite da soma da PG infinita (4, 2, 1, 1/2, 1/4, ...)?",
    alternativas: [
      "6",
      "7",
      "8",
      "Infinito"
    ],
    correta: 2,
    explicacao: "Para |q| < 1, S∞ = a₁ / (1 − q). Aqui a₁ = 4 e q = 1/2, então S∞ = 4 / (1 − 1/2) = 4 / (1/2) = 8."
  },

  /* ===== PRINCÍPIOS DA CONTAGEM ===== */
  {
    id: 7,
    topico: 'Contagem',
    enunciado: "Uma loja tem 5 modelos de camisa e 4 modelos de calça. De quantas formas posso compor uma roupa com uma camisa OU uma calça (não ambas)?",
    alternativas: [
      "9",
      "20",
      "5",
      "1"
    ],
    correta: 0,
    explicacao: "Princípio Aditivo: como as escolhas são exclusivas (OU), somamos: 5 + 4 = 9 formas."
  },
  {
    id: 8,
    topico: 'Contagem',
    enunciado: "Em uma sala há 13 pessoas. Pelo Princípio da Casa dos Pombos, podemos garantir que pelo menos:",
    alternativas: [
      "2 pessoas fazem aniversário no mesmo mês",
      "2 pessoas têm o mesmo dia da semana de nascimento",
      "3 pessoas fazem aniversário no mesmo mês",
      "Todos fazem aniversário em meses diferentes"
    ],
    correta: 0,
    explicacao: "Há 12 meses (pombos = 12) e 13 pessoas (objetos = 13). Pelo Princípio da Casa dos Pombos, ao menos duas pessoas dividem o mesmo mês de aniversário."
  },

  /* ===== PERMUTAÇÕES ===== */
  {
    id: 9,
    topico: 'Permutações',
    enunciado: "De quantas maneiras distintas é possível anagramar a palavra ARARA?",
    alternativas: [
      "120",
      "60",
      "20",
      "10"
    ],
    correta: 3,
    explicacao: "Permutação com repetição: P(5; 3, 2) = 5! / (3! · 2!) = 120 / (6 · 2) = 10. (3 letras A e 2 letras R)."
  },
  {
    id: 10,
    topico: 'Permutações',
    enunciado: "De quantas formas 6 pessoas podem se sentar em uma mesa redonda?",
    alternativas: [
      "720",
      "120",
      "60",
      "24"
    ],
    correta: 1,
    explicacao: "Permutação circular: PC(n) = (n − 1)!. Para n = 6: 5! = 120 disposições distintas."
  },

  /* ===== ARRANJOS ===== */
  {
    id: 11,
    topico: 'Arranjos',
    enunciado: "Quantos números de 3 algarismos DISTINTOS podemos formar com os dígitos {1, 2, 3, 4, 5}?",
    alternativas: [
      "10",
      "60",
      "120",
      "125"
    ],
    correta: 1,
    explicacao: "Arranjo simples A(5,3) = 5! / (5−3)! = 5! / 2! = 120 / 2 = 60. (a ordem importa, pois 123 ≠ 321)."
  },
  {
    id: 12,
    topico: 'Arranjos',
    enunciado: "Quantas senhas de 4 dígitos (de 0 a 9) podem ser formadas COM repetição?",
    alternativas: [
      "5040",
      "10000",
      "210",
      "40"
    ],
    correta: 1,
    explicacao: "Arranjo com repetição: AR(n, p) = nᵖ. Aqui 10⁴ = 10 000 senhas possíveis."
  },

  /* ===== COMBINAÇÕES ===== */
  {
    id: 13,
    topico: 'Combinações',
    enunciado: "De quantas maneiras posso escolher 3 alunos de uma turma de 8 para formar uma comissão?",
    alternativas: [
      "24",
      "56",
      "168",
      "336"
    ],
    correta: 1,
    explicacao: "Combinação simples C(8,3) = 8! / (3! · 5!) = (8·7·6) / (3·2·1) = 56. A ordem NÃO importa em uma comissão."
  },
  {
    id: 14,
    topico: 'Combinações',
    enunciado: "De quantas formas distintas podemos comprar 4 sorvetes em uma loja com 3 sabores disponíveis (podendo repetir)?",
    alternativas: [
      "12",
      "15",
      "27",
      "81"
    ],
    correta: 1,
    explicacao: "Combinação com repetição: CR(n, p) = C(n + p − 1, p) = C(3 + 4 − 1, 4) = C(6, 4) = 15."
  },

  /* ===== BINÔMIO DE NEWTON ===== */
  {
    id: 15,
    topico: 'Binômio de Newton',
    enunciado: "Qual é o coeficiente do termo x³ na expansão de (x + 2)⁵?",
    alternativas: [
      "10",
      "20",
      "40",
      "80"
    ],
    correta: 2,
    explicacao: "Termo geral: C(5, k) · x^(5−k) · 2^k. Para x³, 5 − k = 3 → k = 2. Coeficiente: C(5,2) · 2² = 10 · 4 = 40."
  },
  {
    id: 16,
    topico: 'Binômio de Newton',
    enunciado: "A 4ª linha do triângulo de Pascal (começando da linha 0) é: 1, 4, 6, 4, 1. Qual a soma de TODOS os elementos dessa linha?",
    alternativas: [
      "8",
      "10",
      "16",
      "32"
    ],
    correta: 2,
    explicacao: "A soma dos elementos da n-ésima linha do triângulo de Pascal é 2ⁿ. Para n = 4: 2⁴ = 16. Verificando: 1+4+6+4+1 = 16. ✓"
  }
];
