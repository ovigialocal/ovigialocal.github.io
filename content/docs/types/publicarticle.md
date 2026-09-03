---
type: Spec
title: PublicArticle
description: Matéria aceita pela autoridade pública de O Vigia e exposta pelo site estático
---

# PublicArticle

`PublicArticle` é a matéria aceita pela autoridade pública de O Vigia e armazenada em `content/articles/`.

## Semântica

- `title` e `description` são o título e a linha fina editoriais aprovados para publicação.
- `story_id` é a identidade estável usada na URL pública `/noticias/<story_id>/`.
- `locality` é uma referência relacional a `PublicTerritory.name`; `bairro`, quando existe, também referencia `PublicTerritory.name` e representa uma granularidade territorial mais específica sustentada pela matéria.
- `category` descreve a organização editorial da matéria.
- `published_at` registra a publicação; `updated_at`, quando presente, registra atualização material da versão pública.
- `source_repository`, `source_commit`, `source_path` e `source_digest` preservam a proveniência da candidatura aprovada.
- `source_refs`, quando presente, é a lista canônica de fontes factuais da matéria. Cada item resolve para `PublicSource.source_ref`, e cada `PublicSource` conserva sua própria URL, publisher, momento de observação e estado de preservação. Não há limite de uma fonte por matéria.
- `source_name`, `source_url` e `source_original_url` permanecem como projeção de compatibilidade da primeira fonte exibível enquanto o acervo legado é migrado. Novas publicações multi-source devem preencher `source_refs` e manter a projeção singular apenas para consumidores antigos/SEO.
- `next_event_at`, `next_event_kind` e `next_event_label` são opcionais e só existem quando há um próximo marco verificável adequado a Agenda/Acompanhe.
- `media_url`, `media_alt`, `media_caption`, `media_credit`, `media_source_url`, `media_width` e `media_height` são opcionais e, quando usados, obedecem a `docs/editorial-media-contract.md`.

O corpo Markdown é conteúdo editorial público canônico. Astro não redefine esta semântica: o schema consumido pelo Content Layer é compilado deste bundle pelo `okf-parser`.

A declaração física `publicarticle.schema.sql` registra tipos e campos opcionais admitidos mesmo quando ainda não há uma observação concreta no acervo. `content/okf.schema.sql` registra as relações entre conceitos. Ambos são inputs confiáveis do `TypeContract`, não implementações paralelas de validação no frontend.

## Proveniência factual x proveniência editorial

As duas cadeias são diferentes e devem continuar visíveis:

- `source_repository`/`source_commit`/`source_path`/`source_digest` dizem **qual candidatura editorial aprovada** originou a página pública;
- `source_refs → PublicSource` dizem **quais origens factuais** sustentam a matéria.

Uma matéria com oito fontes possui oito proveniências factuais independentes; não se escolhe uma delas para representar artificialmente todas as demais.
