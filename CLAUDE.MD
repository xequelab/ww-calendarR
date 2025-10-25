---
name: calendario-agendamento
description: Calendário em português para agendamentos com bloqueio de dias indisponíveis e personalização completa de cores e fontes.
keywords: calendário, agendamento, datas, português, seleção de data, navegação de meses, disponibilidade, slots
---

#### Calendário de Agendamento

***Purpose:***
Componente de calendário em português para seleção de datas futuras com controle de disponibilidade via array, ideal para sistemas de agendamento profissional.

***Features:***
- Interface completamente em português (dias da semana: DOM, SEG, TER, QUA, QUI, SEX, SÁB)
- Bloqueio automático de datas passadas (não clicáveis)
- Bloqueio de dias indisponíveis baseado em array de disponibilidade
- Navegação intuitiva entre meses com eventos de workflow
- Destaque visual para data atual, selecionada e bloqueada
- Personalização completa de cores (primária, secundária, texto, dias da semana, hover)
- Personalização de tamanhos de fonte (título, dias da semana, dias)
- Design minimalista e moderno

***Properties:***

**Configurações:**
- permitirMesAnterior: boolean - Define se o usuário pode navegar para meses anteriores ao atual
- diasDisponiveis: array - Array de objetos com datas disponíveis e slots. Formato: [{ date: "2025-10-26", slots: ["09:00", "10:00"] }]

**Cores:**
- corPrimaria: string - Cor principal (cabeçalho e dia selecionado) - padrão: #4a90e2
- corSecundaria: string - Cor secundária (fundo dias da semana) - padrão: #e8f4ff
- corTexto: string - Cor do texto dos números - padrão: #1a1a1a
- corTitulo: string - Cor do texto do título (mês e ano) - padrão: #1a1a1a
- corDiasSemana: string - Cor dos labels dos dias da semana - padrão: #a0a0a0
- corHover: string - Cor de fundo ao passar mouse - padrão: #f5f5f7

**Fontes e Espaçamento:**
- tamanhoFonteTitulo: string - Tamanho da fonte do título (mês/ano) - padrão: 16px
- tamanhoFonteDiasSemana: string - Tamanho fonte dias da semana - padrão: 11px
- tamanhoFonteDias: string - Tamanho dos números dos dias - padrão: 15px
- paddingDias: string - Espaçamento interno ao redor do número de cada dia - padrão: 0px

***Events:***
- selecao: Disparado quando o usuário seleciona uma data. Payload: { value: "YYYY-MM-DD" }
- cliqueProximoMes: Disparado AO CLICAR na seta do próximo mês (antes de mudar). Payload: { proximoMes: 1-12, proximoAno: YYYY }
- cliqueMesAnterior: Disparado AO CLICAR na seta do mês anterior (antes de mudar). Payload: { mesAnterior: 1-12, anoAnterior: YYYY }

***Exposed Variables:***
- dataSelecionada: A data selecionada pelo usuário no formato ISO "YYYY-MM-DD"
- mesAtualNumerico: Mês atual sendo visualizado (1-12, onde 1=Janeiro, 2=Fevereiro, etc)
- anoAtualNumerico: Ano atual sendo visualizado (YYYY)
- proximoMesSeAvancar: Qual será o próximo mês (1-12) se clicar na seta →
- proximoAnoSeAvancar: Qual será o próximo ano se clicar na seta →
- proximoMesSeVoltar: Qual será o próximo mês (1-12) se clicar na seta ←
- proximoAnoSeVoltar: Qual será o próximo ano se clicar na seta ←

***Usage - Bloqueio de Dias:***
Para bloquear dias que o profissional não trabalha, vincule um array à propriedade diasDisponiveis:
```javascript
// Exemplo de array retornado pela edge function
[
  { date: "2025-10-26", slots: [] },           // Dia sem horários
  { date: "2025-10-27", slots: ["09:00", "10:00", "11:00"] },
  { date: "2025-10-28", slots: ["13:00", "14:00"] }
]
```
Apenas os dias presentes no array estarão disponíveis para seleção. Dias ausentes serão bloqueados visualmente (riscados e com opacity reduzida).

***Usage - Workflow com Mudança de Mês:***

**Opção 1: Usar eventos separados (RECOMENDADO)**
1. Configure workflows nos eventos "cliqueProximoMes" e "cliqueMesAnterior"
2. Use os payloads dos eventos (proximoMes, proximoAno ou mesAnterior, anoAnterior)
3. Faça request para edge function ANTES que o calendário mude de mês
4. Atualize a propriedade diasDisponiveis com os dados retornados
5. O calendário já mostrará o novo mês com disponibilidade atualizada

**Opção 2: Usar variáveis expostas**
1. Vincule as variáveis proximoMesSeAvancar/proximoAnoSeAvancar à sua edge function
2. A edge function será chamada automaticamente quando as variáveis mudarem
3. Configure workflow para atualizar diasDisponiveis com o resultado

**Exemplo de Workflow:**
```
Evento: cliqueProximoMes
↓
Request para Edge Function
  - Parâmetros: event.proximoMes, event.proximoAno
↓
Atualizar diasDisponiveis com response
```

***Notes:***
- O componente inicia mostrando o mês atual
- Datas passadas: opacity 0.25, não clicáveis
- Dias bloqueados: text-decoration line-through, opacity 0.3, não clicáveis
- Data atual: borda roxa clara
- Data selecionada: fundo roxo sólido com sombra
- Formato de data: ISO (YYYY-MM-DD)
- Todas as propriedades são bindable (podem usar variáveis do WeWeb)