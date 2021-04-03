<template>
  <q-form
    @submit="onSubmit"
    @reset="onReset"
    class="q-gutter-md"
  >

    <q-input
      filled
      v-model="ocupacionLaboral"
      label="Ocupación Laboral"
      lazy-rules
      :rules="ocupacionLaboralRules"
      :counter="maxLengthOcupacionLaboral"
    />

    <q-input
      filled
      v-model="aficiones"
      label="Aficiones"
      lazy-rules
      :rules="aficionesRules"
      :counter="maxLengthAficiones"
    />

    <q-input
      filled
      v-model="exposicionRiesgos"
      label="Exposición a Riesgos"
      lazy-rules
      :rules="exposicionRiesgosRules"
      :counter="maxLengthExposicionRiesgos"
    />
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AnamnesisSocial',
  methods: {
    onSubmit () {
    },
    onReset () {
    }
  }
})
</script>

<style scoped>

</style>
