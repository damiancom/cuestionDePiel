<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @show="onDialogOpen"
    @hide="onDialogHide"
  >
    <q-card class="camera-dialog-card column no-wrap bg-grey-10 text-white">
      <!-- Barra superior con controles y personalización -->
      <div class="row items-center justify-between q-px-md q-py-sm bg-black-transparent z-top">
        <div class="row items-center q-gutter-sm">
          <q-icon name="document_scanner" size="24px" color="primary" />
          <div>
            <div class="text-subtitle1 text-weight-bold leading-tight">Escáner de Productos</div>
            <div class="text-caption text-grey-4 row items-center no-wrap">
              <span class="live-dot q-mr-xs" :class="{ 'live-dot--active': liveScanEnabled && cameraActive && !matchedProduct }"></span>
              {{ liveScanEnabled ? (isProcessing ? 'Analizando en vivo...' : 'Enfocá el producto') : 'Modo manual' }}
            </div>
          </div>
        </div>

        <div class="row items-center q-gutter-xs">
          <!-- Control de Zoom si el dispositivo lo soporta -->
          <q-btn v-if="hasZoomSupport" flat round dense icon="zoom_in" color="white">
            <q-tooltip>Zoom de cámara</q-tooltip>
            <q-menu anchor="bottom right" self="top right" class="bg-grey-9 text-white q-pa-md" style="min-width: 200px;">
              <div class="text-caption text-grey-3 row justify-between q-mb-xs">
                <span>Zoom</span>
                <span>{{ currentZoom.toFixed(1) }}x</span>
              </div>
              <q-slider
                v-model="currentZoom"
                :min="zoomRange.min"
                :max="zoomRange.max"
                :step="0.1"
                color="primary"
                @update:model-value="applyZoom"
              />
            </q-menu>
          </q-btn>

          <!-- Linterna si está disponible -->
          <q-btn
            v-if="hasTorchSupport"
            flat
            round
            dense
            :color="torchActive ? 'amber' : 'white'"
            :icon="torchActive ? 'flashlight_on' : 'flashlight_off'"
            @click="toggleTorch"
          >
            <q-tooltip>Linterna</q-tooltip>
          </q-btn>

          <!-- Cambiar cámara si hay varias -->
          <q-btn
            v-if="hasMultipleCameras"
            flat
            round
            dense
            color="white"
            icon="cameraswitch"
            @click="switchCamera"
          >
            <q-tooltip>Cambiar cámara</q-tooltip>
          </q-btn>

          <!-- Cerrar -->
          <q-btn flat round dense icon="close" color="white" v-close-popup />
        </div>
      </div>

      <!-- Área de Cámara y Visor -->
      <div class="col relative-position overflow-hidden flex flex-center camera-viewport">
        <!-- Video Stream en vivo -->
        <video
          ref="videoRef"
          playsinline
          autoplay
          muted
          class="camera-video"
          @playing="cameraActive = true"
          @loadedmetadata="cameraActive = true"
        ></video>

        <!-- Canvas oculto para captura y recorte OCR -->
        <canvas ref="canvasRef" style="display: none;"></canvas>

        <!-- Error de cámara -->
        <div v-if="cameraError" class="q-pa-lg text-center z-top camera-error-box">
          <q-icon name="videocam_off" size="56px" color="negative" class="q-mb-md" />
          <div class="text-h6 text-negative q-mb-sm">No se pudo acceder a la cámara</div>
          <div class="text-caption text-grey-4 q-mb-lg">{{ cameraError }}</div>
          <div class="row justify-center q-gutter-sm">
            <q-btn outline color="white" label="Reintentar" icon="refresh" @click="startCamera" />
            <q-btn color="primary" label="Subir foto de etiqueta" icon="upload_file" @click="triggerFileInput" />
          </div>
        </div>

        <!-- Marco de encuadre pantalla completa fijo (siempre visible si no hay match) -->
        <div
          v-if="!matchedProduct"
          class="scanner-overlay z-top"
        >
          <div class="scanner-frame" ref="scannerFrameRef">
            <div class="corner corner-tl"></div>
            <div class="corner corner-tr"></div>
            <div class="corner corner-bl"></div>
            <div class="corner corner-br"></div>
            
            <!-- Línea láser animada continua -->
            <div class="scanner-laser" :class="{ 'scanner-laser--fast': isProcessing }"></div>
          </div>

          <div class="scanner-instruction text-center q-mt-md row items-center justify-center no-wrap">
            <q-spinner-dots v-if="isProcessing" color="primary" size="18px" class="q-mr-xs" />
            <q-icon v-else name="center_focus_strong" size="18px" color="primary" class="q-mr-xs" />
            <span>{{ instructionText }}</span>
          </div>
        </div>

        <!-- RESULTADO: Producto Encontrado en Tiempo Real -->
        <transition name="q-transition--slide-up">
          <div v-if="matchedProduct" class="product-result-card-container z-top full-width q-pa-md">
            <q-card class="product-result-card bg-white text-dark shadow-10">
              <q-card-section class="q-pb-none">
                <div class="row items-center justify-between no-wrap">
                  <q-badge color="positive" class="q-px-sm q-py-xs text-weight-bold">
                    <q-icon name="check_circle" size="14px" class="q-mr-xs" />
                    {{ matchConfidenceLabel }}
                  </q-badge>
                  <q-btn flat round dense icon="close" size="sm" color="grey-7" @click="clearMatchAndResume" />
                </div>

                <!-- Marca y Nombre -->
                <div class="text-overline text-primary q-mt-xs">{{ matchedProduct.brand_name }}</div>
                <div class="text-h6 text-weight-bold line-clamp-2">{{ matchedProduct.name }}</div>

                <div v-if="matchedProduct.category_name || matchedProduct.function_name" class="row q-gutter-xs q-mt-xs">
                  <q-badge v-if="matchedProduct.category_name" color="blue-grey-1" text-color="blue-grey-8">
                    {{ matchedProduct.category_name }}
                  </q-badge>
                  <q-badge v-if="matchedProduct.function_name" color="teal-1" text-color="teal-8">
                    {{ matchedProduct.function_name }}
                  </q-badge>
                </div>
              </q-card-section>

              <q-separator class="q-my-sm" />

              <q-card-section class="q-pt-none q-pb-sm">
                <!-- Grid de Datos Clave: Precio, Vcto, Stock -->
                <div class="row q-col-gutter-sm items-stretch">
                  <!-- Precio de Venta -->
                  <div class="col-4">
                    <div class="data-box bg-blue-1 text-center q-pa-sm rounded-borders full-height flex column justify-center">
                      <div class="text-caption text-grey-8 text-weight-medium">PRECIO</div>
                      <div class="text-h6 text-weight-bolder text-primary">
                        {{ matchedProduct.selling_price != null ? '$' + formatPrice(matchedProduct.selling_price) : '—' }}
                      </div>
                    </div>
                  </div>

                  <!-- Stock con controles rápidos -->
                  <div class="col-4">
                    <div class="data-box bg-grey-2 text-center q-pa-sm rounded-borders full-height flex column justify-center">
                      <div class="text-caption text-grey-8 text-weight-medium">STOCK</div>
                      <div class="row items-center justify-center no-wrap q-mt-xs">
                        <q-btn
                          flat
                          dense
                          round
                          icon="remove"
                          size="xs"
                          color="primary"
                          :disable="!matchedProduct.stock || matchedProduct.stock <= 0"
                          @click="modifyStock(matchedProduct, -1)"
                        />
                        <span class="q-px-xs text-weight-bold text-subtitle1" :class="stockColorClass(matchedProduct.stock)">
                          {{ matchedProduct.stock ?? 0 }}
                        </span>
                        <q-btn
                          flat
                          dense
                          round
                          icon="add"
                          size="xs"
                          color="primary"
                          @click="modifyStock(matchedProduct, 1)"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Fecha de Vencimiento -->
                  <div class="col-4">
                    <div class="data-box bg-grey-2 text-center q-pa-sm rounded-borders full-height flex column justify-center">
                      <div class="text-caption text-grey-8 text-weight-medium">VTO.</div>
                      <div class="text-subtitle2 text-weight-bold q-mt-xs" :class="expClass(matchedProduct.expiration_date)">
                        {{ matchedProduct.expiration_date || '—' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Otras posibles coincidencias -->
                <div v-if="alternativeMatches.length > 0" class="q-mt-sm">
                  <div class="text-caption text-grey-7 q-mb-xs">¿Buscabas alguno de estos?</div>
                  <div class="row q-gutter-xs">
                    <q-chip
                      v-for="alt in alternativeMatches"
                      :key="alt.id"
                      clickable
                      dense
                      outline
                      color="grey-8"
                      @click="selectAlternative(alt)"
                    >
                      {{ alt.brand_name }} - {{ alt.name }}
                    </q-chip>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="between" class="q-px-md q-py-sm">
                <q-btn flat color="grey-8" icon="refresh" label="Escanear otro" @click="clearMatchAndResume" />
                <q-btn color="primary" icon="edit" label="Ver / Editar" @click="handleEditProduct(matchedProduct)" />
              </q-card-actions>
            </q-card>
          </div>
        </transition>

        <!-- Notificación sutil flotante si el modo manual no encuentra nada -->
        <transition name="q-transition--fade">
          <div v-if="manualNoMatch && !isProcessing && !matchedProduct" class="no-match-pill z-top">
            <q-chip color="dark" text-color="amber-4" icon="search_off">
              No se reconoció el producto. Enfocá la marca y nombre de la etiqueta.
            </q-chip>
          </div>
        </transition>
      </div>

      <!-- Barra inferior -->
      <div class="bg-black q-pa-md z-top">
        <div class="row items-center justify-around max-width-container q-mx-auto">
          <!-- Galería / Subir foto -->
          <q-btn
            round
            flat
            color="white"
            icon="photo_library"
            size="md"
            @click="triggerFileInput"
          >
            <q-tooltip>Cargar foto de galería</q-tooltip>
          </q-btn>

          <!-- Indicador central de validación en vivo activa -->
          <div class="column items-center">
            <q-btn
              round
              :color="isProcessing ? 'amber-9' : 'primary'"
              :icon="isProcessing ? 'radar' : 'motion_photos_on'"
              size="22px"
              class="capture-btn shadow-5"
              @click="handleMainButtonClick"
            >
              <q-tooltip>Validando en vivo (clic para forzar lectura inmediata)</q-tooltip>
            </q-btn>
            <div class="text-caption text-grey-4 q-mt-xs">
              Validando en vivo
            </div>
          </div>

          <!-- Input oculto para subir archivo/foto -->
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            capture="environment"
            style="display: none;"
            @change="handleFileUpload"
          />

          <!-- Botón de linterna / flash si el dispositivo lo soporta -->
          <q-btn
            v-if="hasTorchSupport"
            round
            flat
            :color="torchActive ? 'amber' : 'white'"
            :icon="torchActive ? 'flashlight_on' : 'flashlight_off'"
            size="md"
            @click="toggleTorch"
          >
            <q-tooltip>Linterna</q-tooltip>
          </q-btn>
          <div v-else style="width: 42px;"></div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { createWorker } from 'tesseract.js';
import { RecommendedProductsAPI } from '../services/api';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  products: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'edit-product', 'stock-changed']);

