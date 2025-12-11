// ... остальная часть импортов
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
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/image'
  ],
  colorMode: {
    preference: 'system',
    fallback: 'light',
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
    baseURL: '/capella/', // Это влияет на маршрутизацию Nuxt, но не на API-запросы напрямую
  },
  // Убедитесь, что API-маршруты вашего GitHub Pages приложения проксируются на stage-frontend.liquidnow.me
  // Но если это невозможно, используйте baseURL для модуля auth
  auth: {
    // baseURL будет использоваться для формирования URL всех эндпоинтов аутентификации
    // Убедитесь, что это значение корректно установлено в runtimeConfig.public
    // или жестко закодировано здесь, если оно не меняется.
    // Однако, стандартный auth.baseURL может добавлять префикс ко всем маршрутам, включая getSession.
    // Более точный способ - указать полный URL в самих endpoint'ах.
    // baseURL: process.env.API_BASE_URL, // Не рекомендуется использовать вместе с endpoint'ами ниже

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
        // ИСПРАВЛЕНО: Указываем полный URL для refresh
        endpoint: {
          path: `${process.env.API_BASE_URL || 'https://stage-frontend.liquidnow.me'}/api/v1/refresh`,
          method: 'post'
        },
        refreshOnlyToken: true,
        token: {
          refreshResponseTokenPointer: '/refreshToken',
          cookieName: 'auth._refresh_token.local',
          maxAgeInSeconds: 1800,
          sameSiteAttribute: 'lax',
          secureCookieAttribute: false,
          httpOnlyCookieAttribute: false, // Рассмотрите установку в true для безопасности
        }
      },
      token: {
        signInResponseTokenPointer: '/token',
        maxAgeInSeconds: 1800, // 30 минут
        headerName: 'Authorization',
        sameSiteAttribute: 'lax',
        cookieName: 'auth._token.local',
        type: 'Bearer',
        secureCookieAttribute: false, // Рассмотрите установку в true для безопасности
        httpOnlyCookieAttribute: false, // Рассмотрите установку в true для безопасности
      },
      refreshToken: {
        signInResponseRefreshTokenPointer: '/refreshToken',
        maxAgeInSeconds: 60 * 60 * 24 * 30 // 30 дней
      },
      user: {
        signInResponseUserPointer: false
      },
      endpoints: {
        // ИСПРАВЛЕНО: Указываем полные URLs для эндпоинтов
        signIn: {
          path: `${process.env.API_BASE_URL || 'https://stage-frontend.liquidnow.me'}/api/v1/login-v2`,
          method: 'post'
        },
        signOut: {
          path: `${process.env.API_BASE_URL || 'https://stage-frontend.liquidnow.me'}/api/v1/logout`,
          method: 'post'
        },
        // refresh уже определен выше в блоке refresh.endpoint
        // Оставляем getSession как относительный путь, если он также находится на API_BASE_URL
        // Если getSession НЕ на API_BASE_URL, его нужно тоже указать как полный URL
        // getSession: {
        //   path: `${process.env.API_BASE_URL || 'https://stage-frontend.liquidnow.me'}/api/v1/profile`,
        //   method: 'get'
        // }
        // ИЛИ, если baseURL для auth используется, можно оставить относительный путь для getSession
        // и настроить baseURL выше (но это влияет на все эндпоинты, что может быть нежелательно)
        getSession: { path: '/api/v1/profile', method: 'get' } // Этот путь будет добавлен к baseURL auth
      },
    },
    session: {
      maxAge: 1800,
      updateAge: 300,
    },
    sessionRefresh: {
      // enableOnWindowFocus: true,
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
    // baseURL: '', // Это для внутреннего использования Nuxt, не влияет на auth
    public: {
      // baseURL: process.env.API_DEV_URL || 'https://stage-frontend.liquidnow.me' || 'http://localhost:3000', // Переименовал или удалил, чтобы не путать
      apiBase: process.env.API_BASE_URL || 'https://stage-frontend.liquidnow.me' // Используйте это имя
    }
  },
});
