---
name: publication-review
description: Avalia independentemente uma candidata article-ready e decide publicar ou devolver trabalho à redação por issue.
compatibility: ">=1.0.0"
metadata:
  version: "1.0.0"
  owner_role: "publication-agent"
---

# Skill: Publication Review

## Purpose

Decidir se uma versão exata marcada como `article-ready` pela redação pode ser colocada sob a marca pública de O Vigia.

## Inputs

- candidata `article-ready` em `franklinbaldo/ovigia-redacao`;
- path/concept e digest exatos;
- Markdown editorial;
- profile/gates aplicáveis e aprovações do mesmo digest;
- proveniência/fontes suficientes para revisão;
- histórico de rejeição anterior quando relevante.

## Procedure

1. Descubra candidatas por **pull** a partir deste repositório. Não espere sincronização automática.
2. Escolha uma candidata ainda não decidida/publicada e fixe sua identidade exata.
3. Leia a matéria inteira antes de decidir.
4. Confirme que gates/proveniência apresentados correspondem ao mesmo digest.
5. Faça revisão independente focada em problemas materiais de publicação: sustentação factual, autoridade/proveniência, freshness quando o leitor pretende agir, proporcionalidade de título/abertura, privacidade/sensibilidade e integridade estrutural.
6. Não repita gates apenas para demonstrar atividade; use o julgamento independente como barreira contra divergência material.
7. Se houver finding bloqueante ou necessidade concreta de nova apuração/revisão editorial, siga `Reject`.
8. Se a versão for publicável sem mudança editorial material, siga `Accept`.

## Reject

1. Não copie nem edite a candidata.
2. Abra issue em `franklinbaldo/ovigia-redacao`.
3. Inclua path/concept, digest, findings, evidências examinadas e `required work`.
4. Não prescreva alteração cosmética como se fosse bloqueio material.
5. Encerre esta candidatura. Uma correção deverá chegar como novo digest.

## Accept

1. Copie o corpo editorial aprovado como Markdown canônico deste repositório.
2. Preserve referência ao repositório/path/digest de origem.
3. Acrescente somente metadados de publicação pertencentes à face pública.
4. Não faça reescrita editorial material durante a cópia.
5. Atualize os artefatos derivados exigidos pela implementação atual do site.
6. Submeta a mudança por Git/PR normal.
7. Depois de publicada, confirme que a URL pública corresponde ao artefato aceito e preserve a evidência desse vínculo.

## Corrections

Se uma matéria já publicada exigir mudança editorial material, abra issue na redação e aguarde uma nova versão `article-ready`. O histórico público não deve ser silenciosamente apagado.

## Must not

- não publicar só porque a redação marcou `article-ready`;
- não implementar sync automática redação → site;
- não editar silenciosamente a candidata privada;
- não copiar uma versão diferente da que foi revisada;
- não tratar preferência de estilo como defeito material;
- não publicar fixture/demo como notícia real.

## Output

Exatamente um resultado por candidata/digest:

- `accepted` com mudança pública rastreável; ou
- `rejected` com issue acionável na redação.
