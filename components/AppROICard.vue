<template>
  <AppCard class="AppROICard p-6">
    <h2 class="text-2xl font-bold text-color mb-2">
      {{ t('roi_estimation') }}
    </h2>

    <!-- ROI Table -->
    <div class="table mt-8">
      <!-- Table Header -->
      <div class="heading">
        <div class="flex w-full pb-3 justify-between">
          <div class="text-gray-500 text-sm font-medium item">
            {{ t('timeframe') }}
          </div>
          <div class="text-gray-500 text-sm font-medium item">
            {{ t('roi') }}
          </div>
          <div class="text-gray-500 text-sm font-medium item">
            {{ t('rewards') }}
          </div>
        </div>
        <hr class="border-border">
      </div>

      <!-- Table Rows -->
      <div
        v-for="(item, index) in roiItems"
        :key="index"
        class="table-row group hover:bg-gray-50 dark:hover:bg-onyx transition-colors duration-200 rounded"
      >
        <div class="flex w-full py-3 justify-between items-center">
          <span class="item text-color font-medium">
            {{ item.title }}
          </span>
          <span
            class="item text-green-600 font-semibold"
            :class="{ 'text-red-600': item.roiValue < 0 }"
          >
            {{ item.roi }}
          </span>
          <div class="item">
            <p class="text-color font-medium">
              {{ item.rewards }}
              <span v-if="!item.rewardsValue" class="text-gray-400">
                {{ t('spool') }}
              </span>
            </p>
            <!-- Uncomment if you want to show price -->
            <!-- <span class="text-xs text-gray-500 block mt-1">
              {{ item.price }}
            </span> -->
          </div>
        </div>
        <hr class="border-border group-last:border-transparent">
      </div>
    </div>

    <!-- Description Text -->
    <div class="text-gray-500 mt-6 text-sm leading-5">
      {{ t('roi_text') }}
    </div>
  </AppCard>
</template>

<script setup lang="ts">
// Types
interface ROIItem {
  title: string
  roi: string
  roiValue: number
  rewards: string
  rewardsValue: number
  price?: string
}

interface CompoundInterestResult {
  totalAmount: number
  accumulatedInterest: number
}

// Composables
const { t } = useI18n()

// Props
const props = defineProps({
  price: {
    type: Number,
    default: 1
  },
  daily: {
    type: Number,
    default: 0.0665
  }
})

// Compound interest calculation
const calculateCompoundInterest = (
  principal: number,
  dailyRate: number,
  days: number
): CompoundInterestResult => {
  const annualRate = dailyRate * 365
  const timeInYears = days / 365
  const totalAmount = principal * Math.pow((1 + annualRate / 365), 365 * timeInYears)
  const accumulatedInterest = totalAmount - principal

  return {
    totalAmount,
    accumulatedInterest
  }
}

// Computed
const calculations = computed(() => {
  const dailyRate = props.daily / 100

  return {
    day1: calculateCompoundInterest(1, dailyRate, 1),
    day7: calculateCompoundInterest(1, dailyRate, 7),
    day30: calculateCompoundInterest(1, dailyRate, 30),
    day365: calculateCompoundInterest(1, dailyRate, 365)
  }
})

const roiItems = computed((): ROIItem[] => {
  const { day1, day7, day30, day365 } = calculations.value

  return [
    {
      title: '1D',
      roi: `${(day1.accumulatedInterest * 100).toFixed(4)}%`,
      roiValue: day1.accumulatedInterest * 100,
      rewards: `${(day1.totalAmount * props.price - props.price).toFixed(2)}$`,
      rewardsValue: day1.totalAmount * props.price - props.price
    },
    {
      title: '7D',
      roi: `${(day7.accumulatedInterest * 100).toFixed(4)}%`,
      roiValue: day7.accumulatedInterest * 100,
      rewards: `${(day7.totalAmount * props.price - props.price).toFixed(2)}$`,
      rewardsValue: day7.totalAmount * props.price - props.price
    },
    {
      title: '30D',
      roi: `${(day30.accumulatedInterest * 100).toFixed(4)}%`,
      roiValue: day30.accumulatedInterest * 100,
      rewards: `${(day30.totalAmount * props.price - props.price).toFixed(2)}$`,
      rewardsValue: day30.totalAmount * props.price - props.price
    },
    {
      title: '365D',
      roi: `${(day365.accumulatedInterest * 100).toFixed(4)}%`,
      roiValue: day365.accumulatedInterest * 100,
      rewards: `${(day365.totalAmount * props.price - props.price).toFixed(2)}$`,
      rewardsValue: day365.totalAmount * props.price - props.price
    }
  ]
})

