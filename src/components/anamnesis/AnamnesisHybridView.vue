<template>
  <div class="hybrid-view-container">
    <div class="row q-col-gutter-lg items-start">
      <!-- Columna Principal: Bloques temáticos continuos (sin stepper bloqueante) -->
      <div class="col-12 col-lg-8 q-gutter-y-md">
        <!-- 1. SALUD GENERAL & ANTECEDENTES MÉDICOS -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="34px" color="teal-1" text-color="teal-8" icon="favorite" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">1. Salud General & Antecedentes Médicos</div>
                <div class="text-caption text-grey-7">Patologías previas, alergias y antecedentes familiares</div>
              </div>
            </div>

            <!-- Patologías con layout responsive sin truncar -->
            <div class="text-subtitle2 text-grey-8 q-mt-md q-mb-xs">Patologías Evaluadas</div>
            <div class="row q-col-gutter-sm">
              <div
                v-for="(item, key) in antecedentesList"
                :key="key"
                class="col-12 col-xl-6"
              >
                <div class="hybrid-subitem q-py-sm q-px-md rounded-borders" :class="{ 'bg-teal-0': formData.antecedentes[key].aplica }">
                  <div class="row items-center justify-between q-gutter-x-sm">
                    <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">
                      {{ item.label }}
                    </span>
                    <div class="col-auto">
                      <q-btn-toggle
                        v-model="formData.antecedentes[key].aplica"
                        no-caps
                        dense
                        rounded
                        unelevated
                        class="toggle-hybrid"
                        toggle-color="teal"
                        color="grey-2"
                        text-color="grey-8"
                        :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                      />
                    </div>
                  </div>
                  <q-slide-transition>
                    <div v-if="formData.antecedentes[key].aplica" class="q-mt-xs">
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

            <!-- Alergias -->
            <div class="text-subtitle2 text-grey-8 q-mt-md q-mb-xs">Alergias Conocidas</div>
            <div class="row q-col-gutter-sm">
              <div
                v-for="(item, key) in alergiasList"
                :key="key"
                class="col-12 col-xl-6"
              >
                <div class="hybrid-subitem q-py-sm q-px-md rounded-borders" :class="{ 'bg-orange-0': formData.alergias[key].aplica }">
                  <div class="row items-center justify-between q-gutter-x-sm">
                    <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">
                      {{ item.label }}
                    </span>
                    <div class="col-auto">
                      <q-btn-toggle
                        v-model="formData.alergias[key].aplica"
                        no-caps
                        dense
                        rounded
                        unelevated
                        class="toggle-hybrid"
                        toggle-color="orange-9"
                        color="grey-2"
                        text-color="grey-8"
                        :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                      />
                    </div>
                  </div>
                  <q-slide-transition>
                    <div v-if="formData.alergias[key].aplica" class="q-mt-xs">
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
        <q-card flat bordered class="hybrid-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="34px" color="blue-1" text-color="blue-8" icon="self_improvement" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">2. Hábitos & Estilo de Vida</div>
                <div class="text-caption text-grey-7">Rutinas cotidianas, hidratación, descanso y ginecología</div>
              </div>
            </div>

            <!-- Hábitos cotidianos: 3 columnas cuando está en tablet/desktop con detalle cerrado -->
            <div v-if="useColumnsLayout" class="row q-col-gutter-md q-mt-xs">
              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-8">¿Fuma?</div>
                <q-btn-toggle
                  v-model="formData.habitos.fuma"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-hybrid q-mt-xs"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-8">¿Consume alcohol?</div>
                <q-btn-toggle
                  v-model="formData.habitos.consumeAlcohol"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-hybrid q-mt-xs"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>

              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-8">Agua adecuada (2L)</div>
                <q-btn-toggle
                  v-model="formData.habitos.ingestaAdecuada"
                  no-caps
                  dense
                  rounded
                  unelevated
                  class="toggle-hybrid q-mt-xs"
                  toggle-color="primary"
                  color="grey-2"
                  text-color="grey-8"
                  :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                />
              </div>
            </div>

            <!-- Hábitos cotidianos: Fila completa (celular o detalle abierto) -->
            <div v-else class="q-gutter-y-xs q-mt-xs">
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

            <!-- Escalas de Bienestar y Rutina: responsive simétrico en móvil y desktop -->
            <div class="q-mt-sm q-gutter-y-xs bg-grey-1 q-pa-sm rounded-borders">
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

            <!-- Historia Ginecológica en filas completas -->
            <div class="text-subtitle2 text-grey-8 q-mt-md q-mb-xs">Historia Ginecológica</div>
            <div class="q-gutter-y-xs">
              <div class="hybrid-subitem q-py-sm q-px-md rounded-borders" :class="{ 'bg-pink-0 border-pink': formData.ginecologia.embarazoLactancia }">
                <div class="row items-center justify-between q-gutter-x-sm">
                  <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">
                    Embarazo o período de lactancia activo
                  </span>
                  <div class="col-auto">
                    <q-btn-toggle
                      v-model="formData.ginecologia.embarazoLactancia"
                      no-caps
                      dense
                      rounded
                      unelevated
                      class="toggle-hybrid"
                      toggle-color="pink-6"
                      color="grey-2"
                      text-color="grey-8"
                      :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                    />
                  </div>
                </div>
              </div>

              <div class="hybrid-subitem q-py-sm q-px-md rounded-borders" :class="{ 'bg-blue-0 border-blue': formData.ginecologia.anticonceptivos }">
                <div class="row items-center justify-between q-gutter-x-sm">
                  <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">
                    Uso de anticonceptivos
                  </span>
                  <div class="col-auto">
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
              </div>

              <div class="hybrid-subitem q-py-sm q-px-md rounded-borders" :class="{ 'bg-blue-0 border-blue': formData.ginecologia.climaterioMenopausia }">
                <div class="row items-center justify-between q-gutter-x-sm">
                  <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">
                    Climaterio / Menopausia
                  </span>
                  <div class="col-auto">
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
        </q-card>

        <!-- 3. EVALUACIÓN DERMATOLÓGICA & FOTOTIPO -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="34px" color="amber-1" text-color="amber-9" icon="face" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold">3. Evaluación Cutánea & Fototipo</div>
                <div class="text-caption text-grey-7">Fototipo de Fitzpatrick, biotipo y afección cutánea actual</div>
              </div>
            </div>

            <!-- Fototipo Fitzpatrick Interactivo (siempre 1 sola línea) -->
            <div class="q-mb-md q-pa-sm bg-grey-1 rounded-borders">
              <div class="text-subtitle2 text-grey-9 q-mb-xs">
                Clasificación de Fitzpatrick:
                <q-badge color="primary" class="q-ml-sm" v-if="formData.dermatologicos.fototipo">
                  Fototipo {{ formData.dermatologicos.fototipo }}
                </q-badge>
              </div>
              <div class="row no-wrap justify-between items-center q-py-xs fototipo-row">
                <div
                  v-for="n in 6"
                  :key="n"
                  class="fototipo-circle-hybrid cursor-pointer flex flex-center"
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
              <div class="row q-gutter-xs items-center">
                <q-chip
                  v-for="bt in biotiposOptions"
                  :key="bt"
                  clickable
                  dense
                  class="biotipo-chip"
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
                placeholder="Acné, rosácea, melasma, fotoenvejecimiento, sensibilidad..."
              />
            </div>

            <div class="row q-col-gutter-md">
              <!-- Herpes y Queloides: 2 columnas en tablet/desktop con detalle cerrado -->
              <template v-if="useColumnsLayout">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-8">¿Herpes Simple?</div>
                  <q-btn-toggle
                    v-model="formData.dermatologicos.herpesSimple"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-hybrid q-mt-xs"
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey-8">¿Cicatrización con queloides?</div>
                  <q-btn-toggle
                    v-model="formData.dermatologicos.cicatrizacionQueloides"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-hybrid q-mt-xs"
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                  />
                </div>
              </template>

              <!-- Herpes y Queloides: Fila completa (celular o detalle abierto) -->
              <template v-else>
                <div class="col-12">
                  <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                    <div class="row items-center justify-between q-gutter-x-sm">
                      <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">¿Herpes Simple?</span>
                      <div class="col-auto">
                        <q-btn-toggle
                          v-model="formData.dermatologicos.herpesSimple"
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

                <div class="col-12">
                  <div class="hybrid-subitem q-py-sm q-px-md rounded-borders">
                    <div class="row items-center justify-between q-gutter-x-sm">
                      <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">¿Cicatrización con queloides?</span>
                      <div class="col-auto">
                        <q-btn-toggle
                          v-model="formData.dermatologicos.cicatrizacionQueloides"
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
              </template>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.dermatologicos.protectorSolar"
                  label="Uso de protector solar"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.dermatologicos.exposicionSolar"
                  label="Exposición solar habitual"
                  class="minimal-input"
                  borderless
                  dense
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 4. SEGURIDAD, MEDICACIÓN & GABINETE -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="34px" color="red-1" text-color="negative" icon="security" class="q-mr-sm" />
              <div>
                <div class="text-subtitle1 text-weight-bold text-negative">4. Seguridad, Medicación & Contraindicaciones</div>
                <div class="text-caption text-grey-7">Validación indispensable para aparatología, peelings y seguridad de gabinete</div>
              </div>
            </div>

            <!-- Contraindicaciones críticas destacadas -->
            <div class="q-pa-md bg-red-0 border-negative-subtle rounded-borders q-mb-md">
              <div class="text-subtitle2 text-weight-bold text-negative q-mb-sm row items-center">
                <q-icon name="warning" class="q-mr-xs" size="20px" />
                Contraindicaciones críticas para aparatología y peelings médicos
              </div>
              <div class="q-gutter-y-xs">
                <div
                  v-for="(item, key) in contraindicacionesList"
                  :key="key"
                  class="row items-center justify-between q-py-xs border-bottom-light q-gutter-x-sm"
                >
                  <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">
                    {{ item.label }}
                  </span>
                  <div class="col-auto">
                    <q-btn-toggle
                      v-model="formData.contraindicaciones[key]"
                      no-caps
                      dense
                      rounded
                      unelevated
                      class="toggle-hybrid"
                      :toggle-color="formData.contraindicaciones[key] ? 'negative' : 'grey-7'"
                      color="grey-2"
                      text-color="grey-8"
                      :options="[{ label: 'No', value: false }, { label: 'Sí ⚠️', value: true }]"
                    />
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
                class="col-12 col-xl-6"
              >
                <div class="hybrid-subitem q-py-sm q-px-md rounded-borders" :class="{ 'bg-purple-0': formData.medicacion[key].aplica }">
                  <div class="row items-center justify-between q-gutter-x-sm">
                    <span class="col text-body2 text-weight-medium text-grey-9 lh-snug">
                      {{ item.label }}
                    </span>
                    <div class="col-auto">
                      <q-btn-toggle
                        v-model="formData.medicacion[key].aplica"
                        no-caps
                        dense
                        rounded
                        unelevated
                        class="toggle-hybrid"
                        toggle-color="purple-8"
                        color="grey-2"
                        text-color="grey-8"
                        :options="[{ label: 'No', value: false }, { label: 'Sí', value: true }]"
                      />
                    </div>
                  </div>
                  <q-slide-transition>
                    <div v-if="formData.medicacion[key].aplica" class="q-mt-xs">
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

            <!-- Cirugías & Tratamientos Estéticos -->
            <div class="text-subtitle2 text-grey-8 q-mb-xs">Cirugías & Tratamientos Estéticos</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.cirugias.generales.detalle"
                  label="Cirugías generales"
                  class="minimal-input"
                  borderless
                  dense
                  placeholder="Quirúrgicas previas, cesárea, etc..."
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formData.cirugias.tratamientosUltimosDosAnos"
                  label="Tratamientos estéticos"
                  class="minimal-input"
                  borderless
                  dense
                  placeholder="Láser, rellenos, toxina, peelings..."
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
                <div v-else class="text-caption text-positive bg-green-1 q-pa-sm rounded-borders">
                  ✓ Sin contraindicaciones críticas declaradas
                </div>
              </div>

              <!-- Perfil de Piel -->
              <div class="q-mb-md">
                <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">PERFIL CUTÁNEO</div>
                <div class="row items-center q-gutter-x-sm q-mb-xs">
                  <div class="text-body2 text-grey-8">Fototipo:</div>
                  <q-badge
                    v-if="formData.dermatologicos.fototipo"
                    :style="{ backgroundColor: getFototipoColor(formData.dermatologicos.fototipo), color: formData.dermatologicos.fototipo >= 5 ? '#fff' : '#000' }"
                    class="text-weight-bold text-caption q-pa-xs"
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
import { useQuasar } from 'quasar';

