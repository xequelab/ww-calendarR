<template>
  <div class="calendario-wrapper">
    <!-- Cabeçalho -->
    <div class="calendario-header">
      <button
        @click="mesAnterior"
        :disabled="ehMesAtual && !permitirMesAnterior"
        class="nav-button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 class="mes-titulo">{{ nomeMesAtual }} {{ anoAtual }}</h2>

      <button @click="proximoMes" class="nav-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Dias da semana -->
    <div class="dias-semana-grid">
      <div v-for="(dia, index) in diasDaSemana" :key="index" class="dia-semana-label">
        {{ dia.toUpperCase() }}
      </div>
    </div>

    <!-- Grid de dias -->
    <div class="dias-mes-grid">
      <div
        v-for="(dia, index) in diasDoMes"
        :key="index"
        @click="selecionarData(dia)"
        :class="['dia-celula', getDiaClasses(dia)]"
      >
        <span v-if="dia.data" class="dia-numero">{{ dia.numero }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isToday, 
  isBefore, 
  isAfter,
  addMonths, 
  subMonths,
  isSameDay,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default {
  props: {
    content: { 
      type: Object, 
      required: true 
    },
    uid: { 
      type: String, 
      required: true 
    },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // Estado de edição
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });

    // Data atual do calendário (mês/ano sendo visualizado)
    const dataAtualCalendario = ref(new Date());
    
    // Variável interna para armazenar a data selecionada
    const { value: dataSelecionada, setValue: setDataSelecionada } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'dataSelecionada',
      type: 'string', // Formato ISO
      defaultValue: ''
    });

    // Variável exposta para o mês atual (1-12)
    const { value: mesAtualNumerico, setValue: setMesAtualNumerico } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'mesAtualNumerico',
      type: 'number',
      defaultValue: new Date().getMonth() + 1
    });

    // Variável exposta para o ano atual
    const { value: anoAtualNumerico, setValue: setAnoAtualNumerico } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'anoAtualNumerico',
      type: 'number',
      defaultValue: new Date().getFullYear()
    });

    // Variável exposta: próximo mês se avançar
    const { value: proximoMesSeAvancar, setValue: setProximoMesSeAvancar } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'proximoMesSeAvancar',
      type: 'number',
      defaultValue: null
    });

    // Variável exposta: próximo ano se avançar
    const { value: proximoAnoSeAvancar, setValue: setProximoAnoSeAvancar } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'proximoAnoSeAvancar',
      type: 'number',
      defaultValue: null
    });

    // Variável exposta: próximo mês se voltar
    const { value: proximoMesSeVoltar, setValue: setProximoMesSeVoltar } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'proximoMesSeVoltar',
      type: 'number',
      defaultValue: null
    });

    // Variável exposta: próximo ano se voltar
    const { value: proximoAnoSeVoltar, setValue: setProximoAnoSeVoltar } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'proximoAnoSeVoltar',
      type: 'number',
      defaultValue: null
    });

    // Configuração do calendário
    const dataInicial = computed(() => props.content?.dataInicial ?? '');
    const permitirMesAnterior = computed(() => props.content?.permitirMesAnterior ?? false);
    const diasDisponiveis = computed(() => props.content?.diasDisponiveis ?? []);

    // Cores
    const corPrimaria = computed(() => props.content?.corPrimaria ?? '#4a90e2');
    const corSecundaria = computed(() => props.content?.corSecundaria ?? '#e8f4ff');
    const corTexto = computed(() => props.content?.corTexto ?? '#1a1a1a');
    const corDiasSemana = computed(() => props.content?.corDiasSemana ?? '#a0a0a0');
    const corHover = computed(() => props.content?.corHover ?? '#f5f5f7');

    // Tamanhos de fonte
    const tamanhoFonteTitulo = computed(() => props.content?.tamanhoFonteTitulo ?? '16px');
    const tamanhoFonteDiasSemana = computed(() => props.content?.tamanhoFonteDiasSemana ?? '11px');
    const tamanhoFonteDias = computed(() => props.content?.tamanhoFonteDias ?? '15px');

    // Padding
    const paddingDias = computed(() => props.content?.paddingDias ?? '0px');

    // Cor do título
    const corTitulo = computed(() => props.content?.corTitulo ?? '#1a1a1a');
    
    // Dias da semana em português
    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Mês e ano atual do calendário
    const mesAtual = computed(() => dataAtualCalendario.value.getMonth());
    const anoAtual = computed(() => dataAtualCalendario.value.getFullYear());
    
    // Nome do mês em português
    const nomeMesAtual = computed(() => {
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return meses[mesAtual.value];
    });
    
    // Verifica se o mês atual do calendário é o mês atual real
    const ehMesAtual = computed(() => {
      const hoje = new Date();
      return hoje.getMonth() === mesAtual.value && hoje.getFullYear() === anoAtual.value;
    });
    
    // Gera os dias do mês para o calendário
    const diasDoMes = computed(() => {
      const primeiroDiaDoMes = startOfMonth(dataAtualCalendario.value);
      const ultimoDiaDoMes = endOfMonth(dataAtualCalendario.value);
      
      const primeiroDiaDaGrade = startOfWeek(primeiroDiaDoMes);
      const ultimoDiaDaGrade = endOfWeek(ultimoDiaDoMes);
      
      const hoje = new Date();
      const dataSelecao = dataSelecionada.value ? parseISO(dataSelecionada.value) : null;
      
      const diasIntervalo = eachDayOfInterval({
        start: primeiroDiaDaGrade,
        end: ultimoDiaDaGrade
      });
      
      return diasIntervalo.map(data => {
        const ehDoMesAtual = data.getMonth() === mesAtual.value;
        const ehHoje = isToday(data);
        const ehPassado = isBefore(data, hoje) && !ehHoje;
        const ehFuturo = isAfter(data, hoje);
        const ehSelecionado = dataSelecao ? isSameDay(data, dataSelecao) : false;
        const dataFormatada = format(data, 'yyyy-MM-dd');

        // Verifica se o dia está disponível no array diasDisponiveis
        const diaDisponivel = diasDisponiveis.value.find(d => d.date === dataFormatada);
        const ehBloqueado = !ehPassado && diasDisponiveis.value.length > 0 && !diaDisponivel;

        return {
          data: ehDoMesAtual ? data : null,
          numero: data.getDate(),
          ehHoje,
          ehPassado,
          ehFuturo,
          ehSelecionado,
          ehBloqueado,
          dataFormatada
        };
      });
    });
    
    // Função para calcular próximo mês e ano
    const calcularProximoMes = (dataBase, direcao) => {
      const dataCalculada = direcao === 'avancar'
        ? addMonths(dataBase, 1)
        : subMonths(dataBase, 1);

      return {
        mes: dataCalculada.getMonth() + 1, // 1-12
        ano: dataCalculada.getFullYear()
      };
    };

    // Função para atualizar as variáveis de "próximo mês"
    const atualizarVariaveisProximoMes = () => {
      // Calcula próximo mês se avançar
      const proximoAvancar = calcularProximoMes(dataAtualCalendario.value, 'avancar');
      setProximoMesSeAvancar(proximoAvancar.mes);
      setProximoAnoSeAvancar(proximoAvancar.ano);

      // Calcula próximo mês se voltar
      const proximoVoltar = calcularProximoMes(dataAtualCalendario.value, 'voltar');
      setProximoMesSeVoltar(proximoVoltar.mes);
      setProximoAnoSeVoltar(proximoVoltar.ano);
    };

    // Navegação entre meses
    const proximoMes = () => {
      if (isEditing.value) return;

      // Calcula qual será o próximo mês
      const proximoMesData = calcularProximoMes(dataAtualCalendario.value, 'avancar');

      // Emite evento ANTES de mudar
      emit('trigger-event', {
        name: 'cliqueProximoMes',
        event: {
          proximoMes: proximoMesData.mes,
          proximoAno: proximoMesData.ano
        }
      });

      // Muda para o próximo mês
      dataAtualCalendario.value = addMonths(dataAtualCalendario.value, 1);

      // Atualiza variáveis expostas
      setMesAtualNumerico(proximoMesData.mes);
      setAnoAtualNumerico(proximoMesData.ano);

      // Atualiza as variáveis de "próximo mês"
      atualizarVariaveisProximoMes();
    };

    const mesAnterior = () => {
      if (isEditing.value) return;

      const novaData = subMonths(dataAtualCalendario.value, 1);
      const hoje = new Date();

      // Se permitirMesAnterior for false, não permite navegar para meses anteriores ao atual
      if (!permitirMesAnterior.value &&
          (novaData.getMonth() < hoje.getMonth() && novaData.getFullYear() <= hoje.getFullYear())) {
        return;
      }

      // Calcula qual será o próximo mês
      const proximoMesData = calcularProximoMes(dataAtualCalendario.value, 'voltar');

      // Emite evento ANTES de mudar
      emit('trigger-event', {
        name: 'cliqueMesAnterior',
        event: {
          mesAnterior: proximoMesData.mes,
          anoAnterior: proximoMesData.ano
        }
      });

      // Muda para o mês anterior
      dataAtualCalendario.value = novaData;

      // Atualiza variáveis expostas
      setMesAtualNumerico(proximoMesData.mes);
      setAnoAtualNumerico(proximoMesData.ano);

      // Atualiza as variáveis de "próximo mês"
      atualizarVariaveisProximoMes();
    };
    
    // Selecionar uma data
    const selecionarData = (dia) => {
      if (isEditing.value) return;

      // Não permite selecionar dias vazios, passados ou bloqueados
      if (!dia.data || dia.ehPassado || dia.ehBloqueado) return;

      // Atualiza a data selecionada
      setDataSelecionada(dia.dataFormatada);

      // Emite o evento de seleção
      emit('trigger-event', {
        name: 'selecao',
        event: { value: dia.dataFormatada }
      });
    };
    
    // Watch para sincronizar com a propriedade dataInicial (two-way binding)
    watch(() => dataInicial.value, (novaData) => {
      if (novaData && novaData !== '' && novaData !== dataSelecionada.value) {
        setDataSelecionada(novaData);
        try {
          const dataParsed = parseISO(novaData);
          dataAtualCalendario.value = dataParsed;
          setMesAtualNumerico(dataParsed.getMonth() + 1);
          setAnoAtualNumerico(dataParsed.getFullYear());
          atualizarVariaveisProximoMes();
        } catch (e) {
          console.error('Erro ao parsear dataInicial:', e);
        }
      }
    }, { immediate: true });

    // Inicializar o calendário quando o componente é montado
    onMounted(() => {
      // Prioridade: dataInicial > dataSelecionada > data atual
      let dataParaInicializar;

      if (dataInicial.value && dataInicial.value !== '') {
        try {
          dataParaInicializar = parseISO(dataInicial.value);
          setDataSelecionada(dataInicial.value);
        } catch (e) {
          dataParaInicializar = new Date();
        }
      } else if (dataSelecionada.value && dataSelecionada.value !== '') {
        try {
          dataParaInicializar = parseISO(dataSelecionada.value);
        } catch (e) {
          dataParaInicializar = new Date();
        }
      } else {
        dataParaInicializar = new Date();
      }

      dataAtualCalendario.value = dataParaInicializar;

      // Inicializa mesAtualNumerico e anoAtualNumerico
      setMesAtualNumerico(dataParaInicializar.getMonth() + 1); // 1-12
      setAnoAtualNumerico(dataParaInicializar.getFullYear());

      // Atualiza as variáveis de "próximo mês" na montagem
      atualizarVariaveisProximoMes();
    });

    // Função para gerar classes dinâmicas dos dias
    const getDiaClasses = (dia) => {
      const classes = [];

      if (!dia.data) {
        classes.push('dia-vazio');
        return classes.join(' ');
      }

      if (dia.ehSelecionado) {
        classes.push('dia-selecionado');
        return classes.join(' ');
      }

      if (dia.ehBloqueado) {
        classes.push('dia-bloqueado');
      } else if (dia.ehPassado) {
        classes.push('dia-passado');
      } else {
        classes.push('dia-futuro');
      }

      if (dia.ehHoje) {
        classes.push('dia-hoje');
      }

      return classes.join(' ');
    };

    return {
      diasDaSemana,
      diasDoMes,
      nomeMesAtual,
      anoAtual,
      mesAtual,
      ehMesAtual,
      permitirMesAnterior,
      proximoMes,
      mesAnterior,
      selecionarData,
      dataSelecionada,
      mesAtualNumerico,
      anoAtualNumerico,
      proximoMesSeAvancar,
      proximoAnoSeAvancar,
      proximoMesSeVoltar,
      proximoAnoSeVoltar,
      corPrimaria,
      corSecundaria,
      corTexto,
      corDiasSemana,
      corHover,
      corTitulo,
      tamanhoFonteTitulo,
      tamanhoFonteDiasSemana,
      tamanhoFonteDias,
      paddingDias,
      getDiaClasses
    };
  }
};
</script>

