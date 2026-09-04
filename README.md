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
issue   PublicArticle canônico
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

`source_path`/commit são proveniência, não identidade. Assim, rename privado não gera segunda publicação.

Antes da review, o envelope deve fixar subject/profile/approvals por digest e provar que body/title/description são os mesmos bytes editoriais aprovados.

O ledger usa percent-encoding de story/digest em filenames; não grava `sha256:...` cru em path e não cria novo hash.

Sessões consultam decisões em `main` e PRs/transações abertas. Uma candidatura já reservada é retomada, não revisada em paralelo.

“Copiar Markdown” significa extrair o conteúdo editorial aprovado e aplicar whitelist de metadados públicos; frontmatter interno, self-review, findings, wiki/experience e notas de apuração não são publicados por default.

## Superfície editorial

A arquitetura visual segue a RFC 0002:

```text
Cobogó core
→ tema de O Vigia
→ composição editorial própria em Astro Components
→ capa / matéria / editorias / territórios / arquivo / metodologia / correções
```

Cobogó possui foundations compartilhadas; O Vigia continua dono de marca, tipografia editorial, densidade, hierarquia de notícias e semântica jornalística.

A capa é composta por manchete, rail de destaques, últimas, Serviço, Agenda/Acompanhe e blocos de editoria. Matérias possuem URL estática, metadata social, `NewsArticle`, fonte verificável, proveniência progressiva, correções, relacionados e suporte opcional a mídia documental com crédito/origem.

Astro Components são o baseline. Não há framework UI hidratado por padrão. `astro-pagefind`, `@astrojs/rss` e `@astrojs/sitemap` substituem infraestrutura própria onde faz sentido.

### Edições e URLs permanentes

O namespace público reserva a raiz para selecionar a edição e mantém cidade e matéria em segmentos estáveis:

```text
/                                      # roteador/seletor de edição
/porto-velho/                          # capa da edição
/porto-velho/noticias/<story_id>/      # matéria permanente
```

O roteador respeita primeiro a edição salva no navegador. Na primeira visita, tenta uma localização aproximada por IP com timeout curto e usa Porto Velho como fallback. A edição pode ser trocada manualmente; quando houver outra cidade coberta significativamente mais próxima, a capa poderá sugeri-la sem substituir a preferência do leitor. URLs antigas em `/noticias/<story_id>/` permanecem como redirects permanentes.

Leia:

- `docs/rfc/0001-independent-publication-agent.md` — protocolo institucional de publicação;
- `docs/rfc/0002-editorial-surface-cobogo.md` — plano/decisões da superfície editorial;
- `docs/editorial-media-contract.md` — mídia verificável;
- `docs/editorial-temporal-contract.md` — Serviço/Agenda/Acompanhe;
- `skills/publication-review/SKILL.md` — procedimento executável;
- `AGENTS.md` — contrato curto para agentes;
- `publication/README.md` — ledger/transações/eventos.

## Validação

Depois de adicionar ou alterar Markdown canônico:

```bash
python scripts/check-astro-okf-contract.py
python scripts/check-cobogo-core.py
python scripts/check-public-surface.py
bun install --frozen-lockfile
bun run check
bun run build
```

`scripts/build-publication.py` permanece como alias de compatibilidade para sessões antigas e delega ao contrato OKF → Astro; ele não gera projeções.

O workflow `Visual capture` executa os mesmos gates, constrói `dist/` com Astro e captura a superfície pública em desktop/mobile. O deploy de `main` usa `withastro/action` e `actions/deploy-pages`.

## Licenciamento

- Conteúdo jornalístico: `LICENSE-CONTENT` (CC BY 4.0).
- Código-fonte do site: `LICENSE-CODE` (MIT).
