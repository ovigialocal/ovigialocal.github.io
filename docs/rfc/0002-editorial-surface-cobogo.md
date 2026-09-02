# RFC 0002 — Superfície editorial de O Vigia sobre Cobogó

Status: **Em revisão — atualização Astro/OKF**  
Data da decisão: 1 de setembro de 2026  
Implementação editorial original: 1 de setembro de 2026  
Correção arquitetural do renderer: #69, pilha #70 → #75  
Épica: #39

> A gramática editorial desta RFC permanece válida. A correção #69 substitui apenas a camada Jekyll/Liquid por Astro SSG e formaliza o conteúdo público como bundle OKF. A RFC volta temporariamente a “Em revisão” até a pilha #70 → #75 ser integrada.

## 1. Decisão

O Vigia usa **Cobogó como autoridade compartilhada de foundations web**, sem transformar Cobogó em framework jornalístico e sem terceirizar para o design system decisões editoriais próprias do produto.

A arquitetura alvo é:

```text
Cobogó core pinado
        ↓
tema/mapeamento de O Vigia
        ↓
gramática editorial de O Vigia
        ↓
Astro Components + Astro Content Layer
        ↑
OKF público (PublicArticle + PublicTerritory)
        ↓
Astro SSG / GitHub Pages
        ↓
capa + matérias + editorias + territórios + arquivo + páginas institucionais
```

A meta nunca foi fazer O Vigia “parecer Cobogó”. Cobogó possui relações genéricas reutilizáveis; O Vigia possui a identidade e a composição jornalística.

## 2. Princípio editorial de produto

O Vigia é um jornal local cuja confiança nasce da possibilidade de verificar a sustentação factual de suas matérias.

Não existe fonte privilegiada por fornecedor. Uma matéria pode nascer de prefeitura, governo estadual, Diário Oficial, IBGE, tribunal de contas, universidade, base pública, documento ou outra fonte adequada, desde que a formulação publicada seja sustentada pela evidência disponível e essa sustentação seja recuperável pelo leitor.

A experiência segue a regra:

> primeiro jornal; depois transparência técnica progressivamente disponível.

Fonte oficial não é tratada como verdade automática. O produto distingue fato documentado, cálculo, inferência, incerteza, atualização e correção.

## 3. Fronteira de autoridade

### 3.1 Cobogó possui

- baseline e contracts web genéricos;
- roles/tokens compartilhados de superfície, texto, foco e estado;
- `focus-visible` e contracts genéricos de acessibilidade;
- reduced motion e comportamento estrutural reutilizável;
- foundations consumíveis sem impor identidade ou skeleton de jornal.

O core é consumido de forma pinada e verificável. O CI impede drift silencioso da cópia vendorizada e retorno de contracts genéricos removidos localmente.

### 3.2 `okf-parser` possui

- semântica e validação do bundle público;
- TypeContracts de `PublicArticle` e `PublicTerritory`;
- relações entre artigos e territórios;
- geração do Zod usado pelo Astro Content Layer.

Astro **não** mantém schema manual paralelo e não reinterpreta frontmatter OKF.

### 3.3 O Vigia possui

- marca, paleta e tipografia editorial final;
- masthead, densidade, ritmo e composição da capa;
- manchete, secundárias, últimas, serviço, agenda e acompanhamento;
- taxonomia editorial e conceitos territoriais públicos;
- contrato de mídia jornalística;
- página de matéria;
- semântica de publicação, atualização, correção e retirada;
- SEO, canonical, RSS, sitemap, Pagefind e build;
- composição mobile;
- linguagem de metodologia e confiança.

### 3.4 Resultado do upstream

Nenhum `HeadlineCard`, `NewsRail`, `NewspaperMasthead` ou componente jornalístico equivalente é promovido para Cobogó apenas porque O Vigia o usa.

Relações genéricas só sobem quando houver evidência de reutilização fora do substantivo “notícia”.

## 4. Estado público canônico

O estado editorial público vive em um bundle OKF:

```text
content/articles/<slug>.md      # PublicArticle
content/territories/<slug>.md  # PublicTerritory
```

O contrato de renderização é:

```text
content/
  ↓ okf-parser check
TypeContracts + relações
  ↓ okf-parser schema --format zod --zod-import astro
src/generated/okf-schema.ts
  ↓
Astro Content Layer
  ↓
HTML + articles.json + RSS + sitemap + Pagefind
```

O Zod gerado é versionado para build hermético e regenerado em CI para detectar drift.

Não existe `_news` nem segunda cópia Markdown para o renderer. `dist/` é artefato descartável.

### 4.1 Conceitos territoriais

`PublicTerritory` possui identidade própria e hierarquia opcional. O contrato inicial explicita:

```text
PublicArticle.locality / bairro → PublicTerritory(name)
PublicTerritory.parent_territory_id → PublicTerritory(territory_id)
```

`territory_id` é identidade/URL estável; `name` é chave relacional publicada; `title` é rótulo humano.

Exemplo:

```yaml
type: PublicTerritory
territory_id: porto-velho
name: "Porto Velho, RO"
title: Porto Velho
kind: municipio
parent_territory_id: rondonia
```

