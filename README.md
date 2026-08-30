# O Vigia — face pública

Portal público de **O Vigia**, jornalismo local de Porto Velho (RO). Este repositório é a autoridade sobre o que efetivamente é publicado e sobre a superfície estática servida ao leitor.

A redação vive separadamente em `franklinbaldo/ovigia-redacao` e termina em `article-ready`. Uma matéria pronta **não é sincronizada automaticamente** para cá. Um agente de publicação deste repositório consulta as candidatas por pull, lê a versão exata e decide independentemente se a aceita sob a marca pública de O Vigia.

```text
ovigia-redacao: article-ready
          ↓
publication-review
     /          \
 accept        reject
   ↓              ↓
Markdown aqui   issue na redação
   ↓
site estático / GitHub Pages
```

Se rejeitar, o agente não edita a candidata privada: abre uma issue com digest, findings, evidências e trabalho necessário. A redação produz uma nova versão e um novo digest. Se aceitar, o corpo editorial aprovado é copiado para este repositório, recebe somente metadados de publicação e passa a ser fonte da projeção pública.

Leia:

- [`docs/rfc/0001-independent-publication-agent.md`](docs/rfc/0001-independent-publication-agent.md) — fronteira institucional e protocolo completo;
- [`skills/publication-review/SKILL.md`](skills/publication-review/SKILL.md) — procedimento executável do agente publicador;
- [`AGENTS.md`](AGENTS.md) — contrato curto para agentes que trabalham neste repositório.

Enquanto não houver matérias publicadas, a home apresenta explicitamente uma edição vazia. Nenhuma fixture ou matéria demonstrativa deve aparecer como notícia real.

## Conteúdo canônico e projeção

A direção arquitetural é manter matérias aceitas como **Markdown canônico versionado neste repositório** e tratar HTML, `articles.json`, feed e sitemap como projeções públicas derivadas. A migração da implementação atual pode ser incremental; esta RFC primeiro estabelece a autoridade e o protocolo.

O site permanece **static-first** e hospedável por GitHub Pages. Cobogó continua sendo a referência da gramática visual compartilhada quando aplicável.

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
