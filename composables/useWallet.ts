// composables/useWallet.ts
import { ref, readonly } from 'vue'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'

type WalletStatus = 'idle' | 'connecting' | 'connected' | 'error'

export const createWallet = (apiBaseURL: string) => {
  const status = ref<WalletStatus>('idle')
  const account = ref<string | null>(null)
  const error = ref<string | null>(null)

  const connect = async (): Promise<boolean> => {
    status.value = 'connecting'
    error.value = null

    try {
      const provider: any = await detectEthereumProvider()

      if (!provider) {
        error.value = 'MetaMask не найден. Пожалуйста, установите MetaMask.'
        status.value = 'error'
        return false
      }

      const web3 = new Web3(provider)
      const accounts = await provider.request({ method: 'eth_requestAccounts' })

      if (accounts.length === 0) {
        error.value = 'Аккаунт не выбран'
        status.value = 'error'
        return false
      }

      account.value = accounts[0]
      status.value = 'connected'
      return true
    } catch (err: any) {
      error.value = err.message || 'Ошибка при подключении'
      status.value = 'error'
      return false
    }
  }

  const signMessage = async (message: string): Promise<string | null> => {
    if (!account.value) {
      error.value = 'Сначала подключите кошелек'
      return null
    }

    try {
      const provider: any = await detectEthereumProvider()
      if (!provider) {
        error.value = 'Provider не найден'
        return null
      }

      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, account.value]
      })

      return signature
    } catch (err: any) {
      error.value = err.message || 'Ошибка при подписании'
      return null
    }
  }

  return {
    status: readonly(status),
    account: readonly(account),
    error: readonly(error),
    connect,
    signMessage
  }
}

export const useWallet = () => {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$wallet
}
