<template>
  <div class="anamnesis-container q-gutter-y-md">
    <!-- Encabezado con Selector de Vistas Visuales -->
    <div class="row items-center justify-between q-mb-md q-pa-sm bg-grey-1 rounded-borders border-view-selector">
      <div class="q-py-xs">
        <div class="text-subtitle1 text-weight-bold text-primary row items-center">
          <q-icon name="assignment" class="q-mr-xs" size="22px" />
          Anamnesis Dermatocosmiátrica
        </div>
        <div class="text-caption text-grey-7">Ficha clínica digital de evaluación dermatocosmiátrica</div>
      </div>
      <div class="row items-center q-gutter-x-sm q-my-xs">
        <div class="text-caption text-weight-medium text-grey-8 gt-xs">Diseño de pantalla:</div>
        <q-btn-toggle
          v-model="vistaMode"
          no-caps
          rounded
          unelevated
          toggle-color="primary"
          color="white"
          text-color="grey-8"
          class="shadow-1 toggle-modes"
          :options="[
            { label: 'Formulario Completo', value: 'clasico', icon: 'view_agenda' },
            { label: 'Bento Grid', value: 'bento', icon: 'dashboard' },
            { label: 'Híbrido + Resumen', value: 'hibrido', icon: 'view_quilt' },
            { label: 'Checklist Clínico', value: 'checklist', icon: 'check_box' }
          ]"
        />
      </div>
    </div>

    <!-- 1. VISTA CLÁSICA (Formulario continuo por cards) -->
    <div v-if="vistaMode === 'clasico'" class="q-gutter-y-md">
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
            <div class="row no-wrap justify-between items-center fototipo-row">
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

    <!-- 2. VISTA ALTERNATIVA BENTO GRID -->
    <AnamnesisBentoView
      v-else-if="vistaMode === 'bento'"
      :formData="formData"
      :antecedentesList="antecedentesList"
      :medicacionList="medicacionList"
      :alergiasList="alergiasList"
      :contraindicacionesList="contraindicacionesList"
    />

    <!-- 3. VISTA HÍBRIDA (Bento Continuo + Live Summary) -->
    <AnamnesisHybridView
      v-else-if="vistaMode === 'hibrido'"
      :formData="formData"
      :antecedentesList="antecedentesList"
      :medicacionList="medicacionList"
      :alergiasList="alergiasList"
      :contraindicacionesList="contraindicacionesList"
    />

    <!-- 4. VISTA CHECKLIST CLÍNICO -->
    <AnamnesisChecklistView
      v-else-if="vistaMode === 'checklist'"
      :formData="formData"
      :antecedentesList="antecedentesList"
      :medicacionList="medicacionList"
      :alergiasList="alergiasList"
      :contraindicacionesList="contraindicacionesList"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import AnamnesisBentoView from './anamnesis/AnamnesisBentoView.vue';
import AnamnesisHybridView from './anamnesis/AnamnesisHybridView.vue';
import AnamnesisChecklistView from './anamnesis/AnamnesisChecklistView.vue';

const vistaMode = ref('clasico');

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

function resetData() {
  // 1. Antecedentes
  Object.keys(formData.antecedentes).forEach(k => {
    if (typeof formData.antecedentes[k] === 'object' && formData.antecedentes[k] !== null) {
      formData.antecedentes[k].aplica = false;
      formData.antecedentes[k].detalle = '';
    } else {
      formData.antecedentes[k] = '';
    }
  });

  // 2. Hábitos
  formData.habitos.fuma = false;
  formData.habitos.consumeAlcohol = false;
  formData.habitos.ingestaAdecuada = true;
  formData.habitos.actividadFisica = '';
  formData.habitos.calidadSueno = '';
  formData.habitos.nivelEstres = '';

  // 3. Historia ginecológica
  formData.ginecologia.embarazoLactancia = false;
  formData.ginecologia.anticonceptivos = false;
  formData.ginecologia.climaterioMenopausia = false;

  // 4. Medicación
  Object.keys(formData.medicacion).forEach(k => {
    formData.medicacion[k].aplica = false;
    formData.medicacion[k].detalle = '';
  });

  // 5. Alergias
  Object.keys(formData.alergias).forEach(k => {
    formData.alergias[k].aplica = false;
    formData.alergias[k].detalle = '';
  });

  // 6. Antecedentes dermatológicos
  formData.dermatologicos.afeccionActual = '';
  formData.dermatologicos.herpesSimple = false;
  formData.dermatologicos.cicatrizacionQueloides = false;
  formData.dermatologicos.fototipo = null;
  formData.dermatologicos.biotipo = '';
  formData.dermatologicos.protectorSolar = '';
  formData.dermatologicos.exposicionSolar = '';

  // 7. Cirugías
  formData.cirugias.generales = { aplica: false, detalle: '', zona: '' };
  formData.cirugias.esteticasPocoInvasivas = { aplica: false, detalle: '', zona: '' };
  formData.cirugias.tratamientosUltimosDosAnos = '';
  formData.cirugias.ultimoChequeo = '';

  // 8. Contraindicaciones
  formData.contraindicaciones.marcapasos = false;
  formData.contraindicaciones.implantesMetalicos = false;
  formData.contraindicaciones.tratamientoOncologico = false;
  formData.contraindicaciones.heridasInfecciones = false;
  formData.contraindicaciones.anticoagulantesSinAutorizacion = false;
}

