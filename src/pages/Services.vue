<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="col-12 col-sm q-mb-sm q-mb-sm-none">
        <div class="row items-center no-wrap">
          <q-icon name="medical_services" size="24px" color="primary" class="q-mr-sm" style="flex-shrink: 0;" />
          <div class="text-h5 text-primary text-weight-bold ellipsis">
            Servicios
          </div>
        </div>
        <div class="text-caption text-grey-7">Gestión de servicios ofrecidos, precios y duración estimada</div>
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
          id="addServiceBtn"
          class="minimal-btn-save"
        >
          <q-tooltip>Agregar servicio</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- ─── Tabs de Segmentación por Categorías con Drag & Drop ─── -->
    <div class="row items-center justify-between no-wrap q-mb-md">
      <div class="col overflow-hidden">
        <q-tabs
          v-model="selectedTab"
          dense
          class="category-tabs"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
          no-caps
        >
          <!-- Pestaña condicional 'Sin categoría' a la izquierda si existen servicios sin categorizar -->
          <q-tab
            v-if="hasUncategorized"
            :name="UNCATEGORIZED_TAB"
            :badge="uncategorizedCount ? String(uncategorizedCount) : undefined"
            class="uncategorized-tab"
          >
            <template #default>
              <div class="row items-center no-wrap text-grey-8">
                <q-icon name="help_outline" size="14px" class="q-mr-xs text-grey-6" />
                <span>{{ UNCATEGORIZED_TAB }}</span>
              </div>
            </template>
          </q-tab>

          <!-- Pestañas de categorías persistidas (ordenables por Drag & Drop) -->
          <q-tab
            v-for="(cat, idx) in availableCategories"
            :key="cat"
            :name="cat"
            :badge="getCategoryCount(cat) ? String(getCategoryCount(cat)) : undefined"
            draggable="true"
            @dragstart="onTabDragStart($event, idx)"
            @dragover.prevent="onTabDragOver($event, idx)"
            @dragleave="onTabDragLeave($event, idx)"
            @drop.prevent="onTabDrop($event, idx)"
            @dragend="onTabDragEnd"
            class="draggable-tab"
            :class="{
              'tab-dragging': tabDragIndex === idx,
              'tab-drop-over': tabDropTargetIndex === idx && tabDragIndex !== idx
            }"
          >
            <template #default>
              <div class="row items-center no-wrap">
                <q-icon name="drag_indicator" size="14px" class="q-mr-xs text-grey-5 drag-icon-hint" />
                <span>{{ cat }}</span>
              </div>
            </template>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-auto q-ml-sm" v-if="availableCategories.length > 1">
        <q-btn
          flat
          round
          dense
          icon="swap_horiz"
          color="grey-7"
          @click="openReorderDialog"
          class="reorder-btn"
        >
          <q-tooltip>Reordenar categorías (Drag & Drop)</q-tooltip>
        </q-btn>
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
                <!-- Fila Superior: Título, Categoría y Precio (estilo Mercado Libre) -->
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
          No hay servicios registrados en esta categoría
        </div>
      </q-card>
    </div>

    <!-- ─── Vista ESCRITORIO / TABLET: Tabla original ─── -->
    <q-card v-else flat class="minimal-create-card">
      <q-table
        :rows="filteredServices"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :pagination="pagination"
        :rows-per-page-options="[10, 20, 50]"
        class="simple-table"
        no-data-label="No hay servicios registrados en esta categoría"
        @row-click="handleRowClick"
      >
        <template #body-cell-name="props">
          <q-td class="text-left">
            <div class="service-table-name">
              {{ props.row.name }}
            </div>
          </q-td>
        </template>
        <template #body-cell-description="props">
          <q-td class="text-left">
            <div class="service-table-description">
              {{ props.row.description || '—' }}
            </div>
          </q-td>
        </template>
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
          <!-- Categoría (Desplegable idéntico a productos) -->
          <q-select
            v-model="form.categoryName"
            :options="filteredCategories"
            label="Categoría *"
            use-input
            input-debounce="0"
            @filter="filterCategories"
            @new-value="addNewCategory"
            new-value-mode="add"
            class="minimal-input"
            borderless
            dense
            :rules="[val => !!val && String(val).trim() !== '' || 'La categoría es obligatoria']"
            hide-bottom-space
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Escribí para crear una nueva</q-item-section>
              </q-item>
            </template>
          </q-select>

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
            <q-btn flat label="Cancelar" @click="closeDialog" color="grey-8" class="minimal-btn" />
            <q-btn label="Guardar" color="primary" type="submit" :loading="saving" class="minimal-btn-save" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Diálogo Reordenar Categorías (Drag & Drop) -->
    <q-dialog v-model="showReorderDialog">
      <q-card class="q-pa-md dialog-card reorder-dialog-card">
        <div class="row items-center justify-between q-mb-sm">
          <div class="row items-center q-gutter-xs">
            <q-icon name="drag_indicator" color="primary" size="22px" />
            <div class="text-subtitle1 text-weight-bold">Reordenar Categorías</div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="text-caption text-grey-7 q-mb-md">
          Arrastrá las categorías para definir el orden en que deseás verlas en las pestañas. Los cambios se guardan automáticamente.
        </div>

        <q-list bordered separator class="rounded-borders q-mb-md reorder-list">
          <q-item
            v-for="(cat, idx) in reorderList"
            :key="cat"
            draggable="true"
            @dragstart="onListDragStart($event, idx)"
            @dragover.prevent="onListDragOver($event, idx)"
            @dragleave="onListDragLeave($event, idx)"
            @drop.prevent="onListDrop($event, idx)"
            @dragend="onListDragEnd"
            class="reorder-item"
            :class="{
              'item-dragging': listDragIndex === idx,
              'item-drop-target': listDropTargetIndex === idx && listDragIndex !== idx
            }"
          >
            <!-- Extremo izquierdo: Ícono de arrastre -->
            <q-item-section avatar class="reorder-handle cursor-move" style="min-width: 36px;">
              <q-icon name="drag_indicator" color="grey-6" size="20px" />
            </q-item-section>

            <!-- Centro: Nombre de la categoría -->
            <q-item-section>
              <div class="text-weight-medium">{{ cat }}</div>
              <div class="text-caption text-grey-6">{{ getCategoryCount(cat) }} servicios</div>
            </q-item-section>

            <!-- Derecha: Tachito y Columna de flechas apiladas verticalmente -->
            <q-item-section side class="reorder-actions">
              <!-- Tachito de eliminar -->
              <q-btn
                flat
                round
                dense
                icon="delete"
                :color="getCategoryCount(cat) > 0 ? 'grey-5' : 'negative'"
                size="sm"
                class="reorder-delete-btn"
                @click.stop="confirmDeleteCategory(cat)"
              >
                <q-tooltip v-if="getCategoryCount(cat) > 0">
                  No se puede eliminar: tiene {{ getCategoryCount(cat) }} servicio(s) asignado(s)
                </q-tooltip>
                <q-tooltip v-else>
                  Eliminar categoría
                </q-tooltip>
              </q-btn>

              <!-- Columna de flechas de reorganización -->
              <div class="reorder-arrows-col">
                <q-btn
                  flat
                  round
                  dense
                  icon="keyboard_arrow_up"
                  size="xs"
                  class="reorder-arrow-btn"
                  :disable="idx === 0"
                  @click.stop="moveCategory(idx, -1)"
                >
                  <q-tooltip>Mover hacia arriba</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  icon="keyboard_arrow_down"
                  size="xs"
                  class="reorder-arrow-btn"
                  :disable="idx === reorderList.length - 1"
                  @click.stop="moveCategory(idx, 1)"
                >
                  <q-tooltip>Mover hacia abajo</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="row justify-end q-mt-sm">
          <q-btn label="Listo" color="primary" v-close-popup class="minimal-btn-save" />
        </div>
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

