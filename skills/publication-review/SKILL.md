---
name: publication-review
description: Avalia independentemente uma candidata article-ready e decide publicar ou devolver trabalho à redação por issue.
compatibility: ">=1.0.0"
metadata:
  version: "1.2.0"
  owner_role: "publication-agent"
---

# Skill: Publication Review

## Purpose

Decidir se uma versão exata `article-ready` pode ser colocada sob a marca pública sem transformar o publicador em segunda redação.

## Inputs

- commit fixado de `franklinbaldo/ovigia-redacao`;
- candidate key `(repo, path, source_digest)` produzida pelo `okf-parser`;
- body editorial;
- subject/profile/gates do mesmo digest;
- proveniência/fontes suficientes;
- `publication/reviews/` e histórico do `story_id`.

## Procedure

1. Antes de nova review, reconcilie side effects pendentes em `publication/reviews/`.
2. Fixe um commit da Redação.
3. Carregue o bundle com `okf-parser` e enumere `article-ready` válidos.
4. Exclua candidate keys com decision record existente; records incompletos são retomados, não reavaliados.
5. Escolha uma candidata sem decisão e leia a matéria inteira.
6. Confirme coerência de digest, subject, profile, approvals e proveniência.
7. Faça julgamento independente focado em defeitos **materiais** de publicação; não repita gates só para demonstrar atividade.
8. Se houver necessidade de nova apuração/revisão editorial, siga `Reject`.
9. Se for publicável sem mudança material de body, siga `Accept`.

## Reject

1. Grave `publication/reviews/<story-id>/<source-digest>.md` com `decision: rejected` e `newsroom_issue: pending`.
2. Procure na Redação o marcador exato `publication-review-key: <repo>|<path>|<digest>`.
3. Se uma issue com a chave já existe, reutilize-a; se não, abra exatamente uma.
4. Atualize o review record com a URL da issue.
5. Se a sessão parar entre essas etapas, a próxima sessão reconcilia o record pendente em vez de refazer a review.
6. Não copie nem edite a candidata.
7. Digest futuro é nova candidata; decisão antiga permanece histórica.

## Accept

1. Grave decision record `accepted` com um único `public_path`.
2. Se o record já existia sem event final, retome o mesmo path e inspecione o que já foi materializado/commitado/servido; não publique uma segunda cópia.
3. Extraia o body aprovado; não copie frontmatter privado inteiro.
4. Aplique whitelist de metadados públicos e preserve `story_id`, source repo/commit/path/digest.
5. Resolva slug collision como metadado público; não rejeite só por colisão técnica.
6. Atualize `content/articles/<slug>.md` e gere projeções estáticas.
7. Integre por Git/PR normal.
8. Confirme a URL.
9. Registre `publication/events/...` com kind, candidate key, commit, artefato/path, URL e timestamp.

## Corrections

- projeção/metadado público sem mudança do body: corrija aqui;
- mudança editorial material: issue na Redação → novo digest → nova review;
- retirada urgente pode ocorrer aqui com event `withdrawn` porque este repo controla disponibilidade;
- não apague histórico de publicação.

## Must not

- publicar só porque a Redação marcou `article-ready`;
- sincronizar automaticamente;
- criar fila/ID paralelo;
- duplicar review/issue/publicação para a mesma candidate key;
- abandonar um decision record com side effect pendente;
- expor metadados privados por cópia cega;
- editar body materialmente;
- tratar preferência estilística como blocker;
- publicar fixture/demo como notícia real.

## Output

Uma decisão persistida e idempotente por candidate key. Side effects externos ficam explicitamente reconciliáveis; quando aceita e efetivamente publicada, um evento público confirmável completa o ciclo.
