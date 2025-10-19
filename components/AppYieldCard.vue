<template>
  <AppCard class="AppYieldCard">
    <section>
      <h2 class="mb-7">{{ t('AppYieldCard.title') }}</h2>
      <hr class="mb-4 border-border-color" />
      <UiPoolSelect :pools="pools" @select="selectedPool = $event" />
      <div class="AppYieldCard__amount mb-10">
        <UiCurrencyInput
          v-model="deposit"
          :currency-config="usdConfig"
          :label="t('AppYieldCard.amount_input.label')"
          class="flex-1"
        />
        <div class="interests_apy flex flex-col ml-5">
          <label class="text-gray text-sm mb-1">
            {{ t('AppYieldCard.interests_apy') }}
          </label>
          <span class="value text-2xl font-semibold">
            {{ formatPercent(interestsApy) }}
          </span>
        </div>
      </div>
      <hr class="mb-9 border-border-color" />

      <AppEarnings
        :percent="interestsApy"
        :deposit="deposit"
        class="AppYieldCard__power-function"
      />
      <hr class="mt-10 mb-8 border-border-color" />
      <p class="AppYieldCard__description text-base text-gray leading-relaxed">
        {{ t('AppYieldCard.description') }}
      </p>
    </section>
  </AppCard>
</template>

<script setup lang="ts">
// Types
interface Pool {
  title: string
  pool: string
  color: string
}

interface PoolData {
  apy?: number
  // добавьте другие свойства пула по необходимости
}

interface StoreState {
  pools: Record<string, PoolData>
}

// Composables
const { $filters } = useNuxtApp()
const { t } = useI18n()

// Store (замените на вашу реализацию)
const store = useMetamaskStore() // Убедитесь что store типизирован

// USD config (замените на вашу реализацию)
const usdConfig = ref({
  currency: 'USD',
  precision: 2
  // другие настройки
})

// Refs
const deposit = ref(1000)
const selectedPool = ref('stable')

// Data
const pools = ref<Pool[]>([
  {
    title: 'Stable Pool',
    pool: 'stable',
    color: '#AAFFCB',
  },
  {
    title: 'Coin Pool',
    pool: 'coin',
    color: '#9FE0FF',
  },
  {
    title: 'Dex Pool',
    pool: 'dex',
    color: '#DD7C37',
  },
])

// Computed
const interestsApy = computed((): number => {
  const poolData = store?.pools?.[selectedPool.value] as PoolData | undefined
  return poolData?.apy || 0
})

const poolAPY = computed(() => {
  return store?.pools?.[selectedPool.value] as PoolData | undefined
})

// Methods
const formatPercent = (value: number): string => {
  if ($filters?.toPercent) {
    return $filters.toPercent(value, { minimumFractionDigits: 2 })
  }
  // Fallback форматирование
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100)
}
</script>

<style scoped>
.AppYieldCard h2 {
  @apply text-2xl font-semibold;
}

.AppYieldCard .AppYieldCard__amount {
  @apply flex items-start gap-5;
}

@media (max-width: 768px) {
  .AppYieldCard .AppYieldCard__amount {
    @apply flex-col gap-4;
  }

  .AppYieldCard .AppYieldCard__amount .interests_apy {
    @apply ml-0;
  }
}
</style>
