<template>
  <q-page padding>
    <!-- Encabezado de la página -->
    <div class="row items-center justify-between q-mb-md q-col-gutter-sm">
      <div class="col-12 col-sm">
        <div class="row items-center no-wrap">
          <q-icon name="contact_phone" size="28px" color="primary" class="q-mr-sm" style="flex-shrink: 0;" />
          <div class="text-h5 text-primary text-weight-bold ellipsis">
            Proveedores
          </div>
        </div>
        <div class="text-caption text-grey-7">
          Directorio y guía telefónica de contactos
        </div>
      </div>

      <div class="col-12 col-sm-auto row items-center q-gutter-sm">
        <q-input
          v-model="search"
          label="Buscar contacto..."
          dense
          borderless
          class="minimal-search-input"
          :input-style="{ background: 'transparent' }"
          clearable
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          color="primary"
          icon="add"
          :label="$q.screen.gt.xs ? 'Nuevo Proveedor' : ''"
          @click="openCreate"
          id="addSupplierBtn"
          class="minimal-btn-save"
        >
          <q-tooltip>Agregar nuevo contacto</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Barra de Filtro Alfabético (Solo letras con contactos existentes) -->
    <div v-if="availableAlphabet.length > 0" class="alphabet-bar-container q-mb-md">
      <div class="row items-center q-px-sm q-py-xs alphabet-scroll">
        <q-btn
          flat
          dense
          size="sm"
          :color="selectedLetter === null ? 'primary' : 'grey-7'"
          :class="{ 'active-letter-btn': selectedLetter === null }"
          label="TODOS"
          @click="selectedLetter = null"
          class="letter-btn q-mr-xs"
        />
        <q-btn
          v-for="letter in availableAlphabet"
          :key="letter"
          flat
          dense
          round
          size="sm"
          :color="selectedLetter === letter ? 'primary' : 'grey-7'"
          :class="{ 'active-letter-btn': selectedLetter === letter }"
          :label="letter"
          @click="toggleLetter(letter)"
          class="letter-btn"
        />
      </div>
    </div>

    <!-- Contador de resultados -->
    <div class="row items-center justify-between q-mb-sm text-caption text-grey-7 q-px-xs">
      <div>
        Mostrando <b>{{ filteredSuppliers.length }}</b> de <b>{{ suppliers.length }}</b> contactos
        <span v-if="selectedLetter" class="text-primary text-weight-medium q-ml-xs">
          (Letra: {{ selectedLetter }})
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-my-xl">
      <q-spinner-dots color="primary" size="48px" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredSuppliers.length === 0" class="empty-state-card text-center q-pa-xl">
      <q-icon name="menu_book" size="64px" color="grey-4" class="q-mb-md" />
      <div class="text-h6 text-grey-8 text-weight-medium">
        {{ suppliers.length === 0 ? 'Aún no hay contactos en la guía' : 'No se encontraron contactos' }}
      </div>
      <div class="text-body2 text-grey-6 q-mt-xs q-mb-md">
        {{ suppliers.length === 0
          ? 'Cargá tu primer proveedor ingresando su nombre, teléfono y link.'
          : 'Probá con otra búsqueda o seleccioná otra letra.' }}
      </div>
      <q-btn
        v-if="suppliers.length === 0"
        color="primary"
        icon="add"
        label="Cargar Proveedor"
        @click="openCreate"
        class="minimal-btn-save"
      />
      <q-btn
        v-else
        outline
        color="primary"
        label="Limpiar filtros"
        @click="clearFilters"
      />
    </div>

    <div v-else>
      <!-- ═════════════════════════════════════════════════════════════ -->
      <!-- VISTA DESKTOP Y TABLET: FORMATO TABLA (Nombre | Link | Teléfono) -->
      <!-- ═════════════════════════════════════════════════════════════ -->
      <div v-if="$q.screen.gt.xs">
        <q-card flat class="minimal-table-card">
          <q-table
            :rows="filteredSuppliers"
            :columns="tableColumns"
            row-key="id"
            flat
            dense
            wrap-cells
            :pagination="{ rowsPerPage: 0 }"
            hide-pagination
            class="supplier-table"
          >
            <!-- Columna Nombre -->
            <template #body-cell-name="props">
              <q-td class="text-left">
                <div class="row items-center no-wrap">
                  <q-avatar
                    size="32px"
                    :style="{ backgroundColor: getAvatarColor(props.row.name) }"
                    text-color="white"
                    class="q-mr-sm text-weight-bold flex-shrink-0 table-avatar"
                  >
                    {{ getInitial(props.row.name) }}
                  </q-avatar>
                  <span class="text-weight-bold text-primary table-supplier-name ellipsis" :title="props.row.name">
                    {{ props.row.name }}
                  </span>
                </div>
              </q-td>
            </template>

            <!-- Columna Link -->
            <template #body-cell-link="props">
              <q-td class="text-left">
                <div v-if="props.row.link" class="row items-center no-wrap q-gutter-xs">
                  <q-icon name="language" size="18px" color="info" class="flex-shrink-0" />
                  <a
                    :href="formatUrl(props.row.link)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="table-link ellipsis text-primary text-weight-medium"
                    :title="props.row.link"
                  >
                    {{ cleanLinkDisplay(props.row.link) }}
                  </a>
                  <q-btn
                    flat
                    round
                    dense
                    size="xs"
                    color="primary"
                    icon="open_in_new"
                    :href="formatUrl(props.row.link)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <q-tooltip>Abrir enlace</q-tooltip>
                  </q-btn>
                </div>
                <span v-else class="text-grey-5">—</span>
              </q-td>
            </template>

            <!-- Columna Teléfono -->
            <template #body-cell-phone="props">
              <q-td class="text-left">
                <div v-if="props.row.phone" class="row items-center no-wrap q-gutter-xs">
                  <q-icon name="call" size="18px" color="positive" class="flex-shrink-0" />
                  <span class="text-weight-bold text-grey-9 table-phone ellipsis">
                    {{ props.row.phone }}
                  </span>

                  <!-- Botones directos con íconos cómodos -->
                  <q-btn
                    flat
                    round
                    dense
                    size="sm"
                    color="positive"
                    icon="phone_forwarded"
                    :href="`tel:${cleanPhoneForCall(props.row.phone)}`"
                    target="_self"
                    class="action-icon-btn"
                  >
                    <q-tooltip>Llamar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    size="sm"
                    color="positive"
                    icon="chat"
                    @click.stop="openWhatsApp(props.row.phone)"
                    class="action-icon-btn"
                  >
                    <q-tooltip>WhatsApp</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    size="sm"
                    color="grey-7"
                    icon="content_copy"
                    @click.stop="copyToClipboard(props.row.phone, 'Teléfono')"
                    class="action-icon-btn"
                  >
                    <q-tooltip>Copiar teléfono</q-tooltip>
                  </q-btn>
                </div>
                <span v-else class="text-grey-5">—</span>
              </q-td>
            </template>

            <!-- Columna Acciones -->
            <template #body-cell-actions="props">
              <q-td class="text-right">
                <div class="row items-center justify-end q-gutter-xs no-wrap">
                  <q-btn
                    flat
                    round
                    icon="edit"
                    size="md"
                    color="grey-8"
                    @click.stop="openEdit(props.row)"
                    class="action-large-btn"
                  >
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    icon="delete"
                    size="md"
                    color="negative"
                    @click.stop="confirmDelete(props.row)"
                    class="action-large-btn"
                  >
                    <q-tooltip>Eliminar</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

      <!-- ═════════════════════════════════════════════════════════════ -->
      <!-- VISTA CELULAR: CARDS TIPO GUÍA TELEFÓNICA                     -->
      <!-- ═════════════════════════════════════════════════════════════ -->
      <div v-else class="column q-gutter-y-sm">
        <q-card
          v-for="supplier in filteredSuppliers"
          :key="'m-' + supplier.id"
          flat
          class="phonebook-card"
        >
          <!-- Header de la Card: Inicial + Nombre + Acciones -->
          <div class="row items-center no-wrap q-pa-sm">
            <q-avatar
              size="40px"
              :style="{ backgroundColor: getAvatarColor(supplier.name) }"
              text-color="white"
              class="q-mr-sm text-weight-bold phonebook-avatar flex-shrink-0"
            >
              {{ getInitial(supplier.name) }}
            </q-avatar>

            <div class="col overflow-hidden">
              <div class="supplier-name text-weight-bold text-primary ellipsis" :title="supplier.name">
                {{ supplier.name }}
              </div>
            </div>

            <!-- Acciones -->
            <div class="col-auto row items-center q-gutter-xs">
              <q-btn
                flat
                round
                icon="edit"
                size="md"
                color="grey-8"
                @click.stop="openEdit(supplier)"
                class="action-large-btn"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                icon="delete"
                size="md"
                color="negative"
                @click.stop="confirmDelete(supplier)"
                class="action-large-btn"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </div>
          </div>

          <q-separator class="card-divider" />

          <!-- Cuerpo: Teléfono y Link -->
          <div class="q-pa-sm q-gutter-y-xs text-body2">
            <!-- Teléfono con botones rápidos -->
            <div class="row items-center justify-between no-wrap">
              <div class="row items-center no-wrap overflow-hidden col">
                <q-icon name="call" size="20px" color="positive" class="q-mr-xs flex-shrink-0" />
                <span v-if="supplier.phone" class="text-weight-bold text-grey-9 ellipsis">
                  {{ supplier.phone }}
                </span>
                <span v-else class="text-grey-5">—</span>
              </div>

              <div v-if="supplier.phone" class="row items-center q-gutter-xs col-auto">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  color="positive"
                  icon="phone_forwarded"
                  :href="`tel:${cleanPhoneForCall(supplier.phone)}`"
                  target="_self"
                  class="action-icon-btn"
                >
                  <q-tooltip>Llamar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  color="positive"
                  icon="chat"
                  @click.stop="openWhatsApp(supplier.phone)"
                  class="action-icon-btn"
                >
                  <q-tooltip>WhatsApp</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  color="grey-7"
                  icon="content_copy"
                  @click.stop="copyToClipboard(supplier.phone, 'Teléfono')"
                  class="action-icon-btn"
                >
                  <q-tooltip>Copiar</q-tooltip>
                </q-btn>
              </div>
            </div>

            <!-- Link -->
            <div class="row items-center justify-between no-wrap q-mt-xs">
              <div class="row items-center no-wrap overflow-hidden col">
                <q-icon name="language" size="20px" color="info" class="q-mr-xs flex-shrink-0" />
                <a
                  v-if="supplier.link"
                  :href="formatUrl(supplier.link)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="supplier-link ellipsis text-primary text-weight-medium"
                  :title="supplier.link"
                  @click.stop
                >
                  {{ cleanLinkDisplay(supplier.link) }}
                </a>
                <span v-else class="text-grey-5">—</span>
              </div>

              <q-btn
                v-if="supplier.link"
                flat
                round
                dense
                size="sm"
                color="primary"
                icon="open_in_new"
                :href="formatUrl(supplier.link)"
                target="_blank"
                rel="noopener noreferrer"
                class="action-icon-btn col-auto"
              >
                <q-tooltip>Abrir enlace</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- DIÁLOGO CREAR / EDITAR PROVEEDOR -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-lg dialog-card">
        <div class="row items-center justify-between q-mb-md">
          <div class="row items-center no-wrap">
            <q-icon
              :name="editing ? 'edit' : 'person_add'"
              size="24px"
              color="primary"
              class="q-mr-sm"
            />
            <div class="text-h6 text-primary text-weight-bold">
              {{ editing ? 'Editar Contacto' : 'Nuevo Contacto' }}
            </div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup size="sm" color="grey-7" />
        </div>

        <q-form @submit.prevent="saveSupplier" class="q-gutter-y-md">
          <!-- Nombre -->
          <q-input
            v-model="form.name"
            label="Nombre *"
            placeholder="Ej: Laboratorio Bagó"
            class="minimal-input"
            borderless
            dense
            autofocus
            maxlength="255"
            :rules="[
              val => !!val && val.trim() !== '' || 'El nombre es obligatorio'
            ]"
            hide-bottom-space
          >
            <template #prepend>
              <q-icon name="business" color="primary" />
            </template>
          </q-input>

          <!-- Teléfono -->
          <q-input
            v-model="form.phone"
            label="Teléfono"
            placeholder="Ej: +54 9 11 4455-6677"
            class="minimal-input"
            borderless
            dense
            maxlength="100"
            hide-bottom-space
          >
            <template #prepend>
              <q-icon name="call" color="positive" />
            </template>
          </q-input>

          <!-- Link -->
          <q-input
            v-model="form.link"
            label="Link"
            placeholder="Ej: https://www.laboratorio.com.ar"
            class="minimal-input"
            borderless
            dense
            maxlength="500"
            hide-bottom-space
          >
            <template #prepend>
              <q-icon name="language" color="info" />
            </template>
          </q-input>

          <div class="row justify-end q-gutter-sm q-mt-lg">
            <q-btn
              flat
              label="Cancelar"
              color="grey-7"
              v-close-popup
            />
            <q-btn
              type="submit"
              color="primary"
              :label="editing ? 'Guardar Cambios' : 'Guardar'"
              :loading="saving"
              class="minimal-btn-save"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { SuppliersAPI } from '../services/api';

