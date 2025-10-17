import { createVfm } from 'vue-final-modal'
import {promisifyModal , type PromisifiedModal} from "~/plugins/modal/promisify-modal";

export default defineNuxtPlugin((nuxtApp) => {
  const vfm = createVfm() as any

  nuxtApp.vueApp.use(vfm)
  nuxtApp.provide('modal', vfm)

})
