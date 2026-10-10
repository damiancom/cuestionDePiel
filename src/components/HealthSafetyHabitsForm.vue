<template>
  <div class="health-habits-container q-gutter-y-md">
    <!-- Encabezado alineado con las demás pestañas -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h6 text-primary flex items-center">
          <q-icon name="health_and_safety" class="q-mr-sm" size="24px" />
          Salud, Seguridad y Hábitos
        </div>
        <div class="text-caption text-grey-8">
          Antecedentes médicos, medicación, alergias, contraindicaciones y hábitos de vida
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-lg items-start">
      <!-- Columna Principal: Bloques temáticos continuos -->
      <div class="col-12 col-lg-8 q-gutter-y-md">

        <!-- 1. SALUD GENERAL & ANTECEDENTES MÉDICOS -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection('salud')"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="teal-1" text-color="teal-8" icon="favorite" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">Salud General & Antecedentes Médicos</div>
                <div class="text-caption text-grey-7">Patologías previas, antecedentes familiares e historia ginecológica</div>
              </div>
            </div>
            <q-btn
              flat
              round
              dense
              color="grey-7"
              :icon="collapsedSections.salud ? 'expand_more' : 'expand_less'"
              @click.stop="toggleSection('salud')"
            />
          </q-card-section>

          <q-slide-transition>
            <div v-show="!collapsedSections.salud">
              <q-separator />
              <q-card-section>
                <!-- Grid de Patologías Previas -->
                <div class="row q-col-gutter-sm">
                  <div
                    v-for="(item, key) in antecedentesList"
                    :key="key"
                    class="col-12"
                  >
                    <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">{{ item.label }}</span>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.antecedentes[key].aplica"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            toggle-color="primary"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>
                      <q-slide-transition>
                        <div v-if="formData.antecedentes[key].aplica" class="q-mt-sm">
                          <q-input
                            v-model="formData.antecedentes[key].detalle"
                            label="Especificar diagnóstico, evolución o tratamiento..."
                            type="textarea"
                            autogrow
                            class="minimal-input"
                            borderless
                            dense
                          />
                        </div>
                      </q-slide-transition>
                    </div>
                  </div>
                </div>

                <!-- Antecedentes Hereditarios Relevantes -->
                <div class="q-mt-md">
                  <div class="text-subtitle2 text-grey-8 q-mb-xs">Antecedentes Familiares Hereditarios</div>
                  <q-input
                    v-model="formData.antecedentes.hereditariosRelevantes"
                    type="textarea"
                    autogrow
                    placeholder="Enfermedades autoinmunes, melanoma, problemas tiroideos o metabólicos familiares..."
                    class="minimal-input"
                    borderless
                    dense
                  />
                </div>

                <!-- Historia Ginecológica -->
                <div class="q-mt-md">
                  <div class="text-subtitle2 text-grey-8 q-mb-xs">Historia Ginecológica</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-md-4">
                      <div class="hybrid-subitem q-pa-sm rounded-borders text-center">
                        <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Embarazo o Lactancia?</div>
                        <q-btn-toggle
                          v-model="formData.ginecologia.embarazoLactancia"
                          no-caps
                          dense
                          rounded
                          unelevated
                          class="toggle-hybrid"
                          toggle-color="primary"
                          color="grey-2"
                          text-color="grey-8"
                          :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                        />
                      </div>
                    </div>

                    <div class="col-12 col-md-4">
                      <div class="hybrid-subitem q-pa-sm rounded-borders text-center">
                        <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Anticonceptivos?</div>
                        <q-btn-toggle
                          v-model="formData.ginecologia.anticonceptivos"
                          no-caps
                          dense
                          rounded
                          unelevated
                          class="toggle-hybrid"
                          toggle-color="primary"
                          color="grey-2"
                          text-color="grey-8"
                          :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                        />
                      </div>
                    </div>

                    <div class="col-12 col-md-4">
                      <div class="hybrid-subitem q-pa-sm rounded-borders text-center">
                        <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">¿Climaterio / Menopausia?</div>
                        <q-btn-toggle
                          v-model="formData.ginecologia.climaterioMenopausia"
                          no-caps
                          dense
                          rounded
                          unelevated
                          class="toggle-hybrid"
                          toggle-color="primary"
                          color="grey-2"
                          text-color="grey-8"
                          :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>

        <!-- 2. ALERGIAS -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection('alergias')"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="orange-1" text-color="orange-9" icon="warning" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">Alergias</div>
                <div class="text-caption text-grey-7">Reacciones adversas a medicamentos, alimentos, cosméticos y metales</div>
              </div>
            </div>
            <q-btn
              flat
              round
              dense
              color="grey-7"
              :icon="collapsedSections.alergias ? 'expand_more' : 'expand_less'"
              @click.stop="toggleSection('alergias')"
            />
          </q-card-section>

          <q-slide-transition>
            <div v-show="!collapsedSections.alergias">
              <q-separator />
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div
                    v-for="(item, key) in alergiasList"
                    :key="key"
                    class="col-12"
                  >
                    <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">{{ item.label }}</span>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.alergias[key].aplica"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            toggle-color="primary"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>
                      <q-slide-transition>
                        <div v-if="formData.alergias[key].aplica" class="q-mt-sm">
                          <q-input
                            v-model="formData.alergias[key].detalle"
                            label="Indicar sustancias, componentes o reacción..."
                            type="textarea"
                            autogrow
                            class="minimal-input"
                            borderless
                            dense
                          />
                        </div>
                      </q-slide-transition>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>

        <!-- 3. SEGURIDAD, MEDICACIÓN & CONTRAINDICACIONES -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection('seguridad')"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="red-1" text-color="negative" icon="security" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">Seguridad, Medicación & Contraindicaciones</div>
                <div class="text-caption text-grey-7">Validación indispensable para aparatología, peelings y gabinete</div>
              </div>
            </div>
            <q-btn
              flat
              round
              dense
              color="grey-7"
              :icon="collapsedSections.seguridad ? 'expand_more' : 'expand_less'"
              @click.stop="toggleSection('seguridad')"
            />
          </q-card-section>

          <q-slide-transition>
            <div v-show="!collapsedSections.seguridad">
              <q-separator />
              <q-card-section>
                <!-- Contraindicaciones Críticas -->
                <div class="text-subtitle2 text-negative q-mb-sm flex items-center">
                  <q-icon name="error_outline" class="q-mr-xs" />
                  Contraindicaciones Clínicas Absolutas / Relativas
                </div>

                <div class="row q-col-gutter-sm q-mb-md">
                  <div
                    v-for="(item, key) in contraindicacionesList"
                    :key="key"
                    class="col-12"
                  >
                    <div
                      class="hybrid-subitem q-py-sm q-px-md rounded-borders"
                      :class="{ 'bg-red-1 border-negative': formData.contraindicaciones[key] }"
                    >
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <span
                          class="col text-body2 text-weight-medium lh-snug"
                          :class="formData.contraindicaciones[key] ? 'text-negative text-weight-bold' : 'text-grey-9'"
                        >
                          {{ item.label }}
                        </span>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.contraindicaciones[key]"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            :toggle-color="formData.contraindicaciones[key] ? 'negative' : 'primary'"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Medicación y Suplementos -->
                <div class="text-subtitle2 text-grey-8 q-mb-xs">Medicación y Suplementos</div>
                <div class="row q-col-gutter-sm q-mb-md">
                  <div
                    v-for="(item, key) in medicacionList"
                    :key="key"
                    class="col-12"
                  >
                    <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">{{ item.label }}</span>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.medicacion[key].aplica"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            toggle-color="primary"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>
                      <q-slide-transition>
                        <div v-if="formData.medicacion[key].aplica" class="q-mt-sm">
                          <q-input
                            v-model="formData.medicacion[key].detalle"
                            label="Fármaco, dosis, tiempo de uso o zona..."
                            type="textarea"
                            autogrow
                            class="minimal-input"
                            borderless
                            dense
                          />
                        </div>
                      </q-slide-transition>
                    </div>
                  </div>
                </div>

                <!-- Cirugías e Intervenciones Previas -->
                <div class="text-subtitle2 text-grey-8 q-mb-xs">Cirugías e Intervenciones Previas</div>
                <div class="row q-col-gutter-sm">
                  <!-- Cirugías Generales -->
                  <div class="col-12">
                    <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">Cirugías generales previas</span>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.cirugias.generales.aplica"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            toggle-color="primary"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>
                      <q-slide-transition>
                        <div v-if="formData.cirugias.generales.aplica" class="row q-col-gutter-sm q-mt-xs">
                          <div class="col-12 col-sm-8">
                            <q-input
                              v-model="formData.cirugias.generales.detalle"
                              label="Detalle de cirugías (año, tipo)..."
                              class="minimal-input"
                              borderless
                              dense
                            />
                          </div>
                          <div class="col-12 col-sm-4">
                            <q-input
                              v-model="formData.cirugias.generales.zona"
                              label="Zona corporal..."
                              class="minimal-input"
                              borderless
                              dense
                            />
                          </div>
                        </div>
                      </q-slide-transition>
                    </div>
                  </div>

                  <!-- Intervenciones Estéticas -->
                  <div class="col-12">
                    <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">Intervenciones estéticas poco invasivas</span>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.cirugias.esteticasPocoInvasivas.aplica"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            toggle-color="primary"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>
                      <q-slide-transition>
                        <div v-if="formData.cirugias.esteticasPocoInvasivas.aplica" class="row q-col-gutter-sm q-mt-xs">
                          <div class="col-12 col-sm-8">
                            <q-input
                              v-model="formData.cirugias.esteticasPocoInvasivas.detalle"
                              label="Detalle (toxina, rellenos, hilos, peelings)..."
                              class="minimal-input"
                              borderless
                              dense
                            />
                          </div>
                          <div class="col-12 col-sm-4">
                            <q-input
                              v-model="formData.cirugias.esteticasPocoInvasivas.zona"
                              label="Zona de aplicación..."
                              class="minimal-input"
                              borderless
                              dense
                            />
                          </div>
                        </div>
                      </q-slide-transition>
                    </div>
                  </div>

                  <!-- Tratamientos estéticos últimos 2 años -->
                  <div class="col-12 q-mt-xs">
                    <q-input
                      v-model="formData.cirugias.tratamientosUltimosDosAnos"
                      label="Tratamientos estéticos realizados en los últimos 2 años"
                      type="textarea"
                      autogrow
                      placeholder="Láser, radiofrecuencia, peelings médicos, limpiezas profundas..."
                      class="minimal-input"
                      borderless
                      dense
                    />
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>

        <!-- 4. HÁBITOS & ESTILO DE VIDA -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection('habitos')"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="blue-1" text-color="blue-8" icon="self_improvement" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">Hábitos & Estilo de Vida</div>
                <div class="text-caption text-grey-7">Rutinas cotidianas, hidratación, cuidado solar y descanso</div>
              </div>
            </div>
            <q-btn
              flat
              round
              dense
              color="grey-7"
              :icon="collapsedSections.habitos ? 'expand_more' : 'expand_less'"
              @click.stop="toggleSection('habitos')"
            />
          </q-card-section>

          <q-slide-transition>
            <div v-show="!collapsedSections.habitos">
              <q-separator />
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-4">
                    <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">¿Fuma?</span>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.habitos.fuma"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            toggle-color="primary"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-md-4">
                    <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">¿Consume alcohol?</span>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.habitos.consumeAlcohol"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            toggle-color="primary"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-md-4">
                    <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                      <div class="row items-center justify-between q-gutter-x-sm">
                        <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">Agua adecuada (2L)</span>
                        <div class="col-auto">
                          <q-btn-toggle
                            v-model="formData.habitos.ingestaAdecuada"
                            no-caps
                            rounded
                            dense
                            unelevated
                            class="toggle-hybrid"
                            toggle-color="primary"
                            color="grey-2"
                            text-color="grey-8"
                            :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Escalas de Bienestar y Rutina -->
                <div class="q-mt-md q-gutter-y-xs bg-grey-1 q-pa-sm rounded-borders">
                  <!-- Actividad física -->
                  <div class="scale-item q-py-xs border-bottom-light q-px-xs">
                    <div class="row items-center justify-between scale-row">
                      <span class="text-body2 text-weight-medium text-grey-8">Actividad física</span>
                      <q-btn-toggle
                        v-model="formData.habitos.actividadFisica"
                        no-caps
                        dense
                        rounded
                        unelevated
                        class="toggle-hybrid scale-toggle"
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
                  </div>

                  <!-- Calidad del sueño -->
                  <div class="scale-item q-py-xs border-bottom-light q-px-xs">
                    <div class="row items-center justify-between scale-row">
                      <span class="text-body2 text-weight-medium text-grey-8">Calidad del sueño</span>
                      <q-btn-toggle
                        v-model="formData.habitos.calidadSueno"
                        no-caps
                        dense
                        rounded
                        unelevated
                        class="toggle-hybrid scale-toggle"
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
                  </div>

                  <!-- Nivel de estrés -->
                  <div class="scale-item q-py-xs q-px-xs">
                    <div class="row items-center justify-between scale-row">
                      <span class="text-body2 text-weight-medium text-grey-8">Nivel de estrés</span>
                      <q-btn-toggle
                        v-model="formData.habitos.nivelEstres"
                        no-caps
                        dense
                        rounded
                        unelevated
                        class="toggle-hybrid scale-toggle"
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
                </div>

                <!-- Cuidado & Exposición Solar -->
                <div class="text-subtitle2 text-grey-8 q-mt-md q-mb-xs">Cuidado & Exposición Solar</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="formData.habitos.protectorSolar"
                      label="Uso de protector solar (FPS, frecuencia)..."
                      class="minimal-input"
                      borderless
                      dense
                    />
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="formData.habitos.exposicionSolar"
                      label="Exposición solar habitual..."
                      class="minimal-input"
                      borderless
                      dense
                    />
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>

      <!-- Columna Lateral Sticky: Resumen de Seguridad & Alertas -->
      <div class="col-12 col-lg-4">
        <div class="sticky-summary">
          <q-card flat bordered class="live-summary-card">
            <q-card-section class="q-py-sm">
              <div class="row items-center no-wrap">
                <q-icon name="assignment_late" class="q-mr-xs text-negative flex-shrink-0" size="20px" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-negative">
                    Alertas Clínicas en Vivo
                  </div>
                  <div class="text-caption text-grey-7">
                    Monitoreo en tiempo real de contraindicaciones y riesgos
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator />

            <q-card-section class="q-gutter-y-sm">
              <!-- Alertas Críticas -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">CONTRAINDICACIONES CRÍTICAS</div>
                <div v-if="alertasCriticas.length > 0" class="q-gutter-y-xs">
                  <div
                    v-for="(alerta, idx) in alertasCriticas"
                    :key="idx"
                    class="row items-start no-wrap q-py-xs q-px-sm bg-red-1 rounded-borders text-negative"
                  >
                    <q-icon name="report_problem" size="18px" class="q-mr-xs flex-shrink-0 q-mt-xs" />
                    <span class="text-caption text-weight-bold lh-snug col" style="word-break: break-word; overflow-wrap: break-word;">{{ alerta }}</span>
                  </div>
                </div>
                <div v-else class="text-caption text-positive flex items-center">
                  <q-icon name="check_circle" size="16px" class="q-mr-xs" />
                  Sin contraindicaciones críticas declaradas
                </div>
              </div>

              <q-separator />

              <!-- Medicación Relevante -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">MEDICACIÓN RELEVANTE</div>
                <div v-if="alertasMedicacion.length > 0" class="q-gutter-y-xs">
                  <div
                    v-for="(med, idx) in alertasMedicacion"
                    :key="idx"
                    class="row items-start no-wrap q-py-xs q-px-sm bg-amber-1 rounded-borders text-amber-9"
                  >
                    <q-icon name="medication" size="18px" class="q-mr-xs flex-shrink-0 q-mt-xs" />
                    <span class="text-caption text-weight-medium lh-snug col" style="word-break: break-word; overflow-wrap: break-word;">{{ med }}</span>
                  </div>
                </div>
                <div v-else class="text-caption text-grey-5 italic">Sin medicación de impacto inmediato</div>
              </div>

              <q-separator />

              <!-- Alergias Declaradas -->
              <div>
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">ALERGIAS REGISTRADAS</div>
                <div v-if="alertasAlergias.length > 0" class="q-gutter-y-xs">
                  <div
                    v-for="(al, idx) in alertasAlergias"
                    :key="idx"
                    class="row items-start no-wrap q-py-xs q-px-sm bg-orange-1 rounded-borders text-orange-9"
                  >
                    <q-icon name="warning" size="18px" class="q-mr-xs flex-shrink-0 q-mt-xs" />
                    <span class="text-caption text-weight-medium lh-snug col" style="word-break: break-word; overflow-wrap: break-word;">{{ al }}</span>
                  </div>
                </div>
                <div v-else class="text-caption text-grey-5 italic">Sin alergias declaradas</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, watch } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
});