const $q = useQuasar();

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
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
});

// En tablets horizontal (>= 768px) y desktop cuando el detalle del paciente está cerrado, usamos columnas
const useColumnsLayout = computed(() => {
  return props.isSidebarCollapsed && ($q.screen.width >= 768);
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
    6: '#492f22'
  };
  return colors[n] || '#ccc';
}

const fototipoDescripcion = computed(() => {
  const desc = {
    1: 'Fototipo I: Muy clara. Siempre se quema, nunca se broncea.',
    2: 'Fototipo II: Clara. Se quema fácilmente, se broncea mínimamente.',
    3: 'Fototipo III: Media. Se quema moderadamente, se broncea gradualmente.',
    4: 'Fototipo IV: Morena clara. Rara vez se quema, se broncea con facilidad.',
    5: 'Fototipo V: Oscura. Muy rara vez se quema, se broncea intensamente.',
    6: 'Fototipo VI: Muy oscura. Nunca se quema, pigmentación profunda.'
  };
  return desc[props.formData.dermatologicos.fototipo] || 'Hacé clic sobre un círculo para seleccionar el fototipo';
});

const alertasCriticas = computed(() => {
  const list = [];
  const c = props.formData.contraindicaciones;
  if (c.marcapasos) list.push({ texto: 'Marcapasos / Implante activo', icono: 'cancel', clase: 'bg-red-1 text-negative' });
  if (c.tratamientoOncologico) list.push({ texto: 'Tratamiento Oncológico activo', icono: 'cancel', clase: 'bg-red-1 text-negative' });
  if (c.implantesMetalicos) list.push({ texto: 'Implantes metálicos en zona', icono: 'warning', clase: 'bg-orange-1 text-orange-9' });
  if (c.heridasInfecciones) list.push({ texto: 'Heridas abiertas o infección', icono: 'cancel', clase: 'bg-red-1 text-negative' });
  if (c.anticoagulantesSinAutorizacion) list.push({ texto: 'Anticoagulantes no autorizados', icono: 'warning', clase: 'bg-orange-1 text-orange-9' });

  const m = props.formData.medicacion;
  if (m.isotretinoina.aplica) list.push({ texto: 'Isotretinoína (Piel sensible / fotosensible)', icono: 'priority_high', clase: 'bg-amber-1 text-brown-9' });
  if (m.anticoagulantes.aplica) list.push({ texto: 'Uso de Anticoagulantes declarado', icono: 'priority_high', clase: 'bg-amber-1 text-brown-9' });

  const g = props.formData.ginecologia;
  if (g.embarazoLactancia) list.push({ texto: 'Embarazo o Lactancia en curso', icono: 'info', clase: 'bg-pink-1 text-pink-9' });

  return list;
});
</script>

