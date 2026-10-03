<template>
  <div class="stepper-view-container">
    <div class="row q-col-gutter-lg items-start">
      <!-- Columna Principal: Stepper Wizard -->
      <div class="col-12 col-lg-8">
        <q-stepper
          v-model="step"
          vertical
          header-nav
          color="primary"
          animated
          flat
          bordered
          class="stepper-card"
        >
          <!-- PASO 1: SALUD GENERAL & ANTECEDENTES -->
          <q-step
            :name="1"
            title="1. Salud General & Antecedentes"
            caption="Patologías, alergias y medicación habitual"
            icon="favorite"
            :done="step > 1"
          >
            <div class="text-subtitle2 text-grey-8 q-mb-sm">Patologías Médicas</div>
            <div class="q-gutter-y-xs q-mb-md">
              <div
                v-for="(item, key) in antecedentesList"
                :key="key"
                class="row items-center justify-between q-py-xs border-bottom-light"
              >
                <span class="text-body2 text-weight-medium" style="max-width: 65%;">
                  {{ item.label }}
                </span>
                <q-btn-toggle
                  v-model="formData.antecedentes[key].aplica"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-stepper"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
                <div class="col-12 q-mt-xs" v-if="formData.antecedentes[key].aplica">
                  <q-input
                    v-model="formData.antecedentes[key].detalle"
                    label="Especificar diagnóstico / tratamiento *"
                    class="minimal-input"
                    borderless
                    dense
                  />
                </div>
              </div>

              <div class="q-pt-sm">
                <q-input
                  v-model="formData.antecedentes.hereditariosRelevantes"
                  label="Antecedentes familiares relevantes"
                  type="textarea"
                  autogrow
                  class="minimal-input"
                  borderless
                  placeholder="Diabetes, hipertensión, cáncer de piel familiar..."
                />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="text-subtitle2 text-grey-8 q-mb-sm">Alergias Conocidas</div>
            <div class="q-gutter-y-xs q-mb-md">
              <div
                v-for="(item, key) in alergiasList"
                :key="key"
                class="row items-center justify-between q-py-xs border-bottom-light"
              >
                <span class="text-body2 text-weight-medium" style="max-width: 65%;">
                  {{ item.label }}
                </span>
                <q-btn-toggle
                  v-model="formData.alergias[key].aplica"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-stepper"
                  toggle-color="orange-9"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
                <div class="col-12 q-mt-xs" v-if="formData.alergias[key].aplica">
                  <q-input
                    v-model="formData.alergias[key].detalle"
                    label="Detalle de alergia *"
                    class="minimal-input"
                    borderless
                    dense
                  />
                </div>
              </div>
            </div>

            <q-stepper-navigation>
              <q-btn color="primary" label="Continuar a Hábitos" @click="step = 2" class="q-px-md" />
            </q-stepper-navigation>
          </q-step>

          <!-- PASO 2: HÁBITOS & ESTILO DE VIDA -->
          <q-step
            :name="2"
            title="2. Hábitos & Estilo de Vida"
            caption="Alimentación, descanso, estrés y rutinas"
            icon="self_improvement"
            :done="step > 2"
          >
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Fuma?</div>
                <q-btn-toggle
                  v-model="formData.habitos.fuma"
                  no-caps
                  rounded
                  dense
                  unelevated
                  class="toggle-stepper"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Consume alcohol?</div>
                <q-btn-toggle
                  v-model="formData.habitos.consumeAlcohol"
                  no-caps
                  rounded
                  dense
                  unelevated
                  class="toggle-stepper"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Ingesta de agua adecuada</div>
                <q-btn-toggle
                  v-model="formData.habitos.ingestaAdecuada"
                  no-caps
                  rounded
                  dense
                  unelevated
                  class="toggle-stepper"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Actividad física</div>
                <q-btn-toggle
                  v-model="formData.habitos.actividadFisica"
                  no-caps
                  rounded
                  dense
                  unelevated
                  spread
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[
                    { label: 'Sedentaria', value: 'Sedentaria' },
                    { label: 'Moderada', value: 'Moderada' },
                    { label: 'Intensa', value: 'Intensa' }
                  ]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Calidad del sueño</div>
                <q-btn-toggle
                  v-model="formData.habitos.calidadSueno"
                  no-caps
                  rounded
                  dense
                  unelevated
                  spread
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[
                    { label: 'Mala', value: 'Mala' },
                    { label: 'Regular', value: 'Regular' },
                    { label: 'Buena', value: 'Buena' }
                  ]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Nivel de estrés</div>
                <q-btn-toggle
                  v-model="formData.habitos.nivelEstres"
                  no-caps
                  rounded
                  dense
                  unelevated
                  spread
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[
                    { label: 'Bajo', value: 'Bajo' },
                    { label: 'Medio', value: 'Medio' },
                    { label: 'Alto', value: 'Alto' }
                  ]"
                />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="text-subtitle2 text-grey-8 q-mb-sm">Historia Ginecológica</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-8">Embarazo / Lactancia</div>
                <q-btn-toggle
                  v-model="formData.ginecologia.embarazoLactancia"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-stepper q-mt-xs"
                  toggle-color="pink-6"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>
              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-8">Uso de anticonceptivos</div>
                <q-btn-toggle
                  v-model="formData.ginecologia.anticonceptivos"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-stepper q-mt-xs"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>
              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-8">Climaterio / Menopausia</div>
                <q-btn-toggle
                  v-model="formData.ginecologia.climaterioMenopausia"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-stepper q-mt-xs"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>
            </div>

            <q-stepper-navigation class="q-mt-lg">
              <q-btn flat color="grey-8" label="Atrás" @click="step = 1" class="q-mr-sm" />
              <q-btn color="primary" label="Continuar a Evaluación Cutánea" @click="step = 3" />
            </q-stepper-navigation>
          </q-step>

          <!-- PASO 3: EVALUACIÓN DERMATOLÓGICA & CUTÁNEA -->
          <q-step
            :name="3"
            title="3. Evaluación Cutánea & Fototipo"
            caption="Biotipo, fototipo de Fitzpatrick y afección actual"
            icon="face"
            :done="step > 3"
          >
            <!-- Fototipo Fitzpatrick -->
            <div class="q-mb-md q-pa-md bg-grey-1 rounded-borders">
              <div class="text-subtitle2 text-grey-9 q-mb-xs">
                Clasificación de Fitzpatrick:
                <q-badge color="primary" class="q-ml-sm" v-if="formData.dermatologicos.fototipo">
                  Fototipo {{ formData.dermatologicos.fototipo }}
                </q-badge>
              </div>
              <div class="row q-gutter-md justify-around items-center q-py-sm">
                <div
                  v-for="n in 6"
                  :key="n"
                  class="fototipo-circle-stepper cursor-pointer flex flex-center"
                  :class="{ 'fototipo-selected': formData.dermatologicos.fototipo == n }"
                  :style="{ backgroundColor: getFototipoColor(n), color: n >= 5 ? '#fff' : '#333' }"
                  @click="formData.dermatologicos.fototipo = (formData.dermatologicos.fototipo == n ? null : n)"
                >
                  {{ n }}
                </div>
              </div>
              <div class="text-caption text-grey-8 text-center q-mt-xs">
                {{ fototipoDescripcion }}
              </div>
            </div>

            <!-- Biotipo Cutáneo -->
            <div class="q-mb-md">
              <div class="text-subtitle2 text-grey-8 q-mb-xs">Biotipo Cutáneo</div>
              <div class="row q-gutter-xs">
                <q-chip
                  v-for="bt in biotiposOptions"
                  :key="bt"
                  clickable
                  :selected="formData.dermatologicos.biotipo === bt"
                  @click="formData.dermatologicos.biotipo = (formData.dermatologicos.biotipo === bt ? '' : bt)"
                  color="blue-1"
                  text-color="primary"
                  selected-color="primary"
                >
                  {{ bt }}
                </q-chip>
              </div>
            </div>

            <!-- Motivo de consulta / afección actual -->
            <div class="q-mb-md">
              <q-input
                v-model="formData.dermatologicos.afeccionActual"
                label="Motivo de la consulta y afección cutánea actual *"
                type="textarea"
                autogrow
                class="minimal-input"
                borderless
                placeholder="Describir afección: lesiones visibles, acné, melasma, rosácea, líneas de expresión..."
              />
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-8">¿Antecedente de Herpes Simple?</div>
                <q-btn-toggle
                  v-model="formData.dermatologicos.herpesSimple"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-stepper q-mt-xs"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-8">¿Cicatrización con queloides?</div>
                <q-btn-toggle
                  v-model="formData.dermatologicos.cicatrizacionQueloides"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-stepper q-mt-xs"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.dermatologicos.protectorSolar"
                  label="Uso de protector solar"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.dermatologicos.exposicionSolar"
                  label="Exposición solar habitual"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>
            </div>

            <q-stepper-navigation class="q-mt-lg">
              <q-btn flat color="grey-8" label="Atrás" @click="step = 2" class="q-mr-sm" />
              <q-btn color="primary" label="Continuar a Seguridad y Gabinete" @click="step = 4" />
            </q-stepper-navigation>
          </q-step>

          <!-- PASO 4: SEGURIDAD, CIRUGÍAS & GABINETE -->
          <q-step
            :name="4"
            title="4. Seguridad & Contraindicaciones"
            caption="Checklist de gabinete, cirugías y medicación crítica"
            icon="security"
          >
            <!-- Contraindicaciones críticas -->
            <div class="q-pa-md bg-red-0 border-negative-subtle rounded-borders q-mb-md">
              <div class="text-subtitle2 text-weight-bold text-negative q-mb-sm row items-center">
                <q-icon name="warning" class="q-mr-xs" size="20px" />
                Contraindicaciones críticas para aparatología y peelings
              </div>
              <div class="q-gutter-y-xs">
                <div
                  v-for="(item, key) in contraindicacionesList"
                  :key="key"
                  class="row items-center justify-between q-py-xs border-bottom-light"
                >
                  <span class="text-body2 text-weight-medium text-grey-9" style="max-width: 65%;">
                    {{ item.label }}
                  </span>
                  <q-btn-toggle
                    v-model="formData.contraindicaciones[key]"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-stepper"
                    :toggle-color="formData.contraindicaciones[key] ? 'negative' : 'grey-7'"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí ⚠️', value: true }]"
                  />
                </div>
              </div>
            </div>

            <!-- Medicación crítica (Isotretinoina, Anticoagulantes, etc.) -->
            <div class="text-subtitle2 text-grey-8 q-mb-sm">Medicación y Tratamientos Recientes</div>
            <div class="q-gutter-y-xs q-mb-md">
              <div
                v-for="(item, key) in medicacionList"
                :key="key"
                class="q-py-xs border-bottom-light"
              >
                <div class="row items-center justify-between no-wrap">
                  <span class="text-body2 text-weight-medium text-grey-9" style="max-width: 65%;">
                    {{ item.label }}
                  </span>
                  <q-btn-toggle
                    v-model="formData.medicacion[key].aplica"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-stepper"
                    toggle-color="purple-8"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>
                <div v-if="formData.medicacion[key].aplica" class="q-mt-xs">
                  <q-input
                    v-model="formData.medicacion[key].detalle"
                    label="Detalle de medicación *"
                    class="minimal-input"
                    borderless
                    dense
                  />
                </div>
              </div>
            </div>

            <!-- Cirugías -->
            <div class="text-subtitle2 text-grey-8 q-mb-sm">Intervenciones Previas</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.cirugias.tratamientosUltimosDosAnos"
                  label="Tratamientos estéticos en los últimos 2 años"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.cirugias.ultimoChequeo"
                  label="Último chequeo médico"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>
            </div>

            <q-stepper-navigation class="q-mt-lg">
              <q-btn flat color="grey-8" label="Atrás" @click="step = 3" class="q-mr-sm" />
              <q-badge color="positive" label="✓ Todos los pasos completados" class="q-pa-sm text-subtitle2" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>

      <!-- Columna Lateral Sticky: LIVE CLINICAL SUMMARY -->
      <div class="col-12 col-lg-4">
        <div class="sticky-summary">
          <q-card flat bordered class="live-summary-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle1 text-weight-bold text-primary row items-center">
                  <q-icon name="assignment" class="q-mr-xs" size="20px" />
                  Resumen Clínico en Vivo
                </div>
                <q-badge color="teal" label="Auto-detect" />
              </div>
              <div class="text-caption text-grey-7 q-mb-md">
                Alertas críticas y perfil de piel generados en tiempo real
              </div>

              <!-- Alertas Críticas de Seguridad -->
              <div class="q-mb-md">
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">ALERTAS DE SEGURIDAD</div>
                <div v-if="alertasCriticas.length > 0" class="q-gutter-y-xs">
                  <div
                    v-for="(alerta, idx) in alertasCriticas"
                    :key="idx"
                    class="alert-badge-item q-pa-xs rounded-borders text-caption text-weight-bold"
                    :class="alerta.clase"
                  >
                    <q-icon :name="alerta.icono" size="16px" class="q-mr-xs" />
                    {{ alerta.texto }}
                  </div>
                </div>
                <div v-else class="text-caption text-positive bg-green-1 q-pa-sm rounded-borders">
                  ✓ Sin contraindicaciones críticas declaradas
                </div>
              </div>

              <!-- Perfil de Piel -->
              <div class="q-mb-md">
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">PERFIL CUTÁNEO</div>
                <div class="row items-center q-gutter-x-sm q-mb-xs">
                  <div class="text-body2 text-grey-8">Fototipo:</div>
                  <q-badge
                    v-if="formData.dermatologicos.fototipo"
                    :style="{ backgroundColor: getFototipoColor(formData.dermatologicos.fototipo), color: formData.dermatologicos.fototipo >= 5 ? '#fff' : '#000' }"
                    class="text-weight-bold text-caption q-pa-xs"
                  >
                    Tipo {{ formData.dermatologicos.fototipo }}
                  </q-badge>
                  <span v-else class="text-caption text-grey-6">Sin definir</span>
                </div>

                <div class="row items-center q-gutter-x-sm q-mb-xs">
                  <div class="text-body2 text-grey-8">Biotipo:</div>
                  <q-badge color="blue-2" text-color="primary" class="text-weight-bold" v-if="formData.dermatologicos.biotipo">
                    {{ formData.dermatologicos.biotipo }}
                  </q-badge>
                  <span v-else class="text-caption text-grey-6">Sin definir</span>
                </div>

                <div v-if="formData.dermatologicos.afeccionActual" class="q-mt-xs">
                  <div class="text-caption text-grey-7">Afección:</div>
                  <div class="text-caption text-weight-medium bg-grey-2 q-pa-xs rounded-borders">
                    {{ formData.dermatologicos.afeccionActual }}
                  </div>
                </div>
              </div>

              <!-- Hábitos Resumen -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">HÁBITOS DETECTADOS</div>
                <div class="row q-gutter-xs">
                  <q-badge :color="formData.habitos.fuma ? 'negative' : 'grey-3'" :text-color="formData.habitos.fuma ? 'white' : 'grey-9'">
                    {{ formData.habitos.fuma ? 'Fumador' : 'No fuma' }}
                  </q-badge>
                  <q-badge :color="formData.habitos.consumeAlcohol ? 'warning' : 'grey-3'" :text-color="formData.habitos.consumeAlcohol ? 'dark' : 'grey-9'">
                    {{ formData.habitos.consumeAlcohol ? 'Alcohol' : 'Sin alcohol' }}
                  </q-badge>
                  <q-badge v-if="formData.habitos.nivelEstres" color="purple-1" text-color="purple-9">
                    Estrés: {{ formData.habitos.nivelEstres }}
                  </q-badge>
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
import { computed, ref } from 'vue';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  antecedentesList: {
    type: Object,
    required: true
  },
  medicacionList: {
    type: Object,
    required: true
  },
  alergiasList: {
    type: Object,
    required: true
  },
  contraindicacionesList: {
    type: Object,
    required: true
  }
});