// Watch for price/daily changes for potential side effects
watch([() => props.price, () => props.daily], () => {
  // You can add analytics or other side effects here
  console.log('ROI calculations updated with new price/daily values')
})
</script>

<style scoped>
/* Base styles */
.AppROICard {
  @apply overflow-hidden;
}

/* Table layout */
.heading > div,
.table-row > div {
  @apply justify-between;
}

.heading .item,
.table-row .item {
  @apply w-1/3 text-center;
}

/* Custom breakpoints for table layout */
@media screen and (max-width: 470px) {
  .heading .item,
  .table-row .item {
    @apply w-30;
  }

  .table-row .item {
    @apply flex justify-between;
  }
}

@media screen and (max-width: 800px) {
  .table-row .item {
    @apply w-30 flex justify-between;
  }
}

/* Expanded sidebar responsive design */
:global(.sidebar_expanded) {
  @media screen and (max-width: 800px) {
    .table-row .item {
      @apply w-30 flex justify-between;
    }
  }
}

:global(.cabinet:not(.cabinet_mobile)) {
  @media screen and (max-width: 470px) {
    .heading .item,
    .table-row .item {
      @apply w-30;
    }

    .table-row .item {
      @apply flex justify-between;
    }
  }
}

:global(.cabinet_mobile) {
  .heading .item,
  .table-row .item {
    @apply w-30;
  }

  .table-row .item {
    @apply flex justify-between;
  }
}

/* Small mobile devices */
@media screen and (max-width: 380px) {
  .AppROICard {
    @apply p-2;
  }

  .heading .item,
  .table-row .item {
    @apply w-28 text-xs;
  }

  .table-row > div {
    @apply py-1.5;
  }
}

/* Dark mode support */
:global(.dark) {
  .AppROICard {
    @apply bg-raisin-black;
  }

  .table-row:hover {
    @apply bg-onyx;
  }
}

/* Hover effects for table rows */
.table-row {
  @apply transition-all duration-200;

  &:hover {
    @apply transform -translate-y-0.5 shadow-sm;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}

/* Color coding for positive/negative ROI */
.text-green-600 {
  color: var(--color-success, #16a34a);
}

.text-red-600 {
  color: var(--color-error, #dc2626);
}

/* Print styles */
@media print {
  .AppROICard {
    @apply shadow-none border border-gray-300;

    .table-row:hover {
      @apply bg-transparent transform-none shadow-none;
    }
  }
}

/* Animation for card entry */
.AppROICard {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Loading state styles */
.AppROICard:deep(.skeleton) {
  @apply bg-gray-200 animate-pulse rounded;
}

/* Ensure proper text contrast and readability */
.item {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Focus states for accessibility */
.AppROICard:focus-within {
  @apply ring-2 ring-blue-500 ring-opacity-50;
}

/* Custom scrollbar for mobile overflow */
@media screen and (max-width: 470px) {
  .table {
    @apply overflow-x-auto;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      @apply bg-gray-100 rounded;
    }

    &::-webkit-scrollbar-thumb {
      @apply bg-gray-400 rounded;
    }

    &::-webkit-scrollbar-thumb:hover {
      @apply bg-gray-500;
    }
  }
}

:global(.dark) .table {
  @media screen and (max-width: 470px) {
    &::-webkit-scrollbar-track {
      @apply bg-gray-700;
    }

    &::-webkit-scrollbar-thumb {
      @apply bg-gray-500;
    }

    &::-webkit-scrollbar-thumb:hover {
      @apply bg-gray-400;
    }
  }
}
</style>
