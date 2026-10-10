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
          Ficha clínica digital de evaluación dermatocosmiátrica, fototipo y lesiones de la piel
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-lg items-start">
      <!-- Columna Principal -->
      <div class="col-12 col-lg-8 q-gutter-y-md">

        <!-- 1. FOTOTIPO, BIOTIPO & CONDICIONES -->
        <q-card flat bordered class="skin-card">
          <q-card-section>
            <!-- Fototipo Fitzpatrick Interactivo -->
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

            <!-- Biotipo Cutáneo -->
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

            <!-- Condiciones de la Piel -->
            <div class="q-mb-md">
              <div class="text-subtitle2 text-grey-8 q-mb-xs">Condiciones de la Piel</div>
              <div class="condiciones-grid q-gutter-y-xs">
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

            <!-- Antecedentes Dérmicos (Herpes & Cicatrización irregular) -->
            <div class="row q-col-gutter-md">
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
          </q-card-section>
        </q-card>

        <!-- 2. ALTERACIONES PRIMARIAS / LESIONES DE LA PIEL -->
        <q-card flat bordered class="skin-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="collapsedLesiones = !collapsedLesiones"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="indigo-1" text-color="indigo-9" icon="healing" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">Alteraciones primarias / Lesiones de la piel</div>
                <div class="text-caption text-grey-7">Comedones, pápulas, pústulas, hiperpigmentaciones, cicatrices y signos cutáneos</div>
              </div>
            </div>
            <div class="row items-center no-wrap q-gutter-x-xs">
              <q-badge color="indigo" :label="`${totalLesionesActivas} activas`" v-if="totalLesionesActivas > 0" />
              <q-btn
                flat
                round
                dense
                color="grey-7"
                :icon="collapsedLesiones ? 'expand_more' : 'expand_less'"
                @click.stop="collapsedLesiones = !collapsedLesiones"
              />
            </div>
          </q-card-section>

          <q-slide-transition>
            <div v-show="!collapsedLesiones">
              <q-separator />
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div
                    v-for="(item, key) in lesionesList"
                    :key="key"
                    class="col-12 col-md-6"
                  >
                    <div
                      class="hybrid-subitem q-py-sm q-px-md rounded-borders"
                      :class="{ 'bg-blue-1 border-primary-subtle': formData.lesiones[key]?.aplica }"
                    >
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <div class="col" style="min-width: 0; word-break: break-word; overflow-wrap: break-word;">
                          <div class="text-body2 text-weight-medium text-grey-9 lh-snug">{{ item.label }}</div>
                          <div v-if="item.subtitle" class="text-caption text-primary text-weight-medium" style="word-break: break-word; overflow-wrap: break-word;">
                            {{ item.subtitle }}
                          </div>
                        </div>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.lesiones[key].aplica"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            toggle-color="primary"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>

                      <q-slide-transition>
                        <div v-if="formData.lesiones[key]?.aplica" class="q-mt-sm">
                          <q-input
                            v-model="formData.lesiones[key].detalle"
                            :placeholder="item.placeholder || 'Detalle, localización o grado...'"
                            type="textarea"
                            autogrow
                            class="minimal-input"
                            borderless
                            dense
                          />
                        </div>
                      </q-slide-transition>
                    </div>
                  </div>

                  <!-- OTROS: campo directo de carga sin selector Sí/No -->
                  <div class="col-12 q-mt-xs">
                    <div
                      class="hybrid-subitem q-py-sm q-px-md rounded-borders"
                      :class="{ 'bg-blue-1 border-primary-subtle': !!(formData.lesiones.otherLesions.detalle && formData.lesiones.otherLesions.detalle.trim()) }"
                    >
                      <div class="text-body2 text-weight-medium text-grey-9 q-mb-xs">Otros:</div>
                      <q-input
                        v-model="formData.lesiones.otherLesions.detalle"
                        placeholder="Especificar otras alteraciones o lesiones..."
                        type="textarea"
                        autogrow
                        class="minimal-input"
                        borderless
                        dense
                      />
                    </div>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>

        <!-- 3. AFECCIÓN CUTÁNEA ACTUAL / MOTIVO DE CONSULTA -->
        <q-card flat bordered class="skin-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-8 q-mb-xs">Afección Cutánea Actual / Motivo de Consulta</div>
            <q-input
              v-model="formData.afeccionActual"
              type="textarea"
              autogrow
              placeholder="Describí el estado actual de la piel, lesiones activas preponderantes, sensibilidad observada o motivo de consulta..."
              class="minimal-input"
              borderless
              dense
            />
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
              <!-- Fototipo -->
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

              <!-- Biotipo -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8">BIOTIPO</div>
                <q-badge color="blue-2" text-color="primary" class="text-weight-bold q-mt-xs" v-if="formData.biotipo">
                  {{ formData.biotipo }}
                </q-badge>
                <div v-else class="text-caption text-grey-5 italic q-mt-xs">No especificado</div>
              </div>

              <q-separator />

              <!-- Condiciones Activas -->
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

              <!-- Lesiones y Alteraciones Detectadas -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8">LESIONES / ALTERACIONES DETECTADAS</div>
                <div v-if="lesionesActivasResumen.length > 0" class="row q-gutter-xs q-mt-xs">
                  <q-badge
                    v-for="(les, idx) in lesionesActivasResumen"
                    :key="idx"
                    color="indigo-1"
                    text-color="indigo-9"
                    class="q-pa-xs text-caption lesion-summary-badge"
                  >
                    <q-icon name="circle" size="6px" class="q-mr-xs text-indigo flex-shrink-0" />
                    <span>{{ les.label }}</span>
                    <span v-if="les.detalle" class="text-weight-regular text-grey-8 q-ml-xs">({{ les.detalle }})</span>
                  </q-badge>
                </div>
                <div v-else class="text-caption text-grey-5 italic q-mt-xs">Sin alteraciones primarias declaradas</div>
              </div>

              <q-separator />

              <!-- Antecedentes Dérmicos -->
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

