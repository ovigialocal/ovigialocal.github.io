# RFC 0001 — Agente independente de publicação

Status: Em revisão  
Data: 30 de agosto de 2026

## 1. Decisão institucional

`ovigialocal/ovigialocal.github.io` é a **autoridade pública** de O Vigia.

A Redação privada (`franklinbaldo/ovigia-redacao`) termina em `article-ready`. Este repositório descobre candidatas por pull e decide, de forma independente, se aceita uma versão exata sob a marca pública.

```text
ovigia-redacao
  article-ready
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
```

`article-ready` é uma alegação da Redação, nunca uma ordem de publicação.

## 2. Autoridade deste repositório

Este repo é o único dono de:

- `publication-review`;
- decisão `accepted`/`rejected` para uma candidata exata;
- Markdown público canônico;
- slug/path e metadados de publicação;
- HTML, `articles.json`, feed e sitemap derivados;
- commit que materializa publicação;
- URL e confirmação pública;
- disponibilidade pública;
- histórico de publicação, correção, atualização, retirada e retração.

Não é autoridade sobre fontes internas, pauta, apuração, draft, self-review, gates ou `article-ready`.

## 3. Chave de identidade e pinning

O publicador nunca trabalha com “a última versão” implicitamente.

Antes da review:

1. fixa um commit de `franklinbaldo/ovigia-redacao`;
2. carrega o bundle daquele commit com `okf-parser`;
3. resolve um concept `article-ready` válido;
4. usa como chave da candidata:

```text
(source_repository, source_path, source_digest)
```

`source_digest` é o `ConceptRecord.source_digest` fornecido pelo parser. O commit privado fixado também é registrado para reprodutibilidade, mas não substitui o digest. Não criar hash, ID ou `concept_id` paralelo.

## 4. Descoberta por pull sem fila compartilhada

Não existe sync, webhook obrigatório, daemon ou flag escrita na Redação.

Em uma execução session-based, o agente:

1. fixa um commit privado;
2. enumera `concept_type=article-ready` via `okf-parser`;
3. valida spec/grafo/gates;
4. transforma cada concept em candidate key;
5. lê `publication/reviews/` neste repo;
6. separa três classes:
   - **sem decision record:** candidata elegível a review;
   - **decision record com side effect incompleto:** trabalho de reconciliação, não nova review;
   - **decision record completamente reconciliado:** nada a repetir para aquele digest;
7. escolhe uma unidade de trabalho finita.

A “fila” é derivada de `article-ready` + estado público persistido. O fato de uma candidata já ter sido examinada pertence somente a este repo.

## 5. Ledger Git mínimo de publicação

Para tornar review, retry e idempotência auditáveis sem construir CMS, este repo mantém dois tipos de registros Markdown versionados por Git.

### 5.1 Decision record

```text
publication/reviews/<story-id>/<source-digest>.md
```

Campos mínimos:

- `story_id`;
- `source_repository`;
- `source_commit`;
- `source_path`;
- `source_digest`;
- `decision: accepted | rejected`;
- `decided_at`;
- se rejeitado: `newsroom_issue: pending | <issue-url>`;
- se aceito: `public_path` alocado.

A existência do record congela a decisão editorial para a candidate key. Uma candidata/digest recebe exatamente uma decisão final, salvo override humano explícito e auditável que preserve a decisão anterior.

O record **não implica que seus side effects terminaram**. Sessões posteriores devem reconciliar side effects pendentes antes de procurar trabalho novo.

### 5.2 Publication event

Depois de uma candidata aceita ser efetivamente materializada/confirmada, registrar evento em:

```text
publication/events/<story-id>/<timestamp>-<kind>.md
```

com, conforme aplicável:

- candidate key;
- `kind: published | corrected | updated | withdrawn | retracted | replaced`;
- `public_path`;
- digest/hash do Markdown público ou artefato relevante;
- commit público que materializou o evento;
- URL;
- `confirmed_at`;
- relação com evento/publicação anterior quando existir.

O event record posterior evita circularidade: o commit de publicação não precisa aparecer dentro dos próprios bytes que determinam aquele commit.

### 5.3 Regra de recuperação

Git é o banco; portanto toda operação que cruza repositórios ou depende de Pages deve ser retomável.

Antes de criar qualquer side effect externo, o agente procura evidência de que ele já existe. Se a sessão morrer entre duas etapas, a seguinte reconstrói o estado e completa a mesma decisão em vez de criar outra.

Não criar banco, worker, workflow engine ou serviço de sincronização.

