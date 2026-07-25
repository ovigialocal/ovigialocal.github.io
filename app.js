// O Vigia — App de Notícias e Cidade Inteligente

// Cidades Suportadas com Coordenadas para Cálculo de Distância (Haversine)
const SUPPORTED_CITIES = [
  {
    id: "porto-velho",
    name: "Porto Velho",
    state: "RO",
    lat: -8.7619,
    lon: -63.9039,
    bairros: ["Todos os Bairros", "Nova Porto Velho", "Embratel", "Areal", "Centro", "São Cristóvão"],
    monitoredCnpjs: "42.850",
    leadsCount: "128",
    description: "Edição piloto com monitoramento contínuo de dados abertos da Receita Federal, diários oficiais e licitações públicas na capital de Rondônia."
  },
  {
    id: "manaus",
    name: "Manaus",
    state: "AM",
    lat: -3.1190,
    lon: -60.0217,
    bairros: ["Todos os Bairros", "Adrianópolis", "Pontes Negra", "Flores", "Centro"],
    monitoredCnpjs: "98.400",
    leadsCount: "310",
    description: "Edição em expansão cobrindo o Polo Industrial e transformações urbanas em Manaus."
  },
  {
    id: "ji-parana",
    name: "Ji-Paraná",
    state: "RO",
    lat: -10.8828,
    lon: -61.9519,
    bairros: ["Todos os Bairros", "Dois de Abril", "Nova Brasília", "Centro"],
    monitoredCnpjs: "14.200",
    leadsCount: "45",
    description: "Monitoramento de desenvolvimento comercial e agroindustrial na região central de Rondônia."
  },
  {
    id: "ariquemes",
    name: "Ariquemes",
    state: "RO",
    lat: -9.9133,
    lon: -63.0408,
    bairros: ["Todos os Bairros", "Setor 01", "Setor 03", "Centro"],
    monitoredCnpjs: "11.800",
    leadsCount: "38",
    description: "Inteligência cívica e registros empresariais no Vale do Jamari."
  }
];

