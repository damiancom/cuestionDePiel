<template>
  <div class="skin-evaluation-container q-gutter-y-md">
    <!-- Encabezado alineado con las demás pestañas -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6 text-primary flex items-center">
          <q-icon name="face" class="q-mr-sm" size="24px" />
          Evaluación Cutánea & Fototipo
        </div>
        <div class="text-caption text-grey-8">
          Ficha clínica digital de evaluación dermatocosmiátrica y perfil de piel
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-lg items-start">
      <!-- Columna Principal -->
      <div class="col-12 col-lg-8 q-gutter-y-md">
        <q-card flat bordered class="skin-card">
          <q-card-section>
            <!-- 1. Fototipo Fitzpatrick Interactivo -->
            <div class="q-mb-md q-pa-sm bg-grey-1 rounded-borders">
              <div class="text-subtitle2 text-grey-9 q-mb-xs">
                Fototipo - Clasificación de Fitzpatrick:
                <q-badge color="primary" class="q-ml-sm" v-if="formData.fototipo">
                  Fototipo {{ formData.fototipo }}
                </q-badge>
              </div>
              <div class="row no-wrap items-center justify-between q-py-xs fototipo-row">
                <div
                  v-for="n in 6"
                  :key="n"
                  class="fototipo-pill cursor-pointer"
                  :class="{ 'fototipo-selected': formData.fototipo == n }"
                  :style="{ backgroundColor: getFototipoColor(n), color: n >= 5 ? '#fff' : '#333' }"
                  @click="toggleFototipo(n)"
                >
                  <span class="q-px-sm">{{ n }}</span>
                </div>
              </div>
              <div class="text-caption text-grey-8 q-mt-xs">
                {{ fototipoDescripcion }}
              </div>
            </div>

            <!-- 2. Biotipo Cutáneo -->
            <div class="q-mb-md">
              <div class="scale-item q-py-xs q-px-xs">
                <div class="row items-center justify-between scale-row">
                  <span class="text-body2 text-weight-medium text-grey-8">Biotipo Cutáneo</span>
                  <q-btn-toggle
                    v-model="formData.biotipo"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-biotipo"
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    clearable
                    :options="biotiposOptions"
                    @update:model-value="val => { if (!val) formData.biotipo = ''; }"
                  />
                </div>
              </div>
            </div>

            <!-- 3. Condiciones de la Piel -->
            <div class="q-mb-md">
              <div class="text-subtitle2 text-grey-8 q-mb-xs">Condiciones de la Piel</div>
              <div class="condiciones-grid q-gutter-y-xs">
                <!-- Fila 1 -->
                <div class="row q-gutter-x-sm no-wrap items-center justify-between">
                  <q-btn
                    v-for="cond in ['Sensible / Reactiva', 'Deshidratada', 'Acneica']"
                    :key="cond"
                    no-caps
                    rounded
                    unelevated
                    class="condition-pill col text-center"
                    :class="{ 'is-selected': isConditionSelected(cond) }"
                    @click="toggleCondition(cond)"
                  >
                    {{ cond }}
                  </q-btn>
                </div>
                <!-- Fila 2: Frase larga central -->
                <div class="row items-center">
                  <q-btn
                    no-caps
                    rounded
                    unelevated
                    class="condition-pill full-width text-center"
                    :class="{ 'is-selected': isConditionSelected('Discromia (Hipopigmentaciones / hiperpigmentaciones)') }"
                    @click="toggleCondition('Discromia (Hipopigmentaciones / hiperpigmentaciones)')"
                  >
                    Discromia (Hipopigmentaciones / hiperpigmentaciones)
                  </q-btn>
                </div>
                <!-- Fila 3 -->
                <div class="row q-gutter-x-sm no-wrap items-center justify-between">
                  <q-btn
                    v-for="cond in ['Madura', 'Fotoenvejecida']"
                    :key="cond"
                    no-caps
                    rounded
                    unelevated
                    class="condition-pill col text-center"
                    :class="{ 'is-selected': isConditionSelected(cond) }"
                    @click="toggleCondition(cond)"
                  >
                    {{ cond }}
                  </q-btn>
                </div>
              </div>
            </div>

            <!-- 4. Antecedentes Dérmicos Específicos (Herpes & Cicatrización) -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-6 text-center">
                <div class="text-caption text-grey-8">¿Herpes Simple?</div>
                <div class="row justify-center">
                  <q-btn-toggle
                    v-model="formData.herpesSimple"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-custom q-mt-xs"
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>
              </div>

              <div class="col-12 col-sm-6 text-center">
                <div class="text-caption text-grey-8">¿Cicatrización irregular o queloides?</div>
                <div class="row justify-center">
                  <q-btn-toggle
                    v-model="formData.cicatrizacionQueloides"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-custom q-mt-xs"
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>
              </div>
            </div>

            <!-- 5. Afección Cutánea Actual -->
            <div class="q-mt-sm">
              <div class="text-subtitle2 text-grey-8 q-mb-xs">Afección Cutánea Actual / Motivo de Consulta</div>
              <q-input
                v-model="formData.afeccionActual"
                type="textarea"
                autogrow
                placeholder="Describí el estado actual de la piel, lesiones activas, deshidratación, sensibilidad observada o motivo de consulta..."
                class="minimal-input"
                borderless
                dense
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Columna Lateral: Resumen del Perfil de Piel -->
      <div class="col-12 col-lg-4">
        <div class="sticky-summary">
          <q-card flat bordered class="live-summary-card">
            <q-card-section class="q-py-sm">
              <div class="row items-center no-wrap">
                <q-icon name="face" class="q-mr-xs text-primary flex-shrink-0" size="20px" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-primary">
                    Perfil Cutáneo en Vivo
                  </div>
                  <div class="text-caption text-grey-7">
                    Síntesis visual del tipo y estado de la piel
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-gutter-y-sm">
              <div>
                <div class="text-caption text-weight-bold text-grey-8">FOTOTIPO</div>
                <div v-if="formData.fototipo" class="row items-center q-mt-xs">
                  <q-badge
                    class="q-pa-xs text-weight-bold text-caption q-mr-sm"
                    :style="{ backgroundColor: getFototipoColor(formData.fototipo), color: formData.fototipo >= 5 ? '#fff' : '#000' }"
                  >
                    Tipo {{ formData.fototipo }}
                  </q-badge>
                  <span class="text-caption text-grey-9">{{ fototipoDescripcion }}</span>
                </div>
                <div v-else class="text-caption text-grey-5 italic q-mt-xs">No especificado</div>
              </div>

              <q-separator />

              <div>
                <div class="text-caption text-weight-bold text-grey-8">BIOTIPO</div>
                <q-badge color="blue-2" text-color="primary" class="text-weight-bold q-mt-xs" v-if="formData.biotipo">
                  {{ formData.biotipo }}
                </q-badge>
                <div v-else class="text-caption text-grey-5 italic q-mt-xs">No especificado</div>
              </div>

              <q-separator />

              <div>
                <div class="text-caption text-weight-bold text-grey-8">CONDICIONES ACTIVAS</div>
                <div v-if="formData.condiciones.length > 0" class="row q-gutter-xs q-mt-xs">
                  <q-badge
                    v-for="(c, idx) in formData.condiciones"
                    :key="idx"
                    color="grey-3"
                    text-color="grey-9"
                  >
                    {{ c }}
                  </q-badge>
                </div>
                <div v-else class="text-caption text-grey-5 italic q-mt-xs">Sin condiciones particulares declaradas</div>
              </div>

              <q-separator />

              <div>
                <div class="text-caption text-weight-bold text-grey-8">ANTECEDENTES DÉRMICOS</div>
                <div class="q-gutter-y-xs q-mt-xs text-caption">
                  <div class="row items-center justify-between">
                    <span>Herpes Simple:</span>
                    <q-badge :color="formData.herpesSimple ? 'warning' : 'grey-3'" :text-color="formData.herpesSimple ? 'dark' : 'grey-8'">
                      {{ formData.herpesSimple ? 'Sí' : 'No' }}
                    </q-badge>
                  </div>
                  <div class="row items-center justify-between">
                    <span>Queloides / Cicatrización:</span>
                    <q-badge :color="formData.cicatrizacionQueloides ? 'warning' : 'grey-3'" :text-color="formData.cicatrizacionQueloides ? 'dark' : 'grey-8'">
                      {{ formData.cicatrizacionQueloides ? 'Sí' : 'No' }}
                    </q-badge>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, watch } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
});

