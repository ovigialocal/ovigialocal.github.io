// Preview editorial estritamente local: nenhum conteúdo demonstrativo é publicado como notícia.
const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  && new URLSearchParams(window.location.search).get("preview") === "article";

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
  source: "Documento demonstrativo de layout",
  reference: "preview-local/article-template"
};

function populatePreview() {
  document.getElementById("article-empty")?.setAttribute("hidden", "true");
  const shell = document.getElementById("article-shell");
  shell?.removeAttribute("hidden");

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  setText("article-section", previewArticle.section);
  setText("article-neighborhood", previewArticle.neighborhood);
  setText("article-date", previewArticle.date);
  setText("article-title", previewArticle.title);
  setText("article-deck", previewArticle.deck);
  setText("article-source", previewArticle.source);
  setText("article-reference", previewArticle.reference);

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

if (isLocalPreview) populatePreview();
