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
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  },
  image: {
    provider: 'static', // использовать статический провайдер
  },
  css: [
    '~/assets/css/fonts.css'
  ],
  app: {
    baseURL: '/capella/',
  },
  auth: {
    // Включаем глобальный middleware для обработки аутентификации
    // enableGlobalAppMiddleware: true,
    baseURL: process.env.API_BASE_URL,
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
          // signInResponseRefreshTokenPointer: '/refresh', // Проверьте, что в ответе на signIn поле refresh
          refreshResponseTokenPointer: '/refreshToken', // Проверьте, что в ответе на refresh поле refreshToken
          // refreshRequestTokenPointer: 'refreshToken', // Проверьте, как refresh токен отправляется в запросе
          cookieName: 'auth._refresh_token.local',
          maxAgeInSeconds: 1800,
          sameSiteAttribute: 'lax',
          secureCookieAttribute: false, // Установите в true, если используете HTTPS!
          // cookieDomain: 'app.liquidnow.me', // УБЕРИТЕ ЭТУ СТРОКУ или измените на текущий домен фронтенда!
          httpOnlyCookieAttribute: false, // Установите в true для большей безопасности, если не нужно читать из JS
        }
      },
      token: {
        signInResponseTokenPointer: '/token', // Проверьте, что в ответе на signIn поле token
        maxAgeInSeconds: 1800, // 30 минут
        headerName: 'Authorization',
        sameSiteAttribute: 'lax',
        // cookieDomain: 'app.liquidnow.me', // УБЕРИТЕ ЭТУ СТРОКУ или измените на текущий домен фронтенда!
        cookieName: 'auth._token.local',
        type: 'Bearer',
        secureCookieAttribute: false, // Установите в true, если используете HTTPS!
        httpOnlyCookieAttribute: false, // Установите в true для большей безопасности, если не нужно читать из JS
      },
      refreshToken: {
        signInResponseRefreshTokenPointer: '/refreshToken', // Проверьте, что в ответе на signIn поле refreshToken
        maxAgeInSeconds: 60 * 60 * 24 * 30 // 30 дней
      },
      user: {
        signInResponseUserPointer: false // Оставляем как есть, если используете getSession
        // Или укажите путь к пользователю в ответе signIn, например '/user'
      },
      endpoints: {
        signIn: { path: '/api/v1/login-v2', method: 'post' },
        signOut: { path: '/api/v1/logout', method: 'post' },
        refresh: { path: '/api/v1/refresh', method: 'post' },
        getSession: { path: '/api/v1/profile', method: 'get' } // Убедитесь, что этот эндпоинт требует токен
      },
      // addDefaultCallbackUrl: true, // Уберите, если дублируется
    },
    session: {
      maxAge: 1800,
      updateAge: 300,
    },
    sessionRefresh: {
      // enableOnWindowFocus: true,
      // enablePeriodically: 60000 // Опционально: обновлять каждую минуту
    },
    globalAppMiddleware: {
      // isEnabled: true, // Используем новый стиль
      // allow404WithoutAuth: true, // Опционально
    },
    // Удаляем refreshTokenCookieName, если уже задан в refresh.token.cookieName
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
      baseURL: process.env.API_DEV_URL || 'https://app.liquidnow.me',
      apiBase: process.env.API_BASE_URL || 'https://app.liquidnow.me' || 'https://deluxenew.github.io/capella'
    }
  },
})
