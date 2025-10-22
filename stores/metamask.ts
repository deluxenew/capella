// stores/metamask.ts
import { defineStore } from 'pinia'

export interface MetamaskState {
  account: string
  netId: number
  address: string
  isConnect: boolean
  balances: Record<string, number>
  web3: any
}

export const useMetamaskStore = defineStore('metamask', {
  state: (): MetamaskState => ({
    account: '',
    netId: 0,
    address: '',
    isConnect: false,
    balances: {},
    web3: null
  }),

  getters: {
    METAMASK_ACCOUNT: (state): string => state.account,
    METAMASK_NET_ID: (state): number => state.netId,
    METAMASK_ADDRESS: (state): string => state.address,
    IS_CONNECT: (state): boolean => state.isConnect,
    BALANCE: (state) => (currency?: string): number => state.balances[currency || ''] || 0
  },

  actions: {
    setAccount(account: string) {
      this.account = account
    },
    setNetId(netId: number) {
      this.netId = netId
    },
    setAddress(address: string) {
      this.address = address
    },
    setIsConnect(isConnect: boolean) {
      this.isConnect = isConnect
    },
    setBalance(currency: string, balance: number) {
      this.balances[currency] = balance
    },
    setWeb3(web3: any) {
      this.web3 = web3
    }
  }
})
