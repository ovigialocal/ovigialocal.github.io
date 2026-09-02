#!/usr/bin/env python3
"""Verify Astro content schemas are exactly the contracts compiled by okf-parser."""
from __future__ import annotations

import difflib
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERATED_SCHEMA = ROOT / "src" / "generated" / "okf-schema.ts"
OKF_COMMIT = "5ee72add40d3372682e528fd70641455143269ce"
OKF_SOURCE = f"git+https://github.com/franklinbaldo/okf-parser.git@{OKF_COMMIT}"
SPEC_TEMPLATE = "docs/types/{slug}.md"
EXCLUDED_SPECS = "docs/types/**"
RELATIONAL_SCHEMA = "okf.schema.sql"


def run(*args: str, capture: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, cwd=ROOT, check=True, text=True, capture_output=capture)


def okf() -> tuple[str, ...]:
    return ("uvx", "--from", OKF_SOURCE, "okf-parser")


def schema_command() -> tuple[str, ...]:
    return (
        *okf(), "schema", "content", "--format", "zod", "--zod-import", "astro",
        "--infer-types", "--exclude", EXCLUDED_SPECS, "--spec-template", SPEC_TEMPLATE,
        "--relational-schema", RELATIONAL_SCHEMA, "--refs", "key",
    )


def main() -> int:
    run(
        *okf(), "check", "content", "--exclude", EXCLUDED_SPECS,
        "--require-spec", SPEC_TEMPLATE, "--normative-spec",
        "--relational-schema", RELATIONAL_SCHEMA,
    )
    expected = run(*schema_command(), capture=True).stdout
    if not GENERATED_SCHEMA.exists():
        raise SystemExit(f"missing generated schema: {GENERATED_SCHEMA.relative_to(ROOT)}")
    actual = GENERATED_SCHEMA.read_text(encoding="utf-8")
    if actual == expected:
        print(f"OKF → Astro schemas and references are current ({OKF_COMMIT[:12]})")
        return 0
    print("generated Astro schema drifted from the OKF TypeContract")
    print("".join(difflib.unified_diff(actual.splitlines(keepends=True), expected.splitlines(keepends=True), fromfile=str(GENERATED_SCHEMA.relative_to(ROOT)), tofile="okf-parser schema output")))
    print("regenerate with the pinned okf-parser commit")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
