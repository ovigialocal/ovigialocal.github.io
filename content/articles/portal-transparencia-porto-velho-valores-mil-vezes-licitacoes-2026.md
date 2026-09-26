---
type: PublicArticle
title: "Portal da Transparência de Porto Velho mostra valores mil ou um milhão de vezes maiores em 30 licitações de 2026; erros já noticiados continuam lá"
description: "O Vigia comparou as licitações e os contratos de 2026 do Portal com os registros que a própria Prefeitura enviou ao PNCP. Em 30 de 209 licitações comparáveis, um campo de valor aparece exatamente mil ou um milhão de vezes maior. Uma ambulância aparece com R$ 341,9 milhões, e uma compra de material gráfico, com R$ 5,56 trilhões. Os casos publicados no começo de setembro seguem sem correção."
story_id: "portal-transparencia-porto-velho-valores-mil-vezes-licitacoes-2026"
locality: "Porto Velho, RO"
category: "Cidade"
published_at: "2026-09-26T14:07:57Z"
source_repository: "franklinbaldo/ovigia-redacao"
source_commit: "75793cc5f441271a4e791de7b3dd229669ab6fdd"
source_path: "private://article-ready/sha256:a57c26ad0cf7f52b32862de895eadb1579d4c3eda19f65f2af2b36a4544b954a"
source_digest: "sha256:a57c26ad0cf7f52b32862de895eadb1579d4c3eda19f65f2af2b36a4544b954a"
source_refs:
  - "pvh-portal-api-licitacoes-contratos-2026-20260926"
  - "pncp-api-contratacoes-contratos-pvh-2026-20260926"
  - "pvh-portal-licitacao-8223-20260926"
  - "pvh-quadro-precos-8223-20260926"
  - "pvh-portal-licitacao-8132-20260926"
  - "pvh-edital-8132-20260926"
  - "pvh-portal-licitacao-8647-20260926"
  - "pvh-homologacao-8647-20260926"
  - "pvh-portal-licitacao-8678-20260926"
  - "pvh-homologacao-8678-20260926"
  - "pvh-portal-contrato-4045-20260926"
  - "pvh-contrato-4045-pdf-20260926"
  - "pvh-reobservacao-9203-20260926"
  - "pvh-reobservacao-8472-20260926"
  - "pvh-reobservacao-contrato-4037-20260926"
  - "pvh-homologacao-8209-20260926"
  - "pvh-homologacao-8227-20260926"
  - "pvh-portal-licitacao-8120-20260926"
  - "pvh-edital-8120-20260926"
  - "pvh-release-indice-transparencia-2025-20260926"
  - "pvh-busca-manifestacao-prefeitura-20260926"
  - "pvh-portal-licitacao-8130-20260926"
  - "pvh-edital-8130-20260926"
source_name: "API de dados abertos da Prefeitura de Porto Velho — licitações e contratos (população completa, 26/09/2026)"
source_url: "https://api.portovelho.ro.gov.br/api/v1/licitacoes"
---

# Portal da Transparência de Porto Velho mostra valores mil ou um milhão de vezes maiores em 30 licitações de 2026; erros já noticiados continuam lá

No Portal da Transparência de Porto Velho, a compra de **uma ambulância** para a Maternidade Municipal Mãe Esperança aparece com valor homologado de **R$ 341,9 milhões**. O termo de homologação assinado diz **R$ 341.869,00**. Um caminhão-baú e um furgão para a Saúde aparecem por **R$ 700 milhões**, e o termo diz **R$ 700 mil**. Uma compra de material gráfico tem valor estimado de **R$ 5,56 trilhões** no Portal, e o edital diz **R$ 5.557.124,54**.

Não são casos isolados. O Vigia comparou as licitações e os contratos de 2026 que o Portal publica em sua API de dados abertos com os registros que a própria Prefeitura enviou ao Portal Nacional de Contratações Públicas (PNCP), o sítio oficial de divulgação criado pela Lei de Licitações. Das **209 licitações** que puderam ser pareadas e têm valor nos dois sistemas, **30 (14,4%)** mostram ao menos um campo de valor **exatamente mil ou um milhão de vezes maior** no Portal do que no PNCP. Entre os **56 contratos** que puderam ser comparados, **3** repetem o padrão.

