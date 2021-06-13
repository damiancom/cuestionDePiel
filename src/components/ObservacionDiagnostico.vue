<template>
  <div>
    <q-input filled v-model="diagnostico.biotipoCutaneo" label="Biotipo cutáneo"/>
    <q-input filled v-model="diagnostico.fototipo" label="Fototipo"/>

    <q-list bordered class="rounded-borders">
      <q-expansion-item switch-toggle-side expand-separator :label="`Sesión ${index + 1}`" :caption="`${formatearFecha(sesion.fecha)}`"
                        v-for="(sesion, index) in diagnostico.sesiones" :key="sesion.id"
      >
        <q-card>
          <q-card-section class="q-pa-lg-xl">
            <q-input filled bottom-slots class="col-6" readonly label="Observaciones" :value="`${sesion.observacion}`"/>
            <q-input filled bottom-slots class="col-6" readonly label="Tratamiento" :value="`${sesion.tratamiento}`"/>
            <q-input filled bottom-slots class="col-6" readonly label="Frecuencia de Sesiones" :value="`${sesion.frecuenciaSesiones}`"/>
            <q-input filled bottom-slots class="col-6" readonly label="Apoyo Domiciliario" :value="`${sesion.apoyoDomiciliario}`"/>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Editar" icon="r_edit" @click="editarSesion(sesion)"/>
          </q-card-actions>
        </q-card>
      </q-expansion-item>
    </q-list>

    <sesion
      :mostrar-sesion="mostrarNuevaSesion"
      :id-diagnostico="diagnostico.id"
      :id-paciente="idCliente"
      :id-sesion="idSesion"
      :apoyo-domiciliario="apoyoDomiciliario"
      :fecha-sesion="fechaSesion"
      :frecuencia-sesiones="frecuenciaSesiones"
      :observacion="observacion"
      :tratamiento="tratamiento"
      v-on:close-dialog="closePopUpNewSesion()"
    />

    <q-btn-group class="vertical-bottom" rounded>
      <q-btn rounded outline color="secondary" label="Actualizar diagnóstico" icon="r_check" @click="actualizarDiagnostico()"/>
      <q-btn rounded outline color="primary" label="Nueva sesión" icon="r_note_add" @click="agregarNuevaSesion()"/>
    </q-btn-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { observacionDiagnostico, sesion } from './models'
import { date, Loading, Notify } from 'quasar'
import axios, { AxiosResponse } from 'axios'
import { URI_DIAGNOSTICOS, URL_PACIENTES } from 'src/js/constants'
import { formatearFecha } from 'src/js/utils'
import Sesion from 'components/sesion.vue'

function compareSesionsDate (a: sesion, b: sesion): number {
  let valueCompare = 0
  if (!b) {
    valueCompare = 1
  }
  if (!a) {
    valueCompare = -1
  }
  if (a.fecha < b.fecha) {
    valueCompare = -1
  }
  if (a.fecha > b.fecha) {
    valueCompare = 1
  }
  return valueCompare
}

export default defineComponent({
  name: 'ObservacionDiagnostico',
  components: { Sesion },
  props: {
    idCliente: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      mostrarNuevaSesion: false,
      observacion: <string>'',
      tratamiento: <string>'',
      frecuenciaSesiones: <string>'',
      apoyoDomiciliario: <string>'',
      nroSesion: <number>0,
      idSesion: <number | undefined>0,
      fechaSesion: <Date | string> new Date(),
      diagnostico: <observacionDiagnostico>{}
    }
  },
  created () {
    this.cargarObservacionDiagnostico()
  },
  methods: {
    cargarObservacionDiagnostico () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_DIAGNOSTICOS}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<observacionDiagnostico>) => {
          this.diagnostico = response.data
          if (this.diagnostico && this.diagnostico.sesiones) {
            this.diagnostico.sesiones.sort(compareSesionsDate)
          }
          console.log(this.diagnostico)
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar el diagnostico del paciente... ', error)
          Loading.hide()
        })
    },
    fechaAltaDiagnostico (fecha: Date): string {
      return date.formatDate(fecha, 'DD MMMM YYYY', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      })
    },
    actualizarDiagnostico () {
      Loading.show()
      axios
        .patch(`${URL_PACIENTES}/${this.idCliente}/${URI_DIAGNOSTICOS}`, this.diagnostico, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<observacionDiagnostico>) => {
          this.diagnostico = response.data
          Loading.hide()
          Notify.create({
            type: 'positive',
            message: 'Se han actualizado el diagnostico correctamente.'
          })
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar actualizar el diagnostico del paciente... ', error)
          Loading.hide()
        })
    },
    formatearFecha (fechaNac: Date | string): string {
      if (fechaNac !== null) {
        if (typeof fechaNac === 'string') {
          fechaNac = fechaNac.toString() + 'T00:00'
        } else {
          fechaNac.setHours(0, 0, 0, 0)
        }
        return formatearFecha(fechaNac)
      } else {
        return ''
      }
    },
    editarSesion (sesionIn: sesion) {
      console.log(this.diagnostico)
      this.idSesion = sesionIn.id
      this.observacion = sesionIn.observacion
      this.tratamiento = sesionIn.tratamiento
      this.frecuenciaSesiones = sesionIn.frecuenciaSesiones
      this.apoyoDomiciliario = sesionIn.apoyoDomiciliario
      this.fechaSesion = sesionIn.fecha
      this.mostrarNuevaSesion = true
    },
    agregarNuevaSesion () {
      console.log(this.diagnostico)
      this.idSesion = 0
      this.observacion = ''
      this.tratamiento = ''
      this.frecuenciaSesiones = ''
      this.apoyoDomiciliario = ''
      this.fechaSesion = new Date()
      this.mostrarNuevaSesion = true
    },
    closePopUpNewSesion () {
      this.mostrarNuevaSesion = false
      this.cargarObservacionDiagnostico()
    }
  }
})
</script>

<style scoped>

</style>