const $q = useQuasar();

// Elementos del DOM
const videoRef = ref(null);
const canvasRef = ref(null);
const fileInputRef = ref(null);
const scannerFrameRef = ref(null);

// Configuración fija
const liveScanEnabled = true; // Escaneo en tiempo real fijo
const frameFormat = 'fullscreen'; // Fijo: pantalla completa
const detectionSensitivity = 'strict'; // Fijo: sensibilidad precisa

// Estados de cámara
const cameraActive = ref(false);
const cameraError = ref(null);
const stream = ref(null);
const currentFacingMode = ref('environment');
const hasMultipleCameras = ref(false);
const hasTorchSupport = ref(false);
const torchActive = ref(false);
let videoTrack = null;

// Zoom de hardware si está soportado
const hasZoomSupport = ref(false);
const zoomRange = ref({ min: 1, max: 5 });
const currentZoom = ref(1);

// Estados de OCR y Búsqueda
const isProcessing = ref(false);
const matchedProduct = ref(null);
const matchConfidenceLabel = ref('Detectado');
const alternativeMatches = ref([]);
const manualNoMatch = ref(false);

// Worker reutilizable de Tesseract
let tesseractWorker = null;
let isWorkerInitializing = false;

// Texto de instrucción dinámico
const instructionText = computed(() => {
  if (isProcessing.value) {
    return 'Analizando texto en el envase...';
  }
  return 'Apuntá la cámara al producto para escanearlo';
});

