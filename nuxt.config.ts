// https://nuxt.com/docs/api/configuration/nuxt-config
import {defineNuxtConfig} from "nuxt/config";

export default defineNuxtConfig({
  $development: undefined,
  $env: undefined,
  $meta: undefined,
  $production: undefined,
  $test: undefined,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss',  '@pinia/nuxt',  '@vueuse/nuxt'],
  css: [
    '~/assets/css/fonts.css'
  ],
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
})
