// O Vigia — melhoria progressiva da superfície já renderizada no HTML.
let activeBairro = "Todos";

const normalize = value => (value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

function cards() {
  return [...document.querySelectorAll("[data-news-card]")];
}

function setupBairroFilters() {
  const container = document.getElementById("bairro-filter");
  if (!container) return;

  const bairros = [
    "Todos",
    ...new Set(cards().map(card => card.dataset.bairro).filter(Boolean))
  ];

  container.replaceChildren(...bairros.map((bairro, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip ${index === 0 ? "active" : ""}`;
    button.textContent = bairro;
    button.addEventListener("click", () => {
      container.querySelectorAll(".filter-chip").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      activeBairro = bairro;
      filterAndRender();
    });
    return button;
  }));
}

function filterAndRender() {
  const query = normalize(document.getElementById("search-input")?.value);
  let visible = 0;

  cards().forEach(card => {
    const bairroMatches = activeBairro === "Todos" || card.dataset.bairro === activeBairro;
    const textMatches = !query || normalize(card.textContent).includes(query);
    card.hidden = !(bairroMatches && textMatches);
    if (!card.hidden) visible += 1;
  });

  document.querySelectorAll("[data-news-section]").forEach(section => {
    section.hidden = ![...section.querySelectorAll("[data-news-card]")].some(card => !card.hidden);
  });

  const noResults = document.getElementById("no-results");
  if (noResults) noResults.hidden = visible !== 0;
}

function setupSearch() {
  document.getElementById("search-input")?.addEventListener("input", filterAndRender);
}

function closeModal() {
  const modal = document.getElementById("modal-provenance");
  if (!modal) return;
  modal.setAttribute("hidden", "true");
  modal.classList.remove("active");
}

function openProvenance(button) {
  const modal = document.getElementById("modal-provenance");
  const content = document.getElementById("modal-content");
  if (!modal || !content) return;

  const title = document.createElement("h2");
  title.id = "modal-provenance-title";
  title.textContent = button.dataset.title || "Fonte da matéria";

  const box = document.createElement("div");
  box.className = "provenance-box";

  const source = document.createElement("div");
  source.className = "provenance-item";
  const sourceLabel = document.createElement("strong");
  sourceLabel.textContent = "Fonte: ";
  source.append(sourceLabel, document.createTextNode(button.dataset.sourceName || ""));
  box.appendChild(source);

  if (button.dataset.sourceHash) {
    const reference = document.createElement("div");
    reference.className = "provenance-item";
    const referenceLabel = document.createElement("strong");
    referenceLabel.textContent = "Referência: ";
    reference.append(referenceLabel, document.createTextNode(button.dataset.sourceHash));
    box.appendChild(reference);
  }

  if (button.dataset.sourceUrl) {
    const link = document.createElement("a");
    link.className = "provenance-source-link";
    link.href = button.dataset.sourceUrl;
    link.rel = "noopener noreferrer";
    link.textContent = "Abrir fonte verificável ↗";
    box.appendChild(link);
  }

  content.replaceChildren(title, box);
  modal.removeAttribute("hidden");
  modal.classList.add("active");
  document.getElementById("modal-close")?.focus();
}

function setupModal() {
  document.querySelectorAll("[data-provenance-button]").forEach(button => {
    button.addEventListener("click", () => openProvenance(button));
  });
  document.getElementById("modal-close")?.addEventListener("click", closeModal);
  document.getElementById("modal-provenance")?.addEventListener("click", event => {
    if (event.target.id === "modal-provenance") closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupBairroFilters();
  setupSearch();
  setupModal();
  filterAndRender();
});
