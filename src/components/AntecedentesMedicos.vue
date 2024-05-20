<template>
  <div>
    <q-input filled v-model="surgicalIntervention" label="Intervenciones quirúrgicas"/>
    <q-input filled v-model="aestheticFilling" label="Rellenos estéticos"/>
    <q-input filled v-model="allergy" label="Alergias"/>
    <q-input filled v-model="disease" label="Enfermedades"/>
    <q-input filled v-model="medication" label="Medicamentos"/>
    <q-input filled v-model="habit" label="Hábitos" class="col-6"/>
    <q-input filled v-model="skinDiseaseHistory"
             label="Antecedentes de enfermedades cutáneas" class="col-6"/>
    <q-input filled v-model="familyHistory" label="Antecedentes familiares" class="col-6"/>
    <q-card-actions class="full-width row justify-center content-center">
      <q-btn-group class="vertical-bottom" rounded>
        <q-btn rounded outline color="secondary" label="Actualizar antecedentes médicos"
               icon="r_check" @click="actualizarAntecedentesMedicos()"/>
      </q-btn-group>
    </q-card-actions>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import axios, { AxiosResponse } from 'axios'
import { URI_ANTECEDENTES_MEDICOS, URL_PACIENTES } from 'src/js/constants'
import { medicalHistory } from 'components/models'
import { Loading, Notify } from 'quasar'

export default defineComponent({
  name: 'AntecedentesMedicos',
  props: {
    idCliente: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      surgicalIntervention: '',
      aestheticFilling: '',
      disease: '',
      allergy: '',
      medication: '',
      habit: '',
      skinDiseaseHistory: '',
      familyHistory: '',
      medicalHistory: <medicalHistory>{}
    }
  },
  created () {
    this.cargarAntecedentesMedicos()
  },
  methods: {
    cargarAntecedentesMedicos () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_ANTECEDENTES_MEDICOS}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<medicalHistory>) => {
          this.medicalHistory = response.data
          this.setearDatosApoyoDomiciliarioEnInputs()
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar el antecedente médico del paciente... ', error)
          Loading.hide()
        })
    },
    actualizarAntecedentesMedicos () {
      if (this.validarCambios()) {
        Loading.show()
        this.actualizarDatosApoyoDomiciliario()
        axios
          .patch(`${URL_PACIENTES}/${this.idCliente}/${URI_ANTECEDENTES_MEDICOS}`, this.medicalHistory, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then((response: AxiosResponse<medicalHistory>) => {
            this.medicalHistory = response.data
            this.setearDatosApoyoDomiciliarioEnInputs()
            Loading.hide()
            Notify.create({
              type: 'positive',
              message: 'Se han actualizado los antecedentes médicos correctamente.'
            })
          })
          .catch(error => {
            console.error('Ocurrio un error al intentar actualizar el antecedente médico del paciente... ', error)
            Loading.hide()
          })
      }
    },
    setearDatosApoyoDomiciliarioEnInputs () {
      this.familyHistory = this.medicalHistory.familyHistory
      this.aestheticFilling = this.medicalHistory.aestheticFilling
      this.disease = this.medicalHistory.disease
      this.medication = this.medicalHistory.medication
      this.habit = this.medicalHistory.habit
      this.surgicalIntervention = this.medicalHistory.surgicalIntervention
      this.allergy = this.medicalHistory.allergy
      this.skinDiseaseHistory = this.medicalHistory.skinDiseaseHistory
    },
    actualizarDatosApoyoDomiciliario () {
      this.medicalHistory = {
        familyHistory: this.familyHistory,
        aestheticFilling: this.aestheticFilling,
        disease: this.disease,
        medication: this.medication,
        habit: this.habit,
        surgicalIntervention: this.surgicalIntervention,
        allergy: this.allergy,
        skinDiseaseHistory: this.skinDiseaseHistory
      }
    },
    validarCambios () : boolean {
      return !(this.familyHistory === this.medicalHistory.familyHistory &&
          this.aestheticFilling === this.medicalHistory.aestheticFilling &&
          this.disease === this.medicalHistory.disease &&
          this.medication === this.medicalHistory.medication &&
          this.habit === this.medicalHistory.habit &&
          this.surgicalIntervention === this.medicalHistory.surgicalIntervention &&
          this.allergy === this.medicalHistory.allergy &&
          this.skinDiseaseHistory === this.medicalHistory.skinDiseaseHistory)
    }
  }
})
</script>

<style scoped>

</style>
