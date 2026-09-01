# RFC 0002 — Superfície editorial de O Vigia sobre Cobogó

Status: Em revisão  
Data: 1 de setembro de 2026  
Épica: #39

## 1. Decisão

O Vigia adotará **Cobogó como autoridade compartilhada de foundations web**, sem transformar Cobogó em framework de jornal e sem terceirizar para o design system decisões editoriais próprias do produto.

A arquitetura visual passa a obedecer esta ordem:

```text
Cobogó core / contracts compartilhados
        ↓
tema e mapeamentos próprios de O Vigia
        ↓
composição editorial própria de O Vigia
        ↓
superfícies: capa, editorias, matéria, metodologia, correções
```

A meta não é fazer O Vigia “parecer Cobogó”. A meta é parar de manter localmente foundations genéricas que já têm autoridade compartilhada e usar essa base para construir uma identidade jornalística própria, mais madura e mais coerente.

Esta RFC é também o **plano vivo de implementação** da transformação visual e de produto iniciada na épica #39. Cada PR relevante deve declarar qual fase/critério desta RFC implementa e atualizar o status quando uma decisão material mudar.

## 2. Princípio editorial de produto

O Vigia é um jornal local cuja confiança nasce da possibilidade de verificar a sustentação factual de suas matérias.

Não existe uma fonte privilegiada por fornecedor. Uma matéria pode nascer de prefeitura, governo estadual, Diário Oficial, IBGE, tribunal de contas, universidade, base pública, documento, conjunto de dados ou outra fonte adequada, desde que as afirmações publicadas sejam sustentáveis pela evidência disponível e essa sustentação seja recuperável pelo leitor.

A UI deve tornar essa confiança legível sem transformar o jornal em dashboard de auditoria.

Em termos de experiência:

> primeiro jornal; depois transparência técnica progressivamente disponível.

## 3. Problema atual

A superfície atual já possui boa direção inicial — papel quente, tinta escura, serifas, regras e contraste entre manchete/itens secundários —, mas ainda não opera como um sistema editorial completo.

Os principais limites são:

1. O Vigia mantém um mini-sistema de foundations próprio em CSS, apesar de Cobogó existir precisamente para compartilhar esse tipo de contrato.
2. A capa é uma lista única de artigos cuja hierarquia é majoritariamente derivada da posição do item (`lead`, `secondary`, `brief`).
3. A barra de editorias ainda funciona mais como decoração do que como arquitetura real de navegação.
4. A experiência é quase toda tipográfica e não possui contrato maduro para foto, gráfico, mapa ou documento editorial.
5. A página de matéria ainda não oferece toda a continuidade esperada de um jornal: contexto editorial, relacionados, compartilhamento, atualização, navegação por editoria/território.
6. O mobile é principalmente a composição desktop empilhada em uma coluna.
7. Metodologia e outras páginas institucionais ainda carregam identidade/estrutura legadas e linguagem de protótipo.
8. Conteúdo essencial ainda depende excessivamente de JavaScript para ser materializado na superfície pública.

## 4. Fronteira de autoridade

### 4.1 Cobogó deve possuir

Cobogó é candidato natural a autoridade sobre relações genéricas e reutilizáveis, como:

- baseline semântico e tipográfico genérico;
- roles/tokens compartilhados de superfície, texto, foco e estado;
- `focus-visible` e contratos genéricos de acessibilidade;
- reduced motion;
- comportamento estrutural genérico de elementos HTML semânticos;
- padrões reutilizáveis de `figure`/`figcaption`, inscrição, provenance mark ou outros elementos quando houver evidência de uso além de O Vigia;
- contracts de foundation que possam ser consumidos sem impor identidade visual ou skeleton de página.

O Vigia deve consumir essas relações de forma pinada/reproduzível e não copiar/editar localmente a authority compartilhada.

### 4.2 O Vigia deve possuir

Continuam locais e deliberadamente fora do Cobogó:

