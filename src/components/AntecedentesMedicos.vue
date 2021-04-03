<template>
  <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-md"
  >
    <div class="row">
      <q-input
        filled
        v-model="intervencionesQuirurgicas"
        label="Intervenciones Quirúrgicas"
        lazy-rules
        :rules="intervencionesQuirurgicasRules"
        :counter="maxLengthIntervencionesQuirurgicas"
        class="col-6"
      />
      <q-separator/>
      <q-input
        filled
        v-model="enfermedades"
        label="Enfermedades"
        lazy-rules
        :rules="enfermedadesRules"
        :counter="maxLengthEnfermedades"
        class="col-6"
      />
    </div>
    <div class="row">
      <q-input
        filled
        v-model="alergias"
        label="Alergias"
        lazy-rules
        :rules="alergiasRules"
        :counter="maxLengthAlergias"
        class="col-6"
      />
      <q-separator/>
      <q-input
        filled
        v-model="medicamentos"
        label="Medicamentos"
        lazy-rules
        :rules="medicamentosRules"
        :counter="maxLengthMedicamentos"
        class="col-6"
      />
    </div>
    <q-input
      filled
      v-model="habitos"
      label="Hábitos"
      lazy-rules
      :rules="habitosRules"
      :counter="maxLengthHabitos"
      class="col-6"
    />
    <q-input
      filled
      v-model="antecedentesEnfCutaneas"
      label="Antecedentes de Enfermedades Cutáneas"
      lazy-rules
      :rules="antecedentesEnfCutaneasRules"
      :counter="maxLengthAntecedentesEnfCutaneas"
      class="col-6"
    />
    <q-input
      filled
      v-model="antecedentesFam"
      label="Antecedentes Familiares"
      lazy-rules
      :rules="antecedentesFamRules"
      :counter="maxLengthAntecedentesFam"
      class="col-6"
    />
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AntecedentesMedicos',
  data () {
    return {
      maxLengthIntervencionesQuirurgicas: 0,
      maxLengthAntecedentesEnfCutaneas: 0,
      maxLengthAntecedentesFam: 0,
      maxLengthHabitos: 0,
      maxLengthMedicamentos: 0,
      maxLengthAlergias: 0,
      maxLengthEnfermedades: 0
    }
  }
})
</script>

<style scoped>

</style>
