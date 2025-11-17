<template>
  <div class="cabinet" :class="{
    'cabinet_mobile': $device?.isMobile,
    'sidebar_expanded': expandSidebar,
  }">
    <div class="wrapper">
      <LeftSidebar :expand-sidebar="expandSidebar" :class="{ 'expanded': expandSidebar }"
                   @handle-sidebar="expandSidebar = $event" />
      <div class="right transition" :class="{ 'expanded': expandSidebar }">
        <div class="right-wrapper" :class="{ 'sidebar-expanded': expandSidebar }">
          <header class="header">
            <div class="user flex items-center">
              <UiButton class="menu-btn px-2" theme="transparent" fill="fill-white"
                        @click="expandSidebar = !expandSidebar">
                <UiSvgImage :svg="expandSidebar ? 'arrow-left' : 'menu'" />
              </UiButton>
              <img src="~/assets/img/avatar.png" alt="" class="w-9 h-9" />
              <h2 class="user-text">
                {{ t('AuthHeader.greeting') }}, {{ userName }}
              </h2>
            </div>
            <div class="user-buttons flex items-center">
              <div v-if="!addresses">
                <UiButton @click="connectMetamask">
                  {{ t('connect_wallet') }}
                </UiButton>
              </div>
              <div v-else>
                <UiButton class="metamask-button" title="click to copy" @click="copyToClipboard(addresses, t('copied'))">
                  {{ parseMM(addresses) }}
                </UiButton>
              </div>
            </div>
          </header>
          <div class="inner-layout pb-10">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <ClientOnly>

        <Notification />

    </ClientOnly>
    <MetamaskHolder :initConnect=" true" ref="metamask" @onComplete="onComplete" />
    <ModalTermsConditions />
    <LazyMetamaskBrowserModal />
    <UiModal name="account-activation" height="auto" classes="account-activation-modal" adaptive>
      <div class="modal-content activation-modal">
        <div class="modal-header flex justify-between items-center">
          <h2 class="modal-title">{{ t('account_activation') }}</h2>
          <UiButton theme="icon" @click="$modal?.close('account-activation')">
            <UiSvgImage svg="close" />
          </UiButton>
        </div>
        <div class="modal-body">
          <p class="activation-text mb-6">
            {{ t('activation_required_text') }}
          </p>
          <div class="currency-selector mb-4">
            <label class="selector-label">{{ t('select_currency') }}</label>
            <div class="radio-group">
              <div
                v-for="currency in availableCurrencies"
                :key="currency"
                class="radio-item"
              >
                <input
                  :id="`currency-${currency}`"
                  v-model="selectedCurrency"
                  :value="currency"
                  type="radio"
                  name="currency"
                  class="radio-input"
                  @change="onCurrencyChange(currency)"
                />
                <label :for="`currency-${currency}`" class="radio-label">
                  {{ currency }}
                </label>
              </div>
            </div>
          </div>
          <div v-if="balanceError" class="error-message mb-4">
            {{ balanceError }}
          </div>
          <div class="payment-info mb-6">
            <p><strong>{{ t('amount_to_pay') }}:</strong> $250</p>
            <p><strong>{{ t('your_balance') }}:</strong> {{ currentBalance }} {{ selectedCurrency }}</p>
            <p><strong>{{ t('required_amount') }}:</strong> {{ requiredAmount }} {{ selectedCurrency }}</p>
          </div>
          <UiButton
            size="md"
            class="pay-button w-full"
            :disabled="!canPay"
            @click="processPayment"
          >
            {{ t('pay_now') }}
          </UiButton>
        </div>
      </div>
    </UiModal>
    <div v-if="user && !user.confirmRegistration" class="required-registration">
      <div class="container">
        <p>
          Attention!<br />
          Your account is not verified. To be able to replenish the deposit, pay
          the commission.
        </p>
        <div class="flex gap-4">
          <UiButton size="md" @click="showActivationModal">
            PAY
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
import MetamaskHolder from "~/components/MetamaskHolder.vue";
import LeftSidebar from "~/components/cabinet/LeftSidebar.vue";
interface MetamaskData {
  address: string
}

