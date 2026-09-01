const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");
const SAFE_STORY_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

if (articleId && SAFE_STORY_ID.test(articleId)) {
  window.location.replace(`/noticias/${encodeURIComponent(articleId)}/`);
}
