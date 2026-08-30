// O Vigia — face pública.
// A publicação editorial preenche esta coleção; o estado vazio é uma edição válida.
const publishedArticles = [];
let activeBairro = "Todos os Bairros";

document.addEventListener("DOMContentLoaded", () => {
  setupSearch();
  setupModal();
  setupKeyboardAccessibility();
  renderBairroFilters();
  filterAndRender();
});

function renderBairroFilters() {
  const container = document.getElementById("bairro-filter");
  if (!container) return;
  const bairros = ["Todos os Bairros", ...new Set(publishedArticles.map(a => a.bairro).filter(Boolean))];
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
  const query = (document.getElementById("search-input")?.value || "").toLowerCase();
  const emptyState = document.getElementById("prototype-banner");
  const controls = document.getElementById("controls-section");
  const grid = document.getElementById("news-grid");
  if (publishedArticles.length === 0) {
    if (emptyState) emptyState.style.display = "grid";
    if (controls) controls.style.display = "none";
    if (grid) grid.innerHTML = "";
    return;
  }
  if (emptyState) emptyState.style.display = "none";
  if (controls) controls.style.display = "flex";
  const filtered = publishedArticles.filter(article => {
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
    grid.innerHTML = "<p>Nenhuma matéria encontrada com esses filtros.</p>";
    return;
  }
  articles.forEach(article => {
    const card = document.createElement("article");
    card.className = "news-card";
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

function setupSearch() {
  document.getElementById("search-input")?.addEventListener("input", filterAndRender);
}
function setupModal() {
  const modal = document.getElementById("modal-provenance");
  document.getElementById("modal-close")?.addEventListener("click", () => closeModal(modal));
  modal?.addEventListener("click", event => { if (event.target === modal) closeModal(modal); });
}
function openProvenanceModal(articleId) {
  const article = publishedArticles.find(a => a.id === articleId);
  const modal = document.getElementById("modal-provenance");
  const content = document.getElementById("modal-content");
  if (!article || !modal || !content) return;
  content.innerHTML = "";
  const title = document.createElement("h2");
  title.id = "modal-provenance-title";
  title.textContent = "Fontes desta matéria";
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
