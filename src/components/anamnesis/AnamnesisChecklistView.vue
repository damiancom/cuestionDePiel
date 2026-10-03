<template>
  <div class="checklist-view-container">
    <div class="row q-col-gutter-lg items-start">
      <!-- Columna Principal: Bloques temáticos tipo Checklist -->
      <div class="col-12 col-lg-8 q-gutter-y-md">
        <!-- 1. SALUD GENERAL & ANTECEDENTES MÉDICOS -->
        <q-card flat bordered class="checklist-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="34px" color="teal-1" text-color="teal-8" icon="checklist" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">1. Salud General & Antecedentes Médicos</div>
                <div class="text-caption text-grey-7">Tildar las afecciones que apliquen al paciente</div>
              </div>
            </div>

            <!-- Patologías Evaluadas (Checklist) -->
            <div class="text-subtitle2 text-grey-8 q-mt-md q-mb-xs">Patologías Evaluadas</div>
            <div class="row q-col-gutter-sm">
              <div
                v-for="(item, key) in antecedentesList"
                :key="key"
                class="col-12 col-xl-6"
              >
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-teal-0 border-teal': formData.antecedentes[key].aplica }"
                  @click="formData.antecedentes[key].aplica = !formData.antecedentes[key].aplica"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.antecedentes[key].aplica"
                      color="teal"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9 lh-snug">
                      {{ item.label }}
                    </span>
                  </div>
                  <q-slide-transition>
                    <div v-if="formData.antecedentes[key].aplica" class="q-mt-xs q-pl-lg" @click.stop>
                      <q-input
                        v-model="formData.antecedentes[key].detalle"
                        label="Detalle de patología *"
                        class="minimal-input"
                        borderless
                        dense
                        placeholder="Diagnóstico, medicación..."
                      />
                    </div>
                  </q-slide-transition>
                </div>
              </div>
            </div>

            <div class="q-mt-md">
              <q-input
                v-model="formData.antecedentes.hereditariosRelevantes"
                label="Antecedentes familiares relevantes"
                type="textarea"
                autogrow
                class="minimal-input"
                borderless
                placeholder="Diabetes, hipertensión, afecciones cutáneas familiares..."
              />
            </div>

            <!-- Alergias Conocidas (Checklist) -->
            <div class="text-subtitle2 text-grey-8 q-mt-md q-mb-xs">Alergias Conocidas</div>
            <div class="row q-col-gutter-sm">
              <div
                v-for="(item, key) in alergiasList"
                :key="key"
                class="col-12 col-xl-6"
              >
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-orange-0 border-orange': formData.alergias[key].aplica }"
                  @click="formData.alergias[key].aplica = !formData.alergias[key].aplica"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.alergias[key].aplica"
                      color="orange-9"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9 lh-snug">
                      {{ item.label }}
                    </span>
                  </div>
                  <q-slide-transition>
                    <div v-if="formData.alergias[key].aplica" class="q-mt-xs q-pl-lg" @click.stop>
                      <q-input
                        v-model="formData.alergias[key].detalle"
                        label="Detalle de alergia *"
                        class="minimal-input"
                        borderless
                        dense
                        placeholder="Sustancia, alimento o metal..."
                      />
                    </div>
                  </q-slide-transition>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 2. HÁBITOS & ESTILO DE VIDA -->
        <q-card flat bordered class="checklist-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="34px" color="blue-1" text-color="blue-8" icon="self_improvement" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">2. Hábitos & Estilo de Vida</div>
                <div class="text-caption text-grey-7">Rutinas cotidianas, descanso y ginecología</div>
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mt-xs">
              <div class="col-12 col-sm-4">
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-red-0 border-red': formData.habitos.fuma }"
                  @click="formData.habitos.fuma = !formData.habitos.fuma"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.habitos.fuma"
                      color="negative"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9">Fuma tabaco</span>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-amber-0 border-amber': formData.habitos.consumeAlcohol }"
                  @click="formData.habitos.consumeAlcohol = !formData.habitos.consumeAlcohol"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.habitos.consumeAlcohol"
                      color="amber-9"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9">Consume alcohol</span>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-blue-0 border-blue': formData.habitos.ingestaAdecuada }"
                  @click="formData.habitos.ingestaAdecuada = !formData.habitos.ingestaAdecuada"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.habitos.ingestaAdecuada"
                      color="primary"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9">Agua adecuada (2L)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Escalas de Bienestar y Rutina: en filas completas para que los botones nunca se solapen -->
            <div class="q-mt-md q-gutter-y-xs bg-grey-1 q-pa-sm rounded-borders">
              <!-- Actividad física -->
              <div class="row items-center justify-between q-py-xs border-bottom-light q-px-xs">
                <span class="text-body2 text-weight-medium text-grey-8">Actividad física</span>
                <q-btn-toggle
                  v-model="formData.habitos.actividadFisica"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-hybrid"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[
                    { label: 'Sedentaria', value: 'Sedentaria' },
                    { label: 'Moderada', value: 'Moderada' },
                    { label: 'Intensa', value: 'Intensa' }
                  ]"
                />
              </div>

              <!-- Calidad del sueño -->
              <div class="row items-center justify-between q-py-xs border-bottom-light q-px-xs">
                <span class="text-body2 text-weight-medium text-grey-8">Calidad del sueño</span>
                <q-btn-toggle
                  v-model="formData.habitos.calidadSueno"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-hybrid"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[
                    { label: 'Mala', value: 'Mala' },
                    { label: 'Regular', value: 'Regular' },
                    { label: 'Buena', value: 'Buena' }
                  ]"
                />
              </div>

              <!-- Nivel de estrés -->
              <div class="row items-center justify-between q-py-xs q-px-xs">
                <span class="text-body2 text-weight-medium text-grey-8">Nivel de estrés</span>
                <q-btn-toggle
                  v-model="formData.habitos.nivelEstres"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-hybrid"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[
                    { label: 'Bajo', value: 'Bajo' },
                    { label: 'Medio', value: 'Medio' },
                    { label: 'Alto', value: 'Alto' }
                  ]"
                />
              </div>
            </div>

            <!-- Historia Ginecológica (Checklist) -->
            <div class="text-subtitle2 text-grey-8 q-mt-md q-mb-xs">Historia Ginecológica</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6 col-md-4">
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-pink-0 border-pink': formData.ginecologia.embarazoLactancia }"
                  @click="formData.ginecologia.embarazoLactancia = !formData.ginecologia.embarazoLactancia"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.ginecologia.embarazoLactancia"
                      color="pink-6"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9">Embarazo / Lactancia</span>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-6 col-md-4">
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-blue-0 border-blue': formData.ginecologia.anticonceptivos }"
                  @click="formData.ginecologia.anticonceptivos = !formData.ginecologia.anticonceptivos"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.ginecologia.anticonceptivos"
                      color="primary"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9">Uso de anticonceptivos</span>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-6 col-md-4">
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-blue-0 border-blue': formData.ginecologia.climaterioMenopausia }"
                  @click="formData.ginecologia.climaterioMenopausia = !formData.ginecologia.climaterioMenopausia"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.ginecologia.climaterioMenopausia"
                      color="primary"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9">Climaterio / Menopausia</span>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 3. EVALUACIÓN CUTÁNEA & FOTOTIPO -->
        <q-card flat bordered class="checklist-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="34px" color="amber-1" text-color="amber-9" icon="face" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">3. Evaluación Cutánea & Fototipo</div>
                <div class="text-caption text-grey-7">Fototipo de Fitzpatrick, biotipo y afección cutánea actual</div>
              </div>
            </div>

            <!-- Fototipo Fitzpatrick Interactivo -->
            <div class="q-mb-md q-pa-md bg-grey-1 rounded-borders">
              <div class="text-subtitle2 text-grey-9 q-mb-xs">
                Clasificación de Fitzpatrick:
                <q-badge color="primary" class="q-ml-sm" v-if="formData.dermatologicos.fototipo">
                  Fototipo {{ formData.dermatologicos.fototipo }}
                </q-badge>
              </div>
              <div class="row q-gutter-md justify-around items-center q-py-sm">
                <div
                  v-for="n in 6"
                  :key="n"
                  class="fototipo-circle-checklist cursor-pointer flex flex-center"
                  :class="{ 'fototipo-selected': formData.dermatologicos.fototipo == n }"
                  :style="{ backgroundColor: getFototipoColor(n), color: n >= 5 ? '#fff' : '#333' }"
                  @click="formData.dermatologicos.fototipo = (formData.dermatologicos.fototipo == n ? null : n)"
                >
                  {{ n }}
                </div>
              </div>
              <div class="text-caption text-grey-8 text-center q-mt-xs">
                {{ fototipoDescripcion }}
              </div>
            </div>

            <!-- Biotipo Cutáneo -->
            <div class="q-mb-md">
              <div class="text-subtitle2 text-grey-8 q-mb-xs">Biotipo Cutáneo</div>
              <div class="row q-gutter-xs">
                <q-chip
                  v-for="bt in biotiposOptions"
                  :key="bt"
                  clickable
                  :selected="formData.dermatologicos.biotipo === bt"
                  @click="formData.dermatologicos.biotipo = (formData.dermatologicos.biotipo === bt ? '' : bt)"
                  color="blue-1"
                  text-color="primary"
                  selected-color="primary"
                >
                  {{ bt }}
                </q-chip>
              </div>
            </div>

            <!-- Afección actual -->
            <div class="q-mb-md">
              <q-input
                v-model="formData.dermatologicos.afeccionActual"
                label="Motivo de la consulta y afección cutánea actual *"
                type="textarea"
                autogrow
                class="minimal-input"
                borderless
                placeholder="Describir manchas, acné, rosácea, líneas de expresión..."
              />
            </div>

            <!-- Condiciones cutáneas específicas (Checklist) -->
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-12 col-sm-6">
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-amber-0 border-amber': formData.dermatologicos.herpesSimple }"
                  @click="formData.dermatologicos.herpesSimple = !formData.dermatologicos.herpesSimple"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.dermatologicos.herpesSimple"
                      color="amber-9"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9">Herpes simple recurrente</span>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-amber-0 border-amber': formData.dermatologicos.cicatrizacionQueloides }"
                  @click="formData.dermatologicos.cicatrizacionQueloides = !formData.dermatologicos.cicatrizacionQueloides"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.dermatologicos.cicatrizacionQueloides"
                      color="amber-9"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9">Queloides / Cicatrización irregular</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hábitos de Sol -->
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.dermatologicos.protectorSolar"
                  label="Uso de protector solar (FPS / frecuencia)"
                  class="minimal-input"
                  borderless
                  dense
                  placeholder="Ej: FPS 50 diario, reaplica cada 4hs..."
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.dermatologicos.exposicionSolar"
                  label="Exposición solar o camas solares"
                  class="minimal-input"
                  borderless
                  dense
                  placeholder="Exposición laboral, ocio, viajes recientes..."
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 4. SEGURIDAD, MEDICACIÓN & CONTRAINDICACIONES -->
        <q-card flat bordered class="checklist-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="34px" color="red-1" text-color="negative" icon="security" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold text-negative">4. Seguridad, Medicación & Contraindicaciones</div>
                <div class="text-caption text-grey-7">Validación para aparatología, peelings y seguridad clínica</div>
              </div>
            </div>

            <!-- Contraindicaciones críticas (Checklist de alerta) -->
            <div class="q-pa-md bg-red-0 border-negative-subtle rounded-borders q-mb-md">
              <div class="text-subtitle2 text-weight-bold text-negative q-mb-sm row items-center">
                <q-icon name="warning" class="q-mr-xs" size="20px" />
                Contraindicaciones críticas para aparatología y peelings
              </div>
              <div class="q-gutter-y-xs">
                <div
                  v-for="(item, key) in contraindicacionesList"
                  :key="key"
                  class="checklist-subitem q-py-xs q-px-sm rounded-borders cursor-pointer border-bottom-light"
                  :class="{ 'is-checked bg-red-1 text-negative': formData.contraindicaciones[key] }"
                  @click="formData.contraindicaciones[key] = !formData.contraindicaciones[key]"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.contraindicaciones[key]"
                      color="negative"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium lh-snug" :class="formData.contraindicaciones[key] ? 'text-negative text-weight-bold' : 'text-grey-9'">
                      {{ item.label }}
                    </span>
                    <q-badge color="negative" class="q-ml-sm" v-if="formData.contraindicaciones[key]">
                      ⚠️ Alerta
                    </q-badge>
                  </div>
                </div>
              </div>
            </div>

            <!-- Medicación y Suplementos (Checklist) -->
            <div class="text-subtitle2 text-grey-8 q-mb-xs">Medicación y Suplementos</div>
            <div class="row q-col-gutter-sm q-mb-md">
              <div
                v-for="(item, key) in medicacionList"
                :key="key"
                class="col-12 col-xl-6"
              >
                <div
                  class="checklist-subitem q-py-sm q-px-md rounded-borders cursor-pointer"
                  :class="{ 'is-checked bg-purple-0 border-purple': formData.medicacion[key].aplica }"
                  @click="formData.medicacion[key].aplica = !formData.medicacion[key].aplica"
                >
                  <div class="row items-center no-wrap">
                    <q-checkbox
                      v-model="formData.medicacion[key].aplica"
                      color="purple-8"
                      dense
                      class="q-mr-sm"
                      @click.stop
                    />
                    <span class="text-body2 text-weight-medium text-grey-9 lh-snug">
                      {{ item.label }}
                    </span>
                  </div>
                  <q-slide-transition>
                    <div v-if="formData.medicacion[key].aplica" class="q-mt-xs q-pl-lg" @click.stop>
                      <q-input
                        v-model="formData.medicacion[key].detalle"
                        label="Detalle de medicación *"
                        class="minimal-input"
                        borderless
                        dense
                        placeholder="Fármaco, tiempo o dosis..."
                      />
                    </div>
                  </q-slide-transition>
                </div>
              </div>
            </div>

            <!-- Intervenciones previas -->
            <div class="text-subtitle2 text-grey-8 q-mb-xs">Intervenciones Estéticas & Chequeos</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.cirugias.tratamientosUltimosDosAnos"
                  label="Tratamientos estéticos en los últimos 2 años"
                  class="minimal-input"
                  borderless
                  dense
                  placeholder="Láser, rellenos, peelings..."
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.cirugias.ultimoChequeo"
                  label="Último chequeo médico"
                  class="minimal-input"
                  borderless
                  dense
                  placeholder="Fecha o informe..."
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Columna Lateral Sticky: LIVE CLINICAL SUMMARY -->
      <div class="col-12 col-lg-4">
        <div class="sticky-summary">
          <q-card flat bordered class="live-summary-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle1 text-weight-bold text-primary row items-center">
                  <q-icon name="assignment" class="q-mr-xs" size="20px" />
                  Resumen Clínico en Vivo
                </div>
                <q-badge color="teal" label="Auto-detect" />
              </div>
              <div class="text-caption text-grey-7 q-mb-md">
                Alertas críticas y perfil de piel generados en tiempo real
              </div>

              <!-- Alertas Críticas de Seguridad -->
              <div class="q-mb-md">
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">ALERTAS DE SEGURIDAD</div>
                <div v-if="alertasCriticas.length > 0" class="q-gutter-y-xs">
                  <div
                    v-for="(alerta, idx) in alertasCriticas"
                    :key="idx"
                    class="alert-badge-item q-pa-xs rounded-borders text-caption text-weight-bold"
                    :class="alerta.clase"
                  >
                    <q-icon :name="alerta.icono" size="16px" class="q-mr-xs" />
                    {{ alerta.texto }}
                  </div>
                </div>
                <div v-else class="text-caption text-teal-8 bg-teal-1 q-pa-sm rounded-borders">
                  ✓ Sin contraindicaciones críticas declaradas
                </div>
              </div>

              <!-- Perfil Cutáneo Resumen -->
              <div class="q-mb-md">
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">PERFIL CUTÁNEO</div>
                <div class="row items-center q-gutter-x-sm q-mb-xs">
                  <div class="text-body2 text-grey-8">Fototipo:</div>
                  <q-badge
                    v-if="formData.dermatologicos.fototipo"
                    :style="{ backgroundColor: getFototipoColor(formData.dermatologicos.fototipo), color: formData.dermatologicos.fototipo >= 5 ? '#fff' : '#000' }"
                    class="text-weight-bold"
                  >
                    Tipo {{ formData.dermatologicos.fototipo }}
                  </q-badge>
                  <span v-else class="text-caption text-grey-6">Sin definir</span>
                </div>

                <div class="row items-center q-gutter-x-sm q-mb-xs">
                  <div class="text-body2 text-grey-8">Biotipo:</div>
                  <q-badge color="blue-2" text-color="primary" class="text-weight-bold" v-if="formData.dermatologicos.biotipo">
                    {{ formData.dermatologicos.biotipo }}
                  </q-badge>
                  <span v-else class="text-caption text-grey-6">Sin definir</span>
                </div>

                <div v-if="formData.dermatologicos.afeccionActual" class="q-mt-xs">
                  <div class="text-caption text-grey-7">Afección actual:</div>
                  <div class="text-caption text-weight-medium bg-grey-2 q-pa-xs rounded-borders">
                    {{ formData.dermatologicos.afeccionActual }}
                  </div>
                </div>
              </div>

              <!-- Hábitos Resumen -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">HÁBITOS DETECTADOS</div>
                <div class="row q-gutter-xs">
                  <q-badge :color="formData.habitos.fuma ? 'negative' : 'grey-3'" :text-color="formData.habitos.fuma ? 'white' : 'grey-9'">
                    {{ formData.habitos.fuma ? 'Fumador' : 'No fuma' }}
                  </q-badge>
                  <q-badge :color="formData.habitos.consumeAlcohol ? 'warning' : 'grey-3'" :text-color="formData.habitos.consumeAlcohol ? 'dark' : 'grey-9'">
                    {{ formData.habitos.consumeAlcohol ? 'Alcohol' : 'Sin alcohol' }}
                  </q-badge>
                  <q-badge v-if="formData.habitos.nivelEstres" color="purple-1" text-color="purple-9">
                    Estrés: {{ formData.habitos.nivelEstres }}
                  </q-badge>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  antecedentesList: {
    type: Object,
    required: true
  },
  medicacionList: {
    type: Object,
    required: true
  },
  alergiasList: {
    type: Object,
    required: true
  },
  contraindicacionesList: {
    type: Object,
    required: true
  }
});