function loadData(data) {
  if (!data) return;

  const val = (snake, camel, defaultVal = null) => {
    if (data[snake] !== undefined && data[snake] !== null) return data[snake];
    if (camel && data[camel] !== undefined && data[camel] !== null) return data[camel];
    return defaultVal;
  };

  // 1. Antecedentes personales y hereditarios
  formData.antecedentes.cardiacas.aplica = !!val('has_cardiac_disease', 'hasCardiacDisease', false);
  formData.antecedentes.cardiacas.detalle = val('cardiac_disease_detail', 'cardiacDiseaseDetail', '') || '';
  formData.antecedentes.respiratorias.aplica = !!val('has_respiratory_disease', 'hasRespiratoryDisease', false);
  formData.antecedentes.respiratorias.detalle = val('respiratory_disease_detail', 'respiratoryDiseaseDetail', '') || '';
  formData.antecedentes.renalesGastro.aplica = !!val('has_renal_digestive_disease', 'hasRenalDigestiveDisease', false);
  formData.antecedentes.renalesGastro.detalle = val('renal_digestive_disease_detail', 'renalDigestiveDiseaseDetail', '') || '';
  formData.antecedentes.tiroideas.aplica = !!val('has_thyroid_disease', 'hasThyroidDisease', false);
  formData.antecedentes.tiroideas.detalle = val('thyroid_disease_detail', 'thyroidDiseaseDetail', '') || '';
  formData.antecedentes.metabolicas.aplica = !!val('has_metabolic_disease', 'hasMetabolicDisease', false);
  formData.antecedentes.metabolicas.detalle = val('metabolic_disease_detail', 'metabolicDiseaseDetail', '') || '';
  formData.antecedentes.oncologicas.aplica = !!val('has_oncological_disease', 'hasOncologicalDisease', false);
  formData.antecedentes.oncologicas.detalle = val('oncological_disease_detail', 'oncologicalDiseaseDetail', '') || '';
  formData.antecedentes.autoinmunes.aplica = !!val('has_autoimmune_disease', 'hasAutoimmuneDisease', false);
  formData.antecedentes.autoinmunes.detalle = val('autoimmune_disease_detail', 'autoimmuneDiseaseDetail', '') || '';
  formData.antecedentes.epilepsia.aplica = !!val('has_epilepsy', 'hasEpilepsy', false);
  formData.antecedentes.epilepsia.detalle = val('epilepsy_detail', 'epilepsyDetail', '') || '';
  formData.antecedentes.ginecologicas.aplica = !!val('has_gynecological_disease', 'hasGynecologicalDisease', false);
  formData.antecedentes.ginecologicas.detalle = val('gynecological_disease_detail', 'gynecologicalDiseaseDetail', '') || '';
  formData.antecedentes.hereditariosRelevantes = val('family_history', 'familyHistory', '') || '';

  // 2. Hábitos y estilo de vida
  formData.habitos.fuma = !!val('smoker', 'smoker', false);
  formData.habitos.consumeAlcohol = !!val('alcohol_consumer', 'alcoholConsumer', false);
  formData.habitos.ingestaAdecuada = val('adequate_dietary_intake', 'adequateDietaryIntake', true) ?? true;
  formData.habitos.actividadFisica = val('physical_activity', 'physicalActivity', '') || '';
  formData.habitos.calidadSueno = val('sleep_quality', 'sleepQuality', '') || '';
  formData.habitos.nivelEstres = val('stress_level', 'stressLevel', '') || '';

  // 3. Historia ginecológica
  formData.ginecologia.embarazoLactancia = !!val('pregnant_or_lactating', 'pregnantOrLactating', false);
  formData.ginecologia.anticonceptivos = !!val('uses_contraceptives', 'usesContraceptives', false);
  formData.ginecologia.climaterioMenopausia = !!val('climacteric_or_menopause', 'climactericOrMenopause', false);

  // 4. Medicación y suplementos
  formData.medicacion.cronica.aplica = !!val('has_chronic_medication', 'hasChronicMedication', false);
  formData.medicacion.cronica.detalle = val('chronic_medication_detail', 'chronicMedicationDetail', '') || '';
  formData.medicacion.topica.aplica = !!val('has_topical_medication', 'hasTopicalMedication', false);
  formData.medicacion.topica.detalle = val('topical_medication_detail', 'topicalMedicationDetail', '') || '';
  formData.medicacion.anticoagulantes.aplica = !!val('has_anticoagulants', 'hasAnticoagulants', false);
  formData.medicacion.anticoagulantes.detalle = val('anticoagulants_detail', 'anticoagulantsDetail', '') || '';
  formData.medicacion.isotretinoina.aplica = !!val('has_isotretinoin', 'hasIsotretinoin', false);
  formData.medicacion.isotretinoina.detalle = val('isotretinoin_detail', 'isotretinoinDetail', '') || '';
  formData.medicacion.antibioticosRecientes.aplica = !!val('has_recent_antibiotics', 'hasRecentAntibiotics', false);
  formData.medicacion.antibioticosRecientes.detalle = val('recent_antibiotics_detail', 'recentAntibioticsDetail', '') || '';
  formData.medicacion.suplementos.aplica = !!val('has_supplements', 'hasSupplements', false);
  formData.medicacion.suplementos.detalle = val('supplements_detail', 'supplementsDetail', '') || '';

  // 5. Alergias
  formData.alergias.alimentarias.aplica = !!val('has_food_allergies', 'hasFoodAllergies', false);
  formData.alergias.alimentarias.detalle = val('food_allergies_detail', 'foodAllergiesDetail', '') || '';
  formData.alergias.medicamentos.aplica = !!val('has_drug_allergies', 'hasDrugAllergies', false);
  formData.alergias.medicamentos.detalle = val('drug_allergies_detail', 'drugAllergiesDetail', '') || '';
  formData.alergias.cosmeticosMetales.aplica = !!val('has_cosmetic_metal_allergies', 'hasCosmeticMetalAllergies', false);
  formData.alergias.cosmeticosMetales.detalle = val('cosmetic_metal_allergies_detail', 'cosmeticMetalAllergiesDetail', '') || '';
  formData.alergias.cutaneasDeclaradas.aplica = !!val('has_skin_allergies', 'hasSkinAllergies', false);
  formData.alergias.cutaneasDeclaradas.detalle = val('skin_allergies_detail', 'skinAllergiesDetail', '') || '';

  // 6. Antecedentes dermatológicos
  formData.dermatologicos.afeccionActual = val('current_skin_condition', 'currentSkinCondition', '') || '';
  formData.dermatologicos.herpesSimple = !!val('has_herpes_simplex', 'hasHerpesSimplex', false);
  formData.dermatologicos.cicatrizacionQueloides = !!val('has_keloids_irregular_scarring', 'hasKeloidsIrregularScarring', false);
  const rawFototipo = val('phototype', 'phototype', null);
  formData.dermatologicos.fototipo = rawFototipo != null && rawFototipo !== '' ? Number(rawFototipo) : null;
  formData.dermatologicos.biotipo = val('skin_biotype', 'skinBiotype', '') || '';
  formData.dermatologicos.protectorSolar = val('sunscreen_use', 'sunscreenUse', '') || '';
  formData.dermatologicos.exposicionSolar = val('sun_exposure', 'sunExposure', '') || '';

  // 7. Cirugías e intervenciones previas
  formData.cirugias.generales.aplica = !!val('has_general_surgeries', 'hasGeneralSurgeries', false);
  formData.cirugias.generales.detalle = val('general_surgeries_detail', 'generalSurgeriesDetail', '') || '';
  formData.cirugias.generales.zona = val('general_surgeries_zone', 'generalSurgeriesZone', '') || '';
  formData.cirugias.esteticasPocoInvasivas.aplica = !!val('has_aesthetic_interventions', 'hasAestheticInterventions', false);
  formData.cirugias.esteticasPocoInvasivas.detalle = val('aesthetic_interventions_detail', 'aestheticInterventionsDetail', '') || '';
  formData.cirugias.esteticasPocoInvasivas.zona = val('aesthetic_interventions_zone', 'aestheticInterventionsZone', '') || '';
  formData.cirugias.tratamientosUltimosDosAnos = val('treatments_last_two_years', 'treatmentsLastTwoYears', '') || '';
  formData.cirugias.ultimoChequeo = val('last_medical_checkup', 'lastMedicalCheckup', '') || '';

  // 8. Contraindicaciones específicas
  formData.contraindicaciones.marcapasos = !!val('has_pacemaker', 'hasPacemaker', false);
  formData.contraindicaciones.implantesMetalicos = !!val('has_metal_implants', 'hasMetalImplants', false);
  formData.contraindicaciones.tratamientoOncologico = !!val('has_active_oncological_treatment', 'hasActiveOncologicalTreatment', false);
  formData.contraindicaciones.heridasInfecciones = !!val('has_open_wounds_infections', 'hasOpenWoundsInfections', false);
  formData.contraindicaciones.anticoagulantesSinAutorizacion = !!val('has_unauthorized_anticoagulants', 'hasUnauthorizedAnticoagulants', false);
}

