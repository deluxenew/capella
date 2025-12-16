// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/image'
  ],
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage',
    storageKey: 'nuxt-color-mode'
  },
  image: {
    provider: 'static',
  },
  css: [
    '~/assets/css/fonts.css'
  ],
  app: {
    baseURL: '/capella/',
  },
  auth: {
    baseURL: '/', // Используем прокси-путь по умолчанию
    defaultCallbackUrl: '/cabinet/dashboard',

    provider: {
      type: 'local',
      session: {
        dataType: {
          id: 'string',
          email: 'string',
          name: 'string',
          role: 'string',
          address: 'string',
          coinBalance: 'any',
          withdrawRequest: 'any',
          referralCode: 'any',
          confirmRegistration: 'boolean',
          addresses: {
            registrationFee: {}
          }
        },
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: '/api/v1/refresh', method: 'post' },
        refreshOnlyToken: true,
        token: {
          refreshResponseTokenPointer: '/refreshToken',
          cookieName: 'auth._refresh_token.local',
          maxAgeInSeconds: 1800,
          sameSiteAttribute: 'lax',
          secureCookieAttribute: false,
          httpOnlyCookieAttribute: false,
        }
      },
      token: {
        signInResponseTokenPointer: '/token',
        maxAgeInSeconds: 1800,
        headerName: 'Authorization',
        sameSiteAttribute: 'lax',
        cookieName: 'auth._token.local',
        type: 'Bearer',
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false,
      },
      refreshToken: {
        signInResponseRefreshTokenPointer: '/refreshToken',
        maxAgeInSeconds: 60 * 60 * 24 * 30
      },
      user: {
        signInResponseUserPointer: false
      },
      endpoints: {
        signIn: { path: '/api/v1/login-v2', method: 'post' },
        signOut: { path: '/api/v1/logout', method: 'post' },
        refresh: { path: '/api/v1/refresh', method: 'post' },
        getSession: { path: '/api/v1/profile', method: 'get' }
      },
    },
    session: {
      maxAge: 1800,
      updateAge: 300,
    },
    sessionRefresh: {
      enableOnWindowFocus: false,
      // enablePeriodically: 60000
    },
    globalAppMiddleware: {
      // isEnabled: true,
      // allow404WithoutAuth: true,
    },
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
    '~/plugins/wallet.client.ts',
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
      baseURL:  '/',
      apiBase: '/'
    }
  },

  // --- Настройка dev-сервера ---
  // --- Конец настройки dev-сервера ---
});
