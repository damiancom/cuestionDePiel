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
        @row-click="handleRowClick"
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
        <template #body-cell-stock="props">
          <q-td class="text-center">
            <q-btn flat dense icon="remove" size="sm" @click.stop="changeStock(props.row, -1)" :disable="!props.row.stock || props.row.stock <= 0" class="q-mr-xs minimal-stock-btn" />
            <span class="q-px-sm">{{ props.row.stock || 0 }}</span>
            <q-btn flat dense icon="add" size="sm" @click.stop="changeStock(props.row, 1)" class="q-ml-xs minimal-stock-btn" />
          </q-td>
        </template>
        <template #body-cell-purchase_price="props">
          <q-td class="text-left">
            {{ props.row.purchase_price != null ? '$' + props.row.purchase_price.toFixed(2).replace('.', ',') : '—' }}
          </q-td>
        </template>
        <template #body-cell-selling_price="props">
          <q-td class="text-left">
            {{ props.row.selling_price != null ? '$' + props.row.selling_price.toFixed(2).replace('.', ',') : '—' }}
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
        <div class="text-h6 q-mb-lg">{{ editing ? 'Editar Producto' : 'Agregar Producto' }}</div>
        <q-form @submit.prevent="saveProduct" class="q-gutter-y-md">

          <!-- Categoría -->
          <q-select
            v-model="form.categoryName"
            :options="filteredCategories"
            label="Categoría"
            use-input
            input-debounce="0"
            @filter="filterCategories"
            @new-value="addNewCategory"
            new-value-mode="add"
            class="minimal-input"
            borderless
            dense
            :rules="[val => !!val || 'Requerido']"
            hide-bottom-space
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Escribí para crear una nueva</q-item-section>
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
            class="minimal-input"
            borderless
            dense
            :rules="[val => !!val || 'Requerido']"
            hide-bottom-space
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
            hide-bottom-space
          />

          <!-- Función -->
          <q-select
            v-model="form.functionName"
            :options="filteredFunctions"
            label="Función"
            use-input
            input-debounce="0"
            @filter="filterFunctions"
            @new-value="addNewFunction"
            new-value-mode="add"
            class="minimal-input"
            borderless
            dense
            clearable
            maxlength="50"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Escribí para crear una nueva</q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Tipo de Piel -->
          <q-select
            v-model="form.skinType"
            :options="skinTypeOptions"
            label="Tipo de Piel / Uso"
            class="minimal-input"
            borderless
            dense
            emit-value
            map-options
            clearable
          />

          <!-- Stock y Fecha de Vencimiento -->
          <div class="row q-col-gutter-x-md">
            <!-- Stock -->
            <div class="col-6">
              <q-input
                v-model.number="form.stock"
                label="Stock"
                type="number"
                min="0"
                class="minimal-input"
                borderless
                dense
              />
            </div>
            <!-- Fecha de Vencimiento -->
            <div class="col-6">
              <q-input
                v-model="form.expirationDate"
                label="Fecha de Vencimiento"
                mask="##/####"
                placeholder="MM/AAAA"
                class="minimal-input"
                borderless
                dense
                :rules="[val => !val || /^(0[1-9]|1[0-2])\/\d{4}$/.test(val) || 'Formato inválido (MM/AAAA)']"
                hide-bottom-space
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="form.expirationDate"
                        mask="MM/YYYY"
                        default-view="Months"
                        :default-year-month="currentYearMonth"
                        emit-immediately
                        minimal
                        @update:model-value="() => qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <!-- Precios -->
          <div class="row q-col-gutter-x-md">
            <!-- Precio de Costo -->
            <div class="col-6">
              <q-input
                v-model="form.purchasePrice"
                label="Precio de Costo"
                type="text"
                prefix="$"
                inputmode="decimal"
                class="minimal-input"
                borderless
                dense
                :rules="[val => !val || /^[0-9]+(,[0-9]{1,2})?$/.test(String(val).trim()) || 'Formato inválido (Ej: 150,50)']"
                hide-bottom-space
              />
            </div>
            <!-- Precio de Venta -->
            <div class="col-6">
              <q-input
                v-model="form.sellingPrice"
                label="Precio de Venta"
                type="text"
                prefix="$"
                inputmode="decimal"
                class="minimal-input"
                borderless
                dense
                :rules="[val => !val || /^[0-9]+(,[0-9]{1,2})?$/.test(String(val).trim()) || 'Formato inválido (Ej: 150,50)']"
                hide-bottom-space
              />
            </div>
          </div>

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
const categories = ref([]);
const functions = ref([]);
const filteredBrands = ref([]);
const filteredCategories = ref([]);
const filteredFunctions = ref([]);
const showDialog = ref(false);
const editing = ref(false);
const editId = ref(null);
const qDateProxy = ref(null);
const pagination = ref({ page: 1, rowsPerPage: 20 });

const form = ref({
  name: '',
  brandName: '',
  categoryName: '',
  functionName: null,
  skinType: null,
  stock: 0,
  expirationDate: '',
  purchasePrice: null,
  sellingPrice: null,
});

const skinTypeOptions = [
  { label: 'Piel Grasa', value: 'PIEL_GRASA' },
  { label: 'Piel Mixta', value: 'PIEL_MIXTA' },
  { label: 'Piel Seca', value: 'PIEL_SECA' },
];

