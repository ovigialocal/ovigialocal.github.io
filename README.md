# O Vigia — face pública

Portal público de **O Vigia**, jornalismo local de Porto Velho (RO). Este repositório é a autoridade sobre o que efetivamente é publicado e sobre a superfície estática servida ao leitor.

A Redação vive em `franklinbaldo/ovigia-redacao` e termina em `article-ready`. Uma matéria pronta não é sincronizada automaticamente. Um agente deste repo fixa um commit privado, consulta candidatas por pull com `okf-parser` e decide independentemente se aceita uma versão exata sob a marca pública.

```text
article-ready
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

A arquitetura adotada é:

```text
content/articles/<slug>.md        # conteúdo público canônico
publication/reviews/...           # decisões accepted/rejected
publication/events/...            # histórico público confirmado
        ↓
HTML + articles.json + feed + sitemap  # projeções derivadas
```

A candidate key é `(source_repository, source_path, source_digest)`. O ledger Git impede review/issue/publicação duplicada entre sessões sem criar banco, CMS ou sincronizador.

“Copiar Markdown” significa extrair o body editorial aprovado e aplicar uma whitelist de metadados públicos; frontmatter interno, self-review, findings e notas de apuração não são publicados por default.

Leia:

- `docs/rfc/0001-independent-publication-agent.md` — protocolo institucional completo;
- `skills/publication-review/SKILL.md` — procedimento executável;
- `AGENTS.md` — contrato curto para agentes;
- `publication/README.md` — ledger de decisões/eventos.

Enquanto não houver matéria real publicada, a home permanece honestamente vazia. Fixtures de composição só podem existir em preview local.

## Site atual e migração

O site já possui home e página de matéria estáticas, `articles.json`, feed, sitemap e previews locais. A próxima etapa de runtime é fazer essas projeções derivarem de `content/articles/` sem introduzir backend permanente.

## Revisão visual

```bash
npx --yes playwright@1.55.0 install chromium
bash scripts/capture-public-surface.sh
```

As capturas ficam em `artifacts/visual/`; o workflow de captura visual é auxiliar e não faz parte do protocolo de publicação editorial.

## Licenciamento

- Conteúdo jornalístico: `LICENSE-CONTENT` (CC BY 4.0).
- Código-fonte do site: `LICENSE-CODE` (MIT).
