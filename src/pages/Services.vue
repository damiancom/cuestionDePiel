<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="col-12 col-sm q-mb-sm q-mb-sm-none">
        <div class="text-h5">Servicios</div>
        <div class="text-caption text-grey-7">Gestión de servicios ofrecidos, precios y duración estimada</div>
      </div>
      <div class="col-12 col-sm-auto row items-center q-gutter-sm">
        <q-input
          v-model="search"
          label="Buscar servicio"
          dense
          borderless
          class="minimal-input col col-sm-auto"
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

    <!-- ─── Vista MÓVIL (Celulares): Estilo Mercado Libre con Swipe ─── -->
    <div v-if="$q.screen.xs">
      <q-card flat class="minimal-create-card q-pa-sm">
        <q-list separator class="meli-list">
          <q-slide-item
            v-for="service in filteredServices"
            :key="service.id"
            @left="({ reset }) => handleSwipeWhatsApp(service, reset)"
            @right="({ reset }) => handleSwipeDelete(service, reset)"
            left-color="positive"
            right-color="negative"
            class="meli-slide-item"
          >
            <!-- Swipe Derecha (Izquierda a Derecha): WhatsApp -->
            <template #left>
              <div class="row items-center q-gutter-xs text-white q-px-md">
                <q-icon name="fa-brands fa-whatsapp" size="22px" />
                <span class="text-weight-bold">WhatsApp</span>
              </div>
            </template>

            <!-- Swipe Izquierda (Derecha a Izquierda): Solo Eliminar -->
            <template #right>
              <div class="row items-center q-gutter-xs text-white q-px-md">
                <span class="text-weight-bold">Eliminar</span>
                <q-icon name="delete" size="22px" />
              </div>
            </template>

            <q-item clickable @click="handleRowClick($event, service)" class="meli-item q-py-md q-px-sm">
              <q-item-section>
                <!-- Fila Superior: Título y Precio (estilo Mercado Libre) -->
                <div class="row justify-between items-start no-wrap q-mb-xs">
                  <div class="meli-title col q-pr-sm">
                    {{ service.name }}
                  </div>
                  <div class="meli-price col-auto text-right">
                    {{ service.price != null ? '$ ' + formatPrice(service.price) : '—' }}
                  </div>
                </div>

                <!-- Fila Inferior: Duración (estilo Color: Negro) y Botones directos -->
                <div class="row justify-between items-center no-wrap q-mt-xs">
                  <div class="meli-subtitle col text-grey-7 text-caption row items-center">
                    <q-icon name="schedule" size="14px" class="q-mr-xs" />
                    <span>{{ service.estimatedDuration ? 'Duración: ' + service.estimatedDuration : 'Duración: —' }}</span>
                  </div>
                  <div class="col-auto row items-center q-gutter-xs">
                    <q-btn
                      flat
                      round
                      icon="fa-brands fa-whatsapp"
                      size="sm"
                      color="positive"
                      @click.stop="openWhatsAppModal(service)"
                    />
                    <q-btn
                      flat
                      round
                      icon="delete"
                      size="sm"
                      color="negative"
                      @click.stop="confirmDelete(service)"
                    />
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>

        <!-- Mensaje si no hay servicios -->
        <div v-if="filteredServices.length === 0" class="text-center q-pa-xl text-grey-6">
          No hay servicios registrados aún
        </div>
      </q-card>
    </div>

    <!-- ─── Vista ESCRITORIO / TABLET: Tabla original ─── -->
    <q-card v-else flat class="q-pa-md minimal-create-card">
      <q-table
        :rows="filteredServices"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :pagination="pagination"
        :rows-per-page-options="[10, 20, 50]"
        class="simple-table"
        no-data-label="No hay servicios registrados aún"
        @row-click="handleRowClick"
      >
        <template #body-cell-price="props">
          <q-td class="text-left">
            <span class="simple-price">
              {{ props.row.price != null ? '$' + formatPrice(props.row.price) : '—' }}
            </span>
          </q-td>
        </template>
        <template #body-cell-estimatedDuration="props">
          <q-td class="text-left">
            <q-chip
              v-if="props.row.estimatedDuration"
              dense outline color="primary" icon="schedule" size="sm"
            >
              {{ props.row.estimatedDuration }}
            </q-chip>
            <span v-else class="text-grey-5">—</span>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td class="text-right">
            <q-btn
              flat
              icon="fa-brands fa-whatsapp"
              dense
              color="positive"
              class="q-mr-xs"
              @click.stop="openWhatsAppModal(props.row)"
            >
              <q-tooltip>Enviar servicio por WhatsApp</q-tooltip>
            </q-btn>
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

    <!-- Diálogo Enviar por WhatsApp -->
    <q-dialog v-model="showWhatsAppDialog">
      <q-card class="q-pa-lg dialog-card wa-dialog-card">
        <div class="row items-center justify-between q-mb-md">
          <div class="row items-center q-gutter-sm">
            <q-icon name="fa-brands fa-whatsapp" color="positive" size="24px" />
            <div class="text-h6">Enviar tratamiento por WhatsApp</div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <!-- Banner con el servicio seleccionado -->
        <div class="service-wa-banner q-pa-md q-mb-md rounded-borders bg-green-1 text-green-9 row items-center justify-between">
          <div>
            <div class="text-weight-bold text-subtitle1">{{ selectedServiceForWa?.name }}</div>
            <div class="text-caption text-grey-8" v-if="selectedServiceForWa?.price != null">
              Valor: ${{ formatPrice(selectedServiceForWa?.price) }}
            </div>
          </div>
          <q-chip dense color="green-2" text-color="green-9" icon="schedule" v-if="selectedServiceForWa?.estimatedDuration">
            {{ selectedServiceForWa.estimatedDuration }}
          </q-chip>
        </div>

        <!-- Mensaje a enviar -->
        <div class="q-mb-md">
          <div class="row items-center justify-between q-mb-xs">
            <span class="text-caption text-weight-bold text-grey-7">MENSAJE A ENVIAR</span>
            <q-btn
              flat
              dense
              size="xs"
              color="primary"
              label="Restaurar original"
              @click="resetWhatsAppMessage"
              v-if="customMessage !== defaultMessage"
            />
          </div>
          <q-input
            v-model="customMessage"
            type="textarea"
            rows="4"
            outlined
            dense
            class="bg-white"
          />
          <div class="text-caption text-grey-6 q-mt-xs">
            Tip: <b>{nombre}</b> se reemplazará automáticamente por el nombre del paciente al enviar.
          </div>
        </div>

        <!-- Selección de paciente -->
        <div class="text-caption text-weight-bold text-grey-7 q-mb-xs">
          SELECCIONAR PACIENTE (CON TELÉFONO CARGADO)
        </div>
        <q-input
          v-model="searchPatient"
          label="Buscar paciente por nombre o teléfono..."
          dense
          outlined
          clearable
          class="q-mb-sm"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Lista de pacientes -->
        <div class="wa-patients-list rounded-borders border-grey">
          <div v-if="loadingPatients" class="text-center q-py-lg">
            <q-spinner color="positive" size="2em" />
            <div class="text-caption text-grey-6 q-mt-sm">Cargando pacientes...</div>
          </div>

          <div v-else-if="filteredPatientsForWa.length === 0" class="text-center q-py-lg text-grey-6">
            <q-icon name="person_off" size="32px" class="q-mb-xs" />
            <div>No hay pacientes con número de teléfono cargado</div>
          </div>

          <q-list v-else separator>
            <q-item
              v-for="p in filteredPatientsForWa"
              :key="p.id"
              clickable
              v-ripple
              @click="sendWhatsAppToPatient(p)"
              class="wa-patient-item"
            >
              <q-item-section avatar>
                <q-avatar size="38px" color="green-1" text-color="positive">
                  <img v-if="p.photo" :src="p.photo" />
                  <q-icon v-else name="person" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold">{{ p.fullName || 'Sin nombre' }}</q-item-label>
                <q-item-label caption class="text-grey-7">
                  <q-icon name="phone" size="13px" class="q-mr-xs" />{{ getPatientPhone(p) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  unelevated
                  rounded
                  color="positive"
                  icon="fa-brands fa-whatsapp"
                  label="Enviar"
                  size="sm"
                  @click.stop="sendWhatsAppToPatient(p)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { ServicesAPI, PATIENTS_URL } from '../services/api';

const $q = useQuasar();

const loading = ref(false);
const saving = ref(false);
const search = ref('');
const services = ref([]);
const showDialog = ref(false);
const editing = ref(false);
const editId = ref(null);
const pagination = ref({ page: 1, rowsPerPage: 50 });

// WhatsApp Modal state
const showWhatsAppDialog = ref(false);
const selectedServiceForWa = ref(null);
const customMessage = ref('');
const defaultMessage = ref('');
const searchPatient = ref('');
const patientsList = ref([]);
const loadingPatients = ref(false);

const form = ref({
  name: '',
  description: '',
  price: '',
  estimatedDuration: '',
});

const columns = [
  { name: 'name',              label: 'Nombre',           field: 'name',              align: 'left',  sortable: true },
  { name: 'description',       label: 'Descripción',      field: 'description',       align: 'left',  sortable: true, format: val => val || '—' },
  { name: 'price',             label: 'Precio',           field: 'price',             align: 'left',  sortable: true },
  { name: 'estimatedDuration', label: 'Duración',          field: 'estimatedDuration', align: 'left',  sortable: true },
  { name: 'actions',           label: '',                  field: 'actions',           align: 'right' },
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
  return isNaN(num) ? '' : num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  return { name: '', description: '', price: '', estimatedDuration: '' };
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
  if (evt && evt.target && (evt.target.closest('.q-btn') || evt.target.closest('.q-checkbox'))) return;
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

function handleSwipeWhatsApp(service, reset) {
  reset();
  openWhatsAppModal(service);
}

function handleSwipeDelete(service, reset) {
  reset();
  confirmDelete(service);
}

function getPatientPhone(p) {
  return (p.cellphone || p.phone || '').trim();
}

const patientsWithPhone = computed(() => {
  return patientsList.value.filter(p => getPatientPhone(p).length > 0);
});

const filteredPatientsForWa = computed(() => {
  const q = searchPatient.value.toLowerCase().trim();
  const list = patientsWithPhone.value;
  if (!q) return list;
  return list.filter(p =>
    (p.fullName && p.fullName.toLowerCase().includes(q)) ||
    (getPatientPhone(p) && getPatientPhone(p).includes(q))
  );
});

function getDefaultWhatsAppMessage(service) {
  let text = `¡Hola {nombre}! Te compartimos información sobre nuestro tratamiento:\n\n`;
  text += `✨ *${service.name}*\n`;
  if (service.description) {
    text += `${service.description}\n`;
  }
  if (service.estimatedDuration) {
    text += `⏱️ Duración estimada: ${service.estimatedDuration}\n`;
  }
  if (service.price != null) {
    text += `💰 Valor: $${formatPrice(service.price)}\n`;
  }
  text += `\n¿Te gustaría agendar un turno o hacernos alguna consulta?`;
  return text;
}

function resetWhatsAppMessage() {
  if (selectedServiceForWa.value) {
    customMessage.value = defaultMessage.value;
  }
}

async function openWhatsAppModal(row) {
  selectedServiceForWa.value = row;
  defaultMessage.value = getDefaultWhatsAppMessage(row);
  customMessage.value = defaultMessage.value;
  searchPatient.value = '';
  showWhatsAppDialog.value = true;
  await loadPatientsForWa();
}

async function loadPatientsForWa() {
  if (patientsList.value.length > 0) return;
  loadingPatients.value = true;
  try {
    const res = await axios.get(PATIENTS_URL);
    patientsList.value = Array.isArray(res.data)
      ? res.data.map(p => ({
          id: p.id,
          photo: p.profile_picture || null,
          fullName: [p.name, p.last_name].filter(Boolean).join(' '),
          name: p.name || '',
          last_name: p.last_name || '',
          phone: p.phone || '',
          cellphone: p.cellphone || '',
        }))
      : [];
  } catch (e) {
    console.error('Error al cargar pacientes para WhatsApp:', e);
    $q.notify({ color: 'negative', message: 'Error al cargar lista de pacientes', icon: 'error' });
  } finally {
    loadingPatients.value = false;
  }
}

function cleanPhoneForWhatsApp(phone) {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  while (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  if (digits.length === 10) {
    return '549' + digits;
  }
  if (digits.length === 12 && digits.startsWith('54') && !digits.startsWith('549')) {
    return '549' + digits.substring(2);
  }
  return digits;
}

function sendWhatsAppToPatient(patient) {
  const rawPhone = getPatientPhone(patient);
  const cleanPhone = cleanPhoneForWhatsApp(rawPhone);
  if (!cleanPhone) {
    $q.notify({ color: 'warning', message: 'El número de teléfono no es válido para WhatsApp', icon: 'warning' });
    return;
  }
  const nombre = patient.name || (patient.fullName ? patient.fullName.split(' ')[0] : '') || '';
  const textToSend = customMessage.value.replace(/\{nombre\}/g, nombre);
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToSend)}`;

  $q.dialog({
    title: 'Confirmar envío por WhatsApp',
    message: `¿Deseas enviar la información de "${selectedServiceForWa.value?.name || 'este tratamiento'}" a "${patient.fullName}" (Tel: ${rawPhone})?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8'
    },
    ok: {
      label: 'Sí, abrir WhatsApp',
      color: 'positive',
      icon: 'fa-brands fa-whatsapp'
    },
    persistent: true
  }).onOk(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
    $q.notify({
      color: 'positive',
      message: `Abriendo WhatsApp para ${patient.fullName || 'el paciente'}...`,
      icon: 'fa-brands fa-whatsapp'
    });
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
  width: 480px;
  max-width: 95vw;
  border-radius: 16px;
}

