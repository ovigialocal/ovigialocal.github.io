---
name: publication-review
description: Valida e executa a transação pública de uma candidata article-ready sem refazer a redação.
compatibility: ">=1.0.0"
metadata:
  version: "1.9.0"
  owner_role: "publication-agent"
---

# Publication Review

## Purpose

A autoridade pública **não é uma segunda redação**. O trabalho editorial substantivo já foi concluído pela Redação e pelos reviews independentes ligados ao digest.

`publication-review` existe para responder uma pergunta menor: **esta oferta `article-ready` pode ser projetada e publicada corretamente, de forma idempotente e sem risco público específico introduzido pela transação?**

Não releia fontes para repetir `evidence-review`, não reexecute reader/framing e não produza uma nova avaliação estética do texto. Se o envelope é válido e não há defeito público novo, publique.

## Inputs

- commit privado fixado;
- `article-ready` e seu `source_digest` canônico;
- subject/profile/approvals fechados no envelope;
- source observations factuais;
- decisions, PRs e events públicos existentes.

## Fast path

1. Reconcilie candidate key, decision/PR/event existentes. Nunca duplique.
2. Fixe o commit privado e valide o envelope com `okf-parser`.
3. Confirme que o body/title/description/`chamada` projetados são exatamente os aprovados.
4. Confirme que toda fonte factual material resolve para `PublicSource` e que sua projeção de provenance corresponde à observação da Redação.
5. Faça somente checks de risco **específicos da superfície pública**: exposição de metadado privado, locator quebrado, território inválido, colisão/path, projeção incorreta ou diferença material entre ready e artigo público.
6. Se não houver defeito material, `Accept` imediatamente. Preferência estilística não é revisão.
7. Se houver defeito editorial que exigiria mudar o conteúdo aprovado, `Reject` por ficha; o site não edita a candidata.

## Candidate key e idempotência

A identidade é:

```text
(source_repository, story_id, article_ready_source_digest)
```

Path e commit são locators, não identidade. Antes de criar branch/PR, procure decision integrada e PR aberta para a mesma key.

Use branch determinística `publication/<story_token>/<digest_token>` e marker:

```text
publication-candidate-key: <repo>|<story_id>|<ready-digest>
```

## Accept

1. Persista decision `accepted` com um único `public_path`.
2. Copie literalmente body/title/description e `chamada` somente quando já existir na candidata; não crie nova chamada.
3. Materialize `PublicArticle` com whitelist de metadados públicos e provenance editorial (`source_repository`, `source_commit`, `source_path`, `source_digest`).
4. Para **cada** `source-observation` factual material, materialize/reutilize `PublicSource` com `source_ref` igual ao locator da observação.
5. Quando a Redação confirmou snapshot, `PublicSource.source_url` pode apontar ao Wayback e `source_original_url` preserva a origem viva. Em fallback válido, use a origem viva. Nunca invente snapshot/equivalência.
6. Grave todos os refs em `PublicArticle.source_refs`. Campos singulares `source_name/source_url/source_original_url` são apenas compatibilidade da primeira fonte exibível.
7. Faça os checks públicos atuais de OKF/superfície/Astro/build.
8. Integre a PR.
9. Confirme Pages/URL no SHA integrado.
10. Só então registre `publication-event` com candidate key, commit, blob/path, URL, timestamp e confirmação do deploy.

Se `accepted` já estiver em `main` sem event, retome o mesmo `public_path`; não reavalie nem publique uma segunda cópia.

## Reject

Rejeite apenas quando há defeito material que a autoridade pública não pode corrigir sem alterar a candidatura: envelope inválido, diferença de conteúdo, exposição indevida, provenance pública impossível de projetar com segurança ou outra falha real de publicação.

1. Persista decision `rejected`.
2. Crie/reutilize exatamente uma `editorial-ficha(kind=publication-rejection)` na Redação, deduplicada pela candidate key.
3. Registre observação, relevância e critério de saída; não prescreva conclusão editorial.
4. Não copie, reescreva ou “melhore” a matéria no site.

Ready digest futuro é nova candidate key; decisão e ficha antigas permanecem históricas.

## PublicSource

`PublicArticle.source_refs` é a lista canônica das fontes factuais. Cada `PublicSource` mantém publisher, momento observado, source kind, URL viva e estado arquivado aplicável.

Preservação de uma fonte não cobre outra. Profile, gate, self-review e ficha não são fontes factuais públicas.

## Correções pós-publicação

- renderer/metadado sem mudança editorial: corrija aqui;
- mudança editorial material: ficha → Redação → novo digest/reviews/ready → nova publication-review;
- retirada urgente pode ocorrer aqui com event `withdrawn` porque este repo controla disponibilidade.

## Must not

- refazer os gates da Redação por ritual;
- rejeitar por preferência estilística;
- publicar com envelope/digest inconsistente;
- ignorar transação existente para a mesma key;
- criar chamada ou editar conteúdo aprovado;
- expor frontmatter privado por cópia cega;
- representar várias fontes por uma única provenance artificial;
- inventar IDs, hashes, snapshots ou equivalência;
- declarar publicado antes da confirmação real de Pages.

## Output

Uma decisão idempotente por candidate key e, quando aceita, uma transação curta:

```text
ready válido → decision + PublicArticle/PublicSources → checks → merge → Pages confirmado → publication-event
```

A meta é transformar uma candidata aprovada em publicação, não julgá-la uma segunda vez.
