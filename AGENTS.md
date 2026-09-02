# AGENTS.md — O Vigia public publication contract

## Goal

Operate the independent public authority of O Vigia. The newsroom ends at a closed `article-ready`; this repository decides whether that exact candidate is accepted for the public brand.

## Session flow

```text
reconcile open publication transaction / pending side effects
  → pin newsroom commit
  → load OKF bundle
  → validate closed article-ready offers
  → derive candidate key
  → subtract main decisions + open transaction reservations
  → reserve deterministic branch/PR for one free candidate
  → independent publication-review
      ├─ reject → decision record → exactly one newsroom issue
      └─ accept → decision record + fixed public_path
                    → public Markdown + projections
                    → merge / Pages / URL confirmation
                    → publication event
```

No automatic sync, webhook, daemon, database or shared queue is part of the contract.

## Candidate identity

Use exactly:

```text
(source_repository, story_id, article_ready_source_digest)
```

with the ready digest from `okf-parser`. Persist `source_path` and pinned newsroom commit as provenance/locators, not identity. A rename of the same ready is not a new candidate.

Before review, verify the private `article-ready` pins subject/profile/one approval per required gate by `source_digest` and that body/title/description are identical to the approved subject. An invalid envelope is not reviewable.

## Portable ledger paths

Do not put raw `sha256:...` into filenames. Percent-encode `story_id` and ready digest as single portable path segments, preserving the full original values in frontmatter.

```text
publication/reviews/<story_token>/<digest_token>.md
publication/events/<story_token>/<YYYYMMDDTHHMMSSZ>-<kind>.md
```

The encoding is only a filename representation, never a second ID/hash.

## In-flight reservation

A decision may live on a PR before it reaches `main`; sessions must not ignore that state.

For a new candidate reserve:

```text
branch: publication/<story_token>/<digest_token>
PR marker: publication-candidate-key: <repo>|<story_id>|<ready-digest>
```

Before starting review, check both `main` and open PRs. Existing transaction → resume it. Do not create another branch/PR/review for the same key.

## Idempotency and recovery

At session start:

- open transaction PR: resume it first;
- `rejected` + `newsroom_issue: pending`: search by exact candidate marker and create issue only if absent;
- reconciled `rejected`: no new review/issue for that digest;
- `accepted` without publication event: resume the same `public_path` and complete merge/Pages/URL/event;
- `accepted` + event: nothing to repeat.

Every cross-repository or Pages side effect must be reconstructible after a session stops between steps.

## Review scope

Trust the newsroom process as evidence, but independently judge material fitness for the public brand. Do not mechanically rerun every newsroom gate. Reject material factual/provenance/freshness/privacy/framing/integrity defects, not harmless style preferences.

## Safe copy boundary

Copy approved **editorial content**, not the private file byte-for-byte. Whitelist public metadata. Never expose self-review, internal findings, reporting notes, experience/wiki records or workflow instructions by default.

A material body/title/description edit requires a new newsroom ready digest.

## Derived projections

`content/articles/<slug>.md` is the canonical public article. The renderer boundary is:

```text
content/articles/<slug>.md
  → scripts/build-publication.py
  → _news/<story_id>.md          # byte-identical Jekyll collection projection
  → GitHub Pages / Jekyll
  → /noticias/<story_id>/
     index.html
     editorias.html
     arquivo.html
     articles.json
     feed.xml
     sitemap.xml
```

Do not maintain `_news` by hand and never patch a projected article separately from its canonical Markdown. `scripts/build-publication.py --check` verifies the byte-identity and file set.

`articles.json`, feed and sitemap are Jekyll/Liquid templates over `site.news`; they must use `story.url` so all discovery surfaces expose the same canonical `/noticias/<story_id>/` URL.

Every public article must include the flat public metadata required by `scripts/build-publication.py`, including `source_name` and `source_url` in addition to provenance fields. After adding or changing canonical public Markdown, run:

```text
python scripts/build-publication.py
python scripts/build-publication.py --check
python scripts/check-cobogo-core.py
python scripts/check-public-surface.py
```

All checks must pass before merge.

## UI authority boundary

Shared foundations come from the pinned Cobogó core. O Vigia remains authoritative over newspaper identity, typography, composition, editorias, article semantics, service modules and trust copy. Do not recreate generic focus/reduced-motion contracts locally; do not push newspaper-specific organisms into Cobogó merely because this repo needs them.

## Corrections

- projection/public-metadata bugs can be fixed here if accepted editorial content is unchanged;
- material editorial corrections/updates require newsroom work → new closed `article-ready` → new review;
- this repo may withdraw/tombstone urgently because it owns public availability, but substantive retraction wording belongs to editorial work in the newsroom;
- preserve public history through `publication/events/` and Git.

## Canonical public state

- `content/articles/<slug>.md`: public article Markdown;
- `publication/reviews/...`: integrated decisions and side-effect state;
- open deterministic publication PR: in-flight reservation/transaction;
- `publication/events/...`: confirmed public history;
- `_news/`: byte-identical renderer projection;
- HTML/JSON/RSS/sitemap: Jekyll-derived public projections.

See `docs/rfc/0001-independent-publication-agent.md`, `docs/rfc/0002-editorial-surface-cobogo.md` and `skills/publication-review/SKILL.md`.
