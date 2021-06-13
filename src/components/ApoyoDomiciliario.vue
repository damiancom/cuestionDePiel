<template>
  <div>
    <q-input filled v-model="motivoConsulta" label="Motivo de la consulta"/>
    <q-input filled v-model="rutinaDia" label="Rutina de día"/>
    <q-input filled v-model="rutinaNoche" label="Rutina de noche"/>
    <q-input filled v-model="rutinaSemanal" label="Rutina semanal"/>
    <q-card title="Rutinas">
      <q-card-section>
        <q-icon name="r_picture_as_pdf" style="font-size: 2em;"/>
        Aqui se van a subir las rutinas, y se almacenaran todas, ordenadas por fecha.
      </q-card-section>
    </q-card>
    <q-btn-group class="vertical-bottom" rounded>
      <q-btn rounded outline color="secondary" label="Actualizar Apoyo Domiciliario" icon="r_check" @click="actualizarApoyoDomiciliario()"/>
      <q-btn rounded outline color="secondary" label="Subir rutina PDF" icon="r_cloud_upload" @click="subirRutinaPDF()"/>
    </q-btn-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { apoyoDomiciliario } from 'components/models'
import axios, { AxiosResponse } from 'axios'
import { URI_APOYOS_DOMICILIARIOS, URL_PACIENTES } from 'src/js/constants'
import { Loading, Notify } from 'quasar'

export default defineComponent({
  name: 'ApoyoDomiciliario',
  props: {
    idCliente: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      motivoConsulta: '',
      rutinaDia: '',
      rutinaNoche: '',
      rutinaSemanal: '',
      apoyoDomiciliario: <apoyoDomiciliario>{}
    }
  },
  created () {
    this.cargarApoyoDomiciliario()
  },
  methods: {
    cargarApoyoDomiciliario () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_APOYOS_DOMICILIARIOS}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<apoyoDomiciliario>) => {
          this.apoyoDomiciliario = response.data
          this.setearDatosApoyoDomiciliarioEnInputs()
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar el apoyo domiciliario del paciente... ', error)
          Loading.hide()
        })
    },
    actualizarApoyoDomiciliario () {
      Loading.show()
      if (this.validarCambios()) {
        this.actualizarDatosApoyoDomiciliario()
        axios
          .patch(`${URL_PACIENTES}/${this.idCliente}/${URI_APOYOS_DOMICILIARIOS}`, this.apoyoDomiciliario, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then((response: AxiosResponse<apoyoDomiciliario>) => {
            this.apoyoDomiciliario = response.data
            this.setearDatosApoyoDomiciliarioEnInputs()
            Loading.hide()
            Notify.create({
              type: 'positive',
              message: 'Se ha actualizado el apoyo domiciliario correctamente.'
            })
          })
          .catch(error => {
            console.error('Ocurrio un error al intentar actualizar el apoyo domiciliario del paciente... ', error)
            Loading.hide()
          })
      } else {
        alert('No hay modificaciones para guardar.')
      }
    },
    setearDatosApoyoDomiciliarioEnInputs () {
      this.motivoConsulta = this.apoyoDomiciliario.motivoConsulta
      this.rutinaDia = this.apoyoDomiciliario.rutinaDia
      this.rutinaNoche = this.apoyoDomiciliario.rutinaNoche
      this.rutinaSemanal = this.apoyoDomiciliario.rutinaSemanal
    },
    actualizarDatosApoyoDomiciliario () {
      this.apoyoDomiciliario = {
        motivoConsulta: this.motivoConsulta,
        rutinaDia: this.rutinaDia,
        rutinaNoche: this.rutinaNoche,
        rutinaSemanal: this.rutinaSemanal
      }
    },
    validarCambios (): boolean {
      return !(this.motivoConsulta === this.apoyoDomiciliario.motivoConsulta &&
        this.rutinaDia === this.apoyoDomiciliario.rutinaDia &&
        this.rutinaNoche === this.apoyoDomiciliario.rutinaNoche &&
        this.rutinaSemanal === this.apoyoDomiciliario.rutinaSemanal)
    },
    subirRutinaPDF () {
      console.log('Falta realizar...')
    }
  }
})
</script>

<style scoped>

</style>
