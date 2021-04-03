<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4" class="d-flex child-flex">
          <v-img src="https://randomuser.me/api/portraits/women/15.jpg" alt="" aspect-ratio="2" contain></v-img>
        </v-col>
        <v-row class="flex-column pr-2">
          <v-col class="d-flex child-flex">
            <v-text-field
              v-model="nombre"
              :rules="nombreRules"
              :counter="maxLengthNombre"
              label="Nombre"
              required
            >
            </v-text-field>
          </v-col>
          <v-col class="d-flex child-flex">
            <v-menu
              v-model="menuCalendar"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fechaNacimientoFormatted"
                  label="Fecha de Nacimiento"
                  prepend-icon="mdi-calendar-outline"
                  v-bind="attrs"
                  v-on="on"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker
                locale="es"
                v-model="fechaNacimiento"
                @input="menuCalendar = false"
                :max="new Date().toISOString().substr(0, 10)"
              >
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row class="flex-column pr-2">
          <v-col class="d-flex child-flex">
            <v-text-field
              v-model="apellido"
              :rules="apellidoRules"
              :counter="maxLengthApellido"
              label="Apellido"
              required
            >
            </v-text-field>
          </v-col>
          <v-col class="d-flex child-flex">
            <v-text-field
              v-model="calcularEdad"
              label="Edad"
              readonly
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-row>
      <v-row>
        <v-col cols="4" class="d-flex child-flex">
          <v-text-field
            v-model="domicilio"
            :rules="domicilioRules"
            :counter="50"
            label="Domicilio"
            required
          >
          </v-text-field>
        </v-col>
        <v-col cols="4" class="d-flex child-flex">
          <v-text-field
            v-model="localidad"
            :rules="localidadRules"
            :counter="maxLengthLocalidad"
            label="Localidad"
            required
          >
          </v-text-field>
        </v-col>
        <v-col cols="4" class="d-flex child-flex">
          <v-text-field
            v-model="celular"
            :rules="celularRules"
            :counter="maxLengthCelular"
            label="Celular"
            required
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" class="d-flex child-flex">
          <v-text-field
            v-model="telefono"
            :rules="telefonoRules"
            :counter="maxLengthTelefono"
            label="Teléfono"
            required
          >
          </v-text-field>
        </v-col>
        <v-col cols="4" class="d-flex child-flex">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            :counter="maxLengthEmail"
            label="E-mail"
            required
          >
          </v-text-field>
        </v-col>
        <v-col cols="4" class="d-flex child-flex">
          <v-text-field
            v-model="ocupacion"
            :rules="ocupacionRules"
            :counter="maxLengthOcupacion"
            label="Ocupación Laboral"
            required
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'DatosPersonales',
  props: {
    paciente: {
      type: any,
      required: true
    }
  },
  data () {
    return {
      valid: false,
      nombre: '',
      nombreRules: [
        v => !!v || 'Nombre es requerido',
        v => v.length <= this.maxLengthNombre || 'El nombre debe tener menos de ' + this.maxLengthNombre + ' caracteres'
      ],
      maxLengthNombre: 20,
      apellido: '',
      apellidoRules: [
        v => !!v || 'Apellido es requerido',
        v => v.length <= this.maxLengthApellido || 'El apellido debe tener menos de ' + this.maxLengthApellido + ' caracteres'
      ],
      maxLengthApellido: 20,
      email: '',
      emailRules: [
        v => !!v || 'Correo electronico es requerido',
        v => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(v) || 'El correo electronico debe ser válido'
        },
        v => v.length <= this.maxLengthEmail || 'El correo electronico debe tener menos de ' + this.maxLengthEmail + ' caracteres'
      ],
      maxLengthEmail: 60,
      fechaNacimiento: new Date().toISOString().substr(0, 10),
      menu: false,
      menuCalendar: false,
      domicilio: '',
      domicilioRules: [
        v => !!v || 'Domicilio es requerido',
        v => v.length <= this.maxLengthDomicilio || 'El domicilio debe tener menos de ' + this.maxLengthDomicilio + ' caracteres'
      ],
      maxLengthDomicilio: 50,
      localidad: '',
      localidadRules: [
        v => !!v || 'Localidad es requerida',
        v => v.length <= this.maxLengthLocalidad || 'La localidad debe tener menos de ' + this.maxLengthLocalidad + ' caracteres'
      ],
      maxLengthLocalidad: 20,
      celular: '',
      celularRules: [
        v => !!v || 'Celular es requerido',
        v => v.length <= this.maxLengthCelular || 'El celular debe tener menos de ' + this.maxLengthCelular + ' caracteres'
      ],
      maxLengthCelular: 15,
      telefono: '',
      telefonoRules: [
        v => !!v || 'Teléfono es requerido',
        v => v.length <= this.maxLengthTelefono || 'El teléfono debe tener menos de ' + this.maxLengthTelefono + ' caracteres'
      ],
      maxLengthTelefono: 15,
      ocupacion: '',
      ocupacionRules: [
        v => !!v || 'Ocupación Laboral es requerida',
        v => v.length <= this.maxLengthOcupacion || 'La ocupación Laboral debe tener menos de ' + this.maxLengthOcupacion + ' caracteres'
      ],
      maxLengthOcupacion: 15
    }
  },
  computed: {
    calcularEdad: function () {
      let edadCalculada
      try {
        const hoy = new Date()
        const fecNac = new Date(this.fechaNacimiento)
        edadCalculada = hoy.getFullYear() - fecNac.getFullYear()
        const diferenciaMeses = hoy.getMonth() - fecNac.getMonth()
        if (
          diferenciaMeses < 0 ||
          (diferenciaMeses === 0 && hoy.getDate() < fecNac.getDate())
        ) {
          edadCalculada--
        }
        return edadCalculada
      } catch (e) {
        edadCalculada = 0
        return edadCalculada
      }
    },
    fechaNacimientoFormatted: function () {
      return this.formatDate(this.fechaNacimiento)
    }
  },
  methods: {
    formatDate: function (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    }
  }
})
</script>

<style scoped>

</style>
