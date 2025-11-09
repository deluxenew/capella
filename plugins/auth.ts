import type {Api} from "~/types/api";

interface User {
  id: number
  email: string
  name: string
  role: string
  // добавьте другие поля пользователя
}

export interface AuthPlugin {
  loggedIn: boolean
  user: User | null
  setUser: (user: User) => Promise<void>
  logout: () => void
}

export default defineNuxtPlugin((nuxtApp) => {
  const auth: AuthPlugin = {
    loggedIn: false,
    user: null,
    async setUser(user: User) {
      this.user = user
      this.loggedIn = true
    },
    logout() {
      this.user = null
      this.loggedIn = false
    }
  }

  // nuxtApp.provide('auth', auth)
})

declare module '#app' {
  interface NuxtApp {
    $auth: AuthPlugin
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $auth: AuthPlugin
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $auth: AuthPlugin
  }
}
