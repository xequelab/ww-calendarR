<template>
  <div class="calendario-agendamento">
    <div class="calendario-cabecalho">
      <button 
        class="botao-navegacao" 
        @click="mesAnterior" 
        :disabled="ehMesAtual && !permitirMesAnterior"
      >
        &lt;
      </button>
      <div class="mes-ano">{{ nomeMesAtual }} {{ anoAtual }}</div>
      <button class="botao-navegacao" @click="proximoMes">
        &gt;
      </button>
    </div>
    
    <div class="dias-semana">
      <div v-for="(dia, index) in diasDaSemana" :key="index" class="dia-semana">
        {{ dia }}
      </div>
    </div>
    
    <div class="dias-grid">
      <div 
        v-for="(dia, index) in diasDoMes" 
        :key="index"
        class="celula-dia"
        :class="{
          'dia-vazio': !dia.data,
          'dia-atual': dia.ehHoje,
          'dia-selecionado': dia.ehSelecionado,
          'dia-passado': dia.ehPassado,
          'dia-futuro': dia.ehFuturo
        }"
        @click="selecionarData(dia)"
      >
        <span v-if="dia.data">{{ dia.numero }}</span>
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
      corSecundaria
    };
  }
};
</script>

<style lang="scss" scoped>
.calendario-agendamento {
  font-family: Arial, sans-serif;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.calendario-cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: v-bind(corPrimaria);
  color: white;
  font-weight: bold;
}

.mes-ano {
  font-size: 18px;
}

.botao-navegacao {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: v-bind(corSecundaria);
  border-bottom: 1px solid #eee;
}

.dia-semana {
  padding: 10px 0;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
}

.dias-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
}

.celula-dia {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  
  &:hover:not(.dia-vazio):not(.dia-passado) {
    background-color: #f5f5f5;
  }
  
  &.dia-vazio {
    cursor: default;
  }
  
  &.dia-atual {
    font-weight: bold;
    color: v-bind(corPrimaria);
    
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: v-bind(corPrimaria);
    }
  }
  
  &.dia-selecionado {
    background-color: v-bind(corPrimaria);
    color: white;
    border-radius: 50%;
    
    &::after {
      display: none;
    }
  }
  
  &.dia-passado {
    color: #ccc;
    cursor: not-allowed;
  }
}
</style>