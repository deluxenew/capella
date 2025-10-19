<template>
  <div class="UiSlider w-full">
    <label class="relative block" :class="{ 'pointer-events-none opacity-50': disabled }">
      <input
        ref="sliderInput"
        class="UiSlider_input appearance-none w-full h-2 bg-onyx rounded-lg outline-none cursor-pointer relative z-2"
        :class="sliderClasses"
        :value="internalValue"
        type="range"
        :min="0"
        :max="100"
        :step="step"
        :disabled="disabled"
        v-bind="filteredAttrs"
        @input="handleInput"
        @change="handleChange"
      />

      <!-- Custom progress track -->
      <div
        class="absolute top-1/2 left-0 h-0.5 bg-blue rounded-lg z-1 -translate-y-1/2 pointer-events-none"
        :style="{ width: `${internalValue}%` }"
      ></div>
    </label>

    <div class="UiSliderLabels relative h-2.5 ml-1 mt-0.5 flex">
      <button
        v-for="(item, index) in labels"
        :key="index"
        type="button"
        class="UiSlider_label absolute text-xs text-gray cursor-pointer transform -translate-x-1/2 min-w-5 transition-colors"
        :class="{
          'text-blue': internalValue >= item,
          'cursor-default': disabled
        }"
        :style="{ left: `${item}%` }"
        :disabled="disabled"
        @click="setValue(item)"
      >
        {{ item }}%
      </button>
    </div>

    <!-- Value display -->
    <div v-if="showValue" class="text-xs text-gray mt-1 text-center">
      {{ Math.round((internalValue * max) / 100) }} / {{ max }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: number
  value?: number
  max?: number
  min?: number
  step?: number
  labels?: number[]
  disabled?: boolean
  showValue?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number): void
  (e: 'input', value: number): void
  (e: 'change', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  value: 0,
  max: 100,
  min: 0,
  step: 5,
  labels: () => [0, 25, 50, 75, 100],
  disabled: false,
  showValue: false
})

const emit = defineEmits<Emits>()

// Refs
const sliderInput = ref<HTMLInputElement>()

// Computed
const filteredAttrs = computed(() => {
  const { class: _, style: __, ...rest } = useAttrs()
  return rest
})

const internalValue = computed({
  get: () => {
    const value = props.modelValue || props.value
    return Math.round((value / props.max) * 100)
  },
  set: (percentValue) => {
    const actualValue = Math.round((percentValue * props.max) / 100)
    emit('update:modelValue', actualValue)
    emit('input', actualValue)
  }
})

const sliderClasses = computed(() => ({
  'cursor-default': props.disabled
}))

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  internalValue.value = Number(target.value)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  internalValue.value = Number(target.value)
  emit('change', (Number(target.value) * props.max) / 100)
}

const setValue = (percentValue: number) => {
  if (props.disabled) return
  internalValue.value = percentValue
  emit('change', (percentValue * props.max) / 100)
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    const percentValue = Math.round((newValue / props.max) * 100)
    if (sliderInput.value && Number(sliderInput.value.value) !== percentValue) {
      sliderInput.value.value = percentValue.toString()
    }
  }
})

// Expose methods
defineExpose({
  focus: () => sliderInput.value?.focus(),
  setValue
})
</script>

<style scoped>
/* Same slider thumb styles as above */
.UiSlider_input::-webkit-slider-thumb {
  @apply appearance-none w-2.5 h-2.5 bg-blue rounded-full border-0 cursor-pointer relative z-10;
  margin-top: -4px;
}

.UiSlider_input:disabled::-webkit-slider-thumb {
  @apply bg-gray cursor-default;
}

.UiSlider_input::-moz-range-thumb {
  @apply appearance-none w-2.5 h-2.5 bg-blue rounded-full border-0 cursor-pointer relative z-10;
}

.UiSlider_input:disabled::-moz-range-thumb {
  @apply bg-gray cursor-default;
}

.UiSlider_input::-ms-thumb {
  @apply appearance-none w-2.5 h-2.5 bg-blue rounded-full border-0 cursor-pointer relative z-10;
}

.UiSlider_input:disabled::-ms-thumb {
  @apply bg-gray cursor-default;
}

/* Track styles */
.UiSlider_input::-webkit-slider-runnable-track {
  @apply w-full h-0.5 bg-transparent rounded-lg cursor-pointer;
}

.UiSlider_input::-moz-range-track {
  @apply w-full h-0.5 bg-transparent rounded-lg cursor-pointer;
  border: none;
}

.UiSlider_input::-ms-track {
  @apply w-full h-0.5 bg-transparent border-transparent cursor-pointer;
}

/* Label positioning */
.UiSliderLabels :first-child {
  transform: translateX(0) !important;
  left: 0 !important;
}

.UiSliderLabels :last-child {
  transform: translateX(0) !important;
  left: auto !important;
  right: 0;
}
</style>

<style>
/* Mobile styles */
@media only screen and (max-width: 600px), (pointer: coarse) {
  .UiSlider_input::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
    margin-top: -10px !important;
  }

  .UiSlider_input::-moz-range-thumb {
    width: 20px;
    height: 20px;
  }

  .UiSlider_input::-ms-thumb {
    width: 20px;
    height: 20px;
  }
}
</style>
