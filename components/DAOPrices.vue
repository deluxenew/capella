<template>
  <div class="DAOPrices">
    <div class="flex flex-wrap justify-between gap-2">
      <AppCard
        v-for="(item, index) in items"
        :key="index"
        class="card flex-grow flex-basis-[32%] min-w-[200px]"
      >
        <p class="text-gray mb-2 text-sm">{{ item.text }}</p>
        <p class="text-lg font-semibold text-color">{{ item.value }}</p>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DAOValues {
  cape: string | number
  marketCap: number
  tvl: number
  users: number
  totalPayouts: number
  governancePool: number
}

interface PriceItem {
  text: string
  value: string
}

// Composable
const { $filters, $api } = useNuxtApp()

const {t}  = useI18n()
// Reactive data
const cape = ref<string | number>('∞')
const marketCap = ref<number>(0)
const tvl = ref<number>(0)
const users = ref<number>(0)
const totalPayouts = ref<number>(0)
const governancePool = ref<number>(0)

// Data fetching
const { data: daoData, pending } = await useAsyncData(
  'dao-values',
  async () => {
    try {
      const { data } = await $api.dao.values()
      return data as DAOValues
    } catch (error) {
      console.error('Error fetching DAO values:', error)
      return null
    }
  }
)

// Update reactive data when fetch completes
watch(daoData, (newData) => {
  if (newData) {
    cape.value = newData.cape
    marketCap.value = newData.marketCap
    tvl.value = newData.tvl
    users.value = newData.users
    totalPayouts.value = newData.totalPayouts
    governancePool.value = newData.governancePool
  }
}, { immediate: true })

// Computed
const items = computed<PriceItem[]>(() => [
  {
    text: t('cape_price'),
    value: `${cape.value} $`,
  },
  {
    text: t('market_cap'),
    value: $filters?.toCurrency?.(marketCap.value) || formatCurrency(marketCap.value),
  },
  {
    text: t('total_value'),
    value: $filters?.toCurrency?.(tvl.value) || formatCurrency(tvl.value),
  },
  {
    text: t('total_customers'),
    value: users.value.toString(),
  },
  {
    text: t('total_payouts'),
    value: `${totalPayouts.value} $`,
  },
  {
    text: t('governance_pool'),
    value: $filters?.toCurrency?.(governancePool.value) || formatCurrency(governancePool.value),
  },
])

// Methods
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
</script>

<style scoped>
/* Базовые стили для десктопа */
.DAOPrices .card {
  flex-basis: 32%;
}

/* Мобильные стили */
@media screen and (max-width: 760px) {
  .DAOPrices .card {
    flex-basis: 40%;
  }
}

/* Стили для expanded sidebar на десктопе */
@media screen and (max-width: 980px) {
  .sidebar_expanded .DAOPrices .card {
    flex-basis: 40%;
  }
}

/* Дополнительные responsive стили для очень маленьких экранов */
@media screen and (max-width: 480px) {
  .DAOPrices .card {
    flex-basis: 100%;
  }
}
</style>
