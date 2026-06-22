<template>
  <q-page padding>
    <input ref="inputFoto" type="file" accept="image/*" class="hidden" @change="onFotoSelected"/>

    <div class="row q-col-gutter-lg justify-center">
      <!-- Sidebar Perfil Fijo (solo en desktop) -->
      <div class="col-12 col-md-4 col-lg-3 gt-sm">
        <q-card class="q-pa-md minimal-card">
          <div class="flex column items-center">
            <q-avatar size="100px" class="q-mb-md" :class="editing ? 'avatar-clickable' : 'bg-blue-1 text-primary'" @click="editing && seleccionarFoto()">
              <img v-if="patient.profile_picture" :src="patient.profile_picture" alt="Foto de perfil"/>
              <q-icon v-else name="person" size="60px" color="grey-5"/>
              <div v-if="editing" class="avatar-overlay">
                <q-icon name="photo_camera" size="24px" color="white"/>
              </div>
            </q-avatar>
            
            <div v-if="!editing" class="full-width">
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Nombre:</span><br>{{ patient.name }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Apellido:</span><br>{{ patient.last_name }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Nacimiento:</span><br>{{ formatDate(patient.birth_date) }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Dirección:</span><br>{{ patient.address }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Localidad:</span><br>{{ patient.locality }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Teléfono:</span><br>{{ patient.phone }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Celular:</span><br>{{ patient.cellphone }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">E-mail:</span><br>{{ patient.email }}</div>
              <div class="q-mb-sm" v-if="patient.additional_note"><span class="text-weight-bold text-grey-8">Nota adicional:</span><br><span style="white-space: pre-wrap;">{{ patient.additional_note }}</span></div>
              <div class="text-caption text-grey-6 text-center q-my-sm">ID: {{ patient.id }}</div>
              <div class="row justify-center">
                <q-btn label="Editar Perfil" color="primary" class="full-width minimal-btn-save" @click="editing = true" />
              </div>
            </div>

            <div v-else class="full-width">
              <div class="row q-col-gutter-xs q-mb-md">
                <div class="col-12"><q-input v-model="patientEdit.name" label="Nombre" dense class="minimal-input" borderless /></div>
                <div class="col-12"><q-input v-model="patientEdit.last_name" label="Apellido" dense class="minimal-input" borderless /></div>
                <div class="col-12"><q-input v-model="patientEdit.birth_date" label="Fecha de Nacimiento" dense class="minimal-input" borderless type="date" /></div>
                <div class="col-12"><q-input v-model="patientEdit.address" label="Dirección" dense class="minimal-input" borderless /></div>
                <div class="col-12"><q-input v-model="patientEdit.locality" label="Localidad" dense class="minimal-input" borderless /></div>
                <div class="col-12"><q-input v-model="patientEdit.phone" label="Teléfono" dense class="minimal-input" borderless /></div>
                <div class="col-12"><q-input v-model="patientEdit.cellphone" label="Celular" dense class="minimal-input" borderless /></div>
                <div class="col-12"><q-input v-model="patientEdit.email" label="E-mail" dense class="minimal-input" borderless /></div>
                <div class="col-12"><q-input v-model="patientEdit.additional_note" label="Nota adicional" type="textarea" autogrow maxlength="200" counter class="minimal-input" borderless /></div>
              </div>
              <div class="row q-gutter-sm justify-center q-mt-sm">
                <q-btn flat label="Cancelar" @click="cancelPatientEdit" color="grey-8" class="minimal-btn" />
                <q-btn label="Guardar" color="primary" @click="updatePatientData" class="minimal-btn-save" />
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Contenido Principal con Tabs -->
      <div class="col-12 col-md-8 col-lg-7">
        <q-card class="q-pa-md q-pa-sm-lg">
          <q-tabs v-model="tab" class="text-primary q-mb-md" align="left" dense mobile-arrows outside-arrows>
            <!-- Tab Perfil: Sólo visible en mobile (lt-md) -->
            <q-tab name="perfil" label="Perfil del Paciente" class="lt-md" />
            <q-tab name="antecedentes" label="Datos Médicos" />
            <q-tab name="observaciones" label="Observaciones y Diagnóstico" />
            <q-tab name="apoyo" label="Apoyo domiciliario" />
            <q-tab name="rutina" label="Rutina" />
            <q-tab name="sesiones" label="Sesiones" />
          </q-tabs>
          <q-separator />
          
          <q-tab-panels v-model="tab" animated>
            <!-- Tab Panel Perfil: Sólo visible en mobile (lt-md) -->
            <q-tab-panel name="perfil" class="lt-md">
              <div class="flex column items-center q-pa-md">
                <q-avatar size="100px" class="q-mb-md" :class="editing ? 'avatar-clickable' : 'bg-blue-1 text-primary'" @click="editing && seleccionarFoto()">
                  <img v-if="patient.profile_picture" :src="patient.profile_picture" alt="Foto de perfil"/>
                  <q-icon v-else name="person" size="60px" color="grey-5"/>
                  <div v-if="editing" class="avatar-overlay">
                    <q-icon name="photo_camera" size="24px" color="white"/>
                  </div>
                </q-avatar>
                
                <div v-if="!editing" class="full-width" style="max-width: 600px;">
                  <div class="row q-col-gutter-md q-mb-md">
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Nombre:</span><br>{{ patient.name }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Apellido:</span><br>{{ patient.last_name }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Fecha de Nacimiento:</span><br>{{ formatDate(patient.birth_date) }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Dirección:</span><br>{{ patient.address }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Localidad:</span><br>{{ patient.locality }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Teléfono:</span><br>{{ patient.phone }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Celular:</span><br>{{ patient.cellphone }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">E-mail:</span><br>{{ patient.email }}</div>
                    <div class="col-12" v-if="patient.additional_note"><span class="text-weight-medium">Nota adicional:</span><br><span style="white-space: pre-wrap;">{{ patient.additional_note }}</span></div>
                  </div>
                  <div class="text-caption text-grey-6 text-center q-mb-md">ID: {{ patient.id }}</div>
                  <div class="row justify-center">
                    <q-btn label="Editar Perfil" color="primary" class="minimal-btn-save" @click="editing = true" />
                  </div>
                </div>

                <div v-else class="full-width" style="max-width: 600px;">
                  <div class="row q-col-gutter-sm q-mb-md">
                    <div class="col-12 col-sm-6"><q-input v-model="patientEdit.name" label="Nombre" dense class="minimal-input" borderless /></div>
                    <div class="col-12 col-sm-6"><q-input v-model="patientEdit.last_name" label="Apellido" dense class="minimal-input" borderless /></div>
                    <div class="col-12 col-sm-6"><q-input v-model="patientEdit.birth_date" label="Fecha de Nacimiento" dense class="minimal-input" borderless type="date" /></div>
                    <div class="col-12 col-sm-6"><q-input v-model="patientEdit.address" label="Dirección" dense class="minimal-input" borderless /></div>
                    <div class="col-12 col-sm-6"><q-input v-model="patientEdit.locality" label="Localidad" dense class="minimal-input" borderless /></div>
                    <div class="col-12 col-sm-6"><q-input v-model="patientEdit.phone" label="Teléfono" dense class="minimal-input" borderless /></div>
                    <div class="col-12 col-sm-6"><q-input v-model="patientEdit.cellphone" label="Celular" dense class="minimal-input" borderless /></div>
                    <div class="col-12 col-sm-6"><q-input v-model="patientEdit.email" label="E-mail" dense class="minimal-input" borderless /></div>
                    <div class="col-12"><q-input v-model="patientEdit.additional_note" label="Nota adicional" type="textarea" autogrow maxlength="200" counter class="minimal-input" borderless /></div>
                  </div>
                  <div class="row q-gutter-sm justify-center q-mt-sm">
                    <q-btn flat label="Cancelar" @click="cancelPatientEdit" color="grey-8" class="minimal-btn" />
                    <q-btn label="Guardar" color="primary" @click="updatePatientData" class="minimal-btn-save" />
                  </div>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="antecedentes">
              <div class="text-h6 q-mb-md">Datos Médicos</div>
              <q-form class="q-gutter-md">
                <q-input v-model="antecedentes.intervenciones" label="Intervenciones quirúrgicas" class="minimal-input"
                  borderless dense />
                <q-input v-model="antecedentes.rellenos" label="Rellenos estéticos" class="minimal-input" borderless
                  dense />
                <q-input v-model="antecedentes.alergias" label="Alergias" class="minimal-input" borderless dense />
                <q-input v-model="antecedentes.enfermedades" label="Enfermedades" class="minimal-input" borderless
                  dense />
                <q-input v-model="antecedentes.medicamentos" label="Medicamentos" class="minimal-input" borderless
                  dense />
                <q-input v-model="antecedentes.habitos" label="Hábitos" class="minimal-input" borderless dense />
                <q-input v-model="antecedentes.cutaneas" label="Antecedentes de enfermedades cutáneas"
                  class="minimal-input" borderless dense />
                <q-input v-model="antecedentes.familiares" label="Antecedentes familiares" class="minimal-input"
                  borderless dense />
                <div class="row q-gutter-sm justify-end q-mt-md">
                  <q-btn flat label="Cancelar" @click="resetAntecedentes" color="grey-8" class="minimal-btn" />
                  <q-btn label="Guardar" color="primary" @click="guardarAntecedentes" class="minimal-btn-save" />
                </div>
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="observaciones">
              <div class="text-h6 q-mb-md">Observación y Diagnóstico</div>
              <q-form class="q-gutter-md">
                <q-input v-model="observacion.motivo" label="Motivo de la consulta" class="minimal-input" borderless
                  dense />
                <q-input v-model="observacion.biotipo" label="Biotipo" class="minimal-input" borderless dense />
                <div class="q-mb-md">
                  <div class="q-mb-sm text-grey-8" style="padding-left: 4px;">Fototipo</div>
                  <div class="row q-gutter-sm justify-start items-center q-pl-xs">
                    <div v-for="n in 6" :key="n" 
                         class="fototipo-circle cursor-pointer flex flex-center shadow-1"
                         :class="{ 'fototipo-selected': observacion.fototipo == n }"
                         :style="{ backgroundColor: getFototipoColor(n), color: n >= 5 ? '#fff' : '#333' }"
                         @click="observacion.fototipo = (observacion.fototipo == n ? null : n)">
                      {{ n }}
                    </div>
                  </div>
                </div>

                <q-input v-model="observacion.recomendaciones" label="Recomendaciones" class="minimal-input" borderless
                  dense />
                <q-card class="q-mt-lg q-pa-lg bg-grey-2 shadow-1 minimal-lesion-card">
                  <div class="text-h6 q-mb-md">Lesión</div>
                  <q-input v-model="lesion.inicio" label="Inicio" class="minimal-input" borderless dense />
                  <q-input v-model="lesion.lugar" label="Lugar de inicio" class="minimal-input" borderless dense />
                  <q-input v-model="lesion.sintomas" label="Síntomas" class="minimal-input" borderless dense />
                  <q-input v-model="lesion.evolucion" label="Evolución" class="minimal-input" borderless dense />
                  <q-input v-model="lesion.cambios" label="Cambios" class="minimal-input" borderless dense />
                  <q-input v-model="lesion.factores" label="Factores que incrementan riesgo" class="minimal-input"
                    borderless dense />
                  <q-input v-model="lesion.tratamientos" label="Tratamientos posteriores" class="minimal-input"
                    borderless dense />
                </q-card>
                <div class="row q-gutter-sm justify-end q-mt-md">
                  <q-btn flat label="Cancelar" @click="resetObservaciones" color="grey-8" class="minimal-btn" />
                  <q-btn label="Guardar" color="primary" @click="guardarObservaciones" class="minimal-btn-save" />
                </div>
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="apoyo">
              <div class="text-h6 q-mb-md">Apoyo Domiciliario Inicial</div>
              <q-form class="q-gutter-md">
                <q-input v-model="apoyo.rutinaActual" label="Rutina actual" class="minimal-input" borderless dense
                  counter maxlength="10000" />
                <q-input v-model="apoyo.rutinaSemanal" label="Rutina semanal" class="minimal-input" borderless dense
                  counter maxlength="10000" />
                <q-input v-model="apoyo.recomendaciones" label="Recomendaciones" class="minimal-input" borderless dense
                  counter maxlength="10000" />
                <div class="row q-gutter-sm justify-end q-mt-md">
                  <q-btn flat label="Cancelar" @click="resetApoyo" color="grey-8" class="minimal-btn" />
                  <q-btn label="Guardar" color="primary" @click="guardarApoyo" class="minimal-btn-save" />
                </div>
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="rutina">
              <RoutineGenerator ref="routineEditor" :initialRoutine="mappedRoutine" @save="handleRoutineSave" />
              <div class="row q-gutter-sm justify-end q-mt-md">
                <q-btn flat label="Cancelar" @click="cancelarRutina" color="grey-8" class="minimal-btn" />
                <q-btn label="Guardar" color="primary" @click="guardarRutina" class="minimal-btn-save" />
                <q-btn outline :label="$q.screen.gt.xs ? 'Descargar' : ''" color="primary" icon="download" @click="descargarRutina" class="minimal-btn" />
              </div>
            </q-tab-panel>
            <q-tab-panel name="sesiones">
              <div class="row items-center q-mb-md">
                <div class="col text-h6">Sesiones ({{ sesionesOrdenadas.length }})</div>
                <q-space />
                <q-btn color="primary" icon="add" label="Nueva Sesión" @click="nuevaSesion" />
              </div>
              <q-table :rows="sesionesOrdenadas" :columns="columns" row-key="id" flat dense hide-bottom class="q-mb-md"
                @row-click="(evt, row) => verSesion(row)">
                <template #body-cell-date="props">
                  <q-td>{{ formatDate(props.row.date) }}</q-td>
                </template>
                <template #body-cell-treatment="props">
                  <q-td>{{ props.row.treatment }}</q-td>
                </template>
                <template #body-cell-acciones="props">
                  <q-btn flat dense icon="edit" @click.stop="verSesion(props.row)" />
                  <q-btn flat dense icon="delete" color="negative" class="q-ml-sm" @click.stop="confirmarEliminarSesion(props.row)" />
                </template>
              </q-table>
              <!-- MODAL MODERNO Y MINIMALISTA -->
              <q-dialog v-model="showSesionDialog" :maximized="$q.screen.lt.sm">
                <q-card class="modern-session-modal minimal-modal">
                  <q-card-section class="row items-center justify-between q-pb-none minimal-modal-header">
                    <div class="text-h5 text-primary minimal-title">
                      <q-icon name="event_note" class="q-mr-sm" />
                      {{ sesionActual.id ? 'Detalle de Sesión' : 'Nueva Sesión' }}
                    </div>
                    <q-btn icon="close" flat round dense v-close-popup @click="cancelarSesion" class="minimal-close" />
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="q-gutter-md q-pt-md minimal-modal-body">
                    <q-input v-model="sesionActual.date" label="Fecha" dense type="date" class="minimal-input"
                      borderless />
                    <q-input v-model="sesionActual.observation" label="Observación" type="textarea"
                      class="minimal-input" autogrow borderless />
                    <q-input v-model="sesionActual.treatment" label="Tratamiento realizado" type="textarea"
                      class="minimal-input" autogrow borderless />
                  </q-card-section>
                  <q-separator />
                  <q-card-actions align="right" class="q-pa-md minimal-actions">
                    <q-btn flat label="Cancelar" @click="cancelarSesion" class="minimal-btn" />
                    <q-btn label="Guardar" color="primary" @click="guardarSesion" class="minimal-btn-save" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <!-- Diálogo de recorte de imagen -->
    <q-dialog v-model="showCropDialog" persistent :maximized="$q.screen.lt.sm">
      <q-card class="crop-dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Ajustar imagen</div>
          <q-space/>
          <q-btn icon="close" flat round dense @click="cancelCrop"/>
        </q-card-section>
        <q-card-section class="flex flex-center">
          <div class="crop-container" ref="cropContainer"
               @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag"
               @touchstart.prevent="startDragTouch" @touchmove.prevent="onDragTouch" @touchend="endDrag"
               @wheel.prevent="onWheel">
            <canvas ref="cropCanvas" width="250" height="250"></canvas>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-caption text-grey-6 text-center q-mb-sm">Arrastrá para mover · Scroll para zoom</div>
          <q-slider v-model="cropZoom" :min="0.5" :max="3" :step="0.05" label label-always
                    :label-value="'Zoom ' + cropZoom.toFixed(1) + 'x'" color="primary" @update:model-value="drawCrop"/>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" @click="cancelCrop" class="minimal-btn"/>
          <q-btn label="Confirmar" color="primary" @click="confirmCrop" class="minimal-btn-save"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PATIENTS_URL, MEDICAL_HISTORY_ENDPOINT, HOME_SUPPORTS_ENDPOINT, ROUTINES_ENDPOINT, DIAGNOSTICS_ENDPOINT, SessionsAPI } from "../services/api";
import axios from "axios";
import { useQuasar } from "quasar";
import RoutineGenerator from '../components/RoutineGenerator.vue';

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

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const editing = ref(false);
const patient = reactive({
  id: '',
  name: '',
  last_name: '',
  birth_date: '',
  address: '',
  locality: '',
  phone: '',
  cellphone: '',
  email: '',
  additional_note: '',
  profile_picture: ''
});
const patientEdit = reactive({ ...patient });
const inputFoto = ref(null);

// Crop state
const showCropDialog = ref(false);
const cropCanvas = ref(null);
const cropContainer = ref(null);
const cropZoom = ref(1);
const cropImage = ref(null);
const cropOffset = ref({x: 0, y: 0});
const tab = ref($q.screen.gt.sm ? 'antecedentes' : 'perfil');

onMounted(() => {
  if ($q.screen.gt.sm && tab.value === 'perfil') {
    tab.value = 'antecedentes';
  }
});

watch(() => $q.screen.gt.sm, (isDesktop) => {
  if (isDesktop && tab.value === 'perfil') {
    tab.value = 'antecedentes';
  }
});

const routineEditor = ref(null);

function guardarRutina() {
  routineEditor.value && routineEditor.value.saveRoutine();
}

function cancelarRutina() {
  routineEditor.value && routineEditor.value.resetToInitial();
}

function descargarRutina() {
  routineEditor.value && routineEditor.value.downloadPDF();
}

const sesiones = ref([]);
const columns = [
  { name: 'date', label: 'Fecha', field: 'date', align: 'left' },
  { name: 'treatment', label: 'Tratamiento', field: 'treatment', align: 'left' },
  { name: 'acciones', label: '', field: 'acciones', align: 'right' },
];
const sesionesOrdenadas = computed(() =>
  [...sesiones.value].sort((a, b) => b.date.localeCompare(a.date))
);
const showSesionDialog = ref(false);
const sesionActual = reactive({ id: null, date: '', observation: '', treatment: '' });

function seleccionarFoto() {
  inputFoto.value && inputFoto.value.click();
}

function onFotoSelected(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      cropImage.value = img;
      cropZoom.value = 1;
      cropOffset.value = {x: 0, y: 0};
      showCropDialog.value = true;
      nextTick(() => drawCrop());
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

function drawCrop() {
  const canvas = cropCanvas.value;
  if (!canvas || !cropImage.value) return;
  const ctx = canvas.getContext('2d');
  const size = 250;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, size, size);
  const img = cropImage.value;
  const zoom = cropZoom.value;
  const scale = Math.max(size / img.width, size / img.height) * zoom;
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (size - w) / 2 + cropOffset.value.x;
  const y = (size - h) / 2 + cropOffset.value.y;
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.strokeStyle = '#1976d2';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function startDrag(e) {
  dragging.value = true;
  dragStart.value = {x: e.clientX - cropOffset.value.x, y: e.clientY - cropOffset.value.y};
}
function startDragTouch(e) {
  const t = e.touches[0];
  dragging.value = true;
  dragStart.value = {x: t.clientX - cropOffset.value.x, y: t.clientY - cropOffset.value.y};
}
function onDrag(e) {
  if (!dragging.value) return;
  cropOffset.value = {x: e.clientX - dragStart.value.x, y: e.clientY - dragStart.value.y};
  drawCrop();
}
function onDragTouch(e) {
  if (!dragging.value) return;
  const t = e.touches[0];
  cropOffset.value = {x: t.clientX - dragStart.value.x, y: t.clientY - dragStart.value.y};
  drawCrop();
}
function endDrag() { dragging.value = false; }
function onWheel(e) {
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  cropZoom.value = Math.max(0.5, Math.min(3, cropZoom.value + delta));
  drawCrop();
}
function cancelCrop() {
  showCropDialog.value = false;
  cropImage.value = null;
}
function confirmCrop() {
  const canvas = cropCanvas.value;
  if (!canvas) return;
  const base64 = canvas.toDataURL('image/jpeg', 0.85);
  patientEdit.profile_picture = base64;
  patient.profile_picture = base64;
  showCropDialog.value = false;
  cropImage.value = null;
}

async function updatePatientData() {
  try {
    await axios.put(`${PATIENTS_URL}/${route.params.id}`, patientEdit);

    Object.assign(patient, patientEdit);
    $q.notify({
      type: 'positive',
      message: 'Paciente actualizado correctamente',
      position: 'top'
    });
    editing.value = false;
  } catch (error) {
    console.error('Error al actualizar el paciente:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar el paciente',
      position: 'top'
    });
  }
}

function cancelPatientEdit() {
  Object.assign(patientEdit, patient);
  editing.value = false;
}

function verSesion(row) {
  Object.assign(sesionActual, row);
  showSesionDialog.value = true;
}

function nuevaSesion() {
  Object.assign(sesionActual, { id: null, date: '', observation: '', treatment: '' });
  showSesionDialog.value = true;
}

function cancelarSesion() {
  Object.assign(sesionActual, { id: null, date: '', observation: '', treatment: '' });
  showSesionDialog.value = false;
}

async function guardarSesion() {
  if (!sesionActual.date) return;
  try {
    const payload = {
      observation: sesionActual.observation,
      treatment: sesionActual.treatment,
      date: sesionActual.date
    };
    if (sesionActual.id) {
      await SessionsAPI.update(route.params.id, sesionActual.id, payload);
    } else {
      await SessionsAPI.create(route.params.id, payload);
    }
    await fetchSessions(route.params.id);
    cancelarSesion();
    $q.notify({ type: 'positive', message: 'Sesión guardada correctamente', position: 'top' });
  } catch (error) {
    console.error('Error saving session:', error);
    $q.notify({ type: 'negative', message: 'Error al guardar la sesión', position: 'top' });
  }
}

function confirmarEliminarSesion(row) {
  $q.dialog({
    title: 'Confirmar Eliminación',
    message: `¿Estás seguro de que deseas eliminar la sesión del ${formatDate(row.date)}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await SessionsAPI.remove(route.params.id, row.id);
      await fetchSessions(route.params.id);
      $q.notify({ type: 'positive', message: 'Sesión eliminada correctamente', position: 'top' });
    } catch (error) {
      console.error('Error al eliminar la sesión:', error);
      $q.notify({ type: 'negative', message: 'Error al eliminar la sesión', position: 'top' });
    }
  });
}

async function fetchSessions(id) {
  try {
    const response = await SessionsAPI.list(id);
    sesiones.value = response.data || [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    $q.notify({ type: 'negative', message: 'Error al cargar sesiones', position: 'top' });
  }
}

async function addSession() {
  try {
    await axios.put(`${PATIENTS_URL}/${route.params.id}`, patientEdit);

    Object.assign(patient, patientEdit);
    // Show success message
    $q.notify({
      type: 'positive',
      message: 'Paciente actualizado correctamente',
      position: 'top'
    });
    editing.value = false;
  } catch (error) {
    console.error('Error al actualizar el paciente:', error);

    // Show error message
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar el paciente',
      position: 'top'
    });
  }
}

const datosOriginalesAntecedentes = {
  intervenciones: '',
  rellenos: '',
  alergias: '',
  enfermedades: '',
  medicamentos: '',
  habitos: '',
  cutaneas: '',
  familiares: '',
  id: null
};
const datosOriginalesObservacion = {
  motivo: '', biotipo: '', fototipo: '', recomendaciones: ''
};
const datosOriginalesLesion = {
  inicio: '', lugar: '', sintomas: '', evolucion: '', cambios: '', factores: '', tratamientos: ''
};
const datosOriginalesApoyo = {
  rutinaActual: '',
  rutinaDia: '',
  rutinaNoche: '',
  rutinaSemanal: '',
  recomendaciones: ''
};

const antecedentes = reactive({ ...datosOriginalesAntecedentes });
const antecedentesBackup = reactive({ ...datosOriginalesAntecedentes });
const observacion = reactive({ ...datosOriginalesObservacion });
const observacionBackup = reactive({ ...datosOriginalesObservacion });
const lesion = reactive({ ...datosOriginalesLesion });
const lesionBackup = reactive({ ...datosOriginalesLesion });
const apoyo = reactive({ ...datosOriginalesApoyo });
const apoyoBackup = reactive({ ...datosOriginalesApoyo });

onMounted(async () => {
  if (route.params.id) {
    await findPatientById(route.params.id);
    await fetchMedicalHistory(route.params.id);
    await fetchDiagnostics(route.params.id);
    await fetchHomeSupports(route.params.id);
    await fetchRoutine(route.params.id);
    await fetchSessions(route.params.id);
  }
});

function cargarDatosPaciente(data) {
  Object.assign(antecedentes, data.antecedentes);
  Object.assign(antecedentesBackup, data.antecedentes);
  Object.assign(observacion, data.observacion);
  Object.assign(observacionBackup, data.observacion);
  Object.assign(lesion, data.lesion);
  Object.assign(lesionBackup, data.lesion);
  Object.assign(apoyo, data.apoyo);
  Object.assign(apoyoBackup, data.apoyo);
}

function findPatientById(id) {
  const patientUrl = `${PATIENTS_URL}/${id}`;
  return axios.get(patientUrl)
    .then(response => {
      console.log(response.data);
      patient.id = response.data.id;
      patient.name = response.data.name;
      patient.last_name = response.data.last_name;
      patient.birth_date = response.data.birth_date || response.data.birthDate || response.data.fechaNacimiento || response.data.bith_date;
      patient.address = response.data.address;
      patient.locality = response.data.locality;
      patient.phone = response.data.phone;
      patient.cellphone = response.data.cellphone;
      patient.email = response.data.email;
      patient.additional_note = response.data.additional_note || '';
      patient.profile_picture = response.data.profile_picture || '';

      Object.assign(patientEdit, patient);
    })
    .catch(error => {
      console.error('Error al buscar paciente:', error);
      $q.notify({
        type: 'negative',
        message: 'El paciente no existe',
        position: 'top'
      });
      router.push('/pacientes');
      throw error;
    });
}

async function fetchMedicalHistory(id) {
  try {
    const response = await axios.get(`${PATIENTS_URL}/${id}${MEDICAL_HISTORY_ENDPOINT}`);
    console.log('Medical history:', response.data);

    const mappedData = {
      intervenciones: response.data.surgicalIntervention,
      rellenos: response.data.aestheticFilling,
      alergias: response.data.allergy,
      enfermedades: response.data.disease,
      medicamentos: response.data.medication,
      habitos: response.data.habit,
      cutaneas: response.data.skinDiseaseHistory,
      familiares: response.data.familyHistory,
      id: response.data.id
    };

    Object.assign(antecedentes, mappedData);
    Object.assign(antecedentesBackup, mappedData);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('Medical history not found (404), assuming empty.');
      return;
    }
    console.error('Error fetching medical history:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar antecedentes médicos',
      position: 'top'
    });
  }
}

async function fetchHomeSupports(id) {
  try {
    const response = await axios.get(`${PATIENTS_URL}/${id}${HOME_SUPPORTS_ENDPOINT}`);
    console.log('Home supports:', response.data);

    const mappedData = {
      rutinaActual: response.data.current_routine || '',
      rutinaDia: response.data.day_routine || '',
      rutinaNoche: response.data.night_routine || '',
      rutinaSemanal: response.data.weekly_routine || '',
      recomendaciones: response.data.recommendations || ''
    };

    Object.assign(apoyo, mappedData);
    Object.assign(apoyoBackup, mappedData);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('Home supports not found (404), assuming empty.');
      return;
    }
    console.error('Error fetching home supports:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar apoyo domiciliario',
      position: 'top'
    });
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  // Ensure we are working with a string
  const str = String(dateString).trim();
  // Take only the first 10 characters (YYYY-MM-DD)
  const datePart = str.substring(0, 10);

  // Check if it matches YYYY-MM-DD
  if (datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  }

  return dateString;
}

function resetAntecedentes() {
  Object.assign(antecedentes, antecedentesBackup);
}

async function guardarAntecedentes() {
  try {
    const payload = {
      id: antecedentes.id,
      surgicalIntervention: antecedentes.intervenciones,
      aestheticFilling: antecedentes.rellenos,
      allergy: antecedentes.alergias,
      disease: antecedentes.enfermedades,
      medication: antecedentes.medicamentos,
      habit: antecedentes.habitos,
      skinDiseaseHistory: antecedentes.cutaneas,
      familyHistory: antecedentes.familiares
    };

    await axios.patch(`${PATIENTS_URL}/${route.params.id}${MEDICAL_HISTORY_ENDPOINT}`, payload);

    Object.assign(antecedentesBackup, antecedentes);
    $q.notify({
      type: 'positive',
      message: 'Antecedentes guardados correctamente',
      position: 'top'
    });
  } catch (error) {
    console.error('Error saving medical history:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar antecedentes',
      position: 'top'
    });
  }
}

function resetObservaciones() {
  Object.assign(observacion, observacionBackup);
  Object.assign(lesion, lesionBackup);
}

async function fetchDiagnostics(id) {
  try {
    const response = await axios.get(`${PATIENTS_URL}/${id}${DIAGNOSTICS_ENDPOINT}`);
    console.log('Diagnostics:', response.data);

    const mappedObservacion = {
      motivo: response.data.reasonForConsultation || '',
      biotipo: response.data.skinBiotype || '',
      fototipo: response.data.phototype || '',
      recomendaciones: response.data.recommendations || ''
    };

    Object.assign(observacion, mappedObservacion);
    Object.assign(observacionBackup, mappedObservacion);

    if (response.data.skinLesion) {
      const mappedLesion = {
        inicio: response.data.skinLesion.onset || '',
        lugar: response.data.skinLesion.onsetLocation || '',
        sintomas: response.data.skinLesion.symptoms || '',
        evolucion: response.data.skinLesion.evolution || '',
        cambios: response.data.skinLesion.changes || '',
        factores: response.data.skinLesion.riskIncreasingFactors || '',
        tratamientos: response.data.skinLesion.postTreatment || ''
      };

      Object.assign(lesion, mappedLesion);
      Object.assign(lesionBackup, mappedLesion);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('Diagnostics not found (404), assuming empty.');
      return;
    }
    console.error('Error fetching diagnostics:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar observaciones',
      position: 'top'
    });
  }
}

async function guardarObservaciones() {
  try {
    const payload = {
      reasonForConsultation: observacion.motivo,
      skinBiotype: observacion.biotipo,
      phototype: observacion.fototipo ? String(observacion.fototipo) : '',
      recommendations: observacion.recomendaciones,
      skinLesion: {
        onset: lesion.inicio,
        onsetLocation: lesion.lugar,
        symptoms: lesion.sintomas,
        evolution: lesion.evolucion,
        changes: lesion.cambios,
        riskIncreasingFactors: lesion.factores,
        postTreatment: lesion.tratamientos
      }
    };

    await axios.patch(`${PATIENTS_URL}/${route.params.id}${DIAGNOSTICS_ENDPOINT}`, payload);

    Object.assign(observacionBackup, observacion);
    Object.assign(lesionBackup, lesion);
    $q.notify({
      type: 'positive',
      message: 'Observaciones guardadas correctamente',
      position: 'top'
    });
  } catch (error) {
    console.error('Error saving diagnostics:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar observaciones',
      position: 'top'
    });
  }
}

function resetApoyo() {
  Object.assign(apoyo, apoyoBackup);
}

async function guardarApoyo() {
  try {
    const payload = {
      current_routine: apoyo.rutinaActual,
      day_routine: apoyo.rutinaDia,
      night_routine: apoyo.rutinaNoche,
      weekly_routine: apoyo.rutinaSemanal,
      recommendations: apoyo.recomendaciones
    };

    await axios.patch(`${PATIENTS_URL}/${route.params.id}${HOME_SUPPORTS_ENDPOINT}`, payload);

    Object.assign(apoyoBackup, apoyo);
    $q.notify({
      type: 'positive',
      message: 'Apoyo domiciliario guardado correctamente',
      position: 'top'
    });
  } catch (error) {
    console.error('Error saving home supports:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar apoyo domiciliario',
      position: 'top'
    });
  }
}

// ─── Rutina Facial (endpoint propio /routines) ───
const routineState = reactive({
  daySteps: '',
  nightSteps: '',
  notes: ''
});

async function fetchRoutine(id) {
  try {
    const response = await axios.get(`${PATIENTS_URL}/${id}${ROUTINES_ENDPOINT}`);
    console.log('Routine:', response.data);
    routineState.daySteps = response.data.daySteps || '';
    routineState.nightSteps = response.data.nightSteps || '';
    routineState.notes = response.data.notes || '';
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('Routine not found (404), assuming empty.');
      return;
    }
    console.error('Error fetching routine:', error);
  }
}

const mappedRoutine = computed(() => {
  // Si no hay datos guardados en el backend, retornamos null para que
  // RoutineGenerator mantenga sus valores por defecto
  if (!routineState.daySteps && !routineState.nightSteps && !routineState.notes) {
    return null;
  }

  let day = [];
  let night = [];
  try {
    day = routineState.daySteps ? JSON.parse(routineState.daySteps) : [];
  } catch (e) {
    console.warn('Error parsing day steps JSON', e);
  }
  try {
    night = routineState.nightSteps ? JSON.parse(routineState.nightSteps) : [];
  } catch (e) {
    console.warn('Error parsing night steps JSON', e);
  }

  return {
    day,
    night,
    notes: routineState.notes,
    patientName: `${patient.name} ${patient.last_name}`.trim()
  };
});

async function handleRoutineSave(routineData) {
  try {
    const payload = {
      daySteps: JSON.stringify(routineData.day || []),
      nightSteps: JSON.stringify(routineData.night || []),
      notes: routineData.notes || ''
    };

    await axios.patch(`${PATIENTS_URL}/${route.params.id}${ROUTINES_ENDPOINT}`, payload);

    // Actualizar estado local
    routineState.daySteps = payload.daySteps;
    routineState.nightSteps = payload.nightSteps;
    routineState.notes = payload.notes;

    $q.notify({
      type: 'positive',
      message: 'Rutina guardada correctamente',
      position: 'top'
    });
  } catch (error) {
    console.error('Error saving routine:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar la rutina',
      position: 'top'
    });
  }
}

</script>

<style scoped>
.q-avatar {
  font-size: 48px;
}

.q-card.patient-sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
  align-self: flex-start;
  border-radius: 14px;
  margin-top: 0;
}

.modern-session-modal {
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(60, 60, 120, 0.13);
  background: #f9fafb;
  max-width: 440px;
  width: 100%;
  padding: 0 0 8px 0;
  border: 1px solid #ececec;
  transition: box-shadow 0.2s;
}

.minimal-modal-header {
  padding: 24px 24px 0 24px;
  background: transparent;
}

.minimal-title {
  font-weight: 600;
  letter-spacing: 0.01em;
}

.minimal-close {
  color: #b0b3b8;
  transition: color 0.15s;
}

.minimal-close:hover {
  color: #1976d2;
}

.minimal-modal-body {
  padding: 12px 24px 0 24px;
}

.minimal-input {
  background: #f8fafc !important;
  border-radius: 12px;
  border: 1px solid #e0e4ea !important;
  box-shadow: none !important;
  font-size: 16px;
  padding: 4px 12px;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.minimal-input:focus-within {
  border-color: #1976d2 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
}

.minimal-actions {
  padding: 12px 24px 16px 24px !important;
  background: transparent;
}

.minimal-btn,
.minimal-btn-save {
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  min-width: 90px;
  box-shadow: none;
  text-transform: none;
}

.minimal-btn-save {
  background: #1976d2;
  color: #fff;
  transition: background 0.15s;
}

.minimal-btn-save:hover {
  background: #125ea7;
}

.fototipo-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  font-weight: bold;
  font-size: 16px;
  user-select: none;
}

.fototipo-selected {
  transform: scale(1.15);
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2) !important;
  z-index: 10;
}

.minimal-lesion-card {
  border-radius: 14px;
  border: 1px solid #ececec;
}

.hidden {
  display: none;
}

.avatar-clickable {
  cursor: pointer;
  position: relative;
  transition: transform 0.15s;
}

.avatar-clickable:hover {
  transform: scale(1.05);
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 50% 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-clickable:hover .avatar-overlay {
  opacity: 1;
}

.crop-dialog-card {
  border-radius: 16px;
  min-width: 320px;
  max-width: 400px;
}

.crop-container {
  cursor: grab;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}

.crop-container:active {
  cursor: grabbing;
}
</style>
