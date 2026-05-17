<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Ventas</div>
      </div>
      <div class="col-auto row items-center q-gutter-sm">
        <q-input v-model="searchVenta" label="Filtrar por N° de venta" dense borderless class="minimal-input" style="max-width: 160px;" />
        <q-select
          v-model="selectedMonthYear"
          :options="monthYearOptions"
          label="Mes y año"
          dense borderless
          emit-value
          map-options
          class="q-ml-sm minimal-input"
          style="min-width: 170px;"
        />
        <q-btn color="primary" icon="add" label="Cargar venta" @click="showAdd = true" />
        <q-btn color="secondary" icon="download" label="Descargar" @click="downloadSales" />
      </div>
    </div>
    <q-card flat class="q-pa-md minimal-create-card">
      <q-table
        :rows="filteredSales"
        :columns="columns"
        row-key="nro"
        flat
        dense
        :pagination.sync="pagination"
        :rows-per-page-options="[10, 20, 50]"
        @row-click="editSale"
        class="minimal-table"
      >
        <template #body-cell-productos="props">
          <q-td>
            <div v-for="p in props.row.productos" :key="p.nombre">
              {{ p.nombre }} <span v-if="p.cantidad">(x{{ p.cantidad }})</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td>
            <q-btn flat icon="edit" dense color="primary" @click.stop="editSale(props.row)" />
            <q-btn flat icon="delete" dense color="negative" @click.stop="deleteSale(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>
    <!-- Alta/Edición -->
    <q-dialog v-model="showAdd">
      <q-card class="q-pa-lg" style="min-width:340px;max-width:98vw;">
        <div class="text-h6 q-mb-md">{{ editing ? 'Editar venta' : 'Cargar venta' }}</div>
        <q-form @submit.prevent="saveSale">
          <q-input v-model.number="form.nro" label="N° de venta" class="minimal-input q-mb-md" borderless dense autofocus />
          <q-input v-model="form.fecha" label="Fecha" type="date" class="minimal-input q-mb-md" borderless dense />
          <div class="q-mb-md">
            <div class="text-caption q-mb-xs">Productos vendidos</div>
            <div v-for="(prod, idx) in form.productos" :key="idx" class="row items-center q-gutter-xs q-mb-xs">
              <q-select
                v-model="prod.nombre"
                :options="productOptions"
                emit-value
                map-options
                use-input
                input-debounce="0"
                new-value-mode="add"
                label="Producto"
                dense borderless
                class="col minimal-input"
                @new-value="val => addProductOption(val)"
              />
              <q-input v-model.number="prod.cantidad" type="number" min="1" label="Cant." dense borderless class="col-2 minimal-input" />
              <q-btn flat dense icon="delete" size="sm" color="negative" @click="removeProd(idx)" />
            </div>
            <q-btn flat dense icon="add" label="Agregar producto" @click="addProd" class="q-mt-xs" />
          </div>
          <q-input v-model.number="form.valor" label="Valor total de la venta" prefix="$" type="number" min="0" class="minimal-input q-mb-md" borderless dense />
          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat label="Cancelar" @click="cancel" />
            <q-btn label="Guardar" color="primary" type="submit" icon="check" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { ref, computed } from 'vue';
