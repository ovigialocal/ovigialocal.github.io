#!/usr/bin/env python3
"""Small, explicit quality ratchet for O Vigia's public newspaper surface."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def require(text: str, needle: str, context: str) -> None:
    if needle not in text:
        raise SystemExit(f"{context}: missing required contract {needle!r}")


def forbid(text: str, needle: str, context: str) -> None:
    if needle.lower() in text.lower():
        raise SystemExit(f"{context}: forbidden stale contract {needle!r}")


def parse_flat_frontmatter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise SystemExit(f"{path}: missing frontmatter")
    try:
        raw, _ = text[4:].split("\n---\n", 1)
    except ValueError as exc:
        raise SystemExit(f"{path}: unterminated frontmatter") from exc
    meta: dict[str, str] = {}
    for line in raw.splitlines():
        if not line.strip() or line[:1].isspace():
            continue
        key, sep, value = line.partition(":")
        if not sep:
            continue
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
            value = value[1:-1]
        meta[key] = value
    return meta


def verify_projection_identity() -> None:
    canonical = {}
    for path in (ROOT / "content" / "articles").glob("*.md"):
        meta = parse_flat_frontmatter(path)
        canonical[meta["story_id"]] = path
    projected = {path.stem: path for path in (ROOT / "_news").glob("*.md")}
    if canonical.keys() != projected.keys():
        missing = sorted(canonical.keys() - projected.keys())
        extra = sorted(projected.keys() - canonical.keys())
        raise SystemExit(f"Jekyll projection mismatch; missing={missing}, extra={extra}")
    for story_id, source in canonical.items():
        if source.read_bytes() != projected[story_id].read_bytes():
            raise SystemExit(f"_news/{story_id}.md is not byte-identical to canonical public Markdown")


def verify_optional_contracts() -> None:
    media_required = {"media_alt", "media_credit", "media_source_url", "media_width", "media_height"}
    temporal_required = {"next_event_kind", "next_event_label"}
    for path in (ROOT / "content" / "articles").glob("*.md"):
        meta = parse_flat_frontmatter(path)
        if meta.get("media_url"):
            missing = sorted(key for key in media_required if not meta.get(key))
            if missing:
                raise SystemExit(f"{path}: media_url requires {', '.join(missing)}")
        if meta.get("next_event_at"):
            missing = sorted(key for key in temporal_required if not meta.get(key))
            if missing:
                raise SystemExit(f"{path}: next_event_at requires {', '.join(missing)}")


def verify_budget() -> None:
    css_paths = [
        "index.css", "editorial-cover.css", "article.css", "news-shell.css",
        "mobile-editorial.css", "institutional.css", "cobogo-theme.css",
        "temporal-modules.css",
    ]
    js_paths = ["app.js", "article.js", "article-interactions.js"]
    css_size = sum((ROOT / path).stat().st_size for path in css_paths if (ROOT / path).exists())
    js_size = sum((ROOT / path).stat().st_size for path in js_paths if (ROOT / path).exists())
    if css_size > 90_000:
        raise SystemExit(f"CSS budget exceeded: {css_size} > 90000 bytes")
    if js_size > 30_000:
        raise SystemExit(f"JS budget exceeded: {js_size} > 30000 bytes")


def main() -> int:
    index = read("index.html")
    app = read("app.js")
    layout = read("_layouts/news.html")
    methodology = read("metodologia.html")
    corrections = read("correcoes.html")
    archive = read("arquivo.html")
    sections = read("editorias.html")
    temporal_contract = read("docs/editorial-temporal-contract.md")
    feed = read("feed.xml")
    sitemap = read("sitemap.xml")
    json_projection = read("articles.json")

    for path, text in {
        "index.html": index,
        "metodologia.html": methodology,
        "correcoes.html": corrections,
        "arquivo.html": archive,
        "editorias.html": sections,
    }.items():
        forbid(text, "Protótipo", path)
        forbid(text, "primeira edição em preparação", path)
        forbid(text, "opera exclusivamente", path)
        require(text, "<main", path)
        require(text, "<nav", path)

    require(index, "site.news", "index.html")
    require(index, "front-lede", "index.html")
    require(index, "service-desk", "index.html")
    require(index, "lead.media_url", "index.html")
    require(index, "editorias.html", "index.html")
    require(index, "arquivo.html", "index.html")
    require(index, "next_event_at", "index.html")
    require(index, "temporal-desk", "index.html")
    require(index, 'next_event_kind == "acompanhamento"', "index.html")
    require(index, "story.source_url", "index.html")
    require(index, "temporal-modules.css", "index.html")
    require(temporal_contract, "não tenta adivinhar prazos", "docs/editorial-temporal-contract.md")
    require(temporal_contract, "Agenda — Hoje / próximos dias", "docs/editorial-temporal-contract.md")
    require(temporal_contract, "Acompanhe — Histórias abertas", "docs/editorial-temporal-contract.md")
    forbid(app, 'fetch("articles.json")', "app.js")
    forbid(app, "fetch('articles.json')", "app.js")

    for needle in [
        'rel="canonical"', 'property="og:type"', 'NewsArticle',
        "page.source_url", "page.source_name", "correcoes.html",
        "page.media_url", "media_source_url", "data-share-button",
    ]:
        require(layout, needle, "_layouts/news.html")

    require(methodology, "fontes verificáveis", "metodologia.html")
    require(methodology, "Fonte oficial não é sinônimo de verdade automática", "metodologia.html")
    require(methodology, "Fato, inferência e incerteza", "metodologia.html")
    require(corrections, "issues/new", "correcoes.html")
    require(corrections, "Correção, atualização e retração", "correcoes.html")

    require(archive, "site.news", "arquivo.html")
    require(sections, "map: \"category\" | uniq", "editorias.html")
    for name, projection in {"articles.json": json_projection, "feed.xml": feed, "sitemap.xml": sitemap}.items():
        require(projection, "story.url", name)
        forbid(projection, "article.html?id", name)

    verify_projection_identity()
    verify_optional_contracts()
    verify_budget()
    print("public newspaper surface: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
