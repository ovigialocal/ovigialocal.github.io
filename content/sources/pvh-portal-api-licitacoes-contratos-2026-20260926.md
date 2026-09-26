---
type: PublicSource
source_ref: "pvh-portal-api-licitacoes-contratos-2026-20260926"
name: "API de dados abertos da Prefeitura de Porto Velho — licitações e contratos (população completa, 26/09/2026)"
source_kind: "primary-data"
publisher: "Prefeitura de Porto Velho"
observed_at: "2026-09-26T13:20:00Z"
source_url: "https://api.portovelho.ro.gov.br/api/v1/licitacoes"
archive_status: "pending"
---

# Observação direta

A API pública que alimenta o Portal da Transparência (`/api/v1/licitacoes` e `/api/v1/contratos`, documentada em `https://api.portovelho.ro.gov.br/docs/api`) foi lida integralmente em 26/09/2026, entre 13h10 e 13h35 UTC.

- **Licitações:** 460 páginas de 10 registros; 4.596 registros únicos, dos quais **258 com `ano` = 2026**. Campos usados: `valor_estimado.value` (exibido na página como "Valor Estimado") e `valor_contratado.value` (exibido como "Valor Homologado").
- **Contratos:** 60 páginas lidas; **162 contratos com `contrato_ano` = 2026**. Campo usado: `valor.value` (exibido como "Valor Global do Contrato").
- A API responde `429 Too Many Attempts` sob concorrência; as páginas recusadas foram refeitas em série até nenhuma faltar.

A própria API devolve os valores inflados com o texto por extenso gerado pelo sistema. Exemplo, licitação 9203: `"valor_contratado": {"value": 2140000000, "extense": "dois bilhões e cento e quarenta milhões reais"}`. Portanto a divergência já está no dado servido pela API, e não é apenas formatação da página.

Integridade dos dumps brutos (não versionados pelo tamanho, 31,7 MB): licitações `sha256:011d78e8723917c5f13f76ae362875ca130fa77aabaab777d35845275d61ff77`; contratos 2026 `sha256:3ff206af60334e092013eef0e519922ced880d838fd88408cfb0077b98a5af13`.

# Cálculo

A comparação com o PNCP está em o conjunto de dados da comparação. As tabelas derivadas, uma linha por registro pareado, estão versionadas ao lado:

- o conjunto de dados da comparação (209 licitações comparáveis, pareamento v3; `sha256:9039be171015143575c7deba0dd4990a1a9e11526b2e6f4b3266d021c276b80c`);
- o conjunto de dados da comparação (56 contratos; `sha256:63147f29f46f3b51b5a09aa476ca3b9bf8a2a27b96d9dfbe851162b03ae662fa`).

Distribuição por data de cadastro (`created_at`) dos 258 registros de 2026: há registros em todos os meses de janeiro a setembro. Os 30 registros com erro de escala foram cadastrados entre 7 de janeiro e 26 de agosto, sem concentração num único dia ou lote.

# Limites

- A API é dinâmica: valores podem ser corrigidos depois da observação. A preservação usa o registro 8223 como amostra; a população fica reconstruível pelos CSVs e pelos hashes.
- Registros anteriores a 2026 não foram comparados com fonte independente. Há sinais de outro padrão de escala (fator próximo de 100) em 2015–2022, mas eles não foram testados e não sustentam nenhum claim.
