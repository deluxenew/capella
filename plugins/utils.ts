// plugins/utils.ts
import utils from '~/utils/custom'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      utils
    }
  }
})
