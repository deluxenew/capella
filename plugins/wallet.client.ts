// plugins/wallet.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createWallet } from '~/composables/useWallet'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const wallet = createWallet(config.public.baseURL)

  return {
    provide: {
      wallet
    }
  }
})
