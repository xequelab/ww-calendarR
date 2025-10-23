<template>
  <div class="calendario-wrapper">
    <!-- Cabeçalho -->
    <div class="calendario-header">
      <button
        @click="mesAnterior"
        :disabled="ehMesAtual && !permitirMesAnterior"
        class="nav-button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 class="mes-titulo">{{ nomeMesAtual }} {{ anoAtual }}</h2>

      <button @click="proximoMes" class="nav-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Dias da semana -->
    <div class="dias-semana-grid">
      <div v-for="(dia, index) in diasDaSemana" :key="index" class="dia-semana-label">
        {{ dia }}
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

        <!-- Indicador de hoje -->
        <div
          v-if="dia.ehHoje && !dia.ehSelecionado"
          class="indicador-hoje"
          :style="{ backgroundColor: corPrimaria }"
        ></div>
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

    // Configuração do calendário
    const permitirMesAnterior = computed(() => props.content?.permitirMesAnterior ?? false);
    const corPrimaria = computed(() => props.content?.corPrimaria ?? '#4a90e2');
    const corSecundaria = computed(() => props.content?.corSecundaria ?? '#e8f4ff');
    
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
        
        return {
          data: ehDoMesAtual ? data : null,
          numero: data.getDate(),
          ehHoje,
          ehPassado,
          ehFuturo,
          ehSelecionado,
          dataFormatada: format(data, 'yyyy-MM-dd')
        };
      });
    });
    
    // Navegação entre meses
    const proximoMes = () => {
      if (isEditing.value) return;
      dataAtualCalendario.value = addMonths(dataAtualCalendario.value, 1);
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
      
      dataAtualCalendario.value = novaData;
    };
    
    // Selecionar uma data
    const selecionarData = (dia) => {
      if (isEditing.value) return;
      
      // Não permite selecionar dias vazios ou passados
      if (!dia.data || dia.ehPassado) return;
      
      // Atualiza a data selecionada
      setDataSelecionada(dia.dataFormatada);
      
      // Emite o evento de seleção
      emit('trigger-event', {
        name: 'selecao',
        event: { value: dia.dataFormatada }
      });
    };
    
    // Reiniciar o calendário para o mês atual quando o componente é montado
    onMounted(() => {
      dataAtualCalendario.value = new Date();
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

      if (dia.ehPassado) {
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
      corPrimaria,
      corSecundaria,
      getDiaClasses
    };
  }
};
</script>

<style scoped>
.calendario-wrapper {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.calendario-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background-color: v-bind(corPrimaria);
}

.mes-titulo {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
  letter-spacing: 0.3px;
}

.nav-button {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}

.nav-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.nav-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dias-semana-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 16px 16px 8px 16px;
  background: #fafafa;
}

.dia-semana-label {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 0;
}

.dias-mes-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  padding: 16px;
  background: #fafafa;
}

.dia-celula {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.dia-numero {
  font-size: 14px;
  font-weight: 500;
  position: relative;
  z-index: 2;
}

.dia-vazio {
  visibility: hidden;
}

.dia-selecionado {
  background-color: v-bind(corPrimaria) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.dia-selecionado .dia-numero {
  color: white;
  font-weight: 700;
}

.dia-passado {
  opacity: 0.35;
  cursor: not-allowed;
}

.dia-passado .dia-numero {
  color: #999;
}

.dia-futuro {
  cursor: pointer;
}

.dia-futuro:hover {
  background: #f0f0f0;
  transform: scale(1.08);
}

.dia-hoje .dia-numero {
  color: v-bind(corPrimaria);
  font-weight: 700;
}

.indicador-hoje {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  z-index: 1;
}

.dia-atual .dia-numero {
  color: v-bind(corPrimaria);
  font-weight: 700;
}
</style>