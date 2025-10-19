import { defineNuxtPlugin } from '#app'
import { useCurrency } from '~/composables/useCurrency'

export default defineNuxtPlugin((nuxtApp) => {
  const currency = useCurrency()

  nuxtApp.provide('currency', {
    format: currency.formatCurrency,
    parse: currency.parseCurrency
  })
})
