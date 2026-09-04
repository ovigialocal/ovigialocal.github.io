# Vocabulário editorial do O Vigia

Este documento é o contrato semântico de linguagem de O Vigia. Ele existe para que Redação,
publicação, OKF, Astro, CSS, documentação e conversa humana apontem para os mesmos conceitos sem
transformar peça jornalística em mero nome de interface.

A regra não é "traduzir tudo para português". A regra é:

> **Quando um identificador representa diretamente uma peça ou relação editorial, use o conceito
> editorial correto. Quando representa infraestrutura, composição técnica ou compatibilidade de
> dados, use o nome técnico que descreve essa função.**

Isso vale mais do que uniformidade lexical. Um `card` continua sendo card. Uma chamada continua
sendo chamada. E um campo público antigo não precisa ser renomeado só para parecer mais jornalístico.

## 1. Três camadas de linguagem

### 1.1 Vocabulário tradicional de redação

São peças, funções e relações reconhecíveis em produção jornalística: **chapéu, título, manchete,
linha fina, chamada, lide, intertítulo, suíte, olho, boxe, legenda, crédito, assinatura, fio,
expediente, errata**.

Quando o código representa diretamente uma dessas peças, o termo de redação é preferível.

Exemplos:

- `.chapeu`, não `.eyebrow`;
- `.article-linha-fina`, não `.article-deck`;
- campo `chamada`, não `teaser`;
- conceito editorial "suíte", não `follow-up story`.

### 1.2 Conceitos próprios do domínio de O Vigia

O projeto também possui conceitos que um jornal impresso de 1985 não teria necessariamente com
estes nomes, mas que são essenciais ao nosso contrato verificável: **proveniência, candidatura
editorial, digest da candidata, gate, `article-ready`, fonte preservada, caso, marco temporal**.

Esses nomes não devem ser fantasiados de jargão tradicional. Se o conceito é novo, o nome precisa
explicar sua função e ter contrato próprio.

### 1.3 Mecânica técnica da web e do renderer

Estruturas que existem porque a publicação é software continuam técnicas: `grid`, `card`, `modal`,
`nav`, `sticky`, `filter`, `search`, `module-label`, `data-*`, `aria-*`, `slug`, `fallback`.

Não renomeie uma estrutura técnica para um termo de redação apenas porque ela aparece perto de
conteúdo editorial.

Exemplo importante: `module-label` é o rótulo visual/técnico de um módulo da capa. Ele **não é
retranca** por isso.

## 2. Identificador de código não é rótulo de tela

A linguagem tem quatro superfícies diferentes:

1. **conceito editorial** — o que a peça é;
2. **campo persistido** — como o contrato OKF/public API a representa;
3. **estrutura de renderer** — como Astro/CSS organiza a apresentação;
4. **rótulo para o leitor** — o texto efetivamente mostrado.

Essas superfícies podem ter nomes diferentes quando há motivo.

`PublicArticle.description`, por exemplo, continua sendo o campo físico da **linha fina** por
compatibilidade do contrato público. Isso não autoriza tratar linha fina e `description` como
sinônimos universais fora desse contrato.

Da mesma forma, `.lead-story` é um container técnico da matéria que ocupa a posição de manchete.
Não precisamos renomeá-lo para `.manchete` só para provar que conhecemos o termo editorial.

## 3. Forma dos identificadores editoriais

Quando o identificador realmente nomeia uma peça editorial:

- sem acento e sem cedilha no código: `chapeu`, `servico`, `linha-fina`;
- kebab-case para duas ou mais palavras: `linha-fina`, `nota-da-redacao`;
- palavra inteira, sem sigla inventada: `linha-fina`, não `lf`;
- prefixo de superfície quando necessário: `lead-linha-fina`, `article-linha-fina`;
- nomes persistidos novos devem preferir português quando são próprios do domínio de O Vigia:
  `chamada`, `caso_id`, `suite_de`, se e quando esses contratos forem aprovados.

