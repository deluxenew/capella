<template>
  <!-- Main container with grid layout -->
  <div class="earned-container grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
    <!-- Referral Earned Section (col-span-2) -->
    <div class="refferal-earned xl:col-span-2">
      <AppCard class="Earned">
        <!-- Main Earnings Header -->
        <div class="earnings-header text-center mb-8 py-2">
          <div class="earnings-main">
            <h2 class="earnings-title text-3xl font-bold mb-2 text-color">
              {{ t('rewards') || 'Affiliate Rewards' }}
            </h2>
            <p class="earnings-subtitle text-base text-gray opacity-80">
              {{ t('referral_subtitle') || 'Track and withdraw your referral earnings' }}
            </p>
          </div>
        </div>

        <!-- Content Grid: Withdraw Section + Summary Cards -->
        <div class="content-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Withdraw Section (col-span-2) -->
          <div class="withdraw-section lg:col-span-2">
            <div class="withdraw-header flex justify-between items-center mb-6 px-3 pt-6">
              <h3 class="withdraw-title text-xl font-bold text-color">
                {{ t('withdraw_funds') || 'Withdraw Funds' }}
              </h3>
              <div class="available-info flex items-center gap-2 px-2 py-1 bg-secondary border border-border rounded-full">
                <span class="available-label text-sm text-gray font-medium">
                  {{ t('available') || 'Available' }}:
                </span>
                <span class="available-amount text-sm font-bold text-color">
                  ${{ availableTotal.toFixed(2) }}
                </span>
              </div>
            </div>

            <div class="withdraw-form px-3 pb-6">
              <div class="amount-input-section mb-6">
                <div class="input-wrapper relative mb-4">
                  <div class="currency-prefix absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray z-10">
                    $
                  </div>
                  <UiInput
                    v-model.number="unifiedAmount"
                    type="number"
                    :min="0"
                    :max="availableTotal"
                    :placeholder="'0.00'"
                    class="amount-input pl-12 pr-4 py-2 text-xl font-semibold border-2 border-border rounded-xl focus:border-blue-600 transition-colors duration-300 bg-transparent"
                    :class="{ 'border-red-500': unifiedAmount > availableTotal }"
                  />
                </div>

                <!-- Amount validation error -->
                <div
                  v-if="unifiedAmount > availableTotal"
                  class="validation-error text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  {{ t('insufficient_funds') || 'Amount exceeds available balance' }}
                </div>
              </div>

              <div class="withdraw-footer">
                <div class="withdraw-info bg-secondary p-2 rounded-lg mb-4">
                  <div class="info-item flex justify-between items-center mb-2 last:mb-0">
                    <span class="info-label text-sm text-gray">
                      {{ t('amount_to_withdraw') || 'Amount to withdraw' }}:
                    </span>
                    <span class="info-value text-sm font-semibold text-color">
                      ${{ (unifiedAmount || 0).toFixed(2) }}
                    </span>
                  </div>
                  <div
                    v-if="unifiedAmount > 0"
                    class="info-item flex justify-between items-center mb-2 last:mb-0"
                  >
                    <span class="info-label text-sm text-gray">
                      {{ t('remaining_balance') || 'Remaining balance' }}:
                    </span>
                    <span class="info-value text-sm font-semibold text-color">
                      ${{ Math.max(0, availableTotal - (unifiedAmount || 0)).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <UiButton
                  class="withdraw-submit-btn w-full py-2 px-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 border border-blue-600 bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700 hover:border-blue-700 hover:transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:bg-gray-500 disabled:border-gray-500"
                  :disabled="!canAnyWithdraw"
                  :loading="loading"
                  size="lg"
                  @click="sendUnifiedWithdraw"
                >
                  <svg class="withdraw-icon w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ t('withdraw') }} ${{ (unifiedAmount || 0).toFixed(2) }}
                </UiButton>
              </div>
            </div>
          </div>

          <!-- Summary Cards (col-span-1) -->
          <div class="summary-cards flex flex-col gap-4">
            <div
              v-for="(card, index) in summaryCards"
              :key="index"
              class="summary-card p-3 border border-border rounded-lg transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-md flex-1 bg-secondary"
            >
              <div class="summary-card-content text-center">
                <p class="summary-label text-sm text-gray uppercase tracking-wider mb-2">
                  {{ card.label }}
                </p>
                <p class="summary-value text-2xl font-bold text-color">
                  ${{ card.value.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Referral ID Section (col-span-1) -->
    <div class="refferal-id">
      <RefferalID />
    </div>
  </div>
</template>

<script setup lang="ts">
import RefferalID from './ID.vue'

// Types
interface HarvestData {
  stable: number
  coin: number
  dex: number
}

interface ReferralsData {
  stable: number
  coin: number
  dex: number
}

interface BalanceData {
  stable: number
  coin: number
  dex: number
}

interface SummaryCard {
  label: string
  value: number
}

interface HarvestResponse {
  harvest: HarvestData
  referrals: ReferralsData
  balance: BalanceData
  refHarvest: HarvestData
}

// Composable
const { t } = useI18n()
const { $api, $notify } = useNuxtApp()

// Reactive data
const harvest = ref<HarvestData>({ stable: 0, coin: 0, dex: 0 })
const balance = ref<BalanceData>({ stable: 0, coin: 0, dex: 0 })
const referrals = ref<ReferralsData>({ stable: 0, coin: 0, dex: 0 })
const refHarvest = ref<HarvestData>({ stable: 0, coin: 0, dex: 0 })
const unifiedAmount = ref<number>(0)
const loading = ref<boolean>(false)

// Data fetching
const { data: harvestData, pending, refresh } = await useAsyncData(
  'user-harvest',
  async (): Promise<HarvestResponse | null> => {
    try {
      return await $api.user.harvest()
    } catch (error) {
      console.error('Error fetching harvest data:', error)
      showNotification({
        title: t('error') || 'Error',
        text: t('fetch_data_error') || 'Failed to load earnings data',
        type: 'error',
        data: { icon: '❌' }
      })
      return null
    }
  }
)

// Update reactive data when fetch completes
watch(harvestData, (newData) => {
  if (newData) {
    harvest.value = newData.harvest
    referrals.value = newData.referrals
    balance.value = newData.balance
    refHarvest.value = newData.refHarvest
  }
}, { immediate: true })

// Computed properties
const totalEarn = computed((): number => {
  return (referrals.value.coin || 0) + (referrals.value.stable || 0) + (referrals.value.dex || 0)
})

const refHarvestTotal = computed((): number => {
  return (refHarvest.value.coin || 0) + (refHarvest.value.stable || 0) + (refHarvest.value.dex || 0)
})

const availableTotal = computed((): number => {
  return Number(referrals.value.stable || 0) + Number(referrals.value.coin || 0) + Number(referrals.value.dex || 0)
})

const canAnyWithdraw = computed((): boolean => {
  const value = Number(unifiedAmount.value || 0)
  return !loading.value && value > 0 && value <= availableTotal.value
})

const summaryCards = computed((): SummaryCard[] => [
  {
    label: t('you_earned') || 'You Earned',
    value: totalEarn.value
  },
  {
    label: t('referral_earned') || 'Referral Earned',
    value: refHarvestTotal.value
  },
  {
    label: t('you_have') || 'You Have',
    value: availableTotal.value
  }
])

// Methods
const showNotification = (options: {
  title?: string
  text: string
  type: 'success' | 'error' | 'warning' | 'info'
  data?: { icon?: string; closable?: boolean }
}) => {
  $notify({
    title: options.title,
    text: options.text,
    type: options.type,
    duration: 5000,
    ...options.data
  })
}

const sendUnifiedWithdraw = async (): Promise<void> => {
  if (!canAnyWithdraw.value) return

  let amountLeft = Number(unifiedAmount.value)
  const initialAmount = amountLeft

  try {
    loading.value = true

    // Show processing notification
    showNotification({
      title: t('processing') || 'Processing',
      text: t('withdraw_processing') || 'Processing your withdrawal...',
      type: 'info',
      data: { icon: '⏳' }
    })

    const tryPool = async (poolKey: keyof ReferralsData): Promise<void> => {
      const poolAmount = Number(referrals.value[poolKey] || 0)
      const canWithdraw = Math.min(poolAmount, amountLeft)

      if (canWithdraw > 0) {
        await $api.user.referralWithdraw({
          pool: poolKey,
          amount: canWithdraw
        })
        amountLeft -= canWithdraw

        // Show progress notification for each pool
        if (poolAmount > 0) {
          showNotification({
            text: `Withdrawn $${canWithdraw.toFixed(2)} from ${poolKey} pool`,
            type: 'success',
            data: { icon: '✅' }
          })
        }
      }
    }

    // Withdraw from pools in order
    await tryPool('stable')
    if (amountLeft > 0) await tryPool('coin')
    if (amountLeft > 0) await tryPool('dex')

    // Refresh data
    await refresh()

    // Reset amount
    unifiedAmount.value = 0

    // Show success notification
    showNotification({
      title: t('success') || 'Success!',
      text: t('withdraw_success') || `Successfully withdrawn $${initialAmount.toFixed(2)}`,
      type: 'success',
      data: { icon: '🎉', closable: true }
    })

  } catch (error: any) {
    console.error('Withdrawal error:', error)

    const errorMessage = error?.response?.data?.message ||
      error?.message ||
      t('withdraw_error') ||
      'Withdrawal failed'

    showNotification({
      title: t('error') || 'Error',
      text: errorMessage,
      type: 'error',
      data: { icon: '❌', closable: true }
    })
  } finally {
    loading.value = false
  }
}

// Watch for amount changes to show validation
watch(unifiedAmount, (newAmount) => {
  if (newAmount > availableTotal.value) {
    console.warn('Withdrawal amount exceeds available balance')
  }
})
</script>

<style scoped>
/* Custom styles for better visual feedback */
.amount-input:focus {
  @apply outline-none ring-2 ring-blue-500 ring-opacity-20;
}

.validation-error {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Loading state animation */
.withdraw-submit-btn:disabled {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.7; }
}

/* Mobile responsive design */
@media screen and (max-width: 1280px) {
  .earned-container {
    @apply grid-cols-1;
  }

  .refferal-earned {
    @apply col-span-1;
  }

  .content-grid {
    @apply grid-cols-1;
  }

  .withdraw-section {
    @apply col-span-1;
  }

  .summary-cards {
    @apply grid grid-cols-3 gap-4;
  }
}

@media screen and (max-width: 768px) {
  .earnings-header {
    @apply py-1 mb-6;
  }

  .earnings-title {
    @apply text-2xl;
  }

  .earnings-subtitle {
    @apply text-sm;
  }

  .withdraw-header {
    @apply flex-col items-stretch gap-4 px-2 pt-4;
  }

  .withdraw-title {
    @apply text-lg text-center;
  }

  .available-info {
    @apply self-center px-2 py-1;
  }

  .withdraw-form {
    @apply px-2 pb-4;
  }

  .amount-input-section {
    @apply mb-4;
  }

  .input-wrapper {
    @apply mb-3;
  }

  .currency-prefix {
    @apply text-lg left-3;
  }

  .amount-input {
    @apply pl-10 pr-3 py-2 text-lg;
  }

  .withdraw-info {
    @apply p-1 mb-3;
  }

  .info-label,
  .info-value {
    @apply text-xs;
  }

  .withdraw-submit-btn {
    @apply py-2 text-sm;
  }

  .withdraw-icon {
    @apply w-4 h-4;
  }

  .summary-cards {
    @apply grid-cols-1 gap-3;
  }

  .summary-card {
    @apply p-2;
  }

  .summary-value {
    @apply text-xl;
  }
}

@media screen and (max-width: 480px) {
  .earnings-title {
    @apply text-xl;
  }

  .summary-cards {
    @apply gap-2;
  }

  .summary-card {
    @apply p-1;
  }

  .summary-label {
    @apply text-xs;
  }

  .summary-value {
    @apply text-lg;
  }
}

/* Expanded sidebar responsive design */
@media screen and (max-width: 991px) {
  .sidebar_expanded .earned-container {
    @apply grid-cols-1;
  }

  .sidebar_expanded .content-grid {
    @apply grid-cols-1;
  }
}
</style>
