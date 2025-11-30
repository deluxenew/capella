import type {AuthPlugin} from "~/plugins/3.auth";
import type {Api} from "~/types/api";
interface EthereumProvider {
  request: (args: { method: string }) => Promise<string[]>
  on?: (event: string, callback: (...args: any[]) => void) => void
  removeListener?: (event: string, callback: (...args: any[]) => void) => void
}

declare module '#app' {
  interface NuxtApp {
    $auth: AuthPlugin,
    $api: Api
    $utils: {
      hostToTitle: (host: string) => string
      replaceHostToTitle: (host: string, text: string) => string
    }
    $store: {
      state: {
        metamask: {
          address: string | null
          isConnected: boolean
        }
        system: {
          regExp?: {
            user?: {
              password?: string
            }
          }
        }
      }
      getters: {
        'metamask/METAMASK_ADDRESS': string
        'metamask/IS_CONNECT': boolean
        'metamask/BALANCE': (currency: string) => number
      }
      commit: (mutation: string, payload?: any) => void
    }
    $device: {
      isIos: boolean
      isAndroid: boolean
      isEdge: boolean
      isMobile: boolean
    }
    $t: (key: string) => string
    $notify: (options: { title?: string; type: string; text: string }) => void
    $modal: {
      show: (name: string) => void
      hide: (name: string) => void
      open: (name: string) => void
      close: (name: string) => void
    }
    $router: {
      replace: (path: string) => void
      push: (path: string) => void
    }
    $utm: {
      getUtm: () => string
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: NuxtApp['$api']
    $auth: AuthPlugin
    $store: NuxtApp['$store']
    $device: NuxtApp['$device']
    $t: NuxtApp['$t']
    $notify: NuxtApp['$notify']
    $modal: {  show: (name: string) => void
      hide: (name: string) => void
      open: (name: string) => void
      close: (name: string) => void }
    $router: NuxtApp['$router']
    $utm: NuxtApp['$utm']
    $utils: NuxtApp['$utils']
  }
}

declare module '#app' {
  interface NuxtApp {
    $api: Api
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $device: {
      isIos: boolean
      isAndroid: boolean
      isEdge: boolean
      isMobile: boolean
    }
  }
}

export {}
