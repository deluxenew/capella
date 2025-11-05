<template>
  <AppCard class="AppBalance">
    <div class="left relative" v-if="balance">
      <transition name="fade" mode="out-in">
        <div v-if="!pending" class="header-text">
          <div class="name">{{ t('balance') }}</div>
          <div class="price mt-5">
            {{ formatCurrency(balance?.balance) }}
          </div>
          <div
            v-if="balance?.daily > 0"
            class="graph-data mt-5 flex items-center"
          >
            <UiSvgImage
              v-if="balance.daily > 0 || balance.daily < 0"
              :svg="balance.daily > 0 ? 'arrow-right-up' : 'arrow-down-right'"
            />
            <p
              class="graph-value ml-4"
              :class="
                balance.daily > 0
                  ? 'positive'
                  : balance.daily < 0
                  ? 'negative'
                  : ''
              "
            >
              {{ formatPercent(balance.daily) }}
            </p>
          </div>
        </div>
        <div v-else key="empty" />
      </transition>
      <div class="header-buttons">
        <div>
          <UiButton
            v-for="(period, index) in periods"
            :key="`period_${index}`"
            theme="dark"
            outline
            size="sm"
            :class="{
              active: from === (period.value ? getFormatedDate(period.value) : null),
            }"
            @click="from = period.value ? getFormatedDate(period.value) : null"
          >
            {{ period.text }}
          </UiButton>
        </div>
        <div class="second-row_buttons mt-5 flex gap-3">
          <Variable
            v-for="pool in ['stable', 'coin', 'dex']"
            :key="`button_${pool}`"
            v-slot="{ active }"
            :active="pools.includes(pool)"
          >
            <UiButton
              theme="dark"
              outline
              size="sm"
              :class="{ active }"
              @click="() => (pools.length > 1 || !active) && setPools(pool)"
            >
              {{ t(pool) }}
            </UiButton>
          </Variable>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="!pending" class="chart mt-15 relative">
          <UiChart
            v-if="balance?.balance > 0"
            :items="balance?.chart"
            value-key="balance"
            class="flex"
            gradient
          >
            <div class="chart-text">
              <span v-if="from">{{ `${from} - ` }}</span>
              <span>{{ to }}</span>
            </div>
          </UiChart>
          <div v-else class="text-center">
            <h3>{{ t('no_balance') }}</h3>
            <UiButton class="mt-5" @click="replenishBalance()">
              {{ t('no_balance') }}
            </UiButton>
          </div>
        </div>
        <AppLoader v-else-if="pending" />
      </transition>
    </div>
    <slot />
  </AppCard>
</template>

<script setup lang="ts">
// Types
interface BalanceData {
  balance: number
  daily: number
  chart: any[]
}

interface Period {
  text: string
  value: Date | null
}

// Composables
const { $api, $filters } = useNuxtApp()
const { t } = useI18n()

// Data
const balance = ref<BalanceData | null>(null)
const pending = ref(true)
const from = ref<string | null>(null)
const to = ref(getFormatedDate(new Date()))
const pools = ref<string[]>(['stable', 'coin', 'dex'])

const periods = ref<Period[]>([
  {
    text: 'all',
    value: null,
  },
  {
    text: '1w',
    value: new Date(Date.now() - 24 * 7 * 3600000),
  },
  {
    text: '1m',
    value: new Date(Date.now() - 24 * 30 * 3600000),
  },
])

let timeoutId: NodeJS.Timeout | null = null

// Methods
function getFormatedDate(date: Date): string {
  return $filters.toDate?.(date) || date.toISOString().split('T')[0]
}

const formatCurrency = (value: number | undefined): string => {
  if (!value) return '0'
  return $filters.toCurrency?.(value) || value.toString()
}

const formatPercent = (value: number): string => {
  return $filters.toPercent?.(value, { minimumFractionDigits: 4 }) || `${value}%`
}

const replenishBalance = (): void => {
  const pool = pools.value[0]
  const PoolCard = document.getElementById(`AppPoolCard_${pool}`)
  if (PoolCard) {
    PoolCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (timeoutId) clearTimeout(timeoutId)
    PoolCard.classList.add('blink')

    timeoutId = setTimeout(() => {
      PoolCard.classList.remove('blink')
    }, 1000)
  }
}

