<template>
  <div class="catalog-product-list column full-height">
    <!-- Buscador directo (sin filtros voluminosos que quitan espacio vertical) -->
    <q-input
      v-model="search"
      placeholder="Buscar por nombre, marca o función..."
      dense
      borderless
      class="minimal-search-input full-width q-mb-sm"
      clearable
      autofocus
    >
      <template #prepend>
        <q-icon name="search" size="20px" color="primary" />
      </template>
      <template #append v-if="search">
        <span class="text-caption text-grey-6 text-xs">{{ filtered.length }}</span>
      </template>
    </q-input>

    <!-- Aviso de contexto para la rutina (si está en la pestaña de Rutina) -->
    <div
      v-if="showRoutineActions && !activeStep"
      class="text-caption text-grey-7 bg-blue-1 q-pa-xs rounded-borders text-center q-mb-sm row items-center justify-center no-wrap"
    >
      <q-icon name="touch_app" size="16px" color="primary" class="q-mr-xs" />
      <span>Selecciona un paso en la rutina para añadir productos</span>
    </div>
    <div
      v-else-if="showRoutineActions && activeStep"
      class="text-caption text-primary bg-blue-1 q-pa-xs rounded-borders text-center q-mb-sm row items-center justify-center no-wrap text-weight-medium"
    >
      <q-icon
        :name="activeStep.period === 'day' ? 'wb_sunny' : 'bedtime'"
        size="16px"
        :color="activeStep.period === 'day' ? 'amber-9' : 'indigo-7'"
        class="q-mr-xs"
      />
      <span>Añadiendo a Paso {{ activeStep.index + 1 }} de {{ activeStep.period === 'day' ? 'Día' : 'Noche' }}</span>
    </div>

    <!-- Lista de Productos (aprovecha toda la altura vertical) -->
    <div class="products-scroll-area col">
      <div
        v-for="prod in filtered"
        :key="prod.id"
        class="catalog-product-item q-pa-sm q-mb-xs rounded-borders"
      >
        <div class="row items-start justify-between no-wrap">
          <div class="col ellipsis-2-lines q-pr-xs">
            <div class="text-weight-bold text-subtitle2 text-primary leading-tight">
              {{ prod.name }}
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              {{ prod.brand_name }}
              <span v-if="prod.category_name || prod.function_name"> · {{ prod.category_name || prod.function_name }}</span>
            </div>
          </div>

          <div class="text-right no-wrap">
            <div class="text-weight-bolder text-subtitle2 text-grey-9">
              {{ prod.selling_price != null ? '$' + formatPrice(prod.selling_price) : '—' }}
            </div>
            <q-badge
              :color="prod.stock > 0 ? 'green-1' : 'grey-3'"
              :text-color="prod.stock > 0 ? 'positive' : 'grey-7'"
              class="text-xs text-weight-medium q-mt-xs"
            >
              {{ prod.stock > 0 ? prod.stock + ' disp.' : 'Sin stock' }}
            </q-badge>
          </div>
        </div>

        <!-- Acciones de inserción a Rutina: solo si hay un paso seleccionado -->
        <div v-if="showRoutineActions && activeStep" class="row items-center justify-between q-mt-xs pt-1 border-top-faint">
          <span class="text-xs text-grey-6">
            Paso {{ activeStep.index + 1 }} ({{ activeStep.period === 'day' ? 'Día' : 'Noche' }}):
          </span>
          <div>
            <q-btn
              v-if="activeStep.period === 'day'"
              flat
              dense
              size="sm"
              color="amber-9"
              icon="wb_sunny"
              label="Agregar a Día"
              class="q-px-xs action-btn text-weight-medium"
              @click="$emit('insert-product', { product: prod, targetPeriod: 'day' })"
            >
              <q-tooltip>Añadir al paso {{ activeStep.index + 1 }} de Día</q-tooltip>
            </q-btn>
            <q-btn
              v-if="activeStep.period === 'night'"
              flat
              dense
              size="sm"
              color="indigo-7"
              icon="bedtime"
              label="Agregar a Noche"
              class="q-px-xs action-btn text-weight-medium"
              @click="$emit('insert-product', { product: prod, targetPeriod: 'night' })"
            >
              <q-tooltip>Añadir al paso {{ activeStep.index + 1 }} de Noche</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="text-center text-grey-6 q-pa-lg text-caption">
        No hay productos que coincidan con la búsqueda.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  },
  activeStep: {
    type: Object,
    default: null
  },
  showRoutineActions: {
    type: Boolean,
    default: false
  }
});

defineEmits(['insert-product']);

const search = ref('');

function formatPrice(val) {
  if (val == null) return '';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? '' : num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Búsqueda instantánea y limpia sin chips que resten altura
const filtered = computed(() => {
  const q = search.value.toLowerCase().trim();
  if (!q) return props.products;
  return props.products.filter(p => {
    const name = String(p.name || '').toLowerCase();
    const brand = String(p.brand_name || '').toLowerCase();
    const cat = String(p.category_name || '').toLowerCase();
    const func = String(p.function_name || '').toLowerCase();
    const skin = String(p.skin_type || '').toLowerCase();
    return name.includes(q) || brand.includes(q) || cat.includes(q) || func.includes(q) || skin.includes(q);
  });
});
</script>

<style scoped>
.catalog-product-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.products-scroll-area {
  overflow-y: auto;
  padding-right: 4px;
}

.catalog-product-item {
  border: 1px solid #e0e4ea;
  background: #ffffff;
  transition: all 0.15s ease;
}

.catalog-product-item:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.08);
}

.leading-tight {
  line-height: 1.25;
}

.border-top-faint {
  border-top: 1px solid #f1f5f9;
}

.action-btn {
  font-weight: 500;
  border-radius: 6px;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.text-xs {
  font-size: 0.72rem;
}
</style>
