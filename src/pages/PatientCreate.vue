<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5">Nuevo Paciente</div>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <q-card class="q-pa-md q-pa-sm-xl minimal-create-card">
          <q-form @submit.prevent="createPatient">
            <div class="row q-col-gutter-xl">
              <div class="col-12 col-md-4 flex flex-center column">
                <q-avatar size="110px" class="q-mb-md avatar-clickable" @click="seleccionarFoto">
                  <img v-if="previewFoto" :src="previewFoto" alt="Foto de perfil"/>
                  <q-icon v-else name="person" size="80px" color="grey-5"/>
                  <div class="avatar-overlay">
                    <q-icon name="photo_camera" size="28px" color="white"/>
                  </div>
                </q-avatar>
                <div class="text-caption text-grey-6 q-mt-xs">Click para cargar foto</div>
                <input ref="inputFoto" type="file" accept="image/*" class="hidden" @change="onFotoSelected"/>
              </div>
              <div class="col-12 col-md-8">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input v-model="patient.name" label="Nombre" class="minimal-input q-mb-md" borderless dense
                             autofocus/>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="patient.last_name" label="Apellido" class="minimal-input q-mb-md" borderless
                             dense/>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="patient.birth_date" label="Fecha de nacimiento"
                             class="minimal-input q-mb-md" borderless dense type="date"/>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="patient.address" label="Domicilio" class="minimal-input q-mb-md" borderless
                             dense/>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="patient.locality" label="Localidad" class="minimal-input q-mb-md" borderless
                             dense/>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="patient.phone" label="Teléfono" class="minimal-input q-mb-md" borderless
                             dense/>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="patient.cellphone" label="Celular" class="minimal-input q-mb-md" borderless dense/>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="patient.email" label="E-Mail" class="minimal-input q-mb-md" borderless dense/>
                  </div>
                  <div class="col-12">
                    <q-input v-model="patient.additional_note" type="textarea" label="Nota adicional" class="minimal-input q-mb-md" borderless autogrow maxlength="200" counter/>
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 60px;"></div>
          </q-form>
        </q-card>
      </div>
    </div>

    <!-- Floating Save Buttons -->
    <q-page-sticky position="bottom" :offset="[0, 16]" style="z-index: 100;">
      <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
        <q-card class="bg-white shadow-up-3 q-pa-xs row items-center justify-between" 
                style="border-radius: 30px; border: 1px solid #e0e4ea; min-width: 250px;">
          <q-btn flat round dense icon="close" @click="cancel" color="grey-7" class="q-ml-xs" />
          <q-btn label="Confirmar" rounded color="primary" @click="createPatient" class="q-px-md minimal-btn-save" />
        </q-card>
      </transition>
    </q-page-sticky>
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
import {ref, nextTick} from 'vue';
import {useRouter} from 'vue-router';
import axios from 'axios';
import {useQuasar} from 'quasar';
import {PATIENTS_URL} from "../services/api";

const router = useRouter();
const patient = ref({
  name: '',
  last_name: '',
  birth_date: '',
  address: '',
  locality: '',
  phone: '',
  cellphone: '',
  email: '',
  additional_note: '',
  profile_picture: null
});
const inputFoto = ref(null);
const previewFoto = ref('');
const loading = ref(false);
const $q = useQuasar();

// Crop state
const showCropDialog = ref(false);
const cropCanvas = ref(null);
const cropContainer = ref(null);
const cropZoom = ref(1);
const cropImage = ref(null); // HTMLImageElement
const cropOffset = ref({x: 0, y: 0});
const dragging = ref(false);
const dragStart = ref({x: 0, y: 0});

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
  // Reset input so same file can be re-selected
  e.target.value = '';
}

function drawCrop() {
  const canvas = cropCanvas.value;
  if (!canvas || !cropImage.value) return;
  const ctx = canvas.getContext('2d');
  const size = 250;
  ctx.clearRect(0, 0, size, size);

  // Draw circular clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, size, size);

  const img = cropImage.value;
  const zoom = cropZoom.value;
  // Fit image to canvas then apply zoom
  const scale = Math.max(size / img.width, size / img.height) * zoom;
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (size - w) / 2 + cropOffset.value.x;
  const y = (size - h) / 2 + cropOffset.value.y;

  ctx.drawImage(img, x, y, w, h);
  ctx.restore();

  // Draw circle border
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

function endDrag() {
  dragging.value = false;
}

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
  previewFoto.value = base64;
  patient.value.profile_picture = base64;
  showCropDialog.value = false;
  cropImage.value = null;
}

async function createPatient() {
  loading.value = true;
  try {
    const response = await axios.post(PATIENTS_URL, patient.value);
    $q.notify({
      type: 'positive',
      message: 'Paciente creado',
      caption: 'Paciente creado exitosamente'
    });
    router.push(`/pacientes/${response.data.id}`);
  } catch (error) {
    console.error('Error creating patient:', error);
    $q.notify({
      type: 'negative',
      message: 'No se pudo crear el paciente',
      caption: (error && (error.response?.data?.message || error.message)) || 'Error desconocido'
    });
  } finally {
    loading.value = false;
  }
}

function cancel() {
  router.push('/pacientes');
}
</script>

<style scoped>
.minimal-create-card {
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #ececec;
  max-width: 900px;
  width: 100%;
  margin: auto;
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

.hidden {
  display: none;
}

.minimal-btn, .minimal-btn-save {
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

.avatar-clickable {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
}

.avatar-clickable:hover {
  transform: scale(1.02);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-clickable:hover .avatar-overlay {
  opacity: 1;
}

.crop-dialog-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
}

.crop-container {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: grab;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.crop-container:active {
  cursor: grabbing;
}
</style>
