<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';

const route = useRoute();
const layout = computed(() => {
  if (route.meta && route.meta.layout === 'auth') return AuthLayout;
  return MainLayout;
});
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
  background: #f8f9fa;
}

.q-btn {
  text-transform: none;
}

.minimal-btn,
.minimal-btn-save,
.minimal-btn-delete {
  border-radius: 8px;
  font-weight: 500;
  font-size: 15px;
  min-width: 90px;
  box-shadow: none;
  text-transform: none;
}

.minimal-btn-save {
  background: #1976d2;
  color: #fff;
  transition: background 0.15s;
}

.minimal-btn-save:hover {
  background: #125ea7;
}

.minimal-btn-delete {
  background: #c10015;
  color: #fff;
  transition: background 0.15s;
}

.minimal-btn-delete:hover {
  background: #9a0011;
}

.minimal-actions {
  padding: 12px 24px 16px 24px !important;
  background: transparent;
}
</style>
