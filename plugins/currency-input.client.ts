import { defineNuxtPlugin } from '#app'
import * as VueCurrencyInput from 'vue-currency-input'
import type { CurrencyInputOptions} from "vue-currency-input";


// Конфигурация для плагина
const pluginOptions: CurrencyInputOptions = {
    locale: 'en',
    currency: 'USD',
    precision: 2,
    valueRange: {
      min: undefined,
      max: undefined
    }

}

export default defineNuxtPlugin((nuxtApp) => {

})
