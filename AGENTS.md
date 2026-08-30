# AGENTS.md — O Vigia public publication contract

## Goal

Operate the public authority of O Vigia. This repository publishes only material that an independent publication agent has accepted after reviewing an exact `article-ready` candidate from `franklinbaldo/ovigia-redacao`.

## Core flow

```text
query newsroom for article-ready
        ↓
load exact candidate + digest + evidence
        ↓
independent publication review
     /                     \
  accept                  reject
    ↓                        ↓
copy approved Markdown     open issue in newsroom
into this repository       against exact digest
    ↓                        ↓
derive static artifacts    STOP here
    ↓
commit / merge / Pages
    ↓
confirm public URL
```

## Institutional boundary

The newsroom decides whether a version is `article-ready`. This repository decides whether that version is **published**.

Do not treat `article-ready` as an instruction to publish. Do not let the newsroom push/sync content automatically into this repository.

## On rejection

When a material problem exists:

- do not copy the candidate;
- do not edit the private newsroom candidate;
- open an issue in `franklinbaldo/ovigia-redacao`;
- include the exact path/concept and digest;
- state concrete findings, evidence and required work;
- wait for a new version/digest in a future run.

Reject material defects, not harmless stylistic preferences.

## On acceptance

When a candidate is fit for publication:

- preserve the approved editorial body;
- copy it as public canonical Markdown;
- add only publication-owned metadata;
- keep a reconstructible link to the newsroom source and exact digest;
- derive HTML/JSON/feed/sitemap as public projections;
- use normal Git history/PRs as the publication change boundary.

A material editorial rewrite requires a new newsroom version; do not silently edit during publication.

## Corrections

This repository owns the public state and correction history. If a correction requires new editorial work, open an issue in the newsroom and evaluate the resulting new `article-ready` version independently.

## Publication skill

Use `skills/publication-review/SKILL.md` for the executable review procedure. See `docs/rfc/0001-independent-publication-agent.md` for the architectural contract.

## Public-surface constraints

- The site remains static-first and deployable on GitHub Pages.
- Fixtures/demo content must never appear as real journalism.
- Cobogó is the shared visual grammar when applicable.
- Provenance should be preserved without turning the article page into a technical dashboard.
