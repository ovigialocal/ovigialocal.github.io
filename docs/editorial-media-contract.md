# Contrato de mídia editorial de O Vigia

Mídia em O Vigia existe para acrescentar informação, não para simular aparência de jornal.

## Tipos admitidos

- fotografia documental;
- imagem oficial relevante ao fato;
- gráfico ou visualização de dados;
- mapa;
- reprodução/recorte de documento primário quando a própria peça é jornalisticamente relevante.

Imagem genérica, stock ou meramente decorativa não é requisito de publicação e não deve ser usada para preencher espaço.

## Metadados opcionais no artigo público

Quando uma matéria usa mídia, o frontmatter pode expor:

```yaml
media_url: "https://..."
media_alt: "Descrição objetiva do conteúdo visual"
media_caption: "Legenda factual"
media_credit: "Autoria / órgão / acervo"
media_source_url: "https://origem-verificavel/..."
media_width: "1600"
media_height: "900"
```

`media_url` ativa o bloco visual. Os demais campos devem ser preenchidos conforme aplicáveis.

## Regras editoriais

1. `media_alt` descreve o que importa na imagem; não repete a legenda por obrigação.
2. `media_caption` não deve introduzir afirmação que a matéria/evidência não sustente.
3. `media_credit` identifica autoria ou origem editorialmente relevante.
4. `media_source_url` aponta, sempre que possível, para a origem verificável da peça.
5. `media_width`/`media_height` registram dimensões intrínsecas para estabilidade de layout.
6. Licença/permissão continua sendo requisito editorial mesmo quando não é expressa como campo público.
7. A ausência de mídia nunca torna uma matéria visualmente “incompleta”.

## Fronteira com Cobogó

O contrato de seleção, crédito e proveniência é jornalístico e pertence a O Vigia. Se o padrão estrutural `figure`/`figcaption` provar uso independente em outros consumers cívicos, sua apresentação genérica pode ser promovida ao Cobogó depois de evidência real — não antecipadamente.
