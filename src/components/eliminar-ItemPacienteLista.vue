<template>
  <div>
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            :src="foto"
          ></q-img>
        </q-card-section>

        <q-card-section class="q-pt-xs">
          <div class="text-h5 q-mt-sm q-mb-xs">{{ nombre }}</div>
          <div class="text-overline"> {{ date.formatDate(this.fechaNacimiento, 'DD/MM/YYYY') }} - {{ edad }} </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { date } from 'quasar'

export default defineComponent({
  name: 'ItemPacienteLista',
  props: {
    foto: {
      type: String,
      default: ''
    },
    nombre: {
      type: String,
      default: ''
    },
    fechaNacimiento: {
      type: Date,
      default: new Date()
    },
    idPaciente: {
      type: Number,
      default: 0
    }
  },
  methods: {
    edad () {
      const hoy = new Date()
      const unit = 'years'

      return date.getDateDiff(this.fechaNacimiento, hoy, unit)
    }
  }
})
</script>

<style scoped>

</style>
