<template>
  <VueFinalModal
    class="UiModal"
    v-bind="$attrs"
    v-on="getEventListeners()"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
  >
    <template
      v-for="(_, name) in $slots"
      #[name]="slotData"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useAttrs } from 'vue'

interface Props {
  disableBodyScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disableBodyScroll: true
})

const attrs = useAttrs()

// Emits для обработки событий
const emit = defineEmits<{
  (e: 'before-open'): void
  (e: 'before-close'): void
}>()

// Methods
const bodyScrollOn = (): void => {
  document.body.style.overflow = ''
}

const bodyScrollOff = (): void => {
  document.body.style.overflow = 'hidden'
}

const handleBeforeOpen = (): void => {
  if (props.disableBodyScroll) {
    bodyScrollOff()
  }
  emit('before-open')
}

const handleBeforeClose = (): void => {
  if (props.disableBodyScroll) {
    bodyScrollOn()
  }
  emit('before-close')
}

// Получаем все обработчики событий из attrs
const getEventListeners = () => {
  const listeners: Record<string, any> = {}
  Object.keys(attrs).forEach(key => {
    if (key.startsWith('on') && typeof attrs[key] === 'function') {
      listeners[key] = attrs[key]
    }
  })
  return listeners
}
</script>

<style scoped>
.UiModal {
  color: var(--color);
}
</style>

<style>
.UiModal .header {
  @apply text-lg mb-4 font-semibold flex items-center;
}

.UiModal .content {
  @apply p-5 px-7 h-full;
}

/* VueJS Modal default styles customization */
.UiModal.vm--container {
  @apply flex items-center justify-center;
}

.UiModal .vm--modal {
  @apply bg-white dark:bg-dark rounded-lg overflow-hidden;
  color: var(--color);
}

.UiModal .vm--overlay {
  @apply bg-black bg-opacity-50;
}
</style>
