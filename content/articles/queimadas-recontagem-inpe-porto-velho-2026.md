---
type: PublicArticle
title: "O Vigia recontou os dados do INPE: a queda de queimadas que a Prefeitura credita ao seu plano também aconteceu no resto de Rondônia"
description: "Recontagem dos arquivos completos do Programa Queimadas mostra que junho de 2024 teve 55 focos em Porto Velho, e não 1 como a Prefeitura publicou; e que a redução de 2024 para 2025 foi da mesma ordem no restante do estado, onde o plano municipal não se aplica."
story_id: "queimadas-recontagem-inpe-porto-velho-2026"
locality: "Porto Velho, RO"
category: "Cidade"
published_at: "2026-09-16T07:45:00-04:00"
source_repository: "franklinbaldo/ovigia-redacao"
source_commit: "f01c1b12f8e684a320ad15929e1be49948a752c5"
source_path: "private://article-ready/sha256:ad8c50ca8444f27892b5a04e03f04f3e9bd1128ff8d9059c20f113b4de10fdc4"
source_digest: "sha256:ad8c50ca8444f27892b5a04e03f04f3e9bd1128ff8d9059c20f113b4de10fdc4"
source_refs:
  - "inpe-focos-csv-mensal-recontagem-20260909"
  - "inpe-focos-comparacao-regional-20260909"
  - "inpe-focos-busca-negativa-657-182-20260909"
  - "pmpv-queimadas-releases-reobservados-20260909"
  - "inpe-infoqueima-2024-07-referencia"
  - "inpe-infoqueima-2025-07-referencia"
source_name: "INPE/Programa Queimadas — arquivos mensais de focos, recontagem de Porto Velho"
source_url: "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/mensal/Brasil/"
---

# O Vigia recontou os dados do INPE: a queda de queimadas que a Prefeitura credita ao seu plano também aconteceu no resto de Rondônia

Em 4 de setembro, ao anunciar o Plano Municipal de Prevenção às Queimadas Urbanas de 2026, a Prefeitura de Porto Velho publicou que o município teve **657 focos de calor entre maio e julho de 2024** e **182 no mesmo período de 2025** — uma redução de **84,7%** que, segundo o texto, demonstra "a eficácia das ações preventivas adotadas pela gestão municipal".

O Vigia mostrou naquela semana que esses três números não fecham entre si. Ficou uma pergunta em aberto, registrada na própria matéria: os totais do município resistem a uma recontagem feita direto nos arquivos do Instituto Nacional de Pesquisas Espaciais (INPE)?

Agora eles foram recontados. Baixamos os arquivos mensais completos do Programa Queimadas — cerca de 300 megabytes de registros de todo o Brasil — e contamos, linha por linha, os focos atribuídos ao município de Porto Velho.

O resultado tem três partes. Uma corrige o número da Prefeitura. Outra derruba a explicação que ela dá para ele. A terceira entrega um dado bom para a cidade que a própria Prefeitura deixou de publicar.

## Primeiro, o teste do método

Antes de usar a recontagem para apontar erro em alguém, era preciso saber se ela mede a mesma coisa que o INPE mede.

Mede. Nos boletins técnicos InfoQueima, o INPE já havia publicado, para o chamado **satélite de referência** — o critério que o próprio instituto recomenda para comparar períodos —, **647 focos em Porto Velho em julho de 2024** e **82 em julho de 2025**. Nossa contagem a partir dos arquivos brutos devolve exatamente 647 e 82.

A recontagem também bate com três das seis células mensais que a Prefeitura publicou em agosto de 2025: maio de 2024 (8 focos), maio de 2025 (3) e junho de 2025 (16), todas idênticas.

Ou seja: o método reproduz o INPE e reproduz a maior parte da própria série municipal.

## Segundo, o mês que não bate

Há uma exceção, e ela é grande.

Para **junho de 2024**, a Prefeitura publicou, em agosto de 2025, que Porto Velho registrou **"um foco de calor"**. O satélite de referência registra **55**.

| maio–julho | 2024 | 2025 | 2026 |
| --- | --- | --- | --- |
| maio | 8 | 3 | 1 |
| junho | **55** | 16 | 3 |
| julho | 647 | 82 | 13 |
| **total** | **710** | **101** | **17** |
| *publicado pela Prefeitura* | *657* | *102 / 182* | *não publicado* |

As diferenças de uma unidade em julho (647 contra 648, 82 contra 83) são o tipo de variação que uma consulta feita em outra data produz, porque a base do INPE é reprocessada. Uma diferença de 54 focos em um único mês não é.

Há uma explicação candidata, e ela é verificável. O satélite Aqua faz duas passagens diárias, e o INPE distingue as duas: a da tarde, `AQUA_M-T`, é a de referência; a da manhã, `AQUA_M-M`, não é. Em junho de 2024, entre os treze satélites presentes na base, **o único que registra exatamente 1 foco em Porto Velho é o Aqua da manhã**. Todos os demais registram entre 2 e 310.

Isso torna plausível que uma célula da série tenha sido preenchida com a passagem errada do mesmo satélite. Não é prova: só a Administração pode dizer de qual consulta o número saiu, e é isso que O Vigia formalizou em pedido de acesso à informação.

**E aqui está o ponto que precisa ser dito com clareza: se a correção for essa, ela não favorece a reportagem.** Com o ano-base corrigido para 710, a queda de 2024 para 2025 sobe para **85,8%** — um resultado *melhor* do que os 84,47% que a Prefeitura anunciou. O erro, se erro for, subestimou o próprio feito do município.

