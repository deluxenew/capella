import { defineNuxtPlugin, useNuxtApp } from '#app'
import { useMetamaskStore } from '~/stores/metamask'
import type { Currency } from "~/utils/custom"

class Web3Parser {
  web3: any = null
  listenersInitialized = false

  isMetamaskDetected() {
    return typeof window !== 'undefined' && !!window.ethereum
  }

  async connect() {
    const metamaskStore = useMetamaskStore()
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not detected')
    }

    try {
      // Запрашиваем доступ к аккаунтам
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      // Инициализируем Web3
      const Web3 = (await import('web3')).default
      this.web3 = new Web3(window.ethereum)

      // Получаем данные подключения
      const networkId = await this.web3.eth.net.getId()
      const account = accounts[0]

      // Обновляем store
      metamaskStore.setMetaMaskStatus({
        metaMaskAddress: account,
        netID: networkId
      })
      metamaskStore.setWeb3(this.web3)

      this.initListeners()
      await this.updateAccount()
      await this.updateBalance()

      return {
        web3: this.web3,
        metaMaskAddress: account,
        netID: networkId
      }
    } catch (error: any) {
      console.error('MetaMask connection error:', error)
      if (useNuxtApp().$notify) {
        useNuxtApp().$notify({
          title: 'Warning',
          text: `MetaMask connection failed: ${error.message}`,
          type: 'warn',
        })
      }
      throw error
    }
  }

  async updateAccount() {
    const metamaskStore = useMetamaskStore()
    if (!this.web3) return null

    try {
      const accounts = await this.web3.eth.getAccounts()
      const account = accounts[0] || ''

      // Обновляем store
      metamaskStore.setAccount(account)

      return account
    } catch (error) {
      console.error('Error getting accounts:', error)
      return null
    }
  }

  async updateBalance() {
    const metamaskStore = useMetamaskStore()
    if (!this.web3) return null

    try {
      const account = await this.getAccount()
      if (!account) return null

      // Получаем ETH баланс - исправлено для предотвращения ошибки с BigInt
      const ethBalanceRaw = await this.web3.eth.getBalance(account)
      const ethBalance = Number(ethBalanceRaw) / Math.pow(10, 18)

      // Обновляем ETH баланс в store
      metamaskStore.setBalance('ETH', ethBalance)

      // Получаем балансы токенов
      const prs = useNuxtApp().$utils.availableCurrencies.map(async (currency) => {
        try {
          const contract = await useNuxtApp().$utils.contractFactory(currency, this.web3)
          const [balanceRaw, decimalsRaw] = await Promise.all([
            contract.methods.balanceOf(account).call(),
            contract.methods.decimals().call(),
          ])

          // Явное преобразование для предотвращения ошибки с BigInt
          const balance = typeof balanceRaw === 'string' ? BigInt(balanceRaw) : BigInt(String(balanceRaw))
          const decimals = Number(decimalsRaw)

          const tokenBalance = Number(balance) / Math.pow(10, decimals)
          // Обновляем баланс токена в store
          metamaskStore.setBalance(currency, tokenBalance)

          return {
            currency,
            balance: tokenBalance,
          }
        } catch (error) {
          console.warn(`Error getting balance for ${currency}:`, error)
          // Устанавливаем 0 в случае ошибки
          metamaskStore.setBalance(currency, 0)
          return {
            currency,
            balance: 0,
          }
        }
      })

      await Promise.all(prs)
      return metamaskStore.balances
    } catch (error) {
      console.error('Error updating balance:', error)
      return null
    }
  }

  async getAccount() {
    if (!this.web3) return null
    const accounts = await this.web3.eth.getAccounts()
    console.log(accounts)
    return accounts[0] || null
  }

  async getBalance(currency?: string) {
    const metamaskStore = useMetamaskStore()
    return metamaskStore.BALANCE(currency)
  }

  async getNetwork() {
    if (!this.web3) return null
    try {
      const networkId = await this.web3.eth.net.getId()
      return networkId
    } catch (error) {
      console.error('Error getting network:', error)
      return null
    }
  }

  async sendTransaction(receiver: string, amount: number) {
    if (!this.web3) {
      throw new Error('Web3 not initialized')
    }

    const account = await this.getAccount()
    if (!account) {
      throw new Error('No account connected')
    }

    return new Promise((resolve, reject) => {
      // Используем шестнадцатеричную строку для предотвращения проблем с большими числами
      this.web3.eth.sendTransaction({
        to: receiver,
        from: account,
        value: `0x${Math.ceil(amount * Math.pow(10, 18)).toString(16)}`,
      }, (err: any, res: any) => {
        if (err) {
          if (useNuxtApp().$notify) {
            useNuxtApp().$notify({
              title: 'Warning',
              text: err.message,
              type: 'warn',
            })
          }
          reject(err)
        } else {
          if (useNuxtApp().$notify) {
            useNuxtApp().$notify({
              title: 'Success',
              text: `Tx ${res}`,
              type: 'success',
            })
          }
          resolve(res)
        }
      })
    })
  }

  async send({ currency, pool, amount, address: receiver }: {
    currency: Currency;
    pool?: string;
    amount: number;
    address: string
  }) {
    const metamaskStore = useMetamaskStore()
    if (!metamaskStore.IS_CONNECT) {
      throw new Error('MetaMask not connected')
    }

    if (metamaskStore.METAMASK_NET_ID !== 1) {
      throw new Error(`MetaMask networkId: ${metamaskStore.METAMASK_NET_ID} not supported now - work in progress`)
    }

    const account = await this.getAccount()
    if (!account) {
      throw new Error('No account connected')
    }

    try {
      let tx: any
      switch (currency) {
        case 'ETH': {
          tx = await this.sendTransaction(receiver, amount)
          break
        }
        default: {
          const contract = await useNuxtApp().$utils.contractFactory(currency, this.web3)
          const decimals = Number(await contract.methods.decimals().call())
          const amountInWei = `0x${Math.ceil(amount * Math.pow(10, decimals)).toString(16)}`

          const gasEstimate = await contract.methods
            .transfer(
              receiver,
              amountInWei,
            )
            .estimateGas({ from: account })

          console.log('Gas estimate:', gasEstimate)

          const receipt = await contract.methods
            .transfer(
              receiver,
              amountInWei,
            )
            .send({ from: account, gas: gasEstimate })

          tx = receipt.transactionHash
          break
        }
      }

      if (pool && useNuxtApp().$api) {
        await useNuxtApp().$api.dashboard.deposit({
          pool,
          amount,
          currency,
          transaction: tx,
        })
      }

      return tx
    } catch (error: any) {
      console.error('Send error:', error)
      if (useNuxtApp().$notify) {
        if (error.response) {
          useNuxtApp().$notify({
            title: 'Warning',
            text: error.response.data.message,
            type: 'warn',
          })
        } else {
          useNuxtApp().$notify({
            title: 'Warning',
            text: error.message,
            type: 'warn',
          })
        }
      }
      throw error
    }
  }

  initListeners() {
    const metamaskStore = useMetamaskStore()
    if (this.listenersInitialized || !this.web3 || !this.web3._provider) return

    this.web3._provider.on('chainChanged', async (d: string) => {
      const netID = parseInt(d, 16)

      // Обновляем store
      metamaskStore.setNetId(netID)

      await this.updateBalance()
    })

    this.web3._provider.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length > 0) {
        // Обновляем store
        metamaskStore.setAccount(accounts[0])
        await this.updateBalance()
      } else {
        // Обновляем store
        metamaskStore.setAccount('')
        metamaskStore.setIsConnect(false)
      }
    })

    this.listenersInitialized = true
  }

  // Метод для проверки подключения
  isConnected() {
    const metamaskStore = useMetamaskStore()
    return !!this.web3 && metamaskStore.IS_CONNECT
  }

  // Метод для отключения
  disconnect() {
    const metamaskStore = useMetamaskStore()
    if (this.web3 && this.web3._provider) {
      this.web3._provider.removeAllListeners()
    }
    this.web3 = null
    this.listenersInitialized = false

    // Сбрасываем store
    metamaskStore.setAccount('')
    metamaskStore.setNetId(0)
    metamaskStore.setAddress('')
    metamaskStore.setIsConnect(false)
    metamaskStore.setWeb3(null)

    // Очищаем все балансы
    Object.keys(metamaskStore.balances).forEach(currency => {
      metamaskStore.setBalance(currency, 0)
    })
  }

  // Метод для получения состояния store
  getState() {
    const metamaskStore = useMetamaskStore()
    return {
      account: metamaskStore.METAMASK_ACCOUNT,
      netId: metamaskStore.METAMASK_NET_ID,
      address: metamaskStore.METAMASK_ADDRESS,
      isConnect: metamaskStore.IS_CONNECT,
      balances: metamaskStore.balances,
      web3: metamaskStore.web3
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const web3Parser = new Web3Parser()

  return {
    provide: {
      web3Parser
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $web3Parser: Web3Parser
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $web3Parser: Web3Parser
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $web3Parser: Web3Parser
  }
}
