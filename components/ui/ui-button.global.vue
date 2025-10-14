<template>
  <button
      class="ui-btn"
      @click="handleClick"
      v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Define props
interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

// Define emits
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Computed classes
const buttonClasses = computed(() => [
  'inline-flex justify-center items-center w-fit bg-blue-500 text-white rounded-lg font-medium text-sm text-center transition-all duration-300 px-6 py-3',
  props.disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer hover:shadow-lg hover:shadow-blue-500/40 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
])

// Click handler
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>