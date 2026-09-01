# Contrato temporal para Serviço, Agenda e Acompanhe

A capa pode transformar informação temporal em utilidade pública **somente quando o marco estiver estruturado e verificável**. O frontend não deve tentar adivinhar prazos lendo títulos ou extraindo datas por regex.

## Campos opcionais

Artigos futuros podem expor, quando aprovados editorialmente:

```yaml
next_event_at: "2026-09-03T08:30:00-04:00"
next_event_kind: "prazo"
next_event_label: "Atendimento até 3 de setembro"
```

`next_event_kind` deve usar um vocabulário pequeno e factual, por exemplo:

- `prazo` — data limite oficial ou operacional;
- `sessao` — sessão/audiência/reunião marcada;
- `evento` — acontecimento com data e hora;
- `vigencia` — início ou fim de uma regra/serviço;
- `acompanhamento` — próximo marco documental conhecido.

## Regras

1. `next_event_at` não é a data de publicação.
2. previsão incerta não vira prazo.
3. um evento citado incidentalmente no texto não precisa virar agenda.
4. o label deve dizer ao leitor por que o marco importa, sem ampliar a evidência.
5. itens expirados deixam de ocupar a superfície de próximos marcos; o artigo continua no acervo.
6. ausência de metadata temporal é estado normal e deve esconder o módulo sem deixar buraco.

O módulo `Serviço` atual é derivado da editoria explicitamente classificada como `Serviços`. Agenda e acompanhamento só devem ser ativados quando esses campos começarem a existir no estado canônico público.
