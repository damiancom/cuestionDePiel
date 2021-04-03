<template>
  <div>
    <q-card style="height: 90vh" class="full-height">
      <q-card-section horizontal >
        <personal-information
          :id="this.$route.params.idPaciente"
        />
        <q-space/>
        <treatment-information
          :id="this.$route.params.idPaciente"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
// import Home from '@/views/Home'
// import About from '@/views/About'
import PersonalInformation from 'src/components/PersonalInformation.vue'
import TreatmentInformation from 'components/TreatmentInformation.vue'
// import AntecedentesMedicos from '@/components/AntecedentesMedicos'
import AnamnesisSocial from 'src/components/AnamnesisSocial.vue'
// import ObservacionLesiones from '@/components/ObservacionLesiones'

export default defineComponent({
  name: 'Paciente',
  components: {
    TreatmentInformation,
    PersonalInformation
  },
  // data () {
  //   return {
  //     items: [
  //       { id: 0, value: 'Datos Personales', content: 'DatosPersonales' },
  //       { id: 1, value: 'Antecedentes Médicos', content: 'AntecedentesMedicos' },
  //       { id: 2, value: 'Anamnesis Social', content: 'AnamnesisSocial' },
  //       { id: 4, value: 'Observación de Lesiones', content: 'ObservacionLesiones' },
  //       { id: 3, value: 'Observación y Diagnóstico', content: 'About' }
  //     ]
  //   }
  // },
  data () {
    return {
    }
  }
})

</script>

<style scoped>

</style>
