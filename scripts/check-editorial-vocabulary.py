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
    'class="eyebrow': 'use class="chapeu"',
    "class='eyebrow": "use class='chapeu'",
    "edition-deck": "use edition-linha-fina",
    "lead-deck": "use lead-linha-fina",
    "article-deck": "use article-linha-fina",
    'class="deck"': 'use class="linha-fina" for the institutional editorial line fine',
    "class='deck'": "use class='linha-fina' for the institutional editorial line fine",
}

# Retranca is intentionally reserved: professional manuals use the term in incompatible senses
# (internal story identifier, subordinate/complementary story, and sometimes chapéu). Until O Vigia
# models one explicit meaning in OKF, it must not be used as a generic public-renderer class.
RETRANCA_MISUSES = (
    ".retranca",
    'class="retranca',
    "class='retranca",
)

REQUIRED_SECTIONS = (
    "## 1. Três camadas de linguagem",
    "## 4. Peças que não são sinônimos",
    "## 5. Retranca: termo reservado e polissêmico",
    "## 6. Continuidade: caso, suíte, série, atualização e matéria relacionada",
    "## 9. Pós-publicação: termos diferentes para atos diferentes",
    "## 11. Autoridade e ciclo de vida",
    "## 12. Compatibilidade dos campos públicos",
    "## 14. Anti-exemplos",
)

REQUIRED_TERMS = (
    "chapéu",
    "linha fina",
    "chamada",
    "lide",
    "intertítulo",
    "suíte",
    "retranca",
    "boxe",
    "assinatura",
    "política de correções",
    "proveniência editorial",
)


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
        for section in REQUIRED_SECTIONS:
            if section not in vocab:
                failures.append(f"vocabulary must keep semantic section {section!r}")
        for term in REQUIRED_TERMS:
            if term not in vocab:
                failures.append(f"vocabulary must define {term!r}")
        if "`module-label` | permanece técnico; não é retranca" not in vocab:
            failures.append("vocabulary must keep module-label technical instead of calling it retranca")
        if "Errata não é sinônimo de política de" not in vocab:
            failures.append("vocabulary must distinguish errata from the corrections policy")
        if "`description` | linha fina" not in vocab or "`category` | editoria" not in vocab:
            failures.append("vocabulary must document compatibility mappings for public fields")

    for path in source_files():
        text = path.read_text(encoding="utf-8")
        for retired, replacement in RETIRED.items():
            if retired in text:
                failures.append(f"{path.relative_to(ROOT)}: retired {retired!r}; {replacement}")
        for misuse in RETRANCA_MISUSES:
            if misuse in text:
                failures.append(
                    f"{path.relative_to(ROOT)}: {misuse!r} misuses retranca as renderer styling; "
                    "keep module-label technical until a newsroom retranca contract exists"
                )

    for path in (PUBLIC_SPEC, PUBLIC_SCHEMA, GENERATED):
        if not path.exists() or "chamada" not in path.read_text(encoding="utf-8"):
            failures.append(f"{path.relative_to(ROOT)} must expose optional approved chamada")

    if failures:
        print("Editorial vocabulary contract failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(
        "Editorial vocabulary OK: semantic layers are documented, retired names are absent, "
        "retranca is not misused, and chamada is public"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