// Composables
const { $api, $auth, $device, $modal } = useNuxtApp()
const { t } = useI18n()
const { push } = useRouter()

// Refs
const expandSidebar = ref(false)
const selectedCurrency = ref('ETH')
const availableCurrencies = ref(['ETH', 'USDT', 'USDC'])
const balanceError = ref<string | null>(null)
const registrationFees = ref<Record<string, number>>({})
const metamask = ref(null)

// Store (замените на вашу реализацию store)
const store = useMetamaskStore() // Убедитесь что этот store существует
const userStore = useUserStore()
// Computed properties
const addresses = computed(() => {
  return store?.address || null
})

const user = computed((): User | null => {
  return userStore.user || null
})

const userName = computed(() => {
  return user.value?.name || user.value?.login || 'User'
})

const currentBalance = computed(() => {
  const balance = store?.BALANCE?.(selectedCurrency.value)
  return balance || 0
})

const requiredAmount = computed(() => {
  return registrationFees.value[selectedCurrency.value] || 0
})

const canPay = computed(() => {
  return currentBalance.value >= requiredAmount.value && !balanceError.value
})

// Watchers
watch(selectedCurrency, () => {
  checkBalance()
})

watch(currentBalance, () => {
  checkBalance()
})

// Methods
const onComplete = async ({ address }: MetamaskData) => {
  if (!user.value?.address) {
    try {
      await $api.user.connectMM({
        id: user.value?.id || '',
        address
      })
      // Используем composable для уведомлений вместо $notify
      const { success } = useToast()
      success(t('metamask_linked'))
    } catch (error) {
      $auth?.logout?.()
    }
  } else if (user.value.address !== address) {
    await $auth?.logout?.()
    push('/sign-in')
    setTimeout(() => {
      const { error } = useToast()
      error(t('metamask_invalid'))
    }, 100)
  }
}

const connectMetamask = () => {
  // Emit event for metamask connection
  // await $nuxt.$emit('connectMetamask')
}

const showActivationModal = async () => {
  try {
    const data = await $api.dashboard.getRegistrationFee()
    registrationFees.value = data
    checkBalance()
    $modal?.open('account-activation')
  } catch (error) {
    const { error: showError } = useToast()
    showError('Failed to load registration fees')
  }
}

const onCurrencyChange = (currency: string) => {
  selectedCurrency.value = currency
  checkBalance()
}

const checkBalance = () => {
  balanceError.value = null
  if (currentBalance.value < requiredAmount.value) {
    balanceError.value = t('insufficient_balance_error')
  }
}

const processPayment = async () => {
  if (!canPay.value) return

  try {
    const amount = requiredAmount.value.toString()
    const address = user.value?.addresses?.registrationFee?.[selectedCurrency.value]

    if (!address) {
      throw new Error('Payment address not found')
    }

    // Emit metamask send event
    // await $nuxt.$emit('metamaskSend', {
    //   currency: selectedCurrency.value,
    //   pool: null,
    //   amount,
    //   address,
    // })

    $modal?.close('account-activation')

    const { success } = useToast()
    success('Payment processed successfully')
  } catch (error: any) {
    const { error: showError } = useToast()
    showError(error.message || 'Payment failed')
  }
}

const copyToClipboard = async (text: string, message: string) => {
  try {
    await navigator.clipboard.writeText(text)
    const { success } = useToast()
    success(message)
  } catch (error) {
    const { error: showError } = useToast()
    showError('Failed to copy to clipboard')
  }
}

const parseMM = (value: string): string => {
  if (!value || value.length < 12) return value
  return value.slice(0, 6) + '...' + value.slice(-6)
}