A UI não cria território por `slugify()` de texto arbitrário. Relação quebrada falha no contrato.

## 5. Publicação estática e distribuição

Conteúdo essencial existe no HTML entregue. JavaScript é melhoria progressiva para busca, filtros, disclosure, compartilhamento e compatibilidade; não é requisito para a notícia existir.

Cada matéria possui:

- URL estável `/noticias/<story_id>/`;
- `<title>` e description próprios;
- canonical;
- Open Graph;
- JSON-LD `NewsArticle`;
- data de publicação e atualização quando aplicável;
- autoria institucional;
- fonte verificável;
- URL canônica usada também por compartilhamento, RSS, sitemap e JSON.

A rota legada `article.html?id=...` permanece apenas como redirecionamento de compatibilidade e não é distribuída como URL pública principal.

O deploy usa `withastro/action@v6` + `actions/deploy-pages@v5`, Bun 1.3.8 explícito e lockfile congelado.

## 6. Componentes Astro de conceito

Conceitos públicos relevantes possuem representação Astro de primeira classe:

```text
PublicArticle
  → CollectionEntry<'articles'>
  → PublicArticleCard.astro
  → /noticias/<story_id>/

PublicTerritory
  → CollectionEntry<'territories'>
  → PublicTerritoryCard.astro
  → PublicTerritoryHeader.astro
  → /territorios/<territory_id>/
```

Componentes recebem os tipos derivados do Content Layer. Não criam interfaces paralelas que redescrevem o frontmatter.

A capa pode usar organismos editoriais próprios em vez de `PublicArticleCard` quando a hierarquia exige uma composição especial; componentizar conceito não significa uniformizar toda notícia em um card genérico.

## 7. Capa editorial

A capa é composição por módulos com papéis distintos:

- **manchete** dominante, com ou sem mídia;
- **destaques secundários** em rail;
- **últimas** em alta densidade;
- blocos por **editoria** derivados do acervo real;
- **Serviço** para informação prática;
- **Agenda — Hoje / próximos dias** para marcos futuros estruturados;
- **Acompanhe — Histórias abertas** para próximos marcos de acompanhamento;
- acesso persistente a **Territórios** e **Arquivo**.

Hierarquia não depende apenas de uma grade uniforme de cards nem exclusivamente da posição num array.

## 8. Editorias, territórios e arquivo

A arquitetura de descoberta é pública e persistente:

- `editorias.html` deriva categorias reais de `getCollection('articles')`;
- `territorios.html` deriva conceitos `PublicTerritory` publicados;
- `/territorios/<territory_id>/` é uma página estática própria;
- `arquivo.html` oferece o acervo cronológico e busca estática Pagefind;
- matéria resolve sua relação territorial pela collection tipada;
- capa oferece rotas para editorias, territórios e arquivo.

Uma matéria estadual relevante para Porto Velho não recebe bairro fictício. Granularidade territorial só aumenta quando o estado canônico realmente a informa.

## 9. Mídia editorial

Mídia é opcional e informativa, não decoração para simular aparência de jornal.

Quando `media_url` existe, o contrato exige metadados mínimos como:

- `media_alt`;
- `media_credit`;
- `media_source_url`;
- dimensões estáveis;
- legenda quando aplicável.

Capa e matéria suportam a mesma mídia verificável. O gate rejeita mídia que declara URL sem completar o contrato obrigatório.

## 10. Página de matéria

Uma URL direta se sustenta como página completa de jornal, com:

- editoria e território navegáveis;
- publicação e atualização;
- autoria institucional `O Vigia`;
- título, linha fina e longform;
- mídia, legenda, crédito e origem quando houver;
- fonte principal visível;
- proveniência técnica em disclosure progressivo;
- correções;
- compartilhamento canônico;
- matérias relacionadas;
- caminhos para continuar por editoria, território e metodologia.

Hash/digest continua sendo detalhe auditável, não linguagem primária de confiança.

## 11. Mobile

Mobile é uma edição deliberada da mesma decisão editorial.

Há composição específica para telefone, incluindo:

- manchete dominante sem ocupar vários viewports desnecessariamente;
- rail secundário refluído conscientemente;
- últimas em alta densidade;
- Serviço e próximos marcos com fluxo próprio;
- metadata compacta;
- alvos de toque adequados;
- escalas específicas para headline, corpo, citações, mídia e compartilhamento.

## 12. Serviço, Agenda e Acompanhe

O frontend não extrai datas de títulos ou corpos por heurística.

O contrato temporal é explícito:

```yaml
next_event_at: "2026-09-03T08:30:00-04:00"
next_event_kind: "prazo"
next_event_label: "Atendimento até 3 de setembro"
```

Marcos futuros de `prazo`, `sessao`, `evento` e `vigencia` entram em Agenda. `acompanhamento` entra em Acompanhe. Itens expirados e matérias sem metadata não ocupam o módulo.

Cada item oferece caminho tanto para a matéria quanto para a fonte verificável.

## 13. Confiança e correções

