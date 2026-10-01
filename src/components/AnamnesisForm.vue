<template>
  <div class="anamnesis-container q-gutter-y-lg">
    <!-- Encabezado de la Ficha -->
    <div class="row items-center justify-between q-pb-sm border-bottom">
      <div>
        <div class="text-h6 text-weight-bold text-primary">
          Ficha de Anamnesis Dermatocosmiátrica
        </div>
        <div class="text-caption text-grey-7">
          Cuestión de Piel — Registro clínico pre-procedimiento
        </div>
      </div>
      <q-badge color="primary" outline label="Ficha Activa" class="q-pa-xs" />
    </div>

    <!-- 1. ANTECEDENTES PERSONALES Y HEREDITARIOS -->
    <q-card flat bordered class="section-card">
      <q-card-section>
        <div class="row items-center q-mb-xs">
          <q-icon name="favorite" color="primary" size="24px" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">1. Antecedentes personales y hereditarios</div>
        </div>
        <div class="text-caption text-grey-7 q-mb-md">
          (Responder Sí/No en cada uno; si es Sí, detallar)
        </div>

        <div class="q-gutter-y-md">
          <div
            v-for="(item, key) in antecedentesList"
            :key="key"
            class="row items-center q-py-xs border-bottom-light"
          >
            <div class="col-12 col-sm-6 col-md-5 text-weight-medium">
              {{ item.label }}
            </div>
            <div class="col-12 col-sm-6 col-md-3 q-my-xs">
              <q-btn-toggle
                v-model="formData.antecedentes[key].aplica"
                no-caps
                rounded
                unelevated
                class="toggle-custom"
                toggle-color="primary"
                color="grey-3"
                text-color="grey-8"
                :options="[
                  { label: 'No', value: false },
                  { label: 'Sí', value: true }
                ]"
              />
            </div>
            <div class="col-12 col-md-4" v-if="formData.antecedentes[key].aplica">
              <q-input
                v-model="formData.antecedentes[key].detalle"
                label="Detalle *"
                class="minimal-input"
                borderless
                dense
                placeholder="Especificar diagnóstico/tratamiento..."
              />
            </div>
          </div>

          <div class="q-pt-sm">
            <q-input
              v-model="formData.antecedentes.hereditariosRelevantes"
              label="Antecedentes hereditarios relevantes (texto libre)"
              type="textarea"
              autogrow
              class="minimal-input"
              borderless
              placeholder="Diabetes, hipertensión, cáncer de piel o afecciones cutáneas familiares..."
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 2. HÁBITOS Y ESTILO DE VIDA -->
    <q-card flat bordered class="section-card">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-icon name="self_improvement" color="primary" size="24px" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">2. Hábitos y estilo de vida</div>
        </div>

        <div class="row q-col-gutter-lg items-center">
          <div class="col-12 col-sm-6 col-md-4">
            <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Fuma?</div>
            <q-btn-toggle
              v-model="formData.habitos.fuma"
              no-caps
              rounded
              unelevated
              class="toggle-custom"
              toggle-color="primary"
              color="grey-3"
              text-color="grey-8"
              :options="[
                { label: 'No', value: false },
                { label: 'Sí', value: true }
              ]"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Consume alcohol?</div>
            <q-btn-toggle
              v-model="formData.habitos.consumeAlcohol"
              no-caps
              rounded
              unelevated
              class="toggle-custom"
              toggle-color="primary"
              color="grey-3"
              text-color="grey-8"
              :options="[
                { label: 'No', value: false },
                { label: 'Sí', value: true }
              ]"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Ingesta de agua/sal/lácteos/hidratos adecuada</div>
            <q-btn-toggle
              v-model="formData.habitos.ingestaAdecuada"
              no-caps
              rounded
              unelevated
              class="toggle-custom"
              toggle-color="primary"
              color="grey-3"
              text-color="grey-8"
              :options="[
                { label: 'No', value: false },
                { label: 'Sí', value: true }
              ]"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="formData.habitos.actividadFisica"
              :options="['No realiza', 'Poca', 'Moderada', 'Intensa']"
              label="Actividad física"
              class="minimal-input"
              borderless
              dense
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="formData.habitos.calidadSueno"
              :options="['Buena', 'Regular', 'Mala']"
              label="Calidad del sueño"
              class="minimal-input"
              borderless
              dense
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="formData.habitos.nivelEstres"
              :options="['Bajo', 'Medio', 'Alto']"
              label="Nivel de estrés"
              class="minimal-input"
              borderless
              dense
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 3. HISTORIA GINECOLÓGICA (si aplica) -->
    <q-card flat bordered class="section-card">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-icon name="female" color="primary" size="24px" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">3. Historia ginecológica (si aplica)</div>
        </div>

        <div class="row q-col-gutter-lg items-center">
          <div class="col-12 col-sm-4">
            <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Embarazo o lactancia?</div>
            <q-btn-toggle
              v-model="formData.ginecologia.embarazoLactancia"
              no-caps
              rounded
              unelevated
              class="toggle-custom"
              toggle-color="primary"
              color="grey-3"
              text-color="grey-8"
              :options="[
                { label: 'No', value: false },
                { label: 'Sí', value: true }
              ]"
            />
          </div>

          <div class="col-12 col-sm-4">
            <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Usa anticonceptivos?</div>
            <q-btn-toggle
              v-model="formData.ginecologia.anticonceptivos"
              no-caps
              rounded
              unelevated
              class="toggle-custom"
              toggle-color="primary"
              color="grey-3"
              text-color="grey-8"
              :options="[
                { label: 'No', value: false },
                { label: 'Sí', value: true }
              ]"
            />
          </div>

          <div class="col-12 col-sm-4">
            <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Climaterio / menopausia?</div>
            <q-btn-toggle
              v-model="formData.ginecologia.climaterioMenopausia"
              no-caps
              rounded
              unelevated
              class="toggle-custom"
              toggle-color="primary"
              color="grey-3"
              text-color="grey-8"
              :options="[
                { label: 'No', value: false },
                { label: 'Sí', value: true }
              ]"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 4. MEDICACIÓN Y SUPLEMENTOS -->
    <q-card flat bordered class="section-card">
      <q-card-section>
        <div class="row items-center q-mb-xs">
          <q-icon name="medication" color="primary" size="24px" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">4. Medicación y suplementos</div>
        </div>
        <div class="text-caption text-grey-7 q-mb-md">
          (Responder Sí/No; si es Sí, agregar detalle)
        </div>

        <div class="q-gutter-y-md">
          <div
            v-for="(item, key) in medicacionList"
            :key="key"
            class="row items-center q-py-xs border-bottom-light"
          >
            <div class="col-12 col-sm-6 col-md-5 text-weight-medium">
              {{ item.label }}
            </div>
            <div class="col-12 col-sm-6 col-md-3 q-my-xs">
              <q-btn-toggle
                v-model="formData.medicacion[key].aplica"
                no-caps
                rounded
                unelevated
                class="toggle-custom"
                toggle-color="primary"
                color="grey-3"
                text-color="grey-8"
                :options="[
                  { label: 'No', value: false },
                  { label: 'Sí', value: true }
                ]"
              />
            </div>
            <div class="col-12 col-md-4" v-if="formData.medicacion[key].aplica">
              <q-input
                v-model="formData.medicacion[key].detalle"
                label="Detalle *"
                class="minimal-input"
                borderless
                dense
                placeholder="Nombre de fármaco, dosis, tiempo..."
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 5. ALERGIAS -->
    <q-card flat bordered class="section-card">
      <q-card-section>
        <div class="row items-center q-mb-xs">
          <q-icon name="warning_amber" color="primary" size="24px" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">5. Alergias</div>
        </div>
        <div class="text-caption text-grey-7 q-mb-md">
          (Responder Sí/No; si es Sí, agregar detalle)
        </div>

        <div class="q-gutter-y-md">
          <div
            v-for="(item, key) in alergiasList"
            :key="key"
            class="row items-center q-py-xs border-bottom-light"
          >
            <div class="col-12 col-sm-6 col-md-5 text-weight-medium">
              {{ item.label }}
            </div>
            <div class="col-12 col-sm-6 col-md-3 q-my-xs">
              <q-btn-toggle
                v-model="formData.alergias[key].aplica"
                no-caps
                rounded
                unelevated
                class="toggle-custom"
                toggle-color="primary"
                color="grey-3"
                text-color="grey-8"
                :options="[
                  { label: 'No', value: false },
                  { label: 'Sí', value: true }
                ]"
              />
            </div>
            <div class="col-12 col-md-4" v-if="formData.alergias[key].aplica">
              <q-input
                v-model="formData.alergias[key].detalle"
                label="Detalle *"
                class="minimal-input"
                borderless
                dense
                placeholder="Reacción, severidad, tipo..."
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 6. ANTECEDENTES DERMATOLÓGICOS -->
    <q-card flat bordered class="section-card">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-icon name="spa" color="primary" size="24px" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">6. Antecedentes dermatológicos</div>
        </div>

        <div class="q-gutter-y-lg">
          <!-- Afección cutánea actual -->
          <div>
            <q-input
              v-model="formData.dermatologicos.afeccionActual"
              label="Afección cutánea actual"
              class="minimal-input"
              borderless
              dense
              placeholder="Acné, rosácea, dermatitis, psoriasis, vitíligo, ninguna..."
            />
          </div>

          <!-- Herpes simple y Queloides -->
          <div class="row q-col-gutter-lg items-center">
            <div class="col-12 col-sm-6">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Herpes simple</div>
              <q-btn-toggle
                v-model="formData.dermatologicos.herpesSimple"
                no-caps
                rounded
                unelevated
                class="toggle-custom"
                toggle-color="primary"
                color="grey-3"
                text-color="grey-8"
                :options="[
                  { label: 'No', value: false },
                  { label: 'Sí', value: true }
                ]"
              />
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Tendencia a cicatrización irregular / queloides</div>
              <q-btn-toggle
                v-model="formData.dermatologicos.cicatrizacionQueloides"
                no-caps
                rounded
                unelevated
                class="toggle-custom"
                toggle-color="primary"
                color="grey-3"
                text-color="grey-8"
                :options="[
                  { label: 'No', value: false },
                  { label: 'Sí', value: true }
                ]"
              />
            </div>
          </div>

          <!-- Selector de Fototipo -->
          <div>
            <div class="row items-center q-mb-sm">
              <div class="text-caption text-weight-medium text-grey-8">
                Fototipo (I / II / III / IV / V / VI)
              </div>
              <q-badge
                v-if="formData.dermatologicos.fototipo"
                color="primary"
                class="q-ml-sm text-weight-bold"
              >
                Tipo {{ ['I', 'II', 'III', 'IV', 'V', 'VI'][formData.dermatologicos.fototipo - 1] }}
              </q-badge>
            </div>
            <div class="row q-gutter-md items-center">
              <div
                v-for="n in 6"
                :key="n"
                class="fototipo-circle cursor-pointer flex flex-center shadow-1"
                :class="{ 'fototipo-selected': formData.dermatologicos.fototipo == n }"
                :style="{ backgroundColor: getFototipoColor(n), color: n >= 5 ? '#fff' : '#333' }"
                @click="toggleFototipo(n)"
              >
                {{ n }}
              </div>
            </div>
          </div>

          <!-- 3 Selects en fila equilibrada (Biotipo, Protector Solar, Exposición) -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="formData.dermatologicos.biotipo"
                :options="['Seca', 'Grasa', 'Mixta', 'Sensible']"
                label="Biotipo de piel"
                class="minimal-input"
                borderless
                dense
              />
            </div>

            <div class="col-12 col-md-4">
              <q-select
                v-model="formData.dermatologicos.protectorSolar"
                :options="['Diario', 'A veces', 'Nunca']"
                label="Uso de protector solar"
                class="minimal-input"
                borderless
                dense
              />
            </div>

            <div class="col-12 col-md-4">
              <q-select
                v-model="formData.dermatologicos.exposicionSolar"
                :options="['Baja', 'Media', 'Alta']"
                label="Exposición solar habitual"
                class="minimal-input"
                borderless
                dense
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 7. CIRUGÍAS E INTERVENCIONES PREVIAS -->
    <q-card flat bordered class="section-card">
      <q-card-section>
        <div class="row items-center q-mb-xs">
          <q-icon name="healing" color="primary" size="24px" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">7. Cirugías e intervenciones previas</div>
        </div>
        <div class="text-caption text-grey-7 q-mb-md">
          (Responder Sí/No; si es Sí, agregar detalle y zona)
        </div>

        <div class="q-gutter-y-md">
          <!-- Cirugías generales -->
          <div class="q-py-xs border-bottom-light">
            <div class="row items-center">
              <div class="col-12 col-sm-6 col-md-5 text-weight-medium">
                Cirugías generales
              </div>
              <div class="col-12 col-sm-6 col-md-3 q-my-xs">
                <q-btn-toggle
                  v-model="formData.cirugias.generales.aplica"
                  no-caps
                  rounded
                  unelevated
                  class="toggle-custom"
                  toggle-color="primary"
                  color="grey-3"
                  text-color="grey-8"
                  :options="[
                    { label: 'No', value: false },
                    { label: 'Sí', value: true }
                  ]"
                />
              </div>
            </div>
            <div v-if="formData.cirugias.generales.aplica" class="row q-col-gutter-sm q-mt-xs">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formData.cirugias.generales.detalle"
                  label="Detalle de cirugía"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formData.cirugias.generales.zona"
                  label="Zona anatómica"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>
            </div>
          </div>

          <!-- Intervenciones estéticas poco invasivas -->
          <div class="q-py-xs border-bottom-light">
            <div class="row items-center">
              <div class="col-12 col-sm-6 col-md-5 text-weight-medium">
                Intervenciones estéticas poco invasivas (rellenos, botox, hilos, peelings, láser)
              </div>
              <div class="col-12 col-sm-6 col-md-3 q-my-xs">
                <q-btn-toggle
                  v-model="formData.cirugias.esteticasPocoInvasivas.aplica"
                  no-caps
                  rounded
                  unelevated
                  class="toggle-custom"
                  toggle-color="primary"
                  color="grey-3"
                  text-color="grey-8"
                  :options="[
                    { label: 'No', value: false },
                    { label: 'Sí', value: true }
                  ]"
                />
              </div>
            </div>
            <div v-if="formData.cirugias.esteticasPocoInvasivas.aplica" class="row q-col-gutter-sm q-mt-xs">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formData.cirugias.esteticasPocoInvasivas.detalle"
                  label="Detalle de intervención"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formData.cirugias.esteticasPocoInvasivas.zona"
                  label="Zona tratada"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>
            </div>
          </div>

          <!-- Operaciones o tratamientos de los últimos 2 años -->
          <div>
            <q-input
              v-model="formData.cirugias.tratamientosUltimosDosAnos"
              label="Operaciones o tratamientos de los últimos 2 años (texto libre)"
              type="textarea"
              autogrow
              class="minimal-input"
              borderless
            />
          </div>

          <!-- Último chequeo médico o dermatológico -->
          <div>
            <q-input
              v-model="formData.cirugias.ultimoChequeo"
              label="Último chequeo médico o dermatológico (fecha o texto libre)"
              class="minimal-input"
              borderless
              dense
              placeholder="Ej: Febrero 2026, control de lunares rutinario..."
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 8. CONTRAINDICACIONES ESPECÍFICAS -->
    <q-card flat bordered class="section-card border-negative-subtle">
      <q-card-section>
        <div class="row items-center q-mb-xs">
          <q-icon name="block" color="negative" size="24px" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold text-negative">8. Contraindicaciones específicas</div>
        </div>
        <div class="text-caption text-grey-7 q-mb-md">
          (Alerta para procedimientos estéticos como radiofrecuencia, microneedling o peeling)
        </div>

        <div class="q-gutter-y-sm">
          <div
            v-for="(item, key) in contraindicacionesList"
            :key="key"
            class="row items-center justify-between q-py-xs border-bottom-light"
          >
            <div class="col-12 col-sm-7 text-weight-medium">
              {{ item.label }}
            </div>
            <div class="col-12 col-sm-5 text-right q-my-xs">
              <q-btn-toggle
                v-model="formData.contraindicaciones[key]"
                no-caps
                rounded
                unelevated
                class="toggle-custom toggle-custom-alert"
                toggle-color="negative"
                color="grey-3"
                text-color="grey-8"
                :options="[
                  { label: 'No', value: false },
                  { label: 'Sí (Alerta)', value: true }
                ]"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  patient: {
    type: Object,
    default: () => ({})
  },
  observacion: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:observacion', 'change']);

