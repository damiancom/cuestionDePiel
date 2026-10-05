<template>
  <q-page padding>
    <!-- Cabecera de la página -->
    <div class="row items-center justify-between q-mb-md">
      <div class="col-12 col-sm q-mb-sm q-mb-sm-none">
        <div class="row items-center no-wrap">
          <q-icon name="chat" size="24px" color="primary" class="q-mr-sm" style="flex-shrink: 0;" />
          <div class="text-h5 text-primary text-weight-bold ellipsis">
            Mensajes
          </div>
        </div>
        <div class="text-caption text-grey-7">Gestión de mensajes predefinidos y difusión a pacientes</div>
      </div>
      <div class="col-12 col-sm-auto row items-center q-gutter-sm">
        <q-input
          v-model="search"
          label="Buscar"
          dense
          borderless
          class="minimal-search-input"
          :input-style="{ background: 'transparent' }"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          color="primary"
          icon="add"
          :label="$q.screen.gt.xs ? 'Agregar' : ''"
          @click="openCreate"
          id="addMessageBtn"
          class="minimal-btn-save"
        >
          <q-tooltip>Agregar mensaje</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- ─── Vista MÓVIL (Celulares): Estilo Mercado Libre con Swipe ─── -->
    <div v-if="$q.screen.xs">
      <q-card flat class="minimal-create-card q-pa-sm">
        <q-list separator class="meli-list">
          <q-slide-item
            v-for="msg in filteredMessages"
            :key="msg.id"
            @left="({ reset }) => handleSwipeWhatsApp(msg, reset)"
            @right="({ reset }) => handleSwipeDelete(msg, reset)"
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

            <!-- Swipe Izquierda (Derecha a Izquierda): Eliminar -->
            <template #right>
              <div class="row items-center q-gutter-xs text-white q-px-md">
                <span class="text-weight-bold">Eliminar</span>
                <q-icon name="delete" size="22px" />
              </div>
            </template>

            <q-item clickable @click="handleRowClick($event, msg)" class="meli-item q-py-md q-px-sm">
              <q-item-section>
                <!-- Fila Superior: Título -->
                <div class="row justify-between items-start no-wrap q-mb-xs">
                  <div class="meli-title col q-pr-sm">
                    {{ msg.title }}
                  </div>
                </div>

                <!-- Fila Inferior: Descripción del mensaje y 3 botones directos -->
                <div class="row justify-between items-center no-wrap q-mt-xs">
                  <div class="meli-subtitle col text-grey-7 text-caption q-pr-sm">
                    {{ msg.content }}
                  </div>
                  <div class="col-auto row items-center q-gutter-xs">
                    <!-- 1. Ícono WhatsApp -->
                    <q-btn
                      flat
                      round
                      icon="fa-brands fa-whatsapp"
                      size="sm"
                      color="positive"
                      @click.stop="openWhatsAppModal(msg)"
                    >
                      <q-tooltip>Enviar por WhatsApp</q-tooltip>
                    </q-btn>
                    <!-- 2. Ícono Editar -->
                    <q-btn
                      flat
                      round
                      icon="edit"
                      size="sm"
                      color="primary"
                      @click.stop="openEdit(msg)"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <!-- 3. Ícono Eliminar -->
                    <q-btn
                      flat
                      round
                      icon="delete"
                      size="sm"
                      color="negative"
                      @click.stop="confirmDelete(msg)"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>

        <!-- Mensaje si no hay registros en móvil -->
        <div v-if="filteredMessages.length === 0" class="text-center q-pa-xl text-grey-6">
          No hay mensajes predefinidos registrados
        </div>
      </q-card>
    </div>

    <!-- ─── Vista ESCRITORIO / TABLET: Tabla con formato idéntico a Servicios ─── -->
    <q-card v-else flat class="minimal-create-card">
      <q-table
        :rows="filteredMessages"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :pagination="pagination"
        :rows-per-page-options="[10, 20, 50]"
        class="simple-table"
        no-data-label="No hay mensajes predefinidos registrados"
        @row-click="handleRowClick"
      >
        <template #body-cell-title="props">
          <q-td class="text-left">
            <div class="meli-title">
              {{ props.row.title }}
            </div>
          </q-td>
        </template>

        <template #body-cell-content="props">
          <q-td class="text-left">
            <div class="message-table-content">
              {{ props.row.content }}
            </div>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td class="text-right">
            <!-- 1. Ícono WhatsApp -->
            <q-btn
              flat
              icon="fa-brands fa-whatsapp"
              dense
              color="positive"
              class="q-mr-xs"
              @click.stop="openWhatsAppModal(props.row)"
            >
              <q-tooltip>Enviar por WhatsApp</q-tooltip>
            </q-btn>

            <!-- 2. Ícono Editar -->
            <q-btn
              flat
              icon="edit"
              dense
              color="primary"
              class="q-mr-xs"
              @click.stop="openEdit(props.row)"
            >
              <q-tooltip>Editar mensaje</q-tooltip>
            </q-btn>

            <!-- 3. Ícono Eliminar -->
            <q-btn
              flat
              icon="delete"
              dense
              color="negative"
              @click.stop="confirmDelete(props.row)"
            >
              <q-tooltip>Eliminar mensaje</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Diálogo Crear / Editar Mensaje Predefinido -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-lg dialog-card">
        <div class="text-h6 q-mb-md">
          {{ editing ? 'Editar Mensaje' : 'Agregar Mensaje' }}
        </div>
        <q-form @submit.prevent="saveMessage" class="q-gutter-y-md">
          <!-- Nombre del mensaje (Limitado a 100 caracteres) -->
          <q-input
            v-model="form.title"
            label="Nombre del mensaje *"
            placeholder="Ej: Recordatorio de turno, Cuidados posteriores..."
            class="minimal-input"
            borderless
            dense
            autofocus
            maxlength="100"
            counter
            :rules="[
              val => !!val && val.trim() !== '' || 'El nombre es obligatorio',
              val => (val && val.length <= 100) || 'El nombre no puede superar los 100 caracteres'
            ]"
            hide-bottom-space
          />

          <!-- Descripción / Mensaje (Limitado a 1000 caracteres) -->
          <q-input
            v-model="form.content"
            label="Descripción del mensaje *"
            placeholder="Escribí aquí el mensaje..."
            type="textarea"
            rows="5"
            class="minimal-input"
            borderless
            dense
            maxlength="1000"
            counter
            :rules="[
              val => !!val && val.trim() !== '' || 'El contenido del mensaje es obligatorio',
              val => (val && val.length <= 1000) || 'El mensaje no puede superar los 1000 caracteres'
            ]"
            hide-bottom-space
          />

          <div class="text-caption text-grey-7 bg-grey-2 q-pa-sm rounded-borders">
            💡 Tip: podés usar <b>{nombre}</b> para que se reemplace automáticamente por el nombre del paciente al enviar.
          </div>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn flat label="Cancelar" @click="closeDialog" color="grey-8" class="minimal-btn" />
            <q-btn label="Guardar" color="primary" type="submit" :loading="saving" class="minimal-btn-save" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Diálogo Enviar por WhatsApp con Selección de Pacientes -->
    <q-dialog v-model="showWhatsAppDialog">
      <q-card class="q-pa-lg dialog-card wa-dialog-card">
        <div class="row items-center justify-between q-mb-md">
          <div class="row items-center q-gutter-sm">
            <q-icon name="fa-brands fa-whatsapp" color="positive" size="24px" />
            <div class="text-h6">Enviar mensaje por WhatsApp</div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <!-- Banner con el mensaje seleccionado -->
        <div class="service-wa-banner q-pa-md q-mb-md rounded-borders bg-green-1 text-green-9">
          <div class="text-weight-bold text-subtitle1 q-mb-xs">
            {{ selectedMessageForWa?.title }}
          </div>
          <div class="text-caption text-grey-8 wa-preview-box">
            {{ customMessage }}
          </div>
        </div>

        <!-- Ajuste opcional del mensaje antes de enviar -->
        <div class="q-mb-md">
          <div class="row items-center justify-between q-mb-xs">
            <span class="text-caption text-weight-bold text-grey-7">PERSONALIZAR MENSAJE A ENVIAR</span>
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
            rows="3"
            outlined
            dense
            class="bg-white"
          />
          <div class="text-caption text-grey-6 q-mt-xs">
            Tip: <b>{nombre}</b> se reemplazará automáticamente por el nombre del paciente al enviar.
          </div>
        </div>

        <!-- Búsqueda y Selección de paciente -->
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
import { WhatsappMessagesAPI, PATIENTS_URL } from '../services/api';

