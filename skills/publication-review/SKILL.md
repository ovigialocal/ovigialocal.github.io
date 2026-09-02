---
name: publication-review
description: Avalia independentemente uma candidata article-ready fechada e decide publicar ou devolver trabalho à redação por ficha editorial canônica.
compatibility: ">=1.0.0"
metadata:
  version: "1.6.0"
  owner_role: "publication-agent"
---

# Skill: Publication Review

## Purpose

Decidir se uma candidatura `article-ready` fechada pode ser colocada sob a marca pública sem transformar o publicador em segunda redação.

A Redação e a face pública são loops recorrentes autônomos. `article-ready` é uma oferta assíncrona para julgamento independente, nunca uma ordem de publicação.

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
- nesse caso, grave o snapshot em `source_url` do `PublicArticle` para que todas as superfícies derivadas apontem para a evidência temporalmente estável;
- preserve a origem canônica/viva em `source_original_url` quando o contrato público admitir esse campo;
- quando a observação registra `archive_failure` válido ou o recurso não é arquivável, use a origem viva em `source_url` e não invente um endereço Wayback;
- não substitua um snapshot verificado por captura mais antiga ou mais recente apenas por conveniência: a cópia pública deve representar a evidência usada na apuração sempre que isso for tecnicamente possível.

Essa seleção de URL é transformação de proveniência pública, não edição editorial do conteúdo aprovado.

## Portable records

Nunca use o digest cru `sha256:...` como filename. Use percent-encoding reversível apenas para o path:

```text
publication/reviews/<story_token>/<digest_token>.md
publication/events/<story_token>/<YYYYMMDDTHHMMSSZ>-<kind>.md
```

O frontmatter sempre guarda `story_id` e digest integrais.

## Reject

Uma rejeição material devolve trabalho à Redação por **`editorial-ficha` canônica**, não por reescrita local e não por issue como autoridade.

1. Na transação reservada, grave decision `rejected` com `newsroom_ficha: pending`.
2. Derive a chave de deduplicação exata `publication-review-key: <repo>|<story_id>|<ready-digest>`.
3. Procure em `franklinbaldo/ovigia-redacao` uma `editorial-ficha(kind=publication-rejection)` que carregue essa candidate key.
4. Reutilize a ficha existente ou crie exatamente uma em `knowledge/editorial/fichas/<AAAA>/<MM>/<timestamp>-<slug>.md`, seguindo `specs/editorial-ficha.md` da Redação.
5. A ficha deve registrar observação, relevância material, perguntas de apuração e critério de saída. Não presuma qual conclusão a Redação deve alcançar.
6. Atualize o record local com o locator/URL da ficha em `newsroom_ficha`.
7. Integre a decision pelo fluxo Git normal quando possível.
8. Issue na Redação é opcional para visibilidade humana/bloqueio operacional. Se criada, deve apontar para a ficha e não substituí-la.
9. Se a sessão parar, a próxima retoma a mesma PR/marker, procura a ficha pela candidate key e reconcilia; não refaz a review nem cria segunda ficha.
10. Não copie nem edite a candidata.
11. Ready digest futuro é nova candidate key; decisão e ficha antigas permanecem históricas.

### Compatibilidade histórica

Registros anteriores que usam `newsroom_issue` continuam válidos. Não os reescreva apenas para trocar o nome do campo. Se uma transação histórica estiver com `newsroom_issue: pending`, reconcilie pelo contrato histórico e não crie automaticamente uma ficha duplicada para o mesmo side effect.

## Accept

1. Na transação reservada, grave decision `accepted` com um único `public_path`.
2. Extraia body/title/description aprovados do envelope validado; não copie frontmatter privado inteiro.
3. Aplique whitelist de metadados públicos e preserve `story_id`, source repo/commit/path/digest.
4. Projete a proveniência conforme `Archived provenance`: prefira `archive_url` verificado como `source_url` público e preserve a origem quando o contrato permitir; use a origem diretamente somente quando não houver snapshot válido.
5. Resolva slug collision como metadado público; não rejeite só por colisão técnica.
6. Materialize ou atualize `content/articles/<slug>.md` como `type: PublicArticle`. Qualquer `locality`/`bairro` usado deve resolver para `PublicTerritory` existente; crie/ajuste o conceito territorial apenas quando o território é factual e canônico, nunca por slugificação ad hoc.
7. Rode o contrato público: `python scripts/check-astro-okf-contract.py`, `python scripts/check-public-surface.py`, `bun run check` e `bun run build`. Não gere `_news` nem outra cópia do artigo.
8. Integre a PR por Git normal.
9. Depois do merge, confirme Pages/URL.
10. Registre publication event posterior com kind, candidate key, commit, artefato/path, URL e timestamp.
11. Se `accepted` já está em `main` sem event, retome o mesmo `public_path`; não reveja, não escolha outro slug e não publique uma segunda cópia.

## Public semantic boundary

`content/` é um bundle OKF público. `okf-parser` é a autoridade sobre o TypeContract de `PublicArticle` e `PublicTerritory`; Astro apenas consome o Zod gerado e apresenta os conceitos.

Não implemente uma segunda lista de campos obrigatórios em Python/TypeScript/Astro. Não trate `PublicTerritory.name` como rótulo de UI: `name` é chave relacional e `title` é apresentação humana.

## Corrections and post-publication feedback

- renderer/metadado público sem mudança editorial: corrija aqui;
- mudança editorial material: crie/reutilize `editorial-ficha` na Redação → trabalho editorial → novo subject/gates/ready digest → nova review;
- agentes que observam o estado já publicado também podem criar fichas `public-correction`, `follow-up`, `new-story`, `verification` ou `enrichment` quando houver necessidade material;
- retirada urgente pode ocorrer aqui com event `withdrawn` porque este repo controla disponibilidade;
- redação substantiva de correção/retração continua pertencendo à Redação;
- não apague histórico de publicação nem fichas/respostas históricas.

## Must not

- publicar só porque a Redação marcou `article-ready`;
- revisar envelope com pin quebrado ou conteúdo diferente do subject aprovado;
- tratar rename de path como nova candidatura;
- ignorar PR/transação aberta para a mesma key;
- sincronizar automaticamente;
- criar ID/hash paralelo;
- duplicar review/ficha/publicação para a mesma key;
- tratar GitHub issue como autoridade semântica do retorno quando o contrato de ficha estiver ativo;
- abandonar side effect pendente sem estado retomável;
- expor metadados privados por cópia cega;
- editar conteúdo editorial materialmente;
- tratar preferência estilística como blocker;
- publicar fixture/demo como notícia real;
- inventar snapshot, timestamp de arquivamento ou equivalência entre landing page e anexo não verificado;
- manter `_news`, schema manual ou parser de frontmatter paralelo ao `okf-parser`.

## Output

Uma decisão persistida e idempotente por candidate key. Antes do merge, a PR/branch determinística registra a transação in-flight; depois do merge, `main` é canônico. Quando aceita e efetivamente publicada, um evento público confirmável completa o ciclo. Quando rejeitada, uma única ficha canônica na Redação registra o trabalho devolvido e permite que rounds futuros processem a necessidade sem acoplamento síncrono.
