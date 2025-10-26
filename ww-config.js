export default {
  editor: {
    label: {
      pt: 'Calendário de Agendamento',
      en: 'Booking Calendar'
    },
    icon: 'calendar'
  },
  properties: {
    dataInicial: {
      label: {
        pt: 'Data inicial',
        en: 'Initial date'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Data inicial do calendário no formato YYYY-MM-DD. Vincule a uma variável para persistir a seleção.'
      },
      propertyHelp: {
        tooltip: 'Define a data inicial selecionada. Formato: YYYY-MM-DD. Para persistir a seleção, vincule a variável dataSelecionada a uma variável de página/global e depois vincule essa mesma variável aqui.'
      }
      /* wwEditor:end */
    },
    permitirMesAnterior: {
      label: {
        pt: 'Permitir mês anterior',
        en: 'Allow previous month'
      },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Define se o usuário pode navegar para meses anteriores ao atual'
      },
      propertyHelp: {
        tooltip: 'Quando ativado, permite que o usuário navegue para meses anteriores ao atual'
      }
      /* wwEditor:end */
    },
    diasDisponiveis: {
      label: {
        pt: 'Dias disponíveis',
        en: 'Available days'
      },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array com objetos contendo date (YYYY-MM-DD) e slots disponíveis'
      },
      propertyHelp: {
        tooltip: 'Array de objetos com formato: [{ date: "2025-10-26", slots: ["09:00", "10:00"] }]. Apenas dias presentes neste array estarão disponíveis para seleção.'
      }
      /* wwEditor:end */
    },
    corPrimaria: {
      label: { 
        pt: 'Cor primária',
        en: 'Primary color'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#4a90e2',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Cor principal do calendário (cabeçalho e dia selecionado)'
      },
      propertyHelp: {
        tooltip: 'Define a cor principal do calendário, usada no cabeçalho e para destacar o dia selecionado'
      }
      /* wwEditor:end */
    },
    corSecundaria: {
      label: {
        pt: 'Cor secundária',
        en: 'Secondary color'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#e8f4ff',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Cor secundária do calendário (fundo dos dias da semana)'
      },
      propertyHelp: {
        tooltip: 'Define a cor de fundo da barra dos dias da semana'
      }
      /* wwEditor:end */
    },
    corTexto: {
      label: {
        pt: 'Cor do texto',
        en: 'Text color'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#1a1a1a',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Cor do texto dos números dos dias'
      },
      propertyHelp: {
        tooltip: 'Define a cor do texto dos números dos dias do calendário'
      }
      /* wwEditor:end */
    },
    corDiasSemana: {
      label: {
        pt: 'Cor dias da semana',
        en: 'Weekday labels color'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#a0a0a0',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Cor dos labels dos dias da semana'
      },
      propertyHelp: {
        tooltip: 'Define a cor dos labels dos dias da semana (DOM, SEG, TER, etc)'
      }
      /* wwEditor:end */
    },
    corHover: {
      label: {
        pt: 'Cor hover',
        en: 'Hover color'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#f5f5f7',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Cor de fundo ao passar o mouse sobre os dias'
      },
      propertyHelp: {
        tooltip: 'Define a cor de fundo que aparece ao passar o mouse sobre os dias disponíveis'
      }
      /* wwEditor:end */
    },
    tamanhoFonteTitulo: {
      label: {
        pt: 'Tamanho fonte título',
        en: 'Title font size'
      },
      type: 'Length',
      section: 'style',
      bindable: true,
      defaultValue: '16px',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Tamanho da fonte do título (mês e ano)'
      },
      propertyHelp: {
        tooltip: 'Define o tamanho da fonte do título que mostra o mês e ano'
      }
      /* wwEditor:end */
    },
    tamanhoFonteDiasSemana: {
      label: {
        pt: 'Tamanho fonte dias da semana',
        en: 'Weekday font size'
      },
      type: 'Length',
      section: 'style',
      bindable: true,
      defaultValue: '11px',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Tamanho da fonte dos labels dos dias da semana'
      },
      propertyHelp: {
        tooltip: 'Define o tamanho da fonte dos labels dos dias da semana (DOM, SEG, TER, etc)'
      }
      /* wwEditor:end */
    },
    tamanhoFonteDias: {
      label: {
        pt: 'Tamanho fonte dias',
        en: 'Days font size'
      },
      type: 'Length',
      section: 'style',
      bindable: true,
      defaultValue: '15px',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Tamanho da fonte dos números dos dias'
      },
      propertyHelp: {
        tooltip: 'Define o tamanho da fonte dos números dos dias do calendário'
      }
      /* wwEditor:end */
    },
    paddingDias: {
      label: {
        pt: 'Padding dos dias',
        en: 'Days padding'
      },
      type: 'Length',
      section: 'style',
      bindable: true,
      defaultValue: '0px',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Espaçamento interno (padding) de cada dia do calendário'
      },
      propertyHelp: {
        tooltip: 'Define o espaçamento interno ao redor do número de cada dia. Use valores como "4px", "8px", etc.'
      }
      /* wwEditor:end */
    },
    corTitulo: {
      label: {
        pt: 'Cor do título',
        en: 'Title color'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#1a1a1a',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Cor do texto do título (mês e ano)'
      },
      propertyHelp: {
        tooltip: 'Define a cor do texto que mostra o mês e ano no cabeçalho do calendário'
      }
      /* wwEditor:end */
    }
  },
  triggerEvents: [
    {
      name: 'selecao',
      label: {
        pt: 'Ao selecionar data',
        en: 'On date selection'
      },
      event: {
        value: ''
      }
    },
    {
      name: 'mudancaMes',
      label: {
        pt: 'Ao mudar de mês (após carregar)',
        en: 'On month change (after load)'
      },
      event: {
        mes: 0,
        ano: 0
      }
    },
    {
      name: 'cliqueProximoMes',
      label: {
        pt: 'Ao clicar em próximo mês (antes de mudar)',
        en: 'On next month click (before change)'
      },
      event: {
        proximoMes: 0,
        proximoAno: 0
      }
    },
    {
      name: 'cliqueMesAnterior',
      label: {
        pt: 'Ao clicar em mês anterior (antes de mudar)',
        en: 'On previous month click (before change)'
      },
      event: {
        mesAnterior: 0,
        anoAnterior: 0
      }
    }
  ]
};