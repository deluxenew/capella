<template>
  <div class="sign-in">
    <div class="main-block">
      <div class="content">
        <h2 class="main-title">
          <h3 class="to-auth" theme="transparent">
            {{ t('AuthHeader.sign_in') }}
          </h3>
        </h2>
        <div class="custom-wrapper wallet-connect">
          <h3 class="title">
            {{ t('signUp.or_connect') }}
          </h3>
          <UiButton
            :loading="!loadingLogin && loadingMetamask"
            :disabled="loadingMetamask || loadingLogin"
            class="wallet-btn box-shadow"
            @click="connect"
          >
            {{ t('connect_wallet') }}
          </UiButton>
        </div>
      </div>
    </div>
    <MetamaskHolder ref="metamask" @onError="loadingMetamask = false" />
  </div>
</template>

<script setup lang="ts">
// Types
interface LoginParams {
  login?: string
  password?: string
  metaMaskAddress?: string
  source?: string
  invite?: string
}

interface EthereumProvider {
  request: (args: { method: string }) => Promise<string[]>
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}
const { t } = useI18n()
// Composables
const { $auth, $device, $store, $notify, $modal, $router, $route } = useNuxtApp()
const route = useRoute()
const router = useRouter()

// Refs
const loadingMetamask = ref(false)
const loadingLogin = ref(false)
const email = ref('')
const password = ref('')
const invite = ref(route.query.invite?.toString() || '')

// Computed
const passwordRegExp = computed(() => {
  return new RegExp($store.state.system.regExp?.user?.password || '')
})

const metaMaskAddress = computed(() => {
  return $store.getters['metamask/METAMASK_ADDRESS']
})

const isMetamaskConnected = computed(() => {
  return $store.getters['metamask/IS_CONNECT']
})

// Methods
const login = async (params: LoginParams): Promise<void> => {
  try {
    loadingLogin.value = true
    // TODO: Добавьте вашу логику входа здесь
    // Например:
    // await $api.auth.login(params)
    console.log('Login attempt with:', params)

    // Временный редирект для демонстрации
    await router.replace('/cabinet/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    $notify({
      title: 'Error',
      type: 'error',
      text: t('Auth.error.auth') || 'Authentication failed',
    })
  } finally {
    loadingLogin.value = false
    loadingMetamask.value = false
  }
}

const connect = async (): Promise<void> => {
  loadingMetamask.value = true

  if (!window.ethereum) {
    if ($device.isIos || $device.isAndroid || $device.isEdge || $device.isMobile) {
      $modal.show('openMetamaskBrowser')
    } else {
      $notify({
        title: 'Error',
        type: 'error',
        text: 'Need install metamask extension or open page in metamask browser',
      })
    }
    loadingMetamask.value = false
    return
  }

  if ($auth.loggedIn && isMetamaskConnected.value) {
    loadingMetamask.value = false
    await router.replace('/cabinet/dashboard')
  } else if (isMetamaskConnected.value) {
    await login({
      invite: invite.value,
      metaMaskAddress: metaMaskAddress.value,
      source: '', // Add your UTM source logic here
    })
  } else {
    // Emit event for metamask connection and login
    // TODO: Добавьте логику подключения MetaMask
    console.log('Need to connect MetaMask first')
    $notify({
      title: 'Info',
      type: 'info',
      text: 'Please connect your MetaMask wallet first',
    })
    loadingMetamask.value = false
  }
}

const loginByEmail = async (): Promise<void> => {
  if (!email.value || !password.value) {
    $notify({
      title: 'Error',
      type: 'error',
      text: 'Please fill in all fields',
    })
    return
  }

  await login({
    login: email.value,
    password: password.value,
    metaMaskAddress: metaMaskAddress.value || undefined,
    source: '',
    invite: invite.value,
  })
}

// Lifecycle
onMounted(() => {
  if (route.query.error === 'auth') {
    nextTick(() => {
      $notify({
        title: 'Error',
        type: 'error',
        text: t('Auth.error.auth') || 'Authentication error',
      })
      router.replace('/sign-in')
    })
  }
})

// Head
useHead({
  title: 'Sign In'
})

// Define page meta
definePageMeta({
  layout: 'auth'
})
</script>

<style scoped>
.sign-in {
  @apply w-full;
}

.main-block {
  @apply flex justify-center items-center min-h-screen;
}

.content {
  @apply w-full max-w-sm p-6;
}

.main-title {
  @apply text-center mb-8;
}

.to-auth {
  @apply text-2xl font-semibold;
}

.custom-wrapper.wallet-connect {
  @apply mb-6;
}

.title {
  @apply text-lg font-medium mb-4 text-center;
}

.wallet-btn {
  @apply w-full;
}

.box-shadow {
  box-shadow: 0px 9px 24px rgba(66, 118, 246, 0.4);
}
</style>
