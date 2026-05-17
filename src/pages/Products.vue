<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Productos</div>
      </div>
      <div class="col-auto row items-center q-gutter-sm">
        <q-input
          v-model="search"
          label="Buscar por nombre"
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
        <q-btn color="primary" icon="add" label="Agregar producto" @click="showAdd = true" />
      </div>
    </div>
    <q-card flat class="q-pa-md minimal-create-card">
      <q-table
        :rows="filteredProducts"
        :columns="columns"
        row-key="id"
        flat
        dense
        :pagination.sync="pagination"
        :rows-per-page-options="[10, 20, 50]"
        @row-click="editProduct"
        class="minimal-table"
      >
        <template #body-cell-link="props">
          <q-td>
            <a :href="props.row.link" target="_blank" class="text-primary">Ver producto</a>
          </q-td>
        </template>
        <template #body-cell-stock="props">
          <q-td>
            <q-btn flat dense icon="remove" size="sm" @click.stop="changeStock(props.row, -1)" :disable="props.row.stock <= 0" class="q-mr-xs minimal-stock-btn" />
            <span class="q-px-sm">{{ props.row.stock }}</span>
            <q-btn flat dense icon="add" size="sm" @click.stop="changeStock(props.row, 1)" class="q-ml-xs minimal-stock-btn" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td>
            <q-btn flat icon="edit" dense color="primary" @click.stop="editProduct(props.row)" />
            <q-btn flat icon="delete" dense color="negative" @click.stop="deleteProduct(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>
    <!-- Alta/Edición -->
    <q-dialog v-model="showAdd">
      <q-card class="q-pa-lg" style="min-width:340px;max-width:98vw;">
        <div class="text-h6 q-mb-md">{{ editing ? 'Editar producto' : 'Agregar producto' }}</div>
        <q-form @submit.prevent="saveProduct">
          <q-input v-model="form.nombre" label="Nombre" class="minimal-input q-mb-md" borderless dense autofocus />
          <q-input v-model="form.tamano" label="Tamaño (ml o cc)" class="minimal-input q-mb-md" borderless dense />
          <q-input v-model.number="form.stock" label="Stock" type="number" min="0" class="minimal-input q-mb-md" borderless dense />
          <q-input v-model="form.link" label="Enlace al producto" class="minimal-input q-mb-md" borderless dense />
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
const showAdd = ref(false);
const editing = ref(false);
const editIndex = ref(-1);
const search = ref('');
const products = ref([
  { id: 1, nombre: 'Ácido Hialurónico', tamano: '30ml', stock: 15, link: 'https://ejemplo.com/ah30' },
  { id: 2, nombre: 'Vitamina C', tamano: '50ml', stock: 8, link: 'https://ejemplo.com/vc50' },
  { id: 3, nombre: 'Retinol', tamano: '20ml', stock: 20, link: 'https://ejemplo.com/retinol20' },
]);
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'tamano', label: 'Tamaño', field: 'tamano', align: 'left' },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'left' },
  { name: 'link', label: 'Enlace', field: 'link', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
];
const pagination = ref({ page: 1, rowsPerPage: 10 });
const form = ref({ id: null, nombre: '', tamano: '', stock: 0, link: '' });
const filteredProducts = computed(() =>
  products.value.filter(p => p.nombre.toLowerCase().includes(search.value.toLowerCase()))
);
function editProduct(row) {
  editing.value = true;
  showAdd.value = true;
  editIndex.value = products.value.findIndex(p => p.id === row.id);
  Object.assign(form.value, row);
}
function deleteProduct(row) {
  const idx = products.value.findIndex(p => p.id === row.id);
  if (idx !== -1) products.value.splice(idx, 1);
}
function saveProduct() {
  if (editing.value && editIndex.value !== -1) {
    products.value[editIndex.value] = { ...form.value };
  } else {
    const newId = products.value.length ? Math.max(...products.value.map(p => p.id)) + 1 : 1;
    products.value.push({ ...form.value, id: newId });
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
  form.value = { id: null, nombre: '', tamano: '', stock: 0, link: '' };
}
function changeStock(row, delta) {
  const idx = products.value.findIndex(p => p.id === row.id);
  if (idx !== -1) {
    const newStock = products.value[idx].stock + delta;
    products.value[idx].stock = newStock < 0 ? 0 : newStock;
  }
}
</script>
<style scoped>
.minimal-create-card {
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #ececec;
  max-width: 900px;
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
.minimal-stock-btn {
  min-width: 26px;
  min-height: 26px;
  border-radius: 50%;
  color: #1976d2;
}
</style>
