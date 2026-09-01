---
name: publication-review
description: Avalia independentemente uma candidata article-ready fechada e decide publicar ou devolver trabalho à redação por issue.
compatibility: ">=1.0.0"
metadata:
  version: "1.4.0"
  owner_role: "publication-agent"
---

# Skill: Publication Review

## Purpose

Decidir se uma candidatura `article-ready` fechada pode ser colocada sob a marca pública sem transformar o publicador em segunda redação.

## Inputs

- commit fixado de `franklinbaldo/ovigia-redacao`;
- candidate key `(source_repository, story_id, article_ready_source_digest)`;
- `source_path` como locator;
- envelope ready + subject/profile/approvals fixados por digest;
- proveniência/fontes suficientes;
- decisions integradas em `main`;
- PRs/transações abertas e histórico público do `story_id`.

## Procedure

1. Reconcilie primeiro qualquer transação aberta ou side effect pendente.
2. Fixe um commit da Redação e carregue o bundle com `okf-parser`.
3. Enumere `article-ready` e valide que cada oferta fecha subject/profile/approvals por `source_digest` e não diverge do body/title/description aprovados.
4. Derive a key repo/story/ready-digest. Path/commit não fazem parte da identidade.
5. Exclua keys já decididas em `main` e keys reservadas por PR aberta.
6. Para uma key realmente livre, derive `story_token`/`digest_token` por percent-encoding e reserve a branch determinística `publication/<story_token>/<digest_token>`.
7. Abra/reutilize PR com marker exato `publication-candidate-key: <repo>|<story_id>|<ready-digest>`.
8. Leia a matéria inteira e a evidência suficiente.
9. Faça julgamento independente focado em defeitos **materiais** de publicação; não repita gates só para demonstrar atividade.
10. Se houver necessidade de nova apuração/revisão editorial, siga `Reject`.
11. Se for publicável sem mudança material de conteúdo editorial, siga `Accept`.

## Archived provenance

A autoridade pública preserva a distinção entre origem viva e evidência arquivada produzida pela Redação:

- quando a `source-observation` usada pela candidata contém `archive_url` válido e correspondente ao material verificado, o link público de proveniência deve apontar para esse snapshot do Internet Archive/Wayback Machine;
- nesse caso, grave o snapshot em `source_url` do Markdown público para que as projeções e a interface apontem para a evidência temporalmente estável;
- preserve a origem canônica/viva em `source_original_url`;
- quando a observação registra `archive_failure` válido ou o recurso não é arquivável, use a origem viva em `source_url` e não invente um endereço Wayback;
- não substitua um snapshot verificado por captura mais antiga ou mais recente apenas por conveniência: a cópia pública deve representar a evidência usada na apuração sempre que isso for tecnicamente possível.

Essa seleção de URL é projeção de proveniência, não edição editorial do conteúdo aprovado.

## Portable records

Nunca use o digest cru `sha256:...` como filename. Use percent-encoding reversível apenas para o path:

```text
publication/reviews/<story_token>/<digest_token>.md
publication/events/<story_token>/<YYYYMMDDTHHMMSSZ>-<kind>.md
```

O frontmatter sempre guarda `story_id` e digest integrais.

## Reject

1. Na transação reservada, grave decision `rejected` com `newsroom_issue: pending`.
2. Procure na Redação o marker exato `publication-review-key: <repo>|<story_id>|<ready-digest>`.
3. Reutilize issue existente ou abra exatamente uma.
4. Atualize o record com a URL da issue.
5. Integre a decision pelo fluxo Git normal quando possível.
6. Se a sessão parar, a próxima retoma a mesma PR/marker e reconcilia issue/record; não refaz a review.
7. Não copie nem edite a candidata.
8. Ready digest futuro é nova candidate key; decisão antiga permanece histórica.

## Accept

1. Na transação reservada, grave decision `accepted` com um único `public_path`.
2. Extraia body/title/description aprovados do envelope validado; não copie frontmatter privado inteiro.
3. Aplique whitelist de metadados públicos e preserve `story_id`, source repo/commit/path/digest.
4. Projete a proveniência conforme `Archived provenance`: prefira `archive_url` verificado como `source_url` público e preserve a origem em `source_original_url`; use a origem diretamente somente quando não houver snapshot válido.
5. Resolva slug collision como metadado público; não rejeite só por colisão técnica.
6. Atualize `content/articles/<slug>.md` e gere projeções estáticas.
7. Integre a PR por Git normal.
8. Depois do merge, confirme Pages/URL.
9. Registre publication event posterior com kind, candidate key, commit, artefato/path, URL e timestamp.
10. Se `accepted` já está em `main` sem event, retome o mesmo `public_path`; não reveja, não escolha outro slug e não publique uma segunda cópia.

## Corrections

- projeção/metadado público sem mudança editorial: corrija aqui;
- mudança editorial material: issue na Redação → novo subject/gates/ready digest → nova review;
- retirada urgente pode ocorrer aqui com event `withdrawn` porque este repo controla disponibilidade;
- não apague histórico de publicação.

## Must not

- publicar só porque a Redação marcou `article-ready`;
- revisar envelope com pin quebrado ou conteúdo diferente do subject aprovado;
- tratar rename de path como nova candidatura;
- ignorar PR/transação aberta para a mesma key;
- sincronizar automaticamente;
- criar ID/hash paralelo;
- duplicar review/issue/publicação para a mesma key;
- abandonar side effect pendente sem estado retomável;
- expor metadados privados por cópia cega;
- editar conteúdo editorial materialmente;
- tratar preferência estilística como blocker;
- publicar fixture/demo como notícia real;
- inventar snapshot, timestamp de arquivamento ou equivalência entre landing page e anexo não verificado.

## Output

Uma decisão persistida e idempotente por candidate key. Antes do merge, a PR/branch determinística registra a transação in-flight; depois do merge, `main` é canônico. Quando aceita e efetivamente publicada, um evento público confirmável completa o ciclo.