// Listados configurables para los puntos Sí/No
const antecedentesList = {
  cardiacas: { label: 'Patologías cardíacas' },
  respiratorias: { label: 'Patologías respiratorias' },
  renalesGastro: { label: 'Patologías renales o gastrointestinales' },
  tiroideas: { label: 'Patologías tiroideas' },
  metabolicas: { label: 'Patologías metabólicas (diabetes, colesterol)' },
  oncologicas: { label: 'Patologías oncológicas (actuales o en tratamiento)' },
  autoinmunes: { label: 'Patologías autoinmunes' },
  epilepsia: { label: 'Epilepsia' },
  ginecologicas: { label: 'Patologías ginecológicas' }
};

const medicacionList = {
  cronica: { label: 'Medicación crónica (antihistamínicos, corticoides, antihipertensivos, etc.)' },
  topica: { label: 'Medicación tópica' },
  anticoagulantes: { label: 'Anticoagulantes' },
  isotretinoina: { label: 'Isotretinoína (actual o últimos 6-12 meses)' },
  antibioticosRecientes: { label: 'Antibióticos recientes' },
  suplementos: { label: 'Suplementos (vitaminas, pro/prebióticos, magnesio, colágeno, etc.)' }
};

const alergiasList = {
  alimentarias: { label: 'Alimentarias (énfasis en almendras, gluten, aspirinetas, lactosa)' },
  medicamentos: { label: 'A medicamentos' },
  cosmeticosMetales: { label: 'A productos cosméticos o metales' },
  cutaneasDeclaradas: { label: 'Alergias cutáneas declaradas' }
};