const collapsedSections = reactive({
  salud: false,
  alergias: false,
  seguridad: false,
  habitos: false
});

function toggleSection(sec) {
  collapsedSections[sec] = !collapsedSections[sec];
}

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

const alergiasList = {
  alimentarias: { label: 'Alimentarias (almendras, gluten, aspirinetas, lactosa)' },
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

const medicacionList = {
  cronica: { label: 'Medicación crónica (antihistamínicos, corticoides, etc.)' },
  topica: { label: 'Medicación tópica' },
  anticoagulantes: { label: 'Anticoagulantes' },
  isotretinoina: { label: 'Isotretinoína (actual o últimos 6-12 meses)' },
  antibioticosRecientes: { label: 'Antibióticos recientes' },
  suplementos: { label: 'Suplementos (vitaminas, magnesio, colágeno, etc.)' }
};

const formData = reactive({
  // 1. Antecedentes
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

  // 2. Historia ginecológica
  ginecologia: {
    embarazoLactancia: false,
    anticonceptivos: false,
    climaterioMenopausia: false
  },

  // 3. Alergias
  alergias: {
    alimentarias: { aplica: false, detalle: '' },
    medicamentos: { aplica: false, detalle: '' },
    cosmeticosMetales: { aplica: false, detalle: '' },
    cutaneasDeclaradas: { aplica: false, detalle: '' }
  },

  // 4. Medicación
  medicacion: {
    cronica: { aplica: false, detalle: '' },
    topica: { aplica: false, detalle: '' },
    anticoagulantes: { aplica: false, detalle: '' },
    isotretinoina: { aplica: false, detalle: '' },
    antibioticosRecientes: { aplica: false, detalle: '' },
    suplementos: { aplica: false, detalle: '' }
  },

  // 5. Cirugías
  cirugias: {
    generales: { aplica: false, detalle: '', zona: '' },
    esteticasPocoInvasivas: { aplica: false, detalle: '', zona: '' },
    tratamientosUltimosDosAnos: ''
  },

  // 6. Contraindicaciones
  contraindicaciones: {
    marcapasos: false,
    implantesMetalicos: false,
    tratamientoOncologico: false,
    heridasInfecciones: false,
    anticoagulantesSinAutorizacion: false
  },

  // 7. Hábitos
  habitos: {
    fuma: false,
    consumeAlcohol: false,
    ingestaAdecuada: true,
    actividadFisica: '',
    calidadSueno: '',
    nivelEstres: '',
    protectorSolar: '',
    exposicionSolar: ''
  }
});

// Alertas calculadas en vivo
const alertasCriticas = computed(() => {
  const alerts = [];
  if (formData.contraindicaciones.marcapasos) alerts.push('Marcapasos (Contraindicación aparatología electromagnética)');
  if (formData.contraindicaciones.implantesMetalicos) alerts.push('Implantes metálicos en zona a tratar');
  if (formData.contraindicaciones.tratamientoOncologico) alerts.push('Tratamiento oncológico activo');
  if (formData.contraindicaciones.heridasInfecciones) alerts.push('Heridas o infecciones abiertas en zona');
  if (formData.contraindicaciones.anticoagulantesSinAutorizacion) alerts.push('Anticoagulantes sin autorización médica');
  if (formData.ginecologia.embarazoLactancia) alerts.push('Embarazo / Lactancia activa');
  return alerts;
});

const alertasMedicacion = computed(() => {
  const alerts = [];
  if (formData.medicacion.isotretinoina.aplica) alerts.push('Isotretinoína (Precaución: fotosensibilidad y cicatrización)');
  if (formData.medicacion.anticoagulantes.aplica) alerts.push('Anticoagulantes declarados');
  if (formData.medicacion.cronica.aplica) alerts.push('Medicación crónica activa');
  if (formData.medicacion.antibioticosRecientes.aplica) alerts.push('Antibióticos recientes');
  return alerts;
});

const alertasAlergias = computed(() => {
  const alerts = [];
  if (formData.alergias.cosmeticosMetales.aplica) alerts.push('Alergia a cosméticos / metales');
  if (formData.alergias.medicamentos.aplica) alerts.push('Alergia a medicamentos');
  if (formData.alergias.alimentarias.aplica) alerts.push('Alergia alimentaria');
  if (formData.alergias.cutaneasDeclaradas.aplica) alerts.push('Alergias cutáneas activas');
  return alerts;
});

function resetData() {
  Object.keys(formData.antecedentes).forEach(k => {
    if (typeof formData.antecedentes[k] === 'object' && formData.antecedentes[k] !== null) {
      formData.antecedentes[k].aplica = false;
      formData.antecedentes[k].detalle = '';
    } else {
      formData.antecedentes[k] = '';
    }
  });

  formData.ginecologia.embarazoLactancia = false;
  formData.ginecologia.anticonceptivos = false;
  formData.ginecologia.climaterioMenopausia = false;

  Object.keys(formData.alergias).forEach(k => {
    formData.alergias[k].aplica = false;
    formData.alergias[k].detalle = '';
  });

  Object.keys(formData.medicacion).forEach(k => {
    formData.medicacion[k].aplica = false;
    formData.medicacion[k].detalle = '';
  });

  formData.cirugias.generales = { aplica: false, detalle: '', zona: '' };
  formData.cirugias.esteticasPocoInvasivas = { aplica: false, detalle: '', zona: '' };
  formData.cirugias.tratamientosUltimosDosAnos = '';

  formData.contraindicaciones.marcapasos = false;
  formData.contraindicaciones.implantesMetalicos = false;
  formData.contraindicaciones.tratamientoOncologico = false;
  formData.contraindicaciones.heridasInfecciones = false;
  formData.contraindicaciones.anticoagulantesSinAutorizacion = false;

  formData.habitos.fuma = false;
  formData.habitos.consumeAlcohol = false;
  formData.habitos.ingestaAdecuada = true;
  formData.habitos.actividadFisica = '';
  formData.habitos.calidadSueno = '';
  formData.habitos.nivelEstres = '';
  formData.habitos.protectorSolar = '';
  formData.habitos.exposicionSolar = '';

  updateSnapshot();
}

function loadData(data) {
  if (!data) return;

  const val = (snake, camel, defaultVal = null) => {
    if (data[snake] !== undefined && data[snake] !== null) return data[snake];
    if (camel && data[camel] !== undefined && data[camel] !== null) return data[camel];
    return defaultVal;
  };

  // 1. Antecedentes
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

  // 2. Ginecología
  formData.ginecologia.embarazoLactancia = !!val('pregnant_or_lactating', 'pregnantOrLactating', false);
  formData.ginecologia.anticonceptivos = !!val('uses_contraceptives', 'usesContraceptives', false);
  formData.ginecologia.climaterioMenopausia = !!val('climacteric_or_menopause', 'climactericOrMenopause', false);

  // 3. Alergias
  formData.alergias.alimentarias.aplica = !!val('has_food_allergies', 'hasFoodAllergies', false);
  formData.alergias.alimentarias.detalle = val('food_allergies_detail', 'foodAllergiesDetail', '') || '';
  formData.alergias.medicamentos.aplica = !!val('has_drug_allergies', 'hasDrugAllergies', false);
  formData.alergias.medicamentos.detalle = val('drug_allergies_detail', 'drugAllergiesDetail', '') || '';
  formData.alergias.cosmeticosMetales.aplica = !!val('has_cosmetic_metal_allergies', 'hasCosmeticMetalAllergies', false);
  formData.alergias.cosmeticosMetales.detalle = val('cosmetic_metal_allergies_detail', 'cosmeticMetalAllergiesDetail', '') || '';
  formData.alergias.cutaneasDeclaradas.aplica = !!val('has_skin_allergies', 'hasSkinAllergies', false);
  formData.alergias.cutaneasDeclaradas.detalle = val('skin_allergies_detail', 'skinAllergiesDetail', '') || '';

  // 4. Medicación
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

  // 5. Cirugías
  formData.cirugias.generales.detalle = val('general_surgeries_detail', 'generalSurgeriesDetail', '') || '';
  formData.cirugias.generales.aplica = !!(formData.cirugias.generales.detalle || val('has_general_surgeries', 'hasGeneralSurgeries', false));
  formData.cirugias.generales.zona = val('general_surgeries_zone', 'generalSurgeriesZone', '') || '';
  formData.cirugias.esteticasPocoInvasivas.aplica = !!val('has_aesthetic_interventions', 'hasAestheticInterventions', false);
  formData.cirugias.esteticasPocoInvasivas.detalle = val('aesthetic_interventions_detail', 'aestheticInterventionsDetail', '') || '';
  formData.cirugias.esteticasPocoInvasivas.zona = val('aesthetic_interventions_zone', 'aestheticInterventionsZone', '') || '';
  formData.cirugias.tratamientosUltimosDosAnos = val('aesthetic_treatments', 'aestheticTreatments', '') || val('treatments_last_two_years', 'treatmentsLastTwoYears', '') || '';

  // 6. Contraindicaciones
  formData.contraindicaciones.marcapasos = !!val('has_pacemaker', 'hasPacemaker', false);
  formData.contraindicaciones.implantesMetalicos = !!val('has_metal_implants', 'hasMetalImplants', false);
  formData.contraindicaciones.tratamientoOncologico = !!val('has_active_oncological_treatment', 'hasActiveOncologicalTreatment', false);
  formData.contraindicaciones.heridasInfecciones = !!val('has_open_wounds_infections', 'hasOpenWoundsInfections', false);
  formData.contraindicaciones.anticoagulantesSinAutorizacion = !!val('has_unauthorized_anticoagulants', 'hasUnauthorizedAnticoagulants', false);

  // 7. Hábitos
  formData.habitos.fuma = !!val('smoker', 'smoker', false);
  formData.habitos.consumeAlcohol = !!val('alcohol_consumer', 'alcoholConsumer', false);
  formData.habitos.ingestaAdecuada = val('adequate_dietary_intake', 'adequateDietaryIntake', true) ?? true;
  formData.habitos.actividadFisica = val('physical_activity', 'physicalActivity', '') || '';
  formData.habitos.calidadSueno = val('sleep_quality', 'sleepQuality', '') || '';
  formData.habitos.nivelEstres = val('stress_level', 'stressLevel', '') || '';
  formData.habitos.protectorSolar = val('sunscreen_use', 'sunscreenUse', '') || '';
  formData.habitos.exposicionSolar = val('sun_exposure', 'sunExposure', '') || '';

  updateSnapshot();
}

function toBackendPayload() {
  return {
    // 1. Antecedentes
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

    // 2. Hábitos
    smoker: formData.habitos.fuma,
    alcohol_consumer: formData.habitos.consumeAlcohol,
    adequate_dietary_intake: formData.habitos.ingestaAdecuada,
    physical_activity: formData.habitos.actividadFisica || '',
    sleep_quality: formData.habitos.calidadSueno || '',
    stress_level: formData.habitos.nivelEstres || '',
    sunscreen_use: formData.habitos.protectorSolar || '',
    sun_exposure: formData.habitos.exposicionSolar || '',

    // 3. Ginecología
    pregnant_or_lactating: formData.ginecologia.embarazoLactancia,
    uses_contraceptives: formData.ginecologia.anticonceptivos,
    climacteric_or_menopause: formData.ginecologia.climaterioMenopausia,

    // 4. Medicación
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

    // 6. Cirugías
    has_general_surgeries: !!(formData.cirugias.generales.detalle || formData.cirugias.generales.aplica),
    general_surgeries_detail: formData.cirugias.generales.detalle || '',
    general_surgeries_zone: formData.cirugias.generales.zona || '',
    has_aesthetic_interventions: !!(formData.cirugias.tratamientosUltimosDosAnos || formData.cirugias.esteticasPocoInvasivas.aplica),
    aesthetic_interventions_detail: formData.cirugias.esteticasPocoInvasivas.aplica ? formData.cirugias.esteticasPocoInvasivas.detalle : '',
    aesthetic_treatments: formData.cirugias.tratamientosUltimosDosAnos || '',
    treatments_last_two_years: formData.cirugias.tratamientosUltimosDosAnos || '',

    // 7. Contraindicaciones
    has_pacemaker: formData.contraindicaciones.marcapasos,
    has_metal_implants: formData.contraindicaciones.implantesMetalicos,
    has_active_oncological_treatment: formData.contraindicaciones.tratamientoOncologico,
    has_open_wounds_infections: formData.contraindicaciones.heridasInfecciones,
    has_unauthorized_anticoagulants: formData.contraindicaciones.anticoagulantesSinAutorizacion
  };
}

const lastSavedSnapshot = ref('');

function updateSnapshot() {
  try {
    lastSavedSnapshot.value = JSON.stringify(toBackendPayload());
  } catch (e) {
    console.warn('Error calculando snapshot de salud y hábitos', e);
  }
}

function isDirty() {
  if (!lastSavedSnapshot.value) return false;
  try {
    return JSON.stringify(toBackendPayload()) !== lastSavedSnapshot.value;
  } catch (e) {
    return false;
  }
}

// Inicializar snapshot
updateSnapshot();

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      loadData(newVal);
    }
  },
  { immediate: true }
);

