<template>
  <div ref="chartContainer" class="UiChart" :class="{ 'UiChart_gradient': gradient }">
    <svg
      ref="chartSvg"
      width="100%"
      height="100%"
      @mouseleave="activeElementKey = null"
      @mousemove="setActivePoint($event)"
    >
      <polyline
        key="polyline"
        fill="none"
        :stroke="color"
        stroke-width="2"
        :points="linePoints"
      />
      <g class="lineSeparator">
        <line
          v-if="pointStartDay"
          :x1="pointStartDay.cx"
          :x2="pointStartDay.cx"
          y2="52"
          stroke-dasharray="5"
          y1="0"
        />
        <text v-if="pointStartDay" :x="pointStartDay.cx" y="62" class="small">
          {{ t('startDay') }}
        </text>
      </g>
      <g fill="transparent">
        <circle
          v-for="(item, index) in myPoints"
          :ref="setPointRef"
          :key="`circle_${index}`"
          :cy="item.cy"
          :cx="item.cx"
          :r="pointRadius"
          :value="item[valueKey]"
          :class="{
            'point_active': index === activeElementKey,
            'point_startDay': item.dayStart,
          }"
          :style="{ fill: index === activeElementKey ? color : '' }"
          class="UiChart__point"
        />
      </g>
    </svg>
    <svg v-if="gradient" class="UiChart__gradient">
      <polyline
        :points="myGradientPoints"
        fill="url(#Gradient2)"
        fill-opacity="0.3"
      />
      <defs>
        <linearGradient id="Gradient2" x1="10%" y1="40%" x2="30%" y2="100%">
          <stop offset="10%" :stop-color="color" />
          <stop offset="80%" class="gradient_stop" />
        </linearGradient>
      </defs>
    </svg>
    <slot />
    <UiChartHint
      v-if="activePoint"
      :active-point="activePoint"
      :currency="currency"
      :value-key="valueKey"
    />
  </div>
</template>

<script setup lang="ts">
// Types
interface ChartItem {
  [key: string]: any
  dayStart?: boolean
}

interface ChartPoint extends ChartItem {
  cx: number
  cy: number
  position?: { left: string; top: string }
}

// Props
interface Props {
  items?: ChartItem[]
  color?: string
  gradient?: boolean
  currency?: string
  valueKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  color: '#4276F6',
  gradient: false,
  currency: 'usd',
  valueKey: 'value'
})

// Emits
defineEmits<{
  (e: 'point-active', point: ChartPoint | null): void
}>()

// Composables
const { t } = useI18n()

// Refs
const chartContainer = ref<HTMLElement>()
const chartSvg = ref<SVGSVGElement>()
const pointRefs = ref<SVGCircleElement[]>([])
const myPoints = ref<ChartPoint[]>([])
const activeElementKey = ref<number | null>(null)
const myGradientPoints = ref<string[]>([])

// Computed
const pointStartDay = computed(() => {
  return myPoints.value?.find((point) => point.dayStart)
})

const pointRadius = computed(() => 4)

const linePoints = computed(() => {
  return myPoints.value?.map((el) => `${el.cx} ${el.cy}`) || []
})

const offsetBetweenPoints = computed(() => {
  const width = chartSvg.value?.clientWidth || 0
  return width / (Math.max(myPoints.value.length - 1, 1))
})

const activePoint = computed(() => {
  if (activeElementKey.value !== null) {
    const activePointElement = pointRefs.value[activeElementKey.value]

    const position = {
      left: activePointElement?.getAttribute('cx') || '0',
      top: activePointElement?.getAttribute('cy') || '0',
    }

    const obj = myPoints.value[activeElementKey.value]
    if (obj) {
      obj.position = position
    }
    return obj
  }
  return null
})

// Methods
const setPointRef = (el: any) => {
  if (el) {
    pointRefs.value.push(el)
  }
}

const getPoints = (): ChartPoint[] => {
  if (!chartSvg.value || !props.items?.length) return []

  let minPoint = Infinity
  let maxPoint = -Infinity

  props.items.forEach((element) => {
    const value = element[props.valueKey]
    if (value <= minPoint) minPoint = value
    if (value >= maxPoint) maxPoint = value
  })

  const width = chartSvg.value.clientWidth
  const height = chartSvg.value.clientHeight - (props.gradient ? 44 : 0)
  const arrayLength = Math.max(props.items.length - 1, 1)

  return props.items.map((element, i) => {
    let cx = (width / arrayLength) * i

    const valueRange = maxPoint - minPoint
    const normalizedValue = valueRange > 0
      ? (element[props.valueKey] - minPoint) / valueRange
      : 0.5

    let cy = height - (normalizedValue * height) + 2

    cx = Math.floor(cx)
    cy = Math.floor(cy)

    return {
      cx,
      cy,
      ...element,
    }
  })
}

const setActivePoint = (event: MouseEvent) => {
  if (!chartSvg.value?.parentElement) return

  const parent = chartSvg.value.parentElement
  const bounds = parent.getBoundingClientRect()
  const x = event.clientX + 1 - bounds.left

  activeElementKey.value = Math.round(x / offsetBetweenPoints.value)
}

const updatePoints = () => {
  myPoints.value = getPoints()

  if (props.gradient && chartSvg.value) {
    const width = chartSvg.value.clientWidth
    const height = chartSvg.value.clientHeight

    myGradientPoints.value = [
      ...linePoints.value,
      `${width} ${height}`,
      `0 ${height}`,
    ]
  }
}

// Watchers
watch(() => props.items, () => {
  updatePoints()
}, { deep: true })

watch(myPoints, () => {
  if (props.gradient && chartSvg.value) {
    const width = chartSvg.value.clientWidth
    const height = chartSvg.value.clientHeight

    myGradientPoints.value = [
      ...linePoints.value,
      `${width} ${height}`,
      `0 ${height}`,
    ]
  }
})

// Lifecycle
onMounted(() => {
  if (!chartContainer.value) return

  // Resize observer for responsive chart
  const resizeObserver = new ResizeObserver(() => {
    updatePoints()
  })

  resizeObserver.observe(chartContainer.value)

  // Initial points calculation
  nextTick(() => {
    updatePoints()
  })

  // Cleanup
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<style scoped>
.UiChart {
  @apply relative max-h-full h-full pointer-events-auto overflow-visible;
}

.UiChart.UiChart_gradient {
  @apply -mb-7;
}

.UiChart__gradient {
  @apply absolute h-full w-full pointer-events-none overflow-hidden rounded-b-lg;
}

.UiChart__gradient .gradient_stop {
  stop-color: var(--bg-secondary);
}

.UiChart svg {
  @apply w-full overflow-visible block float-left;
}

.UiChart svg .lineSeparator {
  @apply opacity-0 transition-opacity duration-300 ease-in-out stroke-gray pointer-events-none;
}

.UiChart svg .lineSeparator text {
  @apply fill-gray text-xs -translate-x-5;
}

.UiChart svg:hover .lineSeparator {
  @apply opacity-100;
}

.UiChart__point.point_active {
  @apply transition-all duration-300 ease-in-out;
}
</style>
