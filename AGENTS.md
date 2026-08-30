# AGENTS.md — O Vigia public publication contract

## Goal

Operate the independent public authority of O Vigia. The newsroom ends at `article-ready`; this repository decides whether an exact candidate is accepted for the public brand.

## Session flow

```text
reconcile pending publication/reviews side effects
  → pin newsroom commit
  → load OKF bundle
  → enumerate valid article-ready concepts
  → subtract reconciled publication/reviews decisions
  → independent publication-review
      ├─ reject → decision record → exactly one newsroom issue
      └─ accept → decision record + fixed public_path
                    → public Markdown + projections
                    → commit / Pages / URL confirmation
                    → publication event
```

No automatic sync, webhook, daemon or shared queue is part of the contract.

## Candidate identity

Use exactly:

```text
(source_repository, source_path, source_digest)
```

with `source_digest` from `okf-parser`. Also persist the pinned newsroom commit for reproducibility. Do not invent another ID/hash.

## Idempotency and recovery

Before reviewing, inspect `publication/reviews/<story-id>/<source-digest>.md`.

- no record: candidate is eligible for review;
- existing `rejected` with `newsroom_issue: pending`: search the newsroom for the exact `publication-review-key`; create the issue only if none exists, then reconcile the record;
- existing reconciled `rejected`: do not reopen review or create another issue;
- existing `accepted` without a publication event: resume the same allocated `public_path` and complete publication; do not review/publish a second item;
- existing `accepted` with the corresponding event: nothing to repeat for that digest.

Every cross-repository or Pages side effect must be reconstructible and resumable after a session stops between steps.

## Review scope

Trust the newsroom process as evidence, but independently judge material fitness for the public brand. Do not mechanically rerun every newsroom gate. Reject material factual/provenance/freshness/privacy/framing/integrity defects, not harmless style preferences.

## Safe copy boundary

Copy the approved **editorial body**, not the private file byte-for-byte. Whitelist public metadata. Never expose self-review, internal findings, reporting notes, experience records or workflow instructions by default.

A material body edit requires a new newsroom digest.

## Corrections

- projection/public-metadata bugs can be fixed here if the accepted body is unchanged;
- material editorial corrections/updates require a new newsroom `article-ready` and a new review;
- this repo may withdraw/tombstone urgently because it owns public availability, but substantive retraction wording belongs to editorial work in the newsroom;
- preserve publication history through `publication/events/` and Git.

## Canonical public state

- `content/articles/<slug>.md`: public article Markdown;
- `publication/reviews/...`: publication decisions and pending/reconciled side effects;
- `publication/events/...`: confirmed public history;
- HTML/`articles.json`/feed/sitemap: derived projections.

See `docs/rfc/0001-independent-publication-agent.md` and `skills/publication-review/SKILL.md`.