function toBackendPayload() {
  return {
    // 1. Antecedentes personales y hereditarios
    has_cardiac_disease: formData.antecedentes.cardiacas.aplica,
    cardiac_disease_detail: formData.antecedentes.cardiacas.aplica ? formData.antecedentes.cardiacas.detalle : '',
    has_respiratory_disease: formData.antecedentes.respiratorias.aplica,
    respiratory_disease_detail: formData.antecedentes.respiratorias.aplica ? formData.antecedentes.respiratorias.detalle : '',
    has_renal_digestive_disease: formData.antecedentes.renalesGastro.aplica,
    renal_digestive_disease_detail: formData.antecedentes.renalesGastro.aplica ? formData.antecedentes.renalesGastro.detalle : '',
    has_thyroid_disease: formData.antecedentes.tiroideas.aplica,
    thyroid_disease_detail: formData.antecedentes.tiroideas.aplica ? formData.antecedentes.tiroideas.detalle : '',
    has_metabolic_disease: formData.antecedentes.metabolicas.aplica,
    metabolic_disease_detail: formData.antecedentes.metabolicas.aplica ? formData.antecedentes.metabolicas.detalle : '',
    has_oncological_disease: formData.antecedentes.oncologicas.aplica,
    oncological_disease_detail: formData.antecedentes.oncologicas.aplica ? formData.antecedentes.oncologicas.detalle : '',
    has_autoimmune_disease: formData.antecedentes.autoinmunes.aplica,
    autoimmune_disease_detail: formData.antecedentes.autoinmunes.aplica ? formData.antecedentes.autoinmunes.detalle : '',
    has_epilepsy: formData.antecedentes.epilepsia.aplica,
    epilepsy_detail: formData.antecedentes.epilepsia.aplica ? formData.antecedentes.epilepsia.detalle : '',
    has_gynecological_disease: formData.antecedentes.ginecologicas.aplica,
    gynecological_disease_detail: formData.antecedentes.ginecologicas.aplica ? formData.antecedentes.ginecologicas.detalle : '',
    family_history: formData.antecedentes.hereditariosRelevantes || '',

    // 2. Hábitos y estilo de vida
    smoker: formData.habitos.fuma,
    alcohol_consumer: formData.habitos.consumeAlcohol,
    adequate_dietary_intake: formData.habitos.ingestaAdecuada,
    physical_activity: formData.habitos.actividadFisica || '',
    sleep_quality: formData.habitos.calidadSueno || '',
    stress_level: formData.habitos.nivelEstres || '',

    // 3. Historia ginecológica
    pregnant_or_lactating: formData.ginecologia.embarazoLactancia,
    uses_contraceptives: formData.ginecologia.anticonceptivos,
    climacteric_or_menopause: formData.ginecologia.climaterioMenopausia,

    // 4. Medicación y suplementos
    has_chronic_medication: formData.medicacion.cronica.aplica,
    chronic_medication_detail: formData.medicacion.cronica.aplica ? formData.medicacion.cronica.detalle : '',
    has_topical_medication: formData.medicacion.topica.aplica,
    topical_medication_detail: formData.medicacion.topica.aplica ? formData.medicacion.topica.detalle : '',
    has_anticoagulants: formData.medicacion.anticoagulantes.aplica,
    anticoagulants_detail: formData.medicacion.anticoagulantes.aplica ? formData.medicacion.anticoagulantes.detalle : '',
    has_isotretinoin: formData.medicacion.isotretinoina.aplica,
    isotretinoin_detail: formData.medicacion.isotretinoina.aplica ? formData.medicacion.isotretinoina.detalle : '',
    has_recent_antibiotics: formData.medicacion.antibioticosRecientes.aplica,
    recent_antibiotics_detail: formData.medicacion.antibioticosRecientes.aplica ? formData.medicacion.antibioticosRecientes.detalle : '',
    has_supplements: formData.medicacion.suplementos.aplica,
    supplements_detail: formData.medicacion.suplementos.aplica ? formData.medicacion.suplementos.detalle : '',

    // 5. Alergias
    has_food_allergies: formData.alergias.alimentarias.aplica,
    food_allergies_detail: formData.alergias.alimentarias.aplica ? formData.alergias.alimentarias.detalle : '',
    has_drug_allergies: formData.alergias.medicamentos.aplica,
    drug_allergies_detail: formData.alergias.medicamentos.aplica ? formData.alergias.medicamentos.detalle : '',
    has_cosmetic_metal_allergies: formData.alergias.cosmeticosMetales.aplica,
    cosmetic_metal_allergies_detail: formData.alergias.cosmeticosMetales.aplica ? formData.alergias.cosmeticosMetales.detalle : '',
    has_skin_allergies: formData.alergias.cutaneasDeclaradas.aplica,
    skin_allergies_detail: formData.alergias.cutaneasDeclaradas.aplica ? formData.alergias.cutaneasDeclaradas.detalle : '',

    // 6. Antecedentes dermatológicos
    current_skin_condition: formData.dermatologicos.afeccionActual || '',
    has_herpes_simplex: formData.dermatologicos.herpesSimple,
    has_keloids_irregular_scarring: formData.dermatologicos.cicatrizacionQueloides,
    phototype: formData.dermatologicos.fototipo != null ? String(formData.dermatologicos.fototipo) : '',
    skin_biotype: formData.dermatologicos.biotipo || '',
    sunscreen_use: formData.dermatologicos.protectorSolar || '',
    sun_exposure: formData.dermatologicos.exposicionSolar || '',

    // 7. Cirugías e intervenciones previas
    has_general_surgeries: formData.cirugias.generales.aplica,
    general_surgeries_detail: formData.cirugias.generales.aplica ? formData.cirugias.generales.detalle : '',
    general_surgeries_zone: formData.cirugias.generales.aplica ? formData.cirugias.generales.zona : '',
    has_aesthetic_interventions: formData.cirugias.esteticasPocoInvasivas.aplica,
    aesthetic_interventions_detail: formData.cirugias.esteticasPocoInvasivas.aplica ? formData.cirugias.esteticasPocoInvasivas.detalle : '',
    aesthetic_interventions_zone: formData.cirugias.esteticasPocoInvasivas.aplica ? formData.cirugias.esteticasPocoInvasivas.zona : '',
    treatments_last_two_years: formData.cirugias.tratamientosUltimosDosAnos || '',
    last_medical_checkup: formData.cirugias.ultimoChequeo || '',

    // 8. Contraindicaciones específicas
    has_pacemaker: formData.contraindicaciones.marcapasos,
    has_metal_implants: formData.contraindicaciones.implantesMetalicos,
    has_active_oncological_treatment: formData.contraindicaciones.tratamientoOncologico,
    has_open_wounds_infections: formData.contraindicaciones.heridasInfecciones,
    has_unauthorized_anticoagulants: formData.contraindicaciones.anticoagulantesSinAutorizacion
  };
}

defineExpose({
  formData,
  loadData,
  toBackendPayload,
  resetData
});
</script>

<style scoped>
.anamnesis-container {
  width: 100%;
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

.fototipo-row {
  width: 100%;
}

.fototipo-circle {
  width: clamp(34px, 8.5vw, 44px);
  height: clamp(34px, 8.5vw, 44px);
  border-radius: 50%;
  border: 2px solid transparent;
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

.border-view-selector {
  border: 1px solid #e2e8f0;
}

.toggle-modes {
  border: 1px solid #cbd5e1;
}

.toggle-modes :deep(.q-btn) {
  padding: 6px 14px;
  font-weight: 600;
  font-size: 13px;
}
</style>
