# RFC 0001 — Agente independente de publicação

Status: Em revisão  
Data: 30 de agosto de 2026

## 1. Resumo da decisão

`ovigialocal/ovigialocal.github.io` é a **autoridade pública** de O Vigia.

A redação privada em `franklinbaldo/ovigia-redacao` produz matérias até `article-ready`. Este repositório não recebe sincronização automática. Um **agente independente de publicação**, executando sob o contrato deste repositório, consulta a redação por pull, lê uma candidata pronta e decide se aceita colocá-la sob a marca pública de O Vigia.

O fluxo é:

```text
franklinbaldo/ovigia-redacao
        article-ready
             ↓
      publication agent
        /          \
     accept        reject
       ↓              ↓
copy Markdown      open issue
into this repo     in newsroom
       ↓              ↓
public artifact     new digest
       ↓
GitHub Pages
```

A independência é deliberada: `article-ready` é uma alegação da redação, não uma ordem de publicação.

## 2. Autoridade deste repositório

Este repositório é autoridade sobre:

- quais matérias são aceitas para publicação;
- a cópia pública canônica do Markdown aceito;
- metadados especificamente públicos;
- renderização estática;
- homepage, arquivo, artigo, feed e sitemap;
- commit que materializa a publicação;
- URL pública e sua confirmação;
- histórico público de correções/atualizações;
- evidência de que uma matéria está efetivamente publicada.

Este repositório **não** é autoridade sobre:

- detecção de leads;
- pauta;
- apuração;
- edição interna da redação;
- criação dos gates editoriais internos;
- promoção de uma matéria a `article-ready`;
- reescrita silenciosa da candidata privada.

## 3. Contrato com a redação

A redação canônica é `franklinbaldo/ovigia-redacao`.

Ela termina em `article-ready` e deve oferecer, para uma versão candidata:

- path/concept da matéria;
- digest exato;
- Markdown editorial;
- profile/gates aplicáveis;
- aprovações independentes do mesmo digest;
- proveniência e fontes necessárias para revisão;
- histórico de rejeição anterior quando relevante.

O publicador trata esses artefatos como evidência de processo, não como obrigação de aceite.

## 4. Descoberta é pull, nunca push

O agente publicador entra neste repositório e, quando executar trabalho de publicação, consulta a redação para encontrar candidatas `article-ready` ainda não decididas/publicadas.

Não deve existir como requisito arquitetural:

- sincronização automática;
- cópia acionada pela redação;
- webhook obrigatório;
- GitHub Action privada que empurre conteúdo;
- espelhamento contínuo de diretórios.

A separação de repositórios é uma separação de autoridade, não apenas de armazenamento.

## 5. Revisão independente

Antes de aceitar, o agente deve ler a matéria e contexto suficiente para formar julgamento próprio.

A revisão do publicador não precisa duplicar mecanicamente todos os gates da redação. Ela serve como última barreira independente para problemas materiais que tornariam inadequado publicar a versão sob a marca pública.

Exemplos de razões legítimas para rejeição:

- afirmação material sem sustentação suficiente;
- fonte inadequada ou proveniência inconsistente;
- informação de serviço já perecida;
- título/abertura materialmente desproporcional;
- risco de privacidade ou sensibilidade não resolvido;
- conteúdo que contradiz a própria evidência anexada;
- ausência de metadado indispensável para publicação;
- falha estrutural que impede identificar com segurança a versão aprovada.

O agente deve evitar rejeições cosméticas que apenas expressem preferência estilística.

## 6. Caminho de rejeição

Se houver problema material:

1. **não copie** a candidata;
2. **não edite** o arquivo da redação;
3. abra issue em `franklinbaldo/ovigia-redacao`;
4. identifique path/concept e digest exatos;
5. descreva findings concretos;
6. cite evidências examinadas;
7. declare o trabalho necessário para nova submissão.

Template conceitual:

```markdown
publication-review: rejected
article: <path-or-concept>
source_digest: <digest>

## Findings
- ...

## Evidence
- ...

## Required work
- ...
```

A issue é feedback editorial. O agente publicador não corrige a matéria privada por conta própria.

Quando a redação responder com nova versão, ela terá novo digest e será avaliada como nova candidata.

## 7. Caminho de aceite

Se a candidata for aceita:

