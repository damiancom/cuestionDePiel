<template>
  <q-dialog v-model="mostrarSesion" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Nueva sesión</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input filled bottom-slots label="Observaciones" v-model="observation" class="col-6"/>
        <q-input filled bottom-slots label="Tratamiento" v-model="treatment" class="col-6"/>
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
import {defineComponent} from '@vue/composition-api'
import {session} from 'components/models'
import axios from 'axios'
import {URI_SESIONES, URL_PACIENTES} from 'src/js/constants'
import {Loading, Notify} from 'quasar'
import {formatearFechaDB} from 'src/js/utils'

export default defineComponent({
  name: 'sesion',
  props: {
    idPaciente: {
      type: Number,
      required: true
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
    observation: {
      type: String,
      default: null,
      required: false
    },
    treatment: {
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
    return {}
  },
  methods: {
    altaSesion () {
      Loading.show()
      console.log('[DAMIAN] Fecha a dar de alta', this.fechaSesion, formatearFechaDB(this.fechaSesion))
      if (this.idSesion === 0) {
        // Tengo que dar de alta una nueva sesion
        const nuevaSesion: session = {
          observation: this.observation,
          treatment: this.treatment,
          date: formatearFechaDB(this.fechaSesion) as unknown as Date
        }
        console.log('[DAMIAN] Fecha a dar de alta', this.fechaSesion, formatearFechaDB(this.fechaSesion))
        axios
          .post(`${URL_PACIENTES}/${this.idPaciente}/${URI_SESIONES}`, nuevaSesion, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then(() => {
            this.informaAltaSesion()
            Loading.hide()
            this.cerrarPopUp()
          })
          .catch(error => {
            console.error('Ocurrio un error al intentar insertar la nueva sesion del paciente... ', error)
            Loading.hide()
          })
      } else {
        const nuevaSesion: session = {
          id: this.idSesion,
          observation: this.observation,
          treatment: this.treatment,
          date: formatearFechaDB(this.fechaSesion) as unknown as Date
        }
        console.log('[DAMIAN] Fecha a dar de alta', this.fechaSesion, formatearFechaDB(this.fechaSesion))
        axios
          .patch(`${URL_PACIENTES}/${this.idPaciente}/${URI_SESIONES}/${this.idSesion}`, nuevaSesion, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then(() => {
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
