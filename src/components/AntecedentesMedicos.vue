<template>
  <div>
    <div class="row">
      <q-input filled v-model="intervencionesQuirurgicas" label="Intervenciones Quirúrgicas" class="col-6"/>
      <q-separator/>
      <q-input filled v-model="enfermedades" label="Enfermedades" class="col-6"/>
    </div>
    <div class="row">
      <q-input filled v-model="alergias" label="Alergias" class="col-6"/>
      <q-separator/>
      <q-input filled v-model="medicamentos" label="Medicamentos" class="col-6"/>
    </div>
    <q-input filled v-model="habitos" label="Hábitos" class="col-6"/>
    <q-input filled v-model="antecedentesEnfermedadesCutaneas" label="Antecedentes de Enfermedades Cutáneas" class="col-6"/>
    <q-input filled v-model="antecedentesFamiliares" label="Antecedentes Familiares" class="col-6"/>
    <q-card-actions class="full-width row justify-center content-center">
      <q-btn-group class="vertical-bottom" rounded>
        <q-btn rounded outline color="secondary" label="Actualizar Antecedentes Médicos" icon="r_check" @click="actualizarAntecedentesMedicos()"/>
      </q-btn-group>
    </q-card-actions>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import axios, { AxiosResponse } from 'axios'
import { URI_ANTECEDENTES_MEDICOS, URL_PACIENTES } from 'src/js/constants'
import { antecedenteMedico } from 'components/models'
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
      intervencionesQuirurgicas: '',
      enfermedades: '',
      alergias: '',
      medicamentos: '',
      habitos: '',
      antecedentesEnfermedadesCutaneas: '',
      antecedentesFamiliares: '',
      antecedenteMedico: <antecedenteMedico>{}
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
        .then((response: AxiosResponse<antecedenteMedico>) => {
          this.antecedenteMedico = response.data
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
          .patch(`${URL_PACIENTES}/${this.idCliente}/${URI_ANTECEDENTES_MEDICOS}`, this.antecedenteMedico, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then((response: AxiosResponse<antecedenteMedico>) => {
            this.antecedenteMedico = response.data
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
      this.antecedentesFamiliares = this.antecedenteMedico.antecedentesFamiliares
      this.enfermedades = this.antecedenteMedico.enfermedades
      this.medicamentos = this.antecedenteMedico.medicamentos
      this.habitos = this.antecedenteMedico.habitos
      this.intervencionesQuirurgicas = this.antecedenteMedico.intervencionesQuirurgicas
      this.alergias = this.antecedenteMedico.alergias
      this.antecedentesEnfermedadesCutaneas = this.antecedenteMedico.antecedentesEnfermedadesCutaneas
    },
    actualizarDatosApoyoDomiciliario () {
      this.antecedenteMedico = {
        antecedentesFamiliares: this.antecedentesFamiliares,
        enfermedades: this.enfermedades,
        medicamentos: this.medicamentos,
        habitos: this.habitos,
        intervencionesQuirurgicas: this.intervencionesQuirurgicas,
        alergias: this.alergias,
        antecedentesEnfermedadesCutaneas: this.antecedentesEnfermedadesCutaneas
      }
    },
    validarCambios (): boolean {
      return !(this.antecedentesFamiliares === this.antecedenteMedico.antecedentesFamiliares &&
        this.enfermedades === this.antecedenteMedico.enfermedades &&
        this.medicamentos === this.antecedenteMedico.medicamentos &&
        this.habitos === this.antecedenteMedico.habitos &&
        this.intervencionesQuirurgicas === this.antecedenteMedico.intervencionesQuirurgicas &&
        this.alergias === this.antecedenteMedico.alergias &&
        this.antecedentesEnfermedadesCutaneas === this.antecedenteMedico.antecedentesEnfermedadesCutaneas)
    }
  }
})
</script>

<style scoped>

</style>
