import type { EthereumProvider, MetaMaskState, ConnectResult } from '~/types/metamask'

export const useMetaMask = () => {
  // State
  const state = reactive<MetaMaskState>({
    isConnected: false,
    isInstalled: false,
    isConnecting: false,
    account: null,
    chainId: undefined,
    error: null
  })

  // Getters
  const isConnected = computed(() => state.isConnected)
  const isInstalled = computed(() => state.isInstalled)
  const isConnecting = computed(() => state.isConnecting)
  const account = computed(() => state.account)
  const chainId = computed(() => state.chainId)
  const error = computed(() => state.error)

  // Проверка установлен ли MetaMask
  const checkMetaMaskInstalled = (): boolean => {
    const installed = typeof window !== 'undefined' && !!window.ethereum?.isMetaMask
    state.isInstalled = installed
    return installed
  }

  // Получение текущего аккаунта
  const getCurrentAccount = async (): Promise<string | null> => {
    if (!checkMetaMaskInstalled()) return null

    try {
      const accounts = await window.ethereum!.request({
        method: 'eth_accounts'
      })
      return accounts[0] || null
    } catch (error) {
      console.error('Error getting current account:', error)
      return null
    }
  }

  // Получение текущей сети
  const getCurrentChainId = async (): Promise<string | undefined> => {
    if (!checkMetaMaskInstalled()) return

    try {
      return await window.ethereum!.request({
        method: 'eth_chainId'
      })
    } catch (error) {
      console.error('Error getting chain ID:', error)
      return
    }
  }

  // Подключение к MetaMask
  const connect = async (): Promise<ConnectResult> => {
    if (!checkMetaMaskInstalled()) {
      const errorMsg = 'MetaMask is not installed'
      state.error = errorMsg
      return { success: false, error: errorMsg }
    }

    state.isConnecting = true
    state.error = null

    try {
      // Запрос подключения
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts'
      })

      if (accounts && accounts.length > 0) {
        const account = accounts[0]
        const chainId = await getCurrentChainId()

        state.account = account
        state.chainId = chainId
        state.isConnected = true
        state.isConnecting = false

        // Сохраняем в localStorage
        if (process.client) {
          localStorage.setItem('metamask_connected', 'true')
        }

        return {
          success: true,
          account,
          chainId
        }
      } else {
        throw new Error('No accounts found')
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to connect to MetaMask'
      state.error = errorMsg
      state.isConnecting = false

      return {
        success: false,
        error: errorMsg
      }
    }
  }

  // Отключение от MetaMask
  const disconnect = (): void => {
    state.isConnected = false
    state.account = null
    state.chainId = undefined
    state.error = null

    // Удаляем из localStorage
    if (process.client) {
      localStorage.removeItem('metamask_connected')
    }
  }

  // Смена аккаунта
  const switchAccount = async (): Promise<ConnectResult> => {
    // В MetaMask нет прямого метода для смены аккаунта,
    // поэтому запрашиваем аккаунты заново
    return await connect()
  }

  // Смена сети
  const switchNetwork = async (chainId: string): Promise<boolean> => {
    if (!checkMetaMaskInstalled()) return false

    try {
      await window.ethereum!.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      })
      return true
    } catch (error: any) {
      // Если сеть не добавлена, добавляем её
      if (error.code === 4902) {
        return await addNetwork(chainId)
      }
      console.error('Error switching network:', error)
      return false
    }
  }

  // Добавление сети
  const addNetwork = async (chainId: string): Promise<boolean> => {
    if (!checkMetaMaskInstalled()) return false

    // Конфигурации популярных сетей
    const networks: Record<string, any> = {
      '0x1': {
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        blockExplorerUrls: ['https://etherscan.io']
      },
      '0x89': {
        chainName: 'Polygon Mainnet',
        rpcUrls: ['https://polygon-rpc.com/'],
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        blockExplorerUrls: ['https://polygonscan.com/']
      },
      '0x38': {
        chainName: 'Binance Smart Chain',
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        blockExplorerUrls: ['https://bscscan.com/']
      }
    }

    const networkConfig = networks[chainId]
    if (!networkConfig) {
      console.error('Network configuration not found for chainId:', chainId)
      return false
    }

    try {
      await window.ethereum!.request({
        method: 'wallet_addEthereumChain',
        params: [{ chainId, ...networkConfig }]
      })
      return true
    } catch (error) {
      console.error('Error adding network:', error)
      return false
    }
  }

  // Подписка на события MetaMask
  const setupEventListeners = (): void => {
    if (!checkMetaMaskInstalled()) return

    // Смена аккаунта
    window.ethereum!.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        // Пользователь отключил кошелек
        disconnect()
      } else {
        state.account = accounts[0]
      }
    })

    // Смена сети
    window.ethereum!.on('chainChanged', (chainId: string) => {
      state.chainId = chainId
      // Обновляем страницу при смене сети (стандартная практика)
      window.location.reload()
    })

    // Отключение
    window.ethereum!.on('disconnect', (error: any) => {
      console.error('MetaMask disconnected:', error)
      disconnect()
    })
  }

  // Удаление подписок на события
  const removeEventListeners = (): void => {
    if (!checkMetaMaskInstalled()) return

    window.ethereum!.removeListener('accountsChanged', () => {})
    window.ethereum!.removeListener('chainChanged', () => {})
    window.ethereum!.removeListener('disconnect', () => {})
  }

  // Инициализация при загрузке страницы
  const initialize = async (): Promise<void> => {
    if (!checkMetaMaskInstalled()) return

    setupEventListeners()

    // Проверяем, был ли пользователь уже подключен
    if (process.client && localStorage.getItem('metamask_connected') === 'true') {
      const currentAccount = await getCurrentAccount()
      const currentChainId = await getCurrentChainId()

      if (currentAccount) {
        state.account = currentAccount
        state.chainId = currentChainId
        state.isConnected = true
      }
    }
  }

  // Получение короткого формата адреса
  const getShortAddress = (address: string | null): string => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Копирование адреса в буфер обмена
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  return {
    // State
    state: readonly(state),

    // Getters
    isConnected,
    isInstalled,
    isConnecting,
    account,
    chainId,
    error,

    // Methods
    checkMetaMaskInstalled,
    connect,
    disconnect,
    switchAccount,
    switchNetwork,
    initialize,
    getShortAddress,
    copyToClipboard,
    setupEventListeners,
    removeEventListeners
  }
}