## 6. `publication-review`: função própria

O publicador não repete uma redação inteira.

Pode confiar como evidência de processo que:

- a Redação declarou `article-ready`;
- o profile e as avaliações ligadas existem;
- `okf-parser` fornece identidade/digests/links.

Mas deve formar julgamento independente sobre colocar aquela versão sob a marca, verificando o suficiente para detectar divergências materiais, como:

- versão/gates/proveniência incoerentes;
- afirmação factual material sem sustentação aparente;
- freshness material para informação de serviço;
- risco de privacidade/sensibilidade não resolvido;
- título/abertura materialmente desproporcionais;
- versão estruturalmente insegura para publicação.

Preferência estética/cosmética não é motivo suficiente para rejeição.

Problema editorial volta à Redação. Problema apenas de slug, HTML, feed, sitemap, CSS, canonical URL ou metadado público é resolvido aqui.

## 7. Rejeição, issue e idempotência transacional

Ao rejeitar:

1. grave o decision record `rejected` com `newsroom_issue: pending`;
2. procure na Redação uma issue que contenha a candidate key exata;
3. se existir, reutilize-a;
4. se não existir, abra uma única issue;
5. atualize o decision record com a URL da issue;
6. não copie nem edite a candidata.

A issue usa um marcador estável e pesquisável:

```markdown
publication-review: rejected
publication-review-key: <source_repository>|<source_path>|<source_digest>
story_id: <story-id>
source_repository: franklinbaldo/ovigia-redacao
source_commit: <sha>
source_path: <path>
source_digest: <digest>
review_record: <path/url deste repo>

## Findings
- ...

## Evidence
- ...

## Required work
- ...
```

Se uma sessão morrer depois do decision record e antes da issue, a próxima vê `newsroom_issue: pending`, procura pelo marcador exato e cria/reconcilia o side effect. Ela **não reabre a review**.

Se morrer depois de criar a issue e antes de atualizar o record, a busca pelo mesmo marcador encontra a issue existente e evita duplicação.

Quando a Redação produzir digest B, B é nova candidate key. A review de A continua histórica. A issue de A pode ser fechada/reconciliada quando o novo trabalho estiver representado, mas aceite nunca é herdado.

## 8. Aceite e double publication

Ao aceitar:

1. fixe a candidate key e grave decision record `accepted` com um único `public_path`;
2. se o record já existia, retome aquele path/decisão em vez de revisar novamente;
3. copie o corpo editorial aprovado;
4. acrescente somente metadados públicos;
5. derive a superfície estática;
6. integre por Git/PR normal;
7. confirme a URL;
8. grave o `publication-event` correspondente.

Uma candidate key não pode mapear silenciosamente para dois paths públicos.

`accepted` sem event `published` significa “decidido, side effect ainda incompleto”. Uma nova sessão deve **retomar** a publicação, verificar o que já foi materializado/commitado/servido e completar o evento; não escolher outro slug nem publicar uma segunda cópia.

## 9. O que significa copiar Markdown

Nunca copie o arquivo privado byte a byte.

O conteúdo público canônico é:

```text
content/articles/<slug>.md
```

O publicador extrai o **body editorial aprovado** e aplica uma whitelist de metadados públicos. Não copiar por default:

- self-review;
- findings internos;
- notas de apuração;
- instruções de agente;
- experiência operacional;
- frontmatter de workflow;
- informação sensível não destinada ao leitor.

O body editorial copiado deve permanecer materialmente idêntico ao aprovado; mudanças puramente mecânicas de envelope/frontmatter não autorizam reescrita do texto.

O Markdown público preserva, em metadados de proveniência não necessariamente exibidos com destaque:

- `story_id`;
- `source_repository`;
- `source_commit`;
- `source_path`;
- `source_digest`.

Slug, data/hora pública, URL e metadados de apresentação pertencem a este repo. Uma reescrita material do body invalida o aceite e volta à Redação como novo digest.

## 10. Slug collision e identidade de história

O slug é metadado de publicação e pertence a este repo.

- se o path proposto está livre, aloque-o no `accepted` record;
- se colide com outro `story_id`, escolha alternativa determinística/legível e registre a decisão; não devolva à Redação apenas por isso;
- novo digest do **mesmo** `story_id` que corrige/atualiza publicação existente usa, por default, o mesmo `public_path`;
- matéria jornalisticamente nova deve chegar com identidade editorial própria;
- substituição deliberada deve ser event explícito `replaced`, nunca inferida de slug semelhante.

## 11. Correções, atualizações e retrações

