<template>
  <q-card class="col-8">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="antecedentes" label="Antecedentes Médicos"/>
      <q-tab name="apoyoDomiciliario" label="Apoyo Domiciliario"/>
      <q-tab name="diagnostico" label="Observación y Diagnóstico"/>
      <q-tab name="lesiones" label="Observación de Lesiones"/>
    </q-tabs>
    <q-separator/>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="antecedentes">
        <div class="text-h6">Antecedentes Médicos</div>
        <antecedentes-medicos :id-cliente="id" />
      </q-tab-panel>
      <q-tab-panel name="apoyoDomiciliario">
        <div class="text-h6">Apoyo Domiciliario</div>
        <apoyo-domiciliario :id-cliente="id" />
      </q-tab-panel>
      <q-tab-panel name="diagnostico">
        <div class="text-h6">Observación y Diagnóstico</div>
        <observacion-diagnostico :id-cliente="id" />
      </q-tab-panel>
      <q-tab-panel name="lesiones">
        <div class="text-h6">Observación de Lesiones</div>
        <observacion-lesiones :id-cliente="id" />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import AntecedentesMedicos from 'components/AntecedentesMedicos.vue'
import ObservacionDiagnostico from 'components/ObservacionDiagnostico.vue'
import ObservacionLesiones from 'components/ObservacionLesiones.vue'
import ApoyoDomiciliario from 'components/ApoyoDomiciliario.vue'

export default defineComponent({
  name: 'TreatmentInformation',
  components: {
    ApoyoDomiciliario,
    ObservacionLesiones,
    ObservacionDiagnostico,
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