const $q = useQuasar();

const suppliers = ref([]);
const loading = ref(false);
const saving = ref(false);
const search = ref('');
const selectedLetter = ref(null);

const showDialog = ref(false);
const editing = ref(false);
const editingId = ref(null);

const form = ref({
  name: '',
  phone: '',
  link: '',
});

// Columnas para la tabla desktop/tablet
const tableColumns = [
  { name: 'name', label: 'NOMBRE', field: 'name', align: 'left', sortable: true },
  { name: 'link', label: 'LINK', field: 'link', align: 'left' },
  { name: 'phone', label: 'TELÉFONO', field: 'phone', align: 'left' },
  { name: 'actions', label: 'ACCIONES', align: 'right' },
];

// Letras únicas extraídas exclusivamente de los contactos cargados
const availableAlphabet = computed(() => {
  const letters = new Set();
  suppliers.value.forEach(s => {
    if (s.name && s.name.trim().length > 0) {
      const firstChar = s.name.trim()[0].toUpperCase();
      if (/[A-ZÁÉÍÓÚÑ]/.test(firstChar)) {
        letters.add(firstChar);
      }
    }
  });
  return Array.from(letters).sort((a, b) => a.localeCompare('es'));
});

// Filtrado reactivo por texto y letra seleccionada
const filteredSuppliers = computed(() => {
  let list = suppliers.value;

  // Filtro por letra seleccionada
  if (selectedLetter.value) {
    list = list.filter(s => {
      if (!s.name) return false;
      return s.name.trim().toUpperCase().startsWith(selectedLetter.value);
    });
  }

  // Filtro por búsqueda de texto
  if (search.value && search.value.trim() !== '') {
    const q = search.value.toLowerCase().trim();
    list = list.filter(s => {
      const matchName = s.name && s.name.toLowerCase().includes(q);
      const matchPhone = s.phone && s.phone.toLowerCase().includes(q);
      const matchLink = s.link && s.link.toLowerCase().includes(q);
      return matchName || matchPhone || matchLink;
    });
  }

  return list;
});

