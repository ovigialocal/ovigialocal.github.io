# Publication ledger

Este diretório guarda o estado institucional mínimo do agente publicador. Não é CMS nem banco.

## Reviews

`publication/reviews/<story-id>/<source-digest>.md` registra exatamente uma decisão final (`accepted` ou `rejected`) para a candidate key `(source_repository, source_path, source_digest)` e o commit privado examinado.

A decisão é imutável para aquela candidate key, mas seus side effects podem estar incompletos e precisam ser retomáveis:

- `rejected` usa `newsroom_issue: pending | <issue-url>`;
- `accepted` fixa `public_path`; ausência do evento final significa publicação ainda não confirmada.

Antes de nova review, reconcilie records pendentes. Para rejeição, procure o marcador `publication-review-key: <repo>|<path>|<digest>` na Redação antes de criar issue; isso fecha a janela de falha entre gravar o record e abrir a issue.

## Events

`publication/events/<story-id>/<timestamp>-<kind>.md` registra fatos públicos confirmados: `published`, `corrected`, `updated`, `withdrawn`, `retracted` ou `replaced`.

O evento relaciona candidate key, public path, commit público, artefato/digest relevante, URL e timestamp de confirmação quando aplicável.

O commit público é registrado no **evento posterior**, não dentro dos próprios bytes da matéria que aquele commit materializa.

## Canonical article

A matéria pública vive em `content/articles/<slug>.md`. HTML, `articles.json`, feed e sitemap são projeções derivadas.

Veja `docs/rfc/0001-independent-publication-agent.md`.
