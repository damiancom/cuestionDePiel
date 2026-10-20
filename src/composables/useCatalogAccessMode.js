import { ref, watch } from 'vue';

const STORAGE_KEY = 'patient_catalog_access_mode';
const validModes = ['tabs', 'fab', 'sidebar', 'all'];

const initialMode = localStorage.getItem(STORAGE_KEY) || 'all';
export const catalogAccessMode = ref(validModes.includes(initialMode) ? initialMode : 'all');

watch(catalogAccessMode, (newVal) => {
  localStorage.setItem(STORAGE_KEY, newVal);
});

export function useCatalogAccessMode() {
  return {
    catalogAccessMode,
    setMode: (mode) => {
      if (validModes.includes(mode)) {
        catalogAccessMode.value = mode;
      }
    }
  };
}