Os três casos que O Vigia noticiou no início de setembro seguem sem correção. Em 26 de setembro, o Portal ainda mostrava R$ 2,14 bilhões para a [banca dos concursos da Educação e da Saúde](https://ovigialocal.github.io/noticias/porto-velho-concurso-semed-semusa-valor-portal-2026/), R$ 1,368 bilhão para o [contrato de locação de caminhonetes da Seinfra](https://ovigialocal.github.io/noticias/porto-velho-contrato027-valor-mil-vezes-2026/) e R$ 878,2 bilhões como valor estimado de uma [compra de veículos para a Saúde](https://ovigialocal.github.io/noticias/porto-velho-dados-publicos-escala-monetaria-2026/).

## O que a comparação mostra

Numa licitação, o **valor estimado** é o que a Prefeitura calcula antes da disputa. O **valor homologado** é o preço vencedor que ela confirma no fim. Nos dois campos, o Portal e o PNCP coincidem na maior parte dos registros: 118 dos 155 valores estimados e 115 dos 130 homologados são iguais ao centavo. O mesmo vale para 49 dos 56 valores de contrato. Isso descarta que o Portal use, por convenção, outra unidade de medida.

Nos registros errados, a diferença é exata: o número do Portal é o do PNCP com três zeros a mais ou, em três licitações, com seis. Alguns exemplos, todos conferidos também no documento anexo ao processo:

| Processo | Campo no Portal | Portal | Documento |
| --- | --- | --- | --- |
| Pregão 90017/2026 — material gráfico | Valor Estimado | R$ 5.557.124.540.000,00 | R$ 5.557.124,54 (edital) |
| Pregão 90051/2026 — balança rodoviária | Valor Estimado | R$ 214.735.950.000,00 | R$ 214.735,95 (quadro de preços) |
| Pregão 90018/2026 — arbitragem esportiva, Semtel | Valor Estimado | R$ 3.210.211.320,00 | R$ 3.210.211,32 (edital) |
| Pregão 90023/2026 — massa asfáltica, Seinfra | Valor Estimado | R$ 98.211.200.000,00 | R$ 98.211.200,00 (edital) |
| Pregão 250/2026 — transporte rodoviário, Semtel | Valor Homologado | R$ 6.080.744.960,00 | R$ 6.080.744,96 (termo de homologação) |
| Pregão 90053/2026 — calcário e adubo, Semagric | Valor Homologado | R$ 878.000.000,00 | R$ 878.000,00 (termo de homologação) |
| Pregão 90048/2026 — caminhão-baú e furgão, Semusa | Valor Homologado | R$ 700.000.000,00 | R$ 700.000,00 (termo de homologação) |
| Pregão 258/2026 — ambulância, Maternidade Mãe Esperança | Valor Homologado | R$ 341.869.000,00 | R$ 341.869,00 (termo de homologação) |
| Contrato 023/PGM/2026 — agenciamento de viagens, Semias | Valor Global | R$ 310.000.000,00 | R$ 310.000,00 (contrato) |

Vários desses pregões, como os da arbitragem, da massa asfáltica, do transporte e do calcário, são registros de preços: os valores são tetos para compras eventuais, e não gasto. Mesmo como teto, estão mil vezes acima dos documentos do processo.

Os registros afetados foram cadastrados entre janeiro e agosto e envolvem pregões, dispensas e inexigibilidades de várias secretarias. Parte deles nem chegou a contratar: quatro processos fracassaram, um ficou deserto, um foi anulado e dois estão suspensos. O erro também não atinge o registro inteiro. Na página da ambulância, o valor estimado (R$ 385.780,00) está correto, e só o homologado tem três zeros a mais. Na do contrato da Semias, o resumo diz R$ 310 milhões e a linha do item, logo abaixo, diz R$ 310 mil.

## Quanto isso distorce

Quem soma os dados leva o erro junto. Nas 155 licitações de 2026 com valor estimado nos dois sistemas, o Portal soma **R$ 6,78 trilhões**, e o PNCP soma **R$ 877 milhões** para os mesmos processos. Só a compra de material gráfico responde por R$ 5,56 trilhões. Nos valores homologados, o Portal soma R$ 11,3 bilhões e o PNCP, R$ 117 milhões. Nos contratos, os três com zeros a mais somam R$ 2,38 bilhões, **90%** do valor global dos 162 contratos de 2026 cadastrados no Portal.

## O erro está na API de dados abertos

Os valores inflados não são só um problema de exibição. A API pública que alimenta o Portal devolve os mesmos números, acompanhados do valor por extenso gerado pelo sistema. Para a banca do concurso, a API informa "dois bilhões e cento e quarenta milhões reais". Quem baixa esses dados para somar, comparar ou fiscalizar, seja pesquisador, jornalista, órgão de controle ou cidadão, herda o erro sem ver o PDF anexo.

A comparação também esclarece o caso do concurso. A matéria de 3 de setembro apontava um valor "quase 888 vezes" maior que o contrato de R$ 2,41 milhões. O PNCP mostra por quê: lá, o valor homologado do processo foi registrado como **R$ 2.140.000,00**, com os dígitos 4 e 1 trocados em relação ao contrato. O Portal exibe esse número multiplicado por mil. São dois erros diferentes: a troca de dígitos, que já está no PNCP, e os três zeros a mais.

## Atualizado depois da matéria, o erro ficou

Pelo menos um dos casos noticiados foi alterado depois da reportagem, sem que o erro saísse. Na licitação dos veículos da Saúde, os termos de homologação foram anexados em 10 e 11 de setembro, e a página agora mostra o valor homologado correto (R$ 817.297,00). O valor estimado, na mesma página, continua em R$ 878.156.700.000,00, um milhão de vezes o do edital.

## A nota de transparência

Em agosto de 2025, antes do cadastro dos registros comparados nesta reportagem, a Prefeitura divulgou ter alcançado **nota 95,91** na avaliação de transparência do Tribunal de Contas de Rondônia, referente a 2025, e se apresentou "entre as mais transparentes do Brasil". Segundo o texto de divulgação, a nota considera "disponibilidade, clareza, atualização e organização" das informações. O controlador-geral do município disse na ocasião que o resultado mostra o empenho em garantir acesso "facilitado e confiável aos dados da gestão". O texto de divulgação não menciona a conferência dos valores publicados com os documentos.

## O que não dá para afirmar

A comparação mostra onde o Portal diverge dos documentos, mas não diz por quê. Com os dados públicos, não é possível saber se os zeros entram na digitação, numa máscara de preenchimento ou numa importação entre sistemas.

Também não há sinal de que os valores inflados tenham chegado ao dinheiro. **Empenho** é a reserva do valor no orçamento antes do pagamento. Nas páginas afetadas que listam empenhos, eles estão na escala certa: R$ 1,04 milhão no contrato das caminhonetes, entre R$ 15 mil e R$ 70 mil no da Semias e R$ 700 mil no do caminhão-baú.

A conta tem limites. Das 258 licitações de 2026 do Portal, 43 ficaram fora do pareamento com o PNCP, e dos 162 contratos, 106. Pode haver outros valores inflados entre eles. O PNCP também pode errar, como mostra o caso do concurso. Anos anteriores não foram comparados.

O Vigia não localizou manifestação pública da Prefeitura sobre os valores apontados em setembro e não pediu posicionamento para esta reportagem. Pedidos de acesso à informação sobre a origem dos campos e a abrangência do erro estão preparados e ainda não foram protocolados.

## Como conferir

Para saber o valor de uma licitação ou contrato de Porto Velho, não confie só no campo-resumo do Portal. Abra o termo de homologação, o edital ou o contrato anexados à própria página. O mesmo processo no PNCP (pncp.gov.br) serve de segunda referência: nos casos conferidos, bateu com os documentos em tudo, menos na troca de dígitos do concurso.