const biotiposOptions = [
  { label: 'Eutrófica', value: 'Eutrófica' },
  { label: 'Seca / Alípica', value: 'Seca / Alípica' },
  { label: 'Grasa', value: 'Grasa' },
  { label: 'Mixta', value: 'Mixta' }
];

function getFototipoColor(n) {
  const colors = {
    1: '#f8dcd1',
    2: '#f0c7b1',
    3: '#e2b397',
    4: '#c58e6e',
    5: '#8c593d',
    6: '#492f22'
  };
  return colors[n] || '#ccc';
}

const formData = reactive({
  fototipo: null,
  biotipo: '',
  condiciones: [],
  herpesSimple: false,
  cicatrizacionQueloides: false,
  afeccionActual: ''
});

const fototipoDescripcion = computed(() => {
  const desc = {
    1: 'I - Muy clara, pelirroja. Siempre se quema, nunca se broncea.',
    2: 'II - Clara, sensible. Se quema fácilmente, se broncea mínimamente.',
    3: 'III - Clara a intermedia. Se quema moderadamente, se broncea de forma gradual.',
    4: 'IV - Intermedia / Mediterránea. Se quema rara vez, se broncea con facilidad.',
    5: 'V - Oscura. Rara vez se quema, se broncea de forma intensa y rápida.',
    6: 'VI - Muy oscura / Negra. Nunca se quema, pigmentación profunda y constante.'
  };
  return desc[formData.fototipo] || 'Hacé clic en un número para seleccionar el fototipo Fitzpatrick';
});

