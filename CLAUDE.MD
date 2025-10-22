---
name: calendario-agendamento
description: Calendário em português para agendamentos que permite selecionar apenas datas futuras e navegar entre meses.
keywords: calendário, agendamento, datas, português, seleção de data, navegação de meses
---

#### Calendário de Agendamento

***Purpose:***
Componente de calendário em português para seleção de datas futuras, ideal para sistemas de agendamento onde datas passadas não devem ser selecionáveis.

***Features:***
- Interface completamente em português (dias da semana e meses)
- Bloqueio automático de datas passadas (não clicáveis)
- Navegação intuitiva entre meses (sem navegação entre anos)
- Destaque visual para a data atual e data selecionada
- Personalização de cores primária e secundária

***Properties:***
- permitirMesAnterior: boolean - Define se o usuário pode navegar para meses anteriores ao atual
- corPrimaria: string - Cor principal do calendário, usada no cabeçalho e para destacar o dia selecionado
- corSecundaria: string - Cor de fundo da barra dos dias da semana

***Events:***
- selecao: Disparado quando o usuário seleciona uma data. Payload: { value: "YYYY-MM-DD" }

***Exposed Variables:***
- dataSelecionada: A data selecionada pelo usuário no formato ISO "YYYY-MM-DD" (path: variables['current_element_uid-dataSelecionada'])

***Notes:***
- O componente inicia mostrando o mês atual
- Datas passadas são visualmente diferenciadas e não podem ser selecionadas
- A data atual é destacada com um ponto indicador
- A data selecionada é destacada com preenchimento colorido
- O formato da data armazenada e emitida é ISO (YYYY-MM-DD)