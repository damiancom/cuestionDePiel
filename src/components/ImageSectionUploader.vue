<template>
  <div class="image-uploader-card q-pa-md">
    <!-- Título y acción de subida -->
    <div class="row items-center justify-between q-mb-sm">
      <div class="row items-center no-wrap">
        <q-icon :name="icon" :color="accentColor" size="22px" class="q-mr-xs" />
        <div>
          <div class="text-subtitle2 text-weight-bold text-grey-9">{{ title }}</div>
          <div class="text-caption text-grey-6">{{ subtitle }}</div>
        </div>
      </div>
      <q-btn
        unelevated
        size="sm"
        color="primary"
        icon="add_a_photo"
        label="Subir"
        @click="triggerFileInput"
        class="minimal-btn-save"
      />
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="handleFilesSelected"
    />

    <!-- Zona Drag & Drop / Empty State -->
    <div
      v-if="images.length === 0"
      class="dropzone cursor-pointer"
      :class="{ 'dropzone-active': isDragging }"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <q-icon name="cloud_upload" size="40px" color="grey-5" />
      <div class="text-caption text-weight-medium text-grey-8 text-center q-mt-xs">
        Haz clic o arrastra fotos aquí
      </div>
      <div class="text-caption text-grey-5 text-center" style="font-size: 0.72rem;">
        Formatos admitidos: JPG, PNG, WEBP (Luz focalizada)
      </div>
    </div>

    <!-- Lista / Grilla de imágenes subidas -->
    <div v-else class="images-grid q-mt-sm">
      <div
        v-for="(img, idx) in images"
        :key="img.id || idx"
        class="image-thumb-card relative-position"
      >
        <img
          :src="img.url"
          :alt="img.name || 'Foto'"
          class="thumb-image cursor-pointer"
          @click="$emit('preview-image', img)"
        />

        <!-- Overlay con acciones -->
        <div class="thumb-overlay row items-center justify-between q-px-xs">
          <q-btn
            round
            dense
            flat
            size="xs"
            color="white"
            icon="zoom_in"
            @click.stop="$emit('preview-image', img)"
          >
            <q-tooltip>Ampliar imagen</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            flat
            size="xs"
            color="negative"
            icon="delete"
            @click.stop="$emit('remove-image', idx)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </div>

        <div v-if="img.name" class="thumb-label ellipsis text-caption text-grey-8 q-px-xs">
          {{ img.name }}
        </div>
      </div>

      <!-- Botón para añadir más si ya hay fotos -->
      <div
        class="add-more-card flex flex-center cursor-pointer"
        @click="triggerFileInput"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <q-icon name="add" size="24px" color="grey-6" />
        <span class="text-caption text-grey-7 q-mt-xs">Agregar</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Registro Fotográfico'
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'photo_camera'
  },
  accentColor: {
    type: String,
    default: 'primary'
  },
  images: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['add-image', 'remove-image', 'preview-image']);

const fileInputRef = ref(null);
const isDragging = ref(false);

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

function handleFilesSelected(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  processFiles(Array.from(files));
  event.target.value = '';
}

function handleDrop(event) {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return;
  processFiles(Array.from(files));
}

function processFiles(filesList) {
  filesList.forEach((file) => {
    if (!file.type.startsWith('image/')) return;

    // Convertir a Data URL para previsualizar y persistir localmente de forma simple
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageObj = {
        id: 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        url: e.target.result,
        name: file.name,
        size: file.size,
        date: new Date().toISOString()
      };
      emit('add-image', imageObj);
    };
    reader.readAsDataURL(file);
  });
}
</script>

<style scoped>
.image-uploader-card {
  background-color: #faf9f7;
  border: 1px dashed #d5cec5;
  border-radius: 8px;
  height: 100%;
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cfc7bc;
  border-radius: 8px;
  background-color: #ffffff;
  min-height: 140px;
  padding: 20px 16px;
  transition: all 0.2s ease;
}

.dropzone:hover,
.dropzone-active {
  border-color: #1976d2;
  background-color: #f4f8fd;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
}

.image-thumb-card {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #ddd;
  background-color: #000;
  display: flex;
  flex-direction: column;
}

.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.thumb-image:hover {
  transform: scale(1.05);
}

.thumb-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.65), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}

.image-thumb-card:hover .thumb-overlay {
  opacity: 1;
}

.thumb-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 0.65rem;
  background: rgba(255, 255, 255, 0.85);
  line-height: 1.3;
}

.add-more-card {
  aspect-ratio: 1;
  border: 1px dashed #bbb;
  border-radius: 6px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.add-more-card:hover {
  border-color: #1976d2;
  background-color: #f0f7ff;
}

.hidden {
  display: none;
}
</style>
