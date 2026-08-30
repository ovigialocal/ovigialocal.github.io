# O Vigia — face pública

Portal público de **O Vigia**, jornalismo local de Porto Velho (RO). Este repositório cuida da superfície estática publicada; a redação e o pipeline editorial vivem separadamente e só entregam conteúdo quando uma matéria atravessa o fluxo governado de publicação.

Enquanto não houver matérias publicadas, a home apresenta explicitamente uma edição vazia. Nenhuma fixture ou matéria demonstrativa deve aparecer como notícia real.

## Revisão visual

Mudanças na face pública podem ser capturadas de forma reproduzível em desktop e mobile:

```bash
npx --yes playwright@1.55.0 install chromium
bash scripts/capture-public-surface.sh
```

As imagens são gravadas em `artifacts/visual/`. Em pull requests que alteram HTML, CSS ou JavaScript, o workflow **Visual capture** executa o mesmo script e publica o artefato `public-surface-capture` com as capturas da home. A execução também falha se a página local não responder ou se nenhuma imagem for produzida.

## Licenciamento

- **Conteúdo jornalístico:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE-CONTENT).
- **Código-fonte do site:** [MIT License](LICENSE-CODE).
