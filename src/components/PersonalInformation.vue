<template>
  <q-card class="bg-amber-2 col-3" square bordered flat>
    <q-img
      :src="patient.foto"
      spinner-color="white"
      style="height: 140px; max-width: 150px"
    />

    <q-card-section>
      <div class="text-h6">{{ patient.apellido }}, {{ patient.nombre }}</div>
      <div class="text-subtitle2">{{ edad(patient.fechaNacimiento) }} años</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input filled dense bottom-slots v-model="patient.nombre" label="Apellido, Nombre" :disable="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="flight_takeoff"></q-icon>
        </template>
      </q-input>
      <q-input  dense v-model="patient.fechaNacimiento" bottom-slots filled type="date" label="Fecha de Nacimiento" :disable="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_event"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.domicilio" label="Domicilio" :disable="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_home"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.localidad" label="Localidad" :disable="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_place"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.telefono" label="Telefono" :disable="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_local_phone"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.celular" label="Celular" :disable="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_phone_iphone"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.mail" label="E-Mail" :disable="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_mail"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="patient.ocupacion" label="Ocupacion" :disable="!editarInformacionContacto">
        <template v-slot:before>
          <q-icon name="r_work"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-actions class="full-width">
      <q-btn
        rounded
        outline
        label="Editar información"
        @click="editarInformacionContacto=!editarInformacionContacto"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { calcularEdad, formatearFecha } from 'src/js/utils'

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
      domicilio: ''
    }
  },
  computed: {
    patient: function () {
      return {
        id: parseInt(this.id),
        foto: 'https://placeimg.com/500/300/nature',
        nombre: 'Damián',
        apellido: 'Comba',
        fechaNacimiento: new Date(1986, 5, 10),
        localidad: 'Lobos',
        domicilio: 'Buenos Aires 1041',
        ocupacion: 'Desarrollador',
        telefono: '(011) 3975-8071',
        celular: '(0221) 317-5110',
        mail: 'damiancom@gmail.com'
      }
    }
  },
  methods: {
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
