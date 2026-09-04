# AGENTS.md — O Vigia public publication contract

## Goal

Operate the independent public authority of O Vigia. The newsroom ends at a closed `article-ready`; this repository decides whether that exact candidate is accepted for the public brand.

The public site and the newsroom are autonomous recurring loops connected asynchronously by documents. `article-ready` is an offer, never an automatic publication trigger.

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
      ├─ reject → decision record → exactly one canonical newsroom editorial-ficha
      └─ accept → decision record + fixed public_path
                    → canonical PublicArticle Markdown
                    → OKF contract → Astro static build
                    → merge / Pages / URL confirmation
                    → publication event
```

There is no automatic sync, webhook, RPC editorial call, daemon, database or shared mutable queue. The publication agent does not wait synchronously for newsroom work; future sessions observe future newsroom state.

## Newsroom return channel

When this repository discovers a **material editorial need**, the canonical return channel is an `editorial-ficha` written to `franklinbaldo/ovigia-redacao/knowledge/editorial/fichas/` under the newsroom's OKF contract.

The ficha is broader than a rejection. Valid reasons include:

- `publication-rejection` — candidate cannot be published as-is;
- `public-correction` — possible material error/staleness in something already live;
- `follow-up` — later event worth pursuing;
- `new-story` — related reporting opportunity;
- `verification` — claim needing confirmation/falsification;
- `enrichment` — source/data/context/contradictory evidence worth pursuing.

A ficha records an observed editorial need, not an imperative conclusion. The newsroom may fulfill, reformulate, falsify, block or decline it. Resolution belongs to newsroom artifacts such as `editorial-ficha-response`, not to edits of the original request.

GitHub issues are optional human/operational mirrors. They do not replace the canonical ficha. Historical decision records using `newsroom_issue` remain valid; future work should prefer `newsroom_ficha` and must not rewrite history just to rename a field.

## Candidate identity

Use exactly:

```text
(source_repository, story_id, article_ready_source_digest)
```

with the ready digest from `okf-parser`. Persist `source_path` and pinned newsroom commit as provenance/locators, not identity. A rename of the same ready is not a new candidate.

Before review, verify the private `article-ready` pins subject/profile/one approval per required gate by `source_digest` and that body/title/description — and `chamada` when present — are identical to the approved subject. An invalid envelope is not reviewable.

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
- `rejected` + `newsroom_ficha: pending`: search the newsroom for a ficha carrying the exact candidate key and create one only if absent;
- historical `rejected` + `newsroom_issue: pending`: reconcile under the historical contract; do not silently duplicate with a second return object;
- reconciled `rejected`: no new review/ficha for that digest;
- `accepted` without publication event: resume the same `public_path` and complete merge/Pages/URL/event;
- `accepted` + event: nothing to repeat.

Every cross-repository or Pages side effect must be reconstructible after a session stops between steps.

For post-publication fichas, deduplicate by public story plus the material fact/need observed. A new hourly session seeing the same unresolved defect is not a reason to create another ficha.

## Review scope

Trust the newsroom process as evidence, but independently judge material fitness for the public brand. Do not mechanically rerun every newsroom gate. Reject material factual/provenance/freshness/privacy/framing/integrity defects, not harmless style preferences.

## Safe copy boundary

Copy approved **editorial content**, not the private file byte-for-byte. Whitelist public metadata. Never expose self-review, internal findings, reporting notes, experience/wiki records or workflow instructions by default.

A material body/title/description/`chamada` edit requires a new newsroom ready digest. If a legacy ready has no `chamada`, the public renderer may display `description` as fallback; the publication agent must not author a new chamada.

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

`PublicArticle.chamada`, when present, is approved cover copy. It is not a renderer-generated summary and is distinct from `description`/linha fina.

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

## Editorial vocabulary

`docs/vocabulario-redacao.md` is the semantic naming contract for editorial concepts in code, OKF, comments and conversation. It separates three layers: traditional newsroom pieces, O Vigia's own operational domain, and technical renderer mechanics.

When an identifier directly names an editorial piece, prefer the newsroom term (`chapeu`, `linha-fina`, `chamada`, `suite`, `boxe`, `fio`). Structural wrappers and web mechanics such as `grid`, `card`, `modal`, `nav`, `filter`, `search` and `module-label` remain technical when that is what they actually are.

`retranca` is reserved because professional usage is polysemous; do not use it as a generic module/section label. A future use as internal story identifier or subordinate editorial relation requires an explicit newsroom/OKF contract first.

Do not introduce retired renderer names such as `eyebrow`, editorial `deck`, “trilha de destaques”, “ficha de proveniência” or “módulo temporal”. A rename of an editorial CSS class must be atomic with every Astro/component consumer so markup and style cannot drift apart.

Do not mass-rename stable public fields merely for vocabulary purity. The semantic compatibility map in `docs/vocabulario-redacao.md` is authoritative: for example, `description` means linha fina and `category` means editoria in the current public contract.

New editorial terms must be defined with meaning, layer, authority and persistence in the vocabulary in the same change. When professional sources use the same word differently, document the O Vigia meaning instead of pretending the term is universal.

## UI authority boundary

Shared foundations come from the pinned Cobogó core. O Vigia remains authoritative over newspaper identity, typography, composition, editorias, article semantics, service modules and trust copy. Do not recreate generic focus/reduced-motion contracts locally; do not push newspaper-specific organisms into Cobogó merely because this repo needs them.

Astro Components are the baseline presentation unit. Svelte or another hydrated framework requires a concrete stateful island or materially superior reusable Cobogó component; do not add framework runtime by default.

## Corrections and public observation

- renderer/public-metadata bugs can be fixed here if accepted editorial content is unchanged;
- material editorial corrections/updates require a newsroom ficha/work → new closed `article-ready` → new review;
- agents inspecting the live site may create `public-correction`, `follow-up`, `new-story`, `verification` or `enrichment` fichas in the newsroom instead of creating a parallel reporting workflow here;
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

See `docs/rfc/0001-independent-publication-agent.md`, `docs/rfc/0002-editorial-surface-cobogo.md`, `docs/rfc/0003-newsroom-ficha-protocol.md` and `skills/publication-review/SKILL.md`.
