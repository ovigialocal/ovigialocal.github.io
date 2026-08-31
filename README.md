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

## Estado canônico

```text
content/articles/<slug>.md        # conteúdo público canônico
publication/reviews/...           # decisões accepted/rejected em main
publication/events/...            # histórico público confirmado
publication/<story>/<digest> PR   # reserva/transação in-flight
        ↓
HTML + articles.json + feed + sitemap  # projeções derivadas
```

A candidate key é:

```text
(source_repository, story_id, article_ready_source_digest)
```

`source_path`/commit são proveniência, não identidade. Assim, rename privado não gera segunda publicação.

Antes da review, o envelope deve fixar subject/profile/approvals por digest e provar que body/title/description são os mesmos bytes editoriais aprovados.

O ledger usa percent-encoding de story/digest em filenames; não grava `sha256:...` cru em path e não cria novo hash.

Sessões consultam decisões em `main` e PRs/transações abertas. Uma candidatura já reservada é retomada, não revisada em paralelo.

“Copiar Markdown” significa extrair o conteúdo editorial aprovado e aplicar whitelist de metadados públicos; frontmatter interno, self-review, findings, wiki/experience e notas de apuração não são publicados por default.

Leia:

- `docs/rfc/0001-independent-publication-agent.md` — protocolo institucional completo;
- `skills/publication-review/SKILL.md` — procedimento executável;
- `AGENTS.md` — contrato curto para agentes;
- `publication/README.md` — ledger/transações/eventos.

Enquanto não houver matéria real publicada, a home permanece honestamente vazia. Fixtures de composição só podem existir em preview local.

## Site atual e migração

O site já possui home e página de matéria estáticas, `articles.json`, feed, sitemap e previews locais. A próxima etapa de runtime é fazer essas projeções derivarem de `content/articles/` sem introduzir backend permanente.

## Revisão visual

```bash
npx --yes playwright@1.55.0 install chromium
bash scripts/capture-public-surface.sh
```

As capturas ficam em `artifacts/visual/`; o workflow de captura visual é auxiliar e não faz parte do protocolo editorial Redação → Publicação.

## Licenciamento

- Conteúdo jornalístico: `LICENSE-CONTENT` (CC BY 4.0).
- Código-fonte do site: `LICENSE-CODE` (MIT).
