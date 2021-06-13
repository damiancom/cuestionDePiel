<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    color="#B39DDB"
  >
    <v-list dense nav class="py-0">
      <v-list-item two-line>

        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="">
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Corengia</v-list-item-title>
          <v-list-item-subtitle>María Cecilia</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
      >
        <v-list-item-icon>
          <v-icon large color="dark darken-2">
            {{ item.icon }}
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'NavigationBar',
  data () {
    return {
      drawer: true,
      items: [
        { title: 'Pacientes', icon: 'mdi-account-multiple' },
        { title: 'Lesion', icon: 'mdi-arrow-up-bold-box-outline' },
        { title: 'Anamnesis', icon: 'mdi-arrow-up-bold-box-outline' },
        { title: 'Tratamientos', icon: 'mdi-arrow-up-bold-box-outline' },
        { title: 'About', icon: 'mdi-help-box' }
      ]
    }
  },
  computed: {
  }

})
</script>

<style scoped>

</style>
