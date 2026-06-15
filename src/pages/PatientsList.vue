<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Pacientes ({{ filteredPatients.length }})</div>
        <div class="text-caption text-grey-7">Mostrando {{ paginatedPatients.length }} de {{
            filteredPatients.length
          }}
        </div>
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
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn color="primary" label="Agregar paciente" to="/pacientes/nuevo"/>
      </div>
    </div>
    <q-table
        :rows="paginatedPatients"
        :columns="columns"
        row-key="id"
        flat
        dense
        :grid="$q.screen.lt.md"
        :pagination.sync="pagination"
        :rows-per-page-options="[20]"
        @row-click="goToDetail"
        class="q-mb-md minimal-table"
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-card @click="goToDetail(null, props.row)" class="cursor-pointer minimal-card q-py-sm">
            <q-card-section class="row items-center no-wrap">
              <q-avatar size="44px" class="q-mr-md">
                <img v-if="props.row.photo" :src="props.row.photo" alt="avatar"/>
                <q-icon v-else name="person"/>
              </q-avatar>
              <div class="col ellipsis">
                <div class="text-weight-medium text-subtitle1 text-primary">{{ props.row.fullName }}</div>
                <div class="text-caption text-grey-7">{{ props.row.email }}</div>
                <div class="text-caption text-grey-7">
                  {{ formatDate(props.row.birthDate) }} • {{ calculateAge(props.row.birthDate) }} años
                </div>
              </div>
              <q-space />
              <q-btn color="negative" icon="delete" flat dense @click.stop="confirmDelete(props.row)"/>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template #body-cell-avatar="props">
        <q-td>
          <q-avatar size="40px">
            <img v-if="props.row.photo" :src="props.row.photo" alt="avatar"/>
            <q-icon v-else name="person"/>
          </q-avatar>
        </q-td>
      </template>
      <template #body-cell-name="props">
        <q-td>
          <div class="text-weight-medium">{{ props.row.fullName }}</div>
          <div class="text-caption text-grey-7">{{ props.row.email }}</div>
        </q-td>
      </template>
      <template #body-cell-birthDate="props">
        <q-td>
          {{ formatDate(props.row.birthDate) }}
        </q-td>
      </template>
      <template #body-cell-age="props">
        <q-td>
          {{ calculateAge(props.row.birthDate) }} años
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-btn color="negative" icon="delete" flat dense @click.stop="confirmDelete(props.row)"/>
      </template>
    </q-table>
    <q-pagination
        v-model="pagination.page"
        :max="Math.ceil(filteredPatients.length / pagination.rowsPerPage)"
        max-pages="6"
        boundary-numbers
        color="primary"
        class="q-mt-md minimal-pagination"
    />
    <q-dialog v-model="showConfirm">
      <q-card>
        <q-card-section>¿Eliminar paciente?</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup/>
          <q-btn flat label="Eliminar" color="negative" @click="deletePatient"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import axios from 'axios';
import {useQuasar} from 'quasar';
import {PATIENTS_URL} from '../services/api';

const search = ref('');
const showConfirm = ref(false);
const selectedId = ref(null);
const router = useRouter();
const patients = ref([]);
const loading = ref(false);

const $q = useQuasar();

async function fetchPatients() {
  loading.value = true;
  try {
    const res = await axios.get(PATIENTS_URL);
    patients.value = Array.isArray(res.data)
        ? res.data.map(p => ({
          id: p.id,
          photo: p.profile_picture || null,
          fullName: [p.name, p.last_name].filter(Boolean).join(' '),
          last_name: p.last_name || '',
          email: p.email || '',
          birthDate: p.birth_date || p.birthDate || p.fechaNacimiento || p.bith_date || null,
          address: p.address || '',
          locality: p.locality || '',
          phone: p.phone || '',
          cellphone: p.cellphone || '',
        }))
        : [];
  } catch (e) {
    console.error('Error fetching patients:', e);
    patients.value = [];
    $q.notify({
      type: 'negative',
      message: 'No se pudo cargar la lista de pacientes',
      caption: (e && (e.response?.data?.message || e.message)) || 'Error desconocido'
    });
  } finally {
    loading.value = false;
  }
}

onMounted(fetchPatients);

const filteredPatients = computed(() => patients.value.filter(p => p.fullName?.toLowerCase().includes(search.value.toLowerCase())));
const pagination = ref({page: 1, rowsPerPage: 20});
const paginatedPatients = computed(() => filteredPatients.value.slice((pagination.value.page - 1) * pagination.value.rowsPerPage, pagination.value.page * pagination.value.rowsPerPage));
const columns = [
  {name: 'avatar', label: '', field: 'photo', align: 'left'},
  {name: 'name', label: 'Nombre', field: 'fullName', align: 'left'},
  {name: 'birthDate', label: 'Nacimiento', field: 'birthDate', align: 'left'},
  {name: 'age', label: 'Edad', field: 'age', align: 'left'},
  {name: 'actions', label: '', field: 'actions', align: 'right'},
];

function calculateAge(date) {
  if (!date) return '';
  const birth = new Date(date);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDate(dateString) {
  if (!dateString) return '';
  // Ensure we are working with a string
  const str = String(dateString).trim();
  // Take only the first 10 characters (YYYY-MM-DD)
  const datePart = str.substring(0, 10);
  
  // Check if it matches YYYY-MM-DD
  if (datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  }
  
  return dateString;
}

function goToDetail(_, row) {
  router.push({path: `/pacientes/${row.id}`});
}

function confirmDelete(row) {
  showConfirm.value = true;
  selectedId.value = row.id;
}

async function deletePatient() {
  loading.value = true;
  try {
    const PATIENT_ID_URL = `${PATIENTS_URL}/${selectedId.value}`;
    await axios.delete(PATIENT_ID_URL)
        .then(() => {
          $q.notify({
            type: 'positive',
            message: 'Paciente eliminado',
            caption: 'Paciente eliminado exitosamente'
          });
          fetchPatients()
        })
        .catch(error => {
          console.error('Error deleting patient:', error);
          $q.notify({
            type: 'negative',
            message: 'No se pudo eliminar el paciente',
            caption: (error && (error.response?.data?.message || error.message)) || 'Error desconocido'
          });
        });
  } finally {
    loading.value = false;
    showConfirm.value = true;
  }
}
</script>
<style scoped>
.minimal-input {
  background: #f8fafc !important;
  border-radius: 12px;
  border: 1px solid #e0e4ea !important;
  box-shadow: none !important;
  font-size: 16px;
  padding: 4px 12px;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.minimal-input:focus-within {
  border-color: #1976d2 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
}

.minimal-table {
  background: transparent;
  border-radius: 14px;
}

.minimal-card {
  border-radius: 12px;
  border: 1px solid #e0e4ea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  background: #ffffff;
}

.minimal-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.minimal-pagination {
  background: transparent;
  border-radius: 8px;
}

.q-table .q-avatar {
  margin-right: 8px;
}

.q-table .text-weight-medium {
  font-size: 16px;
}
</style>