const $q = useQuasar();

const loading = ref(false);
const saving = ref(false);
const search = ref('');
const messages = ref([]);
const showDialog = ref(false);
const editing = ref(false);
const editId = ref(null);
const pagination = ref({ page: 1, rowsPerPage: 50 });

const form = ref({
  title: '',
  content: '',
});

// Columnas para vista de escritorio
const columns = [
  { name: 'title',   label: 'Nombre',      field: 'title',   align: 'left',  sortable: true },
  { name: 'content', label: 'Descripción', field: 'content', align: 'left',  sortable: true },
  { name: 'actions', label: '',            field: 'actions', align: 'right' },
];

// Diálogo WhatsApp
const showWhatsAppDialog = ref(false);
const selectedMessageForWa = ref(null);
const customMessage = ref('');
const defaultMessage = ref('');
const searchPatient = ref('');
const patientsList = ref([]);
const loadingPatients = ref(false);

const filteredMessages = computed(() => {
  const q = search.value.toLowerCase().trim();
  if (!q) return messages.value;
  return messages.value.filter(m =>
    (m.title && m.title.toLowerCase().includes(q)) ||
    (m.content && m.content.toLowerCase().includes(q))
  );
});

async function loadData() {
  loading.value = true;
  try {
    const res = await WhatsappMessagesAPI.list();
    messages.value = res.data || [];
  } catch (e) {
    console.error('Error al cargar mensajes de WhatsApp:', e);
    const msg = e.response?.data?.message || (e.response ? `HTTP ${e.response.status}` : e.message);
    $q.notify({ color: 'negative', message: `Error al cargar mensajes: ${msg}`, icon: 'error' });
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editing.value = false;
  editId.value = null;
  form.value = {
    title: '',
    content: '',
  };
  showDialog.value = true;
}

function openEdit(row) {
  editing.value = true;
  editId.value = row.id;
  form.value = {
    title: row.title || '',
    content: row.content || '',
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

async function saveMessage() {
  saving.value = true;
  const payload = {
    title: form.value.title ? form.value.title.trim() : '',
    content: form.value.content ? form.value.content.trim() : '',
  };
  try {
    if (editing.value) {
      await WhatsappMessagesAPI.update(editId.value, payload);
      $q.notify({ color: 'positive', message: 'Mensaje actualizado correctamente', icon: 'check' });
    } else {
      await WhatsappMessagesAPI.create(payload);
      $q.notify({ color: 'positive', message: 'Mensaje creado correctamente', icon: 'check' });
    }
    closeDialog();
    await loadData();
  } catch (e) {
    console.error('Error al guardar mensaje:', e);
    const detail = e.response?.data?.message || e.response?.data?.error || (e.response ? `Error ${e.response.status}: ${e.response.statusText || 'No encontrado / Rechazado'}` : e.message);
    $q.notify({
      color: 'negative',
      message: `Error al guardar: ${detail}`,
      caption: e.response?.status === 404 ? 'Asegurate de haber reiniciado el backend Spring Boot para cargar los nuevos endpoints.' : undefined,
      icon: 'error',
      timeout: 5000
    });
  } finally {
    saving.value = false;
  }
}

function confirmDelete(row) {
  $q.dialog({
    title: 'Eliminar Mensaje',
    message: `¿Seguro que querés eliminar el mensaje "${row.title}"?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8',
      class: 'minimal-btn'
    },
    ok: {
      label: 'Eliminar',
      color: 'negative',
      class: 'minimal-btn-delete'
    },
    persistent: true,
  }).onOk(async () => {
    try {
      await WhatsappMessagesAPI.remove(row.id);
      $q.notify({ color: 'positive', message: 'Mensaje eliminado correctamente', icon: 'check' });
      await loadData();
    } catch (e) {
      console.error('Error al eliminar mensaje:', e);
      const detail = e.response?.data?.message || (e.response ? `Error ${e.response.status}` : e.message);
      $q.notify({ color: 'negative', message: `Error al eliminar el mensaje: ${detail}`, icon: 'error' });
    }
  });
}

function handleSwipeWhatsApp(msg, reset) {
  reset();
  openWhatsAppModal(msg);
}

function handleSwipeDelete(msg, reset) {
  reset();
  confirmDelete(msg);
}

// ─── Lógica WhatsApp Modal y Envío ─────────────────────────────────

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

async function openWhatsAppModal(msg) {
  selectedMessageForWa.value = msg;
  defaultMessage.value = msg.content || '';
  customMessage.value = defaultMessage.value;
  searchPatient.value = '';
  showWhatsAppDialog.value = true;
  await loadPatientsForWa();
}

function resetWhatsAppMessage() {
  customMessage.value = defaultMessage.value;
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
    message: `¿Deseas enviar el mensaje "${selectedMessageForWa.value?.title || 'Mensaje'}" a "${patient.fullName}" (Tel: ${rawPhone})?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8',
      class: 'minimal-btn'
    },
    ok: {
      label: 'Confirmar y abrir WhatsApp',
      color: 'primary',
      class: 'minimal-btn-save',
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

.dialog-card {
  width: 480px;
  max-width: 95vw;
  border-radius: 16px;
}

.wa-dialog-card {
  width: 540px;
  max-width: 95vw;
}

.wa-preview-box {
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 120px;
  overflow-y: auto;
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

/* ─── Tabla simplificada (Formato idéntico a Servicios) ──── */
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

/* Columna 1: Título (ancho definido para evitar cualquier solapamiento) */
.simple-table :deep(td:nth-child(1)),
.simple-table :deep(th:nth-child(1)) {
  width: 28%;
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
  vertical-align: top;
}

/* Columna 2: Descripción / Mensaje (resto del espacio con salto de línea) */
.simple-table :deep(td:nth-child(2)),
.simple-table :deep(th:nth-child(2)) {
  width: auto;
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
  vertical-align: top;
}

/* Columna 3: Acciones (ancho fijo, sin salto de línea) */
.simple-table :deep(td:nth-child(3)),
.simple-table :deep(th:nth-child(3)) {
  width: 135px;
  min-width: 135px;
  max-width: 135px;
  white-space: nowrap;
  vertical-align: top;
}

.message-table-title {
  display: block;
  font-size: 15px;
  line-height: 1.35;
  word-break: break-word;
}

.message-table-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #4b5563;
  line-height: 1.5;
  word-break: break-word;
}

@media (max-width: 1023.98px) {
  .message-table-content {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}

@media (max-width: 599.98px) {
  .message-table-content {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
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
.meli-subtitle {
  font-size: 13px;
  color: #6b7280;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  word-break: break-word;
}

@media (min-width: 600px) and (max-width: 1023.98px) {
  .meli-subtitle {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}

@media (min-width: 1024px) {
  .meli-subtitle {
    -webkit-line-clamp: 4;
    line-clamp: 4;
  }
}
</style>
