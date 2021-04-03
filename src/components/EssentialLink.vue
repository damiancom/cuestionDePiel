<template>
  <q-item
    clickable
    tag="a"
    :to="'/Paciente/'+idPaciente"
  >
    <q-item-section>
      <q-item-label>{{ nombre }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    nombre: {
      type: String,
      required: true
    },
    idPaciente: {
      type: String,
      default: ''
    }
  }
})
</script>
