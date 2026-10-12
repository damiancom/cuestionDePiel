import { ref } from 'vue';
import { setCssVar } from 'quasar';

export const THEMES = [
  {
    id: 'clean-nordic',
    name: 'Clínico Nórdico',
    tag: 'Propuesta 1',
    subtitle: 'Minimalista & Sereno',
    description: 'Paleta verde salvia y slate limpio. Sin sombras invasivas ni zebra striping. Espacios despejados diseñados para eliminar la fatiga visual.',
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
    tag: 'Propuesta 2',
    subtitle: 'Boutique & Cosmecéutico',
    description: 'Inspirado en clínicas dermatológicas de autor (estilo Aesop). Fondo alabastro cálido, acentos terracota y lino, con esquinas orgánicas.',
    primary: '#965842',
    secondary: '#804634',
    accent: '#c49a82',
    bg: '#fbf8f3',
    colorPreview: '#965842',
    icon: 'auto_awesome',
    badgeText: 'Terracota & Arena'
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    tag: 'Propuesta 3',
    subtitle: 'Alta Precisión & Índigo',
    description: 'Inspirado en interfaces de precisión (estilo Apple Health / Notion). Máxima legibilidad, bordes nítidos de 1px y acento azul índigo.',
    primary: '#4338ca',
    secondary: '#3730a3',
    accent: '#6366f1',
    bg: '#f1f3f5',
    colorPreview: '#4338ca',
    icon: 'tune',
    badgeText: 'Índigo & Zinc'
  },
  {
    id: 'original',
    name: 'Original',
    tag: 'Comparativa',
    subtitle: 'Look Actual (Azul Clásico)',
    description: 'El diseño anterior con azul Quasar y zebra striping tradicional. Ideal para contrastar el antes y después en 1 clic.',
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
    try {
      localStorage.setItem(STORAGE_KEY, found.id);
    } catch (e) {
      console.warn('Error saving theme to localStorage', e);
    }

    if (typeof document !== 'undefined') {
      const docEl = document.documentElement;
      const bodyEl = document.body;
      const appEl = document.getElementById('q-app');

      // 1. Establecer atributo data-theme en html, body y app
      docEl.setAttribute('data-theme', found.id);
      bodyEl.setAttribute('data-theme', found.id);
      if (appEl) appEl.setAttribute('data-theme', found.id);

      // 2. Establecer variables CSS directamente para respuesta inmediata e infalible
      const targets = [docEl, bodyEl];
      if (appEl) targets.push(appEl);

      targets.forEach(el => {
        el.style.setProperty('--q-primary', found.primary);
        el.style.setProperty('--q-secondary', found.secondary);
        el.style.setProperty('--q-accent', found.accent);
        el.style.setProperty('--primary-color', found.primary);
        el.style.setProperty('--app-bg', found.bg);
      });

      // 3. Informar a Quasar
      try {
        if (typeof setCssVar === 'function') {
          setCssVar('primary', found.primary, docEl);
          setCssVar('primary', found.primary, bodyEl);
          setCssVar('secondary', found.secondary, docEl);
          setCssVar('secondary', found.secondary, bodyEl);
        }
      } catch (e) {
        console.warn('setCssVar Quasar fallback', e);
      }
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
