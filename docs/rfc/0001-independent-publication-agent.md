# RFC 0001 — Agente independente de publicação

Status: Em revisão  
Data: 31 de agosto de 2026

## 1. Decisão institucional

`ovigialocal/ovigialocal.github.io` é a **autoridade pública** de O Vigia.

A Redação privada (`franklinbaldo/ovigia-redacao`) termina em um `article-ready` fechado sobre uma versão editorial exata. Este repositório descobre candidatas por pull e decide, de forma independente, se aceita aquela candidatura sob a marca pública.

```text
ovigia-redacao
  article-ready fechado
       ║ pull de commit fixado
publication-review
   ┌───┴────┐
reject     accept
  ↓           ↓
issue      Markdown público canônico
              ↓
       projeções estáticas
              ↓
       commit / GitHub Pages
              ↓
       confirmação da URL
              ↓
       publication event
```

`article-ready` é uma alegação da Redação, nunca uma ordem de publicação.

## 2. Autoridade deste repositório

Este repo é o único dono de:

- `publication-review`;
- reserva/in-flight state de uma candidatura durante uma sessão/PR;
- decisão `accepted`/`rejected` para uma candidatura exata;
- Markdown público canônico;
- slug/path e metadados de publicação;
- HTML, `articles.json`, feed e sitemap derivados;
- commit que materializa publicação;
- URL e confirmação pública;
- disponibilidade pública;
- histórico de publicação, correção, atualização, retirada, retração e substituição.

Não é autoridade sobre fontes internas, pauta, apuração, draft, self-review, gate profile/evaluations ou decisão de `article-ready`.

## 3. Oferta privada fechada

O publicador nunca trabalha com “a última versão” implicitamente e nunca confia apenas em paths.

Antes da review:

1. fixa um commit de `franklinbaldo/ovigia-redacao`;
2. carrega o bundle daquele commit com `okf-parser`;
3. resolve um concept `article-ready`;
4. valida o envelope da RFC 0017 da Redação;
5. confirma que o próprio `article-ready` fixa por `ConceptRecord.source_digest`:
   - `gate_subject`;
   - `gate_profile`;
   - exatamente uma avaliação selecionada por gate requerido;
6. confirma que body, `title` e `description` do ready são iguais aos do subject aprovado.

Se qualquer pin não coincidir com o concept encontrado naquele commit, a oferta é inválida e **não entra em publication-review**.

O publicador pode executar `validate_article_ready_offer()` no checkout privado fixado ou validação equivalente contra o mesmo contrato. Não criar hash/ID/grafo paralelo para substituir o parser.

## 4. Chave de candidatura

A chave idempotente é:

```text
(source_repository, story_id, article_ready_source_digest)
```

onde `article_ready_source_digest` é o `ConceptRecord.source_digest` do próprio envelope `article-ready`.

Persistir também:

- `source_commit`;
- `source_path`.

Mas commit/path são **locators e proveniência**, não identidade da decisão. Mover/renomear o mesmo ready não cria uma nova candidatura nem autorização para segunda publicação.

Um novo ready digest do mesmo `story_id` é uma nova candidatura e exige nova review; aceite nunca é herdado.

## 5. Encoding de paths do ledger

Digests reais têm forma como `sha256:<hex>`. `:` não é um filename portável para checkout Windows. Portanto os nomes de arquivos do ledger usam uma **codificação de path**, não um novo identificador/hash.

Defina:

```text
story_token  = percent-encode UTF-8 de story_id como um único path segment
digest_token = percent-encode UTF-8 de article_ready_source_digest como um único path segment
```

mantendo apenas caracteres unreserved portáveis (`A-Z a-z 0-9 - . _ ~`) sem escape. O valor integral original continua dentro do frontmatter e da candidate key.

Exemplo:

```text
sha256:abc... → sha256%3Aabc...
```

Nenhuma decisão pode depender da forma codificada; ela serve apenas para filename seguro/reversível.

## 6. Descoberta por pull sem fila compartilhada

Não existe sync, webhook obrigatório, daemon, banco ou flag escrita na Redação.

Em uma execução session-based, o agente:

