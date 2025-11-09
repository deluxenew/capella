<template>
  <AppCard class="settingsWallets p-6 pb-15">
    <h2 class="text-lg font-semibold text-color mb-8">
      {{ t('connect_wallet') }}
    </h2>

    <div class="wallets flex flex-col gap-3">
      <!-- MetaMask Wallet -->
      <UiButton
        class="wallet-button group relative px-5 py-3 border-2 border-border rounded-xl transition-all duration-300 flex justify-between items-center gap-3"
        :class="{
          'success border-green-500 bg-green-50 dark:bg-green-900/20 hover:border-green-600': metaMaskAddress,
          'hover:border-blue-500 hover:transform hover:-translate-y-1 hover:shadow-lg': !metaMaskAddress
        }"
        theme="outline"
        @click="handleMetaMaskClick"
      >
        <div class="wallet-content flex flex-col items-start flex-1 min-w-0">
          <h2 class="text-base font-semibold text-color mb-1">
            MetaMask
          </h2>
          <span
            class="wallet-address text-xs text-gray truncate max-w-full"
            :class="{ 'text-green-600 dark:text-green-400': metaMaskAddress }"
          >
            {{ metaMaskAddress || t('not_connected') }}
          </span>
        </div>

        <UiSvgImage
          class="wallet-logo metamask flex-shrink-0 w-7 h-7"
          svg="metamask"
        />

        <!-- Success Badge -->
        <div
          v-if="metaMaskAddress"
          class="success-badge absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
        >
          <UiSvgImage
            svg="check"
            class="w-3 h-3 text-white"
          />
        </div>
      </UiButton>

      <!-- Other Wallets -->
      <div
        v-for="(wallet, index) in wallets"
        :key="index"
        class="WIP"
      >
        <UiButton
          class="wallet-button group relative px-5 py-3 border-2 border-border rounded-xl transition-all duration-300 flex justify-between items-center gap-3 opacity-60 cursor-not-allowed"
          theme="outline"
          disabled
        >
          <div class="wallet-content flex flex-col items-start flex-1 min-w-0">
            <h2 class="text-base font-semibold text-color mb-1">
              {{ wallet.name }}
            </h2>
            <span class="wallet-address text-xs text-gray">
              {{ t('coming_soon') }}
            </span>
          </div>

          <UiSvgImage
            class="wallet-logo flex-shrink-0 w-7 h-7"
            :class="wallet.svg"
            :svg="wallet.svg"
          />

          <!-- Coming Soon Badge -->
          <div class="coming-soon-badge absolute -top-2 -right-2 px-2 py-1 bg-gray-500 rounded-full">
            <span class="text-xs text-white font-medium">
              Soon
            </span>
          </div>
        </UiButton>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
// Types
interface Wallet {
  name: string
  svg: string
  address?: string
}

// Composables
const { t } = useI18n()
const { $store, $nuxt, $notify } = useNuxtApp()

// Reactive data
const copySuccess = ref<boolean>(false)

// Computed
const metaMaskAddress = computed((): string => {
  return useMetamaskStore().METAMASK_ADDRESS || '' // Используйте ваш store напрямую
})

const wallets = computed((): Wallet[] => [
  {
    name: 'Coin98',
    svg: 'coin98',
  },
  {
    name: 'Trust Wallet',
    svg: 'trustwallet',
  },
  {
    name: 'Math Wallet',
    svg: 'mathwallet',
  },
  {
    name: 'Token Pocket',
    svg: 'tokenpocket',
  },
  {
    name: 'Coinbase',
    svg: 'coinbase',
  },
  {
    name: 'SafePal Wallet',
    svg: 'safepal',
  },
  {
    name: 'WalletConnect',
    svg: 'walletconnect',
  },
])

// Methods
const copyToClipboard = async (text: string, successMessage: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)

    // Show success notification
    $notify({
      title: t('success') || 'Success',
      text: successMessage,
      type: 'success',
      data: {
        icon: '📋',
        closable: true
      }
    })

    // Visual feedback
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)

  } catch (error) {
    console.error('Copy failed:', error)

    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)

    $notify({
      title: t('success') || 'Success',
      text: successMessage,
      type: 'success',
      data: {
        icon: '📋',
        closable: true
      }
    })
  }
}

const handleMetaMaskClick = (): void => {
  if (metaMaskAddress.value) {
    // Copy address to clipboard
    copyToClipboard(
      metaMaskAddress.value,
       'MetaMask address copied to clipboard'
    )
  } else {
    // Connect MetaMask
    // emit('connectMetamask')

    // Show connection notification
    $notify({
      title: t('connect_wallet') || 'Connecting',
      text: t('connect_wallet') || 'Connecting to MetaMask...',
      type: 'info',
      data: {
        icon: '🔗',
        closable: true
      }
    })
  }
}

// Watch for MetaMask connection changes
watch(metaMaskAddress, (newAddress, oldAddress) => {
  if (newAddress && !oldAddress) {
    // MetaMask connected
    $notify({
      title: t('connected') || 'Connected!',
      text: t('metamask_connected') || 'MetaMask connected successfully',
      type: 'success',
      data: {
        icon: '🎉',
        closable: true
      }
    })
  } else if (!newAddress && oldAddress) {
    // MetaMask disconnected
    $notify({
      title: t('disconnected') || 'Disconnected',
      text: t('metamask_disconnected') || 'MetaMask disconnected',
      type: 'warning',
      data: {
        icon: '⚠️',
        closable: true
      }
    })
  }
})
</script>

<style scoped>
/* Custom wallet button styles */
.wallet-button {
  position: relative;
  overflow: hidden;
}

.wallet-button:not(.success):not(:disabled)::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(66, 118, 246, 0.1), transparent);
  transition: left 0.5s;
}

.wallet-button:not(.success):not(:disabled):hover::before {
  left: 100%;
}

/* Success state animations */
.wallet-button.success {
  animation: pulseSuccess 2s ease-in-out;
}

@keyframes pulseSuccess {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
}

/* Wallet logo specific styles */
.wallet-logo {
  :deep(path) {
    transition: all 0.3s ease;
  }
}

.wallet-logo.safepal,
.wallet-logo.mathwallet {
  :deep(path) {
    fill: var(--color);
  }
}

.wallet-logo.metamask {
  :deep(path) {
    fill: currentColor;
  }
}

/* Dark mode support */
:global(.dark) {
  .wallet-button.success {
    @apply bg-green-900/10;
  }

  .wallet-button:not(.success):not(:disabled):hover {
    @apply bg-blue-900/10;
  }
}

/* Truncation for long addresses */
.wallet-address {
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Loading state for connection */
.wallet-button:disabled {
  @apply opacity-50 cursor-not-allowed;

  &:hover {
    @apply transform-none shadow-none;
  }
}

/* Badge animations */
.success-badge,
.coming-soon-badge {
  animation: bounceIn 0.5s ease-out;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
