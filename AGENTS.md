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
                    → canonical PublicArticle Markdown
                    → OKF contract → Astro static build
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

## Public OKF contract

`content/` is the public OKF bundle. The initial public concepts are:

- `PublicArticle` in `content/articles/*.md`;
- `PublicTerritory` in `content/territories/*.md`.

`okf-parser` owns their semantic contract. Astro owns presentation. Do not maintain a second hand-written frontmatter schema in Python, TypeScript or Astro.

The current relation is explicit:

```text
PublicArticle.locality / bairro → PublicTerritory(name)
PublicTerritory.parent_territory_id → PublicTerritory(territory_id)
```

`PublicTerritory.name` is a relational key; `title` is the human-facing label. Presentation must not infer territory identity by slugifying arbitrary article text.

## Renderer boundary

The public renderer is Astro SSG, not Jekyll.

```text
content/articles/*.md + content/territories/*.md
  → okf-parser check + generated Astro Zod contract
  → Astro Content Layer
  → src/pages/** + src/components/**
  → dist/
  → GitHub Pages
```

Derived public surfaces — article HTML, home, editorias, territories, archive, `articles.json`, RSS and sitemap — all consume the same Content Layer. `dist/` is an ephemeral build artifact, never canonical state.

There is no `_news` mirror and no Liquid/Jekyll projection. `scripts/build-publication.py` remains only as a compatibility entrypoint for older publication sessions; it delegates to the authoritative OKF → Astro contract and generates nothing.

After adding or changing canonical public Markdown, run:

```text
python scripts/check-astro-okf-contract.py
python scripts/check-cobogo-core.py
python scripts/check-public-surface.py
bun install --frozen-lockfile
bun run check
bun run build
```

All gates must pass before merge.

## UI authority boundary

Shared foundations come from the pinned Cobogó core. O Vigia remains authoritative over newspaper identity, typography, composition, editorias, article semantics, service modules and trust copy. Do not recreate generic focus/reduced-motion contracts locally; do not push newspaper-specific organisms into Cobogó merely because this repo needs them.

Astro Components are the baseline presentation unit. Svelte or another hydrated framework requires a concrete stateful island or materially superior reusable Cobogó component; do not add framework runtime by default.

## Corrections

- renderer/public-metadata bugs can be fixed here if accepted editorial content is unchanged;
- material editorial corrections/updates require newsroom work → new closed `article-ready` → new review;
- this repo may withdraw/tombstone urgently because it owns public availability, but substantive retraction wording belongs to editorial work in the newsroom;
- preserve public history through `publication/events/` and Git.

## Canonical public state

- `content/articles/<slug>.md`: canonical `PublicArticle`;
- `content/territories/<slug>.md`: canonical `PublicTerritory`;
- `publication/reviews/...`: integrated decisions and side-effect state;
- open deterministic publication PR: in-flight reservation/transaction;
- `publication/events/...`: confirmed public history;
- `src/generated/okf-schema.ts`: versioned generated contract, guarded against drift;
- `src/pages/**` and `src/components/**`: renderer source, not editorial authority;
- `dist/`: disposable derived output.

See `docs/rfc/0001-independent-publication-agent.md`, `docs/rfc/0002-editorial-surface-cobogo.md` and `skills/publication-review/SKILL.md`.