1. reconcilia trabalho público in-flight/pending já existente;
2. fixa um commit privado;
3. enumera `concept_type=article-ready` via `okf-parser`;
4. valida os envelopes;
5. deriva candidate keys;
6. lê decisions já integradas em `main`;
7. procura transações abertas para as keys restantes;
8. escolhe uma candidatura realmente nova.

A fila é a diferença derivada entre ofertas privadas válidas e estado público `main + transações abertas`.

## 7. Reserva transacional Git antes da review

Git é o banco, mas uma branch/PR não mergeada também é estado persistente. Para impedir duas sessões de iniciar a mesma review antes que exista decision em `main`, cada candidatura usa reserva determinística:

```text
branch: publication/<story_token>/<digest_token>
PR body marker:
publication-candidate-key: <source_repository>|<story_id>|<article_ready_source_digest>
```

### Regras

1. antes de formar decisão/side effect, procure decision em `main` e PR/transação aberta com o marker exato;
2. se houver transação aberta, **retome-a**;
3. se não houver, crie a branch determinística a partir do `main` público atual e abra uma PR/draft de transação com o marker;
4. criar a branch é a reserva Git da candidatura; duas sessões não devem criar duas branches alternativas para a mesma key;
5. a reserva não significa `accepted`: significa apenas “review in-flight”;
6. uma PR fechada sem merge e explicitamente marcada `aborted` libera a candidatura para nova review; seu histórico permanece auditável;
7. depois do merge, o decision record em `main` é a fonte canônica e a branch pode ser removida normalmente.

Esse protocolo não cria workflow engine. Usa apenas Git/PR para tornar a sessão recuperável e reduzir corrida entre agentes.

## 8. Ledger Git mínimo

### 8.1 Decision record

```text
publication/reviews/<story_token>/<digest_token>.md
```

Campos mínimos:

- `story_id`;
- `source_repository`;
- `source_commit`;
- `source_path`;
- `source_digest` (ready digest integral);
- `decision: accepted | rejected`;
- `decided_at`;
- para rejeição: `newsroom_issue: pending | <issue-url>`;
- para aceite: `public_path` alocado.

Uma candidate key recebe exatamente uma decisão final, salvo override humano explícito que preserve a decisão anterior e explique a mudança.

O decision record não prova que side effects terminaram.

### 8.2 Publication event

Depois de uma decisão aceita ser efetivamente materializada/confirmada, registrar:

```text
publication/events/<story_token>/<YYYYMMDDTHHMMSSZ>-<kind>.md
```

O timestamp de filename é UTC compacto para ser portável; o frontmatter preserva o timestamp ISO completo.

Kinds:

```text
published | corrected | updated | withdrawn | retracted | replaced
```

Campos conforme aplicável:

- candidate key integral;
- `kind`;
- `public_path`;
- digest/hash do Markdown público ou artefato relevante;
- commit público que materializou o fato;
- URL;
- `confirmed_at`;
- relação com evento/publicação anterior.

O event posterior evita circularidade: o SHA do commit publicado não precisa existir dentro dos bytes daquele próprio commit.

## 9. Ordem de recuperação antes de trabalho novo

Toda sessão começa reconciliando:

1. **PR/transação aberta:** retomar a mesma candidate key; não criar segunda review;
2. **`rejected` + `newsroom_issue: pending`:** procurar issue pelo marker exato e criar só se ausente;
3. **`accepted` sem event final:** verificar branch/PR/commit/Pages/URL já existentes e completar a mesma publicação no mesmo `public_path`;
4. **decision + event reconciliados:** nada a repetir;
5. só então descobrir candidata sem state público.

Antes de criar qualquer side effect externo, procure evidência de que ele já existe. Toda etapa deve ser retomável após crash.

## 10. `publication-review`: função própria

O publicador não repete a Redação inteira.

Pode confiar como evidência de processo que:

- a Redação declarou `article-ready`;
- o envelope fixa profile/evaluations;
- `okf-parser` fornece identidade/digests/relações;
- o conjunto de gates passou pela validação estrutural da Redação.

