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
- dataInicial: string - Data inicial selecionada no formato "YYYY-MM-DD". Vincule a uma variável de página/global para persistir a seleção entre preview e edição.
- permitirMesAnterior: boolean - Define se o usuário pode navegar para meses anteriores ao atual
- diasFuturosLimite: number - Número máximo de dias futuros permitidos para agendamento. 0 = sem limite. Exemplo: 30 permite apenas 30 dias à frente.
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
- mudancaMes: Disparado DEPOIS que o mês mudou (após carregar). Payload: { mes: 1-12, ano: YYYY }. **USE ESTE EVENTO para workflows que precisam buscar dados do mês atual.**
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

**RECOMENDADO: Usar o evento "mudancaMes"**

Este é o jeito mais simples e lógico. O evento dispara automaticamente:
- Quando o componente carrega pela primeira vez
- Quando o usuário clica na seta → (próximo mês)
- Quando o usuário clica na seta ← (mês anterior)

**Como configurar:**
1. Configure um workflow no evento **"Ao mudar de mês (após carregar)"**
2. Faça request para edge function usando `event.mes` e `event.ano`
3. Atualize a propriedade `diasDisponiveis` com os dados retornados

**Exemplo de Workflow:**
```
Evento: mudancaMes
↓
Request para Edge Function
  - Parâmetros: event.mes, event.ano
↓
Atualizar diasDisponiveis com response
```

**Vantagens:**
- Lógica simples: o evento sempre reflete o mês que ESTÁ SENDO EXIBIDO
- Funciona tanto para próximo quanto para mês anterior
- Dispara também no carregamento inicial
- Não precisa de variáveis intermediárias

**Opções alternativas (avançadas):**
- Use `mesAtualNumerico` e `anoAtualNumerico` se precisar acessar o mês atual via variável
- Use `cliqueProximoMes` e `cliqueMesAnterior` se precisar fazer algo ANTES da mudança acontecer

***Usage - Persistir Seleção:***

Para que a data selecionada persista entre preview e modo de edição:

1. **Crie uma variável de página** (ex: `minhaDataSelecionada`)
2. **No evento "selecao"** do calendário, configure um workflow:
   - Ação: Atualizar variável
   - Variável: `minhaDataSelecionada`
   - Valor: `event.value`
3. **Vincule a propriedade "dataInicial"** à mesma variável: `minhaDataSelecionada`

Agora a data ficará salva mesmo ao sair e voltar do preview!

**Exemplo de configuração:**
```
1. Variável de página: minhaDataSelecionada (tipo: string, valor inicial: "")
2. Calendário → Propriedade "dataInicial" = minhaDataSelecionada
3. Calendário → Evento "selecao" → Workflow: Atualizar minhaDataSelecionada = event.value
```

***Usage - Limitar Dias Futuros:***

Para limitar quantos dias no futuro o calendário pode avançar:

1. Configure a propriedade **diasFuturosLimite** com o número de dias desejado
2. Exemplo: `diasFuturosLimite = 30` permite agendamentos apenas até 30 dias à frente
3. O botão de próximo mês será automaticamente desabilitado quando o limite for atingido
4. Use `0` para desabilitar o limite (comportamento padrão)

**Exemplo:**
```
diasFuturosLimite = 60
- Hoje: 26/10/2025
- Limite: 25/12/2025
- Pode avançar até: Dezembro 2025
- Janeiro 2026: Botão desabilitado ❌
```

***Notes:***
- O componente inicia mostrando o mês atual (ou o mês da dataInicial, se fornecida)
- Datas passadas: opacity 0.25, não clicáveis
- Dias bloqueados: text-decoration line-through, opacity 0.3, não clicáveis
- Data atual: borda roxa clara
- Data selecionada: fundo roxo sólido com sombra
- Formato de data: ISO (YYYY-MM-DD)
- Todas as propriedades são bindable (podem usar variáveis do WeWeb)
- A variável exposta `dataSelecionada` é volátil (reseta ao sair do preview). Para persistir, use a propriedade `dataInicial` vinculada a uma variável de página/global.
- O limite de dias futuros bloqueia a navegação de meses, mas não bloqueia dias individuais dentro do mês atual