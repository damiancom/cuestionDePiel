module.exports = configure(function (ctx) {
  return {
    supportTS: {
      tsCheckerConfig: {
        eslint: {
          files: './src/**/*.{ts,tsx,js,jsx,vue}'
        }
      }
    },

    boot: [
      'vue-compat',
      'axios',
      'firebase'
    ],

    css: [
      'app.sass'
    ],

    extras: [
      'roboto-font',
      'material-icons-round',
      'material-icons'
    ],

    build: {
      vueRouterMode: 'hash',

      // Configuración de compatibilidad Vue 3
      vueCompilerOptions: {
        compatConfig: {
          MODE: 3,
          COMPILER_V_ON_NATIVE: false,
          COMPILER_V_BIND_SYNC: false
        }
      },

      extendWebpack (cfg) {
        if (ctx.prod) {
          cfg.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
          })
        }
      }
    },

    devServer: {
      https: false,
      port: 8080,
      open: true
    },

    framework: {
      iconSet: 'material-icons',
      lang: 'es',
      config: {
        notify: {
          timeout: 2500,
          position: 'bottom'
        },
        dark: false
      },
      importStrategy: 'auto',
      plugins: [
        'Notify',
        'Cookies',
        'Loading',
        'LocalStorage'
      ]
    },

    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {},
      manifest: {
        name: 'Cuestion de piel',
        short_name: 'Cuestion de piel',
        description: 'Software para la gestión de pacientes de la empresa Cuestión de Piel',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      bundler: 'packager',
      nodeIntegration: true
    }
  }
})
