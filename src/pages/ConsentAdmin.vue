<template>
  <q-page padding>
    <!-- Encabezado Responsivo -->
    <div class="row items-center justify-between q-mb-md">
      <div class="col-12 col-sm">
        <div class="row items-center no-wrap">
          <q-icon name="gavel" size="24px" color="primary" class="q-mr-sm" style="flex-shrink: 0;" />
          <div class="text-h5 text-primary text-weight-bold ellipsis">
            Consentimiento Informado
          </div>
        </div>
        <div class="text-caption text-grey-7">
          Configuración del texto legal, editor enriquecido y auditoría de versiones
        </div>
      </div>
    </div>

    <!-- Alerta Informativa sobre Sensibilidad Legal y Auditoría (Compacta y Responsiva) -->
    <q-banner rounded class="bg-blue-1 text-primary q-mb-md border-blue q-pa-sm q-pa-sm-md">
      <template #avatar>
        <q-icon name="security" color="primary" size="22px" />
      </template>
      <div class="text-caption text-grey-9">
        <strong>Auditoría de Versiones:</strong> Cada modificación genera automáticamente una <strong>nueva versión inmutable</strong>. Conforme a las normas legales, los pacientes registrados deberán firmar la última versión para que su consentimiento sea considerado vigente.
      </div>
    </q-banner>

    <div class="row q-col-gutter-md">
      <!-- Columna Principal: Editor Enriquecido -->
      <div class="col-12 col-lg-8">
        <q-card class="q-pa-sm q-pa-md-md minimal-card">
          <div class="row items-center justify-between q-mb-md no-wrap">
            <div class="text-subtitle1 text-weight-bold text-grey-9 flex items-center ellipsis">
              <q-icon name="edit_note" color="primary" size="22px" class="q-mr-xs" />
              Editor del Consentimiento
            </div>
            <q-badge
              v-if="activeTemplate"
              color="positive"
              text-color="white"
              class="q-px-sm q-py-xs text-caption text-weight-bold"
              style="flex-shrink: 0;"
            >
              Vigente: v{{ activeTemplate.version }}
            </q-badge>
          </div>
          <q-separator class="q-mb-md" />

          <div class="q-gutter-y-md">
            <q-input
              v-model="form.title"
              label="Título del Documento"
              outlined
              dense
              maxlength="150"
              counter
              class="minimal-input"
            />

            <q-input
              v-model="form.change_reason"
              label="Motivo del Cambio (Requerido para Auditoría)"
              hint="Ej: Actualización de foto-protección, ajuste por nueva normativa..."
              outlined
              dense
              maxlength="255"
              counter
              class="minimal-input"
            />

            <div>
              <div class="row items-center justify-between text-caption text-weight-bold q-mb-xs">
                <span class="text-grey-8">Cuerpo del Consentimiento (Texto Enriquecido):</span>
                <span :class="charCountClass" class="flex items-center">
                  <q-icon :name="isContentTooLong ? 'error' : (contentLength < 50 ? 'warning' : 'check_circle')" size="14px" class="q-mr-xs" />
                  {{ contentLength.toLocaleString() }} / {{ MAX_CONTENT_LENGTH.toLocaleString() }} caracteres
                </span>
              </div>
              <q-editor
                v-model="form.content"
                :min-height="$q.screen.lt.sm ? '220px' : '320px'"
                class="consent-rich-editor"
                :toolbar="editorToolbar"
                @paste="onPasteEditor"
              />
              <div v-if="isContentTooLong" class="text-caption text-negative q-mt-xs flex items-center">
                <q-icon name="error" size="16px" class="q-mr-xs" />
                El texto supera el límite permitido por {{ (contentLength - MAX_CONTENT_LENGTH).toLocaleString() }} caracteres. Debes reducirlo para poder publicar.
              </div>
              <div v-else-if="contentLength > 0 && contentLength < MIN_CONTENT_LENGTH" class="text-caption text-warning q-mt-xs flex items-center">
                <q-icon name="warning" size="16px" class="q-mr-xs" />
                Texto demasiado breve (mínimo {{ MIN_CONTENT_LENGTH }} caracteres para validez legal).
              </div>
            </div>

            <!-- Botones de Acción Responsivos -->
            <div class="row items-center justify-between q-col-gutter-sm q-pt-xs">
              <div class="col-12 col-sm-auto">
                <q-btn
                  flat
                  color="grey-8"
                  icon="restore"
                  label="Restablecer texto vigente"
                  @click="resetToActive"
                  :disable="saving"
                  class="full-width"
                />
              </div>
              <div class="col-12 col-sm-auto">
                <q-btn
                  color="primary"
                  icon="verified"
                  label="Guardar y Publicar Versión"
                  :loading="saving"
                  :disable="saving || isContentTooLong"
                  @click="confirmSaveNewVersion"
                  class="minimal-btn-save full-width"
                />
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Columna Lateral: Resumen de Auditoría y Versiones Anteriores -->
      <div class="col-12 col-lg-4">
        <q-card class="q-pa-sm q-pa-md-md minimal-card q-mb-md">
          <div class="text-subtitle1 text-weight-bold q-mb-xs flex items-center">
            <q-icon name="history_edu" color="primary" class="q-mr-xs" />
            Registro de Auditoría de Versiones
          </div>
          <div class="text-caption text-grey-7 q-mb-md">
            Histórico inmutable de versiones del consentimiento.
          </div>
          <q-separator class="q-mb-md" />

          <q-inner-loading :showing="loadingHistory">
            <q-spinner-dots size="40px" color="primary" />
          </q-inner-loading>

          <div class="q-gutter-y-sm" v-if="history.length > 0">
            <div
              v-for="item in history"
              :key="item.id"
              class="version-card q-pa-sm rounded-borders"
              :class="item.active ? 'version-card-active bg-green-1' : 'bg-grey-1'"
            >
              <!-- Fila 1: Versión, Estado y Fecha -->
              <div class="row items-center justify-between no-wrap q-mb-xs">
                <div class="row items-center q-gutter-xs">
                  <q-badge
                    :color="item.active ? 'positive' : 'grey-7'"
                    text-color="white"
                    class="text-weight-bold q-px-xs"
                  >
                    v{{ item.version }}
                  </q-badge>
                  <q-badge
                    v-if="item.active"
                    outline
                    color="positive"
                    class="text-weight-bold"
                    style="font-size: 10px;"
                  >
                    VIGENTE
                  </q-badge>
                </div>
                <div class="text-caption text-grey-6" style="font-size: 11px;">
                  {{ formatDateTime(item.created_at) }}
                </div>
              </div>

              <!-- Fila 2: Motivo del cambio -->
              <div class="text-caption text-weight-medium text-grey-9 q-mb-xs" style="font-size: 12px; line-height: 1.35;">
                {{ item.change_reason || 'Sin motivo registrado' }}
              </div>

              <!-- Fila 3: Autor y Botón Ver Texto -->
              <div class="row items-center justify-between no-wrap q-mt-xs text-grey-7" style="font-size: 11px;">
                <div>
                  Por: <span class="text-weight-medium text-grey-9">{{ item.created_by || 'Sistema' }}</span>
                </div>
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="primary"
                  icon="visibility"
                  label="Ver texto"
                  @click="previewVersion(item)"
                  class="q-px-xs text-caption"
                />
              </div>
            </div>
          </div>

          <div v-else class="text-center text-grey-6 q-pa-md text-caption">
            No se encontraron versiones archivadas.
          </div>
        </q-card>
      </div>
    </div>

    <!-- Diálogo de Confirmación para Publicar Nueva Versión -->
    <q-dialog v-model="showConfirmDialog">
      <q-card style="max-width: 500px; width: 92vw;" class="q-pa-xs">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" class="q-mr-sm" size="36px" />
          <span class="text-subtitle1 text-weight-bold">¿Publicar nueva versión?</span>
        </q-card-section>

        <q-card-section class="q-pt-none text-body2 text-grey-9">
          <p class="q-mb-xs">
            Estás a punto de publicar una nueva versión del consentimiento informado.
          </p>
          <p class="text-weight-bold text-negative q-mb-sm">
            Importante: Al publicarse una nueva versión, los pacientes registrados deberán firmar esta nueva versión para que su consentimiento sea considerado vigente.
          </p>
          <div class="text-caption text-grey-8">
            <span class="text-weight-medium">Motivo:</span> {{ form.change_reason || 'Modificación del texto legal' }}
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn
            color="primary"
            label="Confirmar y Publicar"
            class="minimal-btn-save"
            :loading="saving"
            @click="saveNewVersion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de Previsualización de Versión Histórica -->
    <q-dialog v-model="showPreviewDialog">
      <q-card style="max-width: 750px; width: 95vw;" class="q-pa-xs">
        <q-card-section class="row items-center justify-between no-wrap">
          <div class="text-subtitle1 text-primary text-weight-bold flex items-center ellipsis">
            <q-badge
              :color="selectedPreviewVersion?.active ? 'positive' : 'grey-7'"
              text-color="white"
              class="q-mr-sm"
            >
              v{{ selectedPreviewVersion?.version }}
            </q-badge>
            <span class="ellipsis">{{ selectedPreviewVersion?.title }}</span>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-py-xs text-caption text-grey-8">
          <div><strong>Fecha:</strong> {{ formatDateTime(selectedPreviewVersion?.created_at) }}</div>
          <div><strong>Autor:</strong> {{ selectedPreviewVersion?.created_by || 'Sistema' }}</div>
          <div><strong>Motivo:</strong> {{ selectedPreviewVersion?.change_reason }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 400px; overflow-y: auto;" class="q-pa-sm q-pa-sm-md bg-grey-1">
          <!-- Renderizado seguro del texto HTML de la versión seleccionada -->
          <div v-html="selectedPreviewVersion?.content"></div>
        </q-card-section>

        <q-card-actions align="between" class="q-px-md q-pb-md">
          <q-btn
            flat
            color="primary"
            icon="content_copy"
            label="Cargar en editor"
            @click="loadVersionIntoEditor(selectedPreviewVersion)"
            v-close-popup
            class="text-caption"
          />
          <q-btn flat label="Cerrar" color="grey-8" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { ConsentsAPI } from '../services/api';

const $q = useQuasar();

const activeTemplate = ref(null);
const history = ref([]);
const loadingHistory = ref(false);
const saving = ref(false);

const form = ref({
  title: '',
  content: '',
  change_reason: ''
});

const showConfirmDialog = ref(false);
const showPreviewDialog = ref(false);
const selectedPreviewVersion = ref(null);

// Toolbar responsiva para evitar que en móvil se desborde o apile en 4 renglones
const editorToolbar = computed(() => {
  if ($q.screen.lt.sm) {
    return [
      ['bold', 'italic', 'underline'],
      ['unordered', 'ordered'],
      ['undo', 'redo']
    ];
  }
  return [
    ['bold', 'italic', 'underline', 'strike'],
    ['token', 'hr', 'link'],
    [
      {
        label: $q.lang.editor.align,
        icon: $q.iconSet.editor.align,
        fixedLabel: true,
        list: 'only-icons',
        options: ['left', 'center', 'right', 'justify']
      }
    ],
    ['unordered', 'ordered'],
    ['quote'],
    [
      {
        label: $q.lang.editor.formatting,
        icon: $q.iconSet.editor.formatting,
        list: 'no-icons',
        options: ['p', 'h3', 'h4', 'h5', 'h6']
      }
    ],
    ['undo', 'redo']
  ];
});

async function loadActiveTemplate() {
  try {
    const res = await ConsentsAPI.getActiveTemplate();
    activeTemplate.value = res.data;
    form.value.title = res.data.title;
    form.value.content = res.data.content;
    form.value.change_reason = '';
  } catch (err) {
    console.error('Error al cargar plantilla activa:', err);
    $q.notify({
      type: 'negative',
      message: 'No se pudo cargar la plantilla activa de consentimiento.'
    });
  }
}

async function loadHistory() {
  loadingHistory.value = true;
  try {
    const res = await ConsentsAPI.getTemplateHistory();
    history.value = res.data || [];
  } catch (err) {
    console.error('Error al cargar historial de versiones:', err);
  } finally {
    loadingHistory.value = false;
  }
}

const MAX_CONTENT_LENGTH = 50000;
const MIN_CONTENT_LENGTH = 50;
const MAX_TITLE_LENGTH = 150;
const MAX_REASON_LENGTH = 255;

const contentLength = computed(() => (form.value.content || '').length);
const isContentTooLong = computed(() => contentLength.value > MAX_CONTENT_LENGTH);

const charCountClass = computed(() => {
  if (isContentTooLong.value) return 'text-negative text-weight-bolder';
  if (contentLength.value > 0 && contentLength.value < MIN_CONTENT_LENGTH) return 'text-warning';
  return 'text-grey-7';
});

function onPasteEditor(evt) {
  const clipboardData = evt.clipboardData || window.clipboardData;
  if (!clipboardData) return;
  const pastedText = clipboardData.getData('text/plain') || '';
  const currentContent = form.value.content || '';

  // Considerar selección activa en el editor que se reemplazará al pegar
  const selection = window.getSelection();
  const selectedLength = selection ? selection.toString().length : 0;

  const estimatedTotal = currentContent.length - selectedLength + pastedText.length;
  if (estimatedTotal > MAX_CONTENT_LENGTH) {
    evt.preventDefault();
    const excess = estimatedTotal - MAX_CONTENT_LENGTH;
    $q.notify({
      type: 'warning',
      icon: 'warning',
      position: 'top',
      timeout: 7000,
      message: `El texto que intentas pegar (${pastedText.length.toLocaleString()} caracteres) supera el límite máximo de ${MAX_CONTENT_LENGTH.toLocaleString()} caracteres por ${excess.toLocaleString()} caracteres. Reduce el texto antes de pegarlo.`
    });
  }
}

function resetToActive() {
  if (activeTemplate.value) {
    form.value.title = activeTemplate.value.title;
    form.value.content = activeTemplate.value.content;
    form.value.change_reason = '';
    $q.notify({
      type: 'info',
      message: 'Editor restablecido a la versión vigente.'
    });
  }
}

function confirmSaveNewVersion() {
  if (!form.value.title?.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, ingresa el título del consentimiento.'
    });
    return;
  }
  if (form.value.title.trim().length > MAX_TITLE_LENGTH) {
    $q.notify({
      type: 'warning',
      message: `El título no puede superar los ${MAX_TITLE_LENGTH} caracteres.`
    });
    return;
  }
  if (!form.value.change_reason?.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, ingresa el motivo del cambio para la auditoría.'
    });
    return;
  }
  if (form.value.change_reason.trim().length > MAX_REASON_LENGTH) {
    $q.notify({
      type: 'warning',
      message: `El motivo del cambio no puede superar los ${MAX_REASON_LENGTH} caracteres.`
    });
    return;
  }
  const contentLen = (form.value.content || '').trim().length;
  if (contentLen < MIN_CONTENT_LENGTH) {
    $q.notify({
      type: 'warning',
      message: `El contenido del consentimiento debe tener al menos ${MIN_CONTENT_LENGTH} caracteres para tener validez legal.`
    });
    return;
  }
  if (contentLength.value > MAX_CONTENT_LENGTH) {
    $q.notify({
      type: 'negative',
      message: `El contenido del consentimiento supera el límite de ${MAX_CONTENT_LENGTH.toLocaleString()} caracteres. Por favor, redúcelo antes de publicar.`
    });
    return;
  }
  showConfirmDialog.value = true;
}

