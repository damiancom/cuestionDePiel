<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-primary minimal-header">
      <q-toolbar class="q-pa-none">
        <div class="row items-center q-gutter-md q-pl-md" style="min-width:200px;">
          <q-avatar size="40px" class="q-mr-sm">
            <img src="/centro-avatar.png" alt="Centro Médico" />
          </q-avatar>
          <div class="text-weight-medium text-primary">Cuestión de piel</div>
        </div>
        
        <!-- Navegación Escritorio -->
        <q-toolbar-title class="text-center q-pt-sm q-pl-none q-pr-none" v-if="$q.screen.gt.sm">
          <div class="row justify-center items-center q-gutter-md">
            <q-btn flat round dense icon="people" to="/pacientes">
              <div class="text-caption">Pacientes</div>
            </q-btn>
            <q-btn flat round dense icon="person_add" to="/pacientes/nuevo">
              <div class="text-caption">Alta</div>
            </q-btn>
            <q-btn flat round dense icon="event" to="/agenda">
              <div class="text-caption">Agenda</div>
            </q-btn>
            <q-btn flat round dense icon="medical_services" to="/servicios">
              <div class="text-caption">Servicios</div>
            </q-btn>
            <q-btn flat round dense icon="auto_awesome" to="/catalogo">
              <div class="text-caption">Catálogo</div>
            </q-btn>
            <q-btn flat round dense icon="point_of_sale" to="/ventas">
              <div class="text-caption">Ventas</div>
            </q-btn>
          </div>
        </q-toolbar-title>
        <q-space v-else />

        <div class="row items-center q-gutter-sm q-mr-md">
          <q-avatar size="32px" class="q-mr-xs" v-if="$q.screen.gt.xs">
            <img src="/user-avatar.png" alt="Usuario" />
          </q-avatar>
          <div class="text-primary text-caption q-mr-xs" v-if="$q.screen.gt.xs">Damian Comba</div>
          <q-btn flat round dense icon="logout" @click="handleLogout">
            <div class="text-caption" v-if="$q.screen.gt.xs">Salir</div>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Navegación Móvil (Bottom Bar) -->
    <q-footer v-if="$q.screen.lt.md" elevated class="bg-white text-primary minimal-footer">
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-6"
        mobile-arrows
        outside-arrows
      >
        <q-route-tab icon="people" label="Pacientes" to="/pacientes" />
        <q-route-tab icon="person_add" label="Alta" to="/pacientes/nuevo" />
        <q-route-tab icon="event" label="Agenda" to="/agenda" />
        <q-route-tab icon="medical_services" label="Servicios" to="/servicios" />
        <q-route-tab icon="auto_awesome" label="Catálogo" to="/catalogo" />
        <q-route-tab icon="point_of_sale" label="Ventas" to="/ventas" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { logout } from '../services/auth';
const router = useRouter();
async function handleLogout() {
  await logout();
  router.push('/login');
}
</script>

<style scoped>
.minimal-header {
  border-bottom: 1px solid #e0e4ea;
}
</style>