/* ─── Tabla simplificada ──────────────────────────────────── */
.simple-table :deep(.q-table__middle) {
  overflow-x: hidden !important;
}
.simple-table :deep(table) {
  table-layout: fixed;
  width: 100%;
}
.simple-table :deep(thead th) {
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 12px 16px;
  border-bottom: 2px solid #e8edf5;
}
.simple-table :deep(tbody td) {
  font-size: 15px;
  padding: 13px 16px;
  border-bottom: 1px solid #f0f4f8;
  color: #1f2937;
}
.simple-table :deep(tbody tr:last-child td) {
  border-bottom: none;
}
.simple-table :deep(tbody tr) {
  cursor: pointer;
}
.simple-table :deep(tbody tr:hover td) {
  background: #f7faff;
}

/* Nombre: hasta 25% de ancho, con salto de línea */
.simple-table :deep(td:nth-child(1)),
.simple-table :deep(th:nth-child(1)) {
  width: 25%;
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
}

/* Descripción: resto del espacio disponible, con salto de línea */
.simple-table :deep(td:nth-child(2)),
.simple-table :deep(th:nth-child(2)) {
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
}

/* Precio: ancho ajustado para no desperdiciar espacio */
.simple-table :deep(td:nth-child(3)),
.simple-table :deep(th:nth-child(3)) {
  width: 120px;
  white-space: nowrap;
}

