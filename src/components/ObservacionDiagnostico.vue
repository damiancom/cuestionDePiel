<template>
  <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-md"
  >
    <q-input
      filled
      v-model="biotipoCutaneo"
      label="Biotipo Cutáneo"
      lazy-rules
      :rules="biotipoCutaneoRules"
      :counter="maxLengthBiotipoCutaneo"
    />
    <q-input
      filled
      v-model="fototipo"
      label="Fototipo"
      lazy-rules
      :rules="fototipoRules"
      :counter="maxLengthFototipo"
    />
    <div class="row">
      <q-input
        filled
        v-model="edadCronologica"
        label="Edad Cronológica"
        lazy-rules
        :rules="edadCronologicaRules"
        :counter="maxLengthEdadCronologica"
        class="col-6"
      />
      <q-separator/>
      <q-input
        filled
        v-model="edadAparente"
        label="Edad Aparente"
        lazy-rules
        :rules="edadAparenteRules"
        :counter="maxLengthEdadAparente"
        class="col-6"
      />
    </div>
    <q-input
      filled
      v-model="observaciones"
      label="Observaciones"
      lazy-rules
      :rules="observacionesRules"
      :counter="maxLengthObservaciones"
      class="col-6"
    />
    <q-input
      filled
      v-model="tratamiento"
      label="Tratamiento"
      lazy-rules
      :rules="tratamientoRules"
      :counter="maxLengthTratamiento"
      class="col-6"
    />
    <q-input
      filled
      v-model="frecuenciaSesiones"
      label="Frecuencia de Sesiones"
      lazy-rules
      :rules="frecuenciaSesionesRules"
      :counter="maxLengthFrecuenciaSesiones"
      class="col-6"
    />
    <q-input
      filled
      v-model="apoyoDomiciliario"
      label="Apoyo Domiciliario"
      lazy-rules
      :rules="apoyoDomiciliarioRules"
      :counter="maxLengthApoyoDomiciliario"
      class="col-6"
    />
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ObservacionDiagnostico'
})
</script>

<style scoped>

</style>
