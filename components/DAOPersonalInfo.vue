<template>
  <AppCard class="DAOPersonalInfo">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-semibold">{{ t('personal_info') }}</h2>
      <!--
      <UiButton size="sm" class="shadow-lg sign-up-btn">
        {{ t('claim_cape') }}
      </UiButton>
      -->
    </div>

    <!-- Content -->
    <div class="mt-14">
      <!-- Stable Pool -->
      <div class="flex pb-9 justify-between items-center">
        <p class="text-base font-medium">{{ t('stable_pool') }}</p>
        <p class="text-base font-medium">
          {{ formatCurrency(balance?.stable || 0) }}
        </p>
      </div>
      <hr class="border-border">

      <!-- Coin Pool -->
      <div class="flex pb-9 mt-8 justify-between items-center">
        <p class="text-base font-medium">{{ t('coin_pool') }}</p>
        <p class="text-base font-medium">
          {{ formatCurrency(balance?.coin || 0) }}
        </p>
      </div>
      <hr class="border-border">

      <!-- DEX Pool -->
      <div class="flex pb-9 mt-8 justify-between items-center">
        <p class="text-base font-medium">{{ t('dex_pool') }}</p>
        <p class="text-base font-medium">
          {{ formatCurrency(balance?.dex || 0) }}
        </p>
      </div>
      <hr class="border-border">

      <!-- CAPE Rewards -->
      <div class="mt-8 pb-9">
        <div class="flex pb-2 justify-between items-center">
          <p class="text-base font-medium">{{ t('cape_rewards') }}</p>
          <p class="text-base font-medium">
            {{ formatCurrency(capeReward) }}
          </p>
        </div>
        <div class="flex pb-2 justify-between items-center">
          <p class="text-sm text-gray">{{ t('stable_pool') }}</p>
          <p class="text-sm text-gray">
            {{ formatCurrency(harvest?.stable || 0) }}
          </p>
        </div>
        <div class="flex pb-2 justify-between items-center">
          <p class="text-sm text-gray">{{ t('coin_pool') }}</p>
          <p class="text-sm text-gray">
            {{ formatCurrency(harvest?.coin || 0) }}
          </p>
        </div>
        <div class="flex pb-2 justify-between items-center">
          <p class="text-sm text-gray">{{ t('dex_pool') }}</p>
          <p class="text-sm text-gray">
            {{ formatCurrency(harvest?.dex || 0) }}
          </p>
        </div>
      </div>
      <hr class="border-border">

      <!-- Bonus Reward -->
      <div class="flex pb-9 mt-8 justify-between items-center">
        <p class="text-base font-medium">{{ t('bonus_reward') }}</p>
        <p class="text-base font-medium">
          {{ formatCurrency(refBonus) }}
        </p>
      </div>
    </div>

    <!-- Total Reward -->
    <div class="total-reward p-10 bg-charade rounded">
      <div class="flex justify-between items-center">
        <p class="text-base font-medium">{{ t('total_reward') }}</p>
        <p class="text-base font-medium">
          {{ formatCurrency(total) }}
        </p>
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

interface PersonalData {
  harvest: PoolData
  balance: PoolData
  refHarvest: PoolData
}

// Composable
const { $filters, $api } = useNuxtApp()
const { t } = useI18n()
// Reactive data
const balance = ref<PoolData | null>(null)
const harvest = ref<PoolData | null>(null)
const refHarvest = ref<PoolData | null>(null)

// Data fetching
const { data: personalData, pending } = await useAsyncData(
  'dao-personal',
  async () => {
    try {
      const  data  = await $api.dao.personal()
      return data as PersonalData
    } catch (error) {
      console.error('Error fetching personal DAO data:', error)
      return null
    }
  }
)

// Update reactive data when fetch completes
watch(personalData, (newData) => {
  if (newData) {
    balance.value = newData.balance
    harvest.value = newData.harvest
    refHarvest.value = newData.refHarvest
  }
}, { immediate: true })

// Computed
const total = computed((): number => {
  if (!harvest.value || !refHarvest.value) return 0

  return parseFloat((
    harvest.value.stable +
    harvest.value.coin +
    harvest.value.dex +
    refHarvest.value.stable +
    refHarvest.value.coin +
    refHarvest.value.dex
  ).toFixed(2))
})

const refBonus = computed((): number => {
  if (!refHarvest.value) return 0

  return parseFloat((
    refHarvest.value.stable +
    refHarvest.value.coin +
    refHarvest.value.dex
  ).toFixed(2))
})

const capeReward = computed((): number => {
  if (!harvest.value) return 0

  return parseFloat((
    harvest.value.stable +
    harvest.value.coin +
    harvest.value.dex
  ).toFixed(2))
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

<style scoped>
.sign-up-btn {
  padding: 12.5px 18px;
}

.total-reward {
  background-color: var(--bg-charade);
}
</style>
