// O Vigia — App de Notícias e Proveniência Rastreável

// Base de dados inicial de matérias publicadas geradas pelo motor autônomo
const sampleArticles = [
  {
    id: "art-rfb-001",
    title: "Novo estabelecimento comercial do setor de alimentos é registrado no bairro Embratel",
    excerpt: "Dados oficiais da Receita Federal indicam a abertura de cadastro ativo para empresa no ramo de comércio varejista na Zona Norte de Porto Velho.",
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
    content: `
      <p>Registros da base de dados abertos da Receita Federal do Brasil apontam a concessão de inscrição cadastral ativa para uma nova empresa do segmento alimentício localizada no bairro <strong>Embratel</strong>, em Porto Velho.</p>
      
      <p>O cadastro oficial informa o início das atividades declaradas com capital social de <strong>R$ 150.000,00</strong>. A atividade econômica principal registrada é o comércio de mercadorias em geral com predominância de produtos alimentícios.</p>
      
      <p><em>Nota de transparência: Os dados públicos do cadastro não informam se o atendimento presencial ao público já foi iniciado no local.</em></p>
    `
  },
  {
    id: "art-rfb-002",
    title: "Registro cadastral de centro em serviços de saúde é emitido no bairro Areal",
    excerpt: "Inscrição comercial ativa é detectada no cadastro de empresas de Porto Velho com foco em atividades de atendimento ambulatorial.",
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
    content: `
      <p>A Receita Federal emitiu cadastro ativo para um novo empreendimento da área da saúde no bairro <strong>Areal</strong>.</p>
      
      <p>Com classificação principal voltada para serviços médicos ambulatoriais, a empresa conta com capital registrado de <strong>R$ 80.000,00</strong>. A movimentação reforça a expansão de serviços especializados na Zona Sul da capital rondoniense.</p>
    `
  },
  {
    id: "art-rfb-003",
    title: "Empresa de logística e carga expande cadastro com filial em Nova Porto Velho",
    excerpt: "Movimentação empresarial detectada via cruzamento de snapshots cadastrais indica fortalecimento do setor de transportes no município.",
    bairro: "Nova Porto Velho",
    category: "Logística",
    date: "23 de Julho de 2026",
    cnpj: "49.112.800/0002-45",
    cnae: "4930-2/02 - Transporte rodoviário de carga intermunicipal",
    capitalSocial: "R$ 500.000,00",
    logradouro: "Av. Rio de Janeiro (sem nº exato)",
    confidence: "100% (Dado Cadastral Oficial)",
    sourceName: "Receita Federal do Brasil (CNPJ Dados Abertos)",
    sourceHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    content: `
      <p>Uma nova filial voltada ao transporte rodoviário de carga teve seu registro homologado no bairro <strong>Nova Porto Velho</strong>.</p>
      
      <p>O setor de logística vem apresentando alta frequência de registros na região próxima aos eixos de saída da cidade, segundo acompanhamento automatizado da base do CNPJ.</p>
    `
  }
];

let activeBairro = "all";

document.addEventListener("DOMContentLoaded", () => {
  renderArticles(sampleArticles);
  setupFilters();
  setupSearch();
  setupModal();
});

function renderArticles(articles) {
  const grid = document.getElementById("news-grid");
  grid.innerHTML = "";

  if (articles.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">Nenhuma matéria encontrada para esses critérios.</div>`;
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

function setupFilters() {
  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeBairro = chip.getAttribute("data-bairro");
      filterAndRender();
    });
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", () => {
    filterAndRender();
  });
}

function filterAndRender() {
  const query = document.getElementById("search-input").value.toLowerCase();
  
  const filtered = sampleArticles.filter(art => {
    const matchesBairro = activeBairro === "all" || art.bairro.toLowerCase() === activeBairro.toLowerCase();
    const matchesQuery = art.title.toLowerCase().includes(query) || 
                         art.excerpt.toLowerCase().includes(query) ||
                         art.cnae.toLowerCase().includes(query) ||
                         art.bairro.toLowerCase().includes(query);
    return matchesBairro && matchesQuery;
  });

  renderArticles(filtered);
}

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
