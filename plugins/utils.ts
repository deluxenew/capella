import utils from '~/utils/custom'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      utils
    }
  }
})


declare module '#app' {
  interface NuxtApp {
    $utils: utils
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $utils: utils
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $utils: utils
  }
}
