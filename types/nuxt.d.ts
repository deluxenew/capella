import type {PromisifiedModal} from "~/plugins/modal/promisify-modal";
interface EthereumProvider {
  request: (args: { method: string }) => Promise<string[]>
  on?: (event: string, callback: (...args: any[]) => void) => void
  removeListener?: (event: string, callback: (...args: any[]) => void) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

declare module '#app' {
  interface NuxtApp {
    $api: {
      auth: {
        login: (credentials: any) => Promise<any>
      }
      user: {
        connectMM: (data: any) => Promise<any>
      }
      dashboard: {
        deposit: (params: any) => Promise<any>
        getRegistrationFee: () => Promise<any>
      }
    }
    $auth: {
      loggedIn: boolean
      $state: {
        user?: {
          id: string
          name?: string
          login?: string
          role?: string
          metaMaskAddress?: string
          confirmRegistration?: boolean
          addresses?: {
            registrationFee: Record<string, string>
          }
        }
      }
      logout: () => Promise<void>
    }
    $utils: any
    $store: {
      state: {
        metamask: {
          metaMaskAddress: string | null
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
    $modal: PromisifiedModal
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
    $auth: NuxtApp['$auth']
    $store: NuxtApp['$store']
    $device: NuxtApp['$device']
    $t: NuxtApp['$t']
    $notify: NuxtApp['$notify']
    $modal:  PromisifiedModal
    $router: NuxtApp['$router']
    $utm: NuxtApp['$utm']
    $utils: NuxtApp['$utils']
  }
}

export {}
