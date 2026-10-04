<template>
  <div class="hybrid-view-container">
    <div class="row q-col-gutter-lg items-start">
      <!-- Columna Principal: Bloques temáticos continuos (sin stepper bloqueante) -->
      <div class="col-12 col-lg-8 q-gutter-y-md">
                <!-- EVALUACIÓN CUTÁNEA & FOTOTIPO -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection('cutanea')"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="amber-1" text-color="amber-9" icon="face" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">Evaluación Cutánea & Fototipo</div>
                <div class="text-caption text-grey-7">Fototipo de Fitzpatrick, biotipo cutáneo y condiciones de la piel</div>
              </div>
            </div>
            <q-btn
              flat
              round
              dense
              color="grey-7"
              :icon="collapsedSections.cutanea ? 'expand_more' : 'expand_less'"
              @click.stop="toggleSection('cutanea')"
            />
          </q-card-section>

          <q-slide-transition>
            <div v-show="!collapsedSections.cutanea">
              <q-separator />
              <q-card-section>
                <!-- Fototipo Fitzpatrick Interactivo (label a la izquierda, opciones distribuidas uniformemente horizontal) -->
            <div class="q-mb-md q-pa-sm bg-grey-1 rounded-borders">
              <div class="text-subtitle2 text-grey-9 q-mb-xs">
                Fototipo - Clasificación de Fitzpatrick:
                <q-badge color="primary" class="q-ml-sm" v-if="formData.dermatologicos.fototipo">
                  Fototipo {{ formData.dermatologicos.fototipo }}
                </q-badge>
              </div>
              <div class="row no-wrap items-center justify-between q-py-xs fototipo-row">
                <div
                  v-for="n in 6"
                  :key="n"
                  class="fototipo-pill-hybrid cursor-pointer"
                  :class="{ 'fototipo-selected': formData.dermatologicos.fototipo == n }"
                  :style="{ backgroundColor: getFototipoColor(n), color: n >= 5 ? '#fff' : '#333' }"
                  @click="formData.dermatologicos.fototipo = (formData.dermatologicos.fototipo == n ? null : n)"
                ><span class="q-px-sm">{{ n }}</span></div>
              </div>
              <div class="text-caption text-grey-8 q-mt-xs">
                {{ fototipoDescripcion }}
              </div>
            </div>

            <!-- Biotipo Cutáneo (en la misma línea label y selección como actividad física) -->
            <div class="q-mb-md">
              <div class="scale-item q-py-xs q-px-xs">
                <div class="row items-center justify-between scale-row">
                  <span class="text-body2 text-weight-medium text-grey-8">Biotipo Cutáneo</span>
                  <q-btn-toggle
                    v-model="formData.dermatologicos.biotipo"
                    no-caps
                    dense
                    rounded
                    unelevated
                    class="toggle-hybrid scale-toggle biotipo-toggle-unified"
                    toggle-color="primary"
                    color="grey-2"
                    text-color="grey-8"
                    clearable
                    :options="biotiposOptions"
                    @update:model-value="val => { if (!val) formData.dermatologicos.biotipo = ''; }"
                  />
                </div>
              </div>
            </div>

            <!-- Condiciones de la Piel (distribución armónica estructurada y expandida) -->
            <div class="q-mb-md">
              <div class="text-subtitle2 text-grey-8 q-mb-xs">Condiciones de la Piel</div>
              <div class="condiciones-grid q-gutter-y-xs">
                <!-- Fila 1: 3 opciones -->
                <div class="row q-gutter-x-sm no-wrap items-center justify-between">
                  <q-btn
                    v-for="cond in ['Sensible / Reactiva', 'Deshidratada', 'Acneica']"
                    :key="cond"
                    no-caps
                    rounded
                    unelevated
                    class="condition-pill-toggle col text-center"
                    :class="{ 'is-selected': isConditionSelected(cond) }"
                    @click="toggleCondition(cond)"
                  >
                    {{ cond }}
                  </q-btn>
                </div>
                <!-- Fila 2: 1 opción central (la más larga) -->
                <div class="row items-center">
                  <q-btn
                    no-caps
                    rounded
                    unelevated
                    class="condition-pill-toggle full-width text-center"
                    :class="{ 'is-selected': isConditionSelected('Discromia (Hipopigmentaciones / hiperpigmentaciones)') }"
                    @click="toggleCondition('Discromia (Hipopigmentaciones / hiperpigmentaciones)')"
                  >
                    Discromia (Hipopigmentaciones / hiperpigmentaciones)
                  </q-btn>
                </div>
                <!-- Fila 3: 2 opciones -->
                <div class="row q-gutter-x-sm no-wrap items-center justify-between">
                  <q-btn
                    v-for="cond in ['Madura', 'Fotoenvejecida']"
                    :key="cond"
                    no-caps
                    rounded
                    unelevated
                    class="condition-pill-toggle col text-center"
                    :class="{ 'is-selected': isConditionSelected(cond) }"
                    @click="toggleCondition(cond)"
                  >
                    {{ cond }}
                  </q-btn>
                </div>
              </div>
            </div>



            <div class="row q-col-gutter-md">
              <!-- Herpes y Queloides: 2 columnas en tablet/desktop con detalle cerrado -->
              <template v-if="useColumnsLayout">
                <div class="col-12 col-sm-6 text-center">
                  <div class="text-caption text-grey-8">¿Herpes Simple?</div>
                  <div class="row justify-center">
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
                </div>

                <div class="col-12 col-sm-6 text-center">
                  <div class="text-caption text-grey-8">¿Cicatrización con queloides?</div>
                  <div class="row justify-center">
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


            </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>

        <!-- SALUD GENERAL & ANTECEDENTES MÉDICOS -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection('salud')"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="teal-1" text-color="teal-8" icon="favorite" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">Salud General & Antecedentes Médicos</div>
                <div class="text-caption text-grey-7">Patologías previas, antecedentes familiares, alergias e historia ginecológica</div>
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

            <!-- Antecedentes familiares relevantes -->
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
            </div>
          </q-slide-transition>
        </q-card>

        <!-- SEGURIDAD, MEDICACIÓN & CONTRAINDICACIONES -->
        <q-card flat bordered class="hybrid-card">
          <q-card-section
            class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
            @click="toggleSection('seguridad')"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="34px" color="red-1" text-color="negative" icon="security" class="q-mr-sm flex-shrink-0" />
              <div>
                <div class="text-subtitle1 text-weight-bold">Seguridad, Medicación & Contraindicaciones</div>
                <div class="text-caption text-grey-7">Validación indispensable para aparatología, peelings y seguridad de gabinete</div>
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
            </div>
          </q-slide-transition>
        </q-card>

        <!-- HÁBITOS & ESTILO DE VIDA -->
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
                <!-- Hábitos cotidianos: 3 columnas cuando está en tablet/desktop con detalle cerrado -->
            <div v-if="useColumnsLayout" class="row q-col-gutter-md q-mt-xs">
              <div class="col-12 col-sm-4 text-center">
                <div class="text-caption text-grey-8">¿Fuma?</div>
                <div class="row justify-center">
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
              </div>

              <div class="col-12 col-sm-4 text-center">
                <div class="text-caption text-grey-8">¿Consume alcohol?</div>
                <div class="row justify-center">
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
              </div>

              <div class="col-12 col-sm-4 text-center">
                <div class="text-caption text-grey-8">Agua adecuada (2L)</div>
                <div class="row justify-center">
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

                        <!-- Cuidado & Exposición Solar -->
            <div class="text-subtitle2 text-grey-8 q-mt-md q-mb-xs">Cuidado & Exposición Solar</div>
            <div class="row q-col-gutter-sm">
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
            </div>
          </q-slide-transition>
        </q-card>
      </div>

      <!-- Columna Lateral Sticky: LIVE CLINICAL SUMMARY -->
      <div class="col-12 col-lg-4">
        <div class="sticky-summary">
          <q-card flat bordered class="live-summary-card">
            <q-card-section
              class="cursor-pointer row items-center justify-between no-wrap q-py-sm header-collapsible"
              @click="toggleSection('resumen')"
            >
              <div class="row items-center no-wrap">
                <q-icon name="assignment" class="q-mr-xs text-primary flex-shrink-0" size="20px" />
                <div>
                  <div class="text-subtitle1 text-weight-bold text-primary">
                    Resumen Clínico en Vivo
                  </div>
                  <div class="text-caption text-grey-7">
                    Alertas críticas y perfil de piel generados en tiempo real
                  </div>
                </div>
              </div>
              <div class="row items-center q-gutter-x-xs no-wrap">
                <q-badge color="teal" label="Auto-detect" class="gt-xs" />
                <q-btn
                  flat
                  round
                  dense
                  color="grey-7"
                  :icon="collapsedSections.resumen ? 'expand_more' : 'expand_less'"
                  @click.stop="toggleSection('resumen')"
                />
              </div>
            </q-card-section>

            <q-slide-transition>
              <div v-show="!collapsedSections.resumen">
                <q-separator />
                <q-card-section>
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

                    <div v-if="formData.dermatologicos.condiciones?.length" class="q-mb-xs">
                      <div class="text-caption text-grey-7">Condiciones:</div>
                      <div class="row q-gutter-xs q-mt-xs">
                        <q-badge
                          v-for="cond in formData.dermatologicos.condiciones"
                          :key="cond"
                          color="blue-1"
                          text-color="primary"
                          class="text-weight-bold"
                        >
                          {{ cond }}
                        </q-badge>
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
              </div>
            </q-slide-transition>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
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
const collapsedSections = reactive({
  cutanea: false,
  salud: false,
  seguridad: false,
  habitos: false,
  resumen: true
});