// Mock productos (importar real de Products.vue si hay backend)
const productOptions = ref([
  'Ácido Hialurónico',
  'Vitamina C',
  'Retinol',
]);
const now = new Date();
const yearsList = Array.from({length: 6}, (_,i) => now.getFullYear()-i);
const monthsList = [
  { label: 'Enero', value: 0 }, { label: 'Febrero', value: 1 }, { label: 'Marzo', value: 2 },
  { label: 'Abril', value: 3 }, { label: 'Mayo', value: 4 }, { label: 'Junio', value: 5 },
  { label: 'Julio', value: 6 }, { label: 'Agosto', value: 7 }, { label: 'Septiembre', value: 8 },
  { label: 'Octubre', value: 9 }, { label: 'Noviembre', value: 10 }, { label: 'Diciembre', value: 11 }
];
const monthYearOptions = [];
for (const y of yearsList) {
  for (const m of monthsList) {
    monthYearOptions.push({
      label: `${m.label} ${y}`,
      value: `${y}-${String(m.value).padStart(2, '0')}`
    });
  }
}
const selectedMonthYear = ref(`${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`);
const searchVenta = ref('');
const showAdd = ref(false);
const editing = ref(false);
const editIndex = ref(-1);
const sales = ref([
  { nro: 1001, fecha: '2025-06-01', productos: [ { nombre: 'Ácido Hialurónico', cantidad: 2 }, { nombre: 'Vitamina C', cantidad: 1 } ], valor: 15000 },
  { nro: 1002, fecha: '2025-06-02', productos: [ { nombre: 'Retinol', cantidad: 3 } ], valor: 12000 },
]);
const columns = [
  { name: 'nro', label: 'N° Venta', field: 'nro', align: 'left' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' },
  { name: 'productos', label: 'Productos', field: 'productos', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'left', format: val => `$${val}` },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
];
const pagination = ref({ page: 1, rowsPerPage: 10 });
const form = ref({ nro: null, fecha: '', productos: [], valor: 0 });
function addProd() {
  form.value.productos.push({ nombre: '', cantidad: 1 });
}
function removeProd(idx) {
  form.value.productos.splice(idx, 1);
}
function addProductOption(val) {
  if (val && !productOptions.value.includes(val)) productOptions.value.push(val);
}
function editSale(row) {
  editing.value = true;
  showAdd.value = true;
  editIndex.value = sales.value.findIndex(s => s.nro === row.nro);
  // Asegurarse de que los nombres de productos sean strings (para q-select emit-value)
  form.value = JSON.parse(JSON.stringify(row));
  form.value.productos = form.value.productos.map(p => ({
    ...p,
    nombre: typeof p.nombre === 'object' && p.nombre !== null && 'value' in p.nombre ? p.nombre.value : p.nombre
  }));
}
function deleteSale(row) {
  const idx = sales.value.findIndex(s => s.nro === row.nro);
  if (idx !== -1) sales.value.splice(idx, 1);
}
function saveSale() {
  if (editing.value && editIndex.value !== -1) {
    sales.value[editIndex.value] = JSON.parse(JSON.stringify(form.value));
  } else {
    sales.value.push({ ...form.value });
  }
  showAdd.value = false;
  editing.value = false;
  editIndex.value = -1;
  resetForm();
}
function cancel() {
  showAdd.value = false;
  editing.value = false;
  editIndex.value = -1;
  resetForm();
}
function resetForm() {
  form.value = {
    nro: null,
    fecha: getDefaultDate(),
    productos: [],
    valor: 0
  };
}
function getDefaultDate() {
  if (sales.value.length) {
    return sales.value[sales.value.length-1].fecha;
  }
  const d = new Date();
  return d.toISOString().slice(0,10);
}
const filteredSales = computed(() => {
  return sales.value.filter(s => {
    const date = new Date(s.fecha);
    const [selYear, selMonth] = selectedMonthYear.value.split('-').map(Number);
    const monthMatch = date.getMonth() === selMonth;
    const yearMatch = date.getFullYear() === selYear;
    const nroMatch = searchVenta.value ? String(s.nro).includes(searchVenta.value) : true;
    return monthMatch && yearMatch && nroMatch;
  });
});
function downloadSales() {
  // Exportar las ventas filtradas a CSV
  const rows = filteredSales.value;
  if (!rows.length) return;
  const header = ['N° Venta','Fecha','Productos','Valor'];
  const csv = [header.join(',')].concat(
    rows.map(row => [
      row.nro,
      row.fecha,
      row.productos.map(p=>`${p.nombre} (x${p.cantidad})`).join(' | '),
      row.valor
    ].map(val => `"${val}"`).join(','))
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ventas_${selectedMonthYear.value}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
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
</style>