// Control de sesiones para evitar condiciones de carrera entre aperturas y cierres
let currentSessionId = 0;

// Inicialización de Tesseract Worker con auto-recuperación
async function getOrCreateWorker() {
  if (tesseractWorker) return tesseractWorker;
  if (isWorkerInitializing) {
    while (isWorkerInitializing) {
      await new Promise(r => setTimeout(r, 60));
    }
    if (tesseractWorker) return tesseractWorker;
  }

  isWorkerInitializing = true;
  try {
    const worker = await createWorker(['spa', 'eng'], undefined, {
      logger: () => {},
    });
    tesseractWorker = worker;
    return worker;
  } catch (err) {
    console.error('Error al inicializar Tesseract Worker:', err);
    tesseractWorker = null;
    throw err;
  } finally {
    isWorkerInitializing = false;
  }
}

// Iniciar cámara con configuraciones de alta calidad
// Watcher directo de apertura/cierre de diálogo para respuesta inmediata
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      onDialogOpen();
    } else {
      onDialogHide();
    }
  }
);

// Iniciar cámara con configuraciones y fallback automático
async function startCamera() {
  cameraError.value = null;
  cameraActive.value = false;
  currentSessionId++;
  const thisSession = currentSessionId;

  try {
    let mediaStream = null;

    // Intentar primero con la cámara preferida y resolución adecuada
    try {
      const constraints = {
        video: {
          facingMode: { ideal: currentFacingMode.value },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (constraintErr) {
      console.warn('No se pudo abrir con constraints específicas, intentando fallback básico de video:', constraintErr);
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    // Si la sesión cambió mientras se esperaba el permiso, cancelar
    if (thisSession !== currentSessionId) {
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
      return;
    }

    // Detener pistas del stream anterior si existía
    if (stream.value) {
      stream.value.getTracks().forEach(t => t.stop());
    }
    stream.value = mediaStream;

    // Enumerar dispositivos de video si está soportado
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        hasMultipleCameras.value = videoDevices.length > 1;
      }
    } catch (_) {}

    // Asegurar que el elemento video esté montado en el DOM
    await nextTick();
    let retries = 0;
    while (!videoRef.value && retries < 25) {
      await new Promise(r => setTimeout(r, 40));
      retries++;
    }

    const video = videoRef.value;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.srcObject = mediaStream;

      try {
        await video.play();
      } catch (playErr) {
        console.warn('Advertencia al reproducir video:', playErr);
      }
      cameraActive.value = true;
    }

    const track = mediaStream.getVideoTracks()[0];
    if (track) {
      videoTrack = track;
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      hasTorchSupport.value = !!capabilities.torch;

      if (capabilities.zoom) {
        hasZoomSupport.value = true;
        zoomRange.value = {
          min: capabilities.zoom.min || 1,
          max: capabilities.zoom.max || 5,
        };
        const settings = track.getSettings ? track.getSettings() : {};
        currentZoom.value = settings.zoom || 1;
      } else {
        hasZoomSupport.value = false;
      }
    }

    // Iniciar bucle de escaneo en tiempo real inmediatamente
    startLiveScanLoop(thisSession);
  } catch (err) {
    console.error('Error al acceder a la cámara:', err);
    let msg = 'No se pudo iniciar la cámara: ' + (err.message || err.name || 'Error desconocido');
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      msg = 'Permiso denegado. Habilitá el permiso de cámara en tu navegador para buscar productos.';
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      msg = 'No se encontró ninguna cámara en este dispositivo.';
    } else if (err.name === 'NotReadableError') {
      msg = 'La cámara está siendo usada por otra aplicación.';
    }
    cameraError.value = msg;
  }
}