`metodologia.html` descreve um modelo baseado em fontes verificáveis em geral e permanece verdadeiro independentemente do fornecedor da próxima matéria.

`correcoes.html` distingue:

- correção;
- atualização;
- retirada/retração;
- bug de renderer/metadado público.

A interface prioriza nome e link da fonte antes de digest técnico.

## 14. Gate de excelência

`scripts/check-astro-okf-contract.py`, `scripts/check-public-surface.py` e o workflow visual ratcheiam a arquitetura.

Entre outras coisas, verificam:

- bundle OKF conforme e Zod gerado sem drift;
- ausência de schema/frontmatter parser paralelo;
- ausência de Jekyll/Liquid/`_news` após o cutover;
- conteúdo essencial estático;
- JS progressivo;
- canonical, OG e `NewsArticle`;
- relações `PublicArticle ↔ PublicTerritory`;
- componentes Astro tipados dos conceitos;
- contrato de mídia e temporal;
- editorias, territórios e arquivo;
- redirect legado sem contaminar URLs distribuídas;
- deploy Astro pinado;
- budgets simples de CSS;
- coerência entre RFC, `AGENTS.md`, README e skill de publicação.

A captura visual cobre desktop e mobile de:

- capa;
- matéria;
- detalhe de `PublicTerritory`;
- metodologia;
- correções;
- editorias;
- índice de territórios;
- arquivo.

## 15. Ledger de implementação

| Fase | Entrega | PR |
| --- | --- | --- |
| 0 | decisão arquitetural e plano vivo | #51 |
| 1 | adoção brownfield do Cobogó core | #52 |
| 2 | HTML estático, URLs e shell de publicação | #53 |
| 3 | composição modular da capa | #54 |
| 4 | matéria completa e contrato de mídia | #55 |
| 5 | edição mobile e contrato temporal | #56 |
| 6 | metodologia, correções e gate de excelência | #57 |
| follow-up | distribuição canônica, editorias e arquivo | #58 |
| fechamento fase 5 | Agenda/Acompanhe estruturados | #66 |
| fechamento fase 2 | navegação territorial persistente | #67 |
| correção do renderer | issue: Jekyll/Liquid → Astro SSG | #69 |
| correção do renderer A | foundation Astro + bundle OKF relacional | #70 |
| correção do renderer B | cutover completo + componentes/páginas/deploy | #75 |

A pilha #70 → #75 não reabre as decisões editoriais anteriores: ela remove dívida do renderer, converte os conceitos públicos em contrato OKF explícito e faz o Astro consumir esse contrato diretamente.

## 16. Critérios de conclusão

Decisões editoriais já implementadas:

- [x] O Vigia consome Cobogó como foundation compartilhada sem fork local da authority adotada.
- [x] A home é composição de jornal, não grade uniforme de cards.
- [x] Editorias e territórios são arquitetura navegável.
- [x] Arquivo e recência têm rota persistente.
- [x] Matéria direta é experiência completa.
- [x] Mídia verificável possui contrato claro e é opcional.
- [x] Mobile possui composição deliberada.
- [x] Serviço, Agenda e Acompanhe possuem semântica estruturada.
- [x] Metodologia reflete fontes verificáveis em geral.
- [x] HTML, canonical e metadata social existem sem JS para conteúdo essencial.
- [x] RSS, sitemap e JSON distribuem a mesma URL canônica.
- [x] Upstream para Cobogó só ocorreu onde havia authority genérica demonstrada.

Correção arquitetural #69:

- [x] #70 prova Astro 7.2.10/Bun 1.3.8, Content Layer e contrato OKF relacional com CI verde.
- [x] #75 remove Jekyll/Liquid/`_news` da árvore de cutover.
- [x] `PublicArticle` e `PublicTerritory` usam Zod gerado pelo `okf-parser`, sem schema paralelo.
- [x] componentes `.astro` recebem `CollectionEntry` tipado dos conceitos.
- [x] páginas territoriais estáticas existem e são cobertas pelo gate visual.
- [x] Pagefind, RSS, sitemap, canonical e JSON usam o mesmo Content Layer.
- [x] deploy usa Astro Pages com Bun pinado e lock congelado.
- [x] contrato operacional/RFC/skill foram migrados junto com o código.
- [ ] #70 integrada em `main` após revisão.
- [ ] #75 integrada em `main` após #70 e deploy confirmado.

Quando os dois últimos itens forem concluídos, esta RFC volta a **Implementada**.

## 17. Issues da iniciativa

- #39 — épica;
- #40 — composição editorial da capa;
- #41 — masthead e navegação;
- #42 — mídia editorial;
- #43 — página de matéria;
- #44 — metodologia/confiança;
- #45 — mobile;
- #46 — publicação estática/SEO/distribuição;
- #47 — arquitetura de informação e territórios;
- #48 — adoção de foundation/design authority;
- #49 — serviço/agenda/acompanhamento;
- #50 — gate visual/acessibilidade/performance;
- #69 — correção do renderer para Astro + contrato OKF público.

A RFC permanece plano vivo até a integração da pilha #70 → #75 e a confirmação do primeiro deploy Astro em `main`.
