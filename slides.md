# Esboço dos Slides — Apresentação AV2

> Projeto: **Hieróglifos — O Enigma do Escriba**
> Disciplina: Resolução de Problemas de Natureza Discreta
> Sugestão: 8–10 slides · 5–10 min

---

## Slide 1 — Capa

- Título: **Hieróglifos — O Enigma do Escriba**
- Subtítulo: Jogo educativo sobre Conjuntos
- Nomes da equipe + matrícula
- Logo UNIFOR · Disciplina · Professor · Semestre

---

## Slide 2 — Problema / Motivação

- Conjuntos são a base de toda matemática discreta
- Alunos do ensino médio costumam achar abstrato
- **Objetivo:** transformar os conceitos em uma aventura visual e interativa
- Inspiração: arqueologia + Egito antigo (escribas como "primeiros matemáticos")

---

## Slide 3 — Público-alvo e Conteúdo

- **Público:** alunos do ensino médio (1º ao 3º ano)
- **Conteúdo escolhido (sorteio):** Conjuntos — definição, união, interseção, complemento, subconjuntos
- Pré-requisito mínimo: noções de número natural

---

## Slide 4 — Mecânica do Jogo

- Narrativa: Dr. Aalim, arqueólogo em Saqqara
- **6 câmaras** seladas, abertas ao resolver desafios:
  1. Tutorial: identificar elementos
  2. União (selecionar A ∪ B)
  3. Interseção (clicar na região do Venn)
  4. Complemento (Aᶜ no universo dado)
  5. Subconjuntos (marcar quais ⊆ C)
  6. Quiz final: 10 questões sorteadas de banco com 12

---

## Slide 5 — Plataforma e Tecnologia

- **HTML5 + CSS + JavaScript puro** (sem frameworks)
- Roda em qualquer navegador (PC, tablet, celular)
- Estética: papiro, ouro, lapis-lazúli, hieróglifos Unicode
- Diagramas de Venn em **SVG** (interativos)

**Por quê?** Acessibilidade total — basta um link, não precisa instalar nada.

---

## Slide 6 — Demonstração (ao vivo)

- Abrir o link público do jogo
- Mostrar:
  - Mapa da pirâmide
  - Resolver a Câmara da Interseção (clicar no Venn)
  - 1–2 questões do quiz final

---

## Slide 7 — Conteúdo Matemático Coberto

| Conceito | Onde aparece |
|---|---|
| Definição de conjunto | Câmara 1 |
| União ∪ | Câmara 2 + Quiz |
| Interseção ∩ | Câmara 3 + Quiz |
| Complemento ᶜ | Câmara 4 + Quiz |
| Subconjuntos ⊆ | Câmara 5 + Quiz |
| Cardinalidade | Quiz |
| Inclusão-exclusão | Quiz |

---

## Slide 8 — Acesso ao Jogo

- 🔗 Link: `https://davisocoloski1.github.io/hieroglifos/`
- 📱 QR Code (gerar e colar imagem grande aqui)
- Funciona offline depois de carregado

---

## Slide 9 — Desafios Técnicos & Decisões

- Diagrama de Venn clicável em SVG (regiões com `fill-rule: evenodd`)
- Sorteio de questões (Fisher–Yates) garante variabilidade
- Estado salvo em memória (poderia ser estendido com `localStorage`)
- Feedback didático: ao errar, o jogo aponta exatamente o equívoco

---

## Slide 10 — Impacto Pedagógico & Próximos Passos

- **Aprendizado ativo:** o aluno manipula os elementos, não só lê
- **Feedback imediato:** explicação após cada erro/acerto
- **Gamificação:** câmaras destravam, pontuação motiva
- **AV3:** coletar feedback de colegas, ajustar dificuldade, adicionar trilha sonora e animações
- **Feira das Profissões:** disponível para teste público

---

## Encerramento

- "Obrigado! Perguntas?"
- Repetir o link/QR