Estabilidade de API vale mais que purismo lexical. Campo público existente não é renomeado em massa
sem migração coordenada de Redação, publicação, acervo e renderer.

## 4. Peças que não são sinônimos

### Título

Nome editorial da matéria. Identifica e resume o fato principal de forma proporcional à evidência.

No contrato público: `title`.

### Manchete

É uma **função de edição/posição**, não um tipo diferente de título: a matéria principal da capa em
uma edição/superfície. Uma matéria pode ser manchete hoje e deixar de sê-lo amanhã sem que seu
`title` mude.

No renderer atual, a posição é ocupada por `.lead-story`.

### Chapéu (ou cartola)

Palavra ou expressão curta acima de um título ou cabeçalho, usada para situar assunto, série,
editoria ou contexto sem repetir o título.

Classe editorial: `.chapeu`.

Não confundir com:

- `module-label`, que é mecânica de composição;
- `category`, que é classificação persistida;
- retranca, termo polissêmico reservado abaixo.

### Linha fina

Complementa o título com informação adicional. Não existe para repetir o título nem para "vender"
a matéria.

No contrato público atual: `description`.

Classes de apresentação: `.edition-linha-fina`, `.lead-linha-fina`,
`.article-linha-fina`, `.linha-fina`.

### Chamada

Peça de capa que aponta para uma matéria. Pode selecionar um aspecto convidativo e concreto da
reportagem, mas não pode prometer o que o texto não entrega.

No contrato editorial/público: `chamada`, opcional.

Regras:

- chamada **não é** linha fina;
- chamada **não é** título alternativo secreto;
- a Redação escreve e aprova a chamada;
- o publicador copia a chamada aprovada;
- Astro só apresenta;
- quando `chamada` está ausente, `description` pode ser usado como fallback visual;
- o fallback não transforma semanticamente a linha fina em chamada.

### Lide

Primeiro parágrafo jornalístico que apresenta o essencial da notícia. É parte do corpo editorial,
não metadata de capa.

Não criar campo `lide` apenas para duplicar o primeiro parágrafo sem necessidade concreta.

### Intertítulo

Título interno que divide uma matéria longa em blocos de leitura. Faz parte do corpo editorial e da
estrutura da reportagem.

Não confundir com label de módulo, chapéu ou título de boxe.

### Olho

Trecho destacado retirado do próprio texto para criar pausa e ênfase durante a leitura. Não deve
introduzir afirmação nova.

Hoje não há contrato estruturado de olho em O Vigia. Se for adotado, o conteúdo deve permanecer
derivável da matéria aprovada ou ser aprovado como peça editorial.

### Boxe (ou quadro)

Bloco autônomo que reúne informação complementar: contexto, números, cronologia, como conferir,
metodologia ou serviço.

Um boxe não é simplesmente qualquer `aside`. O elemento HTML/CSS é mecânica; "boxe" descreve a
função editorial do conteúdo.

O painel "Como conferir esta matéria" é um candidato natural a boxe de proveniência. Uma
visualização de divergência de valores pode ser outro, desde que exista conteúdo/dado aprovado para
sustentá-la.

## 5. Retranca: termo reservado e polissêmico

**Não usar `retranca` como sinônimo genérico de rótulo de seção ou de módulo.**

O termo varia entre redações e meios:

- no Manual de Comunicação do Senado, identifica internamente uma reportagem e permanece estável da
  pauta ao arquivamento;
- em manuais de jornalismo impresso, também aparece como matéria subordinada/complementar ou
  recontextualização de conteúdo anterior;
- há manuais que usam retranca como sinônimo de chapéu.

Por ser polissêmico, O Vigia não o usa como classe visual genérica.

Decisão canônica atual:

- `.module-label` continua técnico e permitido;
- `.chapeu` representa o chapéu visual/editorial quando essa for a função;
- `retranca` fica **reservada** para uma futura necessidade editorial explícita;
- se a Redação adotar retranca como identificador interno ou relação de matéria subordinada, isso
  precisa nascer em contrato OKF próprio antes de aparecer no renderer.

