<template>
  <div
    class="UiInput relative text-color"
    :class="{
      'success-state': isValid && isDirty,
      'error-state': hasError,
      'shake': hasError,
      'append-icon': hasAppendSlot,
      'disabled': disabled,
    }"
  >
    <label
      ref="inputField"
      class="cursor-text"
      @mousedown.prevent.stop
      @click="focusInput"
    >
      <span class="UiInput__name text-xs text-gray whitespace-nowrap">
        {{ label }}
      </span>
    </label>

    <div
      class="UiInput_inputField relative z-2 bg-secondary text-base w-full border border-border rounded mt-2 flex items-center transition-colors duration-200"
      :style="{ height }"
      :class="{
        'border-green': isValid && isDirty,
        'border-red': hasError,
      }"
    >
      <slot>
        <input
          ref="input"
          :value="fieldValue"
          :form="form"
          :disabled="disabled"
          :type="type"
          :min="min"
          :max="max"
          class="h-full w-full text-inherit bg-transparent px-5 py-3 outline-none"
          v-bind="filteredAttrs"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keypress="$emit('keypress', $event)"
        />
      </slot>
      <slot name="append" />
    </div>

    <div v-if="hint" class="hintText mt-1 h-4 text-xs text-gray z-1">
      <transition name="slide-y">
        <div v-if="isFocus || hasError">{{ hint }}</div>
      </transition>
    </div>

    <div class="mt-0.25">
      <UiTransitionExpand>
        <div v-if="errorMessage" class="UiInput__errors text-xs text-red">
          {{ errorMessage }}
        </div>
      </UiTransitionExpand>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'

interface Props {
  label?: string | number
  height?: string
  modelValue?: string | number
  value?: string | number
  hint?: string
  disabled?: boolean
  type?: string
  form?: string
  min?: string | number
  max?: string | number
  name?: string // для vee-validate
  rules?: string // для vee-validate
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void // Fixed: should be string | number, not just number
  (e: 'input', value: string | number): void
  (e: 'focus', event: Event): void
  (e: 'blur', event: Event): void
  (e: 'keypress', event: KeyboardEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  height: '50px',
  modelValue: '',
  value: '',
  hint: '',
  disabled: false,
  type: 'text',
  form: undefined,
  min: undefined,
  max: undefined,
  name: '',
  rules: ''
})

const emit = defineEmits<Emits>()

// VeeValidate field
const { value: fieldValue, handleChange, handleBlur, errorMessage, meta, validate } = useField(
  () => props.name,
  props.rules,
  {
    initialValue: props.modelValue || props.value,
    validateOnValueUpdate: false
  }
)

// Refs
const input = ref<HTMLInputElement>()
const inputField = ref<HTMLElement>()
const isFocus = ref(false)

// Computed
const hasAppendSlot = computed(() => {
  return !!useSlots().append
})

const filteredAttrs = computed(() => {
  const { class: _, style: __, ...rest } = useAttrs()
  return rest
})

const hasError = computed(() => !!errorMessage.value)
const isValid = computed(() => meta.valid)
const isDirty = computed(() => meta.dirty)

// Methods
const focusInput = () => {
  input.value?.focus()
}

const onBlur = (event: Event) => {
  isFocus.value = false
  handleBlur() // Use VeeValidate's handleBlur instead of modifying meta directly
  emit('blur', event)
}

const onFocus = (event: Event) => {
  isFocus.value = true
  emit('focus', event)
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  // Use VeeValidate's handleChange to properly update the field value
  handleChange(target.value)
  emit('update:modelValue', target.value) // Fixed: emit the correct value
  emit('input', target.value)
}

// Watch for external value changes - sync vee-validate field with props
watch(() => props.modelValue, (newValue) => {
  if (newValue !== fieldValue.value) {
    handleChange(newValue) // Use handleChange instead of direct assignment
  }
}, { immediate: true })

// Expose methods
defineExpose({
  focus: focusInput,
  blur: () => input.value?.blur(),
  validate: () => validate()
})
</script>

<style scoped>
/* Same styles as above */
.disabled .UiInput_inputField {
  border-style: dashed;
  opacity: 0.6;
}

.shake .UiInput_inputField {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.slide-y-enter-active,
.slide-y-leave-active {
  transition: transform 0.3s ease;
}

.slide-y-enter-from,
.slide-y-leave-to {
  transform: translateY(-100%);
}
</style>
