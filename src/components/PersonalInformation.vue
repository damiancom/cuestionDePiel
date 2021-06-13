<template>
  <q-card bordered flat>
    <q-card-section class="full-width row justify-center content-center">
      <q-img class="imagenContenedorHijo" :src="patient.fotoPerfil" spinner-color="white" @click="upload"/>
    </q-card-section>

    <q-card-section>
      <div class="text-h6">{{ patient.apellido }}, {{ patient.nombre }}</div>
      <div class="text-subtitle2">{{ edad(patient.fechaNacimiento) }} años</div>
    </q-card-section>

    <q-card-section>
      <q-input filled dense bottom-slots v-model="patient.nombre" label="Nombre" v-show="editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_person"/>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.apellido" label="Apellido" v-show="editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_person"/>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.fechaNacimiento" type="date" label="Fecha de Nacimiento"
               :readonly="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_event"/>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.domicilio" label="Domicilio" :readonly="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_home"/>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.localidad" label="Localidad" :readonly="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_place"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.telefono" label="Telefono" :readonly="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_local_phone"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.celular" label="Celular" :readonly="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_phone_iphone"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.mail" label="E-Mail" :readonly="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_mail"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-actions class="full-width row justify-center content-center">
      <q-btn v-show="!editarInformacionContacto" rounded outline label="Editar información" icon="r_edit"
             @click="editarInformacionContacto=!editarInformacionContacto"/>
      <q-btn-group v-show="editarInformacionContacto" rounded>
        <q-btn rounded outline color="secondary" label="Confirmar" icon="r_check"
               @click="confirmarDatosPaciente(); editarInformacionContacto=!editarInformacionContacto"/>
        <q-btn rounded outline color="negative" label="Cancelar" icon="r_clear"
               @click="cargarDatosPaciente(); editarInformacionContacto=!editarInformacionContacto"/>
      </q-btn-group>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { calcularEdad } from 'src/js/utils'
import { datosPersonales } from './models'
import axios, { AxiosResponse } from 'axios'
import { URL_PACIENTES } from 'src/js/constants'
import { Loading, Notify } from 'quasar'

export default defineComponent({
  name: 'PersonalInformation',
  props: {
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      editarInformacionContacto: false,
      foto: '',
      nombre: '',
      fechaNacimiento: '',
      localidad: '',
      domicilio: '',
      patient: <datosPersonales>{}
    }
  },
  created () {
    this.cargarDatosPaciente()
  },
  methods: {
    upload () {
      console.log('hola')
    },
    cargarDatosPaciente () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.id}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<datosPersonales>) => {
          this.patient = response.data
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar los pacientes... ', error)
          Loading.hide()
        })
    },
    confirmarDatosPaciente () {
      Loading.show()
      axios
        .patch(`${URL_PACIENTES}/${this.id}`, this.patient, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<datosPersonales>) => {
          this.patient = response.data
          Loading.hide()
          Notify.create({
            type: 'positive',
            message: 'Se han actualizado los datos del paciente correctamente.'
          })
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar los pacientes... ', error)
          Loading.hide()
        })
    },
    edad (fechaNac: Date): number {
      return calcularEdad(fechaNac)
    }
  }
})
</script>

<style scoped>

.imagenContenedorPadre {
  /*IMPORTANTE*/
  display: flex;
  justify-content: center;
  align-items: center;
}

.imagenContenedorHijo {
  height: 140px;
  max-width: 150px
}

</style>
