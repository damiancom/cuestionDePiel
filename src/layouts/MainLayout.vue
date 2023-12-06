<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!--        <q-btn-->
        <!--          flat-->
        <!--          dense-->
        <!--          round-->
        <!--          icon="menu"-->
        <!--          aria-label="Menu"-->
        <!--          @click="leftDrawerOpen = !leftDrawerOpen"-->
        <!--        />-->

        <q-toolbar-title>
          Cuestión de Piel
        </q-toolbar-title>

        <q-btn-group flat>
          <q-btn
              stack
              label="Alta Paciente"
              icon="r_person_add_alt"
              to="/alta-paciente"
          />
          <q-btn
              stack
              label="Pacientes"
              icon="r_contacts"
              to="/pacientes"
          />
          <q-btn
              stack
              label="Agenda"
              icon="r_event"
          />
          <q-btn
              stack
              label="Productos"
              icon="r_inventory_2"
              to="/productos"
          />
          <q-btn
              stack
              label="Marcas"
              icon="r_branding_watermark"
              to="/marcas"
          />
        </q-btn-group>

        <q-space/>

        <div>by Cecilia Corengia</div>

      </q-toolbar>
    </q-header>

    <!--    <q-drawer-->
    <!--      v-model="leftDrawerOpen"-->
    <!--      show-if-above-->
    <!--      bordered-->
    <!--      content-class="bg-grey-1"-->
    <!--    >-->
    <!--      <q-list>-->
    <!--        <q-item-label-->
    <!--          header-->
    <!--          class="text-grey-8"-->
    <!--        >-->
    <!--          Pacientes-->
    <!--        </q-item-label>-->

    <!--        <EssentialLink-->
    <!--          v-for="link in essentialLinks"-->
    <!--          :key="link.title"-->
    <!--          v-bind="link"-->
    <!--        />-->
    <!--      </q-list>-->
    <!--      <q-separator/>-->
    <!--      <q-btn-group spread>-->
    <!--        <q-btn-->
    <!--          outline-->
    <!--          label="Alta Paciente"-->
    <!--        />-->
    <!--      </q-btn-group>-->
    <!--    </q-drawer>-->

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import { defineComponent, ref } from '@vue/composition-api'

const linksData = [
  {
    nombre: 'Damián Comba',
    idPaciente: '123432'
  },
  {
    nombre: 'Perez Adrian',
    idPaciente: '46546'
  },
  {
    nombre: 'Juan Carlos Garcia',
    idPaciente: '854635'
  },
  {
    nombre: 'María Corengia',
    idPaciente: '546876'
  },
  {
    nombre: 'Daniel Ameal',
    idPaciente: '6541651'
  },
  {
    nombre: 'Rosa Gonzalez',
    idPaciente: '16541654'
  },
  {
    nombre: 'Jesús Ramirez',
    idPaciente: '65465165'
  }
]

export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink },
  setup () {
    const leftDrawerOpen = ref(false)
    const essentialLinks = ref(linksData)

    return { leftDrawerOpen, essentialLinks }
  }
})
</script>