## 6. Continuidade: caso, suíte, série, atualização e matéria relacionada

### Caso

Unidade persistente de acompanhamento de um assunto continuado: processo, contrato, obra,
investigação, política pública ou outro objeto que produz fatos ao longo do tempo.

Caso não é editoria, tag nem similaridade de título.

A modelagem é responsabilidade da Redação e está sendo tratada separadamente. O frontend não
"inventa" casos.

### Suíte

Matéria que dá continuidade a uma reportagem/caso anterior com um novo desdobramento.

Suíte não é:

- qualquer matéria da mesma editoria;
- matéria "relacionada" por algoritmo;
- atualização silenciosa do texto anterior;
- simples repetição de pauta.

A relação precisa ser editorialmente intencional e persistida antes da projeção pública.

### Série

Conjunto editorial deliberado de matérias unidas por proposta comum, que pode ou não acompanhar um
único caso. Série pode ganhar nome ou vinheta; isso não deve ser inferido pelo renderer.

### Atualização

Alteração de uma publicação para acrescentar fato posterior ou nova evidência relevante. Não é
automaticamente uma nova suíte: depende de a Redação decidir atualizar a peça existente ou publicar
novo desdobramento.

### Matéria relacionada

Relação de navegação/apresentação mais fraca. Pode ser derivada de editoria ou outro critério
público, desde que não seja apresentada como relação editorial forte de caso/suíte.

## 7. Editoria, seção, módulo e rótulo

### Editoria

Classificação editorial estável do acervo, como Cidade, Economia, Cultura ou Serviços.

No contrato público atual: `category`.

`category` permanece por compatibilidade; a semântica humana é **editoria**.

### Seção

Área de uma superfície de publicação. Pode corresponder a editoria, agenda, arquivo, destaques etc.

Seção é estrutura de página; nem toda seção precisa existir como conceito persistido.

### Módulo

Unidade de composição do renderer. É termo técnico de produto/layout, não peça editorial por si só.

### `module-label`

Classe técnica para um pequeno rótulo visual que organiza um módulo. Seu texto pode ser "Destaques",
"Hoje / próximos dias", "Histórias abertas" etc.

Não chamar `module-label` de retranca só para eliminar inglês.

## 8. Fonte, proveniência, mídia e autoria

### Fonte factual

Evidência usada para sustentar afirmações da matéria. Pode haver várias fontes materiais.

No contrato público, `source_refs` é a relação forte quando presente. `source_name`/`source_url`
podem existir como projeção compatível.

### Proveniência editorial

Cadeia que permite reconstruir qual candidatura aprovada originou a publicação: repositório,
`story_id`, ready digest e demais locators.

Fonte factual e proveniência editorial não são a mesma coisa.

### Legenda

Texto que explica uma imagem ou peça visual e acrescenta contexto factual útil.

Campo público atual: `media_caption`.

### Crédito

Autoria, órgão, acervo ou origem autoral relevante da mídia.

Campo público atual: `media_credit`.

Crédito não substitui `media_source_url`, que aponta para a origem verificável da peça quando
aplicável.

### Assinatura

Identificação de autoria/responsabilidade editorial da matéria.

A classe técnica existente pode continuar `.article-byline`; não é necessário quebrar o renderer
apenas para traduzir o container. Quando houver um campo persistido de autoria, seu contrato deve
distinguir autor, veículo e responsabilidade editorial.

## 9. Pós-publicação: termos diferentes para atos diferentes

### Correção

Conserto de informação que estava errada na publicação. É o ato editorial.

### Errata

Registro/nota concreta que explicita uma correção. **Errata não é sinônimo de política de
correções.**

Use "política de correções" para o conjunto de regras do veículo.

### Atualização

Acrescenta fato posterior ou nova evidência. O texto original não era necessariamente falso.

### Nota da redação

Acréscimo explicitamente identificado pela Redação para contextualizar uma situação. Não deve ser
usada para esconder correção factual que exigiria errata/correção.

### Retirada

