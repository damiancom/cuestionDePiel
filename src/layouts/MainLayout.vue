<template>
  <q-layout :view="currentThemeId === 'layout-app-sidebar' ? 'hHh lpR fFf' : 'lHh Lpr lFf'">
    <!-- HEADER -->
    <q-header elevated class="bg-white text-primary minimal-header">
      <q-toolbar class="q-pa-none">
        <!-- Logo y Nombre o Toggle Drawer en Sidebar Layout -->
        <div class="row items-center q-gutter-sm q-pl-md" style="min-width: 220px;">
          <q-btn
            v-if="currentThemeId === 'layout-app-sidebar'"
            flat
            dense
            round
            icon="menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
            class="q-mr-xs text-primary gt-sm"
          />
          <q-avatar size="36px">
            <img src="/centro-avatar.png" alt="Centro Médico" />
          </q-avatar>
          <div class="text-weight-bold text-primary text-subtitle1">Cuestión de piel</div>
        </div>

        <!-- ─────────────────────────────────────────────────────────────
             NAVEGACIÓN 1: MENÚ AGRUPADO (Propuesta 1 - Hero Banner)
             Reduce 10 botones apiñados a 3 grupos limpios y lógicos
             ───────────────────────────────────────────────────────────── -->
        <q-toolbar-title class="text-center q-pt-none q-pl-none q-pr-none" v-if="$q.screen.gt.sm && currentThemeId === 'layout-hero-banner'">
          <div class="row justify-center items-center q-gutter-sm">
            <!-- Grupo 1: Pacientes -->
            <q-btn flat dense no-caps icon="people" label="Pacientes" class="nav-btn-minimal">
              <q-icon name="arrow_drop_down" size="18px" />
              <q-menu auto-close class="q-pa-xs shadow-3" style="min-width: 180px; border-radius: 10px;">
                <q-list dense>
                  <q-item clickable to="/pacientes" class="rounded-borders">
                    <q-item-section avatar style="min-width: 28px;"><q-icon name="people" color="primary" size="18px" /></q-item-section>
                    <q-item-section>Lista de Pacientes</q-item-section>
                  </q-item>
                  <q-item clickable to="/pacientes/nuevo" class="rounded-borders">
                    <q-item-section avatar style="min-width: 28px;"><q-icon name="person_add" color="primary" size="18px" /></q-item-section>
                    <q-item-section>Alta de Paciente</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <!-- Grupo 2: Atención Clínica -->
            <q-btn flat dense no-caps icon="medical_services" label="Atención Clínica" class="nav-btn-minimal">
              <q-icon name="arrow_drop_down" size="18px" />
              <q-menu auto-close class="q-pa-xs shadow-3" style="min-width: 200px; border-radius: 10px;">
                <q-list dense>
                  <q-item clickable to="/agenda" class="rounded-borders">
                    <q-item-section avatar style="min-width: 28px;"><q-icon name="event" color="primary" size="18px" /></q-item-section>
                    <q-item-section>Agenda de Turnos</q-item-section>
                  </q-item>
                  <q-item clickable to="/servicios" class="rounded-borders">
                    <q-item-section avatar style="min-width: 28px;"><q-icon name="medical_services" color="primary" size="18px" /></q-item-section>
                    <q-item-section>Catálogo de Servicios</q-item-section>
                  </q-item>
                  <q-item clickable to="/consentimiento" class="rounded-borders">
                    <q-item-section avatar style="min-width: 28px;"><q-icon name="gavel" color="primary" size="18px" /></q-item-section>
                    <q-item-section>Consentimiento Informado</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <!-- Grupo 3: Gestión & Comercial -->
            <q-btn flat dense no-caps icon="business_center" label="Gestión & Comercial" class="nav-btn-minimal">
              <q-icon name="arrow_drop_down" size="18px" />
              <q-menu auto-close class="q-pa-xs shadow-3" style="min-width: 210px; border-radius: 10px;">
                <q-list dense>
                  <q-item clickable to="/catalogo" class="rounded-borders">
                    <q-item-section avatar style="min-width: 28px;"><q-icon name="inventory_2" color="primary" size="18px" /></q-item-section>
                    <q-item-section>Productos / Cosmecéutica</q-item-section>
                  </q-item>
                  <q-item clickable to="/ventas" class="rounded-borders">
                    <q-item-section avatar style="min-width: 28px;"><q-icon name="point_of_sale" color="primary" size="18px" /></q-item-section>
                    <q-item-section>Registro de Ventas</q-item-section>
                  </q-item>
                  <q-item clickable to="/mensajes-whatsapp" class="rounded-borders">
                    <q-item-section avatar style="min-width: 28px;"><q-icon name="chat" color="primary" size="18px" /></q-item-section>
                    <q-item-section>Mensajes de WhatsApp</q-item-section>
                  </q-item>
                  <q-item clickable to="/proveedores" class="rounded-borders">
                    <q-item-section avatar style="min-width: 28px;"><q-icon name="contact_phone" color="primary" size="18px" /></q-item-section>
                    <q-item-section>Contactos / Proveedores</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-toolbar-title>

        <!-- ─────────────────────────────────────────────────────────────
             NAVEGACIÓN 2: SIDEBAR APP (Propuesta 2 - Workspace)
             Cabecera limpia, navegación se muda al lateral
             ───────────────────────────────────────────────────────────── -->
        <q-toolbar-title class="q-pl-md" v-else-if="$q.screen.gt.sm && currentThemeId === 'layout-app-sidebar'">
          <div class="row items-center text-caption text-grey-7">
            <q-badge color="grey-3" text-color="grey-9" class="q-mr-xs">Workspace</q-badge>
            <span>Panel Dermatocosmiátrico</span>
          </div>
        </q-toolbar-title>

        <!-- ─────────────────────────────────────────────────────────────
             NAVEGACIÓN 3: FOCO CLÍNICO (Propuesta 3)
             Barra superior compacta con iconos y texto minimalista
             ───────────────────────────────────────────────────────────── -->
        <q-toolbar-title class="text-center q-pt-none q-pl-none q-pr-none" v-else-if="$q.screen.gt.sm && currentThemeId === 'layout-clinical-focus'">
          <div class="row justify-center items-center q-gutter-xs">
            <q-btn flat dense no-caps icon="people" label="Pacientes" to="/pacientes" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="event" label="Agenda" to="/agenda" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="medical_services" label="Servicios" to="/servicios" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="point_of_sale" label="Ventas" to="/ventas" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="chat" label="Mensajes" to="/mensajes-whatsapp" class="nav-btn-minimal" />
            <q-btn flat dense round icon="more_horiz" class="nav-btn-minimal text-grey-7">
              <q-menu auto-close class="q-pa-xs shadow-3" style="min-width: 170px; border-radius: 10px;">
                <q-list dense>
                  <q-item clickable to="/pacientes/nuevo"><q-item-section>+ Alta Paciente</q-item-section></q-item>
                  <q-item clickable to="/catalogo"><q-item-section>Productos</q-item-section></q-item>
                  <q-item clickable to="/consentimiento"><q-item-section>Consentimiento</q-item-section></q-item>
                  <q-item clickable to="/proveedores"><q-item-section>Proveedores</q-item-section></q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-toolbar-title>

        <!-- ─────────────────────────────────────────────────────────────
             NAVEGACIÓN 4: BENTO GRID (Propuesta 4 - Modular)
             Botones estilo pill moderno
             ───────────────────────────────────────────────────────────── -->
        <q-toolbar-title class="text-center q-pt-none q-pl-none q-pr-none" v-else-if="$q.screen.gt.sm && currentThemeId === 'layout-bento-grid'">
          <div class="row justify-center items-center q-gutter-xs">
            <q-btn flat dense no-caps icon="people" label="Pacientes" to="/pacientes" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="event" label="Agenda" to="/agenda" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="medical_services" label="Servicios" to="/servicios" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="inventory_2" label="Productos" to="/catalogo" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="point_of_sale" label="Ventas" to="/ventas" class="nav-btn-minimal" />
            <q-btn flat dense no-caps icon="chat" label="Mensajes" to="/mensajes-whatsapp" class="nav-btn-minimal" />
          </div>
        </q-toolbar-title>

        <!-- ─────────────────────────────────────────────────────────────
             NAVEGACIÓN ORIGINAL (Look Clásico)
             Los 10 botones uno al lado del otro
             ───────────────────────────────────────────────────────────── -->
        <q-toolbar-title class="text-center q-pt-none q-pl-none q-pr-none" v-else-if="$q.screen.gt.sm">
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

        <!-- ACCIONES DERECHA -->
        <div class="row items-center q-gutter-sm q-mr-md">
          <!-- Selector de rediseño en la cabecera -->
          <q-btn
            flat
            dense
            no-caps
            class="theme-header-btn q-px-sm"
            :title="'Organización: ' + activeTheme.name"
          >
            <span class="theme-header-dot q-mr-xs" :style="{ backgroundColor: activeTheme.colorPreview }" />
            <span class="gt-sm text-caption text-weight-medium">{{ activeTheme.name }}</span>
            <q-icon name="arrow_drop_down" size="18px" />
            <q-menu auto-close class="q-pa-xs shadow-3" style="min-width: 270px; border-radius: 12px;">
              <q-list dense>
                <q-item-label header class="text-weight-bold text-caption text-grey-8">Propuestas de Organización</q-item-label>
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

    <!-- ─────────────────────────────────────────────────────────────
         SIDEBAR LATERAL DE APLICACIÓN (Solo activo en Propuesta 2)
         ───────────────────────────────────────────────────────────── -->
    <q-drawer
      v-if="currentThemeId === 'layout-app-sidebar'"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="230"
      class="app-sidebar-drawer"
    >
      <div class="column full-height justify-between q-pa-sm">
        <div>
          <!-- Cabecera Sidebar -->
          <div class="row items-center q-pa-sm q-mb-xs">
            <q-avatar size="32px" class="q-mr-sm">
              <img src="/centro-avatar.png" alt="Logo" />
            </q-avatar>
            <div class="text-weight-bold text-subtitle2 text-primary">Cuestión de piel</div>
          </div>

          <q-separator class="q-mb-sm" />

          <!-- Menú agrupado por módulos -->
          <q-list dense class="q-gutter-y-xs">
            <!-- Grupo Clínica -->
            <q-item-label header class="text-caption text-weight-bold text-grey-6 q-pb-xs">CLÍNICA</q-item-label>
            <q-item clickable to="/pacientes" v-ripple class="rounded-borders">
              <q-item-section avatar style="min-width: 32px;"><q-icon name="people" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Pacientes</q-item-section>
            </q-item>
            <q-item clickable to="/pacientes/nuevo" v-ripple class="rounded-borders">
              <q-item-section avatar style="min-width: 32px;"><q-icon name="person_add" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Alta Paciente</q-item-section>
            </q-item>
            <q-item clickable to="/agenda" v-ripple class="rounded-borders">
              <q-item-section avatar style="min-width: 32px;"><q-icon name="event" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Agenda</q-item-section>
            </q-item>

            <!-- Grupo Servicios & Consentimiento -->
            <q-item-label header class="text-caption text-weight-bold text-grey-6 q-pt-md q-pb-xs">ATENCIÓN</q-item-label>
            <q-item clickable to="/servicios" v-ripple class="rounded-borders">
              <q-item-section avatar style="min-width: 32px;"><q-icon name="medical_services" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Servicios</q-item-section>
            </q-item>
            <q-item clickable to="/consentimiento" v-ripple class="rounded-borders">
              <q-item-section avatar style="min-width: 32px;"><q-icon name="gavel" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Consentimiento</q-item-section>
            </q-item>

            <!-- Grupo Comercial & Mensajería -->
            <q-item-label header class="text-caption text-weight-bold text-grey-6 q-pt-md q-pb-xs">GESTIÓN</q-item-label>
            <q-item clickable to="/catalogo" v-ripple class="rounded-borders">
              <q-item-section avatar style="min-width: 32px;"><q-icon name="inventory_2" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Productos</q-item-section>
            </q-item>
            <q-item clickable to="/ventas" v-ripple class="rounded-borders">
              <q-item-section avatar style="min-width: 32px;"><q-icon name="point_of_sale" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Ventas</q-item-section>
            </q-item>
            <q-item clickable to="/mensajes-whatsapp" v-ripple class="rounded-borders">
              <q-item-section avatar style="min-width: 32px;"><q-icon name="chat" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Mensajes</q-item-section>
            </q-item>
            <q-item clickable to="/proveedores" v-ripple class="rounded-borders">
              <q-item-section avatar style="min-width: 32px;"><q-icon name="contact_phone" size="20px" /></q-item-section>
              <q-item-section class="text-body2">Proveedores</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Pie del Drawer -->
        <div>
          <q-separator class="q-my-sm" />
          <div class="row items-center justify-between q-pa-xs">
            <div class="row items-center no-wrap">
              <q-avatar size="28px" class="q-mr-xs">
                <img src="/user-avatar.png" alt="Usuario" />
              </q-avatar>
              <div class="text-caption text-weight-medium ellipsis" style="max-width: 120px;">Damian Comba</div>
            </div>
            <q-btn flat round dense icon="logout" size="sm" @click="handleLogout" />
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth';
import { useThemeSelector } from '../composables/useThemeSelector';

const router = useRouter();
const leftDrawerOpen = ref(true);
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

.app-sidebar-drawer {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
}

.text-xs {
  font-size: 11px;
}
</style>
