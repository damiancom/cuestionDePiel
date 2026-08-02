/*
 * Quasar CLI configuration for sistema-medico-vue
 * Docs: https://quasar.dev/quasar-cli-vite/quasar-config-js
 */
export default function (ctx) {
  return {
    supportTS: false,
    boot: [],
    extras: [
      'roboto-font',
      'material-icons',
      'fontawesome-v6',
    ],
    build: {
      vueRouterMode: 'history',
    },
    devServer: {
      https: false,
      port: 9000,
      open: false, // opens browser window automatically
      hot: true
    },
    framework: {
      config: {
        notify: {}
      },
      plugins: ['Notify', 'Dialog'],
    },
    animations: [],
    // ssr, pwa, cordova, capacitor, bex config removed for compatibility
  }
}
