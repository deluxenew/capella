import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localeData from 'dayjs/plugin/localeData'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

// Подключаем необходимые плагины
dayjs.extend(relativeTime)
dayjs.extend(localeData)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs
    }
  }
})


declare module '#app' {
  interface NuxtApp {
    $dayjs: typeof dayjs
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $dayjs: typeof dayjs
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dayjs: typeof dayjs
  }
}
