import { defineNuxtPlugin } from '#app'
import * as VueCurrencyInput from 'vue-currency-input'

// Конфигурация для плагина
const pluginOptions = {
  globalOptions: {
    locale: 'en',
    currency: null,
    valueAsInteger: false,
    distractionFree: false,
    allowNegative: false,
    precision: 2,
    autoDecimalMode: true,
    valueRange: {
      min: undefined,
      max: undefined
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueCurrencyInput.default || VueCurrencyInput, pluginOptions)
})
