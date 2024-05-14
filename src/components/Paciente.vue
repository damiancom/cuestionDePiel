<template>
  <div class="row justify-evenly">
    <personal-information class="col-3" :id="this.$route.params.idPaciente"/>
    <q-separator spaced inset vertical></q-separator>
    <treatment-information class="col-8" :id="parseInt(this.$route.params.idPaciente)"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
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
.damian {
  width: 70% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
