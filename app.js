// O Vigia — face pública.
// A publicação editorial preenche esta coleção; o estado vazio é uma edição válida.
const publishedArticles = [];

// Fixture exclusivamente local para validar a composição futura sem publicar notícia falsa.
// Em GitHub Pages este preview nunca é ativado.
const LOCAL_PREVIEW_ARTICLES = [
  { id: "preview-1", category: "Cidade", bairro: "Centro", date: "30 ago", title: "Manchete de demonstração mostra como a capa prioriza a notícia mais importante", excerpt: "Texto fictício de composição, usado apenas em localhost para validar hierarquia, ritmo e leitura da futura capa populada.", sourceName: "Fonte de demonstração" },
  { id: "preview-2", category: "Serviços", bairro: "Zona Leste", date: "30 ago", title: "Informação de serviço aparece como notícia secundária sem competir com a manchete", excerpt: "A composição mantém editoria, bairro e data visíveis, mas subordinados ao título.", sourceName: "Fonte de demonstração" },
  { id: "preview-3", category: "Bairros", bairro: "Areal", date: "29 ago", title: "Bairros ganham espaço próprio na leitura da edição", excerpt: "O módulo secundário usa menos peso e mais ritmo editorial do que um card de dashboard.", sourceName: "Fonte de demonstração" },
  { id: "preview-4", category: "Economia local", bairro: "Nova Porto Velho", date: "29 ago", title: "Mais notícias ampliam a edição sem transformar a capa em grade uniforme", excerpt: "O sistema continua legível quando o acervo cresce.", sourceName: "Fonte de demonstração" },
  { id: "preview-5", category: "Cidade", bairro: "Centro", date: "28 ago", title: "Metadados permanecem discretos e recuperáveis", excerpt: "A informação de confiança continua disponível sem dominar a leitura jornalística.", sourceName: "Fonte de demonstração" }
];

function previewEnabled() {
  const local = location.hostname === "127.0.0.1" || location.hostname === "localhost";
  return local && new URLSearchParams(location.search).get("preview") === "populated";
}

function currentArticles() {
  return previewEnabled() ? LOCAL_PREVIEW_ARTICLES : publishedArticles;
}

let activeBairro = "Todos os Bairros";

document.addEventListener("DOMContentLoaded", () => {
  if (previewEnabled()) document.body.dataset.preview = "populated";
  setupSearch();
  setupModal();
  setupKeyboardAccessibility();
  renderBairroFilters();
  filterAndRender();
});

function renderBairroFilters() {
  const container = document.getElementById("bairro-filter");
  if (!container) return;
  const bairros = ["Todos os Bairros", ...new Set(currentArticles().map(a => a.bairro).filter(Boolean))];
  container.innerHTML = "";
  bairros.forEach((bairro, index) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `filter-chip ${index === 0 ? "active" : ""}`;
    chip.textContent = bairro;
    chip.addEventListener("click", () => {
      container.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeBairro = bairro;
      filterAndRender();
    });
    container.appendChild(chip);
  });
}

function filterAndRender() {
  const articles = currentArticles();
  const query = (document.getElementById("search-input")?.value || "").toLowerCase();
  const emptyState = document.getElementById("prototype-banner");
  const controls = document.getElementById("controls-section");
  const grid = document.getElementById("news-grid");
  if (articles.length === 0) {
    if (emptyState) emptyState.style.display = "grid";
    if (controls) controls.style.display = "none";
    if (grid) grid.innerHTML = "";
    return;
  }
  if (emptyState) emptyState.style.display = "none";
  if (controls) controls.style.display = "flex";
  const filtered = articles.filter(article => {
    const bairro = activeBairro === "Todos os Bairros" || article.bairro === activeBairro;
    const text = `${article.title || ""} ${article.excerpt || ""}`.toLowerCase();
    return bairro && text.includes(query);
  });
  renderArticles(filtered);
}

function renderArticles(articles) {
  const grid = document.getElementById("news-grid");
  if (!grid) return;
  grid.innerHTML = "";
  if (articles.length === 0) {
    grid.innerHTML = '<p class="no-results">Nenhuma matéria encontrada com esses filtros.</p>';
    return;
  }
  articles.forEach((article, index) => {
    const card = document.createElement("article");
    card.className = `news-card ${index === 0 ? "news-card-lead" : index < 3 ? "news-card-secondary" : "news-card-brief"}`;
    const header = document.createElement("div");
    header.className = "card-header";
    const tag = document.createElement("span");
    tag.className = "badge-tag";
    tag.textContent = [article.category, article.bairro].filter(Boolean).join(" · ");
    const date = document.createElement("time");
    date.className = "card-date";
    date.textContent = article.date || "";
    header.append(tag, date);
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = article.title;
    const excerpt = document.createElement("p");
    excerpt.className = "card-excerpt";
    excerpt.textContent = article.excerpt || "";
    const meta = document.createElement("div");
    meta.className = "card-metadata";
    const source = document.createElement("span");
    source.className = "source-badge";
    source.textContent = article.sourceName ? `Fonte: ${article.sourceName}` : "";
    const provenance = document.createElement("button");
    provenance.type = "button";
    provenance.className = "btn-provenance";
    provenance.textContent = "Ver fontes";
    provenance.addEventListener("click", () => openProvenanceModal(article.id));
    meta.append(source, provenance);
    card.append(header, title, excerpt, meta);
    grid.appendChild(card);
  });
}

function setupSearch() { document.getElementById("search-input")?.addEventListener("input", filterAndRender); }
function setupModal() {
  const modal = document.getElementById("modal-provenance");
  document.getElementById("modal-close")?.addEventListener("click", () => closeModal(modal));
  modal?.addEventListener("click", event => { if (event.target === modal) closeModal(modal); });
}
function openProvenanceModal(articleId) {
  const article = currentArticles().find(a => a.id === articleId);
  const modal = document.getElementById("modal-provenance");
  const content = document.getElementById("modal-content");
  if (!article || !modal || !content) return;
  content.innerHTML = "";
  const title = document.createElement("h2");
  title.id = "modal-provenance-title";
  title.textContent = previewEnabled() ? "Fontes — preview de composição" : "Fontes desta matéria";
  const box = document.createElement("div");
  box.className = "provenance-box";
  [["Matéria", article.title], ["Fonte", article.sourceName], ["Bairro", article.bairro], ["Referência", article.sourceHash]].filter(([,value]) => value).forEach(([label,value]) => {
    const item = document.createElement("div");
    item.className = "provenance-item";
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    item.append(strong, document.createTextNode(value));
    box.appendChild(item);
  });
  content.append(title, box);
  modal.removeAttribute("hidden");
  modal.classList.add("active");
  document.getElementById("modal-close")?.focus();
}
function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("hidden", "true");
}
function setupKeyboardAccessibility() {
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") document.querySelectorAll(".modal-overlay.active").forEach(closeModal);
  });
}