// Detener cámara
function stopCamera() {
  currentSessionId++; // Invalida cualquier bucle o proceso en curso
  stopLiveScanLoop();
  isProcessing.value = false;

  if (torchActive.value && videoTrack) {
    try {
      videoTrack.applyConstraints({ advanced: [{ torch: false }] });
    } catch (_) {}
    torchActive.value = false;
  }
  videoTrack = null;
  hasTorchSupport.value = false;
  hasZoomSupport.value = false;

  if (stream.value) {
    stream.value.getTracks().forEach(t => t.stop());
    stream.value = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
  cameraActive.value = false;
}

// Alternar linterna
async function toggleTorch() {
  if (!videoTrack) return;
  try {
    const nextState = !torchActive.value;
    await videoTrack.applyConstraints({
      advanced: [{ torch: nextState }],
    });
    torchActive.value = nextState;
  } catch (e) {
    console.warn('No se pudo alternar la linterna:', e);
  }
}

// Aplicar zoom
async function applyZoom(val) {
  if (!videoTrack) return;
  try {
    await videoTrack.applyConstraints({
      advanced: [{ zoom: val }],
    });
  } catch (e) {
    console.warn('No se pudo aplicar el zoom:', e);
  }
}

// Alternar entre cámara trasera y delantera
function switchCamera() {
  currentFacingMode.value = currentFacingMode.value === 'environment' ? 'user' : 'environment';
  startCamera();
}

// Eventos de apertura y cierre de diálogo
function onDialogOpen() {
  if (cameraActive.value && stream.value) return; // Evitar reinicios redundantes
  isProcessing.value = false;
  matchedProduct.value = null;
  alternativeMatches.value = [];
  manualNoMatch.value = false;
  startCamera();
  getOrCreateWorker().catch(() => {});
}

function onDialogHide() {
  stopCamera();
}

// BUCLE DE VALIDACIÓN EN TIEMPO REAL CONTINUO CON INTERVALO RESILIENTE
let liveScanIntervalId = null;

function startLiveScanLoop(sessionId) {
  stopLiveScanLoop();

  console.log('[Escáner en vivo] Bucle automático activado');

  liveScanIntervalId = setInterval(async () => {
    // Si no está la cámara activa, o ya se encontró un producto, o ya se está procesando un frame, saltar este tick
    if (!cameraActive.value || matchedProduct.value || isProcessing.value) {
      return;
    }

    if (sessionId !== currentSessionId) {
      stopLiveScanLoop();
      return;
    }

    const video = videoRef.value;
    if (!video || !video.videoWidth || !video.videoHeight || video.paused) {
      return;
    }

    // Procesar fotograma en tiempo real
    await processCurrentFrame({ isLiveScan: true, sessionId });
  }, 400);
}

function stopLiveScanLoop() {
  if (liveScanIntervalId) {
    clearInterval(liveScanIntervalId);
    liveScanIntervalId = null;
    console.log('[Escáner en vivo] Bucle automático pausado');
  }
}

// Procesar frame actual (en vivo o manual)
async function processCurrentFrame({ isLiveScan = false, sessionId = currentSessionId } = {}) {
  const video = videoRef.value;
  const canvas = canvasRef.value;
  if (!video || !canvas || isProcessing.value) return;
  if (sessionId !== currentSessionId) return;

  isProcessing.value = true;

  try {
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    if (!videoWidth || !videoHeight) return;

    // Formato pantalla completa: analiza el fotograma completo con alta resolución
    const cropX = 0;
    const cropY = 0;
    const cropWidth = videoWidth;
    const cropHeight = videoHeight;

    // Escalar a resolución óptima nítida para que las letras no se pierdan (hasta 1080px)
    const targetWidth = Math.min(1080, cropWidth);
    const targetHeight = Math.round((cropHeight / cropWidth) * targetWidth);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(
      video,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, targetWidth, targetHeight
    );

    // Si la sesión cambió mientras se dibujaba en canvas, descartar
    if (sessionId !== currentSessionId) return;

    // Reconocimiento OCR
    const worker = await getOrCreateWorker();
    const result = await worker.recognize(canvas);

    if (sessionId !== currentSessionId) return;

    const rawText = result.data.text || '';
    if (rawText.trim().length > 0) {
      console.log('[Escáner OCR] Texto leído:', rawText.trim().replace(/\n/g, ' '));
    }

    // Buscar coincidencia en catálogo
    const match = evaluateMatches(rawText);

    if (match) {
      console.log('[Escáner OCR] Coincidencia encontrada:', match.product.name, match.label);
      matchedProduct.value = match.product;
      matchConfidenceLabel.value = match.label;
      alternativeMatches.value = match.alternatives;
      stopLiveScanLoop();

      // Vibración háptica en móvil
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([60, 40, 60]); } catch (_) {}
      }
    } else if (!isLiveScan) {
      manualNoMatch.value = true;
      setTimeout(() => { manualNoMatch.value = false; }, 3500);
    }
  } catch (err) {
    console.warn('Error en escaneo de frame OCR:', err);
    // Si el worker falló, lo reiniciamos para que el siguiente frame lo recupere
    if (tesseractWorker) {
      try { await tesseractWorker.terminate(); } catch (_) {}
      tesseractWorker = null;
    }
  } finally {
    isProcessing.value = false;
  }
}

