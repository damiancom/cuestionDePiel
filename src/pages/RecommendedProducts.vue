<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Catálogo de Productos Recomendados</div>
        <div class="text-caption text-grey-7">Productos que recomendás en las rutinas faciales</div>
      </div>
      <div class="col-auto row items-center q-gutter-sm">
        <q-input
          v-model="search"
          label="Buscar"
          dense
          borderless
          class="minimal-input"
          :input-style="{background: 'transparent'}"
          style="max-width: 200px;"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn color="primary" icon="add" label="Agregar producto" @click="openCreate" id="addRecommendedProduct" />
      </div>
    </div>

    <q-card flat class="q-pa-md minimal-create-card">
      <q-table
        :rows="filteredProducts"
        :columns="columns"
        row-key="id"
        flat
        dense
        :loading="loading"
        :pagination="pagination"
        :rows-per-page-options="[10, 20, 50]"
        class="minimal-table"
        no-data-label="No hay productos cargados aún"
      >
        <template #body-cell-skin_type="props">
          <q-td>
            <q-badge
              :color="skinTypeBadgeColor(props.row.skin_type)"
              :label="skinTypeLabel(props.row.skin_type)"
              class="q-px-sm"
            />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td class="text-right">
            <q-btn flat icon="edit" dense color="primary" @click.stop="openEdit(props.row)" />
            <q-btn flat icon="delete" dense color="negative" @click.stop="confirmDelete(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Diálogo Crear / Editar -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-lg dialog-card">
        <div class="text-h6 q-mb-md">{{ editing ? 'Editar Producto' : 'Agregar Producto' }}</div>
        <q-form @submit.prevent="saveProduct" class="q-gutter-md">

          <!-- Tipo de Producto -->
          <q-select
            v-model="form.productTypeName"
            :options="filteredProductTypes"
            label="Tipo de Producto"
            use-input
            input-debounce="0"
            @filter="filterProductTypes"
            @new-value="addNewProductType"
            new-value-mode="add"
            hint="Ej: Limpieza, Tónico, Serum..."
            class="minimal-input"
            borderless
            dense
            :rules="[val => !!val || 'Requerido']"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Escribí para crear uno nuevo</q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Marca -->
          <q-select
            v-model="form.brandName"
            :options="filteredBrands"
            label="Marca"
            use-input
            input-debounce="0"
            @filter="filterBrands"
            @new-value="addNewBrand"
            new-value-mode="add"
            hint="Ej: CeraVe, La Roche-Posay, Avene..."
            class="minimal-input"
            borderless
            dense
            :rules="[val => !!val || 'Requerido']"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Escribí para crear una nueva</q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Nombre del Producto -->
          <q-input
            v-model="form.name"
            label="Nombre del Producto"
            class="minimal-input"
            borderless
            dense
            :rules="[val => !!val || 'Requerido']"
          />

          <!-- Tipo de Piel -->
          <q-select
            v-model="form.skinType"
            :options="skinTypeOptions"
            label="Tipo de Piel"
            class="minimal-input"
            borderless
            dense
            emit-value
            map-options
            clearable
          />

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat label="Cancelar" @click="closeDialog" />
            <q-btn label="Guardar" color="primary" type="submit" icon="check" :loading="saving" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { RecommendedProductsAPI } from '../services/api';

const $q = useQuasar();

// State
const loading = ref(false);
const saving = ref(false);
const search = ref('');
const products = ref([]);
const brands = ref([]);
const productTypes = ref([]);
const filteredBrands = ref([]);
const filteredProductTypes = ref([]);
const showDialog = ref(false);
const editing = ref(false);
const editId = ref(null);
const pagination = ref({ page: 1, rowsPerPage: 20 });

const form = ref({
  name: '',
  brandName: '',
  productTypeName: '',
  skinType: null,
});

const skinTypeOptions = [
  { label: 'Piel Grasa', value: 'PIEL_GRASA' },
  { label: 'Piel Mixta', value: 'PIEL_MIXTA' },
  { label: 'Piel Seca', value: 'PIEL_SECA' },
];

const columns = [
  { name: 'product_type_name', label: 'Tipo', field: 'product_type_name', align: 'left', sortable: true },
  { name: 'brand_name', label: 'Marca', field: 'brand_name', align: 'left', sortable: true },
  { name: 'name', label: 'Producto', field: 'name', align: 'left', sortable: true },
  { name: 'skin_type', label: 'Tipo de Piel', field: 'skin_type', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
];

// Computed
const filteredProducts = computed(() => {
  const q = search.value.toLowerCase();
  if (!q) return products.value;
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand_name.toLowerCase().includes(q) ||
    p.product_type_name.toLowerCase().includes(q)
  );
});

