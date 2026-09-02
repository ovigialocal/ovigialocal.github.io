#!/usr/bin/env python3
"""Validate canonical public Markdown before Astro consumes it directly."""
from __future__ import annotations

import argparse
import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = ROOT / "content" / "articles"
REQUIRED = {
    "type", "title", "description", "story_id", "locality", "category", "published_at",
    "source_repository", "source_commit", "source_path", "source_digest", "source_name", "source_url",
}
KEY_RE = re.compile(r"^([A-Za-z0-9_-]+):(?:\s*(.*))?$")
STORY_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")


def scalar(value: str) -> str:
    value = value.strip()
    if value.startswith('"'):
        parsed = json.loads(value)
        if not isinstance(parsed, str):
            raise ValueError("public frontmatter values must be scalar strings")
        return parsed
    if value.startswith("'") and value.endswith("'"):
        return value[1:-1].replace("''", "'")
    return value


def metadata(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError(f"{path}: missing YAML frontmatter")
    raw, _body = text[4:].split("\n---\n", 1)
    result: dict[str, str] = {}
    for line in raw.splitlines():
        if not line.strip():
            continue
        if line[:1].isspace():
            raise ValueError(f"{path}: nested public frontmatter is not supported")
        match = KEY_RE.match(line)
        if not match:
            raise ValueError(f"{path}: unsupported frontmatter line: {line!r}")
        key, value = match.groups()
        result[key] = scalar(value or "")
    missing = REQUIRED - result.keys()
    if missing:
        raise ValueError(f"{path}: missing public metadata: {', '.join(sorted(missing))}")
    if result["type"] != "PublicArticle":
        raise ValueError(f"{path}: type must be PublicArticle")
    if not STORY_ID_RE.fullmatch(result["story_id"]):
        raise ValueError(f"{path}: story_id is not safe for a static route: {result['story_id']!r}")
    for field in ("published_at", "updated_at", "next_event_at"):
        if result.get(field):
            datetime.fromisoformat(result[field])
    if result.get("media_url"):
        needed = {"media_alt", "media_credit", "media_source_url", "media_width", "media_height"}
        missing_media = sorted(key for key in needed if not result.get(key))
        if missing_media:
            raise ValueError(f"{path}: media_url requires {', '.join(missing_media)}")
    if result.get("next_event_at"):
        needed = {"next_event_kind", "next_event_label"}
        missing_temporal = sorted(key for key in needed if not result.get(key))
        if missing_temporal:
            raise ValueError(f"{path}: next_event_at requires {', '.join(missing_temporal)}")
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="compatibility alias; validation is always read-only")
    parser.parse_args()
    seen: set[str] = set()
    count = 0
    for path in sorted(ARTICLES_DIR.glob("*.md")):
        meta = metadata(path)
        story_id = meta["story_id"]
        if story_id in seen:
            raise ValueError(f"duplicate story_id: {story_id}")
        seen.add(story_id)
        count += 1
    print(f"canonical public bundle: {count} articles OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
