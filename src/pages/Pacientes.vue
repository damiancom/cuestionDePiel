<template>
  <div>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title class="bg-secondary">
        Pacientes
      </q-toolbar-title>
    </q-toolbar>
    <q-list>
      <q-item v-for="paciente in listaPacientes" :key="paciente.id" class="q-my-sm" clickable v-ripple @click="abrirPaciente(paciente.id)">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            <q-img :src="paciente.foto" alt="Foto de perfil" spinner-color="white"/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ paciente.apellido }}, {{ paciente.nombre }}
          </q-item-label>
          <q-item-label caption lines="1">
            {{ paciente.mail }} - {{ formatearFecha(paciente.fechaNacimiento) }} - {{ edad(paciente.fechaNacimiento) }} años
          </q-item-label>
        </q-item-section>
        <q-item-section avatar @click="eliminar(paciente.id)">
          <q-btn round color="brown" glossy icon="r_delete_sweep"/>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import {calcularEdad, formatearFecha} from 'src/js/utils'
import {datosPersonales} from 'components/models'
import axios, {AxiosResponse} from 'axios'
import {URL_PACIENTES} from 'src/js/constants'
import {Loading} from 'quasar'

export default defineComponent({
  name: 'Pacientes',
  data () {
    return {
      isClikEliminar: false,
      listaPacientes: <datosPersonales[]>[]
    }
  },
  created () {
    this.getPatients()
  },
  methods: {
    getPatients () {
      Loading.show()
      axios
        .get(URL_PACIENTES, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<datosPersonales[]>) => {
          this.listaPacientes = response.data
          Loading.hide()
        })
        .catch(error => console.error('Ocurrio un error al intentar recuperar los pacientes... ', error))
    },
    abrirPaciente (idPaciente: string) {
      if (this.isClikEliminar) {
        this.isClikEliminar = false
        return
      }
      this.$router.push({
        name: 'paciente',
        params: { idPaciente: idPaciente }
      })
        .catch(error => console.error('Error al intentar abrir la ficha del paciente.', error))
    },
    eliminar (idPaciente: string) {
      this.isClikEliminar = true
      Loading.show()
      axios
        .delete(URL_PACIENTES + '/' + idPaciente, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
          this.getPatients()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar eliminar el paciente... ', error)
          Loading.hide()
        })
    },
    formatearFecha (fechaNac: Date): string {
      return formatearFecha(fechaNac.toString() + 'T00:00')
    },
    edad (fechaNac: Date): number {
      return calcularEdad(fechaNac)
    }
  }
})
</script>

<style scoped>

</style>
