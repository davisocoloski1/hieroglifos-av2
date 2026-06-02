# Relatório de Alterações — Hieróglifos: O Enigma do Escriba

Este documento registra as melhorias aplicadas ao jogo a partir das sugestões
levantadas por jogadores (alunos de outros cursos, familiares e demais pessoas
que testaram a experiência sem acesso ao código). Para cada item descrevemos
**o problema/sugestão** e, em seguida, **a solução implementada**.

---

## 1. Câmara do Faraó sempre acessível

**Sugestão:** Era preciso poder mostrar o questionário final direto para o
professor, sem ter de jogar todas as câmaras antes.

**Solução:** A Câmara do Faraó (o quiz final) permanece **sempre desbloqueada**,
independentemente do progresso. Isso foi tornado intencional e documentado no
código (constante `ALWAYS_OPEN = 'c7'`). No mapa, todas as demais câmaras seguem
a progressão normal, mas a do Faraó pode ser aberta a qualquer momento — ideal
para demonstração.

---

## 2. Indicação visual de que é preciso clicar

**Problema:** Alguns jogadores não percebiam de imediato que os símbolos e botões
eram clicáveis, ficando parados sem saber o que fazer.

**Solução:** Foram adicionadas pistas visuais:
- Uma legenda animada **"👆 Toque nos símbolos abaixo para selecioná-los"**
  acima de cada conjunto de elementos interativos.
- Os elementos clicáveis agora **pulsam suavemente** (halo dourado intermitente)
  para chamar a atenção; a animação para ao passar o mouse ou ao selecionar.
- As câmaras bloqueadas exibem um ícone de **cadeado**, deixando claro o que
  ainda não está disponível.
- A animação respeita a preferência de "movimento reduzido" do sistema.

---

## 3. Opções de resposta mais próximas + nova câmara discursiva

**Problema:** As alternativas de múltipla escolha tinham valores muito distantes
entre si (ex.: 10, 20, 60, 120), permitindo "chutar" pela ordem de grandeza sem
realmente calcular. Além disso, faltava uma atividade que exigisse raciocínio
escrito.

**Solução (parte A — alternativas mais próximas):** Todas as alternativas
numéricas — tanto das câmaras quanto do banco de 20 questões — foram reescritas
com valores **próximos do correto** (ex.: A(5,3) passou a ter as opções
54, 60, 64, 72). Assim, eliminar respostas "pelo tamanho" deixa de funcionar e o
jogador precisa de fato efetuar o cálculo. O espaçamento visual entre as opções
também foi reduzido para reforçar essa proximidade.

**Solução (parte B — câmara discursiva):** Foi criada uma nova
**Câmara do Oráculo**, posicionada **antes** da Câmara do Faraó. Nela o jogador
recebe um enigma com dois itens (sequência de 3 entre 5 hieróglifos, sem e com
repetição), **explica seu raciocínio em um campo de texto** e informa as duas
respostas. O sistema valida se as respostas corretas aparecem no texto e, ao
acertar, exibe uma resposta-modelo comentada.

---

## 4. Melhor usabilidade no celular

**Problema:** No celular, botões e símbolos ficavam pequenos e o cabeçalho
(HUD) ficava apertado.

**Solução:** O layout responsivo foi ampliado:
- O HUD passa a ser **empilhado verticalmente** em telas pequenas.
- Botões, alternativas e elementos clicáveis ganharam **alvos de toque maiores**
  e ocupam a largura disponível.
- O mapa de câmaras se reorganiza em 2 colunas (e 1 coluna em telas muito
  estreitas).
- Margens e espaçamentos foram ajustados para aproveitar melhor a tela.

---

## 5. Mensagens de erro mais explicativas (sem entregar a resposta)

**Problema:** As mensagens de erro **revelavam o resultado** (ex.:
"A(5,3) = 5 × 4 × 3 = 60"), o que tirava o caráter educativo — o jogador via a
resposta sem precisar pensar.

**Solução:** Todas as mensagens de erro foram reescritas para **orientar o método
sem mostrar o número final**. Por exemplo, em vez de dar o resultado, a dica
agora diz: *"Em A(5, 3), multiplique os 3 primeiros fatores decrescentes a partir
do 5. Refaça a conta e escolha novamente."* O mesmo princípio vale para a câmara
discursiva e para as classificações: o jogo explica o caminho, mas o cálculo
continua sendo do jogador.

