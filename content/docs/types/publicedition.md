---
type: Spec
title: PublicEdition
description: Registry público e canônico das edições locais servidas por O Vigia
---

# PublicEdition

`PublicEdition` representa uma edição local ativa, planejada ou desativada de O Vigia. O conjunto de concepts em `content/editions/` é o registry canônico consumido pelo renderer; TypeScript, Redação e Dados não mantêm listas concorrentes.

## Semântica

- `edition_id` é a identidade estável e URL-safe referenciada por matérias e sistemas produtores.
- `name` é o nome curto exibido ao leitor; `title` e `description` apresentam a edição.
- `municipality_territory_id` referencia o município canônico em `PublicTerritory.territory_id`.
- `municipality_ibge_code`, `state_code` e `country_code` permitem joins com fontes públicas sem comparar nomes livres.
- `path_prefix` é o namespace público absoluto e estável da edição, sem barra final.
- `timezone` usa identificador IANA e `locale` usa BCP 47.
- `latitude` e `longitude` são o centro aproximado usado apenas para ordenar sugestões de edição.
- `geo_names` contém nomes de cidade aceitos da resposta GeoIP; não cria identidade territorial.
- `geo_radius_km` limita uma sugestão automática aproximada.
- `status` admite `active`, `planned` ou `retired`. Somente `active` é roteável.
- a edição não declara se é padrão. Essa política pertence ao singleton `PublicEditionRegistry`.

O GeoIP é uma conveniência de roteamento, nunca prova de residência ou vínculo editorial. A preferência explícita do leitor vence a inferência.
