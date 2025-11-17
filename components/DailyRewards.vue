<template>
  <AppCard class="DailyRewards">
    <h2 class="title text-lg font-semibold mb-7 pb-3 border-b border-border">
      {{ t('daily_rewards') }}
    </h2>

    <div class="wrapper_spool flex flex-wrap justify-between my-4">
      <!-- Stable Pool -->
      <div class="pool-item">
        <div>
          <p class="text-sm mb-4 text-gray">{{ t('stable_pool') }}</p>
          <div class="flex items-center">
            <div class="marker w-2 h-5 rounded mr-2" style="background: #aaffcb"></div>
            <span class="text-lg font-semibold text-color">
              {{ formatCurrency(stable.value) }}
            </span>
          </div>
        </div>
        <p class="text__price text-green mt-2 text-sm">
          {{ stable.delta.toFixed(2) }}%
        </p>
      </div>

      <!-- Coin Pool -->
      <div class="pool-item">
        <div>
          <p class="text-sm mb-4 text-gray">{{ t('coin_pool') }}</p>
          <div class="flex items-center">
            <div class="marker w-2 h-5 rounded mr-2" style="background: #9fe0ff"></div>
            <span class="text-lg font-semibold text-color">
              {{ formatCurrency(coin.value) }}
            </span>
          </div>
        </div>
        <p class="text__price text-green mt-2 text-sm">
          {{ coin.delta.toFixed(2) }}%
        </p>
      </div>

      <!-- DEX Pool -->
      <div class="pool-item">
        <div>
          <p class="text-sm mb-4 text-gray">{{ t('dex_pool') }}</p>
          <div class="flex items-center">
            <div class="marker w-2 h-5 rounded mr-2" style="background: #dd7c37"></div>
            <span class="text-lg font-semibold text-color">
              {{ formatCurrency(dex.value) }}
            </span>
          </div>
        </div>
        <p class="text__price text-green mt-2 text-sm">
          {{ dex.delta.toFixed(2) }}%
        </p>
      </div>
    </div>

    <!-- Commented out liquidity section -->
    <!--
    <hr />
    <div>
      <div class="liqudity-items row">
        ... liquidity content ...
      </div>
    </div>
    -->
  </AppCard>
</template>

<script setup lang="ts">
import { usdConfig } from '~/composables/useCurrency'

interface PoolData {
  value: number
  delta: number
}

interface Props {
  deposit?: {
    value: number
    max: number
  }
  balance?: {
    value: number
    max: number
  }
}

interface Emits {
  (e: 'deposit'): void
  (e: 'withdraw'): void
}

const props = withDefaults(defineProps<Props>(), {
  deposit: () => ({
    value: 0,
    max: 20000
  }),
  balance: () => ({
    value: 0,
    max: 150
  })
})

const emit = defineEmits<Emits>()

// Composable
const { $filters, $api } = useNuxtApp()
const {t}  = useI18n()
// Reactive data
const stable = ref<PoolData>({ value: 0, delta: 0 })
const coin = ref<PoolData>({ value: 0, delta: 0 })
const dex = ref<PoolData>({ value: 0, delta: 0 })

// Data fetching
const { data: rewardsData, pending } = await useAsyncData(
  'daily-rewards',
  async () => {
    try {
      const data = await $api.dao.rewards()
      return data as { stable: PoolData; coin: PoolData; dex: PoolData }
    } catch (error) {
      console.error('Error fetching daily rewards:', error)
      return null
    }
  }
)

// Update reactive data when fetch completes
watch(rewardsData, (newData) => {
  if (newData) {
    stable.value = newData.stable
    coin.value = newData.coin
    dex.value = newData.dex
  }
}, { immediate: true })

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

<style scoped>
.pool-item {
  flex: 1;
  min-width: 120px;
  margin: 0 0.5rem;
}

/* Мобильные стили */
@media screen and (max-width: 750px) {
  .DailyRewards .title {
    border: 0;
    padding-bottom: 0;
  }

  .DailyRewards .wrapper_spool {
    flex-direction: column;
  }

  .DailyRewards .wrapper_spool > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1px solid theme('colors.border-color');
    padding: 10px 0;
  }

  .DailyRewards .wrapper_spool > div .text__price {
    margin-bottom: 8px;
  }
}

/* Стили для expanded sidebar на десктопе */
@media screen and (max-width: 970px) {
  .sidebar_expanded .DailyRewards .title {
    border: 0;
    padding-bottom: 0;
  }

  .sidebar_expanded .DailyRewards .wrapper_spool {
    flex-direction: column;
  }

  .sidebar_expanded .DailyRewards .wrapper_spool > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1px solid theme('colors.black');
    padding: 10px 0;
  }

  .sidebar_expanded .DailyRewards .wrapper_spool > div .text__price {
    margin-bottom: 8px;
  }
}
</style>