function toggleSection(sec) {
  collapsedSections[sec] = !collapsedSections[sec];
}

const useColumnsLayout = computed(() => {
  return props.isSidebarCollapsed && ($q.screen.width >= 768);
});

const biotiposOptions = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Seca', value: 'Seca' },
  { label: 'Grasa', value: 'Grasa' },
  { label: 'Mixta', value: 'Mixta' }
];

const condicionesPielOptions = [
  'Sensible / Reactiva',
  'Deshidratada',
  'Acneica',
  'Discromia (Hipopigmentaciones / hiperpigmentaciones)',
  'Madura',
  'Fotoenvejecida'
];

function isConditionSelected(cond) {
  return Array.isArray(props.formData?.dermatologicos?.condiciones) &&
    props.formData.dermatologicos.condiciones.includes(cond);
}

function toggleCondition(cond) {
  if (!props.formData?.dermatologicos) return;
  if (!Array.isArray(props.formData.dermatologicos.condiciones)) {
    props.formData.dermatologicos.condiciones = [];
  }
  const idx = props.formData.dermatologicos.condiciones.indexOf(cond);
  if (idx > -1) {
    props.formData.dermatologicos.condiciones.splice(idx, 1);
  } else {
    props.formData.dermatologicos.condiciones.push(cond);
  }
}

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
  return desc[props.formData.dermatologicos.fototipo] || 'Hacé clic para seleccionar el fototipo';
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
  min-height: 32px;
  display: inline-flex;
  align-items: stretch;
}

