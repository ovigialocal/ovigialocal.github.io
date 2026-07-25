// O Vigia — Face Pública (Protótipo Canônico)

// Apenas Porto Velho é suportada no MVP
const SUPPORTED_CITIES = [
  {
    id: "porto-velho",
    name: "Porto Velho",
    state: "RO",
    lat: -8.7619,
    lon: -63.9039,
    bairros: ["Todos os Bairros", "Nova Porto Velho", "Embratel", "Areal", "Centro", "São Cristóvão"],
    description: "Edição piloto em desenvolvimento para o município de Porto Velho (RO) sobre dados abertos do CNPJ da Receita Federal."
  }
];

// Matérias reais produzidas pelo pipeline vertical (inicia vazio no protótipo)
const publishedArticles = [];

let activeCity = SUPPORTED_CITIES[0];
let activeBairro = "Todos os Bairros";

document.addEventListener("DOMContentLoaded", () => {
  initCityResolution();
  setupCityModal();
  setupSearch();
  setupModal();
  setupKeyboardAccessibility();
});

function initCityResolution() {
  setCity(SUPPORTED_CITIES[0], "📍 Cidade Piloto");
}

function setCity(city, reason) {
  activeCity = city;
  activeBairro = "Todos os Bairros";
  updateCityUI(reason);
  filterAndRender();
}

function updateCityUI(reason) {
  if (!activeCity) return;

  const currentCityName = document.getElementById("current-city-name");
  const currentCityReason = document.getElementById("current-city-reason");
  const heroCityName = document.getElementById("hero-city-name");
  const heroCityDescription = document.getElementById("hero-city-description");
  const footerCityName = document.getElementById("footer-city-name");

  if (currentCityName) currentCityName.textContent = `${activeCity.name} (${activeCity.state})`;
  if (currentCityReason) currentCityReason.textContent = reason || "Cidade Piloto";
  if (heroCityName) heroCityName.textContent = activeCity.name;
  if (heroCityDescription) heroCityDescription.textContent = activeCity.description;
  if (footerCityName) footerCityName.textContent = activeCity.name;

  renderBairroFilters(activeCity.bairros);
}

function renderBairroFilters(bairros) {
  const container = document.getElementById("bairro-filter");
  if (!container) return;
  container.innerHTML = "";

  bairros.forEach((bairro, index) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `filter-chip ${index === 0 ? 'active' : ''}`;
    chip.textContent = bairro;
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeBairro = bairro;
      filterAndRender();
    });
    container.appendChild(chip);
  });
}

function setupCityModal() {
  const triggerBtn = document.getElementById("city-selector-btn");
  const modal = document.getElementById("modal-city-picker");
  const closeBtn = document.getElementById("modal-city-close");
  const geoBtn = document.getElementById("geo-detect-btn");
  const optionsList = document.getElementById("city-options-list");

  if (triggerBtn && modal) {
    triggerBtn.addEventListener("click", () => {
      renderCityModalOptions();
      openModal(modal);
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => closeModal(modal));
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  }

  // Apenas aciona geolocalização se o usuário clicar explicitamente
  if (geoBtn) {
    geoBtn.addEventListener("click", () => {
      if ("geolocation" in navigator) {
        document.getElementById("current-city-reason").textContent = "Buscando GPS...";
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCity(SUPPORTED_CITIES[0], "📡 Porto Velho (Confirmado por GPS)");
            closeModal(modal);
          },
          () => {
            alert("Não foi possível obter a localização por GPS. Mantida a cidade piloto Porto Velho.");
            closeModal(modal);
          }
        );
      } else {
        alert("Navegador não possui suporte a geolocalização.");
      }
    });
  }

  function renderCityModalOptions() {
    if (!optionsList) return;
    optionsList.innerHTML = "";

    // Porto Velho (Cidade Ativa)
    const cardActive = document.createElement("button");
    cardActive.type = "button";
    cardActive.className = "city-option-card active";
    cardActive.innerHTML = `
      <div class="city-option-name">Porto Velho (RO) ✓</div>
      <div class="city-option-meta">Cidade Piloto do MVP</div>
    `;
    cardActive.addEventListener("click", () => {
      setCity(SUPPORTED_CITIES[0], "📍 Cidade Piloto");
      closeModal(modal);
    });
    optionsList.appendChild(cardActive);

    // Aviso de expansão futura
    const cardFuture = document.createElement("div");
    cardFuture.className = "city-option-card disabled";
    cardFuture.innerHTML = `
      <div class="city-option-name" style="color: var(--text-muted);">Outras Cidades</div>
      <div class="city-option-meta">Expansão planejada para etapas futuras</div>
    `;
    optionsList.appendChild(cardFuture);
  }
}