- marca O Vigia e identidade jornalística;
- paleta final/tema quando específica do produto;
- escolhas tipográficas editoriais próprias;
- densidade e ritmo de capa;
- composição da manchete;
- módulos de secundárias, últimas, briefs, serviço e acompanhamento;
- ordem editorial entre matérias;
- taxonomia de editorias, assuntos e bairros;
- regras de mídia jornalística;
- página de matéria enquanto produto editorial;
- semântica de publicação, atualização, correção e retirada;
- SEO, canonical, feed, sitemap e runtime/build;
- critérios editoriais de mobile;
- linguagem de metodologia e confiança.

### 4.3 Regra de promoção upstream

Não criar antecipadamente em Cobogó componentes como `HeadlineCard`, `NewsRail`, `NewspaperMasthead` ou equivalentes apenas porque O Vigia precisa deles.

O fluxo é:

```text
necessidade aparece no Vigia
   ↓
implementação local semanticamente limpa
   ↓
uso real demonstra relação não jornal-específica
   ↓
extração upstream para Cobogó
   ↓
Vigia passa a consumir a authority compartilhada
```

Só sobe o que continuar fazendo sentido quando o substantivo “notícia” for substituído por outro conteúdo público/cívico.

## 5. Estratégia de adoção do Cobogó

A migração seguirá o padrão brownfield já estabelecido pelo próprio Cobogó.

### 5.1 Classificar antes de importar

Inventariar o CSS atual e marcar cada contrato como:

- `shared-foundation` — pode ser propriedade do Cobogó;
- `vigia-theme` — valor de identidade local;
- `vigia-editorial` — composição/semântica jornalística;
- `compatibility` — ponte temporária necessária;
- `delete` — duplicação/histórico sem função atual.

### 5.2 Adotar em uma superfície real

A primeira superfície de pressão será a **home pública real**, não um demo.

A adoção deve comparar antes/depois com o mesmo conteúdo publicado.

### 5.3 Ordem das camadas

Obrigatória:

```text
Cobogó core
→ mapeamento/tema de O Vigia
→ composição editorial local
```

Não patchar uma cópia vendorizada do Cobogó para “fazer caber” O Vigia.

Se o comportamento é genérico e falta upstream, corrige-se Cobogó.
Se é identidade/produto, fica downstream.

### 5.4 Evidência mínima de adoção

A primeira PR de adoção só conta como adoção real se:

- a authority compartilhada estiver pinada/reproduzível;
- a ordem das camadas estiver explícita;
- duplicação genérica local tiver sido de fato removida;
- a home real continuar funcional;
- houver comparação visual reproduzível antes/depois;
- acessibilidade e comportamento essencial não regridam;
- a PR liste explicitamente o que permaneceu local.

## 6. Arquitetura da capa

A capa não será mais modelada como “uma grade de cards de tamanhos diferentes”.

Ela será uma composição editorial por módulos independentes e recombináveis.

Módulos previstos:

- **manchete** — matéria de maior prioridade editorial, com ou sem mídia;
- **secundárias** — conjunto menor de histórias de alta prioridade;
- **últimas** — recência e alta densidade;
- **editorias** — blocos temáticos conforme acervo real;
- **serviço** — conteúdo que pede ação ou atenção prática;
- **acompanhe** — temas ainda abertos com próximo marco verificável;
- **briefs/notas** — chamadas curtas para ampliar cobertura sem homogeneizar a página;
- **território/bairros** — quando houver massa editorial suficiente.

A composição precisa funcionar com 3, 6, 12 ou mais matérias sem inventar conteúdo nem produzir buracos artificiais.

A importância editorial não pode depender exclusivamente da posição no array.

Issue principal: #40.

## 7. Arquitetura de informação

Editorias, assuntos, bairros e arquivo passam a ser rotas/estruturas reais quando justificadas por conteúdo, não apenas rótulos visuais.

Regras:

- taxonomia derivada do conteúdo real;
- sem listas hardcoded que divergem do acervo;
- uma matéria estadual relevante para Porto Velho não precisa receber bairro fictício;
- links de editoria/território devem existir na capa e na matéria;
- “últimas” e arquivo devem suportar crescimento do acervo;
- URLs devem ser estáveis e compartilháveis.

Issues principais: #41 e #47.

## 8. Mídia editorial

O Vigia deve continuar funcionando bem sem imagens, mas passa a suportar mídia quando ela acrescentar informação.

