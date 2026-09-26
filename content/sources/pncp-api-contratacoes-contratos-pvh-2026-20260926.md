---
type: PublicSource
source_ref: "pncp-api-contratacoes-contratos-pvh-2026-20260926"
name: "PNCP — contratações e contratos do Município de Porto Velho em 2026 (API de consulta, 26/09/2026)"
source_kind: "primary-data"
publisher: "Portal Nacional de Contratações Públicas (Ministério da Gestão e da Inovação em Serviços Públicos)"
observed_at: "2026-09-26T13:30:00Z"
source_url: "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=20260101&dataFinal=20260926&cnpj=05903125000145"
archive_status: "pending"
---

# Observação direta

A API pública de consulta do PNCP foi lida para o CNPJ 05.903.125/0001-45 (Município de Porto Velho), com publicação entre 01/01 e 26/09/2026:

- `/v1/contratacoes/publicacao`, modalidades 1 a 13: **282 contratações** (valores `valorTotalEstimado` e `valorTotalHomologado`). Dump `sha256:eb482ff3db882678e026b6e4cec7a91ad94a1ca9bd8f5f6808abd92c2dbbfe2e`.
- `/v1/contratos`: **787 contratos** (valor `valorGlobal`). Dump `sha256:581dbb166862aa962b1a211cd8e1d64907c5b1dfdbe9dcfdd740ec87fe1c374d`.

O PNCP é alimentado pelo próprio Município. Não é uma auditoria independente dos valores, mas é um registro oficial separado do Portal municipal, e a Lei 14.133/2021 (art. 174) o define como sítio oficial de divulgação dos atos.

# Cálculo (reproduzível)

**Pareamento de licitações (v3).** Os critérios são aplicados em ordem:

1. Número do processo, só com dígitos, igual nos dois sistemas. Havendo mais de um candidato, desempata o número da compra no título ou no edital e, em último caso, os 60 primeiros caracteres do objeto.
2. Para os registros que o primeiro critério não pareou, os **10 primeiros dígitos** do processo mais o número da compra, desde que o candidato seja único. O PNCP grava com frequência o processo sem o dígito verificador (por exemplo, `018.000431/2026` no PNCP e `018.000431/2026-24` no Portal).
3. Para os que ainda sobraram: número da compra no título ou edital + os 8 últimos dígitos do processo do PNCP no fim do processo do Portal, com candidato único. Isso recupera casos em que o PNCP grava o processo sem o prefixo do órgão, como "000100/2026-24" para "014.000100/2026 24" (licitação 8130).
4. Se uma contratação do PNCP aparece pareada a mais de um registro do Portal, só fica o registro cujo título ou edital contém o número da compra. Sem vencedor único, todos são descartados.

Resultado: **215 das 258** licitações de 2026 do Portal ficaram pareadas, 43 ficaram fora do pareamento (sem par ou descartadas pela deduplicação), e **209** têm ao menos um campo monetário não nulo nos dois lados.

**Pareamento de contratos.** CNPJ do fornecedor + data de assinatura. Só **56 dos 162** contratos de 2026 do Portal têm par com valor nos dois lados.

**Classificação.** Para cada campo: `igual` se |Portal − PNCP| ≤ R$ 0,011; `x1000` se |Portal − 1.000 × PNCP| ≤ R$ 11; `x1e6` se |Portal − 1.000.000 × PNCP| ≤ R$ 11.000; senão `outro`. Só entra como erro de escala o valor que é *exatamente* 1.000 ou 1.000.000 de vezes o do PNCP.

| Campo | Comparáveis | Igual | ×1.000 | ×1.000.000 | Outro |
| --- | --- | --- | --- | --- | --- |
| Valor Estimado (licitações) | 155 | 118 | 22 | 3 | 12 |
| Valor Homologado (licitações) | 130 | 115 | 10 | 0 | 5 |
| Valor Global (contratos) | 56 | 49 | 3 | 0 | 4 |