function filterAndRender() {
  const query = (document.getElementById("search-input")?.value || "").toLowerCase();
  const prototypeBanner = document.getElementById("prototype-banner");
  const controlsSection = document.getElementById("controls-section");
  const grid = document.getElementById("news-grid");

  const filtered = publishedArticles.filter(art => {
    const matchesCity = art.cityId === activeCity.id;
    const matchesBairro = activeBairro === "Todos os Bairros" || art.bairro.toLowerCase() === activeBairro.toLowerCase();
    const matchesQuery = art.title.toLowerCase().includes(query) || art.excerpt.toLowerCase().includes(query);
    return matchesCity && matchesBairro && matchesQuery;
  });

  if (publishedArticles.length === 0) {
    if (prototypeBanner) prototypeBanner.style.display = "block";
    if (controlsSection) controlsSection.style.display = "none";
    if (grid) grid.innerHTML = "";
    return;
  }

  if (prototypeBanner) prototypeBanner.style.display = "none";
  if (controlsSection) controlsSection.style.display = "flex";
  renderArticles(filtered);
}

function renderArticles(articles) {
  const grid = document.getElementById("news-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (articles.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-color);">Nenhuma matéria encontrada.</div>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("article");
    card.className = "news-card";

    const header = document.createElement("div");
    header.className = "card-header";
    
    const tag = document.createElement("span");
    tag.className = "badge-tag";
    tag.textContent = `${article.category} • ${article.bairro}`;

    const date = document.createElement("span");
    date.className = "card-date";
    date.textContent = article.date;

    header.appendChild(tag);
    header.appendChild(date);

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = article.title;

    const excerpt = document.createElement("p");
    excerpt.className = "card-excerpt";
    excerpt.textContent = article.excerpt;

    const meta = document.createElement("div");
    meta.className = "card-metadata";

    const source = document.createElement("span");
    source.className = "source-badge";
    source.textContent = `🏛️ ${article.sourceName}`;

    const btnProv = document.createElement("button");
    btnProv.type = "button";
    btnProv.className = "btn-provenance";
    btnProv.textContent = "Ver Proveniência";
    btnProv.addEventListener("click", () => openProvenanceModal(article.id));

    meta.appendChild(source);
    meta.appendChild(btnProv);

    const topContainer = document.createElement("div");
    topContainer.appendChild(header);
    topContainer.appendChild(title);
    topContainer.appendChild(excerpt);

    card.appendChild(topContainer);
    card.appendChild(meta);

    grid.appendChild(card);
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  if (input) input.addEventListener("input", filterAndRender);
}

function setupModal() {
  const overlay = document.getElementById("modal-provenance");
  const closeBtn = document.getElementById("modal-close");

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => closeModal(overlay));
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  }
}

function openProvenanceModal(articleId) {
  const article = publishedArticles.find(a => a.id === articleId);
  if (!article) return;

  const modal = document.getElementById("modal-provenance");
  const modalContent = document.getElementById("modal-content");
  if (!modalContent || !modal) return;

  modalContent.innerHTML = "";

  const title = document.createElement("h3");
  title.className = "modal-title";
  title.textContent = article.title;

  const contentDiv = document.createElement("div");
  contentDiv.style.marginBottom = "1rem";
  contentDiv.textContent = article.excerpt;

  const hr = document.createElement("hr");
  hr.style.borderColor = "var(--border-color)";
  hr.style.margin = "1.5rem 0";

  const provHeading = document.createElement("h4");
  provHeading.style.color = "var(--accent-cyan)";
  provHeading.style.marginBottom = "0.75rem";
  provHeading.textContent = "🔍 Rastreabilidade Factual (OKF Bundle)";

  const box = document.createElement("div");
  box.className = "provenance-box";

  const fields = [
    ["Cidade", `${activeCity.name} (${activeCity.state})`],
    ["CNPJ", article.cnpj],
    ["CNAE", article.cnae],
    ["Bairro", article.bairro],
    ["Fonte", article.sourceName],
    ["SHA-256 Hash", article.sourceHash]
  ];

  fields.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "provenance-item";
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    item.appendChild(strong);
    item.appendChild(document.createTextNode(value));
    box.appendChild(item);
  });

  modalContent.appendChild(title);
  modalContent.appendChild(contentDiv);
  modalContent.appendChild(hr);
  modalContent.appendChild(provHeading);
  modalContent.appendChild(box);

  openModal(modal);
}

/* ==========================================================================
   ACESSIVILIDADE DOS MODAIS (ESCAPE KEY & TRAP DE FOCUS)
   ========================================================================== */
function openModal(modal) {
  if (!modal) return;
  modal.removeAttribute("hidden");
  modal.classList.add("active");
  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn) closeBtn.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("hidden", "true");
}

function setupKeyboardAccessibility() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.active").forEach(closeModal);
    }
  });
}
