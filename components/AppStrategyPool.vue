<template>
  <AppCard class="AppStrategyPool p-6">
    <h2 class="pool-title text-2xl font-bold text-color mb-2">
      {{ t('strategy') }}
    </h2>

    <!-- Strategy and Vault Buttons -->
    <div class="buttons flex items-center gap-3 mt-7 flex-wrap">
      <UiButton
        v-if="isShowStrategy && partner "
        size="sm"
        theme="outline"
        class="flex items-center gap-2 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
        @click="openLink(partner.url)"
      >
        {{ t('strategy_address') }}
        <UiSvgImage class="w-4 h-4" svg="link" />
      </UiButton>

      <UiButton
        v-for="vault in vaults"
        :key="vault.url"
        size="sm"
        theme="outline"
        class="flex items-center gap-2 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
        @click="openLink(vault.url)"
      >
        {{ t('vault_address') }} {{ vault.label }}
        <UiSvgImage class="w-4 h-4" svg="link" />
      </UiButton>
    </div>

    <!-- Strategy Description -->
    <div class="text text-gray-500 mt-7 pb-8 leading-6">
      {{ strategyText }}
    </div>

    <hr class="border-border">

    <!-- APY Breakdown (Commented out in original) -->
    <!--
    <div class="apy flex justify-between items-center pt-6 pb-6">
      <p class="w-22 text-color font-medium">{{ t('AppStrategyPool.apy_breakdown') }}</p>
      <div v-for="(item, index) in apyItems" :key="index" class="text-center">
        <p class="text-gray-500 text-sm mb-2">{{ item.text }}</p>
        <p class="text-lg font-semibold text-color">{{ item.value }}</p>
      </div>
    </div>

    <hr class="border-border">
    -->

    <!-- Audit Information -->
    <div class="flex items-center gap-8 pt-5 flex-wrap">
      <div class="flex items-center text-sm uppercase text-color font-medium">
        <UiSvgImage svg="shield" class="w-5 h-5 mr-3 text-green-500" />
        {{ t('audited') }}
      </div>
      <div class="flex items-center text-sm uppercase text-color font-medium">
        <UiSvgImage svg="shield" class="w-5 h-5 mr-3 text-blue-500" />
        {{ t('AppStrategyPool.community_audit') }}
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// Types
interface StrategyItem {
  partner: string
  url: string
}

interface VaultItem {
  partner: string
  vaults: Array<{
    label: string
    url: string
  }>
}

interface Description {
  ru: string
  en: string
  [key: string]: string
}

interface ApyData {
  totalApy: number
  vaultApr: number
  tradingApr: number
}

interface ApyItem {
  text: string
  value: string
}

// Composables
const { t, locale } = useI18n()
const { $utils } = useNuxtApp()

// Props
const props = defineProps({
  strategy: {
    type: Array as PropType<StrategyItem[]>,
    default: () => []
  },
  vault: {
    type: Array as PropType<VaultItem[]>,
    default: () => []
  },
  description: {
    type: Object as PropType<Description>,
    default: () => ({ ru: '', en: '' })
  },
  apy: {
    type: Object as PropType<ApyData>,
    default: () => ({
      totalApy: 43.34,
      vaultApr: 35.82,
      tradingApr: 0.19
    })
  }
})

// Computed
const partner = computed(() => {
  return props.strategy.find(item => item.partner === window.location.host)
})

const vaults = computed(() => {
  const vaultData = props.vault.find(item => item.partner === window.location.host)
  return vaultData ? vaultData.vaults : []
})

const isShowStrategy = computed(() => {
  return partner.value && partner.value.url
})

const strategyText = computed(() => {
  const text = props.description[locale.value] || props.description.en || ''
  const platformName = $utils.hostToTitle?.(window.location.host)
  return text.replace('{platform}', platformName)
})

const apyItems = computed((): ApyItem[] => {
  return [
    {
      text: t('AppStrategyPool.total_apy'),
      value: `${props.apy.totalApy}%`
    },
    {
      text: t('AppStrategyPool.vault_apr'),
      value: `${props.apy.vaultApr}%`
    },
    {
      text: t('AppStrategyPool.trading_apr'),
      value: `${props.apy.tradingApr}%`
    }
  ]
})

// Methods
const openLink = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
/* Base styles */
.AppStrategyPool {
  @apply overflow-hidden;
}

.pool-title {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* Button styles with proper SVG handling */
.AppStrategyPool :deep(.UiButton) {
  path {
    fill: transparent;
    stroke: var(--color_svg);
  }
}

/* Custom breakpoints for APY section (if uncommented) */
@media screen and (max-width: 767px) {
  .apy {
    @apply flex-wrap py-8;

    & > p {
      @apply w-full mb-4 text-base;
    }

    & > div {
      @apply flex-1 min-w-[33.333%] mb-4;
    }
  }
}

@media screen and (max-width: 450px) {
  .apy {
    & > div {
      @apply min-w-[50%];
    }
  }
}

/* Expanded sidebar responsive design */
:global(.sidebar_expanded) {
  @media screen and (max-width: 767px) {
    .AppStrategyPool {
      .apy {
        @apply flex-wrap py-8;

        & > p {
          @apply w-full mb-4;
        }
      }
    }
  }
}

:global(.cabinet:not(.cabinet_mobile)) {
  @media screen and (max-width: 450px) {
    .AppStrategyPool {
      .apy {
        @apply flex-wrap py-8;

        & > p {
          @apply w-full mb-4;
        }
      }
    }
  }
}

:global(.cabinet_mobile) {
  .AppStrategyPool {
    .apy {
      @apply flex-wrap py-8;

      & > p {
        @apply w-full mb-4;
      }
    }
  }
}

/* Dark mode support */
:global(.dark) {
  .AppStrategyPool {
    @apply bg-raisin-black;
  }

  hr {
    @apply border-onyx;
  }
}

/* Hover effects for buttons */
.AppStrategyPool :deep(.UiButton):hover {
  path {
    stroke: currentColor;
  }
}

/* Focus states for accessibility */
.AppStrategyPool :deep(.UiButton):focus {
  @apply outline-none ring-2 ring-blue-500 ring-opacity-50;
}

/* Print styles */
@media print {
  .AppStrategyPool {
    @apply shadow-none border border-gray-300;

    .buttons {
      @apply hidden;
    }
  }
}

/* Animation for card entry */
.AppStrategyPool {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure text has proper contrast */
.text {
  color: var(--text-secondary);
}

/* Loading state styles */
.AppStrategyPool:deep(.skeleton) {
  @apply bg-gray-200 animate-pulse rounded;
}
</style>