const contraindicacionesList = {
  marcapasos: { label: 'Marcapasos o dispositivos electrónicos implantados' },
  implantesMetalicos: { label: 'Prótesis o implantes metálicos en la zona a tratar' },
  tratamientoOncologico: { label: 'Tratamiento oncológico activo o reciente' },
  heridasInfecciones: { label: 'Heridas abiertas o infecciones activas en la zona' },
  anticoagulantesSinAutorizacion: { label: 'Uso de anticoagulantes sin autorización médica' }
};

// Paleta de colores fototipo
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
  // 1. Antecedentes personales y hereditarios
  antecedentes: {
    cardiacas: { aplica: false, detalle: '' },
    respiratorias: { aplica: false, detalle: '' },
    renalesGastro: { aplica: false, detalle: '' },
    tiroideas: { aplica: false, detalle: '' },
    metabolicas: { aplica: false, detalle: '' },
    oncologicas: { aplica: false, detalle: '' },
    autoinmunes: { aplica: false, detalle: '' },
    epilepsia: { aplica: false, detalle: '' },
    ginecologicas: { aplica: false, detalle: '' },
    hereditariosRelevantes: ''
  },

  // 2. Hábitos y estilo de vida
  habitos: {
    fuma: false,
    consumeAlcohol: false,
    actividadFisica: '',
    ingestaAdecuada: true,
    calidadSueno: '',
    nivelEstres: ''
  },

  // 3. Historia ginecológica
  ginecologia: {
    embarazoLactancia: false,
    anticonceptivos: false,
    climaterioMenopausia: false
  },

  // 4. Medicación y suplementos
  medicacion: {
    cronica: { aplica: false, detalle: '' },
    topica: { aplica: false, detalle: '' },
    anticoagulantes: { aplica: false, detalle: '' },
    isotretinoina: { aplica: false, detalle: '' },
    antibioticosRecientes: { aplica: false, detalle: '' },
    suplementos: { aplica: false, detalle: '' }
  },

  // 5. Alergias
  alergias: {
    alimentarias: { aplica: false, detalle: '' },
    medicamentos: { aplica: false, detalle: '' },
    cosmeticosMetales: { aplica: false, detalle: '' },
    cutaneasDeclaradas: { aplica: false, detalle: '' }
  },

  // 6. Antecedentes dermatológicos
  dermatologicos: {
    afeccionActual: '',
    herpesSimple: false,
    cicatrizacionQueloides: false,
    fototipo: null,
    biotipo: '',
    protectorSolar: '',
    exposicionSolar: ''
  },

  // 7. Cirugías e intervenciones previas
  cirugias: {
    generales: { aplica: false, detalle: '', zona: '' },
    esteticasPocoInvasivas: { aplica: false, detalle: '', zona: '' },
    tratamientosUltimosDosAnos: '',
    ultimoChequeo: ''
  },

  // 8. Contraindicaciones específicas
  contraindicaciones: {
    marcapasos: false,
    implantesMetalicos: false,
    tratamientoOncologico: false,
    heridasInfecciones: false,
    anticoagulantesSinAutorizacion: false
  }
});

