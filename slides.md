# Esboço dos Slides — Apresentação AV2

> Projeto: **Hieróglifos — O Enigma do Escriba**
> Disciplina: Resolução de Problemas de Natureza Discreta
> Sugestão: 8–10 slides · 5–10 min

---

## Slide 1 — Capa

- Título: **Hieróglifos — O Enigma do Escriba**
- Subtítulo: Jogo educativo sobre Arranjos
- Nomes da equipe + matrícula
- Logo UNIFOR · Disciplina · Professor · Semestre

---

## Slide 2 — Problema / Motivação

- Arranjos são um tema central da matemática discreta — presentes em senhas, rotas, criptografia e combinatória
- Alunos do ensino médio costumam confundir arranjo com permutação e combinação
- **Objetivo:** transformar os conceitos em uma aventura visual e interativa, tornando o aprendizado lúdico e acessível
- Inspiração: arqueologia + Egito antigo (escribas que ordenavam rituais e registros de forma precisa)

---

## Slide 3 — Público-alvo e Conteúdo

- **Público:** alunos do ensino médio (1º ao 3º ano)
- **Conteúdo sorteado:** Arranjos — simples e com repetição
- Definição central:
  - **Arranjo simples** A(n, p) = n! / (n−p)! → a ordem importa, sem repetição
  - **Arranjo com repetição** AR(n, p) = nᵖ → a ordem importa, com repetição permitida
- Pré-requisito: fatorial e noções de contagem

---

## Slide 4 — Mecânica do Jogo

- Narrativa: Dr. Aalim, arqueólogo em Saqqara, decifra câmaras para libertar os saberes do Faraó
- **6 câmaras** seladas, cada uma com desafios sobre arranjos:
  1. **Câmara do Escriba** — conceito de arranjo e diferença para permutação
  2. **Câmara do Hierofante** — arranjo simples A(n, p): cálculo e aplicação
  3. **Câmara do Contador** — arranjo com repetição AR(n, p): senhas e sequências
  4. **Câmara dos Mistérios** — problemas contextualizados combinando os dois tipos
  5. **Câmara das Relações** — distinção entre arranjo, permutação e combinação
  6. **Câmara do Faraó** — quiz final com 16 questões sobre arranjos e tópicos relacionados

---

## Slide 5 — Plataforma e Tecnologia

- **HTML5 + CSS + JavaScript puro** (sem frameworks)
- Roda em qualquer navegador (PC, tablet, celular)
- Estética: papiro, ouro, lapis-lazúli, hieróglifos Unicode
- Elementos clicáveis e interativos para montar arranjos visualmente

**Por quê?** Acessibilidade total — basta um link, não precisa instalar nada.

---

## Slide 6 — Demonstração (ao vivo)

- Abrir o link público do jogo
- Mostrar:
  - Mapa da pirâmide e narrativa
  - Uma câmara de arranjo simples (montando uma sequência interativamente)
  - 1–2 questões do quiz final

---

## Slide 7 — Conteúdo Matemático Coberto

| Conceito | Onde aparece |
|---|---|
| Definição de arranjo e diferença p/ permutação | Câmara 1 |
| Arranjo simples A(n, p) = n! / (n−p)! | Câmaras 2 e 4 + Quiz |
| Arranjo com repetição AR(n, p) = nᵖ | Câmaras 3 e 4 + Quiz |
| Comparação arranjo × permutação × combinação | Câmara 5 + Quiz |
| Problemas contextualizados (senhas, rotas, placas) | Câmaras 4 e 5 + Quiz |
| Princípio multiplicativo (base dos arranjos) | Quiz |
| Fatorial e suas propriedades | Quiz |

---

## Slide 8 — Acesso ao Jogo

- 🔗 Link: `https://davisocoloski1.github.io/hieroglifos/`
- 📱 QR Code (gerar e colar imagem grande aqui)
- Funciona offline depois de carregado

---

## Slide 9 — Desafios Técnicos & Decisões

- Elementos clicáveis e arrastáveis para montar sequências de arranjos visualmente
- Sorteio de questões (Fisher–Yates) garante variabilidade no quiz
- Estado salvo em memória (extensível com `localStorage`)
- Feedback didático: ao errar, o jogo mostra o cálculo correto passo a passo
- Separação clara entre arranjo simples e com repetição evita confusão conceitual

---

## Slide 10 — Impacto Pedagógico & Próximos Passos

- **Aprendizado ativo:** o aluno monta arranjos clicando, não só lê a fórmula
- **Feedback imediato:** explicação com passo a passo após cada erro/acerto
- **Gamificação:** câmaras destravam progressivamente, pontuação motiva
- **AV3:** coletar feedback de colegas, ajustar dificuldade, adicionar animações e trilha sonora
- **Feira das Profissões:** disponível para acesso público via link/QR

---

## Encerramento

- "Obrigado! Perguntas?"
- Repetir o link/QR
