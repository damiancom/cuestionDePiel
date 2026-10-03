<template>
  <q-page padding>
    <input ref="inputFoto" type="file" accept="image/*" class="hidden" @change="onFotoSelected"/>

    <div class="row q-col-gutter-lg justify-center">
      <!-- Sidebar Perfil Fijo (solo en desktop) -->
      <div v-if="!isSidebarCollapsed" class="col-12 col-md-4 col-lg-3 gt-sm">
        <q-card class="q-pa-md minimal-card patient-sidebar relative-position">
          <q-btn
            flat
            round
            dense
            icon="chevron_left"
            color="grey-6"
            size="sm"
            class="absolute-top-right q-ma-sm"
            @click="toggleSidebar"
          >
            <q-tooltip>Colapsar detalle del paciente</q-tooltip>
          </q-btn>
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
              <div class="q-mb-sm">
                <span class="text-weight-bold text-grey-8">Nacimiento:</span><br>
                {{ formatDate(patient.birth_date) }}
                <span v-if="calculateAge(patient.birth_date) !== ''" class="text-grey-7">({{ calculateAge(patient.birth_date) }} años)</span>
              </div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Profesión:</span><br>{{ patient.profession || '-' }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Dirección:</span><br>{{ patient.address }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Localidad:</span><br>{{ patient.locality }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Teléfono:</span><br>{{ patient.phone }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">Celular:</span><br>{{ patient.cellphone }}</div>
              <div class="q-mb-sm"><span class="text-weight-bold text-grey-8">E-mail:</span><br>{{ patient.email }}</div>
              <div class="q-mb-sm" v-if="patient.additional_note"><span class="text-weight-bold text-grey-8">Nota adicional:</span><br><span style="white-space: pre-wrap;">{{ patient.additional_note }}</span></div>
              <div class="q-my-sm text-center" v-if="consentStatus">
                <q-badge
                  :color="consentStatus.is_signed ? 'positive' : (consentStatus.signed_version ? 'warning' : 'negative')"
                  class="q-pa-xs cursor-pointer text-caption text-weight-bold"
                  @click="tab = 'consentimiento'"
                >
                  <q-icon :name="consentStatus.is_signed ? 'verified' : (consentStatus.signed_version ? 'update' : 'draw')" class="q-mr-xs" />
                  {{ consentStatus.is_signed ? `Consentimiento OK (v${consentStatus.signed_version})` : (consentStatus.signed_version ? 'Consentimiento Desactualizado' : 'Falta Consentimiento') }}
                </q-badge>
              </div>
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
                <div class="col-12"><q-input v-model="patientEdit.profession" label="Profesión" dense class="minimal-input" borderless /></div>
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
      <div :class="isSidebarCollapsed ? 'col-12' : 'col-12 col-md-8 col-lg-9'" class="transition-width">
        <q-card class="q-pa-md q-pa-sm-lg">
          <div class="row items-center no-wrap q-mb-md">
            <!-- Botón para mostrar el detalle del paciente (solo en desktop cuando está colapsado) -->
            <q-btn
              v-if="isSidebarCollapsed"
              flat
              dense
              no-caps
              color="primary"
              icon="chevron_right"
              class="gt-sm q-mr-sm"
              @click="toggleSidebar"
            >
              <q-avatar size="24px" class="q-mr-xs" color="blue-1" text-color="primary">
                <img v-if="patient.profile_picture" :src="patient.profile_picture" />
                <q-icon v-else name="person" size="16px" />
              </q-avatar>
              <span class="text-weight-medium gt-xs">
                {{ patient.name ? `${patient.name} ${patient.last_name}` : 'Detalle del paciente' }}
              </span>
              <q-icon
                v-if="consentStatus?.is_signed"
                name="check_circle"
                color="positive"
                size="18px"
                class="q-ml-xs cursor-pointer"
                @click.stop="tab = 'consentimiento'"
              >
                <q-tooltip>Consentimiento firmado (v{{ consentStatus.signed_version }})</q-tooltip>
              </q-icon>
              <q-icon
                v-else-if="consentStatus?.signed_version"
                name="warning"
                color="warning"
                size="18px"
                class="q-ml-xs cursor-pointer"
                @click.stop="tab = 'consentimiento'"
              >
                <q-tooltip>Consentimiento desactualizado (pendiente v{{ consentStatus.current_version }})</q-tooltip>
              </q-icon>
              <q-icon
                v-else-if="consentStatus"
                name="cancel"
                color="negative"
                size="18px"
                class="q-ml-xs cursor-pointer"
                @click.stop="tab = 'consentimiento'"
              >
                <q-tooltip>Falta consentimiento informado</q-tooltip>
              </q-icon>
              <q-tooltip>Mostrar detalle del paciente</q-tooltip>
            </q-btn>

            <q-tabs v-model="tab" class="text-primary col" align="left" dense mobile-arrows outside-arrows>
              <!-- Tab Perfil: Sólo visible en mobile (lt-md) -->
              <q-tab name="perfil" class="lt-md" no-caps>
                <div class="row items-center no-wrap">
                  <q-avatar size="24px" class="q-mr-xs" color="blue-1" text-color="primary">
                    <img v-if="patient.profile_picture" :src="patient.profile_picture" />
                    <q-icon v-else name="person" size="16px" />
                  </q-avatar>
                  <span class="text-weight-medium">
                    {{ patient.name ? `${patient.name} ${patient.last_name}` : 'Perfil del Paciente' }}
                  </span>
                  <q-icon
                    v-if="consentStatus?.is_signed"
                    name="check_circle"
                    color="positive"
                    size="18px"
                    class="q-ml-xs cursor-pointer"
                    @click.stop="tab = 'consentimiento'"
                  >
                    <q-tooltip>Consentimiento firmado (v{{ consentStatus.signed_version }})</q-tooltip>
                  </q-icon>
                  <q-icon
                    v-else-if="consentStatus?.signed_version"
                    name="warning"
                    color="warning"
                    size="18px"
                    class="q-ml-xs cursor-pointer"
                    @click.stop="tab = 'consentimiento'"
                  >
                    <q-tooltip>Consentimiento desactualizado (pendiente v{{ consentStatus.current_version }})</q-tooltip>
                  </q-icon>
                  <q-icon
                    v-else-if="consentStatus"
                    name="cancel"
                    color="negative"
                    size="18px"
                    class="q-ml-xs cursor-pointer"
                    @click.stop="tab = 'consentimiento'"
                  >
                    <q-tooltip>Falta consentimiento informado</q-tooltip>
                  </q-icon>
                </div>
              </q-tab>
              <q-tab name="observaciones" label="Anamnesis Dermatocosmiátrica" />
              <q-tab name="rutina" label="Rutina" />
              <q-tab name="sesiones" label="Sesiones" />
              <q-tab name="consentimiento" label="Consentimiento" />
            </q-tabs>
          </div>
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
                    <div class="col-12 col-sm-6">
                      <span class="text-weight-medium">Fecha de Nacimiento:</span><br>
                      {{ formatDate(patient.birth_date) }}
                      <span v-if="calculateAge(patient.birth_date) !== ''" class="text-grey-7">({{ calculateAge(patient.birth_date) }} años)</span>
                    </div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Profesión:</span><br>{{ patient.profession || '-' }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Dirección:</span><br>{{ patient.address }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Localidad:</span><br>{{ patient.locality }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Teléfono:</span><br>{{ patient.phone }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">Celular:</span><br>{{ patient.cellphone }}</div>
                    <div class="col-12 col-sm-6"><span class="text-weight-medium">E-mail:</span><br>{{ patient.email }}</div>
                    <div class="col-12" v-if="patient.additional_note"><span class="text-weight-medium">Nota adicional:</span><br><span style="white-space: pre-wrap;">{{ patient.additional_note }}</span></div>
                  </div>
                  <div class="q-my-sm text-center" v-if="consentStatus">
                    <q-badge
                      :color="consentStatus.is_signed ? 'positive' : (consentStatus.signed_version ? 'warning' : 'negative')"
                      class="q-pa-xs cursor-pointer text-caption text-weight-bold"
                      @click="tab = 'consentimiento'"
                    >
                      <q-icon :name="consentStatus.is_signed ? 'verified' : (consentStatus.signed_version ? 'update' : 'draw')" class="q-mr-xs" />
                      {{ consentStatus.is_signed ? `Consentimiento OK (v${consentStatus.signed_version})` : (consentStatus.signed_version ? 'Consentimiento Desactualizado' : 'Falta Consentimiento') }}
                    </q-badge>
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
                    <div class="col-12 col-sm-6"><q-input v-model="patientEdit.profession" label="Profesión" dense class="minimal-input" borderless /></div>
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
            <q-tab-panel name="observaciones">
              <!-- Nueva Ficha de Anamnesis Dermatocosmiátrica -->
              <AnamnesisForm ref="anamnesisFormRef" />

              <div class="row q-gutter-sm justify-end q-mt-lg">
                <q-btn flat label="Cancelar" @click="cancelarAnamnesis" color="grey-8" class="minimal-btn" />
                <q-btn label="Guardar Anamnesis" color="primary" @click="guardarAnamnesis" :loading="guardandoAnamnesis" class="minimal-btn-save" />
              </div>
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
                <q-btn
                  color="primary"
                  icon="add"
                  :label="$q.screen.gt.xs ? 'Nueva Sesión' : ''"
                  @click="nuevaSesion"
                  class="minimal-btn-save"
                >
                  <q-tooltip>Nueva Sesión</q-tooltip>
                </q-btn>
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
                    <q-btn flat label="Cancelar" @click="cancelarSesion" color="grey-8" class="minimal-btn" />
                    <q-btn label="Guardar" color="primary" @click="guardarSesion" class="minimal-btn-save" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-tab-panel>

            <!-- TAB PANEL CONSENTIMIENTO INFORMADO DIGITAL -->
            <q-tab-panel name="consentimiento">
              <div class="row items-center justify-between q-mb-md">
                <div>
                  <div class="text-h6 text-primary flex items-center">
                    <q-icon name="draw" size="24px" class="q-mr-sm" />
                    Consentimiento Informado Digital (Firma en Pantalla)
                  </div>
                  <div class="text-caption text-grey-8">
                    Resguardo legal y bioético obligatorio previo a peelings químicos con ácidos o procedimientos invasivos.
                  </div>
                </div>
                <q-badge
                  v-if="consentStatus"
                  :color="consentStatus.is_signed ? 'positive' : (consentStatus.signed_version ? 'warning' : 'negative')"
                  text-color="white"
                  class="q-px-md q-py-xs text-subtitle2 text-weight-bold"
                >
                  <q-icon :name="consentStatus.is_signed ? 'verified' : (consentStatus.signed_version ? 'update' : 'pending')" class="q-mr-xs" />
                  {{ consentStatus.is_signed ? `CONSENTIMIENTO VIGENTE (v${consentStatus.signed_version})` : (consentStatus.signed_version ? `NUEVA VERSIÓN PENDIENTE (v${consentStatus.current_version})` : `PENDIENTE DE FIRMA (v${consentStatus?.current_version || 1})`) }}
                </q-badge>
              </div>

              <!-- AVISO SI HAY NUEVA VERSIÓN -->
              <q-banner
                v-if="!consentStatus?.is_signed && consentStatus?.signed_version"
                rounded
                class="bg-orange-1 text-orange-9 q-mb-md"
                style="border-left: 4px solid #f57c00;"
              >
                <template #avatar>
                  <q-icon name="info" color="warning" size="24px" />
                </template>
                <div class="text-weight-bold">Se ha publicado una nueva versión del consentimiento (v{{ consentStatus.current_version }})</div>
                <div class="text-caption">
                  El paciente firmó oportunamente la versión <strong>v{{ consentStatus.signed_version }}</strong>. Conforme a las normas legales, se requiere firmar la última versión para mantener el consentimiento vigente.
                </div>
              </q-banner>

              <!-- TEXTO LEGAL VIGENTE LEVANTADO DEL BACKEND -->
              <q-card flat bordered class="q-pa-md q-mb-md bg-grey-1" style="max-height: 240px; overflow-y: auto; border: 1px solid #cfd8dc;">
                <div class="row items-center justify-between q-mb-xs">
                  <div class="text-weight-bold text-subtitle2 text-primary">
                    {{ consentStatus?.active_template?.title || 'TÉRMINOS DEL CONSENTIMIENTO INFORMADO' }}
                  </div>
                  <q-badge outline color="primary">Versión {{ consentStatus?.active_template?.version || 1 }}</q-badge>
                </div>
                <q-separator class="q-my-xs" />
                <div class="text-body2 text-grey-9 q-mt-sm" v-html="consentStatus?.active_template?.content"></div>
              </q-card>

              <!-- LIENZO DE FIRMA TÁCTIL O CERTIFICADO SEGÚN ESTADO -->
              <div v-if="!consentStatus?.is_signed || reFirmando">
                <q-card flat bordered class="q-pa-md q-mb-md">
                  <div class="row items-center justify-between q-mb-sm">
                    <div class="text-subtitle2 text-weight-bold">
                      <q-icon name="touch_app" color="primary" class="q-mr-xs" />
                      Lienzo de Firma Manuscrita en Pantalla / Tablet (v{{ consentStatus?.current_version || 1 }}):
                    </div>
                    <div class="row q-gutter-xs">
                      <q-btn
                        v-if="reFirmando"
                        flat
                        dense
                        color="grey-7"
                        label="Cancelar"
                        @click="reFirmando = false; limpiarFirma();"
                      />
                      <q-btn
                        flat
                        dense
                        color="negative"
                        icon="layers_clear"
                        label="Limpiar Lienzo"
                        @click="limpiarFirma"
                      />
                    </div>
                  </div>
                  <div class="signature-pad-container bg-white rounded-borders" style="border: 2px dashed #1976d2; height: 180px; max-width: 600px; margin: 0 auto; touch-action: none;">
                    <canvas
                      ref="canvasFirmaRef"
                      width="600"
                      height="180"
                      class="full-width full-height cursor-pointer"
                      @mousedown="startDrawing"
                      @mousemove="draw"
                      @mouseup="stopDrawing"
                      @mouseleave="stopDrawing"
                      @touchstart.prevent="startDrawing"
                      @touchmove.prevent="draw"
                      @touchend.prevent="stopDrawing"
                    />
                  </div>
                  <div class="row justify-between items-center q-mt-md">
                    <div class="text-caption text-grey-7">
                      Firma digital con trazabilidad y hash legal inmutable.
                    </div>
                    <q-btn
                      color="primary"
                      icon="verified_user"
                      label="Firmar y Archivar Consentimiento"
                      :loading="guardandoFirma"
                      @click="guardarFirmaConsentimiento"
                      class="minimal-btn-save"
                    />
                  </div>
                </q-card>
              </div>

              <!-- CERTIFICADO DIGITAL VIGENTE ARCHIVADO -->
              <div v-if="consentStatus?.is_signed && !reFirmando" class="q-mb-md">
                <q-card flat bordered class="q-pa-md bg-green-1" style="border-left: 5px solid #2e7d32;">
                  <div class="row items-center justify-between q-col-gutter-md">
                    <div class="col-12 col-md-8">
                      <div class="flex items-center q-mb-xs">
                        <q-icon name="verified" color="positive" size="24px" class="q-mr-xs" />
                        <span class="text-subtitle1 text-weight-bold text-positive">Consentimiento Digital Vigente (v{{ consentStatus.signed_version }})</span>
                      </div>
                      <div class="text-caption text-grey-9 q-mb-xs">
                        Firmado por: <strong>{{ consentStatus.signed_by || `${patient.name} ${patient.last_name}` }}</strong> |
                        Fecha y Hora: <strong>{{ formatDateTime(consentStatus.signed_at) }}</strong>
                      </div>
                      <div class="text-caption text-grey-8">
                        Hash SHA-256 de Seguridad: <code class="bg-white q-px-xs rounded-borders">{{ consentStatus.signature_hash }}</code>
                      </div>
                    </div>
                    <div class="col-12 col-md-4 text-center">
                      <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">Firma Registrada:</div>
                      <div class="bg-white q-pa-xs rounded-borders inline-block shadow-1" style="border: 1px solid #c8e6c9;">
                        <img :src="consentStatus.signature" alt="Firma del paciente" style="max-height: 70px; max-width: 200px; object-fit: contain;" />
                      </div>
                      <div class="q-mt-sm">
                        <q-btn
                          flat
                          dense
                          size="sm"
                          color="primary"
                          icon="edit"
                          label="Actualizar / Volver a Firmar"
                          @click="reFirmando = true"
                        />
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>

              <!-- HISTORIAL DE AUDITORÍA DE FIRMAS DE ESTE PACIENTE -->
              <div v-if="consentStatus?.history && consentStatus.history.length > 0" class="q-mt-lg">
                <div class="text-subtitle2 text-weight-bold q-mb-sm flex items-center">
                  <q-icon name="history" color="primary" class="q-mr-xs" />
                  Historial de Firmas y Versiones Archivadas del Paciente
                </div>
                <q-card flat bordered class="q-pa-xs">
                  <q-table
                    :rows="consentStatus.history"
                    :columns="historyColumns"
                    row-key="id"
                    flat
                    dense
                    hide-pagination
                    :pagination="{ rowsPerPage: 10 }"
                  >
                    <template #body-cell-status="props">
                      <q-td :props="props">
                        <q-badge :color="props.row.is_latest_version ? 'positive' : 'grey-7'">
                          {{ props.row.is_latest_version ? 'VIGENTE' : 'HISTÓRICA' }}
                        </q-badge>
                      </q-td>
                    </template>
                    <template #body-cell-signature="props">
                      <q-td :props="props">
                        <img :src="props.row.signature" alt="Firma" style="height: 30px; max-width: 90px; object-fit: contain;" />
                      </q-td>
                    </template>
                  </q-table>
                </q-card>
              </div>
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
          <q-btn flat label="Cancelar" @click="cancelCrop" color="grey-8" class="minimal-btn"/>
          <q-btn label="Confirmar" color="primary" @click="confirmCrop" class="minimal-btn-save"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PATIENTS_URL, ROUTINES_ENDPOINT, SessionsAPI, ConsentsAPI, AnamnesisAPI } from "../services/api";
import axios from "axios";
import { useQuasar } from "quasar";
import RoutineGenerator from '../components/RoutineGenerator.vue';
import AnamnesisForm from '../components/AnamnesisForm.vue';

const anamnesisFormRef = ref(null);

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const editing = ref(false);
const patient = reactive({
  id: '',
  name: '',
  last_name: '',
  birth_date: '',
  profession: '',
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
const tab = ref($q.screen.gt.sm ? 'observaciones' : 'perfil');
const isSidebarCollapsed = ref(false);

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  try {
    localStorage.setItem('patient_sidebar_collapsed', isSidebarCollapsed.value ? 'true' : 'false');
  } catch (e) {
    // Ignore storage errors
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('patient_sidebar_collapsed');
    if (saved !== null) {
      isSidebarCollapsed.value = saved === 'true';
    }
  } catch (e) {
    // Ignore storage errors
  }
  if ($q.screen.gt.sm && tab.value === 'perfil') {
    tab.value = 'observaciones';
  }
});

watch(() => $q.screen.gt.sm, (isDesktop) => {
  if (isDesktop && tab.value === 'perfil') {
    tab.value = 'observaciones';
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
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8',
      class: 'minimal-btn'
    },
    ok: {
      label: 'Eliminar',
      color: 'negative',
      class: 'minimal-btn-delete'
    },
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

const anamnesisBackup = ref(null);
const guardandoAnamnesis = ref(false);

onMounted(async () => {
  if (route.params.id) {
    await findPatientById(route.params.id);
    await fetchAnamnesis(route.params.id);
    await fetchRoutine(route.params.id);
    await fetchSessions(route.params.id);
    await fetchConsentStatus(route.params.id);
  }
});

// --- CONSENTIMIENTO INFORMADO DIGITAL ---
const consentStatus = ref(null);
const loadingConsent = ref(false);
const guardandoFirma = ref(false);
const reFirmando = ref(false);
const canvasFirmaRef = ref(null);
const firmando = ref(false);
const contextoFirma = ref(null);
const trazandoFirma = ref(false);

const historyColumns = [
  { name: 'consent_version', label: 'Versión', field: row => `v${row.consent_version}`, align: 'left' },
  { name: 'status', label: 'Estado', align: 'center' },
  { name: 'signed_at', label: 'Fecha y Hora', field: row => formatDateTime(row.signed_at), align: 'left' },
  { name: 'signed_by', label: 'Firmante', field: 'signed_by', align: 'left' },
  { name: 'signature_hash', label: 'Hash SHA-256', field: 'signature_hash', align: 'left' },
  { name: 'signature', label: 'Firma', align: 'center' }
];

async function fetchConsentStatus(patientId) {
  loadingConsent.value = true;
  try {
    const res = await ConsentsAPI.getPatientConsentStatus(patientId);
    consentStatus.value = res.data;
  } catch (error) {
    console.error('Error al cargar estado de consentimiento:', error);
  } finally {
    loadingConsent.value = false;
  }
}

function getCanvasCoordinates(e) {
  const canvas = canvasFirmaRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

function startDrawing(e) {
  firmando.value = true;
  const canvas = canvasFirmaRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#1976d2';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  contextoFirma.value = ctx;

  const { x, y } = getCanvasCoordinates(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(e) {
  if (!firmando.value || !contextoFirma.value || !canvasFirmaRef.value) return;
  const { x, y } = getCanvasCoordinates(e);
  contextoFirma.value.lineTo(x, y);
  contextoFirma.value.stroke();
  trazandoFirma.value = true;
}

function stopDrawing() {
  firmando.value = false;
}

function limpiarFirma() {
  const canvas = canvasFirmaRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  contextoFirma.value = null;
  trazandoFirma.value = false;
}

async function guardarFirmaConsentimiento() {
  if (!trazandoFirma.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, realice la firma en el recuadro antes de confirmar.'
    });
    return;
  }
  const canvas = canvasFirmaRef.value;
  if (!canvas) return;
  const signatureBase64 = canvas.toDataURL('image/png');

  try {
    guardandoFirma.value = true;
    const fullName = `${patient.name || ''} ${patient.last_name || ''}`.trim();
    await ConsentsAPI.signPatientConsent(route.params.id, {
      signature: signatureBase64,
      signed_by: fullName || `Paciente #${route.params.id}`
    });
    $q.notify({
      type: 'positive',
      icon: 'verified',
      message: 'Consentimiento firmado y archivado exitosamente en base de datos.',
      position: 'top'
    });
    reFirmando.value = false;
    limpiarFirma();
    await fetchConsentStatus(route.params.id);
  } catch (error) {
    console.error('Error al guardar firma de consentimiento:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al registrar la firma del consentimiento.',
      position: 'top'
    });
  } finally {
    guardandoFirma.value = false;
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

function findPatientById(id) {
  const patientUrl = `${PATIENTS_URL}/${id}`;
  return axios.get(patientUrl)
    .then(response => {
      console.log(response.data);
      patient.id = response.data.id;
      patient.name = response.data.name;
      patient.last_name = response.data.last_name;
      patient.birth_date = response.data.birth_date || response.data.birthDate || response.data.fechaNacimiento || response.data.bith_date;
      patient.profession = response.data.profession || '';
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

async function fetchAnamnesis(id) {
  try {
    const response = await AnamnesisAPI.get(id);
    anamnesisBackup.value = response.data;
    anamnesisFormRef.value?.loadData(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('Anamnesis not found (404), ficha en blanco.');
      return;
    }
    console.error('Error fetching anamnesis:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar anamnesis',
      position: 'top'
    });
  }
}

async function guardarAnamnesis() {
  try {
    guardandoAnamnesis.value = true;
    const payload = anamnesisFormRef.value?.toBackendPayload();
    const response = await AnamnesisAPI.save(route.params.id, payload);
    anamnesisBackup.value = response.data;
    anamnesisFormRef.value?.loadData(response.data);
    $q.notify({
      type: 'positive',
      message: 'Anamnesis guardada correctamente',
      position: 'top'
    });
  } catch (error) {
    console.error('Error guardando anamnesis:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al guardar anamnesis',
      position: 'top'
    });
  } finally {
    guardandoAnamnesis.value = false;
  }
}

function cancelarAnamnesis() {
  if (anamnesisBackup.value) {
    anamnesisFormRef.value?.loadData(anamnesisBackup.value);
  } else {
    anamnesisFormRef.value?.resetData();
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

function calculateAge(date) {
  if (!date) return '';
  const str = String(date).trim().substring(0, 10);
  let birth;
  if (str.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, m, d] = str.split('-').map(Number);
    birth = new Date(y, m - 1, d);
  } else {
    birth = new Date(date);
  }
  if (isNaN(birth.getTime())) return '';
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : '';
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

.transition-width {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), flex 0.3s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