async function saveNewVersion() {
  showConfirmDialog.value = false;
  saving.value = true;
  try {
    const payload = {
      title: form.value.title,
      content: form.value.content,
      change_reason: form.value.change_reason || 'Actualización de términos',
      created_by: 'Administrador'
    };
    const res = await ConsentsAPI.createTemplateVersion(payload);
    $q.notify({
      type: 'positive',
      icon: 'verified',
      message: `Nueva versión v${res.data.version} publicada exitosamente.`
    });
    await loadActiveTemplate();
    await loadHistory();
  } catch (err) {
    console.error('Error al guardar versión:', err);
    $q.notify({
      type: 'negative',
      message: 'Ocurrió un error al guardar la nueva versión.'
    });
  } finally {
    saving.value = false;
  }
}

function previewVersion(item) {
  selectedPreviewVersion.value = item;
  showPreviewDialog.value = true;
}

function loadVersionIntoEditor(item) {
  if (item) {
    form.value.title = item.title;
    form.value.content = item.content;
    form.value.change_reason = `Basado en la versión v${item.version}`;
    $q.notify({
      type: 'info',
      message: `Texto de versión v${item.version} cargado en el editor.`
    });
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

onMounted(() => {
  loadActiveTemplate();
  loadHistory();
});
</script>

<style scoped>
.minimal-card {
  border-radius: 8px;
  border: 1px solid #e0e4ea;
}
.border-blue {
  border-left: 4px solid #1976d2;
}
.consent-rich-editor {
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  background-color: #ffffff;
}
.minimal-btn-save {
  font-weight: 600;
  text-transform: none;
}
.version-card {
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}
.version-card-active {
  border: 1px solid #a5d6a7;
  border-left: 4px solid #2e7d32;
}
</style>
