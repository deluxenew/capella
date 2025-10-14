<template>
  <div
    class="relative text-left outline-none min-w-32"
    :tabindex="tabindex"
    @blur="open = false"
  >
    <div
      class="flex items-center justify-between bg-transparent text-gray-400 cursor-pointer py-2 px-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-200"
      :class="{ 'border-blue-500 text-white': open }"
      @click="toggleOpen"
    >
      <span>{{ selected }}</span>
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <div
      v-if="open"
      class="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 mt-1 max-h-60 overflow-y-auto"
    >
      <div
        v-for="(option, i) in options"
        :key="i"
        class="px-3 py-2 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-150"
        :class="{ 'bg-gray-700 text-white': selected === option }"
        @click="selectOption(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Interface for component props
interface UiSelectProps {
  options: string[]
  default?: string
  tabindex?: number
}

// Define props with TypeScript
const props = withDefaults(defineProps<UiSelectProps>(), {
  default: '',
  tabindex: 0
})

// Define emits with TypeScript
interface UiSelectEmits {
  (e: 'input', value: string): void
}

const emit = defineEmits<UiSelectEmits>()

// Reactive data
const selected = ref<string>(props.default || props.options[0] || '')
const open = ref<boolean>(false)

// Methods
const toggleOpen = (): void => {
  open.value = !open.value
}

const selectOption = (option: string): void => {
  selected.value = option
  open.value = false
  emit('input', option)
}

// Lifecycle
onMounted((): void => {
  if (selected.value) {
    emit('input', selected.value)
  }
})
</script>
