<template>
  <div class="routine-generator-container">
    <!-- BARRA SUPERIOR DE CABECERA -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6 text-primary flex items-center text-weight-bold">
          <q-icon name="spa" size="26px" class="q-mr-sm" color="primary" />
          Rutina Facial
        </div>
        <div class="text-caption text-grey-7">
          Plan de cuidado diario personalizado para el paciente
        </div>
      </div>
    </div>

    <!-- CONTENEDOR PRINCIPAL DE RUTINA -->
    <div class="routine-card" id="routine-preview">
          
          <!-- Encabezado para impresión / PDF -->
          <div class="routine-header q-mb-lg pdf-only">
            <div class="logo-title flex items-center justify-between">
              <div class="logo">
                <img src="/centro-avatar.png" alt="Logo" style="height: 60px;">
              </div>
              <div class="text-center">
                <h2 class="main-title text-h4 text-primary text-weight-bold q-my-none">
                  Mi Rutina Facial
                </h2>
                <div v-if="routineData.patientName" class="text-subtitle1 text-grey-8 q-mt-xs">
                  Paciente: <span class="text-weight-bold">{{ routineData.patientName }}</span>
                </div>
              </div>
              <div style="width: 60px;"></div> <!-- Spacer -->
            </div>
          </div>

          <!-- COLUMNAS DÍA Y NOCHE -->
          <div class="columns row q-col-gutter-md">
            
            <!-- ========================================== -->
            <!-- COLUMNA DÍA ☀️                             -->
            <!-- ========================================== -->
            <div class="col-12 col-md-6">
              <div class="column-header column-header--day q-mb-md row items-center">
                <div class="column-header__icon column-header__icon--day q-mr-sm">
                  <q-icon name="wb_sunny" size="20px" />
                </div>
                <div>
                  <h3 class="column-header__title q-my-none">DÍA</h3>
                  <div class="column-header__subtitle">{{ routineData.day.length }} pasos programados</div>
                </div>
              </div>

              <div id="day-steps" class="steps-list">
                <div
                  v-for="(step, index) in routineData.day"
                  :key="'day-' + index"
                  class="step-card step-card--day q-mb-sm"
                  :class="{ 'step-card--active': activeStep.period === 'day' && activeStep.index === index }"
                  @click="setActiveStep('day', index)"
                >
                  <!-- Cabecera del paso -->
                  <div class="step-card__header" :class="{ 'step-card__header--readonly': !isEditing }">
                    <div class="step-card__badge step-card__badge--day">{{ index + 1 }}</div>
                    
                    <input
                      v-if="isEditing"
                      type="text"
                      v-model="step.title"
                      class="step-card__title-input"
                      :placeholder="'Paso ' + (index + 1) + ' (ej. Limpieza, Sérum...)'"
                      @focus="setActiveStep('day', index)"
                    >
                    <span v-else class="step-card__title-text">{{ step.title || ('Paso ' + (index + 1)) }}</span>
                    
                    <div v-if="isEditing" class="row items-center no-wrap pdf-hidden q-gutter-xs">
                      <!-- Botón selector rápido de producto para este paso -->
                      <q-btn
                        flat
                        round
                        dense
                        size="sm"
                        color="primary"
                        icon="add_shopping_cart"
                        class="step-card__action-btn"
                        @click.stop="openStepProductPicker('day', index, $event)"
                      >
                        <q-tooltip>Elegir producto del catálogo</q-tooltip>
                      </q-btn>

                      <!-- Botón eliminar paso -->
                      <q-btn
                        flat
                        round
                        dense
                        color="grey-6"
                        icon="delete_outline"
                        size="sm"
                        class="step-card__delete"
                        @click.stop="removeStep('day', index)"
                      >
                        <q-tooltip>Eliminar paso</q-tooltip>
                      </q-btn>
                    </div>
                  </div>

                  <!-- Cuerpo del paso -->
                  <div class="step-card__body" :class="{ 'step-card__body--readonly': !isEditing }">
                    <textarea
                      v-if="isEditing"
                      v-model="step.description"
                      :ref="el => registerTextareaRef(el, 'day', index)"
                      @input="e => handleTextareaInput(e, 'day', index)"
                      @blur="handleTextareaBlur"
                      @focus="setActiveStep('day', index)"
                      placeholder="Producto o modo de uso (escribe @ para buscar en catálogo)..."
                      rows="3"
                      class="step-card__textarea"
                    ></textarea>
                    <div v-else class="step-card__description">{{ step.description || '—' }}</div>

                    <!-- Menú emergente de mención con @ -->
                    <q-menu
                      v-if="activeMention.period === 'day' && activeMention.index === index && showMentionMenu"
                      v-model="showMentionMenu"
                      no-parent-event
                      no-focus
                      fit
                    >
                      <q-list dense style="min-width: 260px; max-height: 280px;" class="zebra-list">
                        <q-item-label header class="text-caption text-weight-bold text-primary q-py-xs">
                          PRODUCTOS COINCIDENTES (@)
                        </q-item-label>
                        <q-item
                          clickable
                          v-ripple
                          v-for="prod in filteredMentionProducts"
                          :key="prod.id"
                          @mousedown.prevent="selectMentionProduct(prod)"
                        >
                          <q-item-section>
                            <q-item-label class="text-weight-bold text-primary">{{ prod.name }}</q-item-label>
                            <q-item-label caption>
                              {{ prod.brand_name }} · {{ prod.category_name || prod.function_name }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side v-if="prod.selling_price != null">
                            <span class="text-weight-medium text-caption text-grey-8">
                              ${{ formatPrice(prod.selling_price) }}
                            </span>
                          </q-item-section>
                        </q-item>
                        <q-item v-if="filteredMentionProducts.length === 0">
                          <q-item-section class="text-grey-6 text-caption text-center q-pa-sm">
                            No se encontraron productos
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </div>
                </div>

                <!-- Botón Añadir Paso Día -->
                <div v-if="isEditing" class="text-center q-mt-md pdf-hidden">
                  <q-btn
                    flat
                    color="amber-9"
                    icon="add"
                    label="Añadir Paso de Día"
                    @click="addStep('day')"
                    class="add-step-btn full-width"
                  />
                </div>
              </div>
            </div>

            <!-- ========================================== -->
            <!-- COLUMNA NOCHE 🌙                           -->
            <!-- ========================================== -->
            <div class="col-12 col-md-6">
              <div class="column-header column-header--night q-mb-md row items-center">
                <div class="row items-center no-wrap">
                  <div class="column-header__icon column-header__icon--night q-mr-sm">
                    <q-icon name="bedtime" size="20px" />
                  </div>
                  <div>
                    <h3 class="column-header__title q-my-none">NOCHE</h3>
                    <div class="column-header__subtitle">{{ routineData.night.length }} pasos programados</div>
                  </div>
                </div>
              </div>

              <div id="night-steps" class="steps-list">
                <div
                  v-for="(step, index) in routineData.night"
                  :key="'night-' + index"
                  class="step-card step-card--night q-mb-sm"
                  :class="{ 'step-card--active': activeStep.period === 'night' && activeStep.index === index }"
                  @click="setActiveStep('night', index)"
                >
                  <!-- Cabecera del paso -->
                  <div class="step-card__header" :class="{ 'step-card__header--readonly': !isEditing }">
                    <div class="step-card__badge step-card__badge--night">{{ index + 1 }}</div>
                    
                    <input
                      v-if="isEditing"
                      type="text"
                      v-model="step.title"
                      class="step-card__title-input"
                      :placeholder="'Paso ' + (index + 1) + ' (ej. Limpieza, Sérum...)'"
                      @focus="setActiveStep('night', index)"
                    >
                    <span v-else class="step-card__title-text">{{ step.title || ('Paso ' + (index + 1)) }}</span>
                    
                    <div v-if="isEditing" class="row items-center no-wrap pdf-hidden q-gutter-xs">
                      <!-- Botón selector rápido de producto para este paso -->
                      <q-btn
                        flat
                        round
                        dense
                        size="sm"
                        color="primary"
                        icon="add_shopping_cart"
                        class="step-card__action-btn"
                        @click.stop="openStepProductPicker('night', index, $event)"
                      >
                        <q-tooltip>Elegir producto del catálogo</q-tooltip>
                      </q-btn>

                      <!-- Botón eliminar paso -->
                      <q-btn
                        flat
                        round
                        dense
                        color="grey-6"
                        icon="delete_outline"
                        size="sm"
                        class="step-card__delete"
                        @click.stop="removeStep('night', index)"
                      >
                        <q-tooltip>Eliminar paso</q-tooltip>
                      </q-btn>
                    </div>
                  </div>

                  <!-- Cuerpo del paso -->
                  <div class="step-card__body" :class="{ 'step-card__body--readonly': !isEditing }">
                    <textarea
                      v-if="isEditing"
                      v-model="step.description"
                      :ref="el => registerTextareaRef(el, 'night', index)"
                      @input="e => handleTextareaInput(e, 'night', index)"
                      @blur="handleTextareaBlur"
                      @focus="setActiveStep('night', index)"
                      placeholder="Producto o modo de uso (escribe @ para buscar en catálogo)..."
                      rows="3"
                      class="step-card__textarea"
                    ></textarea>
                    <div v-else class="step-card__description">{{ step.description || '—' }}</div>

                    <!-- Menú emergente de mención con @ -->
                    <q-menu
                      v-if="activeMention.period === 'night' && activeMention.index === index && showMentionMenu"
                      v-model="showMentionMenu"
                      no-parent-event
                      no-focus
                      fit
                    >
                      <q-list dense style="min-width: 260px; max-height: 280px;" class="zebra-list">
                        <q-item-label header class="text-caption text-weight-bold text-primary q-py-xs">
                          PRODUCTOS COINCIDENTES (@)
                        </q-item-label>
                        <q-item
                          clickable
                          v-ripple
                          v-for="prod in filteredMentionProducts"
                          :key="prod.id"
                          @mousedown.prevent="selectMentionProduct(prod)"
                        >
                          <q-item-section>
                            <q-item-label class="text-weight-bold text-primary">{{ prod.name }}</q-item-label>
                            <q-item-label caption>
                              {{ prod.brand_name }} · {{ prod.category_name || prod.function_name }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side v-if="prod.selling_price != null">
                            <span class="text-weight-medium text-caption text-grey-8">
                              ${{ formatPrice(prod.selling_price) }}
                            </span>
                          </q-item-section>
                        </q-item>
                        <q-item v-if="filteredMentionProducts.length === 0">
                          <q-item-section class="text-grey-6 text-caption text-center q-pa-sm">
                            No se encontraron productos
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </div>
                </div>

                <!-- Botón Añadir Paso Noche -->
                <div v-if="isEditing" class="text-center q-mt-md pdf-hidden">
                  <q-btn
                    flat
                    color="indigo-7"
                    icon="add"
                    label="Añadir Paso de Noche"
                    @click="addStep('night')"
                    class="add-step-btn full-width"
                  />
                </div>
              </div>
            </div>

          </div>

          <!-- ========================================== -->
          <!-- NOTAS Y RECOMENDACIONES ESPECIALES         -->
          <!-- ========================================== -->
          <div class="notes-section q-mt-lg">
            <div class="section-header">
              <q-icon name="edit_note" size="22px" color="primary" class="q-mr-sm" />
              <h4 class="section-header__title q-my-none">Notas y Recomendaciones Especiales</h4>
            </div>
            <div class="section-body q-mt-sm" :class="{ 'section-body--readonly': !isEditing }">
              <textarea
                v-if="isEditing"
                v-model="routineData.notes"
                placeholder="Añade recomendaciones adicionales sobre frecuencia de aplicación, hidratación, fotoprotección o advertencias..."
                rows="3"
                class="step-card__textarea"
              ></textarea>
              <div v-else class="step-card__description" style="min-height: 4rem;">{{ routineData.notes || 'Sin observaciones adicionales.' }}</div>
            </div>
          </div>

          <!-- Pie del PDF: Paciente -->
          <div class="patient-name-section q-mt-md pdf-only">
            <div class="text-caption text-grey-6 text-right">
              Centro Dermatocosmiátrico Cuestión de Piel · Plan personalizado
            </div>
          </div>

        </div> <!-- /routine-card -->

    <!-- MENÚ POPUP SELECTOR RÁPIDO PARA UN PASO ESPECÍFICO -->
    <q-menu
      v-model="showQuickPickerMenu"
      :target="quickPickerTarget"
      no-parent-event
      anchor="bottom left"
      self="top left"
      style="max-width: 320px; width: 300px;"
    >
      <div class="q-pa-sm bg-grey-1 border-bottom row items-center justify-between">
        <span class="text-caption text-weight-bold text-primary">INSERTAR PRODUCTO EN PASO</span>
        <q-btn flat round dense icon="close" size="xs" color="grey-6" @click="showQuickPickerMenu = false" />
      </div>
      <div class="q-pa-xs">
        <q-input
          v-model="quickPickerSearch"
          placeholder="Buscar producto..."
          dense
          autofocus
          borderless
          class="minimal-search-input full-width q-px-sm"
        >
          <template #prepend>
            <q-icon name="search" size="18px" color="grey-6" />
          </template>
        </q-input>
      </div>
      <q-separator />
      <q-list dense style="max-height: 260px; overflow-y: auto;" class="zebra-list">
        <q-item
          v-for="prod in filteredQuickPickerProducts"
          :key="prod.id"
          clickable
          v-ripple
          @click="selectQuickPickerProduct(prod)"
        >
          <q-item-section>
            <q-item-label class="text-weight-bold text-primary text-body2">{{ prod.name }}</q-item-label>
            <q-item-label caption>{{ prod.brand_name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="text-right">
              <div v-if="prod.selling_price != null" class="text-caption text-weight-bold text-grey-9">
                ${{ formatPrice(prod.selling_price) }}
              </div>
              <q-badge
                :color="prod.stock > 0 ? 'positive' : 'grey-5'"
                :label="prod.stock > 0 ? `${prod.stock} disp.` : 'Sin stock'"
                class="text-xs"
              />
            </div>
          </q-item-section>
        </q-item>
        <q-item v-if="filteredQuickPickerProducts.length === 0">
          <q-item-section class="text-grey-6 text-caption text-center q-pa-md">
            No hay productos que coincidan
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>

  </div>
</template>

<script setup>
import { ref, reactive, watch, toRaw, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RecommendedProductsAPI } from '../services/api';
import RoutineProductCatalog from './RoutineProductCatalog.vue';

const props = defineProps({
  initialRoutine: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save']);
const $q = useQuasar();

// Estado del componente
const isEditing = ref(true);
const showCatalog = ref(false);

// Datos de la rutina
const routineData = reactive({
  day: [
    { title: 'Limpieza', description: '' },
    { title: 'Tónico', description: '' },
    { title: 'Contorno de ojos', description: '' },
    { title: 'Serum', description: '' },
    { title: 'Hidratante', description: '' },
    { title: 'Protector solar', description: '' }
  ],
  night: [
    { title: 'Limpieza', description: '' },
    { title: 'Tónico', description: '' },
    { title: 'Contorno de ojos', description: '' },
    { title: 'Serum', description: '' },
    { title: 'Hidratante', description: '' }
  ],
  notes: '',
  patientName: ''
});

// Paso activo / enfocado (para inserciones desde el catálogo)
const activeStep = ref({ period: 'day', index: 0 });

const setActiveStep = (period, index) => {
  activeStep.value = { period, index };
};

// Snapshot para detección de cambios sin guardar
const lastSavedSnapshot = ref('');

function getRoutineSnapshot() {
  try {
    return JSON.stringify({
      day: routineData.day,
      night: routineData.night,
      notes: routineData.notes || ''
    });
  } catch (e) {
    return '';
  }
}

function updateSnapshot() {
  lastSavedSnapshot.value = getRoutineSnapshot();
}

function isDirty() {
  if (!lastSavedSnapshot.value) return false;
  return getRoutineSnapshot() !== lastSavedSnapshot.value;
}

watch(() => props.initialRoutine, (newVal) => {
  if (newVal) {
    routineData.day = Array.isArray(newVal.day)
      ? newVal.day.map(step => ({ ...step, title: step.title ? step.title.replace(/^\d+\.\s*/, '') : '' }))
      : [];
    routineData.night = Array.isArray(newVal.night)
      ? newVal.night.map(step => ({ ...step, title: step.title ? step.title.replace(/^\d+\.\s*/, '') : '' }))
      : [];
    routineData.notes = newVal.notes ?? '';
    if (newVal.patientName !== undefined) routineData.patientName = newVal.patientName;
  }
  updateSnapshot();
}, { immediate: true, deep: true });

// Catálogo de Productos
const availableProducts = ref([]);

const recargarProductos = async () => {
  try {
    const res = await RecommendedProductsAPI.list();
    availableProducts.value = res.data || [];
  } catch (e) {
    console.error('Error cargando productos recomendados', e);
  }
};

onMounted(() => {
  recargarProductos();
});

const toggleCatalog = () => {
  showCatalog.value = !showCatalog.value;
};

// Formato de precios
function formatPrice(val) {
  if (val == null) return '';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? '' : num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ==========================================
// MENÚ DE MENCIONES CON @ EN TEXTAREAS
// ==========================================
const activeMention = ref({ period: null, index: null });
const showMentionMenu = ref(false);
const mentionQuery = ref('');
const mentionStartIndex = ref(-1);

const filteredMentionProducts = computed(() => {
  const q = mentionQuery.value.toLowerCase().trim();
  if (!q) return availableProducts.value.slice(0, 10);
  return availableProducts.value.filter(p => {
    const name = String(p.name || '').toLowerCase();
    const brand = String(p.brand_name || '').toLowerCase();
    const category = String(p.category_name || '').toLowerCase();
    const func = String(p.function_name || '').toLowerCase();
    return name.includes(q) || brand.includes(q) || category.includes(q) || func.includes(q);
  }).slice(0, 10);
});

const textareaRefs = reactive({});

const registerTextareaRef = (el, period, index) => {
  if (el) {
    textareaRefs[`${period}-${index}`] = el;
  }
};

const handleTextareaInput = (event, period, index) => {
  const el = event.target;
  const cursorPosition = el.selectionStart;
  const textBeforeCursor = el.value.substring(0, cursorPosition);

  // Regex: buscar último '@' precedido de espacio o inicio de texto, capturando lo que sigue sin espacios
  const match = textBeforeCursor.match(/(?:^|\s)@([^\s]*)$/);

  if (match) {
    activeMention.value = { period, index };
    activeStep.value = { period, index };
    mentionQuery.value = match[1];
    mentionStartIndex.value = cursorPosition - match[1].length - 1; // La posición exacta del '@'
    showMentionMenu.value = true;
  } else {
    showMentionMenu.value = false;
    activeMention.value = { period: null, index: null };
  }
};

const handleTextareaBlur = () => {
  // Cerramos el menú al salir
  showMentionMenu.value = false;
};

const selectMentionProduct = (product) => {
  const { period, index } = activeMention.value;
  if (!period || index === null) return;

  const step = routineData[period][index];
  const text = step.description;
  const insertText = `${product.brand_name} ${product.name} `;

  const before = text.substring(0, mentionStartIndex.value);
  const currentQueryLen = mentionQuery.value.length;
  const after = text.substring(mentionStartIndex.value + 1 + currentQueryLen);

  step.description = before + insertText + after;

  showMentionMenu.value = false;
  activeMention.value = { period: null, index: null };
};

// ==========================================
// SELECTOR RÁPIDO DE PRODUCTO POR PASO
// ==========================================
const showQuickPickerMenu = ref(false);
const quickPickerTarget = ref(null);
const quickPickerStep = ref({ period: 'day', index: 0 });
const quickPickerSearch = ref('');

const openStepProductPicker = (period, index, event) => {
  quickPickerStep.value = { period, index };
  setActiveStep(period, index);
  quickPickerSearch.value = '';
  quickPickerTarget.value = event.currentTarget;
  showQuickPickerMenu.value = true;
};

const filteredQuickPickerProducts = computed(() => {
  const q = quickPickerSearch.value.toLowerCase().trim();
  if (!q) return availableProducts.value.slice(0, 15);
  return availableProducts.value.filter(p => {
    const name = String(p.name || '').toLowerCase();
    const brand = String(p.brand_name || '').toLowerCase();
    const category = String(p.category_name || '').toLowerCase();
    const func = String(p.function_name || '').toLowerCase();
    return name.includes(q) || brand.includes(q) || category.includes(q) || func.includes(q);
  }).slice(0, 15);
});

const selectQuickPickerProduct = (product) => {
  const { period, index } = quickPickerStep.value;
  const step = routineData[period][index];
  const prodText = `${product.brand_name} ${product.name}`;

  if (step.description.trim()) {
    step.description += `\n${prodText}`;
  } else {
    step.description = prodText;
  }

  showQuickPickerMenu.value = false;
  $q.notify({
    type: 'positive',
    message: `Producto agregado a ${period === 'day' ? 'Día' : 'Noche'} (Paso ${index + 1})`,
    timeout: 1500,
    position: 'top'
  });
};

// ==========================================
// INSERCIÓN DESDE EL PANEL LATERAL DE CATÁLOGO
// ==========================================
const handleInsertFromCatalog = ({ product, targetPeriod }) => {
  const period = targetPeriod || activeStep.value.period || 'day';
  const prodText = `${product.brand_name} ${product.name}`;

  // Si hay un paso activo de ese período y tiene menos de 2 renglones o está vacío, agregamos allí
  let targetIndex = activeStep.value.period === period ? activeStep.value.index : null;

  if (targetIndex !== null && routineData[period][targetIndex]) {
    const step = routineData[period][targetIndex];
    if (step.description.trim()) {
      step.description += `\n${prodText}`;
    } else {
      step.description = prodText;
    }
    $q.notify({
      type: 'positive',
      message: `"${prodText}" añadido al Paso ${targetIndex + 1} de ${period === 'day' ? 'Día' : 'Noche'}`,
      timeout: 1800,
      position: 'top'
    });
  } else {
    // Si no hay un paso activo específico, agregamos un nuevo paso con el producto
    routineData[period].push({
      title: product.category_name || product.function_name || 'Nuevo Paso',
      description: prodText
    });
    activeStep.value = { period, index: routineData[period].length - 1 };
    $q.notify({
      type: 'positive',
      message: `Nuevo paso creado en ${period === 'day' ? 'Día' : 'Noche'} con "${prodText}"`,
      timeout: 1800,
      position: 'top'
    });
  }
};

// ==========================================
// MÉTODOS CRUD DE RUTINA
// ==========================================
const addStep = (period) => {
  routineData[period].push({
    title: '',
    description: ''
  });
  activeStep.value = { period, index: routineData[period].length - 1 };
};

const removeStep = (period, index) => {
  routineData[period].splice(index, 1);
  if (activeStep.value.period === period && activeStep.value.index >= routineData[period].length) {
    activeStep.value.index = Math.max(0, routineData[period].length - 1);
  }
};

const saveRoutine = () => {
  const raw = toRaw(routineData);
  const clone = {
    day: raw.day.map(s => ({ ...s })),
    night: raw.night.map(s => ({ ...s })),
    notes: raw.notes,
    patientName: raw.patientName
  };
  emit('save', clone);
};

const resetToInitial = () => {
  if (props.initialRoutine) {
    routineData.day = Array.isArray(props.initialRoutine.day)
      ? props.initialRoutine.day.map(step => ({ ...step, title: step.title ? step.title.replace(/^\d+\.\s*/, '') : '' }))
      : [];
    routineData.night = Array.isArray(props.initialRoutine.night)
      ? props.initialRoutine.night.map(step => ({ ...step, title: step.title ? step.title.replace(/^\d+\.\s*/, '') : '' }))
      : [];
    routineData.notes = props.initialRoutine.notes ?? '';
    if (props.initialRoutine.patientName !== undefined) routineData.patientName = props.initialRoutine.patientName;
  } else {
    routineData.day = [
      { title: 'Limpieza', description: '' },
      { title: 'Tónico', description: '' },
      { title: 'Contorno de ojos', description: '' },
      { title: 'Serum', description: '' },
      { title: 'Hidratante', description: '' },
      { title: 'Protector solar', description: '' }
    ];
    routineData.night = [
      { title: 'Limpieza', description: '' },
      { title: 'Tónico', description: '' },
      { title: 'Contorno de ojos', description: '' },
      { title: 'Serum', description: '' },
      { title: 'Hidratante', description: '' }
    ];
    routineData.notes = '';
    routineData.patientName = '';
  }
  updateSnapshot();
};

// ==========================================
// GENERACIÓN Y DESCARGA DE PDF
// ==========================================
const downloadPDF = async () => {
  const routineCardElement = document.getElementById('routine-preview');
  if (!routineCardElement) return;

  const wasEditing = isEditing.value;
  if (wasEditing) {
    isEditing.value = false;
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  try {
    const canvas = await html2canvas(routineCardElement, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const preview = clonedDoc.getElementById('routine-preview');
        if (preview) {
          preview.querySelectorAll('.pdf-only').forEach(el => {
            el.style.display = 'block';
          });
          preview.querySelectorAll('.pdf-hidden').forEach(el => {
            el.style.display = 'none';
          });

          // Emparejar alturas por fila entre Día y Noche para mantener alineación estética
          const daySteps = preview.querySelectorAll('#day-steps .step-card');
          const nightSteps = preview.querySelectorAll('#night-steps .step-card');
          const maxLen = Math.max(daySteps.length, nightSteps.length);
          for (let i = 0; i < maxLen; i++) {
            const dayStep = daySteps[i];
            const nightStep = nightSteps[i];
            if (!dayStep || !nightStep) continue;
            const dayDescText = dayStep.querySelector('.step-card__description');
            const nightDescText = nightStep.querySelector('.step-card__description');

            if (dayDescText && nightDescText) {
              const h1 = dayDescText.offsetHeight;
              const h2 = nightDescText.offsetHeight;
              const mh = Math.max(h1, h2);
              dayDescText.style.minHeight = mh + 'px';
              nightDescText.style.minHeight = mh + 'px';
            }
          }
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const margin = 10;
    const availableWidth = pdfWidth - (margin * 2);
    const availableHeight = pdfHeight - (margin * 2);

    const scaleX = availableWidth / (imgWidth * 0.264583);
    const scaleY = availableHeight / (imgHeight * 0.264583);
    const scale = Math.min(scaleX, scaleY);

    const finalWidth = (imgWidth * 0.264583) * scale;
    const finalHeight = (imgHeight * 0.264583) * scale;

    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

    const fileName = routineData.patientName
      ? `${routineData.patientName.replace(/\s+/g, '_')}_rutina_facial.pdf`
      : 'rutina_facial.pdf';

    pdf.save(fileName);

    $q.notify({
      color: 'positive',
      message: 'PDF descargado correctamente',
      icon: 'check',
      position: 'top'
    });

  } catch (error) {
    console.error('Error generando PDF:', error);
    $q.notify({
      color: 'negative',
      message: 'Error al generar el PDF. Por favor, inténtalo de nuevo.',
      icon: 'error',
      position: 'top'
    });
  } finally {
    if (wasEditing) {
      isEditing.value = true;
    }
  }
};

defineExpose({
  saveRoutine,
  downloadPDF,
  resetToInitial,
  recargarProductos,
  isDirty,
  updateSnapshot,
  toggleCatalog,
  showCatalog,
  handleInsertFromCatalog
});
</script>

<style scoped>
.routine-generator-container {
  width: 100%;
  margin: 0 auto;
  color: #1f2937;
}

/* ─── Routine Card (contenedor del plan de rutina) ─── */
.routine-card {
  background-color: #ffffff;
  border: 1px solid #e0e4ea;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

/* ─── Encabezados de Columna DÍA y NOCHE ─── */
.column-header {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #e0e4ea;
}

.column-header--day {
  background: #fffdf5;
  border-color: #fde68a;
}

.column-header--night {
  background: #f8faff;
  border-color: #e0e7ff;
}

.column-header__icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.column-header__icon--day {
  background: #fef3c7;
  color: #d97706;
}

.column-header__icon--night {
  background: #e0e7ff;
  color: #4f46e5;
}

.column-header__title {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.03em;
}

.column-header--day .column-header__title {
  color: #b45309;
}

.column-header--night .column-header__title {
  color: #3730a3;
}

.column-header__subtitle {
  font-size: 0.75rem;
  color: #6b7280;
}

/* ─── Step Cards ─── */
.step-card {
  background: #ffffff;
  border: 1px solid #e0e4ea;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.step-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.step-card--day {
  border-left-color: #f59e0b;
}

.step-card--night {
  border-left-color: #6366f1;
}

.step-card--active {
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.15) !important;
}

/* ─── Step Card Header ─── */
.step-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.step-card__header--readonly {
  background: #f8fafc;
}

/* ─── Badge Numerado ─── */
.step-card__badge {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.step-card__badge--day {
  background: #fef3c7;
  color: #b45309;
}

.step-card__badge--night {
  background: #e0e7ff;
  color: #3730a3;
}

/* ─── Step Title ─── */
.step-card__title-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #1f2937;
  font-weight: 600;
  font-size: 0.95rem;
  outline: none;
  padding: 0.2rem 0;
}

.step-card__title-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.step-card__title-text {
  flex: 1;
  color: #1f2937;
  font-weight: 600;
  font-size: 0.95rem;
}

/* ─── Action Buttons ─── */
.step-card__action-btn {
  opacity: 0.7;
  transition: opacity 0.15s;
}

.step-card__action-btn:hover {
  opacity: 1;
}

.step-card__delete {
  opacity: 0.5;
  transition: all 0.15s ease;
}

.step-card:hover .step-card__delete {
  opacity: 0.8;
}

.step-card__delete:hover {
  opacity: 1 !important;
  color: #c10015 !important;
}

/* ─── Step Card Body ─── */
.step-card__body {
  padding: 0.5rem 0.75rem;
}

.step-card__textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 0.65rem;
  font-size: 0.9rem;
  background-color: #fafbfc;
  color: #1f2937;
  resize: vertical;
  min-height: 64px;
  line-height: 1.5;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
}

.step-card__textarea:focus {
  background-color: #ffffff;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.step-card__description {
  color: #374151;
  min-height: 1.5rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 0.25rem 0;
  font-size: 0.9rem;
}

/* ─── Botón Añadir Paso ─── */
.add-step-btn {
  border: 1.5px dashed #cbd5e1 !important;
  border-radius: 8px !important;
  font-size: 0.85rem !important;
  padding: 0.4rem !important;
  text-transform: none !important;
  transition: all 0.2s ease;
}

.add-step-btn:hover {
  background-color: #f8fafc !important;
  border-color: #94a3b8 !important;
}

/* ─── Notas Section ─── */
.section-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e0e4ea;
}

.section-header__title {
  color: #1f2937;
  font-weight: 600;
  font-size: 0.95rem;
}

/* ─── Panel Lateral de Catálogo (Desktop) ─── */
.catalog-side-col {
  position: sticky;
  top: 16px;
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.catalog-panel-card {
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.catalog-content-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:deep(.catalog-subcomponent) {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

:deep(.category-chips-scroll) {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 4px;
}

:deep(.products-scroll-area) {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
  max-height: calc(100vh - 240px);
}

:deep(.catalog-product-item) {
  border: 1px solid #e0e4ea;
  background: #ffffff;
  transition: all 0.15s ease;
}

:deep(.catalog-product-item:hover) {
  border-color: #1976d2;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.08);
}

:deep(.leading-tight) {
  line-height: 1.25;
}

:deep(.border-top-faint) {
  border-top: 1px solid #f1f5f9;
}

:deep(.text-xs) {
  font-size: 0.7rem;
}

.border-bottom {
  border-bottom: 1px solid #e0e4ea;
}

/* ─── PDF Only / Hidden ─── */
.pdf-only {
  display: none;
}

@media (max-width: 768px) {
  .routine-card {
    padding: 1rem;
  }
}
</style>
