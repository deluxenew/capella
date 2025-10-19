<template>
  <div ref="containerRef" class="pool-select flex flex-col mb-4.5">
    <div class="select-wrap">
      <span class="label text-xs text-gray leading-3.75">
        Choose Pool
      </span>

      <div class="select w-full border border-border rounded mt-1.75 flex items-center relative h-12.5 bg-bg">
        <!-- Selected Item -->
        <UiPoolSelectItem
          v-if="!isOpen"
          :title="selectedPool.title"
          :color="selectedPool.color"
          :pool="selectedPool.pool"
          class="flex-1 px-3"
          @click="isOpen = true"
        />

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="dropdown z-99 bg-bg rounded border border-border absolute top-full left-0 right-0 mt-1 shadow-lg max-h-60 overflow-y-auto"
          >
            <UiPoolSelectItem
              v-for="pool in pools"
              :key="pool.pool"
              class="dropdown-item border-b border-border last:border-b-0 cursor-pointer transition-colors duration-200 hover:bg-secondary"
              :title="pool.title"
              :color="pool.color"
              :pool="pool.pool"
              @click="selectPool(pool.pool)"
            />
          </div>
        </Transition>

        <!-- Toggle Button -->
        <UiButton
          size="sm"
          theme="transparent"
          class="custom-select-btn absolute right-2.5 p-1 flex items-center"
          inset
          @click="toggleDropdown"
        >
          <UiSvgImage
            :svg="isOpen ? 'arrow_up' : 'arrow_down'"
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
          />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Pool {
  pool: string
  title: string
  color: string
}

interface Props {
  pools: Pool[]
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'select', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'stable'
})

const emit = defineEmits<Emits>()

// Refs
const isOpen = ref(false)
const selected = ref(props.modelValue)
const containerRef = ref<HTMLElement>()

// Computed
const selectedPool = computed(() => {
  return props.pools.find(pool => pool.pool === selected.value) || props.pools[0]
})

// Methods
const selectPool = (pool: string) => {
  selected.value = pool
  emit('update:modelValue', pool)
  emit('select', pool)
  closeDropdown()
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue !== selected.value) {
    selected.value = newValue
  }
})

// Click outside handler
const handleClickOutside = (event: Event) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (event.key) {
    case 'Escape':
      closeDropdown()
      break
    case 'ArrowDown':
      event.preventDefault()
      navigateDropdown(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      navigateDropdown(-1)
      break
  }
}

const navigateDropdown = (direction: number) => {
  const currentIndex = props.pools.findIndex(pool => pool.pool === selected.value)
  const nextIndex = (currentIndex + direction + props.pools.length) % props.pools.length
  selected.value = props.pools[nextIndex].pool
}

// Expose methods if needed
defineExpose({
  open: () => isOpen.value = true,
  close: closeDropdown,
  toggle: toggleDropdown
})
</script>

<style scoped>
.dropdown {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.DEFAULT') theme('colors.border-color');
}

.dropdown::-webkit-scrollbar {
  width: 6px;
}

.dropdown::-webkit-scrollbar-track {
  background: theme('colors.border-color');
  border-radius: 3px;
}

.dropdown::-webkit-scrollbar-thumb {
  background: theme('colors.gray.DEFAULT');
  border-radius: 3px;
}
</style>
