# Publication ledger

Este diretório guarda o estado institucional mínimo do agente publicador. Não é CMS nem banco.

## Candidate key

A identidade de uma candidatura é:

```text
(source_repository, story_id, article_ready_source_digest)
```

`source_path` e `source_commit` são preservados para proveniência/reprodução, mas rename do path não cria nova candidatura.

## Path encoding

`story_id` e ready digest são percent-encoded como um único segmento de filename, mantendo apenas caracteres unreserved portáveis sem escape. Isso evita filenames como `sha256:...` que não fazem checkout em Windows.

A codificação não é novo ID/hash; o frontmatter guarda os valores integrais.

```text
publication/reviews/<story_token>/<digest_token>.md
publication/events/<story_token>/<YYYYMMDDTHHMMSSZ>-<kind>.md
```

## In-flight transactions

Antes de existir decision em `main`, uma candidatura pode estar reservada por uma PR:

```text
branch: publication/<story_token>/<digest_token>
PR marker: publication-candidate-key: <repo>|<story_id>|<ready-digest>
```

Sessões sempre verificam `main` **e** transações abertas. Uma PR aberta é trabalho in-flight a ser retomado, não autorização para iniciar segunda review.

## Reviews

Cada review record registra exatamente uma decisão final (`accepted` ou `rejected`) para a candidate key e o commit/path privado examinado.

A decisão é imutável para aquela key, mas seus side effects podem estar incompletos:

- `rejected` usa `newsroom_issue: pending | <issue-url>`;
- `accepted` fixa `public_path`; ausência do evento final significa publicação ainda não confirmada.

Antes de nova review, reconcilie transações/records pendentes. Para rejeição, procure o marcador:

```text
publication-review-key: <repo>|<story_id>|<ready-digest>
```

na Redação antes de criar issue.

## Events

Events registram fatos públicos confirmados: `published`, `corrected`, `updated`, `withdrawn`, `retracted` ou `replaced`.

O filename usa timestamp UTC compacto `YYYYMMDDTHHMMSSZ`; o frontmatter preserva ISO completo. O evento relaciona candidate key, public path, commit público, artefato/digest relevante, URL e confirmação.

O commit público fica no **evento posterior**, não dentro dos próprios bytes da matéria que aquele commit materializa.

## Canonical article

A matéria pública vive em `content/articles/<slug>.md`. HTML, `articles.json`, feed e sitemap são projeções derivadas.

Veja `docs/rfc/0001-independent-publication-agent.md`.
