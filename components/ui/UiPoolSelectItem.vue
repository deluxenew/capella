<template>
  <div
    class="pool-select-item"
    :class="computedClasses"
    v-bind="accessibilityAttributes"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <div
      class="indicator"
      :style="indicatorStyle"
    ></div>
    <div class="title">
      {{ title }}
    </div>
    <div
      v-if="$slots.default"
      class="content"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  color?: string
  pool: string
  disabled?: boolean
  selected?: boolean
  size?: 'sm' | 'md' | 'lg'
}

interface Emits {
  (e: 'select', pool: string): void
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Stable Pool',
  color: '#4276F6',
  disabled: false,
  selected: false,
  size: 'md'
})

const emit = defineEmits<Emits>()

// Computed
const indicatorStyle = computed(() => ({
  backgroundColor: props.color,
  opacity: props.disabled ? 0.5 : 1
}))

const computedClasses = computed(() => [
  'flex flex-row flex-1 items-center cursor-pointer transition-all duration-200',
  'px-2 py-1', // default padding
  {
    'h-10': props.size === 'sm',
    'h-12': props.size === 'md',
    'h-15': props.size === 'lg',
    'opacity-50 cursor-not-allowed': props.disabled,
    'bg-secondary': props.selected,
    'hover:bg-secondary': !props.disabled && !props.selected
  }
])

const accessibilityAttributes = computed(() => ({
  'aria-label': `${props.title} pool option`,
  'aria-disabled': props.disabled,
  'aria-selected': props.selected,
  'role': 'option',
  'tabindex': props.disabled ? -1 : 0
}))

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('select', props.pool)
  emit('click', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select', props.pool)
  }
}
</script>

<style scoped>
.pool-select-item {
  outline: none;
}

.pool-select-item:focus-visible {
  outline: 2px solid var(--color);
  outline-offset: -2px;
}

.indicator {
  height: 20px;
  width: 10px;
  margin-right: 10px;
  border-radius: 4px;
  flex-shrink: 0;
}

.title {
  font-size: 18px;
  line-height: 22px;
  color: var(--color);
}

/* Size variants */
.pool-select-item.size-sm .title {
  font-size: 14px;
  line-height: 18px;
}

.pool-select-item.size-lg .title {
  font-size: 20px;
  line-height: 24px;
}
</style>
