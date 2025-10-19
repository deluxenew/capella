import type { CurrencyInputOptions } from 'vue-currency-input'

declare module '#app' {
  interface NuxtApp {
    $currency: {
      format: (value: number, config?: CurrencyInputOptions) => string
      parse: (value: string) => number
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $currency: {
      format: (value: number, config?: CurrencyInputOptions) => string
      parse: (value: string) => number
    }
  }
}

export {}
