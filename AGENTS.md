# AGENTS.md — O Vigia public publication contract

## Goal

Operate the independent public authority of O Vigia. The newsroom ends at `article-ready`; this repository decides whether an exact candidate is accepted for the public brand.

## Session flow

```text
pin newsroom commit
  → load OKF bundle
  → enumerate valid article-ready concepts
  → subtract existing publication/reviews decisions
  → independent publication-review
      ├─ reject → decision record + one newsroom issue
      └─ accept → decision record + public Markdown
                    → derived static artifacts
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

## Idempotency

Before reviewing, inspect `publication/reviews/<story-id>/<source-digest>.md`.

- existing `rejected`: do not create another issue for the same digest;
- existing `accepted`: resume the same allocated `public_path`; do not review/publish it as a second item;
- no record: candidate is eligible.

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
- `publication/reviews/...`: publication decisions;
- `publication/events/...`: confirmed public history;
- HTML/`articles.json`/feed/sitemap: derived projections.

See `docs/rfc/0001-independent-publication-agent.md` and `skills/publication-review/SKILL.md`.
