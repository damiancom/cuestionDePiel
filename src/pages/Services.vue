<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Servicios</div>
        <div class="text-caption text-grey-7">Gestión de servicios ofrecidos, precios y duración estimada</div>
      </div>
      <div class="col-auto row items-center q-gutter-sm">
        <q-input
          v-model="search"
          label="Buscar servicio"
          dense
          borderless
          class="minimal-input"
          :input-style="{ background: 'transparent' }"
          style="max-width: 220px;"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn color="primary" icon="add" label="Agregar servicio" @click="openCreate" id="addServiceBtn" />
      </div>
    </div>

    <q-card flat class="q-pa-md minimal-create-card">
      <q-table
        :rows="filteredServices"
        :columns="columns"
        row-key="id"
        flat
        dense
        :loading="loading"
        :pagination="pagination"
        :rows-per-page-options="[10, 20, 50]"
        class="minimal-table"
        no-data-label="No hay servicios registrados aún"
        @row-click="handleRowClick"
      >
        <template #body-cell-price="props">
          <q-td class="text-left">
            {{ props.row.price != null ? '$' + formatPrice(props.row.price) : '—' }}
          </q-td>
        </template>
        <template #body-cell-estimatedDuration="props">
          <q-td class="text-left">
            <q-chip dense outline color="primary" icon="schedule" size="sm" v-if="props.row.estimatedDuration">
              {{ props.row.estimatedDuration }}
            </q-chip>
            <span v-else class="text-grey-6">—</span>
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

    <!-- Diálogo Crear / Editar Servicio -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-lg dialog-card">
        <div class="text-h6 q-mb-md">{{ editing ? 'Editar Servicio' : 'Agregar Servicio' }}</div>
        <q-form @submit.prevent="saveService" class="q-gutter-y-md">
          <!-- Nombre -->
          <q-input
            v-model="form.name"
            label="Nombre del servicio *"
            class="minimal-input"
            borderless
            dense
            autofocus
            :rules="[val => !!val && val.trim() !== '' || 'El nombre es obligatorio']"
            hide-bottom-space
          />

          <!-- Descripción -->
          <q-input
            v-model="form.description"
            label="Descripción"
            type="textarea"
            rows="3"
            class="minimal-input"
            borderless
            dense
            hide-bottom-space
          />

          <div class="row q-col-gutter-x-md">
            <!-- Precio -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.price"
                label="Precio"
                type="text"
                prefix="$"
                inputmode="decimal"
                class="minimal-input"
                borderless
                dense
                :rules="[val => !val || /^[0-9]+(,[0-9]{1,2})?$/.test(String(val).trim()) || 'Formato inválido (Ej: 1500,50)']"
                hide-bottom-space
              />
            </div>
            <!-- Duración Estimada -->
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.estimatedDuration"
                label="Duración estimada (Ej: 45 min, 1 hs)"
                class="minimal-input"
                borderless
                dense
                hide-bottom-space
              >
                <template #append>
                  <q-icon name="schedule" class="text-grey-6" />
                </template>
              </q-input>
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
import { ServicesAPI } from '../services/api';

const $q = useQuasar();

const loading = ref(false);
const saving = ref(false);
const search = ref('');
const services = ref([]);
const showDialog = ref(false);
const editing = ref(false);
const editId = ref(null);
const pagination = ref({ page: 1, rowsPerPage: 15 });

const form = ref({
  name: '',
  description: '',
  price: '',
  estimatedDuration: '',
});

const columns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'description', label: 'Descripción', field: 'description', align: 'left', sortable: true, format: val => val || '—' },
  { name: 'price', label: 'Precio', field: 'price', align: 'left', sortable: true },
  { name: 'estimatedDuration', label: 'Duración Estimada', field: 'estimatedDuration', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
];

const filteredServices = computed(() => {
  const q = search.value.toLowerCase().trim();
  if (!q) return services.value;
  return services.value.filter(s =>
    (s.name && s.name.toLowerCase().includes(q)) ||
    (s.description && s.description.toLowerCase().includes(q))
  );
});

function formatPrice(val) {
  if (val == null) return '';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? '' : num.toFixed(2).replace('.', ',');
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

async function loadData() {
  loading.value = true;
  try {
    const res = await ServicesAPI.list();
    services.value = res.data || [];
  } catch (e) {
    console.error('Error al cargar servicios:', e);
    $q.notify({ color: 'negative', message: 'Error al cargar servicios', icon: 'error' });
  } finally {
    loading.value = false;
  }
}

function getEmptyForm() {
  return {
    name: '',
    description: '',
    price: '',
    estimatedDuration: '',
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
    name: row.name || '',
    description: row.description || '',
    price: formatPriceWithComma(row.price),
    estimatedDuration: row.estimatedDuration || '',
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

async function saveService() {
  saving.value = true;
  const payload = {
    name: form.value.name.trim(),
    description: form.value.description ? form.value.description.trim() : null,
    price: parsePrice(form.value.price),
    estimatedDuration: form.value.estimatedDuration ? form.value.estimatedDuration.trim() : null,
  };
  try {
    if (editing.value) {
      await ServicesAPI.update(editId.value, payload);
      $q.notify({ color: 'positive', message: 'Servicio actualizado correctamente', icon: 'check' });
    } else {
      await ServicesAPI.create(payload);
      $q.notify({ color: 'positive', message: 'Servicio creado correctamente', icon: 'check' });
    }
    closeDialog();
    await loadData();
  } catch (e) {
    console.error('Error al guardar servicio:', e);
    $q.notify({ color: 'negative', message: 'Error al guardar el servicio', icon: 'error' });
  } finally {
    saving.value = false;
  }
}

function confirmDelete(row) {
  $q.dialog({
    title: 'Eliminar Servicio',
    message: `¿Seguro que querés eliminar el servicio "${row.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await ServicesAPI.remove(row.id);
      $q.notify({ color: 'positive', message: 'Servicio eliminado correctamente', icon: 'check' });
      await loadData();
    } catch (e) {
      console.error('Error al eliminar servicio:', e);
      $q.notify({ color: 'negative', message: 'Error al eliminar el servicio', icon: 'error' });
    }
  });
}

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
  padding: 0 12px !important;
}
.minimal-input:focus-within :deep(.q-field__control) {
  border-color: #1976d2 !important;
}
.minimal-input :deep(.q-field__bottom) {
  padding-top: 12px !important;
  padding-left: 12px !important;
}
.dialog-card {
  min-width: 480px;
  max-width: 98vw;
  border-radius: 16px;
}
.minimal-table :deep(.q-table tbody tr) {
  cursor: pointer;
}
</style>
