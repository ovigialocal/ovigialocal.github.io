#!/usr/bin/env python3
"""Verify the Astro content schema is exactly the contract compiled by okf-parser."""
from __future__ import annotations

import difflib
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERATED_SCHEMA = ROOT / "src" / "generated" / "okf-schema.ts"
OKF_VERSION = "0.45.1"
SPEC_TEMPLATE = "docs/types/{slug}.md"
EXCLUDED_SPECS = "docs/types/**"


def run(*args: str, capture: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        args,
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=capture,
    )


def schema_command() -> tuple[str, ...]:
    return (
        "uvx",
        "--from",
        f"okf-parser=={OKF_VERSION}",
        "okf-parser",
        "schema",
        "content",
        "--format",
        "zod",
        "--zod-import",
        "astro",
        "--infer-types",
        "--exclude",
        EXCLUDED_SPECS,
        "--spec-template",
        SPEC_TEMPLATE,
    )


def main() -> int:
    okf = ("uvx", "--from", f"okf-parser=={OKF_VERSION}", "okf-parser")
    run(
        *okf,
        "check",
        "content",
        "--exclude",
        EXCLUDED_SPECS,
        "--require-spec",
        SPEC_TEMPLATE,
        "--normative-spec",
    )
    expected = run(*schema_command(), capture=True).stdout

    if not GENERATED_SCHEMA.exists():
        raise SystemExit(f"missing generated schema: {GENERATED_SCHEMA.relative_to(ROOT)}")
    actual = GENERATED_SCHEMA.read_text(encoding="utf-8")
    if actual == expected:
        print("OKF → Astro schema is current")
        return 0

    print("generated Astro schema drifted from the OKF TypeContract")
    print(
        "".join(
            difflib.unified_diff(
                actual.splitlines(keepends=True),
                expected.splitlines(keepends=True),
                fromfile=str(GENERATED_SCHEMA.relative_to(ROOT)),
                tofile="okf-parser schema output",
            )
        )
    )
    print("regenerate with:")
    print(" ".join(schema_command()) + f" > {GENERATED_SCHEMA.relative_to(ROOT)}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
