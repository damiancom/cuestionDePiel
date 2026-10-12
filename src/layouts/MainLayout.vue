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
        <q-toolbar-title class="text-center q-pt-none q-pl-none q-pr-none" v-if="$q.screen.gt.sm">
          <div class="row justify-center items-center q-gutter-xs">
            <q-btn flat dense no-caps icon="people" label="Pacientes" to="/pacientes" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="person_add" label="Alta" to="/pacientes/nuevo" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="event" label="Agenda" to="/agenda" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="medical_services" label="Servicios" to="/servicios" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="inventory_2" label="Productos" to="/catalogo" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="point_of_sale" label="Ventas" to="/ventas" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="gavel" label="Consentimiento" to="/consentimiento" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="chat" label="Mensajes" to="/mensajes-whatsapp" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="contact_phone" label="Proveedores" to="/proveedores" class="nav-btn-minimal" />
          </div>
        </q-toolbar-title>
        <q-space v-else />

        <div class="row items-center q-gutter-sm q-mr-md">
          <!-- Selector rápido de rediseño en la cabecera -->
          <q-btn
            flat
            dense
            no-caps
            class="theme-header-btn q-px-sm"
            :title="'Rediseño: ' + activeTheme.name"
          >
            <span class="theme-header-dot q-mr-xs" :style="{ backgroundColor: activeTheme.colorPreview }" />
            <span class="gt-sm text-caption text-weight-medium">{{ activeTheme.name }}</span>
            <q-icon name="arrow_drop_down" size="18px" />
            <q-menu auto-close class="q-pa-xs shadow-3" style="min-width: 250px; border-radius: 12px;">
              <q-list dense>
                <q-item-label header class="text-weight-bold text-caption text-grey-8">Propuestas de Rediseño</q-item-label>
                <q-item
                  v-for="t in themes"
                  :key="t.id"
                  clickable
                  :active="currentThemeId === t.id"
                  active-class="bg-grey-2 text-primary text-weight-bold"
                  @click="applyTheme(t.id)"
                  class="rounded-borders q-my-xs"
                >
                  <q-item-section avatar style="min-width: 28px;">
                    <span class="theme-header-dot" :style="{ backgroundColor: t.colorPreview }" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body2">{{ t.name }}</q-item-label>
                    <q-item-label caption class="text-xs">{{ t.subtitle }}</q-item-label>
                  </q-item-section>
                  <q-item-section side v-if="currentThemeId === t.id">
                    <q-icon name="check" size="16px" color="primary" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

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
        <q-route-tab icon="inventory_2" label="Productos" to="/catalogo" />
        <q-route-tab icon="point_of_sale" label="Ventas" to="/ventas" />
        <q-route-tab icon="gavel" label="Consentimiento" to="/consentimiento" />
        <q-route-tab icon="chat" label="Mensajes" to="/mensajes-whatsapp" />
        <q-route-tab icon="contact_phone" label="Proveedores" to="/proveedores" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth';
import { useThemeSelector } from '../composables/useThemeSelector';

const router = useRouter();
const { currentThemeId, themes, applyTheme } = useThemeSelector();

const activeTheme = computed(() => {
  return themes.find(t => t.id === currentThemeId.value) || themes[0];
});

async function handleLogout() {
  await logout();
  router.push('/login');
}
</script>

<style scoped>
.minimal-header {
  border-bottom: 1px solid #e0e4ea;
}

.theme-header-btn {
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.theme-header-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.theme-header-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.text-xs {
  font-size: 11px;
}
</style>
