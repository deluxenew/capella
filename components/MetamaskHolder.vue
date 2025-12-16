<template>
  <client-only>
    <vue-metamask
      ref="metamask"
      :initConnect="true"
      @complete="onComplete"
    ></vue-metamask>
  </client-only>
</template>

<script setup lang="ts">
// @ts-ignore
import VueMetamask from "vue-metamask";
// import { ref, computed, onMounted, onUnmounted } from 'vue'
// import { useNuxtApp } from '#app'
//
// // Nuxt app instance
// const { $utils, $api, $notify, $device, $modal } = useNuxtApp()
//
// // Props
// const props = defineProps<{
//   initConnect: boolean
// }>()
//
// // Emits
const emit = defineEmits<{
  onComplete: [data: any]
  onError: []
}>()
//
// // Refs
// const metamask = ref()
// const web3 = ref(null)
// const loginAfterComplete = ref(false)
//
// // Store
// const metamaskStore = useMetamaskStore()
//
// // Computed properties
// const wltitle = computed(() => {
//   return $utils.hostToTitle?.(window?.location?.host)
// })
//
// const account = computed(() => metamaskStore.METAMASK_ACCOUNT)
// const isConnected = computed(() => metamaskStore.IS_CONNECT)
// const network = computed(() => metamaskStore.METAMASK_NET_ID)
//
// // Methods
// const isMetamaskDetected = (): boolean => {
//   return !!window.ethereum
// }
//
const onComplete = (data: any) => {
  emit('onComplete', data)
}
// const onComplete = async (data: any) => {
//   console.log(123)
//   if (!data.web3) {
//     $notify({
//       title: 'Warning',
//       text: `Metamask not connection`,
//       type: 'warn',
//     })
//     emit('onError')
//     loginAfterComplete.value = false
//     return
//   }
//
//   web3.value = data.web3
//   metamaskStore.setMetaMaskStatus({
//     metaMaskAddress: data.metaMaskAddress,
//     netID: data.netID,
//   })
//
//   if (loginAfterComplete.value) {
//     await login({
//       metaMaskAddress: data.metaMaskAddress,
//     })
//   }
//
//   emit('onComplete', data)
//
//   initListeners()
//   await obtainBalance()
//   await obtainAccount()
//   loginAfterComplete.value = false
// }
//
// const sendTransaction = (receiver: string, amount: number): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     web3.value?.eth?.sendTransaction(
//       {
//         to: receiver,
//         from: account.value,
//         value: `${Math.ceil(amount * Math.pow(10, 18))}`,
//       },
//       (err: any, res: string) => {
//         if (err == null) {
//           $notify({
//             title: 'Success',
//             text: `Tx ${res}`,
//             type: 'success',
//           })
//           resolve(res)
//         } else {
//           $notify({
//             title: 'Warning',
//             text: err.message,
//             type: 'warn',
//           })
//           reject(err)
//         }
//       }
//     )
//   })
// }
//
// const send = async ({ currency, pool, amount, address: receiver }: any) => {
//   if (!isConnected.value) {
//     $notify({
//       title: 'Warning',
//       text: `Metamask not connection`,
//       type: 'warn',
//     })
//     return
//   }
//
//   if (network.value !== 1) {
//     $notify({
//       title: 'Warning',
//       text: `Metamask networkId: ${network.value} not supported now - work in progress`,
//       type: 'warn',
//     })
//     return
//   }
//
//   const accounts = await web3.value?.eth?.getAccounts()
//   const currentAccount = accounts[0]
//
//   try {
//     let tx
//     switch (currency) {
//       case 'ETH': {
//         tx = await sendTransaction(receiver, amount)
//         break
//       }
//       default: {
//         const contract = await $utils.contractFactory(currency, web3.value)
//         const decimals = await contract.methods.decimals().call()
//         const gasEstimate = await contract.methods
//           .transfer(
//             receiver,
//             `${Math.ceil(amount * Math.pow(10, decimals))}`,
//           )
//           .estimateGas({ from: currentAccount })
//
//         console.log('Оценка газа:', gasEstimate)
//
//         // Отправка транзакции с указанным газом
//         const receipt = await contract.methods
//           .transfer(
//             receiver,
//             `${Math.ceil(amount * Math.pow(10, decimals))}`,
//           )
//           .send({ from: currentAccount, gas: gasEstimate })
//         tx = receipt.transactionHash
//         break
//       }
//     }
//
//     await $api.dashboard.deposit({
//       pool,
//       amount,
//       currency,
//       transaction: tx,
//     })
//   } catch (e: any) {
//     console.log(e)
//     if (e.response) {
//       $notify({
//         title: 'Warning',
//         text: e.response.data.message,
//         type: 'warn',
//       })
//     } else {
//       $notify({
//         title: 'Warning',
//         text: e.message,
//         type: 'warn',
//       })
//     }
//   }
// }
//
// const connect = () => {
//   if (
//     ($device.isIos ||
//       $device.isAndroid ||
//       $device.isEdge ||
//       $device.isMobile) &&
//     !window.ethereum
//   ) {
//     $modal.open('openMetamaskBrowser')
//   } else {
//     metamask.value.init()
//   }
// }
//
// const obtainBalance = async () => {
//   const accounts = await web3.value?.eth?.getAccounts?.()
//   const currentAccount = accounts[0]
//   console.log("account", currentAccount)
//
//   const ethBalance = Number(
//     (await web3.value?.eth?.getBalance(currentAccount)) / Math.pow(10, 18)
//   )
//
//   const prs = $utils.availableCurrencies.map((it: string) => {
//     return $utils
//       .contractFactory(it, web3.value)
//       .then((contract: any) => {
//         return Promise.all([
//           contract.methods.balanceOf(currentAccount).call(),
//           contract.methods.decimals().call(),
//         ])
//       })
//       .then(([balance, decimals]: [any, any]) => {
//         return {
//           currency: it,
//           balance: Number(balance / Math.pow(10, decimals)),
//         }
//       })
//   })
//
//   const balances = (await Promise.all(prs)).reduce(
//     (acc: any, cur: any) => ({ ...acc, [cur.currency]: cur.balance }),
//     { ETH: ethBalance }
//   )
//
//   console.log("balances", balances)
//
//   // Update balances in store
//   Object.entries(balances).forEach(([currency, balance]) => {
//     metamaskStore.setBalance(currency, balance as number)
//   })
// }
//
// const obtainAccount = async () => {
//   const accounts = await web3.value?.eth?.getAccounts()
//   if (accounts[0]) {
//     metamaskStore.setAccount(accounts[0])
//     metamaskStore.setAddress(accounts[0])
//   } else {
//     metamaskStore.setAccount('')
//     metamaskStore.setAddress('')
//   }
// }
//
// const initListeners = () => {
//   web3.value?._provider?.on('chainChanged', (d: string) => {
//     const netID = parseInt(d, 16)
//     metamaskStore.setNetId(netID)
//     obtainBalance()
//   })
//
//   web3.value?._provider?.on('accountsChanged', (accounts: string[]) => {
//     if (accounts.length > 0) {
//       metamaskStore.setAccount(accounts[0])
//       metamaskStore.setAddress(accounts[0])
//     } else {
//       metamaskStore.setAccount('')
//       metamaskStore.setAddress('')
//       metamaskStore.setIsConnect(false)
//     }
//   })
// }
//
// const login = async (credentials: any) => {
//   try {
//     const { data } = await $api.user.login(credentials)
//
//     if (data) {
//       // Handle login success - you might want to use your auth store here
//       console.log('Login successful', data)
//     }
//   } catch (err: any) {
//     console.error(err)
//     $notify({
//       title: 'Error',
//       text: err.response?.data?.message || 'Invalid password or login',
//       type: 'error',
//     })
//   }
// }
//
// // Event handlers
// const metamaskSendHandler = (payload: any) => send(payload)
//
// const connectMetamaskHandler = () => {
//   connect()
// }
//
// const connectMetamaskAndLoginHandler = () => {
//   const metaMaskAddress = metamaskStore.METAMASK_ADDRESS
//   if (!metaMaskAddress) {
//     loginAfterComplete.value = true
//     connect()
//   } else {
//     login({
//       metaMaskAddress: metamaskStore.METAMASK_ADDRESS,
//     })
//   }
// }
//
// // Lifecycle
// // onMounted(() => {
// //   // Listen to global events
// //   const { $on } = useNuxtApp()
// //   $on('metamaskSend', metamaskSendHandler)
// //   $on('connectMetamask', connectMetamaskHandler)
// //   $on('connectMetamaskAndLogin', connectMetamaskAndLoginHandler)
// // })
// //
// // onUnmounted(() => {
// //   // Remove event listeners
// //   const { $off } = useNuxtApp()
// //   $off('metamaskSend', metamaskSendHandler)
// //   $off('connectMetamask', connectMetamaskHandler)
// //   $off('connectMetamaskAndLogin', connectMetamaskAndLoginHandler)
// // })
</script>
