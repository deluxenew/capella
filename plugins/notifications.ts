import Notifications, { type NotificationsOptions, useNotification } from '@kyvg/vue3-notification'

const { notify } = useNotification()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Notifications)
  nuxtApp.provide('notify', notify)
})

type NotificationsOptionsExtended = NotificationsOptions & {
  data?: {
    icon?: string
    closable?: boolean
  }
}

declare module '#app' {
  interface NuxtApp {
    $notify: {
      (args: NotificationsOptionsExtended | string): void
      close(id: unknown): void
    }
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $notify: {
      (args: NotificationsOptionsExtended | string): void
      close(id: unknown): void
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // @ts-ignore
    $notify: {
      (args: NotificationsOptionsExtended | string): void
      close(id: unknown): void
    }
  }
}
