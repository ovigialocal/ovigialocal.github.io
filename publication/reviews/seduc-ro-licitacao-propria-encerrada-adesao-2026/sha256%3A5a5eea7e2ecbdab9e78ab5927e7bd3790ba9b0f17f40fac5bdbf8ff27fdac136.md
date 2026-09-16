---
story_id: "seduc-ro-licitacao-propria-encerrada-adesao-2026"
source_repository: "franklinbaldo/ovigia-redacao"
source_commit: "ec0e3c6c99a1dc46f17e2799697c07c31d12cd77"
source_path: "private://article-ready/sha256:5a5eea7e2ecbdab9e78ab5927e7bd3790ba9b0f17f40fac5bdbf8ff27fdac136"
source_digest: "sha256:5a5eea7e2ecbdab9e78ab5927e7bd3790ba9b0f17f40fac5bdbf8ff27fdac136"
decision: accepted
decided_at: "2026-09-16T13:40:00Z"
public_path: "content/articles/seduc-ro-licitacao-propria-encerrada-adesao-2026.md"
---

# Publication review

A candidate é aceita.

## Reconciliação

Não havia review, artigo ou `publication-event` para esta candidate key. Há, porém, cobertura pública anterior sobre o mesmo assunto: `mpc-seduc-solucoes-educacionais-120-milhoes.md`, publicada em 1º de setembro. Verifiquei que esta oferta não é reprojeção daquela: o conteúdo central aqui — a DM 0230/2026-GCPCN, o Ofício nº 11958/2026/SEDUC, a informação de retomada da licitação própria com parecer favorável da PGE, o Processo SEI 0029.058903/2025-28 e a verificação própria no Diário Oficial — não existe no artigo já publicado. A Redação registrou a reconciliação em decision record próprio, e o texto trata a matéria anterior explicitamente como cobertura de origem.

## Envelope

O commit privado fixado contém a `article-ready` sob `accountability-v4`, com `evidence-review`, `editorial-review` e `editorial-value-add` aprovados e não bloqueantes sobre o mesmo draft congelado. O digest canônico da `article-ready`, calculado com `uv run okf-parser inventory --digests` no ambiente do próprio projeto, é `sha256:5a5eea7e2ecbdab9e78ab5927e7bd3790ba9b0f17f40fac5bdbf8ff27fdac136`, e o `gate_subject` aponta para `sha256:1f10958e5a3caceac15bda6dd7346cf69c3656e02ea868aa24117f8b09930bd0`, que é o digest efetivamente avaliado pelos três gates.

`okf-parser check knowledge` no commit fixado retorna 26 diagnostics, todas em artifacts legados de `ops/perspective-*`, `agent-prompts` e agent-runs anteriores; nenhuma nos arquivos desta candidatura.

## Projeção

Título, descrição e corpo foram copiados literalmente da `article-ready`. Não há `chamada` na candidata e nenhuma foi criada. A superfície pública registra apenas repositório, commit, digest e o locator opaco `private://article-ready/<ready-digest>`; nenhum `story_id` privado, caminho interno, hipótese ou artefato de gate atravessa a fronteira.

O `story_id` público foi derivado do conteúdo publicável — objeto, órgão e ano — e não do identificador privado.

`locality: Rondônia` resolve para `PublicTerritory` existente e factual.

## Fontes

As três `source-observation` factuais materiais foram projetadas como `PublicSource` independentes, cada uma com provenance própria:

- a Notificação Recomendatória 003/2026 do MPC usa o snapshot Wayback cuja equivalência material a Redação confirmou por comparação de bytes e SHA-256;
- o registro de imprensa sobre a DM 0230/2026 usa a **origem viva observada**, porque sua preservação permanece `pending` — estado de durabilidade, não defeito editorial, e não motivo de rejeição;
- a busca negativa no Diário Oficial é verificação própria da Redação, publicada com o locator do acervo de edições e com escopo, instrumento e limitações explícitos.

Nenhuma provenance foi reaproveitada de uma fonte para outra e nenhum snapshot, timestamp ou equivalência foi inventado.

## Riscos específicos da superfície pública

Verifiquei e não encontrei: exposição de metadado privado, locator quebrado, território inválido, colisão de path, ou diferença material entre a `article-ready` e o artigo público.

Um risco próprio desta matéria merece registro: o texto descreve apontamentos preliminares de órgão de controle sobre conduta administrativa. A projeção preserva integralmente as ressalvas aprovadas — a audiência no TCE não é imputação definitiva, os servidores chamados não são nominados, a cotação de R$ 120,2 milhões não é despesa realizada, e a ausência de publicação no Diário Oficial não é prova de abandono. Nenhuma dessas salvaguardas foi editada na passagem para o repositório público.

publication-candidate-key: franklinbaldo/ovigia-redacao|sha256:5a5eea7e2ecbdab9e78ab5927e7bd3790ba9b0f17f40fac5bdbf8ff27fdac136