Indisponibilização da matéria na superfície pública, geralmente por risco ou inadequação de
mantê-la disponível naquele estado. O histórico técnico deve permanecer recuperável.

### Retratação

Reconhecimento editorial explícito de que uma publicação ou conclusão material não deve continuar
sendo sustentada. É mais forte que simples correção pontual.

Esses estados precisam respeitar o contrato de correções do projeto; o vocabulário não cria sozinho
um workflow novo.

## 10. Outros termos de redação

| Termo | Semântica em O Vigia | Estado |
| --- | --- | --- |
| **capitular** | primeira letra ampliada no início de texto | conhecido, **não implementado hoje** |
| **bigode** | fio curto usado como remate/separação | conhecido, sem contrato próprio |
| **fio** | linha gráfica de separação | usado em comentários/documentação |
| **vinheta** | marca recorrente de série/seção | futuro, só com necessidade editorial |
| **expediente** | identificação institucional de responsáveis e contato | lacuna de produto |
| **data e local** | informação de localização/tempo de produção quando editorialmente aplicável | não confundir com metadata técnica de publicação |

Termo conhecido não precisa virar classe CSS. O glossário também serve para dizer **o que não
existe ainda**.

## 11. Autoridade e ciclo de vida

| Conceito | Quem cria/edita | Persistência | O renderer pode inventar? |
| --- | --- | --- | --- |
| título | Redação | draft → ready → PublicArticle `title` | não |
| linha fina | Redação | draft → ready → `description` | não |
| chamada | Redação | draft → ready → `chamada` opcional | não |
| lide/corpo | Redação | draft → ready → corpo Markdown | não |
| legenda/crédito | Redação/publicação conforme contrato aprovado | metadata editorial pública | não |
| editoria | Redação | `category` | não |
| caso/suíte | Redação, após contrato próprio | relação OKF | não |
| fonte factual | apuração/Redação | relações de fonte | não |
| proveniência editorial | pipeline | envelope/ledger público | deriva, não inventa |
| manchete | edição da superfície | posição da capa | sim, como seleção/apresentação |
| seção/módulo | face pública | código de composição | sim |
| `module-label` | face pública | código/UI | sim |
| filtro/busca | face pública | código/UI | sim |

"Pode inventar" na coluna do renderer significa criar a **estrutura/apresentação**, nunca fabricar
fato ou copy editorial.

## 12. Compatibilidade dos campos públicos

O contrato semanticamente correto não exige renomear todo o acervo. Mapeamento atual:

| Campo físico | Conceito editorial | Regra |
| --- | --- | --- |
| `title` | título | canônico e aprovado |
| `description` | linha fina | nome físico mantido por compatibilidade |
| `chamada` | chamada | campo novo próprio, opcional |
| `category` | editoria | nome físico mantido por compatibilidade |
| `media_caption` | legenda | contrato de mídia |
| `media_credit` | crédito | contrato de mídia |
| `media_source_url` | origem verificável da mídia | não é crédito |
| `source_refs` | fontes factuais materiais | relação forte |
| `source_digest` | identidade/proveniência da candidatura editorial | não é fonte factual |
| `next_event_*` | marco temporal estruturado | conceito próprio do Vigia, não jargão tradicional |

Não fazer uma migração `category → editoria`, `description → linha_fina` ou
`media_caption → legenda` apenas por estética de nomes. Uma quebra de API só se justifica se houver
ganho semântico/material e migração coordenada.

## 13. Exemplos de composição

### Matéria com chamada própria

- **chapéu:** contexto curto;
- **título:** formula o fato principal;
- **linha fina:** acrescenta informação necessária para compreender o título;
- **chamada:** seleciona para a capa um motivo concreto para abrir a matéria;
- **lide:** abre o texto com o essencial;
- **intertítulos:** organizam o desenvolvimento;
- **boxe:** concentra informação complementar que se sustenta como bloco.

A chamada pode ser mais curta que a linha fina. Não pode ser mais forte que a evidência.

### Matéria sem chamada própria

