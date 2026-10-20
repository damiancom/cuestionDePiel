<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER SUPERIOR MINIMALISTA -->
    <q-header elevated class="bg-white text-primary minimal-header">
      <q-toolbar class="q-pa-none">
        <!-- Botón Toggle Sidebar + Logo y Nombre -->
        <div class="row items-center q-gutter-sm q-pl-md" style="min-width: 220px;">
          <q-btn
            flat
            dense
            round
            icon="menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
            class="q-mr-xs text-primary gt-sm"
          >
            <q-tooltip>{{ leftDrawerOpen ? 'Ocultar menú lateral' : 'Mostrar menú lateral' }}</q-tooltip>
          </q-btn>
          <q-avatar size="36px">
            <img src="/centro-avatar.png" alt="Centro Médico" />
          </q-avatar>
          <div class="text-weight-bold text-primary text-subtitle1">Cuestión de piel</div>
        </div>

        <!-- Subtítulo de Workspace en Desktop -->
        <q-toolbar-title class="q-pl-md" v-if="$q.screen.gt.sm">
          <div class="row items-center text-caption text-grey-7">
            <q-badge color="blue-1" text-color="primary" class="q-mr-xs text-weight-medium">Workspace</q-badge>
            <span>Panel Dermatocosmiátrico</span>
          </div>
        </q-toolbar-title>
        <q-space />

        <!-- Acciones a la Derecha: Selector de Acceso a Catálogo y Usuario -->
        <div class="row items-center q-gutter-sm q-mr-md">
          <!-- Selector para probar opciones de acceso al catálogo en tablet/desktop -->
          <q-btn-dropdown
            flat
            dense
            color="primary"
            icon="tune"
            :label="$q.screen.gt.sm ? `Catálogo: ${catalogModeLabels[catalogAccessMode]}` : ''"
            class="minimal-btn"
            auto-close
          >
            <q-list dense style="min-width: 260px;">
              <q-item-label header class="text-caption text-weight-bold text-primary">
                PROBAR ACCESO A PRODUCTOS EN FICHA
              </q-item-label>
              <q-item clickable @click="catalogAccessMode = 'tabs'" :active="catalogAccessMode === 'tabs'">
                <q-item-section avatar style="min-width: 32px;"><q-icon name="tab" size="18px" color="primary" /></q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">1. En Barra de Pestañas</q-item-label>
                  <q-item-label caption>Botón a la derecha de las tabs clínicas</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable @click="catalogAccessMode = 'fab'" :active="catalogAccessMode === 'fab'">
                <q-item-section avatar style="min-width: 32px;"><q-icon name="smart_button" size="18px" color="primary" /></q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">2. Botón Flotante (FAB)</q-item-label>
                  <q-item-label caption>Esquina inferior derecha (pulgar en tablet)</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable @click="catalogAccessMode = 'sidebar'" :active="catalogAccessMode === 'sidebar'">
                <q-item-section avatar style="min-width: 32px;"><q-icon name="view_sidebar" size="18px" color="primary" /></q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">3. En Dossier del Paciente</q-item-label>
                  <q-item-label caption>Botón en columna lateral izquierda</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator class="q-my-xs" />
              <q-item clickable @click="catalogAccessMode = 'all'" :active="catalogAccessMode === 'all'">
                <q-item-section avatar style="min-width: 32px;"><q-icon name="visibility" size="18px" color="positive" /></q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-primary">Ver Todas las Opciones</q-item-label>
                  <q-item-label caption>Habilita las 3 para comparar ergonomía</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-avatar size="32px" class="q-mr-xs" v-if="$q.screen.gt.xs">
            <img src="/user-avatar.png" alt="Usuario" />
          </q-avatar>
          <div class="text-primary text-caption text-weight-medium q-mr-xs" v-if="$q.screen.gt.xs">Damian Comba</div>
          <q-btn flat round dense icon="logout" color="primary" @click="handleLogout">
            <div class="text-caption q-ml-xs" v-if="$q.screen.gt.xs">Salir</div>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR LATERAL DE APLICACIÓN -->
    <q-drawer
      v-if="$q.screen.gt.sm"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="230"
      class="app-sidebar-drawer"
    >
      <div class="column full-height justify-between q-pa-sm">
        <div>
          <!-- Menú agrupado por módulos -->
          <q-list dense class="q-gutter-y-xs q-pt-xs">
            <!-- Grupo Clínica -->
            <q-item-label header class="text-caption text-weight-bold text-grey-6 q-pb-xs">CLÍNICA</q-item-label>
            <q-item
              clickable
              to="/pacientes"
              exact
              v-ripple
              class="sidebar-item"
              active-class="sidebar-item-active"
            >
              <q-item-section avatar style="min-width: 32px;"><q-icon name="people" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Pacientes</q-item-section>
            </q-item>
            <q-item
              clickable
              to="/pacientes/nuevo"
              exact
              v-ripple
              class="sidebar-item"
              active-class="sidebar-item-active"
            >
              <q-item-section avatar style="min-width: 32px;"><q-icon name="person_add" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Alta Paciente</q-item-section>
            </q-item>
            <q-item
              clickable
              to="/agenda"
              v-ripple
              class="sidebar-item"
              active-class="sidebar-item-active"
            >
              <q-item-section avatar style="min-width: 32px;"><q-icon name="event" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Agenda</q-item-section>
            </q-item>

            <!-- Grupo Atención -->
            <q-item-label header class="text-caption text-weight-bold text-grey-6 q-pt-md q-pb-xs">ATENCIÓN</q-item-label>
            <q-item
              clickable
              to="/servicios"
              v-ripple
              class="sidebar-item"
              active-class="sidebar-item-active"
            >
              <q-item-section avatar style="min-width: 32px;"><q-icon name="medical_services" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Servicios</q-item-section>
            </q-item>
            <q-item
              clickable
              to="/consentimiento"
              v-ripple
              class="sidebar-item"
              active-class="sidebar-item-active"
            >
              <q-item-section avatar style="min-width: 32px;"><q-icon name="gavel" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Consentimiento</q-item-section>
            </q-item>

            <!-- Grupo Gestión -->
            <q-item-label header class="text-caption text-weight-bold text-grey-6 q-pt-md q-pb-xs">GESTIÓN</q-item-label>
            <q-item
              clickable
              to="/catalogo"
              v-ripple
              class="sidebar-item"
              active-class="sidebar-item-active"
            >
              <q-item-section avatar style="min-width: 32px;"><q-icon name="inventory_2" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Productos</q-item-section>
            </q-item>
            <q-item
              clickable
              to="/ventas"
              v-ripple
              class="sidebar-item"
              active-class="sidebar-item-active"
            >
              <q-item-section avatar style="min-width: 32px;"><q-icon name="point_of_sale" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Ventas</q-item-section>
            </q-item>
            <q-item
              clickable
              to="/mensajes-whatsapp"
              v-ripple
              class="sidebar-item"
              active-class="sidebar-item-active"
            >
              <q-item-section avatar style="min-width: 32px;"><q-icon name="chat" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Mensajes</q-item-section>
            </q-item>
            <q-item
              clickable
              to="/proveedores"
              v-ripple
              class="sidebar-item"
              active-class="sidebar-item-active"
            >
              <q-item-section avatar style="min-width: 32px;"><q-icon name="contact_phone" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Proveedores</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Pie del Sidebar -->
        <div>
          <q-separator class="q-my-sm" />
          <div class="row items-center justify-between q-pa-xs">
            <div class="row items-center no-wrap">
              <q-avatar size="28px" class="q-mr-xs">
                <img src="/user-avatar.png" alt="Usuario" />
              </q-avatar>
              <div class="text-caption text-weight-medium text-grey-9 ellipsis" style="max-width: 120px;">Damian Comba</div>
            </div>
            <q-btn flat round dense icon="logout" size="sm" color="grey-7" @click="handleLogout">
              <q-tooltip>Cerrar sesión</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- CONTENEDOR PRINCIPAL -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- NAVEGACIÓN MÓVIL (BOTTOM BAR) -->
    <q-footer v-if="$q.screen.lt.md" elevated class="bg-white text-primary minimal-footer">
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-6"
        mobile-arrows
        outside-arrows
      >
        <q-route-tab icon="people" label="Pacientes" to="/pacientes" exact />
        <q-route-tab icon="person_add" label="Alta" to="/pacientes/nuevo" exact />
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth';
import { catalogAccessMode } from '../composables/useCatalogAccessMode';

const router = useRouter();
const leftDrawerOpen = ref(true);

const catalogModeLabels = {
  tabs: 'Pestañas',
  fab: 'Flotante (FAB)',
  sidebar: 'Dossier',
  all: 'Todas (Comparar)'
};

async function handleLogout() {
  await logout();
  router.push('/login');
}
</script>

<style scoped>
.minimal-header {
  border-bottom: 1px solid #e0e4ea;
  box-shadow: none !important;
}

.minimal-footer {
  border-top: 1px solid #e0e4ea;
  box-shadow: none !important;
}

.app-sidebar-drawer {
  background: #ffffff;
  border-right: 1px solid #e0e4ea;
}

.sidebar-item {
  border-radius: 8px;
  color: #475569;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.sidebar-item:hover {
  background-color: #f4f6fa;
  color: #1976d2;
}

.sidebar-item-active {
  background-color: #eaf1fb !important;
  color: #1976d2 !important;
  font-weight: 600;
}
</style>