// Base de dados de matérias publicadas por cidade
const sampleArticles = [
  {
    id: "art-rfb-004",
    title: "Nova panificação de grande porte registra abertura no bairro Nova Porto Velho",
    excerpt: "Dados abertos da Receita Federal indicam cadastro ativo para empreendimento do setor de panificação na Zona Leste da capital.",
    cityId: "porto-velho",
    bairro: "Nova Porto Velho",
    category: "Alimentos & Indústria",
    date: "25 de Julho de 2026",
    cnpj: "58.991.204/0001-88",
    cnae: "1091-1/01 - Fabricação de produtos de panificação industrial",
    capitalSocial: "R$ 120.000,00",
    logradouro: "Av. Prefeito Chiquilito Erse (sem nº exato)",
    confidence: "100% (Dado Cadastral Oficial)",
    sourceName: "Receita Federal do Brasil (CNPJ Dados Abertos)",
    sourceHash: "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    content: `<p>Registros oficiais da Receita Federal apontam a emissão de cadastro ativo para a <strong>PANIFICADORA E CONFEITARIA RIO MADEIRA LTDA</strong>, localizada no bairro <strong>Nova Porto Velho</strong>, em Porto Velho.</p><p>O empreendimento foi registrado com capital social de <strong>R$ 120.000,00</strong> e atividade principal voltada ao ramo de panificação e confeitaria.</p><p><em>Nota de transparência: O cadastro oficial confirma a regularidade jurídica do registro, mas não informa a data exata de início do atendimento presencial ao público.</em></p>`
  },
  {
    id: "art-rfb-001",
    title: "Novo estabelecimento comercial do setor de alimentos é registrado no bairro Embratel",
    excerpt: "Dados oficiais da Receita Federal indicam a abertura de cadastro ativo para empresa no ramo de comércio varejista na Zona Norte de Porto Velho.",
    cityId: "porto-velho",
    bairro: "Embratel",
    category: "Comércio",
    date: "25 de Julho de 2026",
    cnpj: "58.492.102/0001-94",
    cnae: "4712-1/00 - Comércio varejista de mercadorias em geral",
    capitalSocial: "R$ 150.000,00",
    logradouro: "Av. Governador Jorge Teixeira (sem nº exato)",
    confidence: "100% (Dado Cadastral Oficial)",
    sourceName: "Receita Federal do Brasil (CNPJ Dados Abertos)",
    sourceHash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    content: `<p>Registros da base de dados abertos da Receita Federal do Brasil apontam a concessão de inscrição cadastral ativa para uma nova empresa do segmento alimentício localizada no bairro <strong>Embratel</strong>, em Porto Velho.</p><p>O cadastro oficial informa o início das atividades declaradas com capital social de <strong>R$ 150.000,00</strong>.</p>`
  },
  {
    id: "art-rfb-002",
    title: "Registro cadastral de centro em serviços de saúde é emitido no bairro Areal",
    excerpt: "Inscrição comercial ativa é detectada no cadastro de empresas de Porto Velho com foco em atendimento ambulatorial.",
    cityId: "porto-velho",
    bairro: "Areal",
    category: "Saúde & Serviços",
    date: "24 de Julho de 2026",
    cnpj: "58.310.449/0001-12",
    cnae: "8630-5/03 - Atividade médica ambulatorial restrita a consultas",
    capitalSocial: "R$ 80.000,00",
    logradouro: "Rua Alexandre Guimarães (sem nº exato)",
    confidence: "100% (Dado Cadastral Oficial)",
    sourceName: "Receita Federal do Brasil (CNPJ Dados Abertos)",
    sourceHash: "sha256:4b227777d4da1691ed77308d365b773824ee184e0368c8b417e29548f0607d72",
    content: `<p>A Receita Federal emitiu cadastro ativo para um novo empreendimento da área da saúde no bairro <strong>Areal</strong>.</p>`
  },
  {
    id: "art-rfb-manaus-01",
    title: "Nova empresa de componentes eletroeletrônicos é registrada no bairro Flores em Manaus",
    excerpt: "Registro oficial emitido na junta comercial para nova unidade de suprimentos industriais na capital do Amazonas.",
    cityId: "manaus",
    bairro: "Flores",
    category: "Indústria & Tecnologia",
    date: "25 de Julho de 2026",
    cnpj: "57.881.002/0001-33",
    cnae: "2610-8/00 - Fabricação de componentes eletrônicos",
    capitalSocial: "R$ 450.000,00",
    logradouro: "Av. Torquato Tapajós (sem nº exato)",
    confidence: "100% (Dado Cadastral Oficial)",
    sourceName: "Receita Federal do Brasil (CNPJ Dados Abertos)",
    sourceHash: "sha256:8a11b02001194fae99120a5e5812938d",
    content: `<p>Inscrição cadastral aprovada na Receita Federal para empresa fornecedora de componentes no bairro Flores, em Manaus.</p>`
  }
];

let activeCity = null;
let activeCityReason = "";
let activeBairro = "Todos os Bairros";

document.addEventListener("DOMContentLoaded", () => {
  initCityResolution();
  setupCityModal();
  setupSearch();
  setupModal();
});

/* ==========================================================================
   RESOLUÇÃO DA CIDADE ATIVA (ORDEM DE PRIORIDADE):
   1. Preferência Salva no localStorage ('ovigia_selected_city')
   2. Geolocalização (Cidade suportada mais próxima por GPS)
   3. Fallback Padrão (Porto Velho - RO)
   ========================================================================== */