const collapsedLesiones = ref(false);

const biotiposOptions = [
  { label: 'Eutrófica', value: 'Eutrófica' },
  { label: 'Seca / Alípica', value: 'Seca / Alípica' },
  { label: 'Grasa', value: 'Grasa' },
  { label: 'Mixta', value: 'Mixta' }
];

const lesionesList = {
  openComedones: {
    label: 'Comedones abiertos',
    detailKey: 'open_comedones_detail',
    placeholder: 'Localización (zona T, mejillas, etc.)...'
  },
  closedComedones: {
    label: 'Comedones cerrados',
    detailKey: 'closed_comedones_detail',
    placeholder: 'Localización o cantidad...'
  },
  papules: {
    label: 'Pápulas',
    detailKey: 'papules_detail',
    placeholder: 'Zonas afectadas...'
  },
  pustules: {
    label: 'Pústulas',
    detailKey: 'pustules_detail',
    placeholder: 'Zonas afectadas o evolución...'
  },
  miliumCysts: {
    label: 'Quistes de milium',
    detailKey: 'milium_cysts_detail',
    placeholder: 'Zona periocular, mejillas, etc...'
  },
  sebaceousCysts: {
    label: 'Quistes sebáceos',
    detailKey: 'sebaceous_cysts_detail',
    placeholder: 'Localización y tamaño...'
  },
  hyperpigmentation: {
    label: 'Hiperpigmentaciones',
    subtitle: '(máculas / lentigos / melasma)',
    detailKey: 'hyperpigmentation_detail',
    placeholder: 'Especificar tipo (máculas, lentigos, melasma), zona...'
  },
  erythema: {
    label: 'Eritema',
    detailKey: 'erythema_detail',
    placeholder: 'Difuso, localizado, zona malar...'
  },
  telangiectasias: {
    label: 'Telangiectasias',
    detailKey: 'telangiectasias_detail',
    placeholder: 'Alas nasales, pómulos, mentón...'
  },
  flaking: {
    label: 'Escamación (Escamas)',
    detailKey: 'flaking_detail',
    placeholder: 'Zona periocular, perinasal, etc...'
  },
  atrophicScars: {
    label: 'Cicatrices atróficas',
    detailKey: 'atrophic_scars_detail',
    placeholder: 'Secuelas de acné, zona...'
  },
  hypertrophicScars: {
    label: 'Cicatrices hipertróficas',
    detailKey: 'hypertrophic_scars_detail',
    placeholder: 'Localización...'
  },
  acne: {
    label: 'Acné',
    detailKey: 'acne_detail',
    placeholder: 'Grado (I, II, III), activo, comedónico, inflamatorio...'
  },
  hyperkeratosis: {
    label: 'Hiperqueratosis',
    detailKey: 'hyperkeratosis_detail',
    placeholder: 'Zonas de engrosamiento...'
  },
  expressionLines: {
    label: 'Líneas de expresión',
    detailKey: 'expression_lines_detail',
    placeholder: 'Frente, entrecejo, perioculares...'
  },
  wrinkles: {
    label: 'Arrugas',
    detailKey: 'wrinkles_detail',
    placeholder: 'Finas, profundas, gravídicas...'
  },
  dermatitis: {
    label: 'Dermatitis',
    detailKey: 'dermatitis_detail',
    placeholder: 'Atópica, seborreica, por contacto...'
  },
  flaccidity: {
    label: 'Flacidez',
    detailKey: 'flaccidity_detail',
    placeholder: 'Óvalo facial, cuello, párpados...'
  }
};

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
  afeccionActual: '',

  // Alteraciones primarias / Lesiones de la piel
  lesiones: {
    openComedones: { aplica: false, detalle: '' },
    closedComedones: { aplica: false, detalle: '' },
    papules: { aplica: false, detalle: '' },
    pustules: { aplica: false, detalle: '' },
    miliumCysts: { aplica: false, detalle: '' },
    sebaceousCysts: { aplica: false, detalle: '' },
    hyperpigmentation: { aplica: false, detalle: '' },
    erythema: { aplica: false, detalle: '' },
    telangiectasias: { aplica: false, detalle: '' },
    flaking: { aplica: false, detalle: '' },
    atrophicScars: { aplica: false, detalle: '' },
    hypertrophicScars: { aplica: false, detalle: '' },
    acne: { aplica: false, detalle: '' },
    hyperkeratosis: { aplica: false, detalle: '' },
    expressionLines: { aplica: false, detalle: '' },
    wrinkles: { aplica: false, detalle: '' },
    dermatitis: { aplica: false, detalle: '' },
    flaccidity: { aplica: false, detalle: '' },
    otherLesions: { aplica: false, detalle: '' }
  }
});

