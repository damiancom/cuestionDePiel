<template>
  <div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nueva Marca</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="brand" autofocus @keyup.enter="prompt = false"></q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup @click="brand = ''"/>
          <q-btn flat label="Agregar Marca" v-close-popup @click="agregarMarca"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-table
      :data="rows"
      :columns="columns"
      :rows-per-page-options="[]"
      row-key="id"
      wrap-cells
      :filter="filter"
      no-data-label="No hay marcas disponibles"
      no-results-label="No se encontraron marcas"
    >
      <template v-slot:top>
        <div class="q-table__title">Marcas</div>

        <q-space/>
        <q-btn
          flat
          round
          @click="prompt = true"
          icon="r_add"
          style="color: dodgerblue"
        >
          <q-tooltip class="bg-accent">Agregar Marca</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          @click="cargarMarcas"
          icon="r_refresh"
          style="color: dodgerblue"
        >
          <q-tooltip class="bg-accent">Refrescar Grilla</q-tooltip>
        </q-btn>
        <q-input dense debounce="300" v-model="filter" placeholder="Buscar" class="q-px-md">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn
          flat
          round
          @click="limpiarFiltros"
          icon="r_delete_sweep"
          style="color: dodgerblue"
        >
          <q-tooltip class="bg-accent">Limpiar Filtros</q-tooltip>
        </q-btn>
        <q-space/>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props" class="col-1">
            <q-btn flat round text-color="brown" icon="r_delete_sweep" @click="eliminarMarca(props.row.id)"/>
          </q-td>
          <q-td key="id" :props="props" class="col-1">
            <div v-html="props.row.id"/>
          </q-td>

          <q-td key="nombre" :props="props" class="col-2">
            {{ props.row.nombre }}
            <q-popup-edit v-model="props.row.nombre" v-slot="scope">
              <q-input v-model="props.row.nombre" dense autofocus counter @keyup.enter="prueba(props.row.id)"></q-input>
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from '@vue/composition-api'
import axios, {AxiosResponse} from 'axios'
import {URL_MARCAS} from 'src/js/constants'
import {Loading} from 'quasar'
import {marca} from 'components/models'

const columns = [
  {},
  { name: 'id', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Código', field: 'id' },
  { name: 'nombre', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Nombre', field: 'nombre' }
]

export default defineComponent({
  name: "Marcas",
  data () {
    return {
      columns,
      rows: <marca[]> [],
      prompt: ref(false),
      brand: '',
      filter: ''
    }
  },
  created () {
    this.cargarMarcas()
  },
  methods: {
    cargarMarcas () {
      axios
        .get(URL_MARCAS, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<marca[]>) => {
          this.rows = response.data
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar las marcas.... ', error)
          Loading.hide()
        })
    },
    agregarMarca () {
      Loading.show()
      axios
        .post(URL_MARCAS, {'nombre': this.brand}, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<marca>) => {
          console.log(response.data)
          this.brand = ''
          this.cargarMarcas()
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar agregar la marca.... ', error)
          Loading.hide()
        })
    },
    eliminarMarca (idMarca: number) {
      Loading.show()
      axios
        .delete(URL_MARCAS + '/' + idMarca,  {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<marca>) => {
          console.log(response.data)
          this.brand = ''
          this.cargarMarcas()
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar eliminar la marca.... ', error)
          Loading.hide()
        })
    },
    limpiarFiltros () {
      console.log(this.filter)
      this.filter = ''
      console.log(this.filter)
    },
    prueba (idMarca: number) {
      this.rows
        .filter(marca => marca.id === idMarca)
        .forEach(marca => {
          axios
            .patch(URL_MARCAS + '/' + idMarca,  marca,{
              headers: { 'Content-Type': 'application/json' }
            })
            .then((response: AxiosResponse<marca>) => {
              console.log(response.data)
              this.brand = ''
              this.cargarMarcas()
              Loading.hide()
            })
            .catch(error => {
              console.error('Ocurrio un error al intentar actualizar la marca.... ', error)
              Loading.hide()
            })
          })
    }
  }
})
</script>

<style scoped>

</style>
