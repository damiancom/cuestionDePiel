<template>
  <div class="bento-container q-gutter-y-md">
    <div class="row q-col-gutter-md">
      <!-- 1. ANTECEDENTES PERSONALES Y HEREDITARIOS (Columna izquierda principal) -->
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="bento-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="32px" color="teal-1" text-color="teal-8" icon="favorite" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">1. Antecedentes Médicos y Patologías</div>
                <div class="text-caption text-grey-7">Patologías activas o previas y antecedentes familiares</div>
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mt-xs">
              <div
                v-for="(item, key) in antecedentesList"
                :key="key"
                class="col-12 col-sm-6"
              >
                <div class="bento-subitem q-pa-sm rounded-borders" :class="{ 'bg-teal-0': formData.antecedentes[key].aplica }">
                  <div class="row items-center justify-between no-wrap">
                    <span class="text-body2 text-weight-medium text-grey-9 text-ellipsis" style="max-width: 65%;">
                      {{ item.label }}
                    </span>
                    <q-btn-toggle
                      v-model="formData.antecedentes[key].aplica"
                      no-caps
                      dense
                      rounded
                      unelevated
                      class="toggle-bento"
                      toggle-color="teal"
                      color="grey-2"
                      text-color="grey-8"
                      :options="[
                        { label: 'No', value: false },
                        { label: 'Sí', value: true }
                      ]"
                    />
                  </div>
                  <q-slide-transition>
                    <div v-if="formData.antecedentes[key].aplica" class="q-mt-xs">
                      <q-input
                        v-model="formData.antecedentes[key].detalle"
                        label="Detalle *"
                        class="minimal-input"
                        borderless
                        dense
                        placeholder="Especificar diagnóstico/medicación..."
                      />
                    </div>
                  </q-slide-transition>
                </div>
              </div>
            </div>

            <div class="q-mt-md">
              <q-input
                v-model="formData.antecedentes.hereditariosRelevantes"
                label="Antecedentes hereditarios relevantes"
                type="textarea"
                autogrow
                class="minimal-input"
                borderless
                placeholder="Diabetes, hipertensión, afecciones cutáneas familiares..."
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 2. HÁBITOS Y ESTILO DE VIDA (Columna derecha) -->
      <div class="col-12 col-lg-5">
        <q-card flat bordered class="bento-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="32px" color="blue-1" text-color="blue-8" icon="self_improvement" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">2. Hábitos y Estilo de Vida</div>
                <div class="text-caption text-grey-7">Factores cotidianos e impacto en la piel</div>
              </div>
            </div>

            <div class="q-gutter-y-sm q-mt-xs">
              <div class="row items-center justify-between q-py-xs border-bottom-light">
                <span class="text-body2 text-weight-medium">¿Fuma?</span>
                <q-btn-toggle
                  v-model="formData.habitos.fuma"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-bento"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="row items-center justify-between q-py-xs border-bottom-light">
                <span class="text-body2 text-weight-medium">¿Consume alcohol?</span>
                <q-btn-toggle
                  v-model="formData.habitos.consumeAlcohol"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-bento"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="row items-center justify-between q-py-xs border-bottom-light">
                <span class="text-body2 text-weight-medium">Ingesta hídrica adecuada</span>
                <q-btn-toggle
                  v-model="formData.habitos.ingestaAdecuada"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-bento"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="q-pt-xs">
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

              <div class="q-pt-xs">
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

              <div class="q-pt-xs">
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
          </q-card-section>
        </q-card>
      </div>

      <!-- 3. EVALUACIÓN DERMATOLÓGICA & FOTOTIPO (Columna izquierda principal) -->
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="bento-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="32px" color="amber-1" text-color="amber-9" icon="face" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">3. Evaluación Cutánea & Fototipo</div>
                <div class="text-caption text-grey-7">Clasificación de Fitzpatrick y biotipo cutáneo</div>
              </div>
            </div>

            <!-- Fototipo Fitzpatrick -->
            <div class="q-mb-md q-pa-sm bg-grey-1 rounded-borders">
              <div class="text-subtitle2 text-grey-9 q-mb-xs">
                Fototipo de Fitzpatrick:
                <q-badge color="primary" class="q-ml-sm" v-if="formData.dermatologicos.fototipo">
                  Fototipo {{ formData.dermatologicos.fototipo }}
                </q-badge>
              </div>
              <div class="row q-gutter-md justify-around items-center q-py-sm">
                <div
                  v-for="n in 6"
                  :key="n"
                  class="fototipo-circle-bento cursor-pointer flex flex-center"
                  :class="{ 'fototipo-selected': formData.dermatologicos.fototipo == n }"
                  :style="{ backgroundColor: getFototipoColor(n), color: n >= 5 ? '#fff' : '#333' }"
                  @click="formData.dermatologicos.fototipo = (formData.dermatologicos.fototipo == n ? null : n)"
                >
                  {{ n }}
                </div>
              </div>
              <div class="text-caption text-grey-7 text-center">
                {{ fototipoDescripcion }}
              </div>
            </div>

            <!-- Biotipo Cutáneo -->
            <div class="q-mb-md">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Biotipo Cutáneo</div>
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
                  class="bento-chip"
                >
                  {{ bt }}
                </q-chip>
              </div>
            </div>

            <!-- Afección actual -->
            <div class="q-mb-sm">
              <q-input
                v-model="formData.dermatologicos.afeccionActual"
                label="Motivo de consulta y afección cutánea actual"
                class="minimal-input"
                borderless
                dense
                placeholder="Acné, rosácea, hiperpigmentación, envejecimiento..."
              />
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.dermatologicos.protectorSolar"
                  label="Uso de protector solar"
                  class="minimal-input"
                  borderless
                  dense
                  placeholder="Diario, eventual, marca..."
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.dermatologicos.exposicionSolar"
                  label="Exposición solar"
                  class="minimal-input"
                  borderless
                  dense
                  placeholder="Baja, moderada, intensa..."
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 4. CONTRAINDICACIONES CRÍTICAS DE SEGURIDAD (Columna derecha) -->
      <div class="col-12 col-lg-5">
        <q-card flat bordered class="bento-card border-negative-subtle bg-red-0">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="32px" color="red-1" text-color="negative" icon="warning" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold text-negative">4. Seguridad & Contraindicaciones</div>
                <div class="text-caption text-grey-7">Validación crítica antes de aparatología o peelings</div>
              </div>
            </div>

            <div class="q-gutter-y-xs q-mt-xs">
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
                  class="toggle-bento"
                  :toggle-color="formData.contraindicaciones[key] ? 'negative' : 'grey-7'"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[
                    { label: 'No', value: false },
                    { label: 'Sí ⚠️', value: true }
                  ]"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 5. MEDICACIÓN Y SUPLEMENTOS (Columna izquierda) -->
      <div class="col-12 col-lg-6">
        <q-card flat bordered class="bento-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="32px" color="purple-1" text-color="purple-8" icon="medication" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">5. Medicación y Suplementos</div>
                <div class="text-caption text-grey-7">Fármacos orales, tópicos y suplementación</div>
              </div>
            </div>

            <div class="q-gutter-y-xs q-mt-xs">
              <div
                v-for="(item, key) in medicacionList"
                :key="key"
                class="q-py-xs border-bottom-light"
              >
                <div class="row items-center justify-between no-wrap">
                  <span class="text-body2 text-weight-medium text-grey-9 text-ellipsis" style="max-width: 65%;">
                    {{ item.label }}
                  </span>
                  <q-btn-toggle
                    v-model="formData.medicacion[key].aplica"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-bento"
                    toggle-color="purple-8"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>
                <q-slide-transition>
                  <div v-if="formData.medicacion[key].aplica" class="q-mt-xs">
                    <q-input
                      v-model="formData.medicacion[key].detalle"
                      label="Detalle de medicación *"
                      class="minimal-input"
                      borderless
                      dense
                      placeholder="Nombre del fármaco, dosis o tiempo de uso..."
                    />
                  </div>
                </q-slide-transition>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 6. ALERGIAS, GINECOLOGÍA Y CIRUGÍAS (Columna derecha) -->
      <div class="col-12 col-lg-6">
        <q-card flat bordered class="bento-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="32px" color="orange-1" text-color="orange-9" icon="shield" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">6. Alergias, Gineco & Cirugías</div>
                <div class="text-caption text-grey-7">Reacciones alérgicas e intervenciones estéticas</div>
              </div>
            </div>

            <div class="q-gutter-y-xs q-mt-xs">
              <!-- Alergias -->
              <div
                v-for="(item, key) in alergiasList"
                :key="key"
                class="q-py-xs border-bottom-light"
              >
                <div class="row items-center justify-between no-wrap">
                  <span class="text-body2 text-weight-medium text-grey-9 text-ellipsis" style="max-width: 65%;">
                    {{ item.label }}
                  </span>
                  <q-btn-toggle
                    v-model="formData.alergias[key].aplica"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-bento"
                    toggle-color="orange-9"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>
                <q-slide-transition>
                  <div v-if="formData.alergias[key].aplica" class="q-mt-xs">
                    <q-input
                      v-model="formData.alergias[key].detalle"
                      label="Detalle de alergia *"
                      class="minimal-input"
                      borderless
                      dense
                      placeholder="Sustancia, alimento o metal causante..."
                    />
                  </div>
                </q-slide-transition>
              </div>

              <!-- Historia Ginecológica rápida -->
              <div class="row q-col-gutter-sm q-pt-sm">
                <div class="col-12 col-sm-4 text-center">
                  <div class="text-caption text-grey-8">Embarazo/Lactancia</div>
                  <q-btn-toggle
                    v-model="formData.ginecologia.embarazoLactancia"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-bento q-mt-xs"
                    toggle-color="pink-6"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>
                <div class="col-12 col-sm-4 text-center">
                  <div class="text-caption text-grey-8">Anticonceptivos</div>
                  <q-btn-toggle
                    v-model="formData.ginecologia.anticonceptivos"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-bento q-mt-xs"
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>
                <div class="col-12 col-sm-4 text-center">
                  <div class="text-caption text-grey-8">Climaterio</div>
                  <q-btn-toggle
                    v-model="formData.ginecologia.climaterioMenopausia"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-bento q-mt-xs"
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>
              </div>

              <!-- Cirugías generales y estéticas -->
              <div class="row q-col-gutter-sm q-pt-sm">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="formData.cirugias.tratamientosUltimosDosAnos"
                    label="Tratamientos estéticos últimos 2 años"
                    class="minimal-input"
                    borderless
                    dense
                    placeholder="Peelings, toxina, láser..."
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="formData.cirugias.ultimoChequeo"
                    label="Último chequeo médico"
                    class="minimal-input"
                    borderless
                    dense
                    placeholder="Fecha o resultado..."
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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
</script>

<style scoped>
.bento-container {
  width: 100%;
}

.bento-card {
  border-radius: 14px;
  border-color: #e2e8f0;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
  height: 100%;
}

.bento-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
}

.bento-subitem {
  border: 1px solid #edf2f7;
  transition: background-color 0.15s;
}

.bg-teal-0 {
  background-color: #f0fdf4 !important;
  border-color: #bbf7d0 !important;
}

.bg-red-0 {
  background-color: #fffafb !important;
}

.border-negative-subtle {
  border-color: #fecdd3 !important;
}

.border-bottom-light {
  border-bottom: 1px dashed #e2e8f0;
}

.toggle-bento {
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  overflow: hidden;
}

.toggle-bento :deep(.q-btn) {
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

.fototipo-circle-bento {
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

.bento-chip {
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
