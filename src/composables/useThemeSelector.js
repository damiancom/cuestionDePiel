import { ref } from 'vue';
import { setCssVar } from 'quasar';

export const THEMES = [
  {
    id: 'layout-hero-banner',
    name: '1. Banner Superior',
    tag: 'Propuesta 1',
    subtitle: 'Hero Banner & Menú Agrupado',
    description: 'Reorganización horizontal: Los datos del paciente pasan a un banner superior de 1 línea/fila, liberando el 100% del ancho para la anamnesis. El menú superior se simplifica en 3 grupos desplegables (Pacientes, Atención, Gestión).',
    primary: '#0d9488',
    secondary: '#0f766e',
    accent: '#14b8a6',
    bg: '#f8fafc',
    colorPreview: '#0d9488',
    icon: 'view_agenda',
    badgeText: 'Banner Horizontal'
  },
  {
    id: 'layout-app-sidebar',
    name: '2. Sidebar de Aplicación',
    tag: 'Propuesta 2',
    subtitle: 'Navegación Lateral & Dossier Estructurado',
    description: 'Reorganización tipo Workspace (estilo Linear): La navegación pasa a una barra lateral izquierda colapsable. La cabecera queda limpia y los datos del paciente se ordenan en bloques temáticos (Identidad, Contacto, Notas).',
    primary: '#965842',
    secondary: '#804634',
    accent: '#c49a82',
    bg: '#fbf8f3',
    colorPreview: '#965842',
    icon: 'view_sidebar',
    badgeText: 'Sidebar Lateral'
  },
  {
    id: 'layout-clinical-focus',
    name: '3. Foco Clínico',
    tag: 'Propuesta 3',
    subtitle: 'Resumen Superior & Drawer Desplegable',
    description: 'Máxima concentración médica: Arriba solo se ve una barra de contexto de 1 fila (Agustina Oscos • 34 años • Celular). Al pulsar "Ver Ficha", se abre un panel lateral deslizante (Drawer). Todo el espacio es para la consulta.',
    primary: '#4338ca',
    secondary: '#3730a3',
    accent: '#6366f1',
    bg: '#f1f3f5',
    colorPreview: '#4338ca',
    icon: 'fullscreen',
    badgeText: 'Focus Drawer'
  },
  {
    id: 'layout-bento-grid',
    name: '4. Bento Grid Modular',
    tag: 'Propuesta 4',
    subtitle: 'Micro-tarjetas Modulares Colapsables',
    description: 'Estructura modular moderna: Los datos del paciente se dividen en 3 micro-tarjetas visuales (Identidad, Contacto y Alertas) que se pueden colapsar con 1 clic para tener pantalla completa.',
    primary: '#0284c7',
    secondary: '#0369a1',
    accent: '#38bdf8',
    bg: '#f0f9ff',
    colorPreview: '#0284c7',
    icon: 'dashboard',
    badgeText: 'Bento Modular'
  },
  {
    id: 'original',
    name: 'Original',
    tag: 'Comparativa',
    subtitle: 'Organización Clásica Actual',
    description: 'Muestra el menú horizontal de 10 botones individuales y la columna lateral fija a la izquierda del paciente para contrastar el antes y después.',
    primary: '#1976d2',
    secondary: '#26a69a',
    accent: '#9c27b0',
    bg: '#f8f9fa',
    colorPreview: '#1976d2',
    icon: 'history',
    badgeText: 'Clásico'
  }
];

const STORAGE_KEY = 'cuestion_de_piel_theme';
const currentThemeId = ref(localStorage.getItem(STORAGE_KEY) || 'layout-hero-banner');

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

      // 2. Establecer variables CSS directamente
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
