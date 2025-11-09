export interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, callback: (...args: any[]) => void) => void
  removeListener: (event: string, callback: (...args: any[]) => void) => void
  selectedAddress: string | null
  chainId: string | null
  isMetaMask?: boolean
}

export interface MetaMaskState {
  isConnected: boolean
  isInstalled: boolean
  isConnecting: boolean
  account: string | null
  chainId?: string
  error: string | null
}

export interface ConnectResult {
  success: boolean
  account?: string
  chainId?: string
  error?: string
}


// Декларация для глобального компонента, если он используется
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    'vue-metamask': any
  }
}
