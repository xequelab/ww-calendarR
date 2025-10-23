<template>
  <div class="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
    <!-- Cabeçalho -->
    <div class="px-6 py-5 flex items-center justify-between" :style="{ backgroundColor: corPrimaria }">
      <button
        @click="mesAnterior"
        :disabled="ehMesAtual && !permitirMesAnterior"
        class="p-2 rounded-lg transition-all duration-200 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 class="text-xl font-semibold text-white tracking-wide">
        {{ nomeMesAtual }} {{ anoAtual }}
      </h2>

      <button
        @click="proximoMes"
        class="p-2 rounded-lg transition-all duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Dias da semana -->
    <div class="grid grid-cols-7 gap-px bg-gray-100 px-4 py-3">
      <div
        v-for="(dia, index) in diasDaSemana"
        :key="index"
        class="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider py-2"
      >
        {{ dia }}
      </div>
    </div>

    <!-- Grid de dias -->
    <div class="grid grid-cols-7 gap-1 p-4 bg-gray-50/30">
      <div
        v-for="(dia, index) in diasDoMes"
        :key="index"
        @click="selecionarData(dia)"
        class="aspect-square flex items-center justify-center text-sm font-medium transition-all duration-200 rounded-xl relative group"
        :class="getDiaClasses(dia)"
      >
        <span v-if="dia.data" class="relative z-10">{{ dia.numero }}</span>

        <!-- Indicador de hoje -->
        <div
          v-if="dia.ehHoje && !dia.ehSelecionado"
          class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full"
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
        classes.push('invisible');
        return classes;
      }

      if (dia.ehSelecionado) {
        classes.push('dia-selecionado text-white font-bold shadow-lg scale-105');
        return classes;
      }

      if (dia.ehPassado) {
        classes.push('text-gray-300 cursor-not-allowed');
      } else {
        classes.push('cursor-pointer hover:bg-gray-100 hover:scale-105 text-gray-700');

        if (dia.ehHoje) {
          classes.push('font-bold dia-atual-cor');
        }
      }

      return classes;
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
/* Estilos customizados para dia selecionado com cor dinâmica */
.dia-selecionado {
  background-color: v-bind(corPrimaria);
}

/* Estilos customizados para dia atual */
.dia-atual-cor {
  color: v-bind(corPrimaria);
}

/* Animações suaves */
* {
  transition-property: background-color, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>