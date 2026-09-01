#!/usr/bin/env python3
"""Mirror canonical public Markdown into the Jekyll collection deterministically."""
from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = ROOT / "content" / "articles"
JEKYLL_NEWS_DIR = ROOT / "_news"
REQUIRED = {
    "title", "description", "story_id", "locality", "category", "published_at",
    "source_repository", "source_commit", "source_path", "source_digest",
    "source_name", "source_url",
}
KEY_RE = re.compile(r"^([A-Za-z0-9_-]+):(?:\s*(.*))?$")
STORY_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")


@dataclass(frozen=True)
class Article:
    meta: dict[str, str]
    source_file: Path

    @property
    def jekyll_projection(self) -> Path:
        return JEKYLL_NEWS_DIR / f"{self.meta['story_id']}.md"


def parse_scalar(value: str) -> str:
    value = value.strip()
    if value.startswith('"'):
        parsed = json.loads(value)
        if not isinstance(parsed, str):
            raise ValueError("public frontmatter values must be strings")
        return parsed
    if value.startswith("'") and value.endswith("'"):
        return value[1:-1].replace("''", "'")
    return value


def parse_article(path: Path) -> Article:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError(f"{path}: missing YAML frontmatter")
    try:
        raw_meta, _body = text[4:].split("\n---\n", 1)
    except ValueError as exc:
        raise ValueError(f"{path}: unterminated YAML frontmatter") from exc

    meta: dict[str, str] = {}
    for line in raw_meta.splitlines():
        if not line.strip():
            continue
        if line[:1].isspace():
            raise ValueError(f"{path}: nested public frontmatter is not supported")
        match = KEY_RE.match(line)
        if not match:
            raise ValueError(f"{path}: unsupported public frontmatter line: {line!r}")
        key, value = match.groups()
        meta[key] = parse_scalar(value or "")

    missing = REQUIRED - meta.keys()
    if missing:
        raise ValueError(f"{path}: missing public metadata: {', '.join(sorted(missing))}")
    if not STORY_ID_RE.fullmatch(meta["story_id"]):
        raise ValueError(f"{path}: story_id is not safe for a static route: {meta['story_id']!r}")
    datetime.fromisoformat(meta["published_at"])
    if meta.get("updated_at"):
        datetime.fromisoformat(meta["updated_at"])
    if meta.get("next_event_at"):
        datetime.fromisoformat(meta["next_event_at"])
    return Article(meta, path)


def load_articles() -> list[Article]:
    articles = [parse_article(path) for path in sorted(ARTICLES_DIR.glob("*.md"))]
    seen: set[str] = set()
    for article in articles:
        story_id = article.meta["story_id"]
        if story_id in seen:
            raise ValueError(f"duplicate story_id: {story_id}")
        seen.add(story_id)
    return articles


def projections() -> dict[Path, str]:
    return {
        article.jekyll_projection: article.source_file.read_text(encoding="utf-8")
        for article in load_articles()
    }


def unexpected_news_files(expected: set[Path]) -> list[Path]:
    if not JEKYLL_NEWS_DIR.exists():
        return []
    return sorted(path for path in JEKYLL_NEWS_DIR.glob("*.md") if path not in expected)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if committed Jekyll projections are stale")
    args = parser.parse_args()

    expected = projections()
    stale: list[Path] = []
    unexpected = unexpected_news_files(set(expected))

    for path, content in expected.items():
        if args.check:
            if not path.exists() or path.read_text(encoding="utf-8") != content:
                stale.append(path.relative_to(ROOT))
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")

    if not args.check:
        for path in unexpected:
            path.unlink()
        return 0

    if stale or unexpected:
        print("stale publication projections:")
        for path in stale:
            print(f"- {path}")
        for path in unexpected:
            print(f"- unexpected: {path.relative_to(ROOT)}")
        print("run: python scripts/build-publication.py")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