Tipos iniciais:

- fotografia documental;
- imagem oficial relevante;
- gráfico/visualização de dados;
- mapa;
- recorte ou documento primário.

Metadados mínimos, quando aplicáveis:

- origem/URL ou artefato verificável;
- autoria/crédito;
- licença/permissão;
- legenda factual;
- texto alternativo;
- relação clara com a matéria;
- dimensões para layout estável.

Imagem decorativa/stock usada apenas para “dar cara de jornal” não é objetivo.

A parte genérica de apresentação de `figure`/`figcaption` pode virar upstream do Cobogó se a implementação provar reutilização além de notícia.

Issue principal: #42.

## 9. Página de matéria

Uma matéria aberta por URL direta deve se sustentar como página completa de jornal.

Elementos esperados:

- editoria e território navegáveis;
- publicação e atualização quando houver;
- autoria institucional sem inventar pessoa física;
- título e linha fina;
- corpo editorial de leitura confortável;
- mídia com legenda/crédito;
- fonte principal visível;
- fontes adicionais/proveniência em disclosure progressivo;
- correções/estado quando aplicável;
- compartilhamento usando URL canônica;
- relacionados ou continuação do assunto;
- retorno útil para editoria/capa.

Hash/digest é detalhe auditável, não linguagem primária de confiança.

Issue principal: #43.

## 10. Mobile

Mobile é uma edição própria da mesma decisão editorial, não apenas desktop em uma coluna.

Invariantes:

- a manchete permanece dominante no primeiro viewport;
- a ordem editorial sobrevive ao reflow;
- últimas/serviço não exigem rolagem desproporcional;
- metadata é compacta, não ausente;
- títulos não consomem múltiplas telas sem necessidade;
- navegação territorial/editorial continua acessível;
- mídia não domina a leitura;
- fonte ampliada e teclado/foco continuam válidos.

Issue principal: #45.

## 11. Publicação estática e distribuição

Conteúdo essencial deve estar presente no HTML entregue.

O build deve materializar:

- homepage com conteúdo real;
- URL canônica por matéria;
- `<title>` e description específicos;
- Open Graph/social metadata;
- canonical;
- dados estruturados quando aplicáveis;
- feed e sitemap derivados da mesma fonte pública canônica.

JavaScript deve atuar como melhoria progressiva para busca, filtros e disclosure, não como requisito para o jornal existir.

Issue principal: #46.

## 12. Confiança, metodologia e correções

A metodologia pública deve explicar um modelo baseado em **fontes verificáveis**, sem amarrar a missão a um fornecedor ou base específica.

A UI de confiança deve priorizar:

1. nome da fonte;
2. link/artefato verificável;
3. contexto de verificação relevante;
4. correções/atualizações;
5. digest/hash como detalhe técnico de auditoria.

Documentos oficiais são fontes, não verdade automática. A redação continua responsável por distinguir fato documentado, interpretação, inferência e incerteza.

Issue principal: #44.

## 13. Qualidade visual e acessibilidade

A transformação não termina quando “fica bonito”.

Cada fase visual relevante deve preservar ou melhorar:

- landmarks e headings;
- teclado e foco;
- contraste;
- zoom/fonte ampliada;
- alt/legendas;
- estabilidade de layout;
- ausência de overflow involuntário;
- performance compatível com jornal leve;
- conteúdo essencial sem JS;
- evidência visual reproduzível de desktop e mobile.

Contratos genéricos de acessibilidade pertencem ao Cobogó quando compartilháveis. Critérios editoriais como dominância de manchete ou ordem de módulos pertencem ao Vigia.

Issue principal: #50.

## 14. Fases de implementação

### Fase 0 — RFC e fronteira de autoridade

- [x] registrar a decisão Cobogó × Vigia;
- [x] mapear backlog inicial #40–#50;
- [ ] integrar esta RFC em `main`;
- [ ] ajustar issues que ainda tratem O Vigia como dono de um design system próprio.

### Fase 1 — Foundation brownfield Cobogó

Issue âncora: #48.