Mas deve formar julgamento próprio sobre colocar a versão sob a marca, verificando materialmente:

- coerência do pacote/proveniência;
- afirmação factual material sem sustentação aparente;
- freshness material para informação de serviço;
- privacidade/sensibilidade;
- título/abertura materialmente desproporcionais;
- condição estrutural/segurança mínima para exposição pública.

Preferência cosmética não basta para rejeitar.

Problema editorial volta à Redação. Problema apenas de slug, HTML, feed, sitemap, CSS, canonical URL ou metadado público é resolvido aqui.

## 11. Rejeição e issue idempotente

Dentro da transação reservada:

1. grave decision `rejected` com `newsroom_issue: pending`;
2. antes de abrir issue, procure na Redação o marker da candidate key;
3. reutilize a issue encontrada ou crie exatamente uma;
4. atualize o record com a URL;
5. não copie nem edite a candidata;
6. integre a transação pelo fluxo Git normal quando os gates do repo permitirem.

Marker:

```markdown
publication-review: rejected
publication-review-key: <source_repository>|<story_id>|<article_ready_source_digest>
story_id: <story-id>
source_repository: franklinbaldo/ovigia-redacao
source_commit: <sha>
source_path: <path>
source_digest: <ready-digest>
review_record: <path/url deste repo>
```

A issue inclui findings, evidence e required work.

Se a sessão morrer depois da issue e antes de reconciliar o record, a busca pelo marker encontra a issue existente. Se morrer antes da issue, `pending` manda retomá-la. A review não é refeita.

Novo digest da Redação é nova key e exige nova review; a decisão antiga permanece histórica.

## 12. Aceite e double publication

Dentro da transação reservada:

1. grave `accepted` com um único `public_path`;
2. extraia corpo/editorial metadata do envelope validado;
3. materialize `content/articles/<slug>.md`;
4. derive HTML/`articles.json`/feed/sitemap;
5. integre a PR por Git normal;
6. depois do merge, confirme Pages/URL;
7. grave o publication event posterior.

Uma key não pode mapear silenciosamente para dois paths.

`accepted` em `main` sem event significa “decisão integrada, confirmação incompleta”. Retome o mesmo path; não faça nova review, novo slug ou segunda cópia.

Se a PR de aceite ainda estiver aberta, ela é a única transação in-flight daquela key; retome-a em vez de criar outra.

## 13. O que significa copiar Markdown

Nunca copie o arquivo privado byte a byte.

O canônico público é:

```text
content/articles/<slug>.md
```

O publicador extrai do envelope validado:

- body editorial aprovado;
- `title`/`description` aprovados;
- apenas outros metadados editoriais explicitamente admitidos pela whitelist.

Não copiar por default:

- self-review;
- findings internos;
- notas de apuração;
- instruções de agente;
- experience/wiki;
- frontmatter de workflow;
- informação sensível não destinada ao leitor.

O Markdown público preserva provenance suficiente:

- `story_id`;
- `source_repository`;
- `source_commit`;
- `source_path`;
- `source_digest`.

Slug, data/hora pública, URL e metadados de apresentação pertencem a este repo.

Uma reescrita material do body/título/description invalida o aceite e volta à Redação. Transformação mecânica de envelope/frontmatter não é reescrita editorial.

## 14. Slug collision e história

O slug pertence à publicação.

- path livre: aloque-o no accepted record;
- colisão com outro `story_id`: escolha alternativa determinística/legível e registre; não rejeite apenas por isso;
- novo digest do mesmo story que corrige/atualiza publicação usa, por default, o mesmo `public_path`;
- story novo deve ter identidade editorial própria;
- se um novo ready chega com `story_id` já usado por matéria substantivamente distinta, trate como erro de identidade e devolva à Redação;
- substituição deliberada é event `replaced`, nunca inferida de slug.

## 15. Correções, atualizações e retrações

### 15.1 Defeito de projeção

HTML/feed/sitemap/CSS/canonical/metadado público pode ser corrigido aqui quando conteúdo editorial aprovado não muda. Registre event se o fato público for material.

### 15.2 Correção/atualização editorial

