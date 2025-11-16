<template>
  <AppCard class="DAOLiquidityPools">
    <h2 class="text-lg font-semibold mb-10">{{ t('liquidity_pools') }}</h2>

    <div>
      <!-- Stable Pool -->
      <div class="pool pb-10">
        <p class="text-base font-medium mb-4">{{ t('stable_pool') }}</p>
        <div class="wrapper__progress flex gap-2 justify-between">
          <div class="progress-bar flex-2 bg-charade rounded h-7.5 overflow-hidden">
            <div
              class="progress stable h-full rounded bg-[#aaffcb] transition-all duration-500"
              :style="{ width: stableProgress }"
            ></div>
          </div>
          <div class="progress-value text-right flex-1 whitespace-nowrap">
            <p class="text-base font-medium">
              {{ formatCurrency(balance?.stable || 0) }}
            </p>
            <p class="text-sm text-green mt-2 text-right">
              {{ (locked?.stable?.delta || 0).toFixed(2) }}%
            </p>
          </div>
        </div>
      </div>
      <hr class="border-border">

      <!-- Coin Pool -->
      <div class="pool pb-10 mt-4">
        <p class="text-base font-medium mb-4">{{ t('coin_pool') }}</p>
        <div class="wrapper__progress flex gap-2 justify-between">
          <div class="progress-bar flex-2 bg-charade rounded h-7.5 overflow-hidden">
            <div
              class="progress coin h-full rounded bg-[#9fe0ff] transition-all duration-500"
              :style="{ width: coinProgress }"
            ></div>
          </div>
          <div class="progress-value text-right flex-1 whitespace-nowrap">
            <p class="text-base font-medium">
              {{ formatCurrency(balance?.coin || 0) }}
            </p>
            <p class="text-sm text-green mt-2 text-right">
              {{ (locked?.coin?.delta || 0).toFixed(2) }}%
            </p>
          </div>
        </div>
      </div>
      <hr class="border-border">

      <!-- DEX Pool -->
      <div class="pool mt-4">
        <p class="text-base font-medium mb-4">{{ t('dex_pool') }}</p>
        <div class="wrapper__progress flex gap-2 justify-between">
          <div class="progress-bar flex-2 bg-charade rounded h-7.5 overflow-hidden">
            <div
              class="progress dex h-full rounded bg-[#dd7c37] transition-all duration-500"
              :style="{ width: dexProgress }"
            ></div>
          </div>
          <div class="progress-value text-right flex-1 whitespace-nowrap">
            <p class="text-base font-medium">
              {{ formatCurrency(balance?.dex || 0) }}
            </p>
            <p class="text-sm text-green mt-2 text-right">
              {{ (locked?.dex?.delta || 0).toFixed(2) }}%
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
interface PoolData {
  stable: number
  coin: number
  dex: number
}

interface LockedData {
  stable: { delta: number }
  coin: { delta: number }
  dex: { delta: number }
}

interface PoolsData {
  locked: LockedData
  balance: PoolData
}

// Composable
const { $filters, $api } = useNuxtApp()
const { t } = useI18n()
// Reactive data
const balance = ref<PoolData | null>(null)
const locked = ref<LockedData | null>(null)

// Data fetching
const { data: poolsData, pending } = await useAsyncData(
  'dao-pools',
  async () => {
    try {
      const data  = await $api.dao.pools()
      return data as PoolsData
    } catch (error) {
      console.error('Error fetching DAO pools data:', error)
      return null
    }
  }
)

// Update reactive data when fetch completes
watch(poolsData, (newData) => {
  if (newData) {
    balance.value = newData.balance
    locked.value = newData.locked
  }
}, { immediate: true })

// Computed
const total = computed((): number => {
  if (!balance.value) return 0
  return balance.value.stable + balance.value.coin + balance.value.dex
})

const stableProgress = computed((): string => {
  if (!balance.value || total.value === 0) return '0%'
  return `${(balance.value.stable / total.value) * 100}%`
})

const coinProgress = computed((): string => {
  if (!balance.value || total.value === 0) return '0%'
  return `${(balance.value.coin / total.value) * 100}%`
})

const dexProgress = computed((): string => {
  if (!balance.value || total.value === 0) return '0%'
  return `${(balance.value.dex / total.value) * 100}%`
})

// Methods
const formatCurrency = (value: number): string => {
  return $filters?.toCurrency?.(value) || new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>