const biotiposOptions = [
  'Eudérmica',
  'Seca / Alípica',
  'Grasa',
  'Mixta',
  'Sensible'
];

function getFototipoColor(n) {
  const colors = {
    1: '#f8dcd1',
    2: '#f0c7b1',
    3: '#e2b397',
    4: '#c58e6e',
    5: '#8c593d',
    6: '#4c2e1e'
  };
  return colors[n] || '#ccc';
}

const fototipoDescripcion = computed(() => {
  const f = props.formData.dermatologicos.fototipo;
  switch (Number(f)) {
    case 1: return 'Tipo I: Muy clara, siempre se quema, nunca se broncea.';
    case 2: return 'Tipo II: Clara, se quema con facilidad, se broncea mínimamente.';
    case 3: return 'Tipo III: Intermedia clara, se quema moderadamente, se broncea gradualmente.';
    case 4: return 'Tipo IV: Intermedia oscura / Oliva, se quema poco, se broncea con facilidad.';
    case 5: return 'Tipo V: Oscura, rara vez se quema, se broncea intensamente.';
    case 6: return 'Tipo VI: Muy oscura, nunca se quema, altamente pigmentada.';
    default: return 'Seleccione un fototipo numérico de la escala Fitzpatrick.';
  }
});

const alertasCriticas = computed(() => {
  const list = [];
  const fg = props.formData.ginecologia;
  if (fg.embarazoLactancia) {
    list.push({
      texto: 'Embarazo o Lactancia activo',
      icono: 'pregnant_woman',
      clase: 'text-negative bg-red-1'
    });
  }

  const fc = props.formData.contraindicaciones;
  if (fc.marcapasos) {
    list.push({
      texto: 'Marcapasos / Dispositivo implantado',
      icono: 'warning',
      clase: 'text-negative bg-red-1'
    });
  }
  if (fc.implantesMetalicos) {
    list.push({
      texto: 'Prótesis o implantes metálicos',
      icono: 'warning',
      clase: 'text-warning bg-amber-1'
    });
  }
  if (fc.tratamientoOncologico) {
    list.push({
      texto: 'Tratamiento oncológico',
      icono: 'medical_services',
      clase: 'text-negative bg-red-1'
    });
  }
  if (fc.heridasInfecciones) {
    list.push({
      texto: 'Heridas abiertas / Infecciones activas',
      icono: 'healing',
      clase: 'text-negative bg-red-1'
    });
  }
  if (fc.anticoagulantesSinAutorizacion) {
    list.push({
      texto: 'Anticoagulantes sin autorización médica',
      icono: 'error',
      clase: 'text-negative bg-red-1'
    });
  }

  const fm = props.formData.medicacion;
  if (fm.isotretinoina?.aplica) {
    list.push({
      texto: 'Uso de Isotretinoína (fotosensibilidad)',
      icono: 'wb_sunny',
      clase: 'text-negative bg-red-1'
    });
  }
  if (fm.anticoagulantes?.aplica) {
    list.push({
      texto: 'Medicación anticoagulante',
      icono: 'bloodtype',
      clase: 'text-warning bg-amber-1'
    });
  }

  const fa = props.formData.alergias;
  if (fa.cosmeticosMetales?.aplica) {
    list.push({
      texto: 'Alergia a cosméticos o metales',
      icono: 'spa',
      clase: 'text-warning bg-amber-1'
    });
  }

  return list;
});
</script>

