<template>
  <div class="pools">
    <div class="page-title text-2xl font-bold text-color">
      {{ t(`${poolName}_pool`) }}
    </div>

    <div class="px-5">
      <AppStablePool
        class="mt-5"
        :graph-data="graphData"
        :pool="poolName"
      />
    </div>

    <div class="flex px-5 mt-5 wrapper border-t border-border">
      <div class="flex flex-col pt-5 left-column flex-1 lg:flex-[10_8_470px] lg:border-r lg:border-border lg:pr-2">
        <AppStrategyPool v-bind="strategy" />
        <AssetCard
          v-for="asset in assets"
          :key="asset.id"
          v-bind="asset"
          :description="asset.description"
          class="w-full mt-5"
        />
      </div>

      <div class="flex flex-col pt-5 right-column flex-1 lg:flex-[8_10_390px] lg:pl-2">
        <!-- <DepositCard /> -->
        <AppROICard
          :price="graphData?.price"
          :daily="graphData?.daily"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
interface Asset {
  id: string
  description?: Description
  [key: string]: any
}

interface Strategy {
  [key: string]: any
}

interface ChartItem {
  createdAt: string
  price: number
  tvl: number
  apy: number
  daily: number
}

interface Description {
  ru: string
  en: string
  [key: string]: string
}

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

// Composables
const { t } = useI18n()
const { $api, $utils } = useNuxtApp()
const route = useRoute()

// Reactive data
const assets = ref<Asset[]>([])
const strategy = ref<Strategy>({})
const graphData = ref<GraphData >({
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

// Computed
const poolName = computed(() => route.params.name as string)

// Layout
definePageMeta({
  layout: 'inner'
})

// Head configuration
useHead({
  title: $utils.hostToTitle?.(window.location.host)
})

// Data fetching
const { data: assetsData } = await useAsyncData(
  `pool-assets-${poolName.value}`,
  async () => {
    try {
      const { data } = await $api.pool.assets(poolName.value)
      return data
    } catch (error) {
      console.error('Error fetching pool assets:', error)
      return []
    }
  }
)

const { data: strategyData } = await useAsyncData(
  `pool-strategy-${poolName.value}`,
  async () => {
    try {
      const { data } = await $api.pool.strategy(poolName.value)
      return data
    } catch (error) {
      console.error('Error fetching pool strategy:', error)
      return {}
    }
  }
)

const { data: graphDataResponse } = await useAsyncData(
  `pool-graph-${poolName.value}`,
  async () => {
    try {
      const { data } = await $api.pool.graph(poolName.value)
      return data
    } catch (error) {
      console.error('Error fetching pool graph data:', error)
      return undefined
    }
  }
)

// Update reactive data when fetch completes
watchEffect(() => {
  if (assetsData.value) {
    assets.value = assetsData.value
  }

  if (strategyData.value) {
    strategy.value = strategyData.value
  }

  if (graphDataResponse.value) {
    graphData.value = graphDataResponse.value
  }
})

// Error handling
onErrorCaptured((error) => {
  console.error('Error in pools component:', error)
  // You can show a notification to the user here
  return false // Prevent the error from propagating further
})
</script>

<style scoped>
.pools {
  min-height: calc(100vh - 2rem);
}

.page-title {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* Custom breakpoints for pool layout */
@media screen and (max-width: 1209px) {
  .pools {
    .wrapper {
      .left-column {
        @apply pr-0 border-r-0;
      }

      .right-column {
        @apply pl-0;
      }
    }
  }
}

@media screen and (max-width: 1015px) {
  .pools {
    .wrapper {
      .left-column {
        @apply pr-0 border-r-0;
      }

      .right-column {
        @apply pl-0;
      }
    }
  }
}

/* Mobile layout */
@media screen and (max-width: 750px) {
  .pools {
    .wrapper {
      @apply flex-col;

      .left-column {
        @apply min-w-full;
      }
    }
  }
}

/* Expanded sidebar responsive design */
:global(.cabinet:not(.cabinet_mobile).sidebar_expanded) {
  @media screen and (max-width: calc(1015px + 320px - 125px)) {
    .pools {
      .wrapper {
        .left-column {
          @apply pr-0 border-r-0;
        }

        .right-column {
          @apply pl-0;
        }
      }
    }
  }
}

/* Mobile cabinet specific styles */
:global(.cabinet_mobile) {
  @media screen and (max-width: 750px) {
    .pools {
      .wrapper {
        @apply flex-col;

        .left-column {
          @apply min-w-full;
        }
      }
    }
  }
}

/* Small mobile devices */
@media screen and (max-width: 480px) {
  .pools {
    .px-5 {
      @apply px-1;
    }

    .page-title {
      @apply text-base;
    }
  }
}

/* Animation for page transition */
.pools {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Loading states */
.pools:deep(.skeleton) {
  @apply bg-gray-200 animate-pulse rounded;
}

/* Dark mode support */
:global(.dark) {
  .pools {
    @apply bg-raisin-black;

    .wrapper {
      @apply border-charade;
    }
  }
}

/* Print styles */
@media print {
  .pools {
    .px-5 {
      @apply px-0;
    }

    .mt-5 {
      @apply mt-2;
    }

    .pt-5 {
      @apply pt-2;
    }
  }
}

/* Ensure proper spacing for cards */
.pools:deep(.asset-card) {
  @apply transition-all duration-300 hover:shadow-lg;
}

/* Focus states for accessibility */
.pools:deep(*) {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50;
}
</style>
