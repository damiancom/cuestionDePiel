import { configureCompat } from 'vue'

export default () => {
  configureCompat({
    MODE: 3, // Vue 3 compat mode

    // Configura opciones específicas de compatibilidad
    COMPONENT_V_MODEL: false,
    RENDER_FUNCTION: false,
    GLOBAL_MOUNT: false
  })
}
