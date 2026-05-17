<template>
  <q-date v-model="date" minimal />
</template>
<script setup>
import { ref } from 'vue';
const date = ref('');
</script>
