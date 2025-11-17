import ContractService from '~/utils/custom'

export default defineNuxtPlugin((nuxtApp) => {
  const utils = new ContractService()

  return {

    provide: {
      utils
    }
  }
})


declare module '#app' {
  interface NuxtApp {
    $utils: ContractService
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $utils: ContractService
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $utils: ContractService
  }
}
