<template>
  <div>
    <q-input filled v-model="lesion.aspectoFisico" label="Aspecto físico"/>
    <q-card>
      <q-card-section>
        <div class="text-h6">Piel</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <q-input filled v-model="lesion.piel.tipo" label="Tipo" class="col-6"/>
          <q-separator/>
          <q-input filled v-model="lesion.piel.forma" label="Forma" class="col-6"/>
        </div>
        <div class="row">
          <q-input filled v-model="lesion.piel.disposicion" label="Disposición" class="col-6"/>
          <q-separator/>
          <q-input filled v-model="lesion.piel.distribucionLesiones" label="Distribución de lesiones" class="col-6"/>
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <div class="text-h6">Lesión</div>
      </q-card-section>
      <q-card-section>
        <q-input filled v-model="lesion.lesionCutanea.inicio" label="Inicio"/>
        <q-input filled v-model="lesion.lesionCutanea.lugarInicio" label="Lugar de inicio"/>
        <q-input filled v-model="lesion.lesionCutanea.sintomas" label="Síntomas"/>
        <q-input filled v-model="lesion.lesionCutanea.evolucion" label="Evolución"/>
        <q-input filled v-model="lesion.lesionCutanea.cambios" label="Cambios"/>
        <q-input filled v-model="lesion.lesionCutanea.factoresIncrementanRiesgo" label="Factores que incrementan riesgo"/>
        <q-input filled v-model="lesion.lesionCutanea.tratamientosPosteriores" label="Tratamientos posteriores"/>
      </q-card-section>
    </q-card>
    <q-btn-group class="vertical-bottom" rounded>
      <q-btn rounded outline color="secondary" label="Actualizar Lesiones" icon="r_check" @click="actualizarLesion()"/>
    </q-btn-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { lesionCutanea, observacionLesiones, piel } from 'components/models'
import axios, { AxiosResponse } from 'axios'
import { URI_LESIONES, URL_PACIENTES } from 'src/js/constants'
import { Loading, Notify } from 'quasar'

export default defineComponent({
  name: 'ObservacionLesiones',
  props: {
    idCliente: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      lesion: <observacionLesiones>{}
    }
  },
  created () {
    this.lesion = {
      aspectoFisico: '',
      piel: {} as piel,
      lesionCutanea: {} as lesionCutanea
    }
    this.cargarLesiones()
  },
  methods: {
    cargarLesiones () {
      Loading.show()
      axios
        .get(`${URL_PACIENTES}/${this.idCliente}/${URI_LESIONES}`, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<observacionLesiones>) => {
          this.lesion = response.data
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar las lesiones del paciente... ', error)
          Loading.hide()
        })
    },
    actualizarLesion () {
      Loading.show()
      axios
        .patch(`${URL_PACIENTES}/${this.idCliente}/${URI_LESIONES}`, this.lesion, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<observacionLesiones>) => {
          this.lesion = response.data
          Loading.hide()
          Notify.create({
            type: 'positive',
            message: 'Se han actualizado las lesiones correctamente.'
          })
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar actualizar las lesiones del paciente... ', error)
          Loading.hide()
        })
    }
  }
})
</script>

<style scoped>

</style>
