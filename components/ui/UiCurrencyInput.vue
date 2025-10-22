<template>
  <UiInput
    ref="uiInputRef"
    :model-value="formattedValue"
    @update:model-value="handleInput"
    @focusout="handleBlur"
    @keyup.enter="handleBlur"
  >
    <template
      v-for="name in Object.keys($slots)"
      #[name]="slotData"
    >
      <slot :name="name" v-bind="slotData || {}"/>
    </template>
  </UiInput>
</template>

<script setup lang="ts">
import type { CurrencyInputOptions } from 'vue-currency-input'

interface Props {
  modelValue?: number | string | undefined
  value?: number | string | undefined
  currencyOptions?: CurrencyInputOptions
}

interface Emits {
  (e: 'update:modelValue', value: number | undefined): void
  (e: 'numberInput', value: number | undefined): void
  (e: 'blur', value: number | undefined): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  value: undefined,
  currencyOptions: undefined
})

const emit = defineEmits<Emits>()

// Refs
const uiInputRef = ref()
const formattedValue = ref<string>('')
const internalCurrencyOptions = ref<CurrencyInputOptions | undefined>(undefined)

// Computed
const inputElement = computed(() => {
  return uiInputRef.value?.$el?.querySelector('input') || uiInputRef.value?.inputEl
})

// Methods
const handleBlur = () => {
  if (formattedValue.value === '') {
    handleInput('0')
  }
  const numberValue = getNumberValue(formattedValue.value)
  emit('numberInput', numberValue)
  emit('blur', numberValue)
}

const getNumberValue = (value: string): number | undefined => {
  if (!inputElement.value) return undefined

  let numberValue: number | undefined = undefined

  try {
    // Пытаемся использовать vue-currency-input
    if (typeof window !== 'undefined' && (window as any).$ci) {
      numberValue = (window as any).$ci.getValue(inputElement.value)
    } else {
      // Fallback парсинг
      const cleanValue = value.replace(/[^\d.-]/g, '')
      numberValue = cleanValue ? parseFloat(cleanValue) : undefined
    }

    // Применяем ограничения
    if (numberValue !== undefined) {
      const options = props.currencyOptions || internalCurrencyOptions.value
      if (options?.valueRange) {
        const { min, max } = options.valueRange
        if (max !== undefined) numberValue = Math.min(numberValue, max)
        if (min !== undefined) numberValue = Math.max(numberValue, min)
      }
    }
  } catch (error) {
    console.warn('Error parsing currency value:', error)
    numberValue = undefined
  }

  return numberValue
}

const setFormattedValue = (value: number | undefined) => {
  if (!inputElement.value) return

  try {
    if (typeof window !== 'undefined' && (window as any).$ci) {
      (window as any).$ci.setValue(inputElement.value, value)
      formattedValue.value = inputElement.value.value
    } else {
      formattedValue.value = value?.toString() || ''
    }
  } catch (error) {
    console.warn('Error setting currency value:', error)
    formattedValue.value = value?.toString() || ''
  }
}

const handleInput = (value: string) => {
  formattedValue.value = value

  if (value === '') {
    emit('update:modelValue', undefined)
    return
  }

  const numberValue = getNumberValue(value)
  emit('update:modelValue', numberValue)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  setFormattedValue(newValue)
}, { immediate: true })

watch(() => props.value, (newValue) => {
  if (newValue !== props.modelValue) {
    setFormattedValue(newValue)
  }
})

// Lifecycle
onMounted(() => {
  nextTick(() => {
    // Инициализация опций валюты
    if (props.currencyOptions) {
      internalCurrencyOptions.value = props.currencyOptions
    }

    // Устанавливаем начальное значение
    const initialValue = props.modelValue ?? props.value
    setFormattedValue(initialValue)
  })
})

// Expose public methods
defineExpose({
  getNumberValue,
  setFormattedValue,
  handleBlur
})
</script>