defineExpose({
  formData,
  loadData,
  toBackendPayload,
  resetData,
  isDirty,
  updateSnapshot
});
</script>

<style scoped>
.health-habits-container {
  width: 100%;
}

.hybrid-card {
  border-radius: 12px;
  border-color: #e0e0e0;
  background-color: #fafbfc;
}

.live-summary-card {
  border-radius: 12px;
  border-color: #d1d5db;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.sticky-summary {
  position: sticky;
  top: 80px;
}

.header-collapsible {
  background-color: #f1f5f9;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.hybrid-subitem {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.hybrid-subitem:hover {
  border-color: #cbd5e1;
}

.border-negative {
  border-color: #ef4444 !important;
}

.toggle-hybrid {
  border: 1px solid #d0d7de;
  border-radius: 20px;
  overflow: hidden;
}

.toggle-hybrid :deep(.q-btn) {
  min-width: 54px;
  padding: 4px 12px;
  font-weight: 600;
  font-size: 13px;
}

.scale-item {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.scale-row {
  min-height: 40px;
  padding: 4px 8px;
}

.scale-toggle {
  border-radius: 16px;
}

.border-bottom-light {
  border-bottom: 1px dashed #e2e8f0;
}

.minimal-input {
  background: #f8fafc !important;
  border-radius: 12px;
  border: 1px solid #e0e4ea !important;
  box-shadow: none !important;
  font-size: 14px;
  padding: 4px 12px;
  transition: all 0.2s ease;
}

.minimal-input:focus-within {
  border-color: #1976d2 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
}

.minimal-input :deep(textarea) {
  resize: none;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}
</style>
