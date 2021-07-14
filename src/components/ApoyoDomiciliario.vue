<template>
  <div>
    <q-input filled v-model="motivoConsulta" label="Motivo de la consulta"/>
    <q-input filled v-model="rutinaDia" label="Rutina de día"/>
    <q-input filled v-model="rutinaNoche" label="Rutina de noche"/>
    <q-input filled v-model="rutinaSemanal" label="Rutina semanal"/>
    <q-card title="Rutinas"  v-show="rutinas.length > 0">
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <q-item-label header>Rutinas del paciente</q-item-label>

          <q-separator spaced/>

          <q-item v-for="rutina of rutinas" :key="rutina.id">
            <q-item-section avatar top>
              <q-icon name="r_picture_as_pdf" color="black" size="34px"/>
            </q-item-section>

            <q-item-section class="col-2 gt-sm">
              <span class="text-weight-medium">{{ rutina.nombre }}</span>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                <span class="cursor-pointer" @click="downloadRutina(rutina.id)">Descargar archivo</span>
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="deleteRutinaPdf(rutina.id)"/>
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
    <q-btn-group class="vertical-bottom" rounded>
      <q-btn rounded outline color="secondary" label="Actualizar Apoyo Domiciliario" icon="r_check"
             @click="actualizarApoyoDomiciliario()"/>
      <q-btn rounded outline color="secondary" label="Subir rutina PDF" icon="r_cloud_upload"
             @click="subirRutinaPDF()"/>
    </q-btn-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { apoyoDomiciliario, rutina } from 'components/models'
import axios, { AxiosResponse } from 'axios'
import { URI_APOYOS_DOMICILIARIOS, URL_PACIENTES, URI_RUTINAS } from 'src/js/constants'
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
      motivoConsulta: '',
      rutinaDia: '',
      rutinaNoche: '',
      rutinaSemanal: '',
      apoyoDomiciliario: <apoyoDomiciliario>{},
      showUpload: false,
      rutinas: <rutina[]>[]
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
        .then((response: AxiosResponse<apoyoDomiciliario>) => {
          this.apoyoDomiciliario = response.data
          this.setearDatosApoyoDomiciliarioEnInputs()
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar el apoyo domiciliario del paciente... ', error)
          Loading.hide()
        })
    },
    actualizarApoyoDomiciliario () {
      Loading.show()
      if (this.validarCambios()) {
        this.actualizarDatosApoyoDomiciliario()
        axios
          .patch(`${URL_PACIENTES}/${this.idCliente}/${URI_APOYOS_DOMICILIARIOS}`, this.apoyoDomiciliario, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then((response: AxiosResponse<apoyoDomiciliario>) => {
            this.apoyoDomiciliario = response.data
            this.setearDatosApoyoDomiciliarioEnInputs()
            Loading.hide()
            Notify.create({
              type: 'positive',
              message: 'Se ha actualizado el apoyo domiciliario correctamente.'
            })
          })
          .catch(error => {
            console.error('Ocurrio un error al intentar actualizar el apoyo domiciliario del paciente... ', error)
            Loading.hide()
          })
      } else {
        alert('No hay modificaciones para guardar.')
      }
    },
    setearDatosApoyoDomiciliarioEnInputs () {
      this.motivoConsulta = this.apoyoDomiciliario.motivoConsulta
      this.rutinaDia = this.apoyoDomiciliario.rutinaDia
      this.rutinaNoche = this.apoyoDomiciliario.rutinaNoche
      this.rutinaSemanal = this.apoyoDomiciliario.rutinaSemanal
    },
    actualizarDatosApoyoDomiciliario () {
      this.apoyoDomiciliario = {
        motivoConsulta: this.motivoConsulta,
        rutinaDia: this.rutinaDia,
        rutinaNoche: this.rutinaNoche,
        rutinaSemanal: this.rutinaSemanal
      }
    },
    validarCambios (): boolean {
      return !(this.motivoConsulta === this.apoyoDomiciliario.motivoConsulta &&
        this.rutinaDia === this.apoyoDomiciliario.rutinaDia &&
        this.rutinaNoche === this.apoyoDomiciliario.rutinaNoche &&
        this.rutinaSemanal === this.apoyoDomiciliario.rutinaSemanal)
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
        message: 'La rutina se guardó correctamente.'
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
        message: 'Ocurrió un error al subir la rutina.'
      })
      Loading.hide()
    },
    downloadRutina (idRutina : number) {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_RUTINAS}/${idRutina}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<rutina>) => {
          const rutina = response.data
          const arrayBuffer = base64ToArrayBuffer(rutina.multipartFile)
          const blob = new Blob([arrayBuffer])
          const fileName = rutina.nombre
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
          console.error('Ocurrio un error al intentar recuperar la rutina del paciente... ', error)
          Loading.hide()
        })
    },
    getPdfRutinas () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_RUTINAS}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<rutina[]>) => {
          this.rutinas = response.data
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar los archivos de la rutina del paciente... ', error)
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
          console.error('Ocurrio un error al intentar eliminar la rutina del paciente... ', error)
          Loading.hide()
        })
    }
  }
})
</script>

<style scoped>

</style>