<style scoped>
.hybrid-view-container {
  width: 100%;
}

.hybrid-card {
  border-radius: 14px;
  border-color: #e2e8f0;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.hybrid-subitem {
  border: 1px solid #edf2f7;
  transition: background-color 0.15s;
}

.bg-teal-0 {
  background-color: #f0fdf4 !important;
  border-color: #bbf7d0 !important;
}

.bg-orange-0 {
  background-color: #fffaf0 !important;
  border-color: #feebc8 !important;
}

.bg-purple-0 {
  background-color: #faf5ff !important;
  border-color: #e9d8fd !important;
}

.bg-red-0 {
  background-color: #fffafb !important;
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

.toggle-hybrid {
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
}

.toggle-hybrid :deep(.q-btn) {
  min-width: 44px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 600;
}

.minimal-input {
  background: #f8fafc !important;
  border-radius: 10px;
  border: 1px solid #e2e8f0 !important;
  font-size: 13.5px;
  padding: 2px 10px;
}

.fototipo-row {
  max-width: 100%;
}

.fototipo-circle-hybrid {
  width: clamp(34px, 8.5vw, 42px);
  height: clamp(34px, 8.5vw, 42px);
  border-radius: 50%;
  border: 2px solid transparent;
  transition: transform 0.2s, box-shadow 0.2s;
  font-weight: bold;
  font-size: clamp(13px, 3.5vw, 15px);
  user-select: none;
  flex-shrink: 0;
}

.fototipo-selected {
  transform: scale(1.18);
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.25) !important;
  z-index: 5;
}

.biotipo-chip {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
}

.scale-row {
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}

.scale-toggle {
  width: 100%;
}

.scale-toggle :deep(.q-btn) {
  flex: 1;
  min-width: 0;
  padding: 3px 6px;
  font-size: 11.5px;
}

@media (min-width: 520px) {
  .scale-row {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .scale-toggle {
    width: 250px;
    display: flex;
  }

  .scale-toggle :deep(.q-btn) {
    flex: 1 1 0;
    min-width: 0;
    padding: 2px 6px;
    font-size: 12px;
  }
}

.lh-snug {
  line-height: 1.35;
}
</style>
