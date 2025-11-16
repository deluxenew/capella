// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/i18n'
  ],
  css: [
    '~/assets/css/fonts.css'
  ],
  auth: {
    // Включаем глобальный middleware для обработки аутентификации
    enableGlobalAppMiddleware: true,
    baseURL: process.env.API_BASE_URL,
    provider: {
      type: 'local',

      // Настройки токена
      token: {
        signInResponseTokenPointer: '/token',
        maxAgeInSeconds: 1800, // 30 минут
        headerName: 'Authorization',
        sameSiteAttribute: 'lax',
        cookieDomain: 'app.liquidnow.me',
        cookieName: 'auth._token_short.local',
        type: 'Bearer', // ← именно так
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false,
      },

      // Настройки refresh токена
      refreshToken: {
        signInResponseRefreshTokenPointer: '/refreshToken',
        maxAgeInSeconds: 60 * 60 * 24 * 30 // 30 дней
      },

      // Настройки пользователя
      user: {
        signInResponseUserPointer: false // Загружаем отдельно через getSession
      },

      // Эндпоинты
      endpoints: {
        signIn: { path: '/api/v1/login-v2', method: 'post' },
        signOut: { path: '/api/v1/logout', method: 'post' },
        refresh: { path: '/api/v1/refresh', method: 'post' },
        getSession: { path: '/api/v1/profile', method: 'get' }
      },

      // Дополнительные настройки для refresh токена
      addDefaultCallbackUrl: true,
      refreshTokenCookieName: 'auth._refresh_token.local',
    },

    // Настройки обновления сессии
    session: {
      // Время жизни сессии
      maxAge: 1800,
      // Обновлять токен перед истечением
      updateAge: 300, // 5 минут до истечения
    },

    // Настройки refresh сессии
    sessionRefresh: {
      enableOnWindowFocus: true,
      // Интервал периодического обновления (в ms)
      // Обновлять при фокусе окна
    },

    // Кастомизация глобального middleware
    globalAppMiddleware: {
      // Отключаем автоматический редирект на логин
      // isEnabled: true,
      // // Кастомное поведение при 401
      // allow404WithoutAuth: true,
      // // Добавляем свою логику обработки ошибок
      // addDefaultCallbackUrl: false,
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
      baseURL: process.env.API_BASE_URL,
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },
})