const columns = [
  { name: 'category_name', label: 'Categoría', field: 'category_name', align: 'left', sortable: true },
  { name: 'brand_name', label: 'Marca', field: 'brand_name', align: 'left', sortable: true },
  { name: 'name', label: 'Producto', field: 'name', align: 'left', sortable: true },
  { name: 'selling_price', label: 'P. Venta', field: 'selling_price', align: 'left', sortable: true },
  { name: 'function_name', label: 'Función', field: 'function_name', align: 'left', sortable: true, format: val => val || '—' },
  { name: 'skin_type', label: 'Tipo de Piel', field: 'skin_type', align: 'left', sortable: true },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'center', sortable: true },
  { name: 'expiration_date', label: 'Vcto.', field: 'expiration_date', align: 'left', sortable: true, format: val => val || '—' },
  { name: 'purchase_price', label: 'P. Costo', field: 'purchase_price', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'left' },
];

// Computed
const filteredProducts = computed(() => {
  const q = search.value.toLowerCase();
  if (!q) return products.value;
  return products.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand_name.toLowerCase().includes(q) ||
    p.category_name.toLowerCase().includes(q) ||
    (p.function_name && p.function_name.toLowerCase().includes(q))
  );
});
const currentYearMonth = computed(() => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return `${yyyy}/${mm}`;
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

function formatPriceWithComma(val) {
  if (val == null) return '';
  return String(val).replace('.', ',');
}

function parsePrice(val) {
  if (val == null || String(val).trim() === '') return null;
  const cleanVal = String(val).replace(',', '.').trim();
  const num = parseFloat(cleanVal);
  return isNaN(num) ? null : num;
}

// Filter functions for q-select autocomplete
function filterBrands(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filteredBrands.value = brands.value.filter(b => b.toLowerCase().includes(needle));
  });
}

function filterCategories(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filteredCategories.value = categories.value.filter(c => c.toLowerCase().includes(needle));
  });
}

function filterFunctions(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filteredFunctions.value = functions.value.filter(f => f.toLowerCase().includes(needle));
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

function addNewCategory(val, done) {
  if (val.trim()) {
    if (!categories.value.some(c => c.toLowerCase() === val.trim().toLowerCase())) {
      categories.value.push(val.trim());
    }
    done(val.trim(), 'add');
  }
}

function addNewFunction(val, done) {
  if (val.trim() && val.trim().length <= 50) {
    if (!functions.value.some(f => f.toLowerCase() === val.trim().toLowerCase())) {
      functions.value.push(val.trim());
    }
    done(val.trim(), 'add');
  }
}

// CRUD
async function loadData() {
  loading.value = true;
  try {
    const [prodRes, brandsRes, categoriesRes, functionsRes] = await Promise.all([
      RecommendedProductsAPI.list(),
      RecommendedProductsAPI.getBrands(),
      RecommendedProductsAPI.getCategories(),
      RecommendedProductsAPI.getFunctions(),
    ]);
    products.value = prodRes.data;
    brands.value = brandsRes.data;
    categories.value = categoriesRes.data;
    functions.value = functionsRes.data;
  } catch (e) {
    console.error('Error cargando datos:', e);
    $q.notify({ color: 'negative', message: 'Error al cargar productos', icon: 'error' });
  } finally {
    loading.value = false;
  }
}

function getEmptyForm() {
  return {
    name: '',
    brandName: '',
    categoryName: '',
    functionName: null,
    skinType: null,
    stock: 0,
    expirationDate: '',
    purchasePrice: '',
    sellingPrice: '',
  };
}

function openCreate() {
  editing.value = false;
  editId.value = null;
  form.value = getEmptyForm();
  showDialog.value = true;
}

function openEdit(row) {
  editing.value = true;
  editId.value = row.id;
  form.value = {
    name: row.name,
    brandName: row.brand_name,
    categoryName: row.category_name,
    functionName: row.function_name || null,
    skinType: row.skin_type || null,
    stock: row.stock || 0,
    expirationDate: row.expiration_date || '',
    purchasePrice: formatPriceWithComma(row.purchase_price),
    sellingPrice: formatPriceWithComma(row.selling_price),
  };
  showDialog.value = true;
}

function handleRowClick(evt, row) {
  if (evt.target.closest('.q-btn') || evt.target.closest('.q-checkbox')) {
    return;
  }
  openEdit(row);
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
    category_name: form.value.categoryName,
    function_name: form.value.functionName || null,
    skin_type: form.value.skinType || null,
    stock: form.value.stock || 0,
    expiration_date: form.value.expirationDate || null,
    purchase_price: parsePrice(form.value.purchasePrice),
    selling_price: parsePrice(form.value.sellingPrice),
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

async function changeStock(row, delta) {
  const newStock = (row.stock || 0) + delta;
  if (newStock < 0) return;
  try {
    await RecommendedProductsAPI.update(row.id, { stock: newStock });
    row.stock = newStock;
  } catch (e) {
    console.error('Error actualizando stock:', e);
    $q.notify({ color: 'negative', message: 'Error al actualizar stock', icon: 'error' });
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
  width: 100%;
  margin: auto;
}
.minimal-table :deep(.q-table__middle) {
  overflow-x: auto !important;
}
.minimal-input {
  background: transparent !important;
  box-shadow: none !important;
  font-size: 15px;
}
.minimal-input :deep(.q-field__control) {
  border-bottom: 1.5px solid #e0e4ea !important;
  transition: border-color 0.2s;
  padding: 0 12px !important; /* Margen horizontal premium de 12px */
}
.minimal-input:focus-within :deep(.q-field__control) {
  border-color: #1976d2 !important;
}
.minimal-input :deep(.q-field__bottom) {
  padding-top: 12px !important; /* 12px de separación con respecto a la línea inferior */
  padding-left: 12px !important; /* Alineado exactamente a 12px */
}
.dialog-card {
  min-width: 520px;
  max-width: 98vw;
  border-radius: 16px;
}
.minimal-stock-btn {
  min-width: 26px;
  min-height: 26px;
  border-radius: 50%;
  color: #1976d2;
}
.minimal-table :deep(.q-table tbody tr) {
  cursor: pointer;
}
</style>
