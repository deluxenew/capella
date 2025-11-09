// https://nuxt.com/docs/api/configuration/nuxt-config
import {defineNuxtConfig} from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,
  $development: undefined,
  $env: undefined,
  $meta: undefined,
  $production: undefined,
  $test: undefined,
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},
  modules: [ '@sidebase/nuxt-auth', '@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/device', '@nuxtjs/i18n'],
  css: [
    '~/assets/css/fonts.css'
  ],
  auth: {
    // Базовые настройки
    enableGlobalAppMiddleware: true,
    defaultProvider: 'local',

    // Настройки провайдеров
    provider: {
      type: 'local',

      // Настройки токенов
      token: {
        signInResponseTokenPointer: '/token',
        headerName: 'Authorization',
        type: 'Bearer',
        maxAgeInSeconds: 1800,
      },

      // Настройки refresh токена
      refreshToken: {
        signInResponseRefreshTokenPointer: '/refreshToken',
        maxAgeInSeconds: 60 * 60 * 24 * 30,
      },

      // Настройки пользователя
      user: {
        signInResponseUserPointer: false, // или укажите путь, например '/user'
        // autoFetch: true - включено по умолчанию
      },

      // Эндпоинты
      endpoints: {
        signIn: {
          path: '/api/v1/login-v2',
          method: 'post'
        },
        signOut: {
          path: '/api/v1/logout',
          method: 'post'
        },
        refresh: {
          path: '/api/v1/refresh',
          method: 'post'
        },
        getSession: {
          path: '/api/v1/profile',
          method: 'get'
        },
      },

      // Дополнительные провайдеры (OAuth)
      // pages: {
      //   login: '/auth/login'
      // }
    },

    // OAuth провайдеры
    globalAppMiddleware: {
      // isEnabled: true
    },

    // Дополнительные настройки сессии
    session: {
      enableRefreshPeriodically: false,
      enableRefreshOnWindowFocus: true,
    }
  },
  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en',
        iso: 'en-US',
        file: 'en-US.ts',
      },
      {
        name: 'Russian',
        code: 'ru',
        iso: 'ru-RU',
        file: 'ru-RU.ts',
      },
    ],
    langDir: 'lang/',
    defaultLocale: 'en',
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            inter: ['Inter', 'sans-serif'],
          },
        },
      },
    },
  },
  typescript: {
    typeCheck: true,
    strict: true
  },
  plugins: [
    '~/plugins/1.api.ts',
    '~/plugins/init.client.ts',
    '~/plugins/currency-input.client.ts',
    '~/plugins/currency.global.ts',
    '~/plugins/system.client.ts',
  ],
  build: {
    transpile: ['vue-currency-input']
  },
  imports: {
    autoImport: true,
    dirs: ['stores', 'types/**/*.ts']
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },
})
