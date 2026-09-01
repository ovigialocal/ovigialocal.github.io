#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VENDOR = ROOT / "vendor" / "cobogo"
INDEX = ROOT / "index.css"
THEME = ROOT / "cobogo-theme.css"


def git_blob_sha1(payload: bytes) -> str:
    header = f"blob {len(payload)}\0".encode()
    return hashlib.sha1(header + payload, usedforsecurity=False).hexdigest()


def main() -> int:
    pin = json.loads((VENDOR / "cobogo-core.pin.json").read_text(encoding="utf-8"))
    core = (VENDOR / "cobogo-core.css").read_bytes()
    index = INDEX.read_text(encoding="utf-8")
    theme = THEME.read_text(encoding="utf-8")

    assert pin["repository"] == "https://github.com/franklinbaldo/cobogo"
    assert pin["path"] == "src/styles/core.css"
    assert git_blob_sha1(core) == pin["git_blob_sha1"], "vendored Cobogó core diverged from pinned blob"

    core_import = index.index("vendor/cobogo/cobogo-core.css")
    theme_import = index.index("cobogo-theme.css")
    first_local_rule = index.index("* { box-sizing")
    assert core_import < theme_import < first_local_rule, "expected core → Vigia theme → local editorial CSS"

    assert ":focus-visible" not in index, "generic focus ownership must remain in Cobogó core"
    assert "prefers-reduced-motion" not in index, "generic reduced-motion ownership must remain in Cobogó core"

    required_roles = (
        "--cobogo-canvas",
        "--cobogo-text",
        "--cobogo-text-muted",
        "--cobogo-border",
        "--cobogo-accent",
        "--cobogo-font-body",
        "--cobogo-font-display",
    )
    missing = [role for role in required_roles if role not in theme]
    assert not missing, f"Vigia theme must explicitly map shared roles: {missing}"

    print(f"Cobogó core pin OK: {pin['commit']} / {pin['git_blob_sha1']}")
    print("Layering OK: Cobogó core → Vigia theme → editorial CSS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
