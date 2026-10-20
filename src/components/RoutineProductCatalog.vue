<template>
  <div class="catalog-product-list column full-height">
    <!-- Buscador -->
    <q-input
      v-model="search"
      placeholder="Buscar por nombre, marca o función..."
      dense
      borderless
      class="minimal-search-input full-width q-mb-sm"
      clearable
    >
      <template #prepend>
        <q-icon name="search" size="20px" color="primary" />
      </template>
    </q-input>

    <!-- Filtros rápidos por Categoría -->
    <div class="category-chips-scroll q-mb-sm">
      <q-chip
        v-for="cat in categories"
        :key="cat"
        clickable
        dense
        :color="selectedCategory === cat ? 'primary' : 'grey-2'"
        :text-color="selectedCategory === cat ? 'white' : 'grey-8'"
        class="text-caption q-mr-xs q-mb-xs"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </q-chip>
    </div>

    <!-- Filtro de stock y contador -->
    <div class="row items-center justify-between q-mb-sm text-caption text-grey-7">
      <span>{{ filtered.length }} producto{{ filtered.length === 1 ? '' : 's' }}</span>
      <q-toggle
        v-model="onlyInStock"
        label="Solo con stock"
        dense
        size="xs"
        color="positive"
      />
    </div>

    <!-- Lista de Productos -->
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

        <!-- Acciones de inserción a Rutina -->
        <div class="row items-center justify-between q-mt-xs pt-1 border-top-faint">
          <span class="text-xs text-grey-6">Agregar a rutina:</span>
          <div class="row q-gutter-xs">
            <q-btn
              flat
              dense
              size="sm"
              color="amber-9"
              icon="wb_sunny"
              label="Día"
              class="q-px-xs action-btn"
              @click="$emit('insert-product', { product: prod, targetPeriod: 'day' })"
            >
              <q-tooltip>Añadir a pasos de Día</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              size="sm"
              color="indigo-7"
              icon="bedtime"
              label="Noche"
              class="q-px-xs action-btn"
              @click="$emit('insert-product', { product: prod, targetPeriod: 'night' })"
            >
              <q-tooltip>Añadir a pasos de Noche</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="text-center text-grey-6 q-pa-lg text-caption">
        No hay productos disponibles con el criterio seleccionado.
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
    default: () => ({ period: 'day', index: 0 })
  }
});

defineEmits(['insert-product']);

const search = ref('');
const selectedCategory = ref('Todos');
const onlyInStock = ref(false);

function formatPrice(val) {
  if (val == null) return '';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? '' : num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Categorías dinámicas
const categories = computed(() => {
  const set = new Set();
  props.products.forEach(p => {
    const cat = p.category_name || p.function_name;
    if (cat) set.add(cat.trim());
  });
  return ['Todos', ...Array.from(set).sort()];
});

// Filtro reactivo
const filtered = computed(() => {
  const q = search.value.toLowerCase().trim();
  return props.products.filter(p => {
    if (onlyInStock.value && (!p.stock || p.stock <= 0)) return false;
    if (selectedCategory.value !== 'Todos') {
      const cat = p.category_name || p.function_name || '';
      if (cat.trim().toLowerCase() !== selectedCategory.value.toLowerCase()) return false;
    }
    if (!q) return true;
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

.category-chips-scroll {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 4px;
}

.products-scroll-area {
  overflow-y: auto;
  padding-right: 4px;
  max-height: calc(100vh - 240px);
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
