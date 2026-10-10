<template>
  <div class="anamnesis-container q-gutter-y-md">
    <!-- Encabezado alineado con las demás pestañas -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6 text-primary flex items-center">
          <q-icon name="assignment" class="q-mr-sm" size="24px" />
          Anamnesis Dermatocosmiátrica
        </div>
        <div class="text-caption text-grey-8">
          Ficha clínica digital de evaluación dermatocosmiátrica
        </div>
      </div>
    </div>

    <!-- VISTA HÍBRIDA + RESUMEN CLÍNICO -->
    <AnamnesisHybridView
      :formData="formData"
      :antecedentesList="antecedentesList"
      :medicacionList="medicacionList"
      :alergiasList="alergiasList"
      :contraindicacionesList="contraindicacionesList"
      :isSidebarCollapsed="isSidebarCollapsed"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import AnamnesisHybridView from './anamnesis/AnamnesisHybridView.vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  patient: {
    type: Object,
    default: () => ({})
  },
  observacion: {
    type: Object,
    default: () => ({})
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
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
    condiciones: [],
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
  formData.dermatologicos.condiciones = [];
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
  const rawCond = val('skin_conditions', 'skinConditions', '');
  if (Array.isArray(rawCond)) {
    formData.dermatologicos.condiciones = rawCond;
  } else if (typeof rawCond === 'string' && rawCond.trim()) {
    formData.dermatologicos.condiciones = rawCond.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    formData.dermatologicos.condiciones = [];
  }
  formData.dermatologicos.protectorSolar = val('sunscreen_use', 'sunscreenUse', '') || '';
  formData.dermatologicos.exposicionSolar = val('sun_exposure', 'sunExposure', '') || '';

  // 7. Cirugías e intervenciones previas
  formData.cirugias.generales.detalle = val('general_surgeries_detail', 'generalSurgeriesDetail', '') || '';
  formData.cirugias.generales.aplica = !!(formData.cirugias.generales.detalle || val('has_general_surgeries', 'hasGeneralSurgeries', false));
  formData.cirugias.generales.zona = val('general_surgeries_zone', 'generalSurgeriesZone', '') || '';
  formData.cirugias.esteticasPocoInvasivas.aplica = !!val('has_aesthetic_interventions', 'hasAestheticInterventions', false);
  formData.cirugias.esteticasPocoInvasivas.detalle = val('aesthetic_interventions_detail', 'aestheticInterventionsDetail', '') || '';
  formData.cirugias.esteticasPocoInvasivas.zona = val('aesthetic_interventions_zone', 'aestheticInterventionsZone', '') || '';
  formData.cirugias.tratamientosUltimosDosAnos = val('aesthetic_treatments', 'aestheticTreatments', '') || val('treatments_last_two_years', 'treatmentsLastTwoYears', '') || '';

  // 8. Contraindicaciones específicas
  formData.contraindicaciones.marcapasos = !!val('has_pacemaker', 'hasPacemaker', false);
  formData.contraindicaciones.implantesMetalicos = !!val('has_metal_implants', 'hasMetalImplants', false);
  formData.contraindicaciones.tratamientoOncologico = !!val('has_active_oncological_treatment', 'hasActiveOncologicalTreatment', false);
  formData.contraindicaciones.heridasInfecciones = !!val('has_open_wounds_infections', 'hasOpenWoundsInfections', false);
  formData.contraindicaciones.anticoagulantesSinAutorizacion = !!val('has_unauthorized_anticoagulants', 'hasUnauthorizedAnticoagulants', false);
}

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      loadData(newVal);
    }
  },
  { immediate: true }
);

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
    skin_conditions: (formData.dermatologicos.condiciones || []).join(', '),
    sunscreen_use: formData.dermatologicos.protectorSolar || '',
    sun_exposure: formData.dermatologicos.exposicionSolar || '',

    // 7. Cirugías e intervenciones previas
    has_general_surgeries: !!(formData.cirugias.generales.detalle || formData.cirugias.generales.aplica),
    general_surgeries_detail: formData.cirugias.generales.detalle || '',
    general_surgeries_zone: formData.cirugias.generales.zona || '',
    has_aesthetic_interventions: !!(formData.cirugias.tratamientosUltimosDosAnos || formData.cirugias.esteticasPocoInvasivas.aplica),
    aesthetic_interventions_detail: formData.cirugias.esteticasPocoInvasivas.aplica ? formData.cirugias.esteticasPocoInvasivas.detalle : '',
    aesthetic_treatments: formData.cirugias.tratamientosUltimosDosAnos || '',
    treatments_last_two_years: formData.cirugias.tratamientosUltimosDosAnos || '',

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

</style>
