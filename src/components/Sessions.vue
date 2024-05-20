<template>
  <div>
    <q-list bordered class="rounded-borders">
      <q-expansion-item switch-toggle-side
                        expand-separator
                        :label="`Sesión ${index + 1}`"
                        :caption="`${formatearFecha(sesion.date)}`"
                        v-for="(sesion, index) in sesiones"
                        :key="sesion.id"
      >
        <q-card>
          <q-card-section class="q-pa-lg-xl">
            <q-input filled bottom-slots class="col-6" readonly label="Tratamiento" :value="`${sesion.treatment}`"/>
            <q-input filled bottom-slots class="col-6" readonly label="Observaciones" :value="`${sesion.observation}`"/>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Editar" icon="r_edit" @click="editarSesion(sesion)"/>
          </q-card-actions>
        </q-card>
      </q-expansion-item>
    </q-list>

    <Session
      :mostrar-session="mostrarNuevaSesion"
      :id-patient="idCliente"
      :id-session="idSesion || 0"
      :fecha-session="fechaSesion"
      :observacion="observation"
      :tratamiento="treatment"
      v-on:close-dialog="closePopUpNewSesion()"
    />

    <q-card-actions class="full-width row justify-center content-center">
      <q-btn-group class="vertical-bottom" rounded>
        <q-btn rounded outline color="primary" label="Nueva sesión" icon="r_note_add" @click="agregarNuevaSesion()"/>
      </q-btn-group>
    </q-card-actions>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { session } from './models'
import { Loading } from 'quasar'
import axios, { AxiosResponse } from 'axios'
import { URI_SESIONES, URL_PACIENTES } from 'src/js/constants'
import { formatearFecha } from 'src/js/utils'
import Session from 'components/session.vue'

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