<style scoped>
.calendario-wrapper {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  background: #ffffff;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.calendario-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 24px 0;
}

.mes-titulo {
  font-size: v-bind(tamanhoFonteTitulo);
  font-weight: 500;
  color: v-bind(corTitulo);
  margin: 0;
  letter-spacing: -0.2px;
}

.nav-button {
  background: #f5f5f7;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #666;
}

.nav-button:hover:not(:disabled) {
  background: #e8e8ea;
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.dias-semana-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  margin-bottom: 8px;
}

.dia-semana-label {
  text-align: center;
  font-size: v-bind(tamanhoFonteDiasSemana);
  font-weight: 500;
  color: v-bind(corDiasSemana);
  letter-spacing: 0.3px;
  padding: 8px 0;
}

.dias-mes-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.dia-celula {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 12px;
  transition: all 0.15s ease;
  background: transparent;
}

.dia-numero {
  font-size: v-bind(tamanhoFonteDias);
  font-weight: 400;
  color: v-bind(corTexto);
  position: relative;
  z-index: 2;
  padding: v-bind(paddingDias);
}

.dia-vazio {
  visibility: hidden;
}

.dia-selecionado {
  background-color: v-bind(corPrimaria) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.dia-selecionado .dia-numero {
  color: white !important;
  font-weight: 500;
}

.dia-passado {
  opacity: 0.25;
  cursor: not-allowed;
}

.dia-passado .dia-numero {
  color: #a0a0a0;
}

.dia-bloqueado {
  opacity: 0.3;
  cursor: not-allowed;
  position: relative;
}

.dia-bloqueado .dia-numero {
  color: #d0d0d0;
  text-decoration: line-through;
}

.dia-futuro {
  cursor: pointer;
}

.dia-futuro:hover {
  background: v-bind(corHover);
}

.dia-hoje {
  border: 1.5px solid rgba(var(--cor-primaria-rgb, 124, 58, 237), 0.3);
}

.dia-hoje .dia-numero {
  font-weight: 500;
}
</style>