const setPools = (value: string): void => {
  const itemIdx = pools.value.findIndex((pool) => pool === value)
  if (itemIdx >= 0 && pools.value.length > 1) {
    pools.value.splice(itemIdx, 1)
  } else {
    pools.value.push(value)
  }
}

const fetchBalance = async (): Promise<void> => {
  try {
    pending.value = true
    const { data } = await $api.user.getBalance({
      from: from.value,
      to: to.value,
      pool: pools.value
    })
    balance.value = data
  } catch (error) {
    console.error('Failed to fetch balance:', error)
  } finally {
    pending.value = false
  }
}

// Watchers
watch([from, pools], () => {
  fetchBalance()
})

// Lifecycle
onMounted(() => {
  fetchBalance()
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.AppBalance {
  @apply p-0 flex flex-wrap gap-5 overflow-visible;
}

.AppBalance > .left {
  @apply flex flex-row flex-wrap flex-1 min-h-70;
  flex: 10 8 470px;
}

.AppBalance > .left .header-buttons {
  @apply pt-5 ml-auto relative right-2;
}

.AppBalance > .left .header-buttons > div {
  @apply flex gap-2 flex-wrap;
}

.AppBalance > .left .header-buttons .second-row_buttons button:first-of-type {
  @apply ml-auto;
}

.AppBalance > .left .header-text {
  @apply py-5 pl-5 mb-2;
}

.AppBalance > .left .header-text .name {
  @apply text-lg;
}

.AppBalance > .left .header-text .price {
  @apply text-3xl;
}

.AppBalance .graph-data {
  @apply text-xs;
}

.AppBalance .graph-data .graph-percent {
  @apply bg-red-darken rounded p-1 px-1;
}

.AppBalance .chart-text {
  @apply text-gray absolute bottom-5 text-xs ml-5 w-full;
}

.AppBalance .chart {
  width: calc(100% + 70px);
  @apply h-32 bottom-0;
}

/* Mobile styles */
:global(.cabinet:not(.cabinet_mobile)) {
  @media screen and (max-width: 600px) {
    .AppBalance {
      @apply bg-transparent;
    }

    .AppBalance > .left {
      @apply bg-bg-secondary py-2 rounded-lg flex-[5_10_100%];
    }

    .AppBalance > .left .header-buttons {
      @apply order-3 ml-7;
    }

    .AppBalance > .left .header-buttons > div {
      @apply flex-wrap;
    }

    .AppBalance > .left .header-buttons .second-row_buttons button:first-of-type {
      @apply ml-0;
    }

    .AppBalance > .left .chart {
      @apply order-2;
    }

    .AppBalance > .left .chart-text {
      @apply order-4 mt-4;
    }
  }
}

:global(.cabinet_mobile) {
  .AppBalance {
    @apply bg-transparent;
  }

  .AppBalance > .left {
    @apply bg-bg-secondary py-2 rounded-lg flex-[5_10_100%];
  }

  .AppBalance > .left .header-buttons {
    @apply order-3 ml-7;
  }

  .AppBalance > .left .header-buttons > div {
    @apply flex-wrap;
  }

  .AppBalance > .left .header-buttons .second-row_buttons button:first-of-type {
    @apply ml-0;
  }

  .AppBalance > .left .chart {
    @apply order-2;
  }

  .AppBalance > .left .chart-text {
    @apply order-4 mt-4;
  }
}

/* Responsive buttons */
@media screen and (max-width: 850px) {
  .AppBalance > .left .header-buttons > div {
    @apply flex-wrap;
  }

  .AppBalance > .left .header-buttons > div button {
    @apply p-2;
  }
}

/* Button styles */
:deep(.UiButton_dark) {
  @apply text-gray text-xs;
}

:deep(.UiButton_dark:hover) {
  @apply text-blue;
}

.positive {
  @apply text-green;
}

.negative {
  @apply text-red;
}
</style>
