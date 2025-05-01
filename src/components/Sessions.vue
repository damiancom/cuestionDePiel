<template>
  <div>
    <!-- Encabezado con título y botón -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold">Sesiones</div>
      <q-btn
        rounded
        outline
        color="primary"
        label="Nueva sesión"
        icon="r_note_add"
        @click="agregarNuevaSesion"
        class="q-ml-sm"
      />
    </div>

    <!-- Lista de sesiones -->
    <q-list bordered class="rounded-borders q-mb-md">
      <div
        v-for="(sesion) in sesiones"
        :key="sesion.id"
        class="q-pa-md q-mb-sm q-gutter-md bg-grey-1 rounded-borders shadow-1"
      >
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-subtitle1 text-weight-bold justify-between">
            {{ formatearFecha(sesion.date) }} - {{ sesion.treatment }}
            <q-btn
              flat
              dense
              round
              icon="r_edit"
              color="primary"
              @click="editarSesion(sesion)"
            />
          </div>
        </div>

        <q-input
          filled
          autogrow
          type="textarea"
          readonly
          :value="sesion.observation"
          class="full-width"
        />
      </div>
    </q-list>

    <Session
      :show-session="mostrarNuevaSesion"
      :id-patient="idCliente"
      :id-session="idSesion || 0"
      :session-date="fechaSesion"
      :observation="observation"
      :treatment="treatment"
      v-on:close-dialog="closePopUpNewSesion()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { session } from './models'
import { Loading } from 'quasar'
import axios, { AxiosResponse } from 'axios'
import { URI_SESIONES, URL_PACIENTES } from 'src/js/constants'
import { formatearFecha } from 'src/js/utils'
import Session from 'components/Session.vue'

export default defineComponent({
  name: 'Sesiones',
  components: { Session },
  props: {
    idCliente: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      mostrarNuevaSesion: false,
      observation: <string>'',
      treatment: <string>'',
      nroSesion: <number>0,
      idSesion: <number | undefined>0,
      fechaSesion: <Date | string> new Date(),
      sesiones: <session[]>[]
    }
  },
  created () {
    this.cargarSesiones()
  },
  methods: {
    formatearFecha,
    cargarSesiones () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_SESIONES}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<session[]>) => {
          this.sesiones = response.data
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar las sesiones del patient... ', error)
          this.sesiones = []
          Loading.hide()
        })
    },
    editarSesion (sesionIn: session) {
      this.idSesion = sesionIn.id
      this.observation = sesionIn.observation
      this.treatment = sesionIn.treatment
      this.fechaSesion = sesionIn.date
      this.mostrarNuevaSesion = true
    },
    agregarNuevaSesion () {
      this.idSesion = 0
      this.observation = ''
      this.treatment = ''
      this.fechaSesion = new Date()
      this.mostrarNuevaSesion = true
    },
    closePopUpNewSesion () {
      this.mostrarNuevaSesion = false
      this.cargarSesiones()
    }
  }
})
</script>

<style scoped>

</style>
