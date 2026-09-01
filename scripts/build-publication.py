#!/usr/bin/env python3
"""Build deterministic public projections from canonical article Markdown."""
from __future__ import annotations

import argparse
import html
import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path
from urllib.parse import quote
from xml.sax.saxutils import escape as xml_escape

ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = ROOT / "content" / "articles"
JEKYLL_NEWS_DIR = ROOT / "_news"
SITE = "https://ovigialocal.github.io"
MONTHS_PT = ("jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez")
REQUIRED = {
    "title", "description", "story_id", "locality", "category", "published_at",
    "source_repository", "source_commit", "source_path", "source_digest",
    "source_name", "source_url",
}
KEY_RE = re.compile(r"^([A-Za-z0-9_-]+):(?:\s*(.*))?$")
STORY_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")
LINK_RE = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")
BOLD_RE = re.compile(r"\*\*(.+?)\*\*")
ORDERED_RE = re.compile(r"^\d+\.\s+(.+)$")


@dataclass(frozen=True)
class Article:
    meta: dict[str, str]
    body: str
    source_file: Path

    @property
    def published_at(self) -> datetime:
        return datetime.fromisoformat(self.meta["published_at"])

    @property
    def route(self) -> str:
        # Compatibility route retained in JSON/feed/sitemap while old public links exist.
        # The canonical reader-facing route is emitted by Jekyll as /noticias/<story_id>/.
        return f"article.html?id={quote(self.meta['story_id'], safe='')}"

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
        raw_meta, body = text[4:].split("\n---\n", 1)
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
    body = body.lstrip("\n")
    first_line, sep, remainder = body.partition("\n")
    if first_line == f"# {meta['title']}":
        body = remainder.lstrip("\n") if sep else ""
    return Article(meta, body, path)


def inline(text: str) -> str:
    escaped = html.escape(text, quote=True)
    escaped = LINK_RE.sub(lambda match: f'<a href="{match.group(2)}">{match.group(1)}</a>', escaped)
    escaped = BOLD_RE.sub(r"<strong>\1</strong>", escaped)
    return escaped


def render_markdown(body: str) -> str:
    lines = body.splitlines()
    out: list[str] = []
    paragraph: list[str] = []
    index = 0

    def flush_paragraph() -> None:
        if paragraph:
            out.append(f"<p>{inline(' '.join(part.strip() for part in paragraph))}</p>")
            paragraph.clear()

    while index < len(lines):
        line = lines[index]
        stripped = line.strip()
        if not stripped:
            flush_paragraph()
            index += 1
            continue
        if stripped.startswith("## "):
            flush_paragraph()
            out.append(f"<h2>{inline(stripped[3:])}</h2>")
            index += 1
            continue
        if stripped.startswith("### "):
            flush_paragraph()
            out.append(f"<h3>{inline(stripped[4:])}</h3>")
            index += 1
            continue
        if stripped.startswith("- "):
            flush_paragraph()
            items: list[str] = []
            while index < len(lines) and lines[index].strip().startswith("- "):
                items.append(f"<li>{inline(lines[index].strip()[2:])}</li>")
                index += 1
            out.append("<ul>" + "".join(items) + "</ul>")
            continue
        ordered = ORDERED_RE.match(stripped)
        if ordered:
            flush_paragraph()
            items = []
            while index < len(lines):
                match = ORDERED_RE.match(lines[index].strip())
                if not match:
                    break
                items.append(f"<li>{inline(match.group(1))}</li>")
                index += 1
            out.append("<ol>" + "".join(items) + "</ol>")
            continue
        if stripped.startswith("> "):
            flush_paragraph()
            out.append(f"<blockquote><p>{inline(stripped[2:])}</p></blockquote>")
            index += 1
            continue
        paragraph.append(line)
        index += 1
    flush_paragraph()
    return "".join(out)


def load_articles() -> list[Article]:
    articles = [parse_article(path) for path in sorted(ARTICLES_DIR.glob("*.md"))]
    seen: set[str] = set()
    for article in articles:
        story_id = article.meta["story_id"]
        if story_id in seen:
            raise ValueError(f"duplicate story_id: {story_id}")
        seen.add(story_id)
    return sorted(articles, key=lambda article: article.published_at, reverse=True)


def build_json(articles: list[Article]) -> str:
    payload = []
    for article in articles:
        dt = article.published_at
        meta = article.meta
        payload.append({
            "id": meta["story_id"],
            "category": meta["category"],
            "bairro": meta.get("bairro", ""),
            "date": f"{dt.day} {MONTHS_PT[dt.month - 1]}",
            "dateIso": meta["published_at"],
            "title": meta["title"],
            "excerpt": meta["description"],
            "deck": meta["description"],
            "sourceName": meta["source_name"],
            "sourceUrl": meta["source_url"],
            "sourceHash": meta["source_digest"],
            "neighborhood": meta.get("neighborhood", meta["locality"].split(",", 1)[0].strip()),
            "url": article.route,
            "contentHtml": render_markdown(article.body),
        })
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def build_feed(articles: list[Article]) -> str:
    items = []
    for article in articles:
        meta = article.meta
        url = f"{SITE}/{article.route}"
        items.append(
            "    <item>\n"
            f"      <title>{xml_escape(meta['title'])}</title>\n"
            f"      <link>{xml_escape(url)}</link>\n"
            f"      <guid isPermaLink=\"true\">{xml_escape(url)}</guid>\n"
            f"      <pubDate>{format_datetime(article.published_at.astimezone(timezone.utc), usegmt=True)}</pubDate>\n"
            f"      <category>{xml_escape(meta['category'])}</category>\n"
            f"      <description>{xml_escape(meta['description'])}</description>\n"
            "    </item>"
        )
    joined = "\n".join(items)
    suffix = f"\n{joined}" if joined else ""
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0">\n'
        '  <channel>\n'
        '    <title>O Vigia — Porto Velho</title>\n'
        f'    <link>{SITE}</link>\n'
        '    <description>Feed do projeto O Vigia em Porto Velho (RO)</description>\n'
        '    <language>pt-BR</language>'
        f'{suffix}\n'
        '  </channel>\n'
        '</rss>\n'
    )


def build_sitemap(articles: list[Article]) -> str:
    chunks = [
        "  <url>\n"
        f"    <loc>{SITE}/</loc>\n"
        "    <changefreq>daily</changefreq>\n"
        "  </url>"
    ]
    for article in articles:
        url = f"{SITE}/{article.route}"
        chunks.append(
            "  <url>\n"
            f"    <loc>{xml_escape(url)}</loc>\n"
            f"    <lastmod>{article.published_at.date().isoformat()}</lastmod>\n"
            "    <changefreq>daily</changefreq>\n"
            "  </url>"
        )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(chunks)
        + "\n</urlset>\n"
    )


def projections() -> dict[Path, str]:
    articles = load_articles()
    result = {
        ROOT / "articles.json": build_json(articles),
        ROOT / "feed.xml": build_feed(articles),
        ROOT / "sitemap.xml": build_sitemap(articles),
    }
    for article in articles:
        result[article.jekyll_projection] = article.source_file.read_text(encoding="utf-8")
    return result


def unexpected_news_files(expected: set[Path]) -> list[Path]:
    if not JEKYLL_NEWS_DIR.exists():
        return []
    return sorted(path for path in JEKYLL_NEWS_DIR.glob("*.md") if path not in expected)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if committed projections are stale")
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