<style scoped>
.checklist-view-container {
  width: 100%;
}

.checklist-card {
  border-radius: 12px;
  background-color: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.checklist-subitem {
  border: 1px solid #eef2f6;
  background-color: #fafbfc;
  transition: all 0.2s ease;
}

.checklist-subitem:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.checklist-subitem.is-checked {
  border-width: 1.5px;
}

.border-teal {
  border-color: #99f6e4 !important;
}

.border-orange {
  border-color: #fed7aa !important;
}

.border-red {
  border-color: #fecdd3 !important;
}

.border-amber {
  border-color: #fde68a !important;
}

.border-blue {
  border-color: #bfdbfe !important;
}

.border-pink {
  border-color: #fbcfe8 !important;
}

.border-purple {
  border-color: #e9d8fd !important;
}

.bg-teal-0 {
  background-color: #f0fdfa !important;
}

.bg-orange-0 {
  background-color: #fff7ed !important;
}

.bg-red-0 {
  background-color: #fffafb !important;
}

.bg-amber-0 {
  background-color: #fffbeb !important;
}

.bg-blue-0 {
  background-color: #eff6ff !important;
}

.bg-pink-0 {
  background-color: #fdf2f8 !important;
}

.bg-purple-0 {
  background-color: #faf5ff !important;
}

.border-negative-subtle {
  border: 1px solid #fecdd3 !important;
}

.sticky-summary {
  position: sticky;
  top: 80px;
}

.live-summary-card {
  border-radius: 14px;
  background-color: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.alert-badge-item {
  border-left: 3px solid currentColor;
}

.border-bottom-light {
  border-bottom: 1px dashed #e2e8f0;
}

.minimal-input {
  background: #f8fafc !important;
  border-radius: 10px;
  border: 1px solid #e2e8f0 !important;
  font-size: 13.5px;
  padding: 2px 10px;
}

.fototipo-circle-checklist {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
  font-size: 15px;
  user-select: none;
}

.fototipo-selected {
  transform: scale(1.18);
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.25) !important;
  z-index: 5;
}

.lh-snug {
  line-height: 1.35;
}
</style>