// Clic en botón principal inferior
async function handleMainButtonClick() {
  if (liveScanEnabled) {
    // Si ya está en tiempo real, forzar lectura inmediata
    await processCurrentFrame({ isLiveScan: false });
  } else {
    // Modo manual: capturar y reconocer
    await processCurrentFrame({ isLiveScan: false });
  }
}

// Normalización de texto
function normalizeText(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Umbral de coincidencia fijo en modo preciso (score >= 40)
const minScoreThreshold = 40;

// Evaluación inteligente de coincidencias contra la lista de productos
function evaluateMatches(ocrText) {
  const cleanOCR = normalizeText(ocrText);
  if (!cleanOCR || cleanOCR.length < 3) return null;

  const ocrWords = cleanOCR.split(' ').filter(w => w.length > 2);
  const ocrSet = new Set(ocrWords);
  const stopWords = new Set(['con', 'sin', 'para', 'las', 'los', 'del', 'por', 'uso', 'fps', 'spf', 'gel', 'crema', 'solucion']);

  const scoredProducts = [];

  for (const prod of props.products) {
    const brandClean = normalizeText(prod.brand_name || '');
    const nameClean = normalizeText(prod.name || '');

    if (!nameClean && !brandClean) continue;

    let score = 0;
    let brandMatch = false;

    // 1. Marca
    if (brandClean) {
      if (cleanOCR.includes(brandClean)) {
        score += 50;
        brandMatch = true;
      } else {
        const brandWords = brandClean.split(' ').filter(w => w.length > 2);
        let matchedBrandWords = 0;
        for (const bw of brandWords) {
          if (cleanOCR.includes(bw) || ocrSet.has(bw)) {
            matchedBrandWords++;
          } else {
            for (const ow of ocrWords) {
              if (isFuzzyMatch(bw, ow)) {
                matchedBrandWords += 0.85;
                break;
              }
            }
          }
        }
        if (brandWords.length > 0 && matchedBrandWords >= brandWords.length * 0.8) {
          score += 45;
          brandMatch = true;
        } else if (matchedBrandWords > 0) {
          score += (matchedBrandWords / brandWords.length) * 35;
        }
      }
    }

    // 2. Nombre del producto
    const nameWords = nameClean.split(' ').filter(w => w.length > 2 && !stopWords.has(w));
    let matchedNameWords = 0;
    let significantMatchedLetters = 0;

    for (const nw of nameWords) {
      if (cleanOCR.includes(nw) || ocrSet.has(nw)) {
        matchedNameWords++;
        significantMatchedLetters += nw.length;
      } else {
        for (const ow of ocrWords) {
          if (isFuzzyMatch(nw, ow)) {
            matchedNameWords += 0.8;
            significantMatchedLetters += nw.length * 0.8;
            break;
          }
        }
      }
    }

    if (nameWords.length > 0) {
      const nameRatio = matchedNameWords / nameWords.length;
      score += nameRatio * 45;
      score += Math.min(significantMatchedLetters * 1.5, 20);
    }

    if (brandMatch && matchedNameWords >= 1) {
      score += 20;
    }

    // Umbral de coincidencia (score >= minScoreThreshold)
    if (score >= minScoreThreshold) {
      scoredProducts.push({
        product: prod,
        score,
        brandMatch,
        matchedNameWords,
      });
    }
  }

  scoredProducts.sort((a, b) => b.score - a.score);

  if (scoredProducts.length > 0) {
    const top = scoredProducts[0];
    let label = 'Detectado';
    if (top.score >= 65) label = 'Coincidencia Alta';
    else if (top.score >= 40) label = 'Coincidencia';
    else label = 'Posible Coincidencia';

    const alternatives = scoredProducts
      .slice(1, 4)
      .filter(item => item.score >= minScoreThreshold)
      .map(item => item.product);

    return {
      product: top.product,
      label,
      alternatives,
    };
  }

  return null;
}

// Similitud difusa sencilla
function isFuzzyMatch(w1, w2) {
  if (Math.abs(w1.length - w2.length) > 1) return false;
  if (w1.length <= 3) return w1 === w2;

  let diffs = 0;
  let i = 0, j = 0;
  while (i < w1.length && j < w2.length) {
    if (w1[i] !== w2[j]) {
      diffs++;
      if (diffs > 1) return false;
      if (w1.length > w2.length) {
        i++;
        continue;
      } else if (w2.length > w1.length) {
        j++;
        continue;
      }
    }
    i++;
    j++;
  }
  return true;
}

// Limpiar y reanudar escaneo en tiempo real
function clearMatchAndResume() {
  matchedProduct.value = null;
  alternativeMatches.value = [];
  manualNoMatch.value = false;
  startLiveScanLoop(currentSessionId);
}

// Seleccionar alternativa
function selectAlternative(prod) {
  matchedProduct.value = prod;
  matchConfidenceLabel.value = 'Seleccionado';
  alternativeMatches.value = alternativeMatches.value.filter(p => p.id !== prod.id);
}

// Subir foto de galería
function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

async function handleFileUpload(evt) {
  const file = evt.target.files && evt.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      canvas.width = Math.min(800, img.width);
      canvas.height = (img.height / img.width) * canvas.width;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      isProcessing.value = true;
      try {
        const worker = await getOrCreateWorker();
        const result = await worker.recognize(canvas);
        const match = evaluateMatches(result.data.text || '');
        if (match) {
          matchedProduct.value = match.product;
          matchConfidenceLabel.value = match.label;
          alternativeMatches.value = match.alternatives;
        } else {
          manualNoMatch.value = true;
          setTimeout(() => { manualNoMatch.value = false; }, 3500);
        }
      } catch (err) {
        console.error('Error al procesar foto:', err);
      } finally {
        isProcessing.value = false;
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  evt.target.value = '';
}

// Modificar stock rápido
async function modifyStock(prod, delta) {
  const newStock = (prod.stock || 0) + delta;
  if (newStock < 0) return;

  try {
    await RecommendedProductsAPI.update(prod.id, { stock: newStock });
    prod.stock = newStock;
    emit('stock-changed', { id: prod.id, stock: newStock });
    $q.notify({
      color: 'positive',
      message: `Stock: ${newStock}`,
      icon: 'check',
      timeout: 1000,
    });
  } catch (err) {
    console.error('Error al actualizar stock:', err);
    $q.notify({
      color: 'negative',
      message: 'Error al actualizar el stock',
      icon: 'error',
    });
  }
}

// Editar producto
function handleEditProduct(prod) {
  emit('edit-product', prod);
  emit('update:modelValue', false);
}

// Helpers de formato
function formatPrice(val) {
  if (val == null) return '';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? '' : num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function stockColorClass(stock) {
  if (stock == null || stock === 0) return 'text-negative';
  if (stock <= 3) return 'text-warning';
  return 'text-positive';
}

function expClass(dateStr) {
  if (!dateStr) return 'text-grey';
  const [mm, yyyy] = dateStr.split('/');
  if (!mm || !yyyy) return '';
  const exp = new Date(parseInt(yyyy), parseInt(mm) - 1, 1);
  const now = new Date();
  const diffMonths = (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth());
  if (diffMonths < 0) return 'text-negative text-strike';
  if (diffMonths <= 2) return 'text-warning';
  return 'text-positive';
}

onUnmounted(() => {
  stopLiveScanLoop();
  stopCamera();
  if (tesseractWorker) {
    tesseractWorker.terminate().catch(() => {});
    tesseractWorker = null;
  }
});
</script>

<style scoped>
.camera-dialog-card {
  width: 100vw;
  height: 100vh;
  background-color: #111;
}

.bg-black-transparent {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.leading-tight {
  line-height: 1.2;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #757575;
  display: inline-block;
}

.live-dot--active {
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
  animation: pulseLive 1.5s infinite;
}

@keyframes pulseLive {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.camera-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.camera-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.camera-hidden {
  opacity: 0;
}

.camera-error-box {
  position: relative;
  z-index: 25;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 16px;
  max-width: 90%;
  border: 1px solid #444;
}

/* ─── Scanner Overlay y Formatos de Recuadro ─── */
.scanner-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  width: 90%;
  max-width: 520px;
  z-index: 10;
}

.scanner-frame {
  position: relative;
  width: 100%;
  height: 65vh;
  max-height: 540px;
  min-height: 280px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.35);
  border: 1.5px solid rgba(25, 118, 210, 0.35);
  border-radius: 18px;
}

.corner {
  position: absolute;
  width: 28px;
  height: 28px;
  border-color: #1976d2;
  border-style: solid;
}

.corner-tl { top: -2px; left: -2px; border-width: 4px 0 0 4px; border-top-left-radius: 12px; }
.corner-tr { top: -2px; right: -2px; border-width: 4px 4px 0 0; border-top-right-radius: 12px; }
.corner-bl { bottom: -2px; left: -2px; border-width: 0 0 4px 4px; border-bottom-left-radius: 12px; }
.corner-br { bottom: -2px; right: -2px; border-width: 0 4px 4px 0; border-bottom-right-radius: 12px; }

.scanner-laser {
  position: absolute;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #2196f3, #64b5f6, transparent);
  box-shadow: 0 0 10px #2196f3;
  animation: scanAnimation 2.4s infinite ease-in-out;
}

.scanner-laser--fast {
  animation-duration: 1.2s;
  background: linear-gradient(90deg, transparent, #4caf50, #81c784, transparent);
  box-shadow: 0 0 10px #4caf50;
}

@keyframes scanAnimation {
  0% { top: 5%; opacity: 0.2; }
  50% { top: 92%; opacity: 1; }
  100% { top: 5%; opacity: 0.2; }
}

.scanner-instruction {
  background: rgba(0, 0, 0, 0.72);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* ─── Resultado del Producto ─── */
.product-result-card-container {
  position: absolute;
  bottom: 0;
  left: 0;
  max-width: 500px;
  margin: 0 auto;
  right: 0;
}

.product-result-card {
  border-radius: 20px;
  overflow: hidden;
}

.no-match-pill {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.data-box {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.capture-btn {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.capture-btn:active {
  transform: scale(0.95);
}

.max-width-container {
  max-width: 400px;
}
</style>