// Helpers
function skinTypeLabel(val) {
  const opt = skinTypeOptions.find(o => o.value === val);
  return opt ? opt.label : val || '—';
}

function skinTypeBadgeColor(val) {
  if (val === 'PIEL_GRASA') return 'blue-7';
  if (val === 'PIEL_MIXTA') return 'teal-7';
  if (val === 'PIEL_SECA') return 'orange-7';
  return 'grey-5';
}

// Filter functions for q-select autocomplete
function filterBrands(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filteredBrands.value = brands.value.filter(b => b.toLowerCase().includes(needle));
  });
}

function filterProductTypes(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filteredProductTypes.value = productTypes.value.filter(t => t.toLowerCase().includes(needle));
  });
}

function addNewBrand(val, done) {
  if (val.trim()) {
    if (!brands.value.some(b => b.toLowerCase() === val.trim().toLowerCase())) {
      brands.value.push(val.trim());
    }
    done(val.trim(), 'add');
  }
}

function addNewProductType(val, done) {
  if (val.trim()) {
    if (!productTypes.value.some(t => t.toLowerCase() === val.trim().toLowerCase())) {
      productTypes.value.push(val.trim());
    }
    done(val.trim(), 'add');
  }
}

// CRUD
async function loadData() {
  loading.value = true;
  try {
    const [prodRes, brandsRes, typesRes] = await Promise.all([
      RecommendedProductsAPI.list(),
      RecommendedProductsAPI.getBrands(),
      RecommendedProductsAPI.getProductTypes(),
    ]);
    products.value = prodRes.data;
    brands.value = brandsRes.data;
    productTypes.value = typesRes.data;
  } catch (e) {
    console.error('Error cargando datos:', e);
    $q.notify({ color: 'negative', message: 'Error al cargar productos', icon: 'error' });
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editing.value = false;
  editId.value = null;
  form.value = { name: '', brandName: '', productTypeName: '', skinType: null };
  showDialog.value = true;
}

function openEdit(row) {
  editing.value = true;
  editId.value = row.id;
  form.value = {
    name: row.name,
    brandName: row.brand_name,
    productTypeName: row.product_type_name,
    skinType: row.skin_type || null,
  };
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
  editing.value = false;
  editId.value = null;
}

async function saveProduct() {
  saving.value = true;
  const payload = {
    name: form.value.name,
    brand_name: form.value.brandName,
    product_type_name: form.value.productTypeName,
    skin_type: form.value.skinType || null,
  };
  try {
    if (editing.value) {
      await RecommendedProductsAPI.update(editId.value, payload);
      $q.notify({ color: 'positive', message: 'Producto actualizado', icon: 'check' });
    } else {
      await RecommendedProductsAPI.create(payload);
      $q.notify({ color: 'positive', message: 'Producto creado', icon: 'check' });
    }
    closeDialog();
    await loadData();
  } catch (e) {
    console.error('Error guardando producto:', e);
    $q.notify({ color: 'negative', message: 'Error al guardar', icon: 'error' });
  } finally {
    saving.value = false;
  }
}

function confirmDelete(row) {
  $q.dialog({
    title: 'Eliminar producto',
    message: `¿Seguro que querés eliminar "${row.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await RecommendedProductsAPI.remove(row.id);
      $q.notify({ color: 'positive', message: 'Producto eliminado', icon: 'check' });
      await loadData();
    } catch (e) {
      console.error('Error eliminando producto:', e);
      $q.notify({ color: 'negative', message: 'Error al eliminar', icon: 'error' });
    }
  });
}

// Init
onMounted(loadData);
</script>

<style scoped>
.minimal-create-card {
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #ececec;
  max-width: 1000px;
  width: 100%;
  margin: auto;
}
.minimal-input {
  background: transparent !important;
  border-radius: 10px;
  border: none !important;
  box-shadow: none !important;
  font-size: 15px;
  padding: 8px 12px;
  transition: border-color 0.2s;
  border-bottom: 1.5px solid #e0e4ea !important;
}
.dialog-card {
  min-width: 420px;
  max-width: 98vw;
  border-radius: 16px;
}
</style>
