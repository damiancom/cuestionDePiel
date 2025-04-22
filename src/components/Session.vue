<template>
  <q-dialog v-model="showSession" persistent>
    <q-card style="width: 80vw; max-width: 80vw; height: 80vh;" class="column no-wrap">
      <q-card-section class="q-pb-none">
        <div class="text-h6">Nueva sesión</div>
      </q-card-section>

      <q-card-section class="q-pt-none scroll" style="flex: 1;">
        <q-form class="q-gutter-md">
          <q-input
            filled
            autogrow
            counter
            type="textarea"
            label="Observaciones"
            maxlength="10000"
            v-model="observation"
          />

          <q-input
            filled
            autogrow
            counter
            type="textarea"
            label="Tratamiento"
            maxlength="10000"
            v-model="treatment"
          />

          <q-input
            filled
            label="Fecha de sesión"
            v-model="sessionDateStr"
            type="date"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          color="secondary"
          label="Confirmar"
          icon="r_check"
          v-close-popup
          @click="altaSesion"
        />
        <q-btn
          flat
          color="negative"
          label="Cancelar"
          icon="r_clear"
          v-close-popup
          @click="$emit('close-dialog')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { session } from 'components/models'
import axios from 'axios'
import { URI_SESIONES, URL_PACIENTES } from 'src/js/constants'
import { Loading, Notify } from 'quasar'
import { formatearFechaDB } from 'src/js/utils'

export default defineComponent({
  name: 'sesion',
  props: {
    idPatient: {
      type: Number,
      required: true
    },
    showSession: {
      type: Boolean,
      default: false,
      required: true
    },
    idSession: {
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
    sessionDate: {
      type: [Date, String],
      default: () => new Date()
    }
  },
  data () {
    return {
      sessionDateStr: ''
    }
  },
  watch: {
    sessionDate: {
      immediate: true,
      handler (newVal) {
        this.sessionDateStr = formatearFechaDB(newVal)
      }
    }
  },
  methods: {
    altaSesion () {
      Loading.show()

      const nuevaSesion: session = {
        id: this.idSession === 0 ? undefined : this.idSession,
        observation: this.observation,
        treatment: this.treatment,
        date: new Date(this.sessionDateStr)
      }

      console.log('[DAMIAN] Nueva sesion', nuevaSesion)

      const axiosCall = this.idSession === 0
        ? axios.post(`${URL_PACIENTES}/${this.idPatient}/${URI_SESIONES}`, nuevaSesion, {
          headers: { 'Content-Type': 'application/json' }
        })
        : axios.patch(`${URL_PACIENTES}/${this.idPatient}/${URI_SESIONES}/${this.idSession}`, nuevaSesion, {
          headers: { 'Content-Type': 'application/json' }
        })

      axiosCall
        .then(() => {
          this.idSession === 0 ? this.informaAltaSesion() : this.informaActualizaSesion()
          Loading.hide()
          this.cerrarPopUp()
        })
        .catch(error => {
          console.error('Ocurrió un error al guardar la sesión del paciente... ', error)
          Loading.hide()
        })
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
