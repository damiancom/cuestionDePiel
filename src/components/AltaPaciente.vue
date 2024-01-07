<template>
  <q-card bordered flat>
    <q-card-section class="full-width row justify-center content-center">
      <q-img class="imagenContenedorHijo" style="width: 200px; height: 200px" :src="foto" spinner-color="white" @click="upload"/>
    </q-card-section>

    <q-card-section>
      <q-input filled dense bottom-slots v-model="nombre" label="Nombre">
        <template v-slot:before>
          <q-icon name="r_person"/>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="apellido" label="Apellido">
        <template v-slot:before>
          <q-icon name="r_person"/>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="fechaNacimiento" type="date" label="Fecha de Nacimiento">
        <template v-slot:before>
          <q-icon name="r_event"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="domicilio" label="Domicilio">
        <template v-slot:before>
          <q-icon name="r_home"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="localidad" label="Localidad">
        <template v-slot:before>
          <q-icon name="r_place"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="telefono" label="Telefono">
        <template v-slot:before>
          <q-icon name="r_local_phone"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="celular" label="Celular">
        <template v-slot:before>
          <q-icon name="r_phone_iphone"></q-icon>
        </template>
      </q-input>
      <q-input filled dense bottom-slots v-model="mail" label="E-Mail">
        <template v-slot:before>
          <q-icon name="r_mail"></q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-actions class="full-width row justify-center content-center">
      <q-btn-group rounded>
        <q-btn rounded outline color="secondary" label="Confirmar" icon="r_check" @click="agregarPaciente()"/>
        <q-btn rounded outline color="negative" label="Cancelar" icon="r_clear" @click="limpiarCampos()"/>
      </q-btn-group>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import PersonalInformation from 'components/PersonalInformation.vue'
import { datosPersonales } from 'components/models'
import axios from 'axios'
import { URL_PACIENTES } from 'src/js/constants'
import { Notify } from 'quasar'
import { formatearFechaDB } from 'src/js/utils'

const IMAGEN_DEFAULT = 'https://cdn-3.expansion.mx/dims4/default/7719710/2147483647/strip/true/crop/304x413+0+0/resize/600x815!/quality/90/?url=https%3A%2F%2Fcherry-brightspot.s3.amazonaws.com%2F34%2Fdc%2Fd3f9ed94491b9677ede5c961016f%2Fsilueta.JPG'

export default defineComponent({
  name: 'AltaPaciente',
  components: { PersonalInformation },
  data () {
    return {
      foto: IMAGEN_DEFAULT,
      nombre: '',
      apellido: '',
      fechaNacimiento: formatearFechaDB(new Date()),
      localidad: '',
      domicilio: '',
      telefono: '',
      celular: '',
      mail: ''
    }
  },
  methods: {
    agregarPaciente () {
      if (this.validaDatos()) {
        const patient: datosPersonales = {
          fotoPerfil: this.foto,
          estadoCivil: '',
          escolaridad: '',
          apellido: this.apellido,
          fechaNacimiento: this.fechaNacimiento,
          celular: this.celular,
          domicilio: this.domicilio,
          genero: '',
          mail: this.mail,
          localidad: this.localidad,
          nombre: this.nombre,
          telefono: this.telefono
        }
        axios
          .post(`${URL_PACIENTES}`, patient, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then(() => {
            this.limpiarCampos()
            Notify.create({
              type: 'positive',
              message: 'Se dio de alta el paciente correctamente.'
            })
          })
          .catch(error => console.error('Ocurrio un error al intentar dar de alta el pacientes... ', error))
      } else {
        alert('Faltan datos minimos, asegurese de insertar el nombre y apellido al menos')
      }
    },
    validaDatos (): boolean {
      return (this.nombre !== '' && this.apellido !== '')
    },
    limpiarCampos () {
      this.foto = IMAGEN_DEFAULT
      this.nombre = ''
      this.apellido = ''
      this.fechaNacimiento = formatearFechaDB(new Date())
      this.localidad = ''
      this.domicilio = ''
      this.telefono = ''
      this.celular = ''
      this.mail = ''
    },
    upload () {
      console.log('Resta implementar...')
    }
  }
})
</script>

<style scoped>

</style>
