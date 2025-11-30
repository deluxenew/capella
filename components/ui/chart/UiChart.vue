<template>
  <div ref="chartContainer" class="UiChart" :class="{ 'UiChart_gradient': gradient }">
    <svg
      ref="chartSvg"
      width="100%"
      height="100%"
      @mouseleave="activeElementKey = null"
      @mousemove="setActivePoint($event)"
    >
      <!-- Добавляем фон для градиента -->
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="color" stop-opacity="0.3" />
          <stop offset="100%" stop-color="var(--bg-secondary)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Градиентная заливка -->
      <path
        v-if="gradient"
        :d="gradientPath"
        fill="url(#chartGradient)"
        class="UiChart__gradient-area"
      />

      <!-- Линия графика -->
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

// Computed
const pointStartDay = computed(() => {
  return myPoints.value?.find((point) => point.dayStart)
})

const pointRadius = computed(() => 4)

const linePoints = computed(() => {
  return (myPoints.value?.map((el) => `${el.cx} ${el.cy}`) || []).join(' ')
})

const gradientPath = computed(() => {
  if (!myPoints.value.length || !chartSvg.value) return ''

  const points = myPoints.value
  const height = chartSvg.value.clientHeight
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]

  if (!firstPoint || !lastPoint) return ''

  // Создаем path для градиентной заливки
  let path = `M ${firstPoint.cx} ${firstPoint.cy}`

  // Добавляем точки линии
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].cx} ${points[i].cy}`
  }

  // Замыкаем path до нижнего правого угла и нижнего левого угла
  path += ` L ${lastPoint.cx} ${height} L ${firstPoint.cx} ${height} Z`

  return path
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
  const height = chartSvg.value.clientHeight
  const arrayLength = Math.max(props.items.length - 1, 1)

  return props.items.map((element, i) => {
    let cx = (width / arrayLength) * i

    const valueRange = maxPoint - minPoint
    const normalizedValue = valueRange > 0
      ? (element[props.valueKey] - minPoint) / valueRange
      : 0.5

    let cy = height - (normalizedValue * height)

    // Добавляем небольшой отступ сверху и снизу для лучшего отображения
    const padding = 4
    cy = Math.max(padding, Math.min(cy, height - padding))

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
}

// Watchers
watch(() => props.items, () => {
  updatePoints()
}, { deep: true })

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
  height: 100px;
  @apply relative max-h-full pointer-events-auto overflow-visible;
}

.UiChart__gradient-area {
  @apply pointer-events-none;
}

.UiChart svg {
  @apply w-full overflow-visible block;
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
