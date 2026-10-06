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

@media (max-width: 599px) {
  .minimal-btn,
  .minimal-btn-save,
  .minimal-btn-delete {
    min-width: auto;
    padding: 6px 12px;
  }
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
  background: #c10015 !important;
  color: #fff !important;
  transition: background 0.15s;
}

.minimal-btn-delete:hover {
  background: #9a0011 !important;
}

.minimal-actions {
  padding: 12px 24px 16px 24px !important;
  background: transparent;
}

/* Quasar Dialog Plugin: asegurar que botones de diálogos tengan formato minimal */
.q-dialog-plugin .q-card__actions {
  padding: 12px 20px 16px 20px !important;
  gap: 8px;
}

.q-dialog-plugin .q-btn {
  border-radius: 8px !important;
  font-weight: 500 !important;
  font-size: 15px !important;
  min-width: 90px !important;
  box-shadow: none !important;
  text-transform: none !important;
}

.q-dialog-plugin .q-card__actions .q-btn--flat.text-primary {
  background: #1976d2 !important;
  color: #fff !important;
  transition: background 0.15s;
}

.q-dialog-plugin .q-card__actions .q-btn--flat.text-primary:hover {
  background: #125ea7 !important;
}

/* Campo de búsqueda de cabecera unificado */
.minimal-search-input {
  background: transparent !important;
  box-shadow: none !important;
  font-size: 15px;
  min-width: 140px;
  max-width: 240px;
}

.minimal-search-input .q-field__control {
  border-bottom: 1.5px solid #e0e4ea !important;
  border-radius: 0 !important;
  transition: border-color 0.2s;
  padding: 0 12px !important;
}

.minimal-search-input:focus-within .q-field__control {
  border-color: #1976d2 !important;
}

@media (max-width: 599px) {
  .minimal-search-input {
    flex: 1;
    min-width: 0;
    max-width: none;
  }
}

/* Tablas: alternancia sutil de fondo entre filas (zebra striping) y hover */
.q-table tbody tr:nth-child(even) {
  background-color: #f4f6fa;
}

.q-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.q-table tbody tr:hover,
.q-table tbody tr:hover td {
  background-color: #eaf1fb !important;
}
</style>

