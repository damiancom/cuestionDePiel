<template>
  <q-card flat>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="antecedentes" label="Antecedentes Médicos"/>
      <q-tab name="observacionDiagnostico" label="Observación y Diagnóstico"/>
      <q-tab name="homeSupport" label="Apoyo Domiciliario"/>
      <q-tab name="sesiones" label="Sesiones"/>
    </q-tabs>
    <q-separator/>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="antecedentes">
        <div class="text-h6">Antecedentes Médicos</div>
        <antecedentes-medicos :id-cliente="id" />
      </q-tab-panel>
      <q-tab-panel name="homeSupport">
        <div class="text-h6">Apoyo Domiciliario</div>
        <apoyo-domiciliario :id-cliente="id" />
      </q-tab-panel>
      <q-tab-panel name="observacionDiagnostico">
        <div class="text-h6">Observación y Diagnóstico</div>
        <observacion-diagnostico :id-cliente="id" />
      </q-tab-panel>
      <q-tab-panel name="sesiones">
        <div class="text-h6">Sesiones</div>
        <sesiones :id-cliente="id" />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import AntecedentesMedicos from 'components/AntecedentesMedicos.vue'
import ObservacionDiagnostico from 'components/ObservacionDiagnostico.vue'
import Sesiones from 'components/Sessions.vue'
import ApoyoDomiciliario from 'components/ApoyoDomiciliario.vue'

export default defineComponent({
  name: 'TreatmentInformation',
  components: {
    ApoyoDomiciliario,
    ObservacionDiagnostico,
    Sesiones,
    AntecedentesMedicos
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      tab: 'antecedentes'
    }
  }
})
</script>

<style scoped>

</style>
