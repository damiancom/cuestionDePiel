<template>
  <div class="optical-exploration-container">
    <!-- Header de la Ficha -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6 text-primary flex items-center">
          <q-icon name="biotech" size="24px" class="q-mr-sm" />
          Ficha de Exploración Óptica
        </div>
        <div class="text-caption text-grey-8">
          Evaluación dermatoscópica multiespectral: Luz blanca estándar, polarizada cruzada y fluorescencia UV / Wood.
        </div>
      </div>

      <!-- Acciones de control -->
      <div class="row q-gutter-xs items-center q-mt-xs q-mt-sm-none">
        <q-btn
          flat
          dense
          no-caps
          color="primary"
          :icon="allExpanded ? 'unfold_less' : 'unfold_more'"
          :label="allExpanded ? 'Colapsar todas' : 'Expandir todas'"
          @click="toggleAllSections"
          class="q-px-sm"
        />
        <q-btn
          flat
          dense
          no-caps
          color="grey-7"
          icon="restart_alt"
          label="Reiniciar"
          @click="confirmReset"
          class="q-px-sm"
        >
          <q-tooltip>Limpiar todos los campos de esta ficha</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- 1. LUZ BLANCA ESTÁNDAR (SUPERFICIE / EPIDERMIS)                   -->
    <!-- ================================================================= -->
    <q-card class="optical-accordion-card q-mb-md" flat bordered>
      <!-- Header Acordeón -->
      <div
        class="accordion-header q-pa-md cursor-pointer flex items-center justify-between"
        @click="sectionsExpanded.luzBlanca = !sectionsExpanded.luzBlanca"
      >
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle1 text-weight-bold text-grey-10">
            1. LUZ BLANCA ESTÁNDAR
          </div>
          <div class="row q-gutter-xs">
            <span class="optical-tag tag-neutral">SUPERFICIE /</span>
            <span class="optical-tag tag-neutral">EPIDERMIS</span>
          </div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-badge
            v-if="countChecks(data.luzBlanca) > 0"
            color="amber-1"
            text-color="brown-9"
            class="text-weight-bold"
          >
            {{ countChecks(data.luzBlanca) }} hallazgos
          </q-badge>
          <q-badge
            v-if="data.luzBlanca.imagenes.length > 0"
            color="grey-2"
            text-color="grey-8"
          >
            {{ data.luzBlanca.imagenes.length }} fotos
          </q-badge>
          <q-btn
            flat
            round
            dense
            color="grey-7"
            :icon="sectionsExpanded.luzBlanca ? 'expand_less' : 'expand_more'"
            @click.stop="sectionsExpanded.luzBlanca = !sectionsExpanded.luzBlanca"
          />
        </div>
      </div>

      <!-- Contenido Acordeón -->
      <q-slide-transition>
        <div v-show="sectionsExpanded.luzBlanca">
          <div class="divider-gold"></div>
          <div class="q-pa-md">
            <div class="row q-col-gutter-lg">
              <!-- Checklist Médico -->
              <div class="col-12 col-lg-7">
                <div class="optical-inner-sheet q-pa-md">
                  <!-- Grupo 1: ESTADO DE LOS POROS (OSTIUM) -->
                  <div class="section-group-title text-grey-9 q-mb-xs">
                    ESTADO DE LOS POROS (OSTIUM)
                  </div>
                  <div class="column q-mb-md">
                    <q-checkbox
                      v-model="data.luzBlanca.poros_imperceptibles"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Imperceptibles / Finos:</span>
                      <span class="text-grey-8 q-ml-xs">Manto cerrado.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzBlanca.poros_zona_t"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Dilatados en Zona T:</span>
                      <span class="text-grey-8 q-ml-xs">Seborrea folicular.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzBlanca.poros_generalizada"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Dilatación generalizada:</span>
                      <span class="text-grey-8 q-ml-xs">Mejillas y óvalo.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzBlanca.poros_atroficos"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Poros atróficos:</span>
                      <span class="text-grey-8 q-ml-xs">Ovalados / laxitud dérmica.</span>
                    </q-checkbox>
                  </div>

                  <!-- Grupo 2: RELIEVE, TEXTURA & DESHIDRATACIÓN -->
                  <div class="section-group-title text-grey-9 q-mb-xs">
                    RELIEVE, TEXTURA & DESHIDRATACIÓN
                  </div>
                  <div class="column q-mb-md">
                    <q-checkbox
                      v-model="data.luzBlanca.relieve_microrelieve"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Microrelieve uniforme:</span>
                      <span class="text-grey-8 q-ml-xs">Surcos cutáneos nítidos.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzBlanca.relieve_pliegues_deshidratacion"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Pliegues de deshidratación:</span>
                      <span class="text-grey-8 q-ml-xs">Estrías finas en red.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzBlanca.relieve_hiperqueratosis"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Hiperqueratosis:</span>
                      <span class="text-grey-8 q-ml-xs">Córneo rugoso / engrosado.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzBlanca.relieve_descamacion"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Descamación superficial:</span>
                      <span class="text-grey-8 q-ml-xs">Escamas córneas sueltas.</span>
                    </q-checkbox>
                  </div>

                  <!-- Grupo 3: LÍNEAS Y ARRUGAS (50X) -->
                  <div class="section-group-title text-grey-9 q-mb-xs">
                    LÍNEAS Y ARRUGAS (50X)
                  </div>
                  <div class="column">
                    <q-checkbox
                      v-model="data.luzBlanca.arrugas_dinamicas"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-grey-9">Líneas de expresión dinámicas (gestuales).</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzBlanca.arrugas_estaticas"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-grey-9">Arrugas estáticas / fotoinducidas profundas.</span>
                    </q-checkbox>
                  </div>

                  <!-- Notas adicionales de la sección -->
                  <div class="q-mt-md">
                    <q-input
                      v-model="data.luzBlanca.observaciones"
                      type="textarea"
                      autogrow
                      dense
                      borderless
                      class="minimal-input"
                      label="Observaciones adicionales (Luz Blanca)..."
                    />
                  </div>
                </div>
              </div>

              <!-- Registro de Imágenes Luz Blanca -->
              <div class="col-12 col-lg-5">
                <image-section-uploader
                  title="Fotografía - Luz Blanca Estándar"
                  subtitle="Imágenes en superficie / epidermis"
                  icon="lightbulb"
                  accent-color="amber-8"
                  :images="data.luzBlanca.imagenes"
                  @add-image="(img) => addImage('luzBlanca', img)"
                  @remove-image="(index) => removeImage('luzBlanca', index)"
                  @preview-image="openImagePreview"
                />
              </div>
            </div>
          </div>
        </div>
      </q-slide-transition>
    </q-card>

    <!-- ================================================================= -->
    <!-- 2. LUZ POLARIZADA CRUZADA (DERMIS & VASCULAR)                     -->
    <!-- ================================================================= -->
    <q-card class="optical-accordion-card q-mb-md" flat bordered>
      <!-- Header Acordeón -->
      <div
        class="accordion-header q-pa-md cursor-pointer flex items-center justify-between"
        @click="sectionsExpanded.luzPolarizada = !sectionsExpanded.luzPolarizada"
      >
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle1 text-weight-bold text-grey-10">
            2. LUZ POLARIZADA CRUZADA
          </div>
          <div class="row q-gutter-xs">
            <span class="optical-tag tag-blue">DERMIS &</span>
            <span class="optical-tag tag-blue">VASCULAR</span>
          </div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-badge
            v-if="countChecks(data.luzPolarizada) > 0 || data.luzPolarizada.nivelReactividad"
            color="blue-1"
            text-color="primary"
            class="text-weight-bold"
          >
            {{ countChecks(data.luzPolarizada) }} hallazgos
            <span v-if="data.luzPolarizada.nivelReactividad"> • {{ data.luzPolarizada.nivelReactividad }}</span>
          </q-badge>
          <q-badge
            v-if="data.luzPolarizada.imagenes.length > 0"
            color="grey-2"
            text-color="grey-8"
          >
            {{ data.luzPolarizada.imagenes.length }} fotos
          </q-badge>
          <q-btn
            flat
            round
            dense
            color="grey-7"
            :icon="sectionsExpanded.luzPolarizada ? 'expand_less' : 'expand_more'"
            @click.stop="sectionsExpanded.luzPolarizada = !sectionsExpanded.luzPolarizada"
          />
        </div>
      </div>

      <!-- Contenido Acordeón -->
      <q-slide-transition>
        <div v-show="sectionsExpanded.luzPolarizada">
          <div class="divider-gold"></div>
          <div class="q-pa-md">
            <div class="row q-col-gutter-lg">
              <!-- Checklist Médico -->
              <div class="col-12 col-lg-7">
                <div class="optical-inner-sheet q-pa-md">
                  <!-- Grupo 1: RED VASCULAR & SENSIBILIDAD -->
                  <div class="section-group-title text-blue-9 q-mb-xs">
                    RED VASCULAR & SENSIBILIDAD
                  </div>
                  <div class="column q-mb-md">
                    <q-checkbox
                      v-model="data.luzPolarizada.vascular_sin_reactividad"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Sin reactividad:</span>
                      <span class="text-grey-8 q-ml-xs">Tono dérmico parejo.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzPolarizada.vascular_eritema_difuso"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Eritema difuso / Sensibilidad:</span>
                      <span class="text-grey-8 q-ml-xs">Vaso congestión.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzPolarizada.vascular_telangiectasias"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Telangiectasias aisladas:</span>
                      <span class="text-grey-8 q-ml-xs">Arañitas visibles.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzPolarizada.vascular_arborizacion"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Arborización vascular densa:</span>
                      <span class="text-grey-8 q-ml-xs">Signo cuperosis/rosácea.</span>
                    </q-checkbox>
                  </div>

                  <!-- Grupo 2: PIGMENTACIÓN EPIDÉRMICA / DÉRMICA -->
                  <div class="section-group-title text-blue-9 q-mb-xs">
                    PIGMENTACIÓN EPIDÉRMICA / DÉRMICA
                  </div>
                  <div class="column q-mb-md">
                    <q-checkbox
                      v-model="data.luzPolarizada.pigmentacion_tono_uniforme"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Tono uniforme:</span>
                      <span class="text-grey-8 q-ml-xs">Ausencia de manchas.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzPolarizada.pigmentacion_melasma"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Melasma:</span>
                      <span class="text-grey-8 q-ml-xs">Pigmento marrón difuso en placa.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzPolarizada.pigmentacion_lentigos"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Léntigos solares:</span>
                      <span class="text-grey-8 q-ml-xs">Bordes definidos por fotodaño.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzPolarizada.pigmentacion_hpi"
                      dense
                      color="primary"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">HPI:</span>
                      <span class="text-grey-8 q-ml-xs">Máculas postacné o postinflamatorias.</span>
                    </q-checkbox>
                  </div>

                  <!-- Caja de Selección: Nivel de Reactividad -->
                  <div class="optical-radio-box q-pa-sm q-mb-md">
                    <div class="row items-center justify-between q-col-gutter-xs">
                      <div class="text-weight-bold text-grey-9 q-mr-sm" style="font-size: 0.95rem;">
                        Nivel de Reactividad:
                      </div>
                      <div class="row q-gutter-md items-center">
                        <q-radio
                          v-model="data.luzPolarizada.nivelReactividad"
                          val="Baja"
                          label="Baja"
                          dense
                          color="primary"
                        />
                        <q-radio
                          v-model="data.luzPolarizada.nivelReactividad"
                          val="Media"
                          label="Media"
                          dense
                          color="primary"
                        />
                        <q-radio
                          v-model="data.luzPolarizada.nivelReactividad"
                          val="Alta"
                          label="Alta"
                          dense
                          color="primary"
                        />
                        <q-btn
                          v-if="data.luzPolarizada.nivelReactividad"
                          flat
                          round
                          dense
                          size="xs"
                          icon="close"
                          color="grey-6"
                          @click="data.luzPolarizada.nivelReactividad = null"
                        >
                          <q-tooltip>Deseleccionar</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>

                  <!-- Notas adicionales de la sección -->
                  <div class="q-mt-sm">
                    <q-input
                      v-model="data.luzPolarizada.observaciones"
                      type="textarea"
                      autogrow
                      dense
                      borderless
                      class="minimal-input"
                      label="Observaciones adicionales (Luz Polarizada)..."
                    />
                  </div>
                </div>
              </div>

              <!-- Registro de Imágenes Luz Polarizada -->
              <div class="col-12 col-lg-5">
                <image-section-uploader
                  title="Fotografía - Luz Polarizada"
                  subtitle="Imágenes de dermis y red vascular"
                  icon="grain"
                  accent-color="blue-7"
                  :images="data.luzPolarizada.imagenes"
                  @add-image="(img) => addImage('luzPolarizada', img)"
                  @remove-image="(index) => removeImage('luzPolarizada', index)"
                  @preview-image="openImagePreview"
                />
              </div>
            </div>
          </div>
        </div>
      </q-slide-transition>
    </q-card>

    <!-- ================================================================= -->
    <!-- 3. LUZ UV / WOOD (SEBO & PORFIRINAS)                              -->
    <!-- ================================================================= -->
    <q-card class="optical-accordion-card q-mb-md" flat bordered>
      <!-- Header Acordeón -->
      <div
        class="accordion-header q-pa-md cursor-pointer flex items-center justify-between"
        @click="sectionsExpanded.luzUV = !sectionsExpanded.luzUV"
      >
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle1 text-weight-bold text-grey-10">
            3. LUZ UV / WOOD
          </div>
          <div>
            <span class="optical-tag tag-purple">SEBO & PORFIRINAS</span>
          </div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-badge
            v-if="countChecks(data.luzUV) > 0 || data.luzUV.cargaBacteriana"
            color="purple-1"
            text-color="purple-9"
            class="text-weight-bold"
          >
            {{ countChecks(data.luzUV) }} hallazgos
            <span v-if="data.luzUV.cargaBacteriana"> • {{ data.luzUV.cargaBacteriana }}</span>
          </q-badge>
          <q-badge
            v-if="data.luzUV.imagenes.length > 0"
            color="grey-2"
            text-color="grey-8"
          >
            {{ data.luzUV.imagenes.length }} fotos
          </q-badge>
          <q-btn
            flat
            round
            dense
            color="grey-7"
            :icon="sectionsExpanded.luzUV ? 'expand_less' : 'expand_more'"
            @click.stop="sectionsExpanded.luzUV = !sectionsExpanded.luzUV"
          />
        </div>
      </div>

      <!-- Contenido Acordeón -->
      <q-slide-transition>
        <div v-show="sectionsExpanded.luzUV">
          <div class="divider-gold"></div>
          <div class="q-pa-md">
            <div class="row q-col-gutter-lg">
              <!-- Checklist Médico -->
              <div class="col-12 col-lg-7">
                <div class="optical-inner-sheet q-pa-md">
                  <!-- Grupo 1: ACTIVIDAD BACTERIANA & RETENCIÓN -->
                  <div class="section-group-title text-purple-9 q-mb-xs">
                    ACTIVIDAD BACTERIANA & RETENCIÓN
                  </div>
                  <div class="column q-mb-md">
                    <q-checkbox
                      v-model="data.luzUV.bacteriana_naranja_rojiza"
                      dense
                      color="purple-8"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Fluorescencia Naranja/Rojiza:</span>
                      <span class="text-grey-8 q-ml-xs">
                        Porfirinas activas de <em>C. acnes</em> en ostium.
                      </span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzUV.bacteriana_amarillenta"
                      dense
                      color="purple-8"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Fluorescencia Amarillenta:</span>
                      <span class="text-grey-8 q-ml-xs">Acúmulo de lípidos/sebo libre en superficie.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzUV.bacteriana_blanca_brillante"
                      dense
                      color="purple-8"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Fluorescencia Blanca brillante:</span>
                      <span class="text-grey-8 q-ml-xs">Zonas hiperqueratósicas / células muertas.</span>
                    </q-checkbox>
                  </div>

                  <!-- Grupo 2: MANTO LIPÍDICO & TIPO DE SEBO -->
                  <div class="section-group-title text-purple-9 q-mb-xs">
                    MANTO LIPÍDICO & TIPO DE SEBO
                  </div>
                  <div class="column q-mb-md">
                    <q-checkbox
                      v-model="data.luzUV.sebo_alipico"
                      dense
                      color="purple-8"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Alípico:</span>
                      <span class="text-grey-8 q-ml-xs">Sin fluorescencia lipídica observable.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzUV.sebo_moderada_fluida"
                      dense
                      color="purple-8"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Seborrea moderada / fluida:</span>
                      <span class="text-grey-8 q-ml-xs">Punteado folicular.</span>
                    </q-checkbox>

                    <q-checkbox
                      v-model="data.luzUV.sebo_densa_asfictica"
                      dense
                      color="purple-8"
                      class="optical-checkbox-row"
                    >
                      <span class="text-weight-bold">Seborrea densa / asfíctica:</span>
                      <span class="text-grey-8 q-ml-xs">Cúmulos en conducto.</span>
                    </q-checkbox>
                  </div>

                  <!-- Caja de Selección: Carga Bacteriana -->
                  <div class="optical-radio-box q-pa-sm q-mb-md">
                    <div class="row items-center justify-between q-col-gutter-xs">
                      <div class="text-weight-bold text-grey-9 q-mr-sm" style="font-size: 0.95rem;">
                        Carga Bacteriana:
                      </div>
                      <div class="row q-gutter-md items-center">
                        <q-radio
                          v-model="data.luzUV.cargaBacteriana"
                          val="Mínima"
                          label="Mínima"
                          dense
                          color="purple-8"
                        />
                        <q-radio
                          v-model="data.luzUV.cargaBacteriana"
                          val="Moderada"
                          label="Moderada"
                          dense
                          color="purple-8"
                        />
                        <q-radio
                          v-model="data.luzUV.cargaBacteriana"
                          val="Severa"
                          label="Severa"
                          dense
                          color="purple-8"
                        />
                        <q-btn
                          v-if="data.luzUV.cargaBacteriana"
                          flat
                          round
                          dense
                          size="xs"
                          icon="close"
                          color="grey-6"
                          @click="data.luzUV.cargaBacteriana = null"
                        >
                          <q-tooltip>Deseleccionar</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>

                  <!-- Notas adicionales de la sección -->
                  <div class="q-mt-sm">
                    <q-input
                      v-model="data.luzUV.observaciones"
                      type="textarea"
                      autogrow
                      dense
                      borderless
                      class="minimal-input"
                      label="Observaciones adicionales (Luz UV / Wood)..."
                    />
                  </div>
                </div>
              </div>

              <!-- Registro de Imágenes Luz UV -->
              <div class="col-12 col-lg-5">
                <image-section-uploader
                  title="Fotografía - Luz UV / Wood"
                  subtitle="Fluorescencia de porfirinas y manto lipídico"
                  icon="wb_iridescent"
                  accent-color="purple-8"
                  :images="data.luzUV.imagenes"
                  @add-image="(img) => addImage('luzUV', img)"
                  @remove-image="(index) => removeImage('luzUV', index)"
                  @preview-image="openImagePreview"
                />
              </div>
            </div>
          </div>
        </div>
      </q-slide-transition>
    </q-card>

    <!-- Modal de Previsualización de Imagen Ampliada -->
    <q-dialog v-model="previewDialog.show">
      <q-card style="min-width: 320px; max-width: 90vw; border-radius: 12px;">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-subtitle1 text-weight-bold text-grey-9">
            {{ previewDialog.title || 'Detalle de imagen' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md text-center">
          <img
            :src="previewDialog.url"
            alt="Detalle"
            style="max-width: 100%; max-height: 75vh; border-radius: 8px; object-fit: contain;"
          />
          <div v-if="previewDialog.caption" class="text-caption text-grey-7 q-mt-sm">
            {{ previewDialog.caption }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import ImageSectionUploader from './ImageSectionUploader.vue';

const props = defineProps({
  patientId: {
    type: [String, Number],
    default: ''
  },
  patientName: {
    type: String,
    default: ''
  }
});

const $q = useQuasar();

// Estado de expansión de cada sección (acordeón independiente)
const sectionsExpanded = reactive({
  luzBlanca: true,
  luzPolarizada: true,
  luzUV: true
});

const allExpanded = computed(() => {
  return sectionsExpanded.luzBlanca && sectionsExpanded.luzPolarizada && sectionsExpanded.luzUV;
});

function toggleAllSections() {
  const target = !allExpanded.value;
  sectionsExpanded.luzBlanca = target;
  sectionsExpanded.luzPolarizada = target;
  sectionsExpanded.luzUV = target;
}

// Datos de la ficha
const createDefaultData = () => ({
  luzBlanca: {
    poros_imperceptibles: false,
    poros_zona_t: false,
    poros_generalizada: false,
    poros_atroficos: false,
    relieve_microrelieve: false,
    relieve_pliegues_deshidratacion: false,
    relieve_hiperqueratosis: false,
    relieve_descamacion: false,
    arrugas_dinamicas: false,
    arrugas_estaticas: false,
    observaciones: '',
    imagenes: []
  },
  luzPolarizada: {
    vascular_sin_reactividad: false,
    vascular_eritema_difuso: false,
    vascular_telangiectasias: false,
    vascular_arborizacion: false,
    pigmentacion_tono_uniforme: false,
    pigmentacion_melasma: false,
    pigmentacion_lentigos: false,
    pigmentacion_hpi: false,
    nivelReactividad: null,
    observaciones: '',
    imagenes: []
  },
  luzUV: {
    bacteriana_naranja_rojiza: false,
    bacteriana_amarillenta: false,
    bacteriana_blanca_brillante: false,
    sebo_alipico: false,
    sebo_moderada_fluida: false,
    sebo_densa_asfictica: false,
    cargaBacteriana: null,
    observaciones: '',
    imagenes: []
  }
});

const data = reactive(createDefaultData());

// Contador de checks marcados por sección
function countChecks(section) {
  let count = 0;
  for (const [key, val] of Object.entries(section)) {
    if (typeof val === 'boolean' && val === true) {
      count++;
    }
  }
  return count;
}

// Manejo de imágenes
function addImage(sectionKey, imageObj) {
  data[sectionKey].imagenes.push(imageObj);
  saveToStorage();
}

function removeImage(sectionKey, index) {
  data[sectionKey].imagenes.splice(index, 1);
  saveToStorage();
}

// Preview dialog
const previewDialog = reactive({
  show: false,
  url: '',
  title: '',
  caption: ''
});

function openImagePreview(img) {
  previewDialog.url = img.url;
  previewDialog.title = img.name || 'Detalle óptico';
  previewDialog.caption = img.caption || '';
  previewDialog.show = true;
}

// Persistencia local (Frontend hasta integración con Backend)
const storageKey = computed(() => {
  return `optical_sheet_patient_${props.patientId || 'temp'}`;
});

function saveToStorage() {
  try {
    localStorage.setItem(storageKey.value, JSON.stringify(data));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e);
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(storageKey.value);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(data.luzBlanca, parsed.luzBlanca || {});
      Object.assign(data.luzPolarizada, parsed.luzPolarizada || {});
      Object.assign(data.luzUV, parsed.luzUV || {});
    }
  } catch (e) {
    console.warn('Error al cargar datos ópticos de localStorage:', e);
  }
}

watch(
  () => [data.luzBlanca, data.luzPolarizada, data.luzUV],
  () => {
    saveToStorage();
  },
  { deep: true }
);

watch(
  () => props.patientId,
  () => {
    loadFromStorage();
  }
);

onMounted(() => {
  loadFromStorage();
});

function confirmReset() {
  $q.dialog({
    title: 'Reiniciar ficha de exploración',
    message: '¿Estás seguro de que deseas limpiar todas las opciones e imágenes cargadas en esta ficha?',
    cancel: {
      flat: true,
      label: 'Cancelar',
      color: 'grey-8'
    },
    ok: {
      flat: true,
      label: 'Reiniciar',
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    const fresh = createDefaultData();
    Object.assign(data.luzBlanca, fresh.luzBlanca);
    Object.assign(data.luzPolarizada, fresh.luzPolarizada);
    Object.assign(data.luzUV, fresh.luzUV);
    localStorage.removeItem(storageKey.value);
    $q.notify({
      type: 'info',
      message: 'Ficha de exploración óptica restablecida',
      position: 'top-right'
    });
  });
}
</script>

<style scoped>
.optical-exploration-container {
  width: 100%;
}

.optical-accordion-card {
  border-radius: 12px;
  background-color: #ffffff;
  border: 1px solid #e0dbd5;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.optical-accordion-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.accordion-header {
  background: #faf8f5;
  transition: background-color 0.2s ease;
}

.accordion-header:hover {
  background: #f4efe9;
}

.divider-gold {
  height: 2px;
  background: #c5a880;
  width: 100%;
}

.optical-inner-sheet {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #ebe5df;
}

.section-group-title {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.optical-tag {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.4px;
  display: inline-block;
}

.tag-neutral {
  background-color: #ebf3f7;
  color: #2b5b7a;
  border: 1px solid #c9dfea;
}

.tag-blue {
  background-color: #e3f2fd;
  color: #1565c0;
  border: 1px solid #bbdefb;
}

.tag-purple {
  background-color: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #e1bee7;
}

/* Un solo check por fila, ancho completo y alineación superior */
:deep(.optical-checkbox-row) {
  width: 100% !important;
  display: flex !important;
  align-items: flex-start !important;
  margin: 0 0 2px 0;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background-color 0.15s ease;
}

:deep(.optical-checkbox-row:hover) {
  background-color: #fbf9f6;
}

:deep(.optical-checkbox-row .q-checkbox__inner) {
  margin-top: 1px;
  flex-shrink: 0;
}

:deep(.optical-checkbox-row .q-checkbox__label) {
  width: 100%;
  padding-left: 8px;
  font-size: 0.91rem;
  line-height: 1.35;
  color: #222222;
}

.optical-radio-box {
  background-color: #f7f7f7;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}
</style>