function toggleLetter(letter) {
  if (selectedLetter.value === letter) {
    selectedLetter.value = null;
  } else {
    selectedLetter.value = letter;
  }
}

function clearFilters() {
  search.value = '';
  selectedLetter.value = null;
}

async function loadSuppliers() {
  loading.value = true;
  try {
    const response = await SuppliersAPI.list();
    suppliers.value = response.data || [];
  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    $q.notify({
      color: 'negative',
      message: 'No se pudo cargar la lista de proveedores',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editing.value = false;
  editingId.value = null;
  form.value = {
    name: '',
    phone: '',
    link: '',
  };
  showDialog.value = true;
}

function openEdit(supplier) {
  editing.value = true;
  editingId.value = supplier.id;
  form.value = {
    name: supplier.name || '',
    phone: supplier.phone || '',
    link: supplier.link || '',
  };
  showDialog.value = true;
}

async function saveSupplier() {
  if (!form.value.name || form.value.name.trim() === '') {
    $q.notify({
      color: 'warning',
      message: 'El nombre es requerido'
    });
    return;
  }

  saving.value = true;
  const payload = {
    name: form.value.name.trim(),
    phone: form.value.phone ? form.value.phone.trim() : null,
    link: form.value.link ? form.value.link.trim() : null,
  };

  try {
    if (editing.value) {
      await SuppliersAPI.update(editingId.value, payload);
      $q.notify({
        color: 'positive',
        message: 'Contacto actualizado con éxito',
        icon: 'check_circle'
      });
    } else {
      await SuppliersAPI.create(payload);
      $q.notify({
        color: 'positive',
        message: 'Contacto agregado a la guía',
        icon: 'check_circle'
      });
    }
    showDialog.value = false;
    await loadSuppliers();
  } catch (error) {
    console.error('Error al guardar contacto:', error);
    $q.notify({
      color: 'negative',
      message: 'Ocurrió un error al guardar el contacto',
      icon: 'error'
    });
  } finally {
    saving.value = false;
  }
}

function confirmDelete(supplier) {
  $q.dialog({
    title: 'Eliminar Contacto',
    message: `¿Estás seguro de que deseás eliminar a "${supplier.name}"?`,
    cancel: {
      flat: true,
      label: 'Cancelar',
      color: 'grey-7'
    },
    ok: {
      label: 'Eliminar',
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    try {
      await SuppliersAPI.remove(supplier.id);
      $q.notify({
        color: 'positive',
        message: 'Contacto eliminado',
        icon: 'delete'
      });
      await loadSuppliers();
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
      $q.notify({
        color: 'negative',
        message: 'No se pudo eliminar el contacto',
        icon: 'error'
      });
    }
  });
}

function getInitial(name) {
  if (!name) return 'P';
  return name.trim().charAt(0).toUpperCase();
}

const colorPalette = [
  '#1976d2', '#26a69a', '#7b1fa2', '#d81b60', '#e65100',
  '#00897b', '#3949ab', '#00acc1', '#5c6bc0', '#43a047'
];

function getAvatarColor(name) {
  if (!name) return colorPalette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}

function cleanPhoneForCall(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

function openWhatsApp(phone) {
  if (!phone) return;
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return;
  const url = `https://wa.me/${cleaned}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function copyToClipboard(text, label) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    $q.notify({
      color: 'positive',
      message: `${label} copiado al portapapeles`,
      icon: 'content_copy',
      timeout: 1500
    });
  }).catch(() => {
    $q.notify({
      color: 'warning',
      message: 'No se pudo copiar al portapapeles'
    });
  });
}

function formatUrl(url) {
  if (!url) return '#';
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

function cleanLinkDisplay(url) {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
}

onMounted(loadSuppliers);
</script>

<style scoped>
/* Filtro Alfabético */
.alphabet-bar-container {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.alphabet-scroll {
  overflow-x: auto;
  white-space: nowrap;
  gap: 3px;
}

.letter-btn {
  min-width: 32px;
  height: 32px;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.15s ease;
}

.active-letter-btn {
  background-color: #e8f0fe !important;
  color: #1976d2 !important;
  font-weight: 700;
  border-radius: 50%;
}

/* ─── VISTA DESKTOP / TABLET: TABLA COMPACTA ─── */
.minimal-table-card {
  background: #ffffff;
  border: 1px solid #e5e9f0;
  border-radius: 12px;
  overflow: hidden;
}

.supplier-table :deep(table) {
  table-layout: auto;
  width: 100%;
}

.supplier-table :deep(thead th) {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 16px;
  background: #f8fafc;
  border-bottom: 1.5px solid #e2e8f0;
}

.supplier-table :deep(tbody td) {
  font-size: 14px;
  padding: 8px 16px;
  border-bottom: 1px solid #f1f5f9;
  height: 48px;
}

.supplier-table :deep(tbody tr:hover td) {
  background: #f8fafc;
}

.supplier-table :deep(tbody tr:last-child td) {
  border-bottom: none;
}

.table-avatar {
  font-size: 13px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-supplier-name {
  font-size: 15px;
  max-width: 280px;
}

.table-link {
  text-decoration: none;
  font-size: 13px;
  max-width: 240px;
}
.table-link:hover {
  text-decoration: underline;
}

.table-phone {
  font-size: 13px;
}

/* ─── VISTA MÓVIL: CARDS GUÍA TELEFÓNICA ─── */
.phonebook-card {
  background: #ffffff;
  border: 1px solid #e5e9f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}

.phonebook-avatar {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
  font-size: 16px;
}

.supplier-name {
  font-size: 15px;
  line-height: 1.3;
}

.card-divider {
  background-color: #f1f5f9;
}

.supplier-link {
  text-decoration: none;
  font-size: 13px;
}
.supplier-link:hover {
  text-decoration: underline;
}

/* Botones de acción accesibles */
.action-large-btn {
  padding: 6px;
  transition: transform 0.15s ease;
}

.action-large-btn:hover {
  transform: scale(1.12);
}

.action-icon-btn {
  padding: 4px;
  transition: transform 0.15s ease;
}

.action-icon-btn:hover {
  transform: scale(1.15);
}

.empty-state-card {
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
}

.minimal-search-input {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 8px;
  min-width: 220px;
}

.minimal-btn-save {
  border-radius: 8px;
  font-weight: 600;
}

.dialog-card {
  width: 480px;
  max-width: 95vw;
  border-radius: 16px;
}

.minimal-input {
  background: transparent !important;
  box-shadow: none !important;
  font-size: 14px;
}

.minimal-input :deep(.q-field__control) {
  border-bottom: 1.5px solid #e0e4ea !important;
  transition: border-color 0.2s;
  padding: 0 8px !important;
}

.minimal-input:focus-within :deep(.q-field__control) {
  border-color: #1976d2 !important;
}

.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