### 11.1 Defeito de projeção

HTML/feed/sitemap/CSS/canonical/metadado público pode ser corrigido diretamente aqui quando o body editorial aceito não muda. Registre evento se a mudança altera o artefato público de modo material para auditabilidade.

### 11.2 Correção editorial

Erro factual, nova informação de serviço ou mudança material do texto exige:

1. issue/trabalho na Redação;
2. novo `article-ready`/digest;
3. nova `publication-review` independente;
4. atualização do mesmo Markdown público/path quando for continuação da mesma história;
5. event `corrected` ou `updated` ligando versão anterior e nova.

Git preserva bytes anteriores; a superfície de correções deve ser derivável desses eventos e não apagar silenciosamente a história.

### 11.3 Retração/withdrawal urgente

Este repo controla disponibilidade pública. Se houver risco urgente, o publicador pode retirar/tombstonar uma matéria antes de novo conteúdo editorial e registrar `withdrawn`, além de abrir issue na Redação.

Se for necessária nota editorial material de retração/correção, a Redação produz novo conteúdo/digest e este repo o avalia. O evento final `retracted` preserva relação com a publicação original.

## 12. Publicação pública e OKF

O repo público não precisa se tornar outro knowledge bundle apenas para espelhar a Redação.

Para o conteúdo público, Markdown com frontmatter mínimo + Git + decision/event records é suficiente enquanto o volume não demonstrar necessidade maior. Não criar `concept_id`, grafo ou schema paralelo.

`okf-parser` é usado para **ler/validar a Redação** no boundary privado. Se no futuro os próprios registros públicos ganharem relações complexas suficientes para justificar OKF, isso exige decisão própria baseada em uso real.

## 13. Relação com o site atual

Hoje o site possui HTML/JS estático, `articles.json`, feed e sitemap, com previews locais e edição pública vazia.

A RFC define a direção:

```text
content/articles/<slug>.md        # canônico
publication/reviews/...           # decisão
publication/events/...            # histórico público
        ↓
HTML + articles.json + feed + sitemap  # derivados
```

A migração do renderer é implementação posterior desta RFC. Ela não altera o contrato institucional e não deve introduzir backend permanente.

## 14. Modelo operacional com agentes session-based

Nenhum daemon é necessário.

Uma sessão recorrente:

- reconstrói estado pelo Git;
- primeiro reconcilia side effects pendentes de decisions existentes;
- depois fixa o commit privado e descobre candidata sem decisão;
- revisa no máximo a unidade de trabalho escolhida;
- persiste decision + side effects retomáveis;
- termina.

GitHub Actions pode existir para tarefas auxiliares do repositório público, como captura visual, mas não é requisito do protocolo Redação → Publicação nem substitui o agente independente.

## 15. Relação com WikiSkill

WikiSkill fica inicialmente na Redação. Issues de rejeição são sinais estruturados de alto valor para a experiência editorial.

Este repo só deve criar wiki/evolução própria se volume de decisões públicas justificar. A independência exige que a Redação não controle a skill `publication-review` daqui.

## 16. Compatibilidade com a missão da primeira matéria

A issue privada #30 termina no marco privado `article-ready`. A primeira review/publicação/URL é conduzida pela issue pública #12.

Um marco end-to-end pode citar ambas as issues, mas não cria autoridade compartilhada.

## 17. Critérios de aceite

A arquitetura está provada quando:

1. um agente fixa commit privado e enumera `article-ready` via `okf-parser`;
2. candidate key repo/path/digest é persistida em decision record;
3. mesma candidate key não gera segunda review;
4. rejeição produz exatamente uma issue, inclusive após falha entre record e criação da issue;
5. aceite fixa um único public path e é retomável após falha parcial;
6. corpo público é extraído sem vazar frontmatter interno;
7. HTML/JSON/feed/sitemap são derivados do Markdown público;
8. publication event liga candidate key, commit, artefato e URL confirmada;
9. correção/retração preserva histórico e a separação Redação × Publicação;
10. nenhuma sync, CMS, daemon ou banco é necessário.

## 18. Não objetivos

Não construir CMS, backend, workflow engine, sincronizador permanente, espelho do knowledge corpus, segunda redação, publicação automática de todo `article-ready` ou sistema de IDs paralelo.

## 19. Regra curta

> “Existe uma candidata exata que eu, como autoridade pública independente, aceito colocar sob a marca O Vigia?”

Se sim, registre a decisão e complete seus side effects de forma retomável. Se não, registre rejeição e devolva trabalho à Redação sem reescrevê-la.
