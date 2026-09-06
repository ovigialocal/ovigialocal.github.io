#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PIN = "8ad1fe1c40bb6af12d8b8fcbe1b20d070b5bb44c"


def main() -> int:
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    panda = (ROOT / "panda.config.ts").read_text(encoding="utf-8")
    postcss = (ROOT / "postcss.config.cjs").read_text(encoding="utf-8")
    layout = (ROOT / "src/layouts/BaseLayout.astro").read_text(encoding="utf-8")
    foundation = (ROOT / "src/styles/editorial-foundation.css").read_text(encoding="utf-8")

    assert package["dependencies"]["cobogo"] == f"github:franklinbaldo/cobogo#{PIN}"
    assert package["devDependencies"]["@pandacss/dev"] == "1.12.0"
    assert "cobogo/preset" in panda
    assert "presets: [cobogo]" in panda
    assert "outdir: 'styled-system'" in panda
    assert "@pandacss/dev/postcss" in postcss

    assert "../../styled-system/css" in layout
    assert "../../styled-system/recipes" in layout
    assert 'data-ui-generation="cobogo-panda"' in layout

    assert not (ROOT / "vendor/cobogo/cobogo-core.css").exists(), "vendored Cobogó CSS must not return"
    assert not (ROOT / "vendor/cobogo/cobogo-core.pin.json").exists(), "legacy vendor pin must not return"
    assert not (ROOT / "index.css").exists(), "legacy generic CSS foundation must not return"

    assert ":focus-visible" not in foundation, "generic focus ownership stays in Cobogó"
    assert "prefers-reduced-motion" not in foundation, "generic motion ownership stays in Cobogó"

    print(f"Cobogó Panda preset OK: {PIN}")
    print("Boundary OK: shared preset/recipes → O Vigia editorial composition")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
