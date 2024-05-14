<template>
  <div>
    <q-input filled v-model="diagnosis.reasonForConsultation" label="Motivo de la consulta"/>
    <q-input filled v-model="diagnosis.skinBiotype" label="Biotipo"/>
    <q-input filled v-model="diagnosis.phototype" label="Fototipo"/>
    <q-input filled v-model="diagnosis.recommendations" label="Recomendaciones"/>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Lesión</div>
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="diagnosis.skinLesion.onset" label="Inicio"/>
        <q-input filled v-model="diagnosis.skinLesion.onsetLocation" label="Lugar de inicio"/>
        <q-input filled v-model="diagnosis.skinLesion.symptoms" label="Síntomas"/>
        <q-input filled v-model="diagnosis.skinLesion.evolution" label="Evolución"/>
        <q-input filled v-model="diagnosis.skinLesion.changes" label="Cambios"/>
        <q-input filled v-model="diagnosis.skinLesion.riskIncreasingFactors" label="Factores que incrementan riesgo"/>
        <q-input filled v-model="diagnosis.skinLesion.postTreatment" label="Tratamientos posteriores"/>
      </q-card-section>
    </q-card>
    <q-card-actions class="full-width row justify-center content-center">
      <q-btn-group class="vertical-bottom" rounded>
        <q-btn rounded outline color="secondary" label="Actualizar observaciones" icon="r_check" @click="actualizarObservaciones()"/>
      </q-btn-group>
    </q-card-actions>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import {diagnosis, skinLesion} from 'components/models'
import axios, {AxiosResponse} from 'axios'
import {URI_DIAGNOSTICOS, URL_PACIENTES} from 'src/js/constants'
import {Loading, Notify} from 'quasar'

export default defineComponent({
  name: 'ObservacionDiagnostico',
  props: {
    idCliente: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      diagnosis: <diagnosis>{}
    }
  },
  created () {
    this.diagnosis = {
      reasonForConsultation: '',
      skinBiotype: '',
      phototype: '',
      recommendations: '',
      skinLesion: {} as skinLesion
    }
    this.cargarObservaciones()
  },
  methods: {
    cargarObservaciones () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_DIAGNOSTICOS}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<diagnosis>) => {
          this.diagnosis = response.data
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar el diagnóstico del paciente... ', error)
          Loading.hide()
        })
    },
    actualizarObservaciones () {
      Loading.show()
      axios
        .patch(`${URL_PACIENTES}/${this.idCliente}/${URI_DIAGNOSTICOS}`, this.diagnosis, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<diagnosis>) => {
          this.diagnosis = response.data
          Loading.hide()
          Notify.create({
            type: 'positive',
            message: 'Se ha actualizado el diagnóstico correctamente.'
          })
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar actualizar el diagnóstico del paciente... ', error)
          Loading.hide()
        })
    }
  }
})
</script>

<style scoped>

</style>