**30 das 209 licitações** (14,4%) têm ao menos um campo exatamente 1.000 ou 1.000.000 de vezes maior no Portal: 8072, 8097, 8120, 8129, 8130, 8131, 8132, 8146, 8171, 8185, 8188, 8194, 8196, 8198, 8204, 8209, 8223, 8224, 8226, 8227, 8228, 8279, 8280, 8472, 8647, 8678, 8720, 8774, 8798, 9203. O fator de um milhão aparece em três delas: 8120, 8223 e 8472. Contratos com erro: 4037 (027/PGM/2026), 4045 (023/PGM/2026) e 4217 (11/2026/CGAF/SEMUSA).

Situação no Portal dessas 30 licitações: 14 homologadas, 3 em andamento, 2 publicadas, 2 em acolhimento de propostas, 1 em julgamento de habilitação, 4 fracassadas, 2 suspensas, 1 deserta e 1 anulada.

**Escala agregada (mesmo conjunto).** Nas 155 licitações com valor estimado nos dois sistemas, o Portal soma **R$ 6,78 trilhões** e o PNCP, **R$ 877 milhões**; só a 8120 responde por R$ 5,56 trilhões no Portal. Nas 130 com valor homologado nos dois sistemas, o Portal soma **R$ 11,3 bilhões** e o PNCP, **R$ 117 milhões**. A comparação é sobre os mesmos processos e não depende de corrigir nenhum caso. Nos contratos, os três inflados somam R$ 2,38 bilhões, **90%** dos R$ 2,66 bilhões de valor global dos 162 contratos de 2026 cadastrados no Portal.

Fora da contagem exata ficaram a 9257 (embarcações), exatamente mil vezes o termo de referência (R$ 360.500,00), mas não o valor do PNCP (R$ 336.000,00),. A 8363 tem fator próximo de 100, que pode ser outra família de erro, e não foi investigada.

# Explicações alternativas testadas

- **Convenção de unidade do Portal (valores em milésimos, por exemplo):** falsificada. 118 dos 155 estimados, 115 dos 130 homologados e 49 dos 56 contratos batem ao centavo com o PNCP.
- **Semântica diferente entre campos:** o teste compara estimado com estimado e homologado com homologado. Nos casos-chave, o valor verdadeiro foi conferido no documento anexo ao próprio processo (termo de homologação, edital, quadro de preços, contrato).
- **Conversão uniforme do registro:** falsificada para parte dos casos. Na 8678, o estimado bate com o PNCP (R$ 385.780,00) e o homologado está mil vezes maior. Nas 8072 e 8798 ocorre o inverso. O erro atinge campos isolados, não o registro inteiro.
- **Erro no PNCP:** não sustentado. Nos casos conferidos, o documento primário concorda com o PNCP, exceto na 9203, em que o PNCP registra homologado de R$ 2.140.000,00 e o contrato diz R$ 2.410.000,00, uma segunda divergência que não é de escala.

# Limites

- A API de consulta é dinâmica; a preservação usa como amostra o registro da contratação 134/2026 (balança). A população é reconstruível pelos CSVs e pelos hashes dos dumps.
- 43 licitações de 2026 do Portal e 106 contratos ficaram fora do pareamento e ficaram fora do denominador. O contrato 4034 (012/PGM/2026, R$ 200 milhões no Portal) está entre os não pareados e não foi conferido.
- A causa técnica (digitação, máscara de entrada, importação) não é determinável com os dados públicos.
- A presença do valor inflado no Portal não demonstra efeito sobre empenho ou pagamento. Nas páginas afetadas que listam empenho, os valores estão na escala correta: contrato 4037 com R$ 1,04 milhão; contrato 4045 com empenhos de R$ 15 mil a R$ 70 mil; e as licitações 8072, 8194 e 8209, esta com empenho de R$ 700 mil.
