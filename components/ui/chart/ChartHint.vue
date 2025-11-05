<template>
  <div v-if="activePoint" class="hint-table">
    <div
      ref="hintContent"
      class="hint_content"
      :class="{ '_reversed': isReversed }"
      :style="{
        top: `${activePoint.position?.top}px`,
        left: `${hintContentLeft}px`,
      }"
    >
      <span class="badge_time">{{ formatDate(activePoint.createdAt) }}</span>
      <span v-if="currency === 'percent'">
        {{ formatPercent(activePoint[valueKey]) }}
      </span>
      <span v-else>
        {{ formatCurrency(activePoint[valueKey]) }}
      </span>
      <span class="badge" :class="badgeActive">
        {{ formatPercent(activePoint.daily || 0) }}
      </span>
    </div>
    <UiSvgImage
      :style="{
        top: `${activePoint.position?.top}px`,
        left: `${activePoint.position?.left}px`,
      }"
      class="hint-table_tail"
      svg="exclude"
    />
  </div>
</template>

<script setup lang="ts">
// Types
interface ActivePoint {
  [key: string]: any
  position?: {
    top: string
    left: string
  }
  createdAt?: string
  daily?: number
}

// Props
interface Props {
  activePoint: ActivePoint | null
  currency?: string
  valueKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'usd',
  valueKey: 'value'
})

// Composables
const { $filters } = useNuxtApp()

// Refs
const hintContent = ref<HTMLElement>()
const isReversed = ref(false)
const hintContentLeft = ref<number | null>(null)

// Computed
const badgeActive = computed(() => {
  const priceDiffPercent = props.activePoint?.daily || 0
  return priceDiffPercent < 0
    ? 'negative'
    : priceDiffPercent > 0
      ? 'positive'
      : ''
})

// Methods
const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  return $filters.toDate?.(dateString) || new Date(dateString).toLocaleDateString()
}

const formatPercent = (value: number): string => {
  return $filters.toPercent?.(value, { minimumFractionDigits: 4 }) || `${value}%`
}

const formatCurrency = (value: number): string => {
  return $filters.toCurrency?.(value, { minimumFractionDigits: 4 }) || value.toString()
}

const getHintContentLeft = (): number => {
  if (!hintContent.value || !props.activePoint?.position?.left) {
    return 0
  }

  const elemWidth = hintContent.value.offsetWidth
  const svgGraphWidth = hintContent.value.closest('.UiChart')?.clientWidth || 0
  const pointLeft = parseFloat(props.activePoint.position.left)

  const toLeft = pointLeft + elemWidth - svgGraphWidth - 20

  if (toLeft > 0) {
    return pointLeft - toLeft
  }

  return pointLeft
}

const updateHintPosition = () => {
  hintContentLeft.value = getHintContentLeft()
}

// Watchers
watch(() => props.activePoint, () => {
  if (props.activePoint) {
    nextTick(() => {
      updateHintPosition()
    })
  }
})

// Lifecycle
onMounted(() => {
  updateHintPosition()
})

onUpdated(() => {
  updateHintPosition()
})
</script>

<style scoped>
.hint-table {
  @apply pointer-events-none;
}

.hint-table .hint_content {
  @apply whitespace-nowrap bg-white text-lg p-1 px-3 text-dark rounded flex flex-col;
  transform: translate(-10px, -68px);
  @apply transition-all duration-300 ease-in-out z-10 absolute;
}

.hint-table .hint_content > .badge {
  @apply text-xs;
}

.hint-table .hint_content .badge_time {
  @apply text-gray text-right;
}

.hint-table .hint_content._reversed {
  @apply bg-red;
}

.hint-table .hint-table_tail {
  @apply transition-all duration-300 ease-in-out overflow-hidden absolute;
  transform: translate(-50%, calc(-50% - 3px));
  @apply w-5 h-6 rounded-b-lg z-10;
}

/* Badge color classes */
.negative {
  @apply text-red;
}

.positive {
  @apply text-green;
}
</style>
