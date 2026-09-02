# RFC 0002 — Superfície editorial de O Vigia sobre Cobogó

Status: **Implementada**  
Data da decisão: 1 de setembro de 2026  
Implementação concluída: 1 de setembro de 2026  
Épica: #39

> Esta revisão consolida o estado implementado da RFC. O plano fase a fase anterior permanece preservado no histórico Git.

## 1. Decisão

O Vigia usa **Cobogó como autoridade compartilhada de foundations web**, sem transformar Cobogó em framework jornalístico e sem terceirizar para o design system decisões editoriais próprias do produto.

A arquitetura final é:

```text
Cobogó core pinado
        ↓
tema/mapeamento de O Vigia
        ↓
gramática editorial de O Vigia
        ↓
Jekyll / GitHub Pages
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
- foundations que possam ser consumidas sem impor identidade ou skeleton de jornal.

O core é consumido de forma pinada e verificável. O CI impede drift silencioso da cópia vendorizada e retorno de contracts genéricos removidos localmente.

### 3.2 O Vigia possui

- marca, paleta e tipografia editorial final;
- masthead, densidade, ritmo e composição da capa;
- manchete, secundárias, últimas, serviço, agenda e acompanhamento;
- taxonomia de editorias e territórios;
- contrato de mídia jornalística;
- página de matéria;
- semântica de publicação, atualização, correção e retirada;
- SEO, canonical, RSS, sitemap e build;
- composição mobile;
- linguagem de metodologia e confiança.

### 3.3 Resultado do upstream

Nenhum `HeadlineCard`, `NewsRail`, `NewspaperMasthead` ou componente jornalístico equivalente foi promovido para Cobogó apenas porque O Vigia passou a usá-lo.

A avaliação de extração foi feita e o resultado foi **não promover ainda**. Relações genéricas só sobem quando houver evidência de reutilização fora do substantivo “notícia”.

## 4. Estado público canônico

O conteúdo público canônico continua sendo:

```text
content/articles/<slug>.md
```

A collection Jekyll é uma projeção byte-idêntica:

```text
content/articles/<slug>.md
        ↓ scripts/build-publication.py
_news/<story_id>.md
        ↓ Jekyll / Pages
/noticias/<story_id>/
```

`articles.json`, RSS e sitemap são templates derivados de `site.news`; não são fontes independentes de verdade.

O quality ratchet verifica identidade byte a byte entre `content/articles` e `_news`.

## 5. Publicação estática e distribuição

Conteúdo essencial existe no HTML entregue. JavaScript é melhoria progressiva para busca, filtros, disclosure e compartilhamento; não é requisito para a notícia existir.

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

A rota legada `article.html?id=...` permanece apenas como compatibilidade/redirecionamento e não é distribuída como URL pública principal.

## 6. Capa editorial

A capa deixou de ser uma grade uniforme de cards e passou a ser composição por módulos com papéis distintos:

- **manchete** dominante, com ou sem mídia;
- **destaques secundários** em rail;
- **últimas** em alta densidade;
- blocos por **editoria** derivados do acervo real;
- **Serviço** para informação prática;
- **Agenda — Hoje / próximos dias** para marcos futuros estruturados;
- **Acompanhe — Histórias abertas** para próximos marcos de acompanhamento;
- acesso persistente a **Territórios** e **Arquivo**.

Hierarquia não depende apenas da classe visual de um card genérico. Tipo e semântica do conteúdo determinam superfícies diferentes.

## 7. Editorias, territórios e arquivo

A arquitetura de descoberta é pública e persistente:

- `editorias.html` deriva categorias reais de `site.news`;
- `territorios.html` agrupa por `locality` e, separadamente, por `bairro` quando esse campo existe;
- `arquivo.html` oferece o acervo cronológico;
- matéria liga para sua editoria e para seu território real;
- capa oferece rotas para editorias, territórios e arquivo.

Uma matéria estadual relevante para Porto Velho não recebe bairro fictício. Granularidade territorial só aumenta quando o estado canônico realmente a informa.

## 8. Mídia editorial

Mídia é opcional e informativa, não decoração para simular aparência de jornal.

Quando `media_url` existe, o contrato exige metadados mínimos como:

- `media_alt`;
- `media_credit`;
- `media_source_url`;
- dimensões estáveis;
- legenda quando aplicável.

Capa e matéria suportam a mesma mídia verificável. O gate rejeita mídia que declara URL sem completar o contrato obrigatório.

## 9. Página de matéria

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

## 10. Mobile

Mobile é uma edição deliberada da mesma decisão editorial.

Há composição específica para telefone, incluindo:

- manchete dominante sem ocupar vários viewports;
- rail secundário refluído conscientemente;
- últimas em alta densidade;
- Serviço e próximos marcos com fluxo próprio;
- metadata compacta;
- alvos de toque adequados;
- escalas específicas para headline, corpo, citações, mídia e compartilhamento.

## 11. Serviço, Agenda e Acompanhe

O frontend não extrai datas de títulos ou corpos por heurística.

O contrato temporal é explícito:

```yaml
next_event_at: "2026-09-03T08:30:00-04:00"
next_event_kind: "prazo"
next_event_label: "Atendimento até 3 de setembro"
```

Marcos futuros de `prazo`, `sessao`, `evento` e `vigencia` entram em Agenda. `acompanhamento` entra em Acompanhe. Itens expirados e matérias sem metadata não ocupam o módulo.

Cada item oferece caminho tanto para a matéria quanto para a fonte verificável.

## 12. Confiança e correções

`metodologia.html` descreve um modelo baseado em fontes verificáveis em geral e permanece verdadeiro independentemente do fornecedor da próxima matéria.

`correcoes.html` distingue:

- correção;
- atualização;
- retirada/retração;
- bug de projeção.

A interface prioriza nome e link da fonte antes de digest técnico.

## 13. Gate de excelência

`scripts/check-public-surface.py` e o workflow visual ratcheiam a arquitetura implementada.

Entre outras coisas, verificam:

- ausência de linguagem residual de protótipo;
- conteúdo essencial estático;
- JS progressivo;
- canonical, OG e `NewsArticle`;
- identidade `content/articles ↔ _news`;
- contrato de mídia;
- contrato temporal;
- editorias, territórios e arquivo;
- ausência da URL legada nas projeções distribuídas;
- budgets simples de CSS/JS.

A captura visual cobre desktop e mobile de:

- capa;
- matéria;
- metodologia;
- correções;
- editorias;
- territórios;
- arquivo.

## 14. Ledger de implementação

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

## 15. Critérios de conclusão

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
- [x] Gates mínimos de integridade, acessibilidade estrutural, budget e evidência visual estão ativos.
- [x] Upstream para Cobogó só ocorreu onde havia authority genérica demonstrada; não houve promoção especulativa de componentes jornalísticos.

## 16. Issues da iniciativa

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
- #50 — gate visual/acessibilidade/performance.

Com os critérios acima integrados e validados, a RFC 0002 passa de plano vivo para **registro da arquitetura implementada**.
