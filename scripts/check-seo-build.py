#!/usr/bin/env python3
"""Fail CI when the built public site regresses on core SEO contracts.

This intentionally validates generated HTML instead of Astro source so the gate
covers the artifact search engines actually receive.
"""

from __future__ import annotations

import json
import sys
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

SITE_ORIGIN = "https://ovigialocal.github.io"


class SEOParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.html_lang: str | None = None
        self.in_title = False
        self.title_chunks: list[str] = []
        self.meta: defaultdict[str, list[str]] = defaultdict(list)
        self.links: list[dict[str, str]] = []
        self.in_json_ld = False
        self.json_ld_chunks: list[str] = []
        self.json_ld_documents: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): (value or "") for key, value in attrs}
        tag = tag.lower()
        if tag == "html":
            self.html_lang = values.get("lang")
        elif tag == "title":
            self.in_title = True
        elif tag == "meta":
            key = values.get("name") or values.get("property")
            if key:
                self.meta[key.lower()].append(values.get("content", "").strip())
        elif tag == "link":
            self.links.append(values)
        elif tag == "script" and values.get("type", "").lower() == "application/ld+json":
            self.in_json_ld = True
            self.json_ld_chunks = []

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title":
            self.in_title = False
        elif tag == "script" and self.in_json_ld:
            self.json_ld_documents.append("".join(self.json_ld_chunks).strip())
            self.in_json_ld = False
            self.json_ld_chunks = []

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_chunks.append(data)
        if self.in_json_ld:
            self.json_ld_chunks.append(data)

    @property
    def title(self) -> str:
        return "".join(self.title_chunks).strip()


def one(meta: defaultdict[str, list[str]], key: str) -> str | None:
    values = meta.get(key.lower(), [])
    return values[0] if len(values) == 1 else None


def valid_public_url(value: str | None) -> bool:
    if not value:
        return False
    parsed = urlparse(value)
    return parsed.scheme == "https" and parsed.netloc == "ovigialocal.github.io"


def find_link(parser: SEOParser, rel: str, *, type_: str | None = None) -> list[dict[str, str]]:
    matches = []
    for link in parser.links:
        rels = {item.lower() for item in link.get("rel", "").split()}
        if rel.lower() not in rels:
            continue
        if type_ and link.get("type", "").lower() != type_.lower():
            continue
        matches.append(link)
    return matches


def json_ld_objects(parser: SEOParser) -> list[dict]:
    objects: list[dict] = []
    for raw in parser.json_ld_documents:
        if not raw:
            continue
        try:
            value = json.loads(raw)
        except json.JSONDecodeError:
            continue
        candidates = value if isinstance(value, list) else [value]
        for candidate in candidates:
            if isinstance(candidate, dict):
                objects.append(candidate)
                graph = candidate.get("@graph")
                if isinstance(graph, list):
                    objects.extend(item for item in graph if isinstance(item, dict))
    return objects


def check_html(path: Path, root: Path) -> tuple[list[str], str | None]:
    rel = path.relative_to(root).as_posix()
    parser = SEOParser()
    parser.feed(path.read_text(encoding="utf-8"))
    errors: list[str] = []

    def require(condition: bool, message: str) -> None:
        if not condition:
            errors.append(f"{rel}: {message}")

    require((parser.html_lang or "").lower() == "pt-br", "<html> must declare lang=pt-BR")
    require(bool(parser.title), "missing non-empty <title>")

    description = one(parser.meta, "description")
    require(bool(description), "must have exactly one non-empty meta description")

    canonical_links = find_link(parser, "canonical")
    canonical = canonical_links[0].get("href") if len(canonical_links) == 1 else None
    require(len(canonical_links) == 1, "must have exactly one canonical link")
    require(valid_public_url(canonical), "canonical must be an absolute HTTPS O Vigia URL")

    required_og = ["og:type", "og:site_name", "og:locale", "og:title", "og:description", "og:url"]
    for key in required_og:
        require(bool(one(parser.meta, key)), f"must have exactly one non-empty {key}")

    require(one(parser.meta, "og:site_name") == "O Vigia", "og:site_name must be O Vigia")
    require(one(parser.meta, "og:locale") == "pt_BR", "og:locale must be pt_BR")
    require(one(parser.meta, "og:url") == canonical, "og:url must match canonical")

    robots = ",".join(parser.meta.get("robots", [])).lower()
    require("noindex" not in robots, "public page must not be noindex")

    require(bool(find_link(parser, "alternate", type_="application/rss+xml")), "missing RSS alternate link")
    require(bool(find_link(parser, "sitemap")), "missing sitemap link")

    is_article = rel.startswith("noticias/") and rel.endswith("/index.html")
    if is_article:
        require(one(parser.meta, "og:type") == "article", "news page must use og:type=article")
        require(bool(one(parser.meta, "article:published_time")), "news page missing article:published_time")

        news_articles = [obj for obj in json_ld_objects(parser) if obj.get("@type") == "NewsArticle"]
        require(len(news_articles) == 1, "news page must contain exactly one valid NewsArticle JSON-LD object")
        if len(news_articles) == 1:
            article = news_articles[0]
            for field in ("headline", "description", "datePublished", "mainEntityOfPage", "author", "publisher"):
                require(bool(article.get(field)), f"NewsArticle missing {field}")
            require(article.get("mainEntityOfPage") == canonical, "NewsArticle.mainEntityOfPage must match canonical")
            publisher = article.get("publisher")
            require(isinstance(publisher, dict) and publisher.get("name") == "O Vigia", "NewsArticle.publisher must identify O Vigia")

    return errors, canonical


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
    if not root.is_dir():
        print(f"SEO gate: build directory not found: {root}", file=sys.stderr)
        return 2

    errors: list[str] = []
    html_files = sorted(root.rglob("*.html"))
    if not html_files:
        errors.append("build contains no HTML files")

    canonical_to_files: defaultdict[str, list[str]] = defaultdict(list)
    for path in html_files:
        page_errors, canonical = check_html(path, root)
        errors.extend(page_errors)
        if canonical:
            canonical_to_files[canonical].append(path.relative_to(root).as_posix())

    for canonical, files in sorted(canonical_to_files.items()):
        if len(files) > 1:
            errors.append(f"duplicate canonical {canonical}: {', '.join(files)}")

    required_files = ["robots.txt", "feed.xml", "sitemap-index.xml"]
    for name in required_files:
        if not (root / name).is_file():
            errors.append(f"build missing {name}")

    robots_path = root / "robots.txt"
    if robots_path.is_file():
        robots = robots_path.read_text(encoding="utf-8")
        if "User-agent: *" not in robots or "Allow: /" not in robots:
            errors.append("robots.txt must allow public crawling")
        expected_sitemap = f"Sitemap: {SITE_ORIGIN}/sitemap-index.xml"
        if expected_sitemap not in robots:
            errors.append(f"robots.txt must advertise {SITE_ORIGIN}/sitemap-index.xml")

    if errors:
        print("SEO regression gate failed:\n")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"SEO regression gate passed for {len(html_files)} HTML pages.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
