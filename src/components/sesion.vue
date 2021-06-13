<template>
  <q-dialog v-model="mostrarSesion" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Nueva sesión - {{ idDiagnostico }} - {{ idDiagnosticoModificar }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input filled bottom-slots label="Observaciones" v-model="observacion" class="col-6"/>
        <q-input filled bottom-slots label="Tratamiento" v-model="tratamiento" class="col-6"/>
        <q-input filled bottom-slots label="Frecuencia de Sesiones" v-model="frecuenciaSesiones" class="col-6"/>
        <q-input filled bottom-slots label="Apoyo Domiciliario" v-model="apoyoDomiciliario" class="col-6"/>
        <q-input filled bottom-slots label="Fecha Sesión" v-model="fechaSesion" type="date" class="col-6"/>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="secondary" label="Confirmar" icon="r_check" v-close-popup @click="altaSesion()"/>
        <q-btn flat color="negative" label="Cancelar" icon="r_clear" v-close-popup @click="$emit('close-dialog')"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { observacionDiagnostico, sesion } from 'components/models'
import axios, { AxiosResponse } from 'axios'
import { URI_DIAGNOSTICOS, URI_SESIONES, URL_PACIENTES } from 'src/js/constants'
import { Loading, Notify } from 'quasar'
import { formatearFechaDB } from 'src/js/utils'

export default defineComponent({
  name: 'sesion',
  props: {
    idPaciente: {
      type: Number,
      required: true
    },
    idDiagnostico: {
      type: Number,
      default: null
    },
    mostrarSesion: {
      type: Boolean,
      default: false,
      required: true
    },
    idSesion: {
      type: Number,
      required: true
    },
    observacion: {
      type: String,
      default: null,
      required: false
    },
    tratamiento: {
      type: String,
      default: null,
      required: false
    },
    frecuenciaSesiones: {
      type: String,
      default: null,
      required: false
    },
    apoyoDomiciliario: {
      type: String,
      default: null,
      required: false
    },
    fechaSesion: {
      type: Date,
      default: function () {
        return new Date()
      }
    }
  },
  data () {
    return {
      idDiagnosticoModificar: <number>0
    }
  },
  methods: {
    async altaSesion () {
      Loading.show()
      console.log(this.idDiagnosticoModificar, this.idDiagnostico, this.idSesion)
      if (this.idSesion === 0) {
        // Tengo que dar de alta una nueva sesion
        if (this.idDiagnostico === undefined) {
          console.log('Voy a dar de alta el diagnostico...')
          await this.altaDiagnostico()
          this.idDiagnosticoModificar = this.idDiagnostico
        }
        const nuevaSesion: sesion = {
          observacion: this.observacion,
          tratamiento: this.tratamiento,
          frecuenciaSesiones: this.frecuenciaSesiones,
          apoyoDomiciliario: this.apoyoDomiciliario,
          fecha: formatearFechaDB(this.fechaSesion) as unknown as Date
        }
        axios
          .put(`${URL_PACIENTES}/${this.idPaciente}/${URI_DIAGNOSTICOS}/${this.idDiagnosticoModificar}/${URI_SESIONES}`, nuevaSesion, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then((response: AxiosResponse<observacionDiagnostico>) => {
            this.diagnostico = response.data
            this.informaAltaSesion()
            Loading.hide()
            this.cerrarPopUp()
          })
          .catch(error => {
            console.error('Ocurrio un error al intentar insertar la nueva sesion del paciente... ', error)
            Loading.hide()
          })
      } else {
        this.idDiagnosticoModificar = this.idDiagnostico
        // Tengo que modificar la sesion actual
        const nuevaSesion: sesion = {
          id: this.idSesion,
          observacion: this.observacion,
          tratamiento: this.tratamiento,
          frecuenciaSesiones: this.frecuenciaSesiones,
          apoyoDomiciliario: this.apoyoDomiciliario,
          fecha: formatearFechaDB(this.fechaSesion) as unknown as Date
        }
        axios
          .patch(`${URL_PACIENTES}/${this.idPaciente}/${URI_DIAGNOSTICOS}/${this.idDiagnosticoModificar}/${URI_SESIONES}/${this.idSesion}`, nuevaSesion, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then((response: AxiosResponse<observacionDiagnostico>) => {
            this.diagnostico = response.data
            this.informaActualizaSesion()
            Loading.hide()
            this.cerrarPopUp()
          })
          .catch(error => {
            console.error('Ocurrio un error al intentar insertar la nueva sesion del paciente... ', error)
            Loading.hide()
          })
      }
    },
    async altaDiagnostico () {
      const obsDiagnostico = {} as observacionDiagnostico
      await axios
        .post(`${URL_PACIENTES}/${this.idPaciente}/${URI_DIAGNOSTICOS}`, obsDiagnostico, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<observacionDiagnostico>) => {
          this.idDiagnosticoModificar = response.data.id
        })
        .catch(error => console.error('Ocurrio un error al intentar dar de alta el diagnostico del paciente... ', error))
    },
    informaAltaSesion () {
      Notify.create({
        type: 'positive',
        message: 'Se ha dado de alta la sesión correctamente.'
      })
    },
    informaActualizaSesion () {
      Notify.create({
        type: 'positive',
        message: 'Se ha actualizado la sesión correctamente.'
      })
    },
    cerrarPopUp () {
      this.$emit('close-dialog')
    }
  }
})
</script>

<style scoped>

</style>
