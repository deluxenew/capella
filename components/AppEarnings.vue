<template>
  <div class="AppEarnings mt-4.5">
    <div class="AppEarnings__earn text-gray">
      {{ t('AppYieldCard.will_have', { interval: selectedInterval }) }}
      <div class="AppEarnings__value mt-1 text-lg text-color font-semibold">
        {{ formatCurrency(youWillGet) }}
      </div>
    </div>

    <div ref="svgGraph" class="svgGraph relative">
      <svg
        viewBox="0 0 392 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="pb-2 overflow-visible relative z-2"
      >
        <path
          d="M1 82C88.6087 76.1382 283.018 63.2421 391 1"
          class="stroke-border"
          stroke-width="2"
        />
        <circle
          v-for="item in points"
          :key="`point_${item.value}`"
          :ref="(el) => setPointRef(el as SVGCircleElement, item.value)"
          :cx="item.position.cx"
          :cy="item.position.cy"
          :r="getPointRadius(item.value)"
          class="point transition-all duration-300 cursor-pointer"
          :class="getPointClasses(item.value)"
          @click="selectInterval(item.value)"
        />
      </svg>

      <transition name="fade">
        <div
          v-if="activePoint && linePosition"
          class="lineToButton absolute bottom-0 bg-border w-px z-1 transition-all duration-300"
          :style="linePositionStyle"
        />
      </transition>
    </div>

    <div class="buttons flex justify-between mt-5">
      <UiButton
        v-for="item in points"
        :key="`button_${item.value}`"
        theme="dark"
        size="sm"
        class="relative transition-all duration-200"
        :class="getButtonClasses(item.value)"
        @click="selectInterval(item.value)"
      >
        {{ item.value }}M
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Point {
  position: { cx: number; cy: number }
  value: number
}

interface LinePosition {
  left: number
  height: number
}

interface Props {
  percent: number
  deposit: number
}

const props = defineProps<Props>()

// Composable
const { t } = useI18n()

// Reactive data
const selectedInterval = ref<number>(1)
const refreshKey = ref<boolean>(false)
const svgGraph = ref<HTMLElement>()
const pointRefs = ref<Map<number, SVGCircleElement>>(new Map())

const points: Point[] = [
  { position: { cx: 15, cy: 81 }, value: 1 },
  { position: { cx: 100, cy: 74 }, value: 6 },
  { position: { cx: 190, cy: 62 }, value: 12 },
  { position: { cx: 281, cy: 43 }, value: 24 },
  { position: { cx: 372, cy: 11 }, value: 36 },
]

// Computed
const activePoint = computed(() =>
  points.find(point => point.value === selectedInterval.value)
)

const youWillGet = computed((): number => {
  const months = selectedInterval.value
  let amount = props.deposit

  for (let i = 0; i < months * 30; i++) {
    amount += amount * (props.percent / 365 / 100)
  }

  return amount
})

const linePosition = computed((): LinePosition | null => {
  // Trigger reactivity
  if (refreshKey.value) {}

  if (!activePoint.value) return null

  const pointEl = pointRefs.value.get(activePoint.value.value)
  if (!pointEl) return null

  const elemBound = pointEl.getBoundingClientRect()
  const parentElemBound = svgGraph.value?.getBoundingClientRect()

  if (!elemBound || !parentElemBound) return null

  const left = elemBound.left - parentElemBound.left + elemBound.width / 2
  const height = Math.max(
    0,
    parentElemBound.bottom - elemBound.bottom + elemBound.height / 2
  )

  return { left, height }
})

const linePositionStyle = computed(() => ({
  left: `${linePosition.value?.left}px`,
  height: `${linePosition.value?.height}px`,
  transform: 'translateX(-50%)'
}))

// Methods
const setPointRef = (el: SVGCircleElement | null, value: number) => {
  if (el) {
    pointRefs.value.set(value, el)
  } else {
    pointRefs.value.delete(value)
  }
}

const selectInterval = (value: number) => {
  selectedInterval.value = value
}

const getPointRadius = (value: number): number => {
  return selectedInterval.value === value ? 8 : 4
}

const getPointClasses = (value: number): string[] => {
  const classes = []

  if (selectedInterval.value === value) {
    classes.push('fill-blue', 'stroke-transparent')
  } else {
    classes.push('fill-secondary', 'stroke-color')
  }

  classes.push('hover:fill-blue')

  return classes
}

const getButtonClasses = (value: number): Record<string, boolean> => ({
  'active': selectedInterval.value === value,
  'opacity-100': selectedInterval.value === value,
  'opacity-70': selectedInterval.value !== value
})

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Lifecycle
onMounted(() => {
  if (svgGraph.value && typeof ResizeObserver !== 'undefined') {
    const resizeObserver = new ResizeObserver(() => {
      refreshKey.value = !refreshKey.value
    })

    resizeObserver.observe(svgGraph.value)

    onUnmounted(() => {
      resizeObserver.disconnect()
    })
  }
})

// Watch for prop changes
watch(() => props.deposit, () => {
  // Recalculate when deposit changes
})

watch(() => props.percent, () => {
  // Recalculate when percent changes
})
</script>

<style scoped>
.point {
  transition: all 0.3s ease;
}

.buttons > button:first-of-type {
  margin-left: 1%;
}

.buttons > button:last-of-type {
  margin-right: 1%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom active state for buttons */
.buttons .active {
  @apply bg-blue text-white;
}
</style>
