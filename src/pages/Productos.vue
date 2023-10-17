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
<!--            <q-td key="delete" :props="props">-->
<!--              <q-btn flat round text-color="brown" icon="r_delete_sweep" @click="showConfirm(props.row.id)"/>-->
<!--            </q-td>-->

            <q-td key="marca" :props="props">
              {{ props.row.marca.nombre }}
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

            <q-td key="name" :props="props">
              {{ props.row.name }}
              <q-popup-edit v-model="props.row.name" v-slot="scope" @save="editarProducto(props.row)" buttons label-set="Confirmar">
                <q-input v-model="props.row.name" dense autofocus counter/>
              </q-popup-edit>
            </q-td>

            <q-td key="contenido" :props="props">
              {{ props.row.contenido }}
              <q-popup-edit v-model="props.row.contenido" v-slot="scope" @cancel="notificaCancelaCambio" buttons label-set="Confirmar">
                <q-input v-model="props.row.contenido" dense autofocus counter @keyup.enter="editarProducto(props.row)"/>
              </q-popup-edit>
            </q-td>

            <q-td key="precioCompra" :props="props">
              $ {{ props.row.precioCompra }}
              <q-popup-edit v-model.number="props.row.precioCompra" v-slot="scope" @cancel="notificaCancelaCambio" buttons label-set="Confirmar">
                <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="editarProducto(props.row)"/>
              </q-popup-edit>
            </q-td>

            <!--            <q-td key="cantidad" :props="props">-->
            <!--              <div class="text-pre-wrap">{{ props.row.cantidad }}</div>-->
            <!--              <q-popup-edit v-model.number="props.row.cantidad" v-slot="scope">-->
            <!--                <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set"></q-input>-->
            <!--              </q-popup-edit>-->
            <!--            </q-td>-->
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
    cargarMarcas () {
      Loading.show()
      axios
        .get(URL_MARCAS, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<marca[]>) => {
          response.data.forEach((brand: marca) => {
            const brandSelect = { label: brand.nombre, brand: brand }
            this.brands.push(brandSelect)
          })
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar las marcas.... ', error)
          Loading.hide()
        })
    },
    cargarProductos () {
      Loading.show()
      this.products = []
      axios
        .get(URL_PRODUCTS, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<product[]>) => {
          this.products = response.data
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar recuperar los productos.... ', error)
          Loading.hide()
        })
    },
    agregarProducto () {
      Loading.show()
      const newProduct = {
        name: this.productName,
        codigo: this.productCode,
        contenido: this.productContent,
        precioCompra: this.productPrice / 100
      }
      console.log(this.productSelectBrand)
      axios
        .post(`${URL_MARCAS}/${this.productSelectBrand.brand.id}/${URI_PRODUCTS}`, newProduct, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<product>) => {
          console.log(response.status)
          if (response.status === 201) {
            console.log('Se dió de alta el producto correctamente...')
            this.cargarProductos()
          }
          Loading.hide()
        })
        .catch(error => {
          console.error('Ocurrio un error al intentar dar de alta el producto.... ', error)
          Loading.hide()
        })
    },
    popupClean () {
      this.productCode = ''
      this.productName = ''
      this.productContent = ''
      this.productPrice = 0.0
      this.productSelectBrand = { label: '', brand: { nombre: '' } }
    },
    editarProducto (product: product) {
      if (product.marca) {
        Loading.show()
        const editProduct = {
          name: product.name,
          codigo: product.codigo,
          contenido: product.contenido,
          precioCompra: product.precioCompra
        }
        axios
          .patch(`${URL_MARCAS}/${product.marca.id}/${URI_PRODUCTS}/${product.id}`, editProduct, {
            headers: {'Content-Type': 'application/json'}
          })
          .then((response: AxiosResponse<product>) => {
            if (response.status === 201) {
              console.log('Se actualizó el producto correctamente...')
              this.cargarProductos()
            }
            Loading.hide()
          })
          .catch(error => {
            console.error('Ocurrio un error al intentar actualizar el producto.... ', error)
            Loading.hide()
          })
      }
    },
    showConfirm (productId: number) {
      this.productIdDelete = productId
      this.confirm = true
    },
    notificaCancelaCambio (valueNew: any, oldValue: any) {
      console.log('Canceló el cambio...')
      if (valueNew !== oldValue) {
        alert('Al salir sin guardar perderá los cambios.')
      }
    }
    // eliminarProducto () {
    //   console.log(this.productIdDelete)
    // }
  }
})
</script>

<style scoped>

</style>