.toggle-hybrid :deep(.q-btn) {
  min-width: 44px;
  min-height: 32px;
  padding: 4px 12px;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
}

.minimal-input {
  background: #f8fafc !important;
  border-radius: 10px;
  border: 1px solid #e2e8f0 !important;
  font-size: 13.5px;
  padding: 2px 10px;
}

.fototipo-row {
  width: 100%;
  max-width: 100%;
  gap: 4px;
}

.fototipo-pill-hybrid {
  min-height: 32px;
  min-width: 0;
  flex: 1 1 0;
  padding: 4px 6px;
  border-radius: 16px;
  border: 2px solid transparent;
  font-weight: 700;
  font-size: 13px;
  line-height: 1.2;
  transition: all 0.2s ease-in-out;
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

@media (min-width: 520px) {
  .fototipo-row {
    gap: 8px;
  }
  .fototipo-pill-hybrid {
    padding: 5px 16px;
  }
}

.fototipo-pill-hybrid.fototipo-selected {
  transform: scale(1.05);
  border-color: #1976d2 !important;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.25) !important;
  z-index: 5;
}

.header-collapsible {
  transition: background-color 0.15s ease-in-out;
}

.header-collapsible:hover {
  background-color: #f8fafc;
}

.biotipo-toggle-unified {
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  min-height: 32px;
  display: flex;
}

.biotipo-toggle-unified :deep(.q-btn) {
  flex: 1 1 0;
  min-width: 0;
  min-height: 32px;
  padding: 4px 6px;
  font-weight: 600;
  font-size: 12.5px;
  line-height: 1.2;
}

@media (min-width: 520px) {
  .toggle-hybrid :deep(.q-btn) {
    font-size: 13px;
  }

  .biotipo-toggle-unified {
    width: 320px;
    display: inline-flex;
  }

  .biotipo-toggle-unified :deep(.q-btn) {
    padding: 4px 12px;
    font-size: 13px;
  }
}

.condition-pill-toggle {
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  min-height: 32px;
  padding: 4px 6px;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
  transition: all 0.15s ease-in-out;
}

@media (min-width: 600px) {
  .condition-pill-toggle {
    padding: 4px 14px;
    font-size: 13px;
  }
}

.condition-pill-toggle.is-selected {
  background-color: var(--q-primary) !important;
  color: #ffffff !important;
  border-color: var(--q-primary) !important;
}

.condition-pill-toggle:not(.is-selected) {
  background-color: #f1f5f9 !important;
  color: #334155 !important;
  border-color: #cbd5e1 !important;
}

.condition-pill-toggle:hover:not(.is-selected) {
  background-color: #e2e8f0 !important;
}

.scale-row {
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}

.scale-toggle {
  width: 100%;
  min-height: 32px;
}

.scale-toggle :deep(.q-btn) {
  flex: 1;
  min-width: 0;
  min-height: 32px;
  padding: 4px 6px;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
}

@media (min-width: 520px) {
  .scale-row {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }

  .scale-toggle {
    width: 260px;
    display: flex;
  }

  .scale-toggle :deep(.q-btn) {
    flex: 1 1 0;
    min-width: 0;
    padding: 4px 8px;
    font-size: 13px;
  }
}

.lh-snug {
  line-height: 1.35;
}
</style>