- [ ] inventário de contracts CSS locais;
- [ ] classificar shared/theme/editorial/compat/delete;
- [ ] adotar `cobogo/core` pinado;
- [ ] remover duplicação genericamente substituída;
- [ ] registrar remainder local;
- [ ] captura before/after da home real;
- [ ] ratchet mínimo para evitar retorno da duplicação.

### Fase 2 — HTML público e shell

Issues: #46, #41, #47.

- [ ] conteúdo essencial estático no HTML;
- [ ] URLs canônicas;
- [ ] masthead compartilhado entre superfícies;
- [ ] navegação real por editoria/território;
- [ ] taxonomia e arquivo estáveis.

### Fase 3 — Capa editorial

Issue: #40.

- [ ] introduzir modelo de composição que não dependa só do índice;
- [ ] manchete + secundárias + últimas;
- [ ] módulos de editoria/briefs;
- [ ] estados para poucos/muitos artigos;
- [ ] validar desktop e mobile.

### Fase 4 — Mídia e matéria

Issues: #42 e #43.

- [ ] contrato de mídia;
- [ ] figura/legenda/crédito/origem;
- [ ] matéria completa;
- [ ] relacionados/continuidade;
- [ ] compartilhamento/canonical;
- [ ] avaliar extrações genéricas para Cobogó.

### Fase 5 — Mobile e utilidade local

Issues: #45 e #49.

- [ ] composição mobile deliberada;
- [ ] módulos de serviço;
- [ ] agenda/próximos marcos quando verificáveis;
- [ ] acompanhamento de histórias abertas.

### Fase 6 — Confiança e gate de excelência

Issues: #44 e #50.

- [ ] metodologia revisada;
- [ ] provenance legível;
- [ ] gate visual/acessibilidade/performance;
- [ ] eliminar linguagem residual de protótipo;
- [ ] auditoria final contra critérios desta RFC.

## 15. Política de PRs

A implementação deve ocorrer em PRs pequenas e cumulativas.

Cada PR desta iniciativa deve incluir no corpo:

```text
RFC-0002 phase: <n>
RFC-0002 criteria: <itens implementados>
Parent: #39
Issues: #...
```

Se a PR alterar uma decisão estrutural desta RFC, ela deve atualizar o documento no mesmo PR ou em uma PR de RFC imediatamente anterior.

Se apenas executar um critério já decidido, a RFC não precisa receber edição cosmética para cada commit.

## 16. Não objetivos

Esta RFC não propõe:

- transformar Cobogó em CMS ou framework jornalístico;
- introduzir Svelte/Astro no Vigia apenas para consumir Cobogó;
- imitar visualmente um veículo existente;
- usar imagem decorativa para simular aparência de jornal;
- centralizar no Cobogó semântica de notícia/editoria/bairro;
- mover decisão editorial para o design system;
- criar backend permanente para resolver a UI;
- abandonar a simplicidade de hospedagem estática no GitHub Pages.

## 17. Critério de conclusão

A RFC pode ser marcada como Implementada quando:

1. O Vigia consumir Cobogó como foundation compartilhada sem fork local da authority adotada;
2. a home for reconhecível como composição de jornal, não como grade de cards;
3. editorias/territórios forem arquitetura navegável;
4. matéria direta for uma experiência completa;
5. mídia verificável tiver contrato claro;
6. mobile tiver composição deliberada;
7. metodologia refletir fontes verificáveis em geral;
8. HTML/canonical/social metadata existirem sem dependência de JS para conteúdo essencial;
9. gates mínimos de acessibilidade/performance/visual estiverem ativos;
10. qualquer upstream para Cobogó tiver sido feito somente onde a reutilização foi demonstrada.

## 18. Relação com issues existentes

- #39 — épica e acompanhamento geral;
- #40 — composição editorial da capa;
- #41 — masthead e navegação;
- #42 — mídia editorial;
- #43 — página de matéria;
- #44 — metodologia/confiança;
- #45 — mobile;
- #46 — publicação estática/SEO/distribuição;
- #47 — arquitetura de informação;
- #48 — adoção de foundation/design authority;
- #49 — serviço/agenda/acompanhamento;
- #50 — gate visual/acessibilidade/performance.

As issues são unidades de execução. Esta RFC é a autoridade de arquitetura e sequência para a iniciativa.