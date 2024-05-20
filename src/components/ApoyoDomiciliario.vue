<template>
  <div>
    <q-input filled autogrow counter v-model="currentRoutine" label="Rutina actual" maxlength="10000"/>
    <q-input filled autogrow counter v-model="dayRoutine" label="Rutina de día" maxlength="10000"/>
    <q-input filled autogrow counter v-model="nightRoutine" label="Rutina de noche" maxlength="10000"/>
    <q-input filled autogrow counter v-model="weeklyRoutine" label="Rutina semanal" maxlength="10000"/>
    <q-input filled autogrow counter v-model="recommendations" label="Recomendaciones" maxlength="10000"/>
    <q-card title="Rutinas"  v-show="rutinas.length > 0">
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-item-label header>Rutinas del patient</q-item-label>

          <q-separator spaced/>

          <q-item v-for="routine of rutinas" :key="routine.id">
            <q-item-section avatar top>
              <q-icon name="r_picture_as_pdf" color="black" size="34px"/>
            </q-item-section>

            <q-item-section class="col-2 gt-sm">
              <span class="text-weight-medium">{{ routine.name }}</span>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                <span class="cursor-pointer" @click="downloadRutina(routine.id)">Descargar archivo</span>
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="deleteRutinaPdf(routine.id)"/>
              </div>
            </q-item-section>
          </q-item>

        </q-list>
      </q-card-section>
    </q-card>
    <q-card v-show="showUpload">
      <q-card-section>
        <q-uploader
          :url="getUrlUpload"
          label="Seleccione las rutinas a cargar"
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ref="uploaderRutines"
          field-name="file"
          @finish="uploadedUpload"
          @failed="failedUpload"
          @uploading="uploadingRoutine"
        >
          <template v-slot:list="scope">
            <q-list separator>

              <q-item v-for="file in scope.files" :key="file.name">
                <q-item-section>
                  <q-item-label class="full-width ellipsis">
                    {{ file.name }}
                  </q-item-label>

                  <q-item-label caption>
                    Status: {{ file.__status }}
                  </q-item-label>

                  <q-item-label caption>
                    {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                  </q-item-label>
                </q-item-section>

                <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                  <img :src="file.__img.src" alt="file image">
                </q-item-section>

                <q-item-section top side>
                  <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="scope.removeFile(file)"/>
                </q-item-section>
              </q-item>

            </q-list>
          </template>
        </q-uploader>
      </q-card-section>
    </q-card>
    <q-card-actions class="full-width row justify-center content-center">
      <q-btn-group class="vertical-bottom" rounded>
        <q-btn rounded outline color="secondary" label="Actualizar Apoyo Domiciliario" icon="r_check"
               @click="actualizarApoyoDomiciliario()"/>
        <q-btn rounded outline color="primary" label="Subir routine PDF" icon="r_cloud_upload"
               @click="subirRutinaPDF()"/>
      </q-btn-group>
    </q-card-actions>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { homeSupport, routine } from 'components/models'
import axios, { AxiosResponse } from 'axios'
import { URI_APOYOS_DOMICILIARIOS, URI_RUTINAS, URL_PACIENTES } from 'src/js/constants'
import { Loading, Notify, QUploader } from 'quasar'
import { base64ToArrayBuffer } from 'src/js/utils'

export default defineComponent({
  name: 'ApoyoDomiciliario',
  props: {
    idCliente: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentRoutine: '',
      dayRoutine: '',
      nightRoutine: '',
      weeklyRoutine: '',
      recommendations: '',
      homeSupport: <homeSupport>{},
      showUpload: false,
      rutinas: <routine[]>[]
    }
  },
  created () {
    this.cargarApoyoDomiciliario()
    this.getPdfRutinas()
  },
  methods: {
    cargarApoyoDomiciliario () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_APOYOS_DOMICILIARIOS}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<homeSupport>) => {
          this.homeSupport = response.data
          this.setearDatosApoyoDomiciliarioEnInputs()
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar el apoyo domiciliario del patient... ', error)
          Loading.hide()
        })
    },
    actualizarApoyoDomiciliario () {
      Loading.show()
      if (this.validarCambios()) {
        this.actualizarDatosApoyoDomiciliario()
        axios
          .patch(`${URL_PACIENTES}/${this.idCliente}/${URI_APOYOS_DOMICILIARIOS}`, this.homeSupport, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then((response: AxiosResponse<homeSupport>) => {
            this.homeSupport = response.data
            this.setearDatosApoyoDomiciliarioEnInputs()
            Loading.hide()
            Notify.create({
              type: 'positive',
              message: 'Se ha actualizado el apoyo domiciliario correctamente.'
            })
          })
          .catch(error => {
            console.error('Ocurrio un error al intentar actualizar el apoyo domiciliario del patient... ', error)
            Loading.hide()
          })
      } else {
        alert('No hay modificaciones para guardar.')
      }
    },
    setearDatosApoyoDomiciliarioEnInputs () {
      this.currentRoutine = this.homeSupport.currentRoutine
      this.dayRoutine = this.homeSupport.dayRoutine
      this.nightRoutine = this.homeSupport.nightRoutine
      this.weeklyRoutine = this.homeSupport.weeklyRoutine
      this.recommendations = this.homeSupport.recommendations
    },
    actualizarDatosApoyoDomiciliario () {
      this.homeSupport = {
        currentRoutine: this.currentRoutine,
        dayRoutine: this.dayRoutine,
        nightRoutine: this.nightRoutine,
        weeklyRoutine: this.weeklyRoutine,
        recommendations: this.recommendations
      }
    },
    validarCambios (): boolean {
      return !(this.currentRoutine === this.homeSupport.currentRoutine &&
        this.dayRoutine === this.homeSupport.dayRoutine &&
        this.nightRoutine === this.homeSupport.nightRoutine &&
        this.weeklyRoutine === this.homeSupport.weeklyRoutine &&
        this.recommendations === this.homeSupport.recommendations)
    },
    getUrlUpload () {
      return `${URL_PACIENTES}/${this.idCliente}/${URI_RUTINAS}`
    },
    subirRutinaPDF () {
      this.showUpload = true
    },
    uploadingRoutine () {
      Loading.show()
    },
    uploadedUpload () {
      Notify.create({
        type: 'positive',
        message: 'La routine se guardó correctamente.'
      })
      this.getPdfRutinas()
      this.showUpload = false
      const uploader = this.$refs.uploaderRutines as QUploader
      uploader.reset()
      Loading.hide()
    },
    failedUpload () {
      Notify.create({
        type: 'negative',
        message: 'Ocurrió un error al subir la routine.'
      })
      Loading.hide()
    },
    downloadRutina (idRutina : number) {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_RUTINAS}/${idRutina}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<routine>) => {
          const routine = response.data
          const arrayBuffer = base64ToArrayBuffer(routine.multipartFile)
          const blob = new Blob([arrayBuffer])
          const fileName = routine.name
          if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, fileName)
          } else {
            const link = document.createElement('a')
            // Browsers that support HTML5 download attribute
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob)
              link.setAttribute('href', url)
              link.setAttribute('download', fileName)
              link.style.visibility = 'hidden'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
          }
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar la routine del patient... ', error)
          Loading.hide()
        })
    },
    getPdfRutinas () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_RUTINAS}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<routine[]>) => {
          this.rutinas = response.data
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar los archivos de la routine del patient... ', error)
          Loading.hide()
        })
    },
    deleteRutinaPdf (idRutina : number) {
      Loading.show()
      axios
        .delete(`${URL_PACIENTES}/${this.idCliente}/${URI_RUTINAS}/${idRutina}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
          this.getPdfRutinas()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar eliminar la routine del patient... ', error)
          Loading.hide()
        })
    }
  }
})
</script>

<style scoped>

</style>
