<template>
  <q-btn :label="label" :color="color" :icon="icon" :to="to" :flat="flat" :dense="dense" />
</template>
<script setup>
defineProps({
  label: String,
  color: String,
  icon: String,
  to: String,
  flat: Boolean,
  dense: Boolean
})
</script>