/* Duración: ancho ajustado */
.simple-table :deep(td:nth-child(4)),
.simple-table :deep(th:nth-child(4)) {
  width: 110px;
  white-space: nowrap;
}

/* Acciones (íconos): ancho ajustado */
.simple-table :deep(td:nth-child(5)),
.simple-table :deep(th:nth-child(5)) {
  width: 125px;
  white-space: nowrap;
}

.simple-price {
  font-size: 16px;
  font-weight: 700;
  color: #1976d2;
}

/* ─── Ajustes Responsive para Celulares (móvil) ──────────── */
@media (max-width: 640px) {
  /* En celulares se oculta la columna Descripción */
  .simple-table :deep(td:nth-child(2)),
  .simple-table :deep(th:nth-child(2)) {
    display: none !important;
  }

  /* Nombre: toma todo el espacio restante disponible en celular */
  .simple-table :deep(td:nth-child(1)),
  .simple-table :deep(th:nth-child(1)) {
    width: auto !important;
    min-width: 95px;
    font-size: 14px;
    line-height: 1.35;
  }

  /* Precio: ancho compacto para celular */
  .simple-table :deep(td:nth-child(3)),
  .simple-table :deep(th:nth-child(3)) {
    width: 90px !important;
    padding-left: 6px !important;
    padding-right: 6px !important;
  }

  /* Duración: ancho compacto para celular */
  .simple-table :deep(td:nth-child(4)),
  .simple-table :deep(th:nth-child(4)) {
    width: 75px !important;
    padding-left: 6px !important;
    padding-right: 6px !important;
  }

  /* Acciones: ancho compacto optimizado para 3 íconos */
  .simple-table :deep(td:nth-child(5)),
  .simple-table :deep(th:nth-child(5)) {
    width: 105px !important;
    padding-left: 4px !important;
    padding-right: 6px !important;
  }

  /* Alinear y compactar los bordes laterales y celdas en pantallas pequeñas */
  .simple-table :deep(thead th),
  .simple-table :deep(tbody td) {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .simple-price {
    font-size: 14px;
  }
}

/* ─── Diálogo WhatsApp ───────────────────────────────────── */
.wa-dialog-card {
  width: 540px;
  max-width: 95vw;
}
.wa-patients-list {
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid #e0e4ea;
}
.wa-patient-item {
  transition: background 0.18s ease;
}
.wa-patient-item:hover {
  background: #f0fdf4;
}

/* ─── Vista Móvil: Estilo Mercado Libre con Swipe ────────── */
.meli-list {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
}
.meli-slide-item {
  border-bottom: 1px solid #f0f4f8;
}
.meli-slide-item:last-child {
  border-bottom: none;
}
.meli-item {
  background: #ffffff;
  transition: background 0.15s ease;
}
.meli-item:hover {
  background: #f8fafc;
}
.meli-title {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.35;
  word-break: break-word;
}
.meli-price {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}
.meli-subtitle {
  font-size: 13px;
  color: #6b7280;
}
</style>
