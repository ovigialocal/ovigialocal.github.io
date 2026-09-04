#!/usr/bin/env python3
"""Ratchet O Vigia's newsroom vocabulary across the public renderer."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOCAB = ROOT / "docs" / "vocabulario-redacao.md"
PUBLIC_SPEC = ROOT / "content" / "docs" / "types" / "publicarticle.md"
PUBLIC_SCHEMA = ROOT / "content" / "docs" / "types" / "publicarticle.schema.sql"
GENERATED = ROOT / "src" / "generated" / "okf-schema.ts"

RETIRED = {
    ".eyebrow": "use .chapeu",
    'class="eyebrow': "use class=\"chapeu\"",
    "class='eyebrow": "use class='chapeu'",
    ".module-label": "use .retranca",
    'class="module-label': "use class=\"retranca\"",
    "class='module-label": "use class='retranca'",
    "edition-deck": "use edition-linha-fina",
    "lead-deck": "use lead-linha-fina",
    "article-deck": "use article-linha-fina",
    'class="deck"': 'use class="linha-fina" for the institutional editorial deck',
    "class='deck'": "use class='linha-fina' for the institutional editorial deck",
}


def source_files() -> list[Path]:
    files = list(ROOT.glob("*.css"))
    files.extend((ROOT / "src").rglob("*.astro"))
    return sorted(files)


def main() -> int:
    failures: list[str] = []

    if not VOCAB.exists():
        failures.append("missing docs/vocabulario-redacao.md")
    else:
        vocab = VOCAB.read_text(encoding="utf-8")
        for term in ("chapéu", "linha fina", "retranca", "chamada", "suíte", "fio"):
            if term not in vocab:
                failures.append(f"vocabulary must define {term!r}")

    for path in source_files():
        text = path.read_text(encoding="utf-8")
        for retired, replacement in RETIRED.items():
            if retired in text:
                failures.append(f"{path.relative_to(ROOT)}: retired {retired!r}; {replacement}")

    for path in (PUBLIC_SPEC, PUBLIC_SCHEMA, GENERATED):
        if not path.exists() or "chamada" not in path.read_text(encoding="utf-8"):
            failures.append(f"{path.relative_to(ROOT)} must expose optional approved chamada")

    if failures:
        print("Editorial vocabulary contract failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Editorial vocabulary OK: newsroom terms are atomic across CSS/Astro and chamada is public")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
