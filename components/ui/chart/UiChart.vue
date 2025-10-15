<template>
  <div ref="UiChart" class="UiChart" :class="{ UiChart_gradient: gradient }">
    <svg
      ref="chart"
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
          :ref="`point_${index}`"
          :key="`circle_${index}`"
          :cy="item.cy"
          :cx="item.cx"
          :r="pointRadius"
          :value="item[valueKey]"
          :class="{
            point_active: index == activeElementKey,
            point_startDay: item.dayStart,
          }"
          :style="{ fill: index == activeElementKey ? color : '' }"
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
    <ChartHint
      v-if="activePoint"
      :active-point="activePoint"
      :currency="currency"
      :value-key="valueKey"
    />
  </div>
</template>

<script>
import ChartHint from './chartHint.vue'

const { t } = useI18n()

export default {
  components: { ChartHint },
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    color: {
      type: String,
      default: '#4276F6',
    },
    gradient: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
  },
  data() {
    return {
      myPoints: [],
      activeElementKey: null,
      myGradientPoints: [],
    }
  },
  computed: {
    pointStartDay() {
      return this.myPoints?.find((point) => point.dayStart)
    },
    pointRadius() {
      return 4
    },
    linePoints() {
      return this.myPoints?.map((el) => `${el.cx} ${el.cy}`)
    },
    svgElement() {
      return this.$refs.chart
    },
    offsetBetweenPoints() {
      return this.svgElement.clientWidth / (this.myPoints.length - 1)
    },
    activePoint() {
      if (this.activeElementKey || this.activeElementKey === 0) {
        const activePointElement =
          this.$refs[`point_${this.activeElementKey}`]?.[0]

        // eslint-disable-next-line no-unused-vars
        const position = {
          left: activePointElement?.getAttribute('cx'),
          top: activePointElement?.getAttribute('cy'),
        }
        const obj = this.myPoints[this.activeElementKey]
        if (obj) obj.position = position
        return obj
      }
      return null
    },
  },
  watch: {
    items: {
      handler() {
        this.myPoints = this.getPoints()
      },
      deep: true,
    },
    myPoints() {
      if (this.gradient) {
        const width = this.svgElement?.clientWidth
        const height = this.svgElement?.clientHeight

        //  Последняя точка это нижний левый угол заканчивается рисовка на нем, перед этим нижний правый угол
        this.myGradientPoints = this.myGradientPoints = [
          ...this.linePoints,
          `${width} ${height}`,
          `0 ${height} `,
        ]
      }
    },
  },
  mounted() {
    const element = this.$refs.UiChart

    // Если ресайз блока, перестроить точки
    new ResizeObserver(() => (this.myPoints = this.getPoints())).observe(
      element
    )
  },
  methods: {
    getPoints() {
      let minPoint = Infinity
      let maxPoint = -Infinity
      this.items?.forEach((element) => {
        if (element[this.valueKey] <= minPoint)
          minPoint = element[this.valueKey]
        if (element[this.valueKey] >= maxPoint)
          maxPoint = element[this.valueKey]
      })
      const width = this.svgElement?.clientWidth
      const height = this.svgElement?.clientHeight - (this.gradient ? 44 : 0) // 44 - margin bottom for gradient

      const arrayLength = this.items?.length - 1
      return this.items?.map((element, i) => {
        let cx = (width / arrayLength) * i

        let cy =
          ((height *
            (100 / (maxPoint - minPoint)) *
            (element[this.valueKey] - maxPoint)) /
            100) *
            -1 +
            2 || height

        cx = Math.floor(cx, 2)
        cy = Math.floor(cy, 2)
        return {
          cx,
          cy,
          ...element,
        }
      })
    },
    setActivePoint($event) {
      const parrent = this.svgElement?.parentElement
      const bounds = parrent.getBoundingClientRect()
      const x = $event.clientX + 1 - bounds.left
      this.activeElementKey = Math.round(x / this.offsetBetweenPoints)
    },
  },
}
</script>

<style lang="scss">
.UiChart {
  &.UiChart_gradient {
    margin-bottom: -30px;
  }
  .UiChart__gradient {
    position: absolute;
    height: 100%;
    width: 100%;
    pointer-events: none;
    overflow: hidden;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    .gradient_stop {
      stop-color: var(--bg-secondary);
    }
  }
  position: relative;
  max-height: 100%;
  height: 100%;
  pointer-events: default;
  overflow: unset;
  svg {
    width: 100%;
    overflow: inherit;
    display: block;
    float: left;
    .lineSeparator {
      opacity: 0;
      transition: opacity 0.3s ease;
      stroke-width: 1;
      stroke: $color_gray;
      pointer-events: none;
      text {
        stroke-width: 0;
        fill: $color_gray;
        font-size: 10px;
        transform: translateX(-20px);
      }
    }
    &:hover .lineSeparator {
      opacity: 1;
    }
    .UiChart__point {
      &.point_active {
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
