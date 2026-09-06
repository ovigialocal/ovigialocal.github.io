---
type: Spec
title: PublicEditionRegistry
description: Política canônica do site para descoberta, fallback e sugestão de edições locais
---

# PublicEditionRegistry

`PublicEditionRegistry` é a configuração singleton do roteador público de O Vigia.

- `registry_id` identifica a política; o renderer exige exatamente o registry `main`.
- `default_edition_id` referencia uma `PublicEdition` ativa e é o fallback do site.
- `suggestion_radius_km` é a distância máxima global para sugerir outra edição.

Preferência explícita vence inferência. Uma sugestão nunca troca a edição sem ação do leitor. Provedor GeoIP, timeout e transporte são detalhes do adaptador do renderer e não pertencem ao registry OKF. O registry pertence à autoridade pública do site; Redação e Dados apenas referenciam `edition_id` e consultam este contrato quando necessário.
