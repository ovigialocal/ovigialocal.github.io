# O Vigia — face pública

Portal público de **O Vigia**, jornalismo local de Porto Velho (RO). Este repositório é a autoridade sobre o que efetivamente é publicado e sobre a superfície estática servida ao leitor.

A Redação vive em `franklinbaldo/ovigia-redacao` e termina em um `article-ready` fechado por digests do `okf-parser`. Uma matéria pronta não é sincronizada automaticamente. Um agente deste repo fixa um commit privado, valida a oferta, reserva uma transação Git e decide independentemente se aceita aquela candidatura sob a marca pública.

```text
article-ready fechado
     ║ pull
publication-review
  ┌──┴──┐
reject accept
  ↓      ↓
ficha   PublicArticle canônico
          ↓
      OKF → Astro
          ↓
      Pages / URL
```

## Estado canônico e renderer

```text
content/articles/<slug>.md        # PublicArticle canônico
content/territories/<slug>.md     # PublicTerritory canônico
publication/reviews/...           # decisões accepted/rejected em main
publication/events/...            # histórico público confirmado
publication/<story>/<digest> PR   # reserva/transação in-flight
        ↓
okf-parser
        ↓
src/generated/okf-schema.ts       # contrato gerado e versionado
        ↓
Astro Content Layer
        ↓
HTML + articles.json + RSS + sitemap + Pagefind
        ↓
GitHub Pages
```

`content/` é o bundle OKF público. `okf-parser` possui a semântica do conteúdo e gera o Zod consumido pelo Astro; o frontend não mantém uma segunda definição do frontmatter. Astro possui apresentação e gera a superfície pública estaticamente. Não existe espelho `_news` nem renderer Jekyll/Liquid.

Os conceitos públicos iniciais são `PublicArticle` e `PublicTerritory`. Artigos referenciam territórios explicitamente; a UI não inventa identidade territorial a partir de strings. `PublicTerritory.name` é chave relacional e `title` é o rótulo humano.

A candidate key de publicação é:

```text
(source_repository, story_id, article_ready_source_digest)
```

`source_path`/commit são proveniência, não identidade. Assim, rename privado não gera segunda publicação. Antes da review, o envelope deve fixar subject/profile/approvals por digest e provar que body/title/description são os mesmos bytes editoriais aprovados.

## Superfície editorial

O Vigia é um consumidor real do **Cobogó vNext**. A fundação compartilhada chega pelo preset Panda commit-pinado; não há snapshot CSS vendorizado do Cobogó.

```text
cobogo/preset (Panda CSS)
        ↓
tokens + recipes + contracts web compartilhados
        ↓
composição editorial própria de O Vigia
        ↓
Astro Components + Astro Content Layer
        ↓
capa / matéria / editorias / territórios / arquivo / páginas institucionais
```

O parentesco visual com os outros projetos vem da fundação Cobogó: papel/ink, acentos lime/coral/blue, escala, estados, foco e recipes. O Vigia continua dono do que o torna jornal: masthead, tipografia editorial, leitura serifada, densidade, hierarquia de notícias, editorias, territórios, Serviço, Agenda/Acompanhe, matéria e linguagem de confiança.

Panda é ferramenta de styling, não runtime do produto. O site continua Astro SSG e não adiciona React/Svelte para estilização. `styled-system/` é gerado e descartável.

A capa é composta por manchete, rail de destaques, últimas, Serviço, Agenda/Acompanhe e blocos de editoria. Matérias possuem URL estática, metadata social, `NewsArticle`, fontes verificáveis, proveniência progressiva, correções, relacionados e suporte opcional a mídia documental com crédito/origem.

Astro Components são o baseline. `astro-pagefind`, `@astrojs/rss` e `@astrojs/sitemap` substituem infraestrutura própria onde faz sentido.

Leia:

- `docs/rfc/0001-independent-publication-agent.md` — protocolo institucional de publicação;
- `docs/rfc/0002-editorial-surface-cobogo.md` — decisões editoriais que permanecem locais;
- `docs/editorial-media-contract.md` — mídia verificável;
- `docs/editorial-temporal-contract.md` — Serviço/Agenda/Acompanhe;
- `skills/publication-review/SKILL.md` — procedimento executável;
- `AGENTS.md` — contrato curto para agentes;
- `publication/README.md` — ledger/transações/eventos.

## Cobogó/Panda

A dependência é deliberadamente pinada a um commit do Cobogó. A configuração fica em `panda.config.ts` e importa `cobogo/preset`. O build executa `panda codegen` antes do Astro; o código usa `styled-system/css` e recipes compartilhados quando a decisão é genérica.

CSS local continua válido para uma decisão genuinamente jornalística. O critério é simples: fundamento reutilizável pertence ao Cobogó; organismo editorial pertence ao Vigia. Não copie `core.css`, não mantenha uma segunda tabela de tokens genéricos e não recrie localmente contracts compartilhados de foco/motion.

## Validação

Depois de alterar renderer ou conteúdo canônico:

```bash
python scripts/check-astro-okf-contract.py
python scripts/check-cobogo-core.py
python scripts/check-public-surface.py
bun install --frozen-lockfile
bun run check
bun run build
```

`scripts/check-cobogo-core.py` ratcheia a arquitetura Panda-first: dependência Cobogó pinada, preset ativo, ausência do antigo vendor e fronteira entre foundation compartilhada e composição editorial local.

`scripts/build-publication.py` permanece como alias de compatibilidade para sessões antigas e delega ao contrato OKF → Astro; ele não gera projeções.

O workflow `Visual capture` executa os mesmos gates, constrói `dist/` com Astro e captura a superfície pública em desktop/mobile. O deploy de `main` usa `withastro/action` e `actions/deploy-pages`.

## Licenciamento

- Conteúdo jornalístico: `LICENSE-CONTENT` (CC BY 4.0).
- Código-fonte do site: `LICENSE-CODE` (MIT).