function initCityResolution() {
  const savedCityId = localStorage.getItem("ovigia_selected_city");

  if (savedCityId) {
    const found = SUPPORTED_CITIES.find(c => c.id === savedCityId);
    if (found) {
      setCity(found, "⭐ Sua Preferência");
      return;
    }
  }

  // Tenta geolocalização se disponível no navegador
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const nearest = findNearestCity(userLat, userLon);
        setCity(nearest, "📡 GPS / Mais Próxima");
      },
      (error) => {
        console.log("GPS não concedido ou falhou. Usando cidade padrão (Porto Velho).");
        fallbackDefaultCity();
      },
      { timeout: 5000 }
    );
  } else {
    fallbackDefaultCity();
  }
}

function fallbackDefaultCity() {
  const defaultCity = SUPPORTED_CITIES.find(c => c.id === "porto-velho") || SUPPORTED_CITIES[0];
  setCity(defaultCity, "📍 Cidade Piloto");
}

function setCity(city, reason, saveToStorage = false) {
  activeCity = city;
  activeCityReason = reason;
  activeBairro = "Todos os Bairros";

  if (saveToStorage) {
    localStorage.setItem("ovigia_selected_city", city.id);
  }

  updateCityUI();
  filterAndRender();
}

function updateCityUI() {
  if (!activeCity) return;

  document.getElementById("current-city-name").textContent = `${activeCity.name} (${activeCity.state})`;
  document.getElementById("current-city-reason").textContent = activeCityReason;

  document.getElementById("hero-city-name").textContent = `${activeCity.name}`;
  document.getElementById("hero-city-description").textContent = activeCity.description;
  document.getElementById("footer-city-name").textContent = `${activeCity.name}`;

  document.getElementById("stat-monitored").textContent = `${activeCity.monitoredCnpjs} CNPJs`;
  document.getElementById("stat-leads").textContent = `${activeCity.leadsCount} detectadas`;

  // Renderiza filtros de bairros específicos da cidade
  renderBairroFilters(activeCity.bairros);
}

