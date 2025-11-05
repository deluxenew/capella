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
    isEnabled: false,
    disableServerSideAuth: true,
    provider: {
      type: 'authjs'
    },
    // originEnvKey: 'AUTH_ORIGIN',
    baseURL: 'https://stager.liquidnow.me',
    // sessionRefresh: {
    //   enablePeriodically: true,
    //   enableOnWindowFocus: true,
    // }
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
    '~/plugins/currency-input.client.ts',
    '~/plugins/currency.global.ts'
  ],
  build: {
    transpile: ['vue-currency-input']
  },
  imports: {
    autoImport: true
  }
})