const UNCATEGORIZED_TAB = 'Sin categoría';

const categories = ref([]);
const filteredCategories = ref([]);
const selectedTab = ref('');

const loading = ref(false);
const saving = ref(false);
const search = ref('');
const services = ref([]);
const showDialog = ref(false);
const editing = ref(false);
const editId = ref(null);
const pagination = ref({ page: 1, rowsPerPage: 50 });

// Drag & Drop en Tabs
const tabDragIndex = ref(null);
const tabDropTargetIndex = ref(null);

// Diálogo de Reordenamiento
const showReorderDialog = ref(false);
const reorderList = ref([]);
const listDragIndex = ref(null);
const listDropTargetIndex = ref(null);

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
  categoryName: '',
});

const columns = [
  { name: 'name',              label: 'Nombre',           field: 'name',              align: 'left',  sortable: true },
  { name: 'description',       label: 'Descripción',      field: 'description',       align: 'left',  sortable: true, format: val => val || '—' },
  { name: 'price',             label: 'Precio',           field: 'price',             align: 'left',  sortable: true },
  { name: 'estimatedDuration', label: 'Duración',          field: 'estimatedDuration', align: 'left',  sortable: true },
  { name: 'actions',           label: '',                  field: 'actions',           align: 'right' },
];

const hasUncategorized = computed(() => {
  return services.value.some(s => {
    const cat = s.category_name || s.category;
    return !cat || !cat.trim();
  });
});

