<template>
  <div class="theme-selector-wrapper">
    <!-- Pastilla Flotante Minimizable -->
    <div
      v-if="!isExpanded"
      class="theme-floating-pill cursor-pointer shadow-3"
      @click="isExpanded = true"
    >
      <div class="row items-center no-wrap q-gutter-x-sm">
        <q-avatar size="24px" :style="{ backgroundColor: activeTheme.colorPreview }" text-color="white">
          <q-icon :name="activeTheme.icon" size="14px" />
        </q-avatar>
        <div class="column">
          <div class="text-caption text-weight-bold lh-tight">{{ activeTheme.name }}</div>
          <div class="text-caption text-grey-6 text-xs lh-tight">Rediseño activo • Clic para cambiar</div>
        </div>
        <q-btn flat round dense icon="keyboard_arrow_up" size="sm" color="grey-7" class="q-ml-xs" />
      </div>
    </div>

    <!-- Panel Flotante Expandido -->
    <q-card v-else class="theme-floating-panel shadow-5">
      <q-card-section class="q-pb-xs row items-center justify-between no-wrap">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="palette" color="primary" size="20px" />
          <div>
            <div class="text-subtitle2 text-weight-bold">Propuestas de Rediseño</div>
            <div class="text-caption text-grey-7">Elige el estilo que mejor se adapte al usuario</div>
          </div>
        </div>
        <q-btn flat round dense icon="close" size="sm" color="grey-6" @click="isExpanded = false">
          <q-tooltip>Minimizar selector</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-separator class="q-my-xs" />

      <q-card-section class="q-py-sm q-gutter-y-xs">
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="theme-option-item cursor-pointer q-pa-sm rounded-borders transition-all"
          :class="{ 'theme-option-active': currentThemeId === theme.id }"
          @click="selectTheme(theme.id)"
        >
          <div class="row items-start no-wrap q-gutter-x-sm">
            <!-- Muestra de color y estado -->
            <div class="column items-center q-pt-xs">
              <span
                class="theme-color-dot"
                :style="{ backgroundColor: theme.colorPreview }"
              >
                <q-icon v-if="currentThemeId === theme.id" name="check" size="12px" color="white" />
              </span>
            </div>

            <!-- Información del estilo -->
            <div class="col">
              <div class="row items-center justify-between no-wrap">
                <span class="text-weight-bold text-body2">
                  {{ theme.name }}
                </span>
                <q-badge
                  :color="currentThemeId === theme.id ? 'primary' : 'grey-4'"
                  :text-color="currentThemeId === theme.id ? 'white' : 'grey-8'"
                  class="text-xs"
                >
                  {{ theme.tag }}
                </q-badge>
              </div>
              <div class="text-caption text-weight-medium text-grey-8 q-mt-xs">
                {{ theme.subtitle }}
              </div>
              <div class="text-caption text-grey-7 text-xs q-mt-xs leading-normal">
                {{ theme.description }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator class="q-my-xs" />

      <q-card-actions align="between" class="q-px-md q-py-xs text-caption text-grey-6">
        <span class="row items-center">
          <q-icon name="info" size="14px" class="q-mr-xs text-primary" />
          100% funcionalidad preservada
        </span>
        <q-btn flat dense no-caps label="Ocultar" size="sm" color="grey-7" @click="isExpanded = false" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Notify } from 'quasar';
import { useThemeSelector } from '../composables/useThemeSelector';

const { currentThemeId, themes, applyTheme } = useThemeSelector();
const isExpanded = ref(false);

const activeTheme = computed(() => {
  return themes.find(t => t.id === currentThemeId.value) || themes[0];
});

function selectTheme(id) {
  applyTheme(id);
  const selected = themes.find(t => t.id === id);
  if (selected) {
    Notify.create({
      message: `Estilo aplicado: ${selected.name}`,
      caption: selected.subtitle,
      icon: selected.icon,
      color: 'dark',
      timeout: 1200,
      position: 'top'
    });
  }
}
</script>

<style scoped>
.theme-selector-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: inherit;
}

/* Pastilla colapsada */
.theme-floating-pill {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 30px;
  padding: 6px 14px 6px 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
}

.theme-floating-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
}

/* Panel expandido */
.theme-floating-panel {
  width: 360px;
  max-width: 92vw;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
}

.lh-tight {
  line-height: 1.2;
}

.text-xs {
  font-size: 11px;
}

.theme-option-item {
  border: 1px solid transparent;
  background: #f8fafc;
  margin-bottom: 6px;
}

.theme-option-item:hover {
  background: #f1f5f9;
}

.theme-option-active {
  background: #ffffff !important;
  border-color: var(--primary-color, #0d9488) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.theme-color-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.leading-normal {
  line-height: 1.35;
}

@media (max-width: 599px) {
  .theme-selector-wrapper {
    bottom: 72px; /* Espacio para el footer tab en móviles */
    right: 12px;
  }
  .theme-floating-panel {
    width: 320px;
  }
}
</style>