// Sincronización bidireccional con observacion.fototipo
watch(
  () => props.observacion?.fototipo,
  (newVal) => {
    formData.dermatologicos.fototipo = newVal;
  },
  { immediate: true }
);

// Sincronización bidireccional con observacion.biotipo
watch(
  () => props.observacion?.biotipo,
  (newVal) => {
    if (newVal && !formData.dermatologicos.biotipo) {
      formData.dermatologicos.biotipo = newVal;
    }
  },
  { immediate: true }
);

function toggleFototipo(n) {
  const selected = formData.dermatologicos.fototipo == n ? null : n;
  formData.dermatologicos.fototipo = selected;
  if (props.observacion) {
    props.observacion.fototipo = selected;
  }
}

watch(
  () => formData.dermatologicos.biotipo,
  (newVal) => {
    if (props.observacion && newVal) {
      props.observacion.biotipo = newVal;
    }
  }
);

defineExpose({
  formData
});
</script>

<style scoped>
.anamnesis-container {
  max-width: 950px;
  margin: 0 auto;
}

.section-card {
  border-radius: 12px;
  border-color: #e0e0e0;
  background-color: #fafbfc;
}

.border-bottom {
  border-bottom: 2px solid #eef2f6;
}

.border-bottom-light {
  border-bottom: 1px dashed #e4e8ed;
}

.border-negative-subtle {
  border-color: #ffcdd2;
  background-color: #fff9f9;
}

.minimal-input {
  background: #f8fafc !important;
  border-radius: 12px;
  border: 1px solid #e0e4ea !important;
  box-shadow: none !important;
  font-size: 15px;
  padding: 4px 12px;
  transition: all 0.2s ease;
}

.minimal-input:focus-within {
  border-color: #1976d2 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
}

.fototipo-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  font-weight: bold;
  font-size: 15px;
  user-select: none;
}

.fototipo-selected {
  transform: scale(1.15);
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.25) !important;
  z-index: 10;
}

/* Estilos de botones Sí/No ampliados */
.toggle-custom {
  border: 1px solid #d0d7de;
  border-radius: 20px;
  overflow: hidden;
}

.toggle-custom :deep(.q-btn) {
  min-width: 60px;
  padding: 6px 16px;
  font-weight: 600;
  font-size: 13.5px;
  line-height: 1.3;
  transition: all 0.15s ease-in-out;
}

.toggle-custom-alert :deep(.q-btn) {
  min-width: 72px;
  padding: 6px 14px;
}
</style>
