# 𓂀 Hieróglifos — O Enigma do Escriba

Jogo educativo sobre **Conjuntos** (matemática discreta) para alunos do ensino médio.

> **Projeto Aplicado** — Resolução de Problemas de Natureza Discreta · UNIFOR

## Sobre

Você é Dr. Aalim, um arqueólogo que encontrou uma pirâmide esquecida. Para abrir as **6 câmaras seladas**, você precisa decifrar enigmas de matemática discreta:

1. **𓂀 Câmara do Escriba** — Definição, União e Interseção (2 estágios)
2. **𓊪 Câmara do Hierofante** — Complemento, Subconjuntos e Diferença (2 estágios)
3. **𓊃 Câmara do Contador** — Cardinalidade e Conjunto das Partes (2 estágios)
4. **𓋹 Câmara dos Mistérios** — Diagrama de Venn e Inclusão-Exclusão (2 e 3 conjuntos)
5. **𓎛 Câmara das Relações** — Reflexiva, Simétrica, Transitiva, Equivalência
6. **𓁹 Câmara do Faraó** — Quiz final com **16 questões** (Funções, PA, PG, Contagem, Permutações, Arranjos, Combinações, Binômio de Newton)

## Como rodar localmente

Por ser HTML/CSS/JS puro, **não precisa de instalação**. Basta:

```bash
# Opção 1 — abrir direto
# Clique duas vezes em index.html

# Opção 2 — servir com Python (recomendado se navegador bloquear file://)
python -m http.server 8000
# acesse http://localhost:8000
```

## Estrutura de arquivos

```
hieroglifos/
├── index.html       # entrada
├── style.css        # estética egípcia (papiro, ouro, lapis-lazúli)
├── game.js          # lógica do jogo + 5 câmaras + quiz
├── questions.js     # banco de 12 questões (sorteio de 10)
└── README.md        # este arquivo
```

## Conteúdo coberto

**Nas câmaras (interativas):**
- Conjuntos: definição, notação, elementos, ∅
- Operações: união (∪), interseção (∩), complemento (ᶜ)
- Subconjuntos (⊆) e conjunto das partes P(A)
- Cardinalidade (incluindo conjuntos com elementos compostos)
- Princípio da Inclusão-Exclusão (2 e 3 conjuntos)
- Diagrama de Venn (interativo, regiões clicáveis)
- Relações: reflexiva, simétrica, transitiva, equivalência

**No quiz final (16 questões, 2 por tópico):**
- Funções (injetora, sobrejetora, bijetora, composta, inversa)
- Progressão Aritmética
- Progressão Geométrica
- Princípios da Contagem (adição, multiplicação, casa dos pombos)
- Permutações (simples, com repetição, circular)
- Arranjos (simples e com repetição)
- Combinações (simples e com repetição)
- Binômio de Newton (coef. binomiais, triângulo de Pascal)