const step = ref(1);

const biotiposOptions = [
  'Eudérmica',
  'Seca / Alípica',
  'Grasa',
  'Mixta',
  'Sensible'
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

const fototipoDescripcion = computed(() => {
  const desc = {
    1: 'Fototipo I: Muy clara. Siempre se quema, nunca se broncea.',
    2: 'Fototipo II: Clara. Se quema fácilmente, se broncea mínimamente.',
    3: 'Fototipo III: Media. Se quema moderadamente, se broncea gradualmente.',
    4: 'Fototipo IV: Morena clara. Rara vez se quema, se broncea con facilidad.',
    5: 'Fototipo V: Oscura. Muy rara vez se quema, se broncea intensamente.',
    6: 'Fototipo VI: Muy oscura. Nunca se quema, pigmentación profunda.'
  };
  return desc[props.formData.dermatologicos.fototipo] || 'Hacé clic sobre un círculo para seleccionar el fototipo';
});

const alertasCriticas = computed(() => {
  const list = [];
  const c = props.formData.contraindicaciones;
  if (c.marcapasos) list.push({ texto: 'Marcapasos / Implante activo', icono: 'cancel', clase: 'bg-red-1 text-negative' });
  if (c.tratamientoOncologico) list.push({ texto: 'Tratamiento Oncológico activo', icono: 'cancel', clase: 'bg-red-1 text-negative' });
  if (c.implantesMetalicos) list.push({ texto: 'Implantes metálicos en zona', icono: 'warning', clase: 'bg-orange-1 text-orange-9' });
  if (c.heridasInfecciones) list.push({ texto: 'Heridas abiertas o infección', icono: 'cancel', clase: 'bg-red-1 text-negative' });
  if (c.anticoagulantesSinAutorizacion) list.push({ texto: 'Anticoagulantes no autorizados', icono: 'warning', clase: 'bg-orange-1 text-orange-9' });

  const m = props.formData.medicacion;
  if (m.isotretinoina.aplica) list.push({ texto: 'Isotretinoína (Piel sensible / fotosensible)', icono: 'priority_high', clase: 'bg-amber-1 text-brown-9' });
  if (m.anticoagulantes.aplica) list.push({ texto: 'Uso de Anticoagulantes declarado', icono: 'priority_high', clase: 'bg-amber-1 text-brown-9' });

  const g = props.formData.ginecologia;
  if (g.embarazoLactancia) list.push({ texto: 'Embarazo o Lactancia en curso', icono: 'info', clase: 'bg-pink-1 text-pink-9' });

  return list;
});
</script>

<style scoped>
.stepper-view-container {
  width: 100%;
}

.stepper-card {
  border-radius: 14px;
  background-color: #ffffff;
}

.sticky-summary {
  position: sticky;
  top: 80px;
}

.live-summary-card {
  border-radius: 14px;
  background-color: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.alert-badge-item {
  border-left: 3px solid currentColor;
}

.border-bottom-light {
  border-bottom: 1px dashed #e2e8f0;
}

.bg-red-0 {
  background-color: #fffafb !important;
}

.border-negative-subtle {
  border: 1px solid #fecdd3 !important;
}

.toggle-stepper {
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  overflow: hidden;
}

.toggle-stepper :deep(.q-btn) {
  min-width: 44px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
}

.minimal-input {
  background: #f8fafc !important;
  border-radius: 10px;
  border: 1px solid #e2e8f0 !important;
  font-size: 13.5px;
  padding: 2px 10px;
}

.fototipo-circle-stepper {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
  font-size: 15px;
  user-select: none;
}

.fototipo-selected {
  transform: scale(1.18);
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.25) !important;
  z-index: 5;
}
</style>