O `PublicArticle.chamada` permanece ausente. Um card pode mostrar `description` como fallback.

Isso é uma decisão de apresentação. **Não significa que o artigo ganhou uma chamada no contrato
editorial.**

### Duas matérias sobre o mesmo tema

Mesma editoria ou palavras parecidas não bastam para declarar suíte. Até existir relação aprovada de
caso/suíte, a face pública pode mostrá-las como "relacionadas", mas não como sequência editorial
formal.

## 14. Anti-exemplos

Não fazer:

- chamar todo label pequeno de "retranca";
- usar `chamada` como nome elegante para qualquer excerpt;
- gerar chamada no Astro a partir do primeiro parágrafo;
- inferir suíte por categoria, título ou embeddings;
- chamar `source_digest` de "fonte";
- chamar a página de política de correções de "errata";
- renomear `grid`, `card`, `modal` ou `module-label` para jargão de redação;
- criar campo novo só para duplicar informação que já possui autoridade clara;
- transformar fallback visual em dado persistido sem decisão editorial.

## 15. Como estender o vocabulário

Antes de introduzir termo novo:

1. **Defina a coisa.** Que objeto, peça, relação ou ação existe?
2. **Descubra a camada.** É peça de redação, domínio próprio do Vigia ou mecânica web?
3. **Cheque uso profissional.** Se houver termo consolidado, registre o sentido adotado.
4. **Cheque polissemia.** Se manuais divergem, documente a escolha do Vigia em vez de fingir
   universalidade.
5. **Defina autoridade.** Quem pode criar, alterar e publicar esse dado?
6. **Defina persistência.** É campo OKF, relação, corpo editorial, CSS ou apenas label de UI?
7. **Evite duplicação.** Não crie metadata que copie outra peça sem necessidade.
8. **Atualize contrato e gate no mesmo PR** quando a mudança precisar ser protegida.

Nome que só existe no código sem definição é dívida. Definição que não corresponde ao código
também é dívida.

## 16. Migração vigente

Renomeações editoriais obrigatórias, atômicas em CSS + Astro:

| Antes | Agora |
| --- | --- |
| `eyebrow` | `chapeu` |
| `edition-deck` | `edition-linha-fina` |
| `lead-deck` | `lead-linha-fina` |
| `article-deck` | `article-linha-fina` |
| `deck` institucional | `linha-fina` |

Decisões explícitas de **não renomear**:

| Identificador | Decisão |
| --- | --- |
| `module-label` | permanece técnico; não é retranca |
| `card-excerpt` | permanece mecânica de card; conteúdo é `chamada ?? description` |
| `lead-story` | permanece container técnico; a posição editorial é manchete |
| `article-byline` | pode permanecer container técnico; o conceito editorial é assinatura |
| `category` | permanece campo público compatível; semântica é editoria |
| `description` | permanece campo público compatível; semântica é linha fina |
| `media_caption` | permanece campo público compatível; semântica é legenda |
| `media_credit` | permanece campo público compatível; semântica é crédito |

## 17. Referências terminológicas

O Vigia não assume que uma única redação possui o monopólio dos termos. Estas referências servem
para registrar usos profissionais e divergências:

- Manual de Comunicação do Senado — **Retranca**:
  https://www12.senado.leg.br/manualdecomunicacao/glossario/retranca
- Manual de Comunicação do Senado — **Suíte**:
  https://www12.senado.leg.br/manualdecomunicacao/glossario/suite
- Manual de Comunicação do Senado — **Lide**:
  https://www12.senado.leg.br/manualdecomunicacao/glossario/lide
- Manual de Padronização de Redação e Estilo Jornalístico do IFRN — uso de retranca como matéria
  subordinada/recontextualização.
- Guia "Redação Jornalística" do Governo de São Paulo — registra linha fina e um uso alternativo de
  retranca/chapéu.

Quando fontes profissionais divergem, o objetivo deste documento é **fixar o sentido do O Vigia**,
não declarar que os outros usos estão errados.
