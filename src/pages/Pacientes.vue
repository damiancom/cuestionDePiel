<template>
  <div>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title class="bg-secondary">Pacientes</q-toolbar-title>
    </q-toolbar>
    <q-list>
      <q-item
        v-for="paciente in listaPacientes"
        :key="paciente.id"
        class="q-my-sm"
        clickable
        v-ripple
        @click="abrirPaciente(paciente.id)"
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            <img :src="`${paciente.foto}`" alt="foto perfil">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ paciente.nombre }}</q-item-label>
          <q-item-label caption lines="1">{{ paciente.mail }} - {{ formatearFecha(paciente.fechaNacimiento) }} - {{ edad(paciente.fechaNacimiento) }} años</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { calcularEdad, formatearFecha } from 'src/js/utils'

export default defineComponent({
  name: 'Pacientes',
  data () {
    return {
      listaPacientes: null
    }
  },
  methods: {
    getPatients () {
      this.listaPacientes = null

      return this.listaPacientes
    },
    abrirPaciente (idPaciente: number) {
      this.$router.push({ name: 'Paciente', params: { idPaciente: idPaciente } })
        .catch(error => console.error('Error al intentar abrir la ficha del paciente.', error))
    },
    formatearFecha (fechaNac : Date) : string {
      return formatearFecha(fechaNac)
    },
    edad (fechaNac : Date) : number {
      return calcularEdad(fechaNac)
    }
  }
})
</script>

<style scoped>

</style>
