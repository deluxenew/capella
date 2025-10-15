// composables/useMetamask.ts
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

  const connectMetamask = async (): Promise<void> => {
    const ethereum = window.ethereum

    if (!ethereum) {
      throw new Error('Metamask not installed')
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]

      $store.commit('metamask/SET_ADDRESS', address)
      $store.commit('metamask/SET_CONNECTED', true)
    } catch (error) {
      throw new Error('Metamask connection failed')
    }
  }

  const metaMaskAddress = computed(() => {
    return $store.getters['metamask/METAMASK_ADDRESS'] as string
  })

  const isConnected = computed(() => {
    return $store.getters['metamask/IS_CONNECT'] as boolean
  })

  const hasMetamask = computed(() => {
    return !!window.ethereum
  })

  return {
    connectMetamask,
    metaMaskAddress,
    isConnected,
    hasMetamask
  }
}
