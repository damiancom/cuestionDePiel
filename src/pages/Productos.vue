<template>
  <div>
    <div class="q-pa-md">
      <q-table
        :data="rows"
        :columns="columns"
        title="Productos"
        :rows-per-page-options="[]"
        row-key="brand"
        wrap-cells
      >
        <template v-slot:body="props">
          <q-tr :props="props">
<!--            <q-td key="delete" :props="props">-->
<!--              <q-btn flat round text-color="brown" icon="r_delete_sweep" @click="showConfirm(props.row.id)"/>-->
<!--            </q-td>-->

            <q-td key="brand" :props="props">
              {{ props.row.brand.name }}
            </q-td>

            <q-td key="code" :props="props">
              <div v-html="props.row.code"></div>
              <q-popup-edit
                buttons
                v-model="props.row.code"
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
              <q-popup-edit v-model="props.row.name" @save="editarProducto(props.row)" buttons label-set="Confirmar">
                <q-input v-model="props.row.name" dense autofocus counter/>
              </q-popup-edit>
            </q-td>

            <q-td key="contenido" :props="props">
              {{ props.row.contenido }}
              <q-popup-edit v-model="props.row.contenido" @cancel="notificaCancelaCambio" buttons label-set="Confirmar">
                <q-input v-model="props.row.contenido" dense autofocus counter @keyup.enter="editarProducto(props.row)"/>
              </q-popup-edit>
            </q-td>

            <q-td key="purchasePrice" :props="props">
              $ {{ props.row.purchasePrice }}
              <q-popup-edit v-model.number="props.row.purchasePrice" v-slot="scope" @cancel="notificaCancelaCambio" buttons label-set="Confirmar">
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
import { defineComponent } from '@vue/composition-api'
import axios, { AxiosResponse } from 'axios'
import { Loading } from 'quasar'
import { brand, brandSelect, product } from 'src/components/models'
import { URI_PRODUCTS, URL_MARCAS, URL_PRODUCTS } from 'src/js/constants'

const columns = [
  { name: 'brand', style: 'min-width: 160px; width: 160px', align: 'left', label: 'Marca', field: 'brand' },
  { name: 'code', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Código', field: 'code' },
  { name: 'producto', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Producto', field: 'producto' },
  { name: 'content', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Cont.', field: 'content' },
  { name: 'precio', align: 'center', label: 'Precio', field: 'precio' },
  { name: 'cantidad', align: 'center', label: 'Cantidad', field: 'cantidad' }
]

export default defineComponent({
  name: 'Productos',
  data () {
    return {
      brands: <brandSelect[]>[],
      products: <product[]>[],
      productSelectBrand: <brandSelect> {},
      productCode: '',
      productName: '',
      productContent: '',
      productPrice: 0.0,
      productIdDelete: 0,
      confirm: true,
      columns,
      rows: [
        {
          brand: 'Frozen Yogurt',
          code: '<p>It\'s cold but great and tastes different than normal ice cream, but it\'s great too!</p><p><strong>Have a taste!</strong></p>',
          producto: 'producto',
          content: 'contenidoaasd',
          precio: 6.0,
          cantidad: 2
        },
        {
          brand: 'Ice cream sandwich',
          code: '<p>It\'s also cold but great!</p><p><strong>Have a taste!</strong></p>',
          producto: 'producto',
          content: 'contenidoaasd',
          precio: 6.0,
          cantidad: 2
        },
        {
          brand: 'Eclair',
          code: '<p>It\'s not cold and also great!</p><p><strong>Have a taste!</strong></p>',
          producto: 'producto',
          content: 'contenidoaasd',
          precio: 6.0,
          cantidad: 2
        },
        {
          brand: 'Cupcake',
          code: '<p>It could be warm and it\'s great!</p><p><strong>Have a taste!</strong></p>',
          producto: 'producto',
          content: 'contenidoaasd',
          precio: 6.0,
          cantidad: 2
        },
        {
          brand: 'Gingerbread',
          code: '<p>It\'s spicy and great!</p><p><strong>Have a taste!</strong></p>',
          producto: '',
          content: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          brand: 'Jelly bean',
          code: '<p>It\'s neither cold or warm, but great!</p><p><strong>Have one or two or several, but not too many!</strong></p>',
          producto: '',
          content: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          brand: 'Lollipop',
          code: '<p>It\'s sticky and normally sweet!</p><p><strong>Have a lick!</strong></p>',
          producto: '',
          content: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          brand: 'Honeycomb',
          code: '<p>It\'s special and sweet!</p><p><strong>Have a taste!</strong></p>',
          producto: '',
          content: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          brand: 'Donut',
          code: '<p>It\'s an American classic glazed!</p><p><strong>Have one with coffee!</strong></p>',
          producto: '',
          content: '',
          precio: 6.0,
          cantidad: 2
        },
        {
          brand: 'KitKat',
          code: '<p>It\'s good with a break!</p><p><strong>Have a section to perfection!</strong></p>',
          producto: '',
          content: '',
          precio: 6.0,
          cantidad: 2
        }
      ]
    }
  },
  methods: {
    cargarMarcas () {
      Loading.show()
      axios
        .get(URL_MARCAS, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response: AxiosResponse<brand[]>) => {
          response.data.forEach((brand: brand) => {
            const brandSelect = { label: brand.name, brand: brand }
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
        code: this.productCode,
        content: this.productContent,
        purchasePrice: this.productPrice / 100
      }
      console.log(this.productSelectBrand)

      const brandId = this.productSelectBrand.brand.id ?? 0

      axios
        .post(`${URL_MARCAS}/${brandId}/${URI_PRODUCTS}`, newProduct, {
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
      this.productSelectBrand = { label: '', brand: { name: '' } }
    },
    editarProducto (product: product) {
      if (product.brand) {
        Loading.show()
        const editProduct = {
          name: product.name,
          code: product.code,
          content: product.content,
          purchasePrice: product.purchasePrice
        }

        const brandId = product.brand.id ?? 0
        const productId = product.id ?? 0

        axios
          .patch(`${URL_MARCAS}/${brandId}/${URI_PRODUCTS}/${productId}`, editProduct, {
            headers: { 'Content-Type': 'application/json' }
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
