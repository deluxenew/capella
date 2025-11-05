<template>
  <AppCard class="AssetCard p-6">
    <!-- Header -->
    <h3 class="pool-subtitle mb-2 uppercase text-gray-500 text-xs font-medium tracking-wide">
      {{ t('asset_details') }}
    </h3>
    <h2 class="pool-title text-2xl font-bold text-color">
      {{ title }}
    </h2>

    <!-- Action Buttons -->
    <div class="buttons flex items-center gap-3 mt-7 flex-wrap">
      <UiButton
        v-if="website"
        size="sm"
        theme="outline"
        class="flex items-center gap-2 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
        @click="openLink(website)"
      >
        {{ t('website') }}
        <UiSvgImage class="w-4 h-4" svg="link" />
      </UiButton>

      <UiButton
        v-if="contract"
        size="sm"
        theme="outline"
        class="flex items-center gap-2 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg"
        @click="openLink(contract)"
      >
        {{ t('token_contract') }}
        <UiSvgImage class="w-4 h-4" svg="link" />
      </UiButton>
    </div>

    <!-- Description -->
    <div class="text text-gray-500 mt-7 pb-2 leading-6">
      {{ assetDescription }}
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

// Types
interface Description {
  ru: string
  en: string
  [key: string]: string
}

// Composables
const { t, locale } = useI18n()
const { $utils } = useNuxtApp()

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  contract: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  description: {
    type: Object as PropType<Description>,
    default: () => ({ ru: '', en: '' })
  }
})

// Computed
const assetDescription = computed(() => {
  const text = props.description[locale.value] || props.description.en || ''
  const platformName = $utils.hostToTitle?.(window.location.host)
  return text.replace('{platform}', platformName)
})

// Methods
const openLink = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
/* Base styles */
.AssetCard {
  @apply overflow-hidden transition-all duration-300 hover:shadow-lg;
}

.pool-title {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* Button styles with proper SVG handling */
.AssetCard :deep(.UiButton) {
  path {
    fill: transparent;
    stroke: var(--color_svg);
    transition: stroke 0.3s ease;
  }

  &:hover path {
    stroke: currentColor;
  }
}

/* Small mobile devices */
@media screen and (max-width: 380px) {
  .AssetCard {
    @apply p-2;
  }

  .pool-title {
    @apply text-sm;
  }

  .pool-subtitle {
    @apply text-3xl;
  }
}

/* Dark mode support */
:global(.dark) {
  .AssetCard {
    @apply bg-raisin-black;
  }
}

/* Focus states for accessibility */
.AssetCard :deep(.UiButton):focus {
  @apply outline-none ring-2 ring-blue-500 ring-opacity-50;
}

/* Print styles */
@media print {
  .AssetCard {
    @apply shadow-none border border-gray-300;

    .buttons {
      @apply hidden;
    }
  }
}

/* Animation for card entry */
.AssetCard {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effect for the entire card */
.AssetCard:hover {
  transform: translateY(-2px);
}

/* Ensure text has proper contrast and readability */
.text {
  color: var(--text-secondary);
  word-wrap: break-word;
  hyphens: auto;
}

/* Loading state styles */
.AssetCard:deep(.skeleton) {
  @apply bg-gray-200 animate-pulse rounded;
}

/* Custom scrollbar for long descriptions */
.text {
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
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

:global(.dark) .text {
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

/* Ensure proper text rendering */
.pool-title,
.pool-subtitle,
.text {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Responsive text sizing */
@media screen and (min-width: 1920px) {
  .AssetCard {
    .pool-title {
      @apply text-3xl;
    }

    .text {
      @apply text-base leading-7;
    }
  }
}
</style>
