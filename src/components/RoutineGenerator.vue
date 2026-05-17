<template>
  <div class="routine-generator-container">
    <div class="header q-mb-md">
      <h1 class="text-h4 text-primary q-my-none">Editor de Rutina Facial</h1>
      <div class="controls q-gutter-sm">
        <q-btn
          color="primary"
          icon="auto_awesome"
          label="Catálogo"
          to="/catalogo"
        />

        <q-btn
          color="secondary"
          icon="save"
          label="Guardar Rutina"
          @click="saveRoutine"
          id="saveRoutine"
        />
        <q-btn
          color="primary"
          icon="download"
          label="Descargar PDF"
          @click="downloadPDF"
          id="downloadPDF"
        />
      </div>
    </div>

    <div class="routine-card" id="routine-preview">
      <div class="routine-header q-mb-lg pdf-only">
        <div class="logo-title flex items-center justify-between">
          <div class="logo">
            <img src="/centro-avatar.png" alt="Logo" style="height: 60px;">
          </div>
          <h2 class="main-title text-h3 text-primary text-weight-bold q-my-none text-center" style="font-family: 'Playfair Display', serif;">Mi Rutina Facial</h2>
          <div style="width: 60px;"></div> <!-- Spacer -->
        </div>
      </div>

      <div class="columns row q-col-gutter-lg">
        <!-- Columna DÍA -->
        <div class="col-12 col-md-6">
          <div class="column-header column-header--day q-mb-md">
            <h3 class="column-header__title q-my-none">DÍA ☀️</h3>
          </div>
          <div id="day-steps" class="steps-list">
            <div v-for="(step, index) in routineData.day" :key="'day-'+index" class="step-card step-card--day q-mb-md">
              <div class="step-card__header" :class="{ 'step-card__header--readonly': !isEditing }">
                <div class="step-card__badge step-card__badge--day">{{ index + 1 }}</div>
                <input
                  v-if="isEditing"
                  type="text"
                  v-model="step.title"
                  class="step-card__title-input"
                  :placeholder="'Paso ' + (index + 1)"
                >
                <span v-else class="step-card__title-text">{{ step.title }}</span>
                <q-btn
                  v-if="isEditing"
                  flat
                  round
                  color="grey-5"
                  icon="delete_outline"
                  size="sm"
                  class="step-card__delete"
                  @click="removeStep('day', index)"
                  title="Eliminar paso"
                />
              </div>
              <div class="step-card__body" :class="{ 'step-card__body--readonly': !isEditing }">
                <textarea
                  v-if="isEditing"
                  v-model="step.description"
                  @input="e => handleTextareaInput(e, 'day', index)"
                  @blur="handleTextareaBlur"
                  placeholder="Descripción del producto o paso..."
                  rows="4"
                  class="step-card__textarea"
                ></textarea>
                <div v-else class="step-card__description">{{ step.description || '&nbsp;' }}</div>

                <q-menu
                  v-if="activeMention.period === 'day' && activeMention.index === index && showMentionMenu"
                  v-model="showMentionMenu"
                  no-parent-event
                  no-focus
                  fit
                >
                  <q-list dense style="min-width: 200px; max-height: 250px;">
                    <q-item clickable v-ripple v-for="prod in filteredMentionProducts" :key="prod.id" @mousedown.prevent="selectMentionProduct(prod)">
                      <q-item-section>
                        <q-item-label>{{ prod.name }}</q-item-label>
                        <q-item-label caption>{{ prod.brand_name }} - {{ prod.product_type_name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-if="filteredMentionProducts.length === 0">
                      <q-item-section class="text-grey">No hay resultados</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>
            <div v-if="isEditing" class="text-center q-mt-md">
              <q-btn outline color="primary" icon="add" label="Añadir Paso" @click="addStep('day')" class="add-step-btn" />
            </div>
          </div>
        </div>

        <!-- Columna NOCHE -->
        <div class="col-12 col-md-6">
          <div class="column-header column-header--night q-mb-md">
            <h3 class="column-header__title q-my-none">NOCHE 🌙</h3>
          </div>
          <div id="night-steps" class="steps-list">
            <div v-for="(step, index) in routineData.night" :key="'night-'+index" class="step-card step-card--night q-mb-md">
              <div class="step-card__header" :class="{ 'step-card__header--readonly': !isEditing }">
                <div class="step-card__badge step-card__badge--night">{{ index + 1 }}</div>
                <input
                  v-if="isEditing"
                  type="text"
                  v-model="step.title"
                  class="step-card__title-input"
                  :placeholder="'Paso ' + (index + 1)"
                >
                <span v-else class="step-card__title-text">{{ step.title }}</span>
                <q-btn
                  v-if="isEditing"
                  flat
                  round
                  color="grey-5"
                  icon="delete_outline"
                  size="sm"
                  class="step-card__delete"
                  @click="removeStep('night', index)"
                  title="Eliminar paso"
                />
              </div>
              <div class="step-card__body" :class="{ 'step-card__body--readonly': !isEditing }">
                <textarea
                  v-if="isEditing"
                  v-model="step.description"
                  @input="e => handleTextareaInput(e, 'night', index)"
                  @blur="handleTextareaBlur"
                  placeholder="Descripción del producto o paso..."
                  rows="4"
                  class="step-card__textarea"
                ></textarea>
                <div v-else class="step-card__description">{{ step.description || '&nbsp;' }}</div>

                <q-menu
                  v-if="activeMention.period === 'night' && activeMention.index === index && showMentionMenu"
                  v-model="showMentionMenu"
                  no-parent-event
                  no-focus
                  fit
                >
                  <q-list dense style="min-width: 200px; max-height: 250px;">
                    <q-item clickable v-ripple v-for="prod in filteredMentionProducts" :key="prod.id" @mousedown.prevent="selectMentionProduct(prod)">
                      <q-item-section>
                        <q-item-label>{{ prod.name }}</q-item-label>
                        <q-item-label caption>{{ prod.brand_name }} - {{ prod.product_type_name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-if="filteredMentionProducts.length === 0">
                      <q-item-section class="text-grey">No hay resultados</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </div>
            </div>
            <div v-if="isEditing" class="text-center q-mt-md">
              <q-btn outline color="primary" icon="add" label="Añadir Paso" @click="addStep('night')" class="add-step-btn" />
            </div>
          </div>
        </div>
      </div>

      <!-- Notas Section -->
      <div class="notes-section q-mt-xl">
        <div class="section-header">
          <div class="section-header__icon">📝</div>
          <h4 class="section-header__title q-my-none">Notas y Recomendaciones Especiales</h4>
        </div>
        <div class="section-body" :class="{ 'section-body--readonly': !isEditing }">
          <textarea
            v-if="isEditing"
            v-model="routineData.notes"
            placeholder="Añade recomendaciones adicionales aquí..."
            rows="4"
            class="step-card__textarea"
          ></textarea>
          <div v-else class="step-card__description" style="min-height: 6rem;">{{ routineData.notes || '---' }}</div>
        </div>
      </div>

      <!-- Patient Name Section (solo visible en PDF) -->
      <div class="patient-name-section q-mt-lg pdf-only">
        <div class="section-header">
          <div class="section-header__icon">👤</div>
          <h4 class="section-header__title q-my-none">Paciente</h4>
        </div>
        <div class="section-body" :class="{ 'section-body--readonly': !isEditing }">
          <textarea
            v-if="isEditing"
            v-model="routineData.patientName"
            class="step-card__textarea single-line-input"
            placeholder="Nombre del paciente..."
            rows="1"
          ></textarea>
          <div v-else class="step-card__description" style="min-height: 40px;">{{ routineData.patientName || '---' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, toRaw, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RecommendedProductsAPI } from '../services/api';

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

// Datos de la rutina
const routineData = reactive({
  day: [
    { title: '1. Limpieza', description: '' },
    { title: '2. Tónico', description: '' },
    { title: '3. Contorno de ojos', description: '' },
    { title: '4. Serum', description: '' },
    { title: '5. Hidratante', description: '' },
    { title: '6. Protector solar', description: '' }
  ],
  night: [
    { title: '1. Limpieza', description: '' },
    { title: '2. Tónico', description: '' },
    { title: '3. Contorno de ojos', description: '' },
    { title: '4. Serum', description: '' },
    { title: '5. Hidratante', description: '' }
  ],
  notes: '',
  patientName: ''
});

watch(() => props.initialRoutine, (newVal) => {
  if (newVal) {
    routineData.day = Array.isArray(newVal.day) ? [...newVal.day] : [];
    routineData.night = Array.isArray(newVal.night) ? [...newVal.night] : [];
    routineData.notes = newVal.notes ?? '';
    if (newVal.patientName !== undefined) routineData.patientName = newVal.patientName;
  }
}, { immediate: true, deep: true });

// Menú de menciones (@)
const availableProducts = ref([]);
const activeMention = ref({ period: null, index: null });
const showMentionMenu = ref(false);
const mentionQuery = ref('');
const mentionStartIndex = ref(-1);

onMounted(async () => {
  try {
    const res = await RecommendedProductsAPI.list();
    availableProducts.value = res.data;
  } catch (e) {
    console.error('Error cargando productos para autocompletar', e);
  }
});

const filteredMentionProducts = computed(() => {
  const q = mentionQuery.value.toLowerCase();
  if (!q) return availableProducts.value.slice(0, 8);
  return availableProducts.value.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.brand_name.toLowerCase().includes(q) ||
    p.product_type_name.toLowerCase().includes(q)
  ).slice(0, 8);
});

const handleTextareaInput = (event, period, index) => {
  const el = event.target;
  const cursorPosition = el.selectionStart;
  const textBeforeCursor = el.value.substring(0, cursorPosition);
  
  // Regex: buscar último '@' precedido de espacio o inicio de texto, capturando lo que sigue sin espacios
  const match = textBeforeCursor.match(/(?:^|\s)@([^\s]*)$/);
  
  if (match) {
    activeMention.value = { period, index };
    mentionQuery.value = match[1];
    mentionStartIndex.value = cursorPosition - match[1].length - 1; // La posición exacta del '@'
    showMentionMenu.value = true;
  } else {
    showMentionMenu.value = false;
    activeMention.value = { period: null, index: null };
  }
};

const handleTextareaBlur = () => {
  // Cerramos el menú al salir. El mousedown.prevent en el item evita que esto se dispare antes de seleccionar
  showMentionMenu.value = false;
};

const selectMentionProduct = (product) => {
  const { period, index } = activeMention.value;
  if (!period || index === null) return;
  
  const step = routineData[period][index];
  const text = step.description;
  const insertText = `${product.brand_name} ${product.name} `;
  
  const before = text.substring(0, mentionStartIndex.value);
  // El texto después asume que reemplazamos desde el '@' hasta donde haya llegado el cursor actual
  const currentQueryLen = mentionQuery.value.length;
  const after = text.substring(mentionStartIndex.value + 1 + currentQueryLen);
  
  step.description = before + insertText + after;
  
  showMentionMenu.value = false;
  activeMention.value = { period: null, index: null };
};

// Métodos

const saveRoutine = () => {
  // Emitimos el evento con una copia plana (toRaw evita problemas con Vue Proxy)
  const raw = toRaw(routineData);
  const clone = {
    day: raw.day.map(s => ({ ...s })),
    night: raw.night.map(s => ({ ...s })),
    notes: raw.notes,
    patientName: raw.patientName
  };
  emit('save', clone);
};

const addStep = (period) => {
  const newIndex = routineData[period].length + 1;
  routineData[period].push({
    title: `${newIndex}. Nuevo Paso`,
    description: ''
  });
};

const removeStep = (period, index) => {
  routineData[period].splice(index, 1);
};

const downloadPDF = async () => {
  const routineCardElement = document.getElementById('routine-preview');

  // Asegurar que estemos en modo vista previa para el PDF
  const wasEditing = isEditing.value;
  if (wasEditing) {
    isEditing.value = false;
    // Esperar a que el DOM se actualice para reflejar el modo de vista previa
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  try {


    const canvas = await html2canvas(routineCardElement, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#FAFAF8',
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const preview = clonedDoc.getElementById('routine-preview');
        if (preview) {
            // Mostrar los elementos que solo se ven en el PDF (logo, título, paciente)
            preview.querySelectorAll('.pdf-only').forEach(el => {
              el.style.display = 'block';
            });

            // Emparejar alturas por fila entre Día y Noche para mantener alineación
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
        icon: 'check'
    });

  } catch (error) {
    console.error('Error generando PDF:', error);
    $q.notify({
        color: 'negative',
        message: 'Error al generar el PDF. Por favor, inténtalo de nuevo.',
        icon: 'error'
    });
  } finally {

    if (wasEditing) {
      isEditing.value = true;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&display=swap');

.routine-generator-container {
    max-width: 1000px;
    margin: 0 auto;
    font-family: 'Poppins', sans-serif;
    color: #2D3748;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

/* ─── Routine Card (contenedor principal) ─── */
.routine-card {
    background-color: #FAFAF8;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

/* ─── Column Headers ─── */
.column-header {
    padding: 1rem 1.5rem;
    border-radius: 12px;
    text-align: center;
}

.column-header--day {
    background: linear-gradient(135deg, #F6D365 0%, #E8A838 100%);
    box-shadow: 0 4px 12px rgba(232, 168, 56, 0.3);
}

.column-header--night {
    background: linear-gradient(135deg, #A78BFA 0%, #6366F1 100%);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.column-header__title {
    color: #FFFFFF;
    font-weight: 700;
    font-size: 1.25rem;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* ─── Step Cards ─── */
.step-card {
    background: #FFFFFF;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: box-shadow 0.25s ease, transform 0.25s ease;
    border-left: 4px solid transparent;
}

.step-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

.step-card--day {
    border-left-color: #E8A838;
}

.step-card--night {
    border-left-color: #6366F1;
}

/* ─── Step Card Header ─── */
.step-card__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: #F8F9FA;
    border-bottom: 1px solid #F0F0F0;
}

.step-card__header--readonly {
    background: #FAFBFC;
}

/* ─── Badge ─── */
.step-card__badge {
    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
    color: #FFFFFF;
    flex-shrink: 0;
}

.step-card__badge--day {
    background: linear-gradient(135deg, #F6D365, #E8A838);
    box-shadow: 0 2px 6px rgba(232, 168, 56, 0.35);
}

.step-card__badge--night {
    background: linear-gradient(135deg, #A78BFA, #6366F1);
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.35);
}

/* ─── Step Title ─── */
.step-card__title-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #2D3748;
    font-weight: 600;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    outline: none;
    padding: 0.25rem 0;
}

.step-card__title-input::placeholder {
    color: #A0AEC0;
}

.step-card__title-text {
    flex: 1;
    color: #2D3748;
    font-weight: 600;
    font-size: 1rem;
}

/* ─── Delete Button ─── */
.step-card__delete {
    opacity: 0.4;
    transition: opacity 0.2s ease, color 0.2s ease;
}

.step-card:hover .step-card__delete {
    opacity: 0.7;
}

.step-card__delete:hover {
    opacity: 1 !important;
    color: #E53E3E !important;
}

/* ─── Step Card Body ─── */
.step-card__body {
    padding: 0.875rem 1rem;
}

.step-card__textarea {
    width: 100%;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 0.75rem;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    background-color: #FFFFFF;
    color: #2D3748;
    resize: vertical;
    min-height: 80px;
    line-height: 1.6;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    outline: none;
}

.step-card__textarea:focus {
    border-color: #90CDF4;
    box-shadow: 0 0 0 3px rgba(144, 205, 244, 0.25);
}

.step-card__description {
    color: #4A5568;
    min-height: 2rem;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
    padding: 0.25rem 0;
}

/* ─── Single line input (Patient name) ─── */
.single-line-input {
    resize: none;
    overflow: hidden;
    height: 42px;
    min-height: 42px;
}

/* ─── Section Headers (Notes, Patient) ─── */
.section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: #F8F9FA;
    border-radius: 12px;
    margin-bottom: 1rem;
    border: 1px solid #EDF2F7;
}

.section-header__icon {
    font-size: 1.25rem;
}

.section-header__title {
    color: #2D3748;
    font-weight: 600;
    font-size: 1.05rem;
}

.section-body {
    padding: 0 0.25rem;
}

/* ─── Add Step Button ─── */
.add-step-btn {
    border-style: dashed !important;
    border-width: 2px !important;
    border-radius: 10px !important;
    transition: all 0.25s ease;
}

.add-step-btn:hover {
    background-color: rgba(66, 133, 244, 0.05) !important;
    transform: translateY(-1px);
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
    .header {
        flex-direction: column;
        text-align: center;
    }

    .routine-card {
        padding: 1.5rem;
    }

    .logo-title {
        flex-direction: column;
        gap: 1rem;
    }
}

/* ─── PDF Only (ocultos en la UI, visibles solo al generar el PDF) ─── */
.pdf-only {
    display: none;
}
</style>