// Composable для уведомлений (добавьте в composables/useToast.ts)
const useToast = () => {
  const { $notify } = useNuxtApp()

  return {
    success: (message: string) => {
      if ($notify) {
        $notify({ type: 'success', text: message })
      } else {
        console.log('✅', message)
      }
    },
    error: (message: string) => {
      if ($notify) {
        $notify({ type: 'error', text: message })
      } else {
        console.error('❌', message)
      }
    },
    info: (message: string) => {
      if ($notify) {
        $notify({ type: 'info', text: message })
      } else {
        console.info('ℹ️', message)
      }
    }
  }
}
</script>

<style scoped>
.required-registration {
  @apply fixed bottom-0 left-0 w-full h-24 z-50 backdrop-blur;
}

.required-registration .container {
  @apply py-4 flex justify-between items-center px-2;
}

@media (max-width: 768px) {
  .required-registration .container {
    @apply flex-col text-center gap-3 py-2;
  }

  .required-registration {
    @apply h-auto min-h-32;
  }
}

.metamask-button {
  @apply max-w-[200px] block overflow-hidden text-ellipsis;
}

.cabinet .inner-layout {
  @apply max-w-[1240px] mx-auto;

}

.cabinet .right {
  margin-left: 125px;
  @apply overflow-auto transition-all duration-300;
}

.cabinet .right.expanded {
  margin-left: 320px;
}

.cabinet .right .header {
  @apply p-2 pl-3 border-b border-border-color flex items-center justify-between;
}

.cabinet .right .user {
  @apply min-w-0 flex items-center;
}

.cabinet .right .user .menu-btn {
  @apply hidden h-6 w-6 mr-5;
}

.cabinet .right .user-text {
  @apply ml-2 text-base whitespace-nowrap overflow-hidden text-ellipsis;
}

.cabinet .right-wrapper {
  @apply overflow-x-hidden;
}

/* Mobile styles */
@media (max-width: 768px) {
  .cabinet .right {
    @apply ml-0;
  }

  .cabinet .right .user .menu-btn {
    @apply block;
  }
}

/* Activation modal styles */
.activation-modal {
  @apply p-3;
}

@media (max-width: 768px) {
  .activation-modal {
    @apply p-2;
  }
}

.activation-modal .modal-header {
  @apply mb-5;
}

.activation-modal .modal-header .modal-title {
  @apply text-xl font-semibold m-0;
}

.activation-modal .modal-body .activation-text {
  @apply text-base leading-normal;
}

.activation-modal .modal-body .currency-selector .selector-label {
  @apply block text-sm font-medium mb-3;
}

.activation-modal .modal-body .currency-selector .radio-group {
  @apply flex gap-4 flex-wrap;
}

.activation-modal .modal-body .currency-selector .radio-item {
  @apply flex items-center;
}

.activation-modal .modal-body .currency-selector .radio-input {
  @apply m-0 mr-2 w-4 h-4 cursor-pointer;
}

.activation-modal .modal-body .currency-selector .radio-label {
  @apply text-sm font-medium cursor-pointer m-0;
}

.activation-modal .modal-body .error-message {
  @apply bg-red-50 border border-red-200 rounded p-1 text-red-600 text-sm;
}

.activation-modal .modal-body .payment-info {
  @apply bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2;
}

.activation-modal .modal-body .payment-info p {
  @apply m-1 text-sm;
}

.activation-modal .modal-body .payment-info strong {
  @apply font-semibold;
}

.activation-modal .modal-body .pay-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Modal width adjustments */
:global(.account-activation-modal.vm--modal) {
  width: 400px !important;
  max-width: 90vw !important;
}

@media (max-width: 768px) {
  :global(.account-activation-modal.vm--modal) {
    width: 90vw !important;
  }
}

@media (max-width: 480px) {
  :global(.account-activation-modal.vm--modal) {
    width: 95vw !important;
  }
}
</style>