---

## 6. Nomes de câmara mais ligados ao conteúdo

**Problema:** Os nomes das câmaras (Escriba, Hierofante, Contador…) não davam
pista do assunto tratado, embora combinassem com o tema egípcio.

**Solução:** As câmaras foram renomeadas para refletir o conteúdo **sem serem
literais demais**, mantendo o clima do jogo:

| Antes | Agora | Conteúdo |
|---|---|---|
| Câmara do Escriba | **Câmara da Ordem** | conceito de arranjo (a ordem importa) |
| Câmara do Hierofante | **Câmara das Sequências** | arranjo simples |
| Câmara do Contador | **Câmara dos Ecos** | arranjo com repetição |
| Câmara dos Mistérios | **Câmara dos Enigmas** | problemas aplicados |
| Câmara das Relações | **Câmara do Discernimento** | classificar simples × repetição |
| *(nova)* | **Câmara do Oráculo** | questão discursiva |
| Câmara do Faraó | **Câmara do Faraó** | quiz final |

---

## 7. Feedback de acerto com pontos e avanço automático

**Problema:** Após acertar, era preciso clicar para prosseguir, e nem sempre
ficava claro quantos pontos haviam sido ganhos.

**Solução:** Ao acertar, o jogo agora mostra a **mensagem de sucesso + os pontos
ganhos + a pontuação total** e, em seguida, **avança automaticamente após 3
segundos**. Há também um botão "Avançar agora" para quem não quer esperar. Em
caso de **erro**, o avanço automático **não** ocorre, para que o jogador possa
ler a explicação com calma. Isso vale tanto para a transição entre estágios das
câmaras quanto para o quiz do Faraó.

---

## 8. Caixa de alerta do navegador em vez de um modal do jogo

**Problema:** Ao tocar em "Reiniciar Progresso", o jogo abria a **caixa de alerta
padrão do navegador** (`confirm()`) — cinza, genérica e totalmente fora da
identidade visual egípcia. Isso quebrava a imersão: de repente o jogador era
arrancado da pirâmide para um pop-up de sistema, sem nenhuma ambientação.

**Solução:** A confirmação passou a ser um **modal interativo do próprio jogo**,
no estilo pergaminho/dourado, com hieróglifo, título e uma mensagem temática
("Recomeçar a Jornada? … sua sabedoria se perderá nas areias do tempo"), além dos
botões **"Sim, recomeçar do início"** e **"Não, continuar minha jornada"**. O modal
surge com animação suave, escurece o fundo e pode ser fechado clicando fora dele
ou pela tecla **Esc**. Foi implementado de forma **reutilizável**, pronto para
servir a outras confirmações futuras.

---

## 9. Progresso salvo (não se perde ao recarregar)

**Problema:** Recarregar a página ou fechar a aba por engano apagava todo o
progresso e a pontuação.

**Solução:** O progresso (câmaras concluídas e pontuação) passou a ser
**salvo automaticamente no navegador** (localStorage). Ao reabrir o jogo, tudo é
restaurado — os dados só são perdidos se o jogador escolher reiniciar. Foi
adicionado um botão **"Reiniciar Progresso"** (com confirmação) para quem quiser
recomeçar do zero. Nessa etapa também foi corrigido um problema que **somava os
pontos do quiz em duplicidade** a cada nova tentativa; agora a pontuação do quiz
é sempre **substituída**, mantendo o total correto.

---

## 10. Tela final de comemoração

**Problema:** Ao terminar tudo, não havia um encerramento que recompensasse e
parabenizasse o jogador.

**Solução:** Ao concluir **todas as câmaras**, o jogo abre a
**Câmara do Tesouro** — uma tela final comemorativa com:
- Hieróglifos animados e mensagem de parabéns ao Dr. Aalim;
- A **pontuação final** em destaque;
- Um **resumo da jornada** câmara por câmara;
- Um **sarcófago interativo**: ao tocá-lo, ele se abre e revela o "tesouro" (uma
  mensagem final do Faraó);
- Botões para voltar ao mapa ou recomeçar o jogo.

A tela é acessada por um **botão dedicado** ao concluir a última câmara e também
pelo mapa, quando tudo já está concluído.