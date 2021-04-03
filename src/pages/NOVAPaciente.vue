<template>
  <div class="Paciente">
    <q-card flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ paciente.nombre }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator/>

      <q-card-actions>
        <q-btn flat round icon="event"></q-btn>
        <q-btn flat>
          7:30PM
        </q-btn>
        <q-btn flat color="primary">
          Reserve
        </q-btn>
      </q-card-actions>

      <q-separator/>

      <q-card-section horizontal>
        <q-card-section class="col-4">
          <DatosPersonales></DatosPersonales>
        </q-card-section>

        <q-separator vertical></q-separator>

        <q-card-section>

        </q-card-section>
      </q-card-section>
    </q-card>

<!--    <q-card flat bordered>-->
<!--      <v-card-title class="text-center justify-center py-6">-->
<!--        <h1 class="font-weight-bold display-3">Nombre Paciente</h1>-->
<!--      </v-card-title>-->
<!--      <v-tabs v-model="activeTab">-->
<!--        <v-tab v-for="item in items" :key="item.id">{{ item.value }}</v-tab>-->
<!--        <v-tabs-items v-model="activeTab">-->
<!--          <v-tab-item v-for="item in items" :key="item.id">-->
<!--            <v-card flat>-->
<!--              <v-card-text>-->
<!--                <component v-bind:is="item.content"></component>-->
<!--              </v-card-text>-->
<!--            </v-card>-->
<!--          </v-tab-item>-->
<!--        </v-tabs-items>-->
<!--      </v-tabs>-->
<!--    </q-card>-->
<!--    <div>-->
<!--      <q-btn-->
<!--        color="error"-->
<!--        rounded-->
<!--        class="m-3"-->
<!--      >-->
<!--        <q-icon>mdi-cancel</q-icon>-->
<!--        Cancelar-->
<!--      </q-btn>-->
<!--      <q-btn-->
<!--        color="success"-->
<!--        rounded-->
<!--        class="m-3"-->
<!--      >-->
<!--        <q-icon>mdi-content-save</q-icon>-->
<!--        Guardar-->
<!--      </q-btn>-->
      <q-dialog v-model="dialog" persistent max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <q-btn
            color="primary"
            rounded
            class="m-3"
            v-bind="attrs"
            v-on="on"
          >
            <q-icon>mdi-pdf-box</q-icon>
            Exportar a PDF
          </q-btn>
        </template>
        <q-card>
          <q-card-title class="headline">Exportar a PDF</q-card-title>
          <q-card-text>Realmente desea exportar a PDF el informe del paciente?</q-card-text>
          <q-card-actions>
            <q-spacer/>
            <q-btn color="red darken-1" text @click="dialog = false">Cancelar</q-btn>
            <q-btn color="green darken-1" text @click="dialog = false">Aceptar</q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import DatosPersonales from 'src/components/DatosPersonales.vue'
import AntecedentesMedicos from 'src/components/AntecedentesMedicos.vue'
import AnamnesisSocial from 'src/components/AnamnesisSocial.vue'
import ObservacionLesiones from 'src/components/ObservacionLesiones.vue'
import { datosPersonales } from 'components/models'

const paciente: datosPersonales = {
  nombre: 'Damián',
  apellido: 'Comba',
  fechaNacimiento: new Date(),
  celular: '2213175110',
  telefono: '2227430438',
  domicilio: 'Viel 457 1ro B',
  estadoCivil: 'Conviviente',
  genero: 'Masculino',
  localidad: 'Capital Federal',
  mail: 'damiancom@gmail.com'
}

export default defineComponent({
  name: 'Paciente',
  components: {
    DatosPersonales,
    AntecedentesMedicos,
    AnamnesisSocial,
    ObservacionLesiones
  },
  data () {
    return {
      activeTab: null,
      dialog: false,
      items: [
        { id: 0, value: 'Datos Personales', content: 'DatosPersonales' },
        { id: 1, value: 'Antecedentes Médicos', content: 'AntecedentesMedicos' },
        { id: 2, value: 'Anamnesis Social', content: 'AnamnesisSocial' },
        { id: 4, value: 'Observación de Lesiones', content: 'ObservacionLesiones' }
      ]
    }
  }
})

</script>

<style scoped>

</style>
