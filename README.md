# O Vigia — Portal Público (Protótipo em Desenvolvimento)

> **Cidade-Piloto:** Porto Velho, Rondônia  
> **Organização GitHub:** [`ovigialocal`](https://github.com/ovigialocal)  
> **Repositório Canônico:** [`ovigialocal/ovigialocal.github.io`](https://github.com/ovigialocal/ovigialocal.github.io)  
> **URL Pública:** [https://ovigialocal.github.io](https://ovigialocal.github.io)  

---

## ⚠️ Status do Projeto

Este repositório é a **face pública** do protótipo **O Vigia**.

- **Fase Atual:** Protótipo em desenvolvimento.
- **Fonte Única em Implementação:** Dados abertos do CNPJ da Receita Federal do Brasil (RFB) filtrados exclusivamente para o município de Porto Velho (RO).
- **Invariante Factual:** Nenhuma matéria demonstrativa é apresentada como fato real. Todo conteúdo publicado pelo pipeline necessita passar por checagem e revisão factual estrita antes de ser exibido.

---

## Captura visual reproduzível

Mudanças de interface podem gerar evidência visual da home em dois tamanhos: desktop (1440×1200) e mobile (390×844). O mesmo teste também funciona como smoke: ele exige resposta HTTP bem-sucedida, `body` visível e um `h1` renderizado.

Localmente:

```bash
npm install
npx playwright install chromium
npm run capture
```

As imagens são gravadas em `artifacts/visual/`. Em pull requests que alteram HTML, CSS, JavaScript ou a própria infraestrutura de captura, o workflow **Visual Capture** executa o mesmo teste e publica as imagens como artefato `visual-capture`.

---

## 📄 Licenciamento

- **Conteúdo Jornalístico:** Licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE-CONTENT).
- **Código-Fonte do Site:** Licensed under [MIT License](LICENSE-CODE).