Já o total de **182**, publicado em setembro, não foi reproduzido por nenhum caminho testado. Nós procuramos: cada um dos treze satélites, isoladamente, em toda janela de meses contígua entre janeiro de 2024 e agosto de 2026; a soma de todos eles; e os agrupamentos convencionais — MODIS, VIIRS, satélites polares. Nenhum produz 182. Nenhum produz 657, tampouco.

Uma combinação, sim, funciona: **102**, o total que a Prefeitura publicou para 2025 em agosto do ano passado, é exatamente a soma das duas passagens do Aqua em maio–julho de 2025. Mas essa mesma regra aplicada a 2024 daria **801**, não 657. Nem a regra que explica um ano explica o outro.

Nada disso demonstra que os números municipais sejam inventados. O portal interativo do BDQueimadas aceita filtros que os arquivos mensais não têm — recorte por polígono, por bioma, por faixa de confiança, por intervalo de datas que não coincida com meses inteiros. Qualquer um deles produziria outro total. A pergunta é qual foi usado, e ela está protocolada.

## Terceiro, o teste da explicação

O release de setembro não se limita a informar a queda. Ele diz que a queda demonstra a eficácia das ações preventivas da gestão municipal.

Essa é uma afirmação sobre causa, e causa se testa com controle. Se o plano municipal explica a queda, a queda deveria ser maior em Porto Velho do que onde o plano não é executado.

Aplicamos a mesma recontagem ao restante de Rondônia — o estado inteiro menos a capital — nas cinco séries de satélite com contagem relevante.

| série | queda em Porto Velho 2024→2025 | queda no restante de RO 2024→2025 |
| --- | --- | --- |
| satélite de referência | 85,8% | **86,9%** |
| NOAA-20 | 88,2% | 85,1% |
| NOAA-21 | 88,0% | 84,8% |
| NPP-375 | 78,7% | 71,6% |
| todos os satélites | 89,0% | 86,1% |

As duas colunas são da mesma ordem, e a diferença entre elas **muda de sinal conforme o satélite escolhido**. Pelo critério que o INPE recomenda para comparações temporais, o restante do estado caiu mais do que a capital. Pelas séries VIIRS, a capital caiu alguns pontos a mais.

Não há, nessa transição, separação estável entre Porto Velho e o território vizinho, onde nenhuma brigada municipal, nenhum pit stop e nenhuma vistoria da Sema atuaram.

O que houve foi um colapso regional. Nacionalmente, os focos no satélite de referência caíram de 41.234 para 20.126 entre maio–julho de 2024 e o mesmo período de 2025. 2024 foi o ano da estiagem extrema associada ao El Niño — e o próprio texto municipal de agosto de 2025 dizia isso, atribuindo o resultado a "um conjunto de fatores, entre eles, condições climáticas e principalmente o fortalecimento das políticas de prevenção", com dois parágrafos sobre o El Niño e a qualidade do ar.

Essa ressalva desapareceu. O texto de 2026 usa a mesma comparação de anos, retira a menção às condições climáticas e passa a chamar o resultado de demonstração de eficácia da gestão.

Também testamos a hipótese contrária, a que enfraqueceria a queda: a de que ela fosse um artefato do satélite de referência, cuja órbita vem envelhecendo. Não é. A fatia que esse satélite representa no total de detecções brasileiras ficou estável na janela — 4,09% em 2024, 3,88% em 2025 e 4,08% em 2026. A queda que ele mede é do fenômeno, não do instrumento.

## O dado bom que a Prefeitura não publicou

O release é de setembro de **2026** e apresenta, como resultado do plano de 2026, uma comparação entre **2024 e 2025**.

Os dados de maio a julho de 2026 já estão públicos na distribuição do INPE. Fomos buscá-los.

No satélite de referência, Porto Velho registrou **17 focos** entre maio e julho de 2026, contra 101 em 2025 — uma queda de **83,2%**. No restante de Rondônia, a queda no mesmo intervalo foi de **44,1%**.

E dessa vez o sinal é consistente: em **todas as cinco séries de satélite**, sem exceção, Porto Velho cai mais do que o restante do estado. A participação da capital nos focos de Rondônia, que era de 38% em 2024 e 40% em 2025, caiu para **16,7%** em 2026.

Os números absolutos de 2026 são pequenos, e um único ano não estabelece uma tendência. Mas a diferença aparece nas séries de contagem alta tanto quanto nas de contagem baixa, o que é mais do que se pode dizer da comparação que a Prefeitura escolheu divulgar.

É um resultado que sustenta melhor o argumento da gestão do que o argumento que a gestão apresentou. Ele estava disponível e não foi usado.

## O que ainda não sabemos

O Vigia protocolou pedido de acesso à informação à Secretaria Municipal de Meio Ambiente solicitando: a extração que originou cada série publicada; qual satélite foi usado e por quê; o recorte espacial e temporal das consultas; e o documento que ampara a atribuição da queda às ações preventivas do município.

Até que essas respostas cheguem, três coisas ficam registradas. O ano-base publicado não corresponde ao satélite de referência em um de seus três meses. Os totais de 657 e 182 não foram reproduzidos por nenhuma consulta pública testada. E a redução de 2024 para 2025, sozinha, não distingue Porto Velho de vizinhos que não têm plano municipal nenhum.

Nada disso significa que as ações da Prefeitura não tenham efeito. Significa que o número escolhido para provar esse efeito não o prova — e que existe, na mesma base pública, um número de 2026 que chega mais perto.
