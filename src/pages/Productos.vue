<template>
  <div>
    <div class="q-pa-md">
      <q-table
        :data="rows"
        :columns="columns"
        title="Productos"
        :rows-per-page-options="[]"
        row-key="marca"
        wrap-cells
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="marca" :props="props">
              {{ props.row.marca }}
              <q-popup-edit v-model="props.row.marca" v-slot="scope">
                <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set"></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="codigo" :props="props">
              <div v-html="props.row.codigo"></div>
              <q-popup-edit
                buttons
                v-model="props.row.codigo"
                v-slot="scope"
              >
                <q-editor
                  v-model="scope.value"
                  min-height="5rem"
                  autofocus
                  @keyup.enter.stop
                ></q-editor>
              </q-popup-edit>
            </q-td>

            <q-td key="precio" :props="props">
              {{ props.row.precio }}
              <q-popup-edit v-model.number="props.row.precio" v-slot="scope">
                <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set"></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="cantidad" :props="props">
              <div class="text-pre-wrap">{{ props.row.cantidad }}</div>
              <q-popup-edit v-model.number="props.row.cantidad" v-slot="scope">
                <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set"></q-input>
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-btn-group>
      <q-btn
        label="Incorporar producto"
        @click="cargarProductos"
      />
    </q-btn-group>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'

const columns = [
  { name: 'marca', style: 'min-width: 160px; width: 160px', align: 'left', label: 'Marca', field: 'marca' },
  { name: 'codigo', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Código', field: 'codigo' },
  { name: 'producto', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Producto', field: 'producto' },
  { name: 'contenido', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Cont.', field: 'contenido' },
  { name: 'precio', align: 'center', label: 'Precio', field: 'precio' },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' }
]

export default defineComponent({
  name: 'Productos',
  data () {
    return {
      columns,
      rows: [
        {
          marca: 'Frozen Yogurt',
          codigo: '<p>It\'s cold but great and tastes different than normal ice cream, but it\'s great too!</p><p><strong>Have a taste!</strong></p>',
          producto: 'producto',
          contenido: 'contenidoaasd',
          precio: 6.0,
          cantidad: 2
        },
        {
          marca: 'Ice cream sandwich',
          codigo: '<p>It\'s also cold but great!</p><p><strong>Have a taste!</strong></p>',
          producto: 'producto',
          contenido: 'contenidoaasd',
          precio: 6.0,
          cantidad: 2
        },
        {
          marca: 'Eclair',
          codigo: '<p>It\'s not cold and also great!</p><p><strong>Have a taste!</strong></p>',
          producto: 'producto',
          contenido: 'contenidoaasd',
          precio: 6.0,
          cantidad: 2
        },
        {
          marca: 'Cupcake',
          codigo: '<p>It could be warm and it\'s great!</p><p><strong>Have a taste!</strong></p>',
          producto: 'producto',
          contenido: 'contenidoaasd',
          precio: 6.0,
          cantidad: 2
        },
        {
          marca: 'Gingerbread',
          codigo: '<p>It\'s spicy and great!</p><p><strong>Have a taste!</strong></p>',
          producto: '',
          contenido: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          marca: 'Jelly bean',
          codigo: '<p>It\'s neither cold or warm, but great!</p><p><strong>Have one or two or several, but not too many!</strong></p>',
          producto: '',
          contenido: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          marca: 'Lollipop',
          codigo: '<p>It\'s sticky and normally sweet!</p><p><strong>Have a lick!</strong></p>',
          producto: '',
          contenido: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          marca: 'Honeycomb',
          codigo: '<p>It\'s special and sweet!</p><p><strong>Have a taste!</strong></p>',
          producto: '',
          contenido: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          marca: 'Donut',
          codigo: '<p>It\'s an American classic glazed!</p><p><strong>Have one with coffee!</strong></p>',
          producto: '',
          contenido: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          marca: 'KitKat',
          codigo: '<p>It\'s good with a break!</p><p><strong>Have a section to perfection!</strong></p>',
          producto: '',
          contenido: '',
          precio: 6.0,
          cantidad: 2
        }
      ]
    }
  },
  created () {
  },
  methods: {
    cargarProductos () {
      console.log(this.rows)
      this.rows = [
        {
          marca: 'Frozen Yogurt',
          codigo: '<p>It\'s cold but great and tastes different than normal ice cream, but it\'s great too!</p><p><strong>Have a taste!</strong></p>',
          producto: 'asdf',
          contenido: 'afadsfasdfd',
          precio: 6.0,
          cantidad: 2
        }
      ]
      console.log(this.rows)
    }
  }
})
</script>

<style scoped>

</style>
