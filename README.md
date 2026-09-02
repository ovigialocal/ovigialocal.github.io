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
issue   Markdown público
          ↓
      Pages / URL
```

## Estado canônico e projeções

```text
content/articles/<slug>.md        # conteúdo público canônico
publication/reviews/...           # decisões accepted/rejected em main
publication/events/...            # histórico público confirmado
publication/<story>/<digest> PR   # reserva/transação in-flight
        ↓
scripts/build-publication.py
        ↓
_news/<story_id>.md               # espelho byte-idêntico para a collection Jekyll
        ↓
GitHub Pages / Jekyll
        ↓
/noticias/<story_id>/ + capa + editorias + arquivo + JSON + RSS + sitemap
```

`content/articles/` continua sendo a única autoridade editorial pública. `_news/` é uma projeção determinística e o gate falha se algum arquivo deixar de ser byte-idêntico ao canônico. Jekyll é o renderer das projeções web; JavaScript só melhora busca, filtros, disclosure e compartilhamento.

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
→ composição editorial própria
→ capa / matéria / editorias / arquivo / metodologia / correções
```

Cobogó possui foundations compartilhadas; O Vigia continua dono de marca, tipografia editorial, densidade, hierarquia de notícias e semântica jornalística.

A capa é composta por manchete, rail de destaques, últimas, Serviço e blocos de editoria. Matérias possuem URL estática, metadata social, `NewsArticle`, fonte verificável, proveniência progressiva, correções, relacionados e suporte opcional a mídia documental com crédito/origem.

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
python scripts/build-publication.py
python scripts/build-publication.py --check
python scripts/check-cobogo-core.py
python scripts/check-public-surface.py
```

O workflow `Visual capture` constrói o mesmo Jekyll usado pelo Pages e captura home, matéria, metodologia, correções, editorias e arquivo em desktop/mobile.

## Licenciamento

- Conteúdo jornalístico: `LICENSE-CONTENT` (CC BY 4.0).
- Código-fonte do site: `LICENSE-CODE` (MIT).
