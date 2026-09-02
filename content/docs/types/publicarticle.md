---
type: Spec
---

# PublicArticle

`PublicArticle` é a matéria aceita pela autoridade pública de O Vigia e armazenada em `content/articles/`.

## Semântica

- `title` e `description` são o título e a linha fina editoriais aprovados para publicação.
- `story_id` é a identidade estável usada na URL pública `/noticias/<story_id>/`.
- `locality` e `category` descrevem a organização pública da matéria sem fabricar território ausente.
- `published_at` registra a publicação; `updated_at`, quando presente, registra atualização material da versão pública.
- `source_repository`, `source_commit`, `source_path` e `source_digest` preservam a proveniência da candidatura aprovada.
- `source_name` e `source_url` são a apresentação pública mínima da fonte verificável.
- `next_event_at`, `next_event_kind` e `next_event_label` são opcionais e só existem quando há um próximo marco verificável adequado a Agenda/Acompanhe.
- campos de mídia editorial são opcionais e, quando usados, devem obedecer ao contrato de mídia pública do repositório.

O corpo Markdown é conteúdo editorial público canônico. Astro não redefine esta semântica: o schema consumido pelo Content Layer é compilado deste bundle pelo `okf-parser`.
