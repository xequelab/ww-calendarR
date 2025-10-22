export default {
  editor: {
    label: {
      pt: 'Calendário de Agendamento',
      en: 'Booking Calendar'
    },
    icon: 'calendar'
  },
  properties: {
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
    }
  ]
};