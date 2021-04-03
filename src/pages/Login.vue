<template>
  <div class="login" id="login">
    <div class="log-email">
      <q-input
        type="text"
        label="Email"
        :class="'log-input' + (account===''?' log-input-empty':'')"
        v-model="account"
        autocomplete="nope"
      />
      <q-input
        :type="isPwd ? 'fieldTypes.password' : 'text'"
        label="Password"
        :class="'log-input' + (password===''?' log-input-empty':'')"
        v-model="password"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'r_visibility_off' : 'r_visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <q-btn class="log-btn" color="amber" @click="login" glossy label="Ingresar"/>
    </div>
    <!--<Loading v-if="isLoging" marginTop="-30%"></Loading>-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Login.vue',
  data () {
    return {
      isPwd: true
    }
  }
})
</script>

<style scoped>

</style>