function toggleFototipo(n) {
  formData.fototipo = formData.fototipo === n ? null : n;
}

function isConditionSelected(cond) {
  return formData.condiciones.includes(cond);
}

function toggleCondition(cond) {
  const idx = formData.condiciones.indexOf(cond);
  if (idx >= 0) {
    formData.condiciones.splice(idx, 1);
  } else {
    formData.condiciones.push(cond);
  }
}

function resetData() {
  formData.fototipo = null;
  formData.biotipo = '';
  formData.condiciones = [];
  formData.herpesSimple = false;
  formData.cicatrizacionQueloides = false;
  formData.afeccionActual = '';
  updateSnapshot();
}

function loadData(data) {
  if (!data) return;

  const val = (snake, camel, defaultVal = null) => {
    if (data[snake] !== undefined && data[snake] !== null) return data[snake];
    if (camel && data[camel] !== undefined && data[camel] !== null) return data[camel];
    return defaultVal;
  };

  const rawFototipo = val('phototype', 'phototype', null);
  formData.fototipo = rawFototipo != null && rawFototipo !== '' ? Number(rawFototipo) : null;
  formData.biotipo = val('skin_biotype', 'skinBiotype', '') || '';

  const rawCond = val('skin_conditions', 'skinConditions', '');
  if (Array.isArray(rawCond)) {
    formData.condiciones = rawCond;
  } else if (typeof rawCond === 'string' && rawCond.trim()) {
    formData.condiciones = rawCond.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    formData.condiciones = [];
  }

  formData.herpesSimple = !!val('has_herpes_simplex', 'hasHerpesSimplex', false);
  formData.cicatrizacionQueloides = !!val('has_keloids_irregular_scarring', 'hasKeloidsIrregularScarring', false);
  formData.afeccionActual = val('current_skin_condition', 'currentSkinCondition', '') || '';

  updateSnapshot();
}

function toBackendPayload() {
  return {
    phototype: formData.fototipo != null ? String(formData.fototipo) : '',
    skin_biotype: formData.biotipo || '',
    skin_conditions: (formData.condiciones || []).join(', '),
    has_herpes_simplex: formData.herpesSimple,
    has_keloids_irregular_scarring: formData.cicatrizacionQueloides,
    current_skin_condition: formData.afeccionActual || ''
  };
}

const lastSavedSnapshot = ref('');

function updateSnapshot() {
  try {
    lastSavedSnapshot.value = JSON.stringify(toBackendPayload());
  } catch (e) {
    console.warn('Error calculando snapshot de evaluación cutánea', e);
  }
}

function isDirty() {
  if (!lastSavedSnapshot.value) return false;
  try {
    return JSON.stringify(toBackendPayload()) !== lastSavedSnapshot.value;
  } catch (e) {
    return false;
  }
}

// Inicializar snapshot
updateSnapshot();

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      loadData(newVal);
    }
  },
  { immediate: true }
);

defineExpose({
  formData,
  loadData,
  toBackendPayload,
  resetData,
  isDirty,
  updateSnapshot
});
</script>

<style scoped>
.skin-evaluation-container {
  width: 100%;
}

.skin-card {
  border-radius: 12px;
  border-color: #e0e0e0;
  background-color: #fafbfc;
}

.live-summary-card {
  border-radius: 12px;
  border-color: #d1d5db;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.sticky-summary {
  position: sticky;
  top: 80px;
}

.fototipo-row {
  width: 100%;
}

.fototipo-pill {
  width: clamp(34px, 8.5vw, 44px);
  height: clamp(34px, 8.5vw, 44px);
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  font-weight: bold;
  font-size: clamp(13px, 3.5vw, 15px);
  user-select: none;
  flex-shrink: 0;
}

.fototipo-selected {
  transform: scale(1.15);
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.25) !important;
  z-index: 10;
}

.scale-item {
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #eef2f6;
}

.scale-row {
  min-height: 40px;
  padding: 4px 8px;
}

.toggle-biotipo {
  border: 1px solid #e0e4ea;
  border-radius: 16px;
  overflow: hidden;
}

.condition-pill {
  background: #ffffff;
  border: 1px solid #e0e4ea;
  color: #374151;
  font-weight: 500;
  font-size: 13px;
  padding: 6px 12px;
  transition: all 0.2s ease;
}

.condition-pill.is-selected {
  background: #1976d2 !important;
  color: #ffffff !important;
  border-color: #1976d2 !important;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.25);
}

.toggle-custom {
  border: 1px solid #d0d7de;
  border-radius: 20px;
  overflow: hidden;
}

.minimal-input {
  background: #f8fafc !important;
  border-radius: 12px;
  border: 1px solid #e0e4ea !important;
  box-shadow: none !important;
  font-size: 14px;
  padding: 4px 12px;
  transition: all 0.2s ease;
}

.minimal-input:focus-within {
  border-color: #1976d2 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
}
</style>
