document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("[data-share-button]");
  const status = document.getElementById("share-status");
  if (!button) return;

  button.addEventListener("click", async () => {
    const title = button.dataset.shareTitle || document.title;
    const url = button.dataset.shareUrl || window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        if (status) status.textContent = "Compartilhamento aberto.";
        return;
      }
      await navigator.clipboard.writeText(url);
      if (status) status.textContent = "Link copiado.";
    } catch (error) {
      if (error?.name === "AbortError") return;
      if (status) status.textContent = "Não foi possível copiar automaticamente; use o endereço da página.";
    }
  });
});