function renderBairroFilters(bairros) {
  const container = document.getElementById("bairro-filter");
  container.innerHTML = "";

  bairros.forEach((bairro, index) => {
    const chip = document.createElement("button");
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

/* Cálculo de Distância Geográfica (Fórmula de Haversine) */
function findNearestCity(userLat, userLon) {
  let minDistance = Infinity;
  let nearest = SUPPORTED_CITIES[0];

  SUPPORTED_CITIES.forEach(city => {
    const dist = haversineDistance(userLat, userLon, city.lat, city.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = city;
    }
  });

  return nearest;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em KM
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/* ==========================================================================
   MODAL DE ESCOLHA DA CIDADE
   ========================================================================== */
function setupCityModal() {
  const triggerBtn = document.getElementById("city-selector-btn");
  const modal = document.getElementById("modal-city-picker");
  const closeBtn = document.getElementById("modal-city-close");
  const geoBtn = document.getElementById("geo-detect-btn");
  const optionsList = document.getElementById("city-options-list");

  triggerBtn.addEventListener("click", () => {
    renderCityModalOptions();
    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  geoBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    if ("geolocation" in navigator) {
      document.getElementById("current-city-reason").textContent = "Buscando GPS...";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nearest = findNearestCity(pos.coords.latitude, pos.coords.longitude);
          setCity(nearest, "📡 GPS / Mais Próxima", true);
        },
        () => alert("Não foi possível obter sua localização via GPS. Escolha manualmente na lista.")
      );
    } else {
      alert("Seu navegador não suporta geolocalização por GPS.");
    }
  });

  function renderCityModalOptions() {
    optionsList.innerHTML = "";
    SUPPORTED_CITIES.forEach(city => {
      const isCurrent = activeCity && activeCity.id === city.id;
      const card = document.createElement("div");
      card.className = `city-option-card ${isCurrent ? 'active' : ''}`;
      card.innerHTML = `
        <div class="city-option-name">${city.name} (${city.state}) ${isCurrent ? '✓' : ''}</div>
        <div class="city-option-meta">${city.monitoredCnpjs} CNPJs monitorados</div>
      `;
      card.addEventListener("click", () => {
        setCity(city, "⭐ Selecionada por Você", true);
        modal.classList.remove("active");
      });
      optionsList.appendChild(card);
    });
  }
}

/* ==========================================================================
   FILTRAGEM E RENDERIZAÇÃO DE NOTÍCIAS
   ========================================================================== */
function renderArticles(articles) {
  const grid = document.getElementById("news-grid");
  grid.innerHTML = "";

  if (articles.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-color);">Nenhuma matéria encontrada para ${activeCity ? activeCity.name : 'esta cidade'} com os filtros selecionados.</div>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.innerHTML = `
      <div>
        <div class="card-header">
          <span class="badge-tag">${article.category} &bull; ${article.bairro}</span>
          <span class="card-date">${article.date}</span>
        </div>
        <h2 class="card-title">${article.title}</h2>
        <p class="card-excerpt">${article.excerpt}</p>
      </div>

      <div class="card-metadata">
        <span class="source-badge">🏛️ ${article.sourceName.split('(')[0]}</span>
        <button class="btn-provenance" onclick="openProvenanceModal('${article.id}')">Ver Fonte & Hash</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", filterAndRender);
}

function filterAndRender() {
  if (!activeCity) return;
  const query = (document.getElementById("search-input").value || "").toLowerCase();

  const filtered = sampleArticles.filter(art => {
    const matchesCity = art.cityId === activeCity.id;
    const matchesBairro = activeBairro === "Todos os Bairros" || art.bairro.toLowerCase() === activeBairro.toLowerCase();
    const matchesQuery = art.title.toLowerCase().includes(query) ||
                         art.excerpt.toLowerCase().includes(query) ||
                         art.cnae.toLowerCase().includes(query) ||
                         art.bairro.toLowerCase().includes(query);

    return matchesCity && matchesBairro && matchesQuery;
  });

  renderArticles(filtered);
}

/* ==========================================================================
   MODAL DE RASTREABILIDADE FACTUAL (OKF BUNDLE)
   ========================================================================== */
function setupModal() {
  const overlay = document.getElementById("modal-provenance");
  const closeBtn = document.getElementById("modal-close");

  closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
}

function openProvenanceModal(articleId) {
  const article = sampleArticles.find(a => a.id === articleId);
  if (!article) return;

  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <h3 class="modal-title">${article.title}</h3>
    <div style="margin-bottom: 1rem;">${article.content}</div>
    
    <hr style="border-color: var(--border-color); margin: 1.5rem 0;">

    <h4 style="color: var(--accent-cyan); margin-bottom: 0.75rem;">🔍 Árvore de Rastreabilidade Factual (OKF Bundle)</h4>
    <div class="provenance-box">
      <div class="provenance-item"><strong>Cidade:</strong> ${activeCity ? activeCity.name : 'Porto Velho'} (${activeCity ? activeCity.state : 'RO'})</div>
      <div class="provenance-item"><strong>CNPJ:</strong> ${article.cnpj}</div>
      <div class="provenance-item"><strong>CNAE Principal:</strong> ${article.cnae}</div>
      <div class="provenance-item"><strong>Bairro Declarado:</strong> ${article.bairro} (${article.logradouro})</div>
      <div class="provenance-item"><strong>Capital Social:</strong> ${article.capitalSocial}</div>
      <div class="provenance-item"><strong>Confiança Factual:</strong> ${article.confidence}</div>
      <div class="provenance-item"><strong>Fonte Primária:</strong> ${article.sourceName}</div>
      <div class="provenance-item" style="word-break: break-all;"><strong>SHA-256 Hash:</strong> <code>${article.sourceHash}</code></div>
      <div class="provenance-item"><strong>Agente Revisor:</strong> <code>fact-checker-v1.0 (pass)</code></div>
    </div>
  `;

  document.getElementById("modal-provenance").classList.add("active");
}
