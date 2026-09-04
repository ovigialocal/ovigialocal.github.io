# Vocabulário de redação

Padrão de nomes para O Vigia. Vale para classes de CSS, campos de OKF, componentes, comentários,
mensagens de commit e rótulos em tela.

A regra é uma: **o que é conceito editorial usa o termo que uma redação brasileira usa.** Não o
termo em inglês do design de produto, e não um nome que a gente inventou porque descrevia bem.

Por que isso importa mais aqui do que num site qualquer: quem escreve as matérias pensa em chapéu,
linha fina, suíte e boxe. Se o código chama as mesmas coisas de eyebrow, deck, follow-up e callout,
toda conversa entre quem escreve e quem constrói passa por uma tradução — e é nessa tradução que
elemento editorial se transforma em enfeite de página.

## A fronteira

Nem tudo vira jargão de redação. A divisão:

**Conceito editorial → termo de redação.** Coisas que existiriam num jornal de papel: chapéu,
linha fina, manchete, retranca, olho, boxe, chamada, suíte, legenda, crédito, fio.

**Mecânica de web → termo técnico.** Coisas que só existem porque isto é um site: `grid`, `card`,
`modal`, `nav`, `sticky`, `filter`, `search`. Renomear essas para português de redação não
esclarece nada e ninguém acha depois.

O teste: **um diagramador de 1985 reconheceria a coisa?** Se sim, é termo de redação. `.chapeu` sim.
`.modal-overlay` não.

## Forma dos identificadores

- Sem acento e sem cedilha: `chapeu`, `servico`, `retranca`.
- Kebab-case para termos de duas palavras: `linha-fina`, `nota-da-redacao`.
- A palavra inteira, nunca abreviada: `linha-fina`, não `lf`.
- Escopo por prefixo quando o mesmo elemento aparece em superfícies diferentes:
  `lead-linha-fina`, `article-linha-fina`.

## Glossário

### Em uso

| Termo | O que é | Onde aparece |
| --- | --- | --- |
| **chapéu** (ou cartola) | rótulo curto acima do título, dizendo do que se trata | `.chapeu` |
| **manchete** | a principal da capa | `.lead-story` |
| **linha fina** | parágrafo-resumo abaixo do título | `.edition-linha-fina`, `.lead-linha-fina`, `.article-linha-fina` |
| **retranca** | etiqueta que identifica a seção ou o módulo | `.retranca` |
| **editoria** | a área do jornal: Cidade, Economia, Cultura | `.editorial-section`, campo `category` |
| **legenda** | texto que explica a imagem | campo `media_caption` |
| **crédito** | autoria da imagem | campo `media_credit` |
| **capitular** | primeira letra ampliada, abrindo o texto | `.article-body ::first-letter` |
| **errata** | correção publicada de erro anterior | página Correções |
| **acervo** | o conjunto do que já foi publicado | Arquivo |
| **fio** | a linha de separação. O nome tipográfico do que estávamos chamando de "régua" | comentários do CSS |
| **bigode** | fio curto sob um título, como remate | — |
| **lide** | o primeiro parágrafo, que carrega o essencial | — |

### A adotar

| Termo | O que é | O que muda no produto |
| --- | --- | --- |
| **suíte** | a matéria que continua um caso já publicado | Hoje as matérias do concurso, do lixo e da EMDUR são suítes umas das outras e aparecem soltas. A modelagem de caso/suíte é acompanhada na Redação antes de qualquer inferência no frontend. |
| **chamada** | o texto de capa que aponta para a matéria de dentro | Campo próprio no OKF público e editorial; a linha fina é fallback apenas quando a matéria não possui chamada aprovada. |
| **boxe** (ou quadro) | bloco fechado, com informação que se sustenta sozinha, ao lado do texto | O painel "Como conferir" já é um boxe. A figura da divergência de valores seria outro. Vale nomear o padrão. |
| **olho** | trecho do próprio texto, ampliado no meio da coluna | Respiro em matéria longa. Hoje só existe citação de fonte. |
| **vinheta** | marca gráfica recorrente de uma série | Uma série/caso pode ganhar marca recorrente quando isso fizer sentido editorial. |
| **expediente** | quem edita, quem responde, endereço | Um veículo precisa ter. Não existe. |
| **nota da redação** | acréscimo assinado depois da publicação | Diferente de errata: não corrige erro, contextualiza. |

### Não usar

Importações do inglês de design, com o termo certo ao lado:

| Não | Sim |
| --- | --- |
| eyebrow, kicker | chapéu |
| deck, standfirst, subhead | linha fina |
| pull quote | olho |
| callout, sidebar box | boxe |
| follow-up | suíte |
| teaser, blurb | chamada |
| hero | manchete |
| byline | assinatura |
| dateline | data e local |
| corrections policy | errata |
| rule, divider | fio |

Inventos nossos, aposentados:

| Não | Sim |
| --- | --- |
| trilha de destaques | destaques |
| ficha de proveniência | fonte, ou boxe de proveniência |
| módulo temporal | agenda ou boxe de prazos, conforme a função |
| trust column | coluna de apoio |
| régua (a linha) | fio |
| régua (a escala de espaço) | escala, ou grade |

## Como estender

Se precisar de um nome que não está aqui, **não invente**. Três testes, nesta ordem:

1. **Existe termo de redação?** Um manual de redação, um diagramador ou alguém que fez jornal
   impresso sabe o nome. Use esse. Adicione ao glossário.
2. **É mecânica de web?** Então o nome técnico em inglês está certo: `grid`, `modal`, `sticky`.
3. **É conceito novo, que nenhum jornal teve?** Aí o nome é nosso, e a regra é: descreva a função
   em uma palavra de português, sem metáfora. "Proveniência" serve. "Ficha de proveniência" não —
   já é dois substantivos e uma imagem.

Nome novo entra no glossário no mesmo commit em que aparece no código. Nome que só existe no código
é dívida.

## Onde isso se aplica

- **Classes de CSS** — chapéu, linha fina e retranca usam o vocabulário de redação.
- **Campos de OKF** — `chamada` é campo editorial; caso/suíte exigem contrato relacional antes de aparecer no site.
- **Rótulos em tela** — o leitor vê "Editoria", "Acervo", "Correções". Termos de bastidor só aparecem quando comunicam algo útil ao leitor.
- **Comentários de código** — é onde mais escapa inglês e invento. Escreva o comentário com o termo do glossário.
- **Mensagens de commit** — `ui: chapéu em Archivo` diz mais que `ui: fix eyebrow styles`.
- **Conversa com a Redação** — se o código usa o vocabulário dela, a revisão de uma peça de UI pode ser feita por quem escreve.

## Migração

Renomeações obrigatórias, sempre de forma atômica em CSS + Astro:

| Antes | Agora |
| --- | --- |
| `eyebrow` | `chapeu` |
| `module-label` | `retranca` |
| `edition-deck` | `edition-linha-fina` |
| `lead-deck` | `lead-linha-fina` |
| `article-deck` | `article-linha-fina` |
| `deck` (institucional) | `linha-fina` |

`card-excerpt` continua sendo nome de mecânica de card. O **conteúdo** mostrado nele passa a ser `chamada ?? description`; não se renomeia a classe para fingir que todo card possui uma chamada editorial própria.
