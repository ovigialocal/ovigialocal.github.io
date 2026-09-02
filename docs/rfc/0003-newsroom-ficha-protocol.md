# RFC 0003 — Contrato de fichas entre publicação/site e Redação

Status: **Proposta coordenada com `franklinbaldo/ovigia-redacao#80`**  
Data: 2 de setembro de 2026

Esta RFC **substitui apenas o mecanismo de retorno por issue** da RFC 0001, especialmente as partes de `decision record`/recuperação/rejeição que usam `newsroom_issue` e “reject → issue”. Todas as demais decisões da RFC 0001 — autoridade independente do publicador, candidate key, pull periódico, reserva transacional, aceite, ledger público e idempotência — permanecem vigentes. `AGENTS.md` e `skills/publication-review/SKILL.md` refletem o contrato operacional corrente.

## 1. Decisão

O site público e a Redação são dois loops autônomos.

`franklinbaldo/ovigia-redacao` produz e mantém o estado editorial privado. Este repositório decide independentemente o que entra e permanece sob a marca pública.

Não existe sincronização automática de matéria pronta. `article-ready` significa **candidata pronta para julgamento de publicação**.

O canal canônico de retorno deste lado para a Redação passa a ser uma `editorial-ficha` criada no bundle OKF da própria Redação. A Redação fecha documentalmente esse pedido por `editorial-ficha-response` e/ou pelos artefatos editoriais resultantes.

## 2. Topologia

```text
REDAÇÃO
sources → apuração → gates → article-ready
                              │
                              │ oferta assíncrona
                              ▼
                    AGENTE PUBLICADOR
                       (~hora em hora)
                    ┌─────────┴─────────┐
                    │                   │
                 ACCEPT              REJECT
                    │                   │
                    ▼                   ▼
             PublicArticle       editorial-ficha
                    │                   │
                    ▼                   ▼
                SITE PÚBLICO      REDAÇÃO (round futuro)
                    │                   │
                    │ observação        └→ novo ready / correção /
                    └→ editorial-ficha     nova matéria / resposta
```

O publicador não espera sincronicamente a Redação. Em uma rodada futura, volta a fixar o estado privado e observa o que mudou.

## 3. Autoridade do publicador

O publicador deve continuar podendo dizer **não** mesmo quando todos os gates da Redação fecharam um `article-ready`.

Isso não significa que ele possa reescrever a matéria. O limite é:

- defeito de renderer/metadado público sem mudança editorial → corrigir neste repo;
- defeito editorial material → recusar/devolver por ficha;
- candidata publicável → aceitar e materializar `PublicArticle`;
- risco urgente já publicado → pode retirar/tombstone porque este repo controla disponibilidade, mas a correção editorial substantiva volta à Redação.

## 4. Ficha é mais geral que rejection

O agente publicador é uma origem importante de fichas, mas não a única.

Agentes que trabalham sobre o site já publicado podem criar fichas quando observarem:

- `public-correction`: possível erro/desatualização material;
- `follow-up`: fato ou marco posterior que merece acompanhamento;
- `new-story`: oportunidade de matéria relacionada;
- `verification`: afirmação pública que merece confirmação/falsificação adicional;
- `enrichment`: fonte, documento, dado, contexto ou contraditório útil;
- `publication-rejection`: defeito que impediu uma candidate key de ser publicada.

A ficha registra a necessidade, não prescreve a conclusão. A Redação pode confirmar, reformular, produzir outra matéria, falsificar a hipótese, bloquear ou recusar com justificativa.

## 5. Onde a ficha vive

A ficha **não vive neste repo**. O publicador/site escreve a solicitação no repositório que possui o trabalho editorial:

```text
franklinbaldo/ovigia-redacao/
  knowledge/editorial/fichas/<AAAA>/<MM>/<timestamp>-<slug>.md
```

O artefato é `type: editorial-ficha` e sua identidade é o path OKF. Não criar UUID/hash paralelo.

Este repo persiste apenas a referência necessária para reconstruir o side effect (`newsroom_ficha`) junto à decisão/evento que o originou.

## 6. Idempotência de rejection

Para rejeição de publicação, a chave continua sendo:

```text
source_repository | story_id | article_ready_source_digest
```

Uma candidate key rejeitada produz no máximo uma ficha canônica de `publication-rejection`. Se a sessão cai depois de criar a ficha e antes de atualizar a decision, a próxima sessão deve localizar a ficha pela candidate key e reconciliar, não duplicar.

Novo `article-ready_source_digest` é novo estado editorial e portanto nova candidate key.

## 7. Pós-publicação

O loop do site não termina no deploy. O estado público pode ser observado por agentes próprios. Quando essa observação revela necessidade editorial, o site **não passa a editar a Redação de dentro deste repo**: cria ficha na Redação com evidência e critério de saída.

Isso cria feedback real entre produto público e newsroom sem colapsar as duas autoridades.

## 8. GitHub issue

Issue pode continuar existindo para visibilidade humana, discussão ou bloqueio operacional, mas não é mais o objeto canônico de retorno editorial.

Se uma issue for criada, ela deve apontar para a ficha. Uma issue sem ficha não fecha o contrato documental.

Registros históricos que usam `newsroom_issue` continuam válidos; novas rejeições devem preferir `newsroom_ficha`. Não reescrever histórico apenas para migrar nome de campo.

## 9. Ordem de integração

1. integrar primeiro `franklinbaldo/ovigia-redacao#80`, para que a Redação reconheça/consuma `editorial-ficha` e `editorial-ficha-response`;
2. só então integrar esta mudança no site/publicador;
3. a primeira rejeição futura valida o caminho real de ida;
4. a resposta/novo ready em round posterior valida a volta documental.

## 10. Critério de pronto

- Redação e site descrevem a mesma separação de autoridades;
- `article-ready` permanece oferta, nunca trigger automático;
- rejection materializa ficha canônica sem edição editorial no site;
- fichas pós-publicação podem pedir correção, follow-up ou nova apuração;
- rounds da Redação descobrem fichas abertas;
- resposta da Redação é documental e assíncrona;
- side effects são idempotentes/reconciliáveis;
- issues são auxiliares, não autoridade.