const totalLesionesActivas = computed(() => {
  return Object.values(formData.lesiones).filter(item => item.aplica).length;
});

watch(
  () => formData.lesiones.otherLesions.detalle,
  (val) => {
    formData.lesiones.otherLesions.aplica = !!(val && val.trim().length > 0);
  }
);

const lesionesActivasResumen = computed(() => {
  const result = [];
  for (const [key, conf] of Object.entries(lesionesList)) {
    if (formData.lesiones[key]?.aplica) {
      result.push({
        label: conf.label,
        detalle: formData.lesiones[key].detalle || ''
      });
    }
  }
  if (formData.lesiones.otherLesions.detalle && formData.lesiones.otherLesions.detalle.trim()) {
    result.push({
      label: 'Otros',
      detalle: formData.lesiones.otherLesions.detalle.trim()
    });
  }
  return result;
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

  Object.keys(formData.lesiones).forEach(k => {
    formData.lesiones[k].aplica = false;
    formData.lesiones[k].detalle = '';
  });

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

  // Alteraciones primarias / Lesiones de la piel
  formData.lesiones.openComedones.aplica = !!val('has_open_comedones', 'hasOpenComedones', false);
  formData.lesiones.openComedones.detalle = val('open_comedones_detail', 'openComedonesDetail', '') || '';

  formData.lesiones.closedComedones.aplica = !!val('has_closed_comedones', 'hasClosedComedones', false);
  formData.lesiones.closedComedones.detalle = val('closed_comedones_detail', 'closedComedonesDetail', '') || '';

  formData.lesiones.papules.aplica = !!val('has_papules', 'hasPapules', false);
  formData.lesiones.papules.detalle = val('papules_detail', 'papulesDetail', '') || '';

  formData.lesiones.pustules.aplica = !!val('has_pustules', 'hasPustules', false);
  formData.lesiones.pustules.detalle = val('pustules_detail', 'pustulesDetail', '') || '';

  formData.lesiones.miliumCysts.aplica = !!val('has_milium_cysts', 'hasMiliumCysts', false);
  formData.lesiones.miliumCysts.detalle = val('milium_cysts_detail', 'miliumCystsDetail', '') || '';

  formData.lesiones.sebaceousCysts.aplica = !!val('has_sebaceous_cysts', 'hasSebaceousCysts', false);
  formData.lesiones.sebaceousCysts.detalle = val('sebaceous_cysts_detail', 'sebaceousCystsDetail', '') || '';

  formData.lesiones.hyperpigmentation.aplica = !!val('has_hyperpigmentation', 'hasHyperpigmentation', false);
  formData.lesiones.hyperpigmentation.detalle = val('hyperpigmentation_detail', 'hyperpigmentationDetail', '') || '';

  formData.lesiones.erythema.aplica = !!val('has_erythema', 'hasErythema', false);
  formData.lesiones.erythema.detalle = val('erythema_detail', 'erythemaDetail', '') || '';

  formData.lesiones.telangiectasias.aplica = !!val('has_telangiectasias', 'hasTelangiectasias', false);
  formData.lesiones.telangiectasias.detalle = val('telangiectasias_detail', 'telangiectasiasDetail', '') || '';

  formData.lesiones.flaking.aplica = !!val('has_flaking', 'hasFlaking', false);
  formData.lesiones.flaking.detalle = val('flaking_detail', 'flakingDetail', '') || '';

  formData.lesiones.atrophicScars.aplica = !!val('has_atrophic_scars', 'hasAtrophicScars', false);
  formData.lesiones.atrophicScars.detalle = val('atrophic_scars_detail', 'atrophicScarsDetail', '') || '';

  formData.lesiones.hypertrophicScars.aplica = !!val('has_hypertrophic_scars', 'hasHypertrophicScars', false);
  formData.lesiones.hypertrophicScars.detalle = val('hypertrophic_scars_detail', 'hypertrophicScarsDetail', '') || '';

  formData.lesiones.acne.aplica = !!val('has_acne', 'hasAcne', false);
  formData.lesiones.acne.detalle = val('acne_detail', 'acneDetail', '') || '';

  formData.lesiones.hyperkeratosis.aplica = !!val('has_hyperkeratosis', 'hasHyperkeratosis', false);
  formData.lesiones.hyperkeratosis.detalle = val('hyperkeratosis_detail', 'hyperkeratosisDetail', '') || '';

  formData.lesiones.expressionLines.aplica = !!val('has_expression_lines', 'hasExpressionLines', false);
  formData.lesiones.expressionLines.detalle = val('expression_lines_detail', 'expressionLinesDetail', '') || '';

  formData.lesiones.wrinkles.aplica = !!val('has_wrinkles', 'hasWrinkles', false);
  formData.lesiones.wrinkles.detalle = val('wrinkles_detail', 'wrinklesDetail', '') || '';

  formData.lesiones.dermatitis.aplica = !!val('has_dermatitis', 'hasDermatitis', false);
  formData.lesiones.dermatitis.detalle = val('dermatitis_detail', 'dermatitisDetail', '') || '';

  formData.lesiones.flaccidity.aplica = !!val('has_flaccidity', 'hasFlaccidity', false);
  formData.lesiones.flaccidity.detalle = val('flaccidity_detail', 'flaccidityDetail', '') || '';

  const otherDet = val('other_lesions_detail', 'otherLesionsDetail', '') || '';
  formData.lesiones.otherLesions.detalle = otherDet;
  formData.lesiones.otherLesions.aplica = !!(otherDet && otherDet.trim().length > 0);

  updateSnapshot();
}

function toBackendPayload() {
  const hasOther = !!(formData.lesiones.otherLesions.detalle && formData.lesiones.otherLesions.detalle.trim().length > 0);
  return {
    phototype: formData.fototipo != null ? String(formData.fototipo) : '',
    skin_biotype: formData.biotipo || '',
    skin_conditions: (formData.condiciones || []).join(', '),
    has_herpes_simplex: formData.herpesSimple,
    has_keloids_irregular_scarring: formData.cicatrizacionQueloides,
    current_skin_condition: formData.afeccionActual || '',

    // Alteraciones primarias / Lesiones de la piel
    has_open_comedones: formData.lesiones.openComedones.aplica,
    open_comedones_detail: formData.lesiones.openComedones.aplica ? formData.lesiones.openComedones.detalle : '',

    has_closed_comedones: formData.lesiones.closedComedones.aplica,
    closed_comedones_detail: formData.lesiones.closedComedones.aplica ? formData.lesiones.closedComedones.detalle : '',

    has_papules: formData.lesiones.papules.aplica,
    papules_detail: formData.lesiones.papules.aplica ? formData.lesiones.papules.detalle : '',

    has_pustules: formData.lesiones.pustules.aplica,
    pustules_detail: formData.lesiones.pustules.aplica ? formData.lesiones.pustules.detalle : '',

    has_milium_cysts: formData.lesiones.miliumCysts.aplica,
    milium_cysts_detail: formData.lesiones.miliumCysts.aplica ? formData.lesiones.miliumCysts.detalle : '',

    has_sebaceous_cysts: formData.lesiones.sebaceousCysts.aplica,
    sebaceous_cysts_detail: formData.lesiones.sebaceousCysts.aplica ? formData.lesiones.sebaceousCysts.detalle : '',

    has_hyperpigmentation: formData.lesiones.hyperpigmentation.aplica,
    hyperpigmentation_detail: formData.lesiones.hyperpigmentation.aplica ? formData.lesiones.hyperpigmentation.detalle : '',

    has_erythema: formData.lesiones.erythema.aplica,
    erythema_detail: formData.lesiones.erythema.aplica ? formData.lesiones.erythema.detalle : '',

    has_telangiectasias: formData.lesiones.telangiectasias.aplica,
    telangiectasias_detail: formData.lesiones.telangiectasias.aplica ? formData.lesiones.telangiectasias.detalle : '',

    has_flaking: formData.lesiones.flaking.aplica,
    flaking_detail: formData.lesiones.flaking.aplica ? formData.lesiones.flaking.detalle : '',

    has_atrophic_scars: formData.lesiones.atrophicScars.aplica,
    atrophic_scars_detail: formData.lesiones.atrophicScars.aplica ? formData.lesiones.atrophicScars.detalle : '',

    has_hypertrophic_scars: formData.lesiones.hypertrophicScars.aplica,
    hypertrophic_scars_detail: formData.lesiones.hypertrophicScars.aplica ? formData.lesiones.hypertrophicScars.detalle : '',

    has_acne: formData.lesiones.acne.aplica,
    acne_detail: formData.lesiones.acne.aplica ? formData.lesiones.acne.detalle : '',

    has_hyperkeratosis: formData.lesiones.hyperkeratosis.aplica,
    hyperkeratosis_detail: formData.lesiones.hyperkeratosis.aplica ? formData.lesiones.hyperkeratosis.detalle : '',

    has_expression_lines: formData.lesiones.expressionLines.aplica,
    expression_lines_detail: formData.lesiones.expressionLines.aplica ? formData.lesiones.expressionLines.detalle : '',

    has_wrinkles: formData.lesiones.wrinkles.aplica,
    wrinkles_detail: formData.lesiones.wrinkles.aplica ? formData.lesiones.wrinkles.detalle : '',

    has_dermatitis: formData.lesiones.dermatitis.aplica,
    dermatitis_detail: formData.lesiones.dermatitis.aplica ? formData.lesiones.dermatitis.detalle : '',

    has_flaccidity: formData.lesiones.flaccidity.aplica,
    flaccidity_detail: formData.lesiones.flaccidity.aplica ? formData.lesiones.flaccidity.detalle : '',

    has_other_lesions: hasOther,
    other_lesions_detail: hasOther ? formData.lesiones.otherLesions.detalle.trim() : ''
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

.header-collapsible {
  background-color: #f1f5f9;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.hybrid-subitem {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  word-break: break-word;
  overflow-wrap: break-word;
}

.hybrid-subitem:hover {
  border-color: #cbd5e1;
}

.border-primary-subtle {
  border-color: #bfdbfe !important;
}

.live-summary-card {
  border-radius: 12px;
  border-color: #d1d5db;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.live-summary-card :deep(.q-badge) {
  white-space: normal !important;
  word-break: break-word;
  overflow-wrap: break-word;
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

.toggle-hybrid {
  border: 1px solid #d0d7de;
  border-radius: 20px;
  overflow: hidden;
}

.toggle-hybrid :deep(.q-btn) {
  min-width: 50px;
  padding: 4px 10px;
  font-weight: 600;
  font-size: 12.5px;
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
  font-size: 13.5px;
  padding: 4px 12px;
  transition: all 0.2s ease;
}

.minimal-input:focus-within {
  border-color: #1976d2 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
}

.minimal-input :deep(textarea) {
  resize: none;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.lesion-summary-badge {
  white-space: normal !important;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.35;
  text-align: left;
  display: inline-flex;
  align-items: flex-start;
  max-width: 100%;
}
</style>
