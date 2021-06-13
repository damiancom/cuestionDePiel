<template>
  <div>
    <q-card class="full-height">
      <q-card-section horizontal>
        <personal-information class="personalInformationStyle" :id="parseInt(this.$route.params.idPaciente)"/>
        <q-space/>
        <treatment-information :id="parseInt(this.$route.params.idPaciente)"/>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import PersonalInformation from 'src/components/PersonalInformation.vue'
import TreatmentInformation from 'components/TreatmentInformation.vue'

export default defineComponent({
  name: 'Paciente',
  components: {
    TreatmentInformation,
    PersonalInformation
  },
  data () {
    return {}
  }
})

</script>

<style scoped>
.personalInformationStyle {
  width: 30%;
  left: 1.5%;
  top: 5%;
  bottom: 5%;
}
</style>