const uncategorizedCount = computed(() => {
  return services.value.filter(s => {
    const cat = s.category_name || s.category;
    return !cat || !cat.trim();
  }).length;
});

const availableCategories = computed(() => {
  const list = [...categories.value];
  services.value.forEach(s => {
    const cat = s.category_name || s.category;
    if (cat && cat.trim() && !list.some(c => c.toLowerCase() === cat.trim().toLowerCase())) {
      list.push(cat.trim());
    }
  });
  return list;
});

function getCategoryCount(catName) {
  if (!services.value) return 0;
  const needle = catName.toLowerCase();
  return services.value.filter(s => {
    const cat = (s.category_name || s.category || '').toLowerCase();
    return cat === needle;
  }).length;
}

const filteredServices = computed(() => {
  const q = search.value.toLowerCase().trim();
  let list = services.value;

  // Filtrado por categoría seleccionada
  if (selectedTab.value === UNCATEGORIZED_TAB) {
    list = list.filter(s => {
      const cat = s.category_name || s.category;
      return !cat || !cat.trim();
    });
  } else if (selectedTab.value) {
    const targetCat = selectedTab.value.toLowerCase();
    list = list.filter(s => {
      const cat = (s.category_name || s.category || '').toLowerCase();
      return cat === targetCat;
    });
  }

  // Filtrado por búsqueda de texto
  if (!q) return list;
  return list.filter(s =>
    (s.name && s.name.toLowerCase().includes(q)) ||
    (s.description && s.description.toLowerCase().includes(q)) ||
    ((s.category_name || s.category) && (s.category_name || s.category).toLowerCase().includes(q))
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

// Filtro para el autocompletado de categoría en q-select
function filterCategories(val, update) {
  update(() => {
    const needle = (val || '').toLowerCase();
    filteredCategories.value = categories.value.filter(c => c.toLowerCase().includes(needle));
  });
}

// Permite agregar una nueva categoría escribiendo en el q-select
function addNewCategory(val, done) {
  if (val && val.trim()) {
    const trimmed = val.trim();
    if (!categories.value.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      categories.value.push(trimmed);
    }
    done(trimmed, 'add');
  }
}

async function loadData() {
  loading.value = true;
  try {
    const [servicesRes, categoriesRes] = await Promise.all([
      ServicesAPI.list(),
      ServicesAPI.getCategories().catch(() => ({ data: [] })),
    ]);
    services.value = servicesRes.data || [];
    const backendCategories = categoriesRes.data || [];
    categories.value = [...backendCategories];
    filteredCategories.value = [...backendCategories];

    const hasUncat = services.value.some(s => {
      const cat = s.category_name || s.category;
      return !cat || !cat.trim();
    });

    const validTabs = [...backendCategories];
    if (hasUncat) {
      validTabs.unshift(UNCATEGORIZED_TAB);
    }

    // Seleccionar tab inicial si no está establecida o ya no existe
    if (!selectedTab.value || !validTabs.some(t => t.toLowerCase() === selectedTab.value.toLowerCase())) {
      selectedTab.value = backendCategories[0] || (hasUncat ? UNCATEGORIZED_TAB : '');
    }
  } catch (e) {
    console.error('Error al cargar servicios:', e);
    $q.notify({ color: 'negative', message: 'Error al cargar servicios', icon: 'error' });
  } finally {
    loading.value = false;
  }
}

// ─── Drag & Drop en Tabs ──────────────────────────────────
function onTabDragStart(event, idx) {
  tabDragIndex.value = idx;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(idx));
  }
}

function onTabDragOver(event, idx) {
  tabDropTargetIndex.value = idx;
}

function onTabDragLeave(event, idx) {
  if (tabDropTargetIndex.value === idx) {
    tabDropTargetIndex.value = null;
  }
}

async function onTabDrop(event, targetIdx) {
  if (tabDragIndex.value === null || tabDragIndex.value === targetIdx) {
    tabDragIndex.value = null;
    tabDropTargetIndex.value = null;
    return;
  }
  const fromIdx = tabDragIndex.value;
  tabDragIndex.value = null;
  tabDropTargetIndex.value = null;

  const currentCats = [...availableCategories.value];
  const item = currentCats.splice(fromIdx, 1)[0];
  currentCats.splice(targetIdx, 0, item);
  categories.value = currentCats;
  await persistCategoriesOrder(currentCats);
}

function onTabDragEnd() {
  tabDragIndex.value = null;
  tabDropTargetIndex.value = null;
}

// ─── Diálogo de Reordenamiento ────────────────────────────
function openReorderDialog() {
  reorderList.value = [...availableCategories.value];
  showReorderDialog.value = true;
}

function onListDragStart(event, idx) {
  listDragIndex.value = idx;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(idx));
  }
}

