<template>
  <AppCard class="AppStablePool p-1">
    <div class="left relative flex flex-col lg:flex-row lg:flex-wrap w-full">
      <!-- Header Text -->
      <div class="header-text px-2 pt-2 lg:order-1 lg:mb-3">
        <div class="name text-lg text-color">
          {{ title }}
        </div>
        <div class="price text-3xl text-color mt-2">
          {{ currentIndex }} $
        </div>
        <div class="graph-data mt-2 flex items-center text-green-600 text-sm">
          <UiSvgImage svg="arrow-right-up" class="w-4 h-4" />
          <p class="graph-value ml-3">{{ currentDaily }} $</p>
          <div class="graph-percent ml-3 bg-green-200 dark:bg-green-900 rounded px-1 py-1">
            <span>{{ currentDailyPercent }} %</span>
          </div>
        </div>
      </div>

      <!-- Header Buttons -->
      <div class="header-buttons px-2 pt-2 lg:order-2 lg:ml-auto lg:z-10">
        <!-- Period Buttons -->
        <div class="flex gap-2 flex-wrap">
          <UiButton
            v-for="period in periods"
            :key="period"
            theme="dark"
            outline
            size="sm"
            :class="{
              'active bg-blue-600 text-white border-blue-600': currentPeriod === period
            }"
            @click="currentPeriod = period"
          >
            {{ period === 'all' ? t('all') : period }}
          </UiButton>
        </div>

        <!-- Value Type Buttons -->
        <div class="second-row_buttons mt-3 flex gap-2 flex-wrap">
          <UiButton
            v-for="valueType in valueTypes"
            :key="valueType.key"
            theme="dark"
            outline
            size="sm"
            :class="{
              'active bg-blue-600 text-white border-blue-600': currentValue === valueType.key
            }"
            @click="currentValue = valueType.key"
          >
            {{ valueType.label }}
          </UiButton>
        </div>
      </div>

      <!-- Chart -->
      <div class="chart mt-2 lg:order-4 w-full px-1">
        <UiChart
          :items="chartItems"
          color="#CEC6FB"
          :gradient="true"
          :currency="currentValue === 'apy' ? 'percent' : 'usd'"
          class="w-full h-32"
        />
      </div>

      <!-- Chart Dates -->
      <div class="chart-text px-2 mt-3 lg:order-5 text-gray-500 text-sm w-full">
        {{ dates }}
      </div>

      <!-- Footer Stats -->
      <div class="footer mt-3 lg:order-6 w-full border-t border-border">
        <div class="pt-6 footerItems px-2">
          <div
            v-for="(item, index) in footerItems"
            :key="index"
            class="item mb-4 lg:mb-0"
          >
            <div class="value mb-2 text-lg font-semibold text-color">
              {{ item.value }}
            </div>
            <div class="text text-gray-500 text-sm">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// Types
interface GraphData {
  price: number
  apy: number
  daily: number
  tvl: number
  chart: ChartItem[]
  locked: number
  wallet: number
  rewards: number
  balance: number
}

interface ChartItem {
  createdAt: string
  price: number
  tvl: number
  apy: number
  daily: number
}

interface FooterItem {
  value: string
  text: string
}

interface ValueType {
  key: string
  label: string
}

// Composables
const { t } = useI18n()
const { $filters, $dayjs } = useNuxtApp()

// Props
const props = defineProps({
  pool: {
    type: String,
    default: 'stable'
  },
  graphData: {
    type: Object as PropType<GraphData>,
    default: () => ({
      price: 1,
      apy: 1,
      daily: 0,
      tvl: 0,
      chart: [],
      locked: 0,
      wallet: 0,
      rewards: 0,
      balance: 0
    })
  }
})

// Reactive data
const currentPeriod = ref<string>('all')
const currentValue = ref<string>('price')

// Constants
const periods = ['all', '1D', '1W', '1M', '3M'] as const
const valueTypes: ValueType[] = [
  { key: 'tvl', label: 'TVL' },
  { key: 'price', label: t('price') },
  { key: 'apy', label: t('apy') }
]