Erro factual, informação de serviço atualizada ou mudança material exige:

1. issue/trabalho na Redação;
2. novo subject/gates/`article-ready` fechado;
3. nova candidate key/review;
4. atualização do mesmo `public_path` quando é continuação da mesma história;
5. event `corrected` ou `updated` ligando versão anterior e nova.

A Redação não precisa produzir type `article-published`/`article-correction`; o vínculo público vive aqui.

### 15.3 Withdrawal/retração urgente

Este repo controla disponibilidade. Em risco urgente, pode retirar/tombstonar e registrar `withdrawn` antes de novo conteúdo editorial, além de abrir issue na Redação.

Se é necessária justificativa/nota editorial material, a Redação produz novo conteúdo e nova oferta. O publicador avalia a nova candidatura e registra `retracted` quando aplicado. Histórico nunca é apagado silenciosamente.

## 16. Publicação pública e OKF

O repo público não vira segundo knowledge bundle só para espelhar a Redação.

Markdown público + frontmatter mínimo + Git + decision/event records são suficientes enquanto o uso real não demonstrar necessidade maior.

`okf-parser` é usado no boundary privado. Não criar concept IDs, grafo ou schema paralelo no público por antecipação.

## 17. Site atual e migração

Hoje a face pública possui HTML/JS estático, `articles.json`, feed e sitemap.

Direção:

```text
content/articles/<slug>.md        # canônico
publication/reviews/...           # decisões
publication/events/...            # fatos públicos confirmados
        ↓
HTML + articles.json + feed + sitemap  # derivados
```

A migração do renderer é etapa de implementação posterior. Não introduzir backend permanente, CMS ou banco.

## 18. Modelo session-based

Nenhum daemon é necessário.

Uma sessão:

- reconstrói `main` + transações abertas;
- reconcilia side effects;
- fixa commit privado;
- descobre uma candidata realmente livre;
- cria/retoma reserva determinística;
- forma julgamento;
- persiste decisão e efeitos retomáveis;
- termina.

GitHub Actions pode continuar existindo para tarefas públicas auxiliares (por exemplo captura visual), mas não é handoff editorial nem substitui o agente independente.

## 19. WikiSkill e independência

WikiSkill permanece inicialmente na Redação. Rejeições públicas fornecem feedback estruturado de alto valor.

Este repo só deve criar wiki/evolução própria quando uso real justificar. A skill `publication-review` pertence a este repositório; a Redação não a controla.

## 20. Primeira matéria

`franklinbaldo/ovigia-redacao#30` termina em `article-ready` validado. A issue pública #12 conduz reserve/review/publicação/URL.

O marco end-to-end cita ambos, sem autoridade compartilhada.

## 21. Critérios de aceite

A arquitetura está provada quando:

1. publicador fixa commit privado e valida envelope fechado;
2. key repo/story/ready-digest não muda por rename;
3. path do ledger é portável mesmo com `sha256:`;
4. uma candidatura possui no máximo uma transação aberta determinística;
5. sessão posterior retoma PR aberta em vez de duplicar review;
6. rejeição cria exatamente uma issue mesmo com crash parcial;
7. aceite fixa exatamente um `public_path`;
8. accepted sem event retoma confirmação em vez de republicar;
9. corpo público não vaza metadata privada nem diverge da versão aprovada;
10. HTML/JSON/feed/sitemap derivam do Markdown canônico;
11. publication event liga key, commit, artefato e URL;
12. correção/retração preserva história e fronteira institucional;
13. nenhuma sync, CMS, daemon, banco ou workflow engine é necessário.

## 22. Não objetivos

Não construir CMS, backend, banco, sincronizador permanente, espelho do knowledge corpus, segunda redação, publicação automática de todo ready, sistema de IDs paralelo ou fila escrita na Redação.

## 23. Regra curta

> “Existe uma candidatura fechada e exata que eu, como autoridade pública independente, aceito colocar sob a marca O Vigia?”

Se sim, reserve a key, registre a decisão e complete seus side effects de forma retomável. Se não, registre a rejeição e devolva trabalho à Redação sem reescrevê-la.
