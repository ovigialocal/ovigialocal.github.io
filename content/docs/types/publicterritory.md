---
type: Spec
title: PublicTerritory
description: Território editorial público usado para organizar cobertura, páginas e relações espaciais de O Vigia
---

# PublicTerritory

`PublicTerritory` representa uma unidade territorial publicável e navegável de O Vigia.

## Semântica

- `territory_id` é a identidade estável e URL-safe do território.
- `name` é o nome público exibido ao leitor.
- `kind` informa a granularidade territorial, como `estado`, `municipio`, `distrito`, `bairro` ou outra categoria explicitamente adotada.
- `parent_territory_id`, quando presente, aponta para outro `PublicTerritory` e estabelece hierarquia sem inferir pertencimento por texto.
- `title` e `description` são a apresentação editorial do território.

Cada território pode ter página pública própria em `/territorios/<territory_id>/`. O índice `/territorios.html` lista somente territórios realmente materializados no bundle.

`PublicArticle.locality` e `PublicArticle.bairro`, quando presente, são referências relacionais a `PublicTerritory.name`. Isso preserva a compatibilidade do frontmatter público atual enquanto impede strings territoriais órfãs. Uma migração futura pode substituir essas chaves naturais por IDs sem alterar a identidade das páginas territoriais.
