# Contrato temporal para Serviço, Agenda e Acompanhe

A capa pode transformar informação temporal em utilidade pública **somente quando o marco estiver estruturado e verificável**. O frontend não tenta adivinhar prazos lendo títulos ou extraindo datas por regex.

## Campos opcionais

Uma matéria pode expor, quando aprovado editorialmente:

```yaml
next_event_at: "2026-09-03T08:30:00-04:00"
next_event_kind: "prazo"
next_event_label: "Atendimento até 3 de setembro"
```

`next_event_kind` usa um vocabulário pequeno e factual, por exemplo:

- `prazo` — data limite oficial ou operacional;
- `sessao` — sessão/audiência/reunião marcada;
- `evento` — acontecimento com data e hora;
- `vigencia` — início ou fim de uma regra/serviço;
- `acompanhamento` — próximo marco documental conhecido.

## Regras

1. `next_event_at` não é a data de publicação.
2. previsão incerta não vira prazo.
3. um evento citado incidentalmente no texto não precisa virar agenda.
4. `next_event_label` diz ao leitor por que o marco importa, sem ampliar a evidência.
5. itens expirados deixam de ocupar a superfície de próximos marcos; o artigo continua no acervo.
6. ausência de metadata temporal é estado normal e esconde o módulo sem deixar buraco.
7. cada item da Agenda/Acompanhe oferece caminho para a matéria e para sua fonte verificável.

## Composição pública

- `Serviço` continua derivado da editoria explicitamente classificada como `Serviços`.
- marcos futuros com `next_event_kind` diferente de `acompanhamento` entram em **Agenda — Hoje / próximos dias**.
- `next_event_kind: acompanhamento` entra em **Acompanhe — Histórias abertas**.
- se não houver marco futuro estruturado, a seção inteira de próximos marcos não é renderizada.

A decisão editorial de criar os campos acontece antes da projeção pública. A capa apenas materializa o contrato; não cria uma segunda interpretação dos fatos.
