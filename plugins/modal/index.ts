import { createVfm } from 'vue-final-modal'
import type {Vfm} from "vue-final-modal";

export default defineNuxtPlugin((nuxtApp) => {
  const vfm = createVfm() as any

  nuxtApp.vueApp.use(vfm)
  nuxtApp.provide('modal', vfm)

})


declare module '#app' {
  interface NuxtApp {
    $modal: Vfm
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $modal: Vfm
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $modal: Vfm
  }
}
