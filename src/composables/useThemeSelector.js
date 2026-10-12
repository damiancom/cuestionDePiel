import { ref } from 'vue';
import { colors } from 'quasar';

const { setCssVar } = colors;

export const THEMES = [
  {
    id: 'clean-nordic',
    name: 'Clínico Nórdico',
    tag: 'Opción 1',
    subtitle: 'Minimalista & Sereno',
    description: 'Paleta salvia y slate limpio. Espacios diáfanos, bordes ultrafinos y sin sombras invasivas. Diseñado para eliminar la fatiga visual.',
    primary: '#0d9488',
    secondary: '#0f766e',
    accent: '#14b8a6',
    bg: '#f8fafc',
    colorPreview: '#0d9488',
    icon: 'spa',
    badgeText: 'Salvia & Slate'
  },
  {
    id: 'soft-warm',
    name: 'Dermo Soft Warm',
    tag: 'Opción 2',
    subtitle: 'Boutique & Cosmecéutico',
    description: 'Inspirado en clínicas estéticas y cosmecéutica premium. Tonos cálidos terracota, arena y marfil que brindan cercanía y sofisticación.',
    primary: '#9e6b55',
    secondary: '#855541',
    accent: '#c49a82',
    bg: '#fbf9f5',
    colorPreview: '#9e6b55',
    icon: 'auto_awesome',
    badgeText: 'Terracota & Arena'
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    tag: 'Opción 3',
    subtitle: 'Alta Precisión & Índigo',
    description: 'Inspirado en interfaces de alta ingeniería (estilo Apple Health / Notion). Enfoque nítido con bordes geométricos y acento índigo moderno.',
    primary: '#4f46e5',
    secondary: '#4338ca',
    accent: '#6366f1',
    bg: '#f4f4f5',
    colorPreview: '#4f46e5',
    icon: 'tune',
    badgeText: 'Índigo & Zinc'
  },
  {
    id: 'original',
    name: 'Original',
    tag: 'Comparativa',
    subtitle: 'Diseño Actual (Azul Clásico)',
    description: 'El diseño actual con azul Quasar y sombras clásicas. Permite contrastar los cambios de inmediato.',
    primary: '#1976d2',
    secondary: '#26a69a',
    accent: '#9c27b0',
    bg: '#f8f9fa',
    colorPreview: '#1976d2',
    icon: 'history',
    badgeText: 'Azul Original'
  }
];

const STORAGE_KEY = 'cuestion_de_piel_theme';
const currentThemeId = ref(localStorage.getItem(STORAGE_KEY) || 'clean-nordic');

export function useThemeSelector() {
  function applyTheme(themeId) {
    const found = THEMES.find(t => t.id === themeId) || THEMES[0];
    currentThemeId.value = found.id;
    localStorage.setItem(STORAGE_KEY, found.id);

    // Asignar atributo en el DOM raíz
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', found.id);
      document.body.setAttribute('data-theme', found.id);
    }

    // Actualizar colores dinámicos de Quasar
    try {
      setCssVar('primary', found.primary);
      setCssVar('secondary', found.secondary);
      setCssVar('accent', found.accent);
    } catch (e) {
      console.warn('No se pudo actualizar cssVar de Quasar', e);
    }
  }

  function initTheme() {
    applyTheme(currentThemeId.value);
  }

  return {
    currentThemeId,
    themes: THEMES,
    applyTheme,
    initTheme
  };
}
