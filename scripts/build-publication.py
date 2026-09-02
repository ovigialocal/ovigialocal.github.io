#!/usr/bin/env python3
"""Compatibility entrypoint for the pre-Astro publication command.

The Astro renderer consumes the canonical OKF bundle directly. This command no
longer generates projections; it delegates to the authoritative OKF → Astro
contract check so existing publication sessions can keep invoking it safely.
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHECK = ROOT / "scripts" / "check-astro-okf-contract.py"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--check",
        action="store_true",
        help="compatibility alias; validation is always read-only",
    )
    parser.parse_args()
    completed = subprocess.run([sys.executable, str(CHECK)], cwd=ROOT, check=False)
    if completed.returncode == 0:
        print("publication compatibility gate: canonical OKF bundle is ready for Astro")
    return completed.returncode


if __name__ == "__main__":
    raise SystemExit(main())