// Computed
const title = computed(() => {
  return `${props.pool.charAt(0).toUpperCase()}${props.pool.slice(1)} Pool`
})

const footerItems = computed((): FooterItem[] => {
  return [
    {
      value: $filters.toCurrency(props.graphData.balance),
      text: t('balances')
    },
    {
      value: $filters.toCurrency(props.graphData.tvl),
      text: t('total_value')
    },
    {
      value: $filters.toCurrency(Math.abs(props.graphData.rewards)),
      text: t('rewards')
    },
    {
      value: `${props.graphData.apy.toFixed(4)} %`,
      text: t('apy')
    },
    {
      value: `${props.graphData.daily.toFixed(4)} %`,
      text: t('daily')
    },
    {
      value: `${props.graphData.wallet.toFixed(4)} ${props.pool.charAt(0).toUpperCase()}POOL`,
      text: t('wallet')
    }
  ]
})

const chartItems = computed(() => {
  return props.graphData.chart
    .filter(item => $dayjs(item.createdAt, 'YYYY-MM-DD').isSameOrAfter(afterMoment.value))
    .map(item => {
      let value = item.price

      switch (currentValue.value) {
        case 'tvl':
          value = item.tvl
          break
        case 'apy':
          value = item.apy
          break
      }

      return {
        currency: 'usd',
        createdAt: item.createdAt,
        value: value,
        daily: item.daily
      }
    })
})

const afterMoment = computed(() => {
  const moment = $dayjs()

  switch (currentPeriod.value) {
    case '1D':
      return moment.startOf('day').add(-1, 'day')
    case '1W':
      return moment.startOf('day').add(-1, 'week')
    case '1M':
      return moment.startOf('day').add(-1, 'month')
    case '3M':
      return moment.startOf('day').add(-3, 'month')
    default:
      return moment.startOf('day').add(-10, 'years')
  }
})

const currentIndex = computed(() => {
  return props.graphData.price?.toFixed(2)
})

const currentDaily = computed(() => {
  return (props.graphData.daily * props.graphData.price)?.toFixed(2)
})

const currentDailyPercent = computed(() => {
  return props.graphData.daily?.toFixed(2)
})

const dates = computed(() => {
  if (!chartItems.value.length) return ''

  const firstDate = chartItems.value[0]?.createdAt
  const lastDate = chartItems.value[chartItems.value.length - 1]?.createdAt
  return `${firstDate} - ${lastDate}`
})

// Watch for changes that might need side effects
watch([currentPeriod, currentValue], () => {
  // You can add any side effects here, like analytics tracking
  console.log(`Period: ${currentPeriod.value}, Value: ${currentValue.value}`)
})
</script>

<style scoped>
/* Base styles */
.AppStablePool {
  @apply overflow-visible;
}

/* Active button states */
:deep(.UiButton.active) {
  @apply bg-blue-600 text-white border-blue-600;
}

/* Custom breakpoints for specific layouts */
@media screen and (max-width: 1050px) {
  .header-buttons {
    @apply ml-0 order-5 w-full;
  }

  .second-row_buttons {
    @apply mt-2;
  }

  .chart-text {
    @apply order-6 mt-3 px-2;
  }
}

.footerItems {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media screen and (max-width: 600px) {
  .footerItems {
    @apply grid-cols-2;

    .item {
      @apply text-left;
    }
  }
}

@media screen and (max-width: 500px) {
  .header-buttons {
    :deep(.UiButton) {
      @apply flex-1 min-w-[calc(50%-4px)];
    }
  }

  .footerItems {
    @apply grid-cols-1;
  }
}

/* Dark mode support */
:global(.dark) {
  .graph-percent {
    @apply bg-green-900;
  }
}

/* Animation for value changes */
.value {
  transition: color 0.3s ease;
}

/* Hover effects for interactive elements */
:deep(.UiButton):not(.active):hover {
  @apply transform -translate-y-1 shadow-md;
}



/* Ensure chart has proper dimensions */
.chart {
  min-height: 100px;
}

/* Loading states */
.AppStablePool:deep(.skeleton) {
  @apply bg-gray-200 animate-pulse rounded;
}
</style>
