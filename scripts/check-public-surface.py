#!/usr/bin/env python3
"""Static source-level ratchet for O Vigia's Astro public surface."""
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


def verify_no_jekyll() -> None:
    stale = ["_config.yml", "_layouts", "_news", "index.html", "editorias.html", "territorios.html", "arquivo.html", "metodologia.html", "correcoes.html", "feed.xml", "sitemap.xml", "articles.json"]
    found = [path for path in stale if (ROOT / path).exists()]
    if found:
        raise SystemExit(f"legacy Jekyll/public projections still present: {', '.join(found)}")


def verify_budget() -> None:
    css_paths = ["index.css", "editorial-cover.css", "article.css", "news-shell.css", "mobile-editorial.css", "institutional.css", "cobogo-theme.css", "temporal-modules.css", "print.css"]
    css_size = sum((ROOT / path).stat().st_size for path in css_paths if (ROOT / path).exists())
    if css_size > 90_000:
        raise SystemExit(f"CSS budget exceeded: {css_size} > 90000 bytes")


def verify_operational_contract() -> None:
    agents = read("AGENTS.md")
    readme = read("README.md")
    skill = read("skills/publication-review/SKILL.md")
    rfc = read("docs/rfc/0001-independent-publication-agent.md")
    publication_readme = read("publication/README.md")
    compatibility = read("scripts/build-publication.py")
    deploy = read(".github/workflows/deploy.yml")

    for name, text in {
        "AGENTS.md": agents,
        "README.md": readme,
        "publication-review": skill,
        "RFC 0001": rfc,
        "publication ledger": publication_readme,
    }.items():
        require(text, "PublicArticle", name)
        require(text, "PublicTerritory", name)

    require(agents, "The public renderer is Astro SSG, not Jekyll.", "AGENTS.md")
    require(readme, "Astro Content Layer", "README.md")
    require(skill, "Não gere `_news`", "publication-review")
    require(rfc, "O renderer público é Astro SSG", "RFC 0001")
    require(publication_readme, "Não existe `_news`", "publication ledger")

    require(compatibility, "check-astro-okf-contract.py", "build-publication compatibility entrypoint")
    forbid(compatibility, "REQUIRED =", "build-publication compatibility entrypoint")
    forbid(compatibility, "KEY_RE", "build-publication compatibility entrypoint")

    require(deploy, "withastro/action@v6", "Pages deploy")
    require(deploy, "actions/deploy-pages@v5", "Pages deploy")
    require(deploy, "bun-version: 1.3.8", "Pages deploy")
    require(deploy, "package-manager: bun@1.3.8", "Pages deploy")
    require(deploy, "bun install --frozen-lockfile", "Pages deploy")


def main() -> int:
    files = {
        "homepage": read("src/pages/index.astro"),
        "article": read("src/pages/noticias/[story_id].astro"),
        "legacy-article": read("src/pages/article.html.astro"),
        "base": read("src/layouts/BaseLayout.astro"),
        "editorias": read("src/pages/editorias.html.astro"),
        "territorios": read("src/pages/territorios.html.astro"),
        "territorio": read("src/pages/territorios/[territory_id].astro"),
        "arquivo": read("src/pages/arquivo.html.astro"),
        "metodologia": read("src/pages/metodologia.html.astro"),
        "correcoes": read("src/pages/correcoes.html.astro"),
        "article-card": read("src/components/concepts/PublicArticleCard.astro"),
        "territory-card": read("src/components/concepts/PublicTerritoryCard.astro"),
        "territory-header": read("src/components/concepts/PublicTerritoryHeader.astro"),
        "search": read("src/components/SearchBox.astro"),
        "json": read("src/pages/articles.json.ts"),
        "feed": read("src/pages/feed.xml.ts"),
        "sitemap": read("src/pages/sitemap.xml.ts"),
    }
    for name, text in files.items():
        forbid(text, "Protótipo", name)
        forbid(text, "opera exclusivamente", name)

    for needle in ["getCollection('articles')", "front-lede", "service-desk", "temporal-desk", "source_url", "media_url"]:
        require(files["homepage"], needle, "homepage")
    for needle in ["getStaticPaths", "render(story)", "resolveStoryTerritory", "data-share-button"]:
        require(files["article"], needle, "article")
    require(files["legacy-article"], "URLSearchParams", "legacy article redirect")
    require(files["legacy-article"], "/noticias/", "legacy article redirect")
    for needle in ["NewsArticle", 'rel="sitemap"', "data-pagefind-ignore"]:
        require(files["base"], needle, "BaseLayout")

    require(files["metodologia"], "Fonte oficial não é sinônimo de verdade automática", "metodologia")
    require(files["metodologia"], "Fato, inferência e incerteza", "metodologia")
    require(files["correcoes"], "issues/new", "correcoes")
    require(files["correcoes"], "Correção, atualização e retração", "correcoes")

    require(files["editorias"], "groupBy(stories, 'category')", "editorias")
    require(files["territorios"], "getCollection('territories')", "territorios")
    require(files["territorios"], "PublicTerritoryCard", "territorios")
    require(files["territorio"], "PublicTerritoryHeader", "territorio detail")
    require(files["territorio"], "PublicArticleCard", "territorio detail")
    require(files["territorio"], "getStaticPaths", "territorio detail")
    require(files["article-card"], "CollectionEntry<'articles'>", "PublicArticleCard")
    require(files["territory-card"], "CollectionEntry<'territories'>", "PublicTerritoryCard")
    require(files["territory-header"], "CollectionEntry<'territories'>", "PublicTerritoryHeader")
    require(files["search"], "PagefindConfig", "SearchBox")
    require(files["search"], "pagefind-searchbox", "SearchBox")

    for name in ("json", "feed", "sitemap"):
        require(files[name], "storyUrl", name)
        forbid(files[name], "article.html?id", name)

    verify_no_jekyll()
    verify_operational_contract()
    verify_budget()
    print("Astro public newspaper surface and operational contract: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
