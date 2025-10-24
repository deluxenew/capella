interface EthereumProvider {
  request: (args: { method: string }) => Promise<string[]>
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

export const useMetamask = () => {
  const { $store } = useNuxtApp()
  const store = useMetamaskStore()

  const connectMetamask = async (): Promise<void> => {
    const ethereum = window.ethereum

    if (!ethereum) {
      throw new Error('Metamask not installed')
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]

      store.setAddress(address)
      store.setIsConnect( true)
    } catch (error) {
      throw new Error('Metamask connection failed')
    }
  }

  const address = computed(() => {
    return store.METAMASK_ADDRESS as string
  })

  const isConnected = computed(() => {
    return store.IS_CONNECT as boolean
  })

  const hasMetamask = computed(() => {
    return !!window.ethereum
  })

  return {
    connectMetamask,
    address,
    isConnected,
    hasMetamask
  }
}