function onListDragOver(event, idx) {
  listDropTargetIndex.value = idx;
}

function onListDragLeave(event, idx) {
  if (listDropTargetIndex.value === idx) {
    listDropTargetIndex.value = null;
  }
}

async function onListDrop(event, targetIdx) {
  if (listDragIndex.value === null || listDragIndex.value === targetIdx) {
    listDragIndex.value = null;
    listDropTargetIndex.value = null;
    return;
  }
  const fromIdx = listDragIndex.value;
  listDragIndex.value = null;
  listDropTargetIndex.value = null;

  const list = [...reorderList.value];
  const item = list.splice(fromIdx, 1)[0];
  list.splice(targetIdx, 0, item);
  reorderList.value = list;
  categories.value = list;
  await persistCategoriesOrder(list);
}

function onListDragEnd() {
  listDragIndex.value = null;
  listDropTargetIndex.value = null;
}

async function moveCategory(idx, direction) {
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= reorderList.value.length) return;
  const list = [...reorderList.value];
  const item = list.splice(idx, 1)[0];
  list.splice(newIdx, 0, item);
  reorderList.value = list;
  categories.value = list;
  await persistCategoriesOrder(list);
}

async function persistCategoriesOrder(newOrder) {
  try {
    await ServicesAPI.reorderCategories(newOrder);
    $q.notify({
      color: 'positive',
      message: 'Orden de categorías actualizado',
      icon: 'check',
      timeout: 1200
    });
  } catch (e) {
    console.error('Error al guardar nuevo orden de categorías:', e);
    $q.notify({
      color: 'negative',
      message: 'No se pudo guardar el nuevo orden',
      icon: 'error'
    });
  }
}

function confirmDeleteCategory(cat) {
  const count = getCategoryCount(cat);
  if (count > 0) {
    $q.notify({
      type: 'warning',
      position: 'top',
      message: `No se puede eliminar la categoría "${cat}"`,
      caption: `Tiene ${count} servicio(s) asignado(s). Para eliminarla, reasigná o eliminá sus servicios primero.`,
      icon: 'warning',
      timeout: 4000,
      actions: [{ icon: 'close', color: 'white', round: true, dense: true }]
    });
    return;
  }

  $q.dialog({
    title: 'Eliminar Categoría',
    message: `¿Seguro que querés eliminar la categoría "${cat}"?`,
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
      await ServicesAPI.deleteCategory(cat);
      $q.notify({ color: 'positive', message: 'Categoría eliminada correctamente', icon: 'check' });
      reorderList.value = reorderList.value.filter(c => c !== cat);
      categories.value = categories.value.filter(c => c !== cat);
      filteredCategories.value = filteredCategories.value.filter(c => c !== cat);
      if (selectedTab.value.toLowerCase() === cat.toLowerCase()) {
        selectedTab.value = categories.value[0] || (hasUncategorized.value ? UNCATEGORIZED_TAB : '');
      }
    } catch (e) {
      console.error('Error al eliminar categoría:', e);
      const msg = e.response?.data?.message || 'No se pudo eliminar la categoría';
      $q.notify({ color: 'negative', message: msg, icon: 'error' });
    }
  });
}

