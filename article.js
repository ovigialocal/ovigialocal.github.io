const params = new URLSearchParams(window.location.search);
const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  && params.get("preview") === "article";

const previewArticle = {
  section: "Cidade",
  neighborhood: "Preview local",
  date: "30 ago. 2026",
  title: "Como uma matéria do O Vigia será apresentada",
  deck: "Este texto demonstrativo existe apenas para testar hierarquia, leitura, fontes e correções. Ele não descreve um acontecimento real e não é uma matéria publicada.",
  paragraphs: [
    "Uma página de matéria precisa deixar a leitura acontecer antes de pedir atenção para a infraestrutura que a sustenta. Por isso, o título, a linha fina e o corpo ocupam o eixo principal, enquanto fonte e proveniência permanecem ao alcance sem competir pelo topo da página.",
    "A medida do texto é deliberadamente estreita para leitura contínua. Metadados como editoria, bairro e data aparecem como inscrições de orientação: suficientes para situar o leitor, pequenas o bastante para não disputar a manchete.",
    "O bloco de confiança fica ao lado no desktop e volta ao fluxo normal no celular. A fonte pode ser aberta quando necessária, e o caminho de correções continua visível sem transformar a matéria em um painel técnico.",
    "Quando conteúdo real atravessar o fluxo governado de publicação, este mesmo template receberá os dados publicados. O preview local testa apenas composição e comportamento responsivo."
  ],
  sourceName: "Documento demonstrativo de layout",
  sourceHash: "preview-local/article-template"
};

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value || "";
}

function showShell() {
  document.getElementById("article-empty")?.setAttribute("hidden", "true");
  document.getElementById("article-shell")?.removeAttribute("hidden");
}

function renderPreview() {
  showShell();
  setText("article-section", previewArticle.section);
  setText("article-neighborhood", previewArticle.neighborhood);
  setText("article-date", previewArticle.date);
  setText("article-title", previewArticle.title);
  setText("article-deck", previewArticle.deck);
  setText("article-source", previewArticle.sourceName);
  setText("article-reference", previewArticle.sourceHash);

  const body = document.getElementById("article-body");
  if (body) {
    body.replaceChildren(...previewArticle.paragraphs.map(text => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      return paragraph;
    }));
  }
  document.title = `${previewArticle.title} — O Vigia`;
}

function renderPublishedArticle(article) {
  showShell();
  const previewLabel = document.getElementById("preview-label");
  if (previewLabel) previewLabel.hidden = true;

  setText("article-section", article.category || "Notícia");
  setText("article-neighborhood", article.neighborhood || article.bairro || "Porto Velho");
  const date = document.getElementById("article-date");
  if (date) {
    date.textContent = article.date || "";
    if (article.dateIso) date.dateTime = article.dateIso;
  }
  setText("article-title", article.title);
  setText("article-deck", article.deck || article.excerpt);
  setText("article-reference", article.sourceHash);

  const source = document.getElementById("article-source");
  if (source) {
    source.replaceChildren();
    if (article.sourceUrl) {
      const link = document.createElement("a");
      link.href = article.sourceUrl;
      link.rel = "noopener noreferrer";
      link.textContent = article.sourceName || "Fonte oficial";
      source.appendChild(link);
    } else {
      source.textContent = article.sourceName || "";
    }
  }

  const state = document.querySelector(".provenance-list > div:last-child dd");
  if (state) state.textContent = "Publicado";

  const body = document.getElementById("article-body");
  if (body) body.innerHTML = article.contentHtml || "";

  document.title = `${article.title} — O Vigia`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = article.deck || article.excerpt || "";
}

async function loadPublishedArticle() {
  if (isLocalPreview) {
    renderPreview();
    return;
  }

  const articleId = params.get("id");
  if (!articleId) return;

  try {
    const response = await fetch("articles.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`articles.json: HTTP ${response.status}`);
    const articles = await response.json();
    const article = Array.isArray(articles) ? articles.find(item => item.id === articleId) : null;
    if (article) renderPublishedArticle(article);
  } catch (error) {
    console.error("Não foi possível carregar a matéria publicada.", error);
  }
}

loadPublishedArticle();
