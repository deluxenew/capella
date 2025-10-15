<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'
import { useMetamaskStore } from '@/stores/metamask'

// Store
const metamaskStore = useMetamaskStore()
const { $utils, $api, $notify } = useNuxtApp()
const $nuxt = useNuxtApp()

// Computed properties - теперь используем stores напрямую
const account = computed(() => metamaskStore.METAMASK_ACCOUNT)
const network = computed(() => metamaskStore.METAMASK_NET_ID)
const isConnected = computed(() => metamaskStore.IS_CONNECT)
const address = computed(() => metamaskStore.METAMASK_ADDRESS)
const balance = computed(() => metamaskStore.BALANCE)

// Methods
const sendTransaction = (from: string, to: string, amount: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const web3 = metamaskStore.web3

    web3.eth.sendTransaction(
      {
        from,
        to,
        value: `${Math.ceil(amount * Math.pow(10, 18))}`,
      },
      (err: Error | null, res: string) => {
        if (err) {
          $notify({
            title: 'Warning',
            text: err.message,
            type: 'warn',
          })
          reject(err)
        } else {
          $notify({
            title: 'Success',
            text: `Tx ${res}`,
            type: 'success',
          })
          resolve(res)
        }
      }
    )
  })
}

const getEthBalance = async (account: string): Promise<number> => {
  const web3 = metamaskStore.web3
  const balanceWei = await web3.eth.getBalance(account)
  const balanceEth = Number(balanceWei) / Math.pow(10, 18)
  return balanceEth
}

const handleDeposit = async (payload: any) => {
  if (payload.pool) {
    await ($api.dashboard as any).deposit({
      pool: payload.pool,
      amount: payload.amount,
      currency: payload.currency,
    })
  }
}

// Event handlers
const metamaskSendHandler = (payload: any) => {
  // реализация с использованием metamaskStore
  console.log('Metamask send handler', payload)
}

const connectMetamaskHandler = () => {
  // реализация подключения Metamask
  console.log('Connect metamask handler')
}

const connectMetamaskAndLoginHandler = () => {
  // реализация подключения и логина
  console.log('Connect and login handler')
}
import { useEventBus } from '@/composables/useEventBus'

const eventBus = useEventBus()

onMounted(() => {
  eventBus.$on('metamaskSend', metamaskSendHandler)
  eventBus.$on('connectMetamask', connectMetamaskHandler)
  eventBus.$on('connectMetamaskAndLogin', connectMetamaskAndLoginHandler)
})

onUnmounted(() => {
  eventBus.$off('metamaskSend', metamaskSendHandler)
  eventBus.$off('connectMetamask', connectMetamaskHandler)
  eventBus.$off('connectMetamaskAndLogin', connectMetamaskAndLoginHandler)
})
</script>