1. registre a identidade exata examinada;
2. copie o Markdown editorial para a área pública canônica de conteúdo;
3. preserve o corpo editorial aprovado;
4. acrescente somente metadados que pertencem à publicação, como slug/URL/data pública quando definidos por este repositório;
5. gere/atualize os artefatos derivados do site;
6. abra commit/PR neste repositório;
7. depois da integração/deploy, confirme a URL pública;
8. preserve evidência suficiente para reconstruir qual digest privado originou a publicação.

Uma mudança editorial material durante a cópia invalida o aceite: ela deve voltar para a redação como nova versão.

## 8. Markdown público canônico

A direção arquitetural é manter a matéria aceita em Markdown dentro deste repositório, separando **conteúdo canônico** de **artefatos derivados de apresentação**.

Estrutura inicial de referência:

```text
content/
  articles/
    <slug>.md

docs/rfc/
skills/
```

A forma exata de renderizar esse Markdown pode evoluir. HTML, JSON, feed e sitemap são projeções públicas derivadas; não devem ser a única cópia semanticamente legível da matéria.

Nenhum arquivo demonstrativo deve ser promovido como notícia real.

## 9. Metadados de proveniência pública

Uma matéria pública deve ser relacionável à candidata privada que foi aceita.

O mínimo recomendado inclui:

- `source_repository: franklinbaldo/ovigia-redacao`;
- path/concept da candidata;
- digest exato da versão aceita;
- commit deste repositório que publicou a matéria;
- data/hora pública quando aplicável.

Esses dados são confiança/proveniência, não devem necessariamente dominar a apresentação visual ao leitor. A UI pode usar divulgação progressiva.

## 10. Correções e atualizações

Depois da publicação, este repositório é autoridade sobre o estado público.

Se um problema exigir nova apuração ou reescrita editorial:

1. abra issue na redação;
2. aguarde nova versão `article-ready`;
3. faça nova revisão independente;
4. publique como correção/atualização preservando o histórico público.

Correções não devem apagar silenciosamente o que foi publicado anteriormente quando a mudança for material.

## 11. Skill do publicador

O procedimento executável vive em:

```text
skills/publication-review/SKILL.md
```

A skill pertence a este repositório para preservar independência institucional. A redação não define unilateralmente o procedimento pelo qual suas candidatas são aceitas para publicação.

## 12. Relação com WikiSkill

A redação adota WikiSkill para aprender continuamente com experiência editorial. Este repositório não precisa adotar imediatamente a mesma infraestrutura.

Porém, as rejeições do publicador são sinais estruturados de alta qualidade para a experiência da redação. O agente deve produzir issues precisas o suficiente para que padrões recorrentes possam ser consolidados e eventualmente melhorar skills jornalísticas.

Se no futuro o próprio publicador acumular volume suficiente de decisões, este repositório poderá adotar sua própria wiki/skill evolution — separada da wiki da redação.

## 13. Relação com o site atual

O site permanece static-first e hospedado via GitHub Pages.

A introdução do Markdown canônico não exige trocar toda a implementação visual nesta RFC. O primeiro objetivo é estabelecer responsabilidade e contrato. A migração da projeção atual (`articles.json`/HTML/JS) para uma renderização derivada do Markdown pode ocorrer incrementalmente.

Cobogó continua sendo a referência de gramática visual compartilhada quando aplicável.

## 14. Critérios de aceite

A arquitetura estará provada quando:

1. existir ao menos uma matéria real `article-ready` na redação;
2. um agente operando neste repositório descobri-la por pull;
3. o agente conseguir revisar o digest exato;
4. uma rejeição, quando houver problema, gerar issue acionável na redação sem editar a candidata;
5. uma candidata aceita seja copiada como Markdown público canônico;
6. o corpo editorial aceito permaneça identificável;
7. o site derive sua publicação do conteúdo versionado aqui;
8. a URL pública possa ser ligada ao digest privado e ao commit público;
9. nenhuma sincronização automática seja necessária para o fluxo funcionar.

## 15. Não objetivos

Esta RFC não propõe:

- publicar automaticamente toda candidata `article-ready`;
- transformar o publicador em coautor silencioso;
- mover o pipeline de redação para este repositório;
- permitir que a redação faça push direto como ato de publicação;
- exigir backend permanente;
- esconder o histórico de correções;
- criar agora uma segunda infraestrutura WikiSkill completa.

## 16. Regra operacional curta

Ao entrar neste repositório, um agente deve perguntar:

> “Existe uma candidata `article-ready` que eu, como autoridade pública independente, aceito colocar sob a marca O Vigia?”

Se sim, publique de forma versionada e rastreável. Se não, devolva trabalho por issue à redação.