function getEmptyForm() {
  const initialCategory = selectedTab.value && selectedTab.value !== UNCATEGORIZED_TAB
    ? selectedTab.value
    : (categories.value[0] || '');
  return {
    name: '',
    description: '',
    price: '',
    estimatedDuration: '',
    categoryName: initialCategory,
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
    categoryName: row.category_name || row.category || '',
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
  const catName = form.value.categoryName ? form.value.categoryName.trim() : null;
  const payload = {
    name: form.value.name.trim(),
    description: form.value.description ? form.value.description.trim() : null,
    price: parsePrice(form.value.price),
    estimatedDuration: form.value.estimatedDuration ? form.value.estimatedDuration.trim() : null,
    category_name: catName,
    category: catName,
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
  let text = `¡Hola {nombre}! Te comparto información sobre el tratamiento:\n\n`;
  text += `${service.name}\n`;
  if (service.description) {
    text += `${service.description}\n\n`;
  }
  if (service.estimatedDuration) {
    text += `⏱️ Duración estimada: ${service.estimatedDuration}\n`;
  }
  if (service.price != null) {
    text += `💰 Valor: $${formatPrice(service.price)}\n`;
  }
  text += `\n¿Te gustaría agendar un turno o haceme alguna consulta?`;
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
.category-tabs {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #ececec;
  padding: 4px;
}

.uncategorized-tab {
  background: #fafafa;
  border-radius: 8px;
  border-right: 1.5px dashed #e0e0e0;
  margin-right: 4px;
}

.draggable-tab {
  cursor: grab;
  user-select: none;
  transition: transform 0.15s, background-color 0.15s, border-color 0.15s;
}
.draggable-tab:active {
  cursor: grabbing;
}
.drag-icon-hint {
  opacity: 0.35;
  transition: opacity 0.2s;
}
.draggable-tab:hover .drag-icon-hint {
  opacity: 0.85;
}
.tab-dragging {
  opacity: 0.4;
  transform: scale(0.96);
}
.tab-drop-over {
  border-bottom: 3px solid #1976d2 !important;
  background-color: #eff6ff !important;
  border-radius: 6px;
}

.reorder-btn {
  background: #ffffff;
  border: 1px solid #ececec;
  height: 42px;
  width: 42px;
}

/* ─── Diálogo de Reordenamiento ──────────────────────────── */
.reorder-dialog-card {
  width: 420px;
  max-width: 95vw;
}
.reorder-list {
  background: #ffffff;
  max-height: 380px;
  overflow-y: auto;
}
.reorder-item {
  cursor: grab;
  transition: background-color 0.15s, border-color 0.15s;
}
.reorder-item:active {
  cursor: grabbing;
}
.item-dragging {
  opacity: 0.4;
  background-color: #f3f4f6;
}
.item-drop-target {
  border: 2px dashed #1976d2 !important;
  background-color: #eff6ff !important;
}
.reorder-actions {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 12px !important;
  padding-left: 0 !important;
}
.reorder-delete-btn {
  width: 32px;
  height: 32px;
}
.reorder-arrows-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 24px;
}
.reorder-arrow-btn {
  width: 22px;
  height: 18px;
  min-height: 18px;
  padding: 0 !important;
  color: #757575;
}
.reorder-arrow-btn :deep(.q-icon) {
  font-size: 18px;
}

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
  vertical-align: top;
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
  vertical-align: top;
}

/* Descripción: resto del espacio disponible, con salto de línea */
.simple-table :deep(td:nth-child(2)),
.simple-table :deep(th:nth-child(2)) {
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
  vertical-align: top;
}

.service-table-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.4;
}

.service-table-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.5;
  color: #4b5563;
}

@media (max-width: 1023.98px) {
  .service-table-name,
  .service-table-description {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}

@media (max-width: 599.98px) {
  .service-table-name,
  .service-table-description {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
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
  /* En celulares se oculta Descripción de la tabla desktop (si aplicase) */
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
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 600px) and (max-width: 1023.98px) {
  .meli-title {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}

@media (min-width: 1024px) {
  .meli-title {
    -webkit-line-clamp: 4;
    line-clamp: 4;
  }
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
