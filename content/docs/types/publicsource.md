---
type: Spec
title: PublicSource
description: Fonte factual pública com proveniência própria, reutilizável por uma ou mais matérias
---

# PublicSource

`PublicSource` representa uma origem factual efetivamente usada por O Vigia e exposta ao leitor com proveniência própria.

## Semântica

- `source_ref` é o locator estável da `source-observation` correspondente na Redação e identifica a fonte pública sem inventar um segundo hash.
- `name` é o rótulo humano da fonte.
- `source_kind` classifica a origem quando disponível.
- `publisher` identifica quem publicou ou emitiu o material.
- `observed_at` registra quando a Redação verificou a origem.
- `source_url` é o link público preferido: snapshot Wayback materialmente verificado quando houver; caso contrário, a origem viva quando o snapshot falhou validamente ou não se aplica.
- `source_original_url`, quando presente, preserva a URL viva enquanto `source_url` aponta para snapshot.
- `archive_status` torna explícito se a preservação foi verificada, falhou de forma terminal ou não se aplica; `archive_failure_code` pode registrar o código terminal quando isso for útil ao leitor/auditoria.

Uma fonte existe independentemente da matéria. A mesma `PublicSource` pode ser referenciada por várias `PublicArticle`; uma matéria pode referenciar qualquer quantidade de fontes.

`PublicSource` não transforma declaração institucional em validação externa. O que uma fonte sustenta continua dependendo do conteúdo e da classe de evidência.
