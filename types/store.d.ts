// types/stores.d.ts
import { Store } from 'vuex'

declare module 'vuex' {
  export interface Store<S> {
    getters: any
    state: any
  }
}

// Или более специфичные типы
interface MetamaskState {
  account: string
  netId: number
  address: string
  isConnect: boolean
  balances: Record<string, number>
  web3: any
}

interface RootState {
  metamask: MetamaskState
}

export { RootState, MetamaskState }
