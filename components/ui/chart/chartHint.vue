<template>
  <div v-if="activePoint" class="hint-table">
    <div
      ref="hint_content"
      class="hint_content"
      :class="{ _reversed: isReversed }"
      :style="{
        top: `${activePoint.position.top}px`,
        left: `${hintContentLeft}px`,
      }"
    >
      <span class="badge_time">{{ activePoint.createdAt | toDate }}</span>
      <span v-if="currency==='percent'">{{
        activePoint[valueKey]
          | toPercent({ minimumFractionDigits: 4 })
      }}</span>
      <span v-else>{{
          activePoint[valueKey]
            | toCurrency({
            minimumFractionDigits: 4,
          })
        }}</span>
      <span class="badge" :class="badgeActive">
        {{ (activePoint.daily || 0) | toPercent({ minimumFractionDigits: 4 }) }}
      </span>
    </div>
    <UiSvgImage
      :style="{
        top: `${activePoint.position.top}px`,
        left: `${activePoint.position.left}px`,
      }"
      class="hint-table_tail"
      svg="exclude"
    />
  </div>
</template>

<script>
// let interval
/* eslint-disable no-unused-vars */
export default {
  props: {
    activePoint: {
      type: Object,
      required: true,
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
      isReversed: false,
      hintContentLeft: null,
    }
  },
  computed: {
    badgeActive() {
      const priceDiffPercent = this.activePoint.daily
      return priceDiffPercent < 0
        ? 'negative'
        : priceDiffPercent > 0
        ? 'positive'
        : ''
    },
  },
  watch: {
    activePoint() {
      if (this.activePoint) {
        this.$options.filters.toCurrency({
          value: this.activePoint[this.valueKey],
          currency: 'usd',
        })
        /*if(this.currency === "percent"){
          console.log(this.activePoint[this.valueKey])
          this.$options.filters.toPercent(
            this.activePoint[this.valueKey],
          )
        }else{
          this.$options.filters.toCurrency({
            value: this.activePoint[this.valueKey],
            currency: 'usd',
          })
        }*/

      }
    },
  },
  updated() {
    this.hintContentLeft = this.getHintContentLeft()
  },
  mounted() {
    this.hintContentLeft = this.getHintContentLeft()
  },
  methods: {
    getHintContentLeft() {
      const elemWidth = this.$refs.hint_content?.offsetWidth
      const svgGraphWidth = this.$parent.$refs.chart.clientWidth
      const toLeft =
        +this.activePoint.position.left + elemWidth - svgGraphWidth - 20
      if (toLeft > 0) {
        return +this.activePoint.position.left - toLeft
      }
      return this.activePoint.position.left
    },
  },
}
</script>

<style lang="scss" scoped>
.hint-table {
  pointer-events: none;
  .hint_content {
    white-space: nowrap;
    background-color: $color_white;
    font-size: 18px;
    padding: 6px 14px;
    // padding-top: 16px;
    color: $color_dark;
    border-radius: 6px;
    position: absolute;
    display: flex;
    flex-direction: column;

    transition: top 0.3s ease, left 0.3s ease, opacity 0.2s ease;
    z-index: 10;

    transform: translate(-10px, -68px);
    & > .badge {
      font-size: 12px;
    }
    .badge_time {
      font-size: 9px;
      color: $color_gray;
      text-align: right;
    }
    &_reversed {
      background: red;
    }
  }
  .hint-table_tail {
    transition: all 0.3s ease;
    overflow: hidden;
    position: absolute;
    transform: translate(-50%, calc(-50% - 3px));
    width: 20px;
    height: 27px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    z-index: 10;
  }
}
</style>
