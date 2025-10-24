<template>
  <button
    class="info-button"
    v-bind="filteredAttrs"
    v-on="filteredListeners"
  >
    <UiSvgImage svg="info" />
  </button>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'click', event: MouseEvent): void
}

const emit = defineEmits<Emits>()

// Получаем и фильтруем атрибуты
const attrs = useAttrs()

const filteredAttrs = computed(() => {
  const { class: _, style: __, ...rest } = attrs
  return rest
})

const filteredListeners = computed(() => {
  const listeners: Record<string, any> = {}

  Object.keys(attrs).forEach(key => {
    if (key.startsWith('on')) {
      listeners[key] = (attrs as any)[key]
    }
  })

  return listeners
})
</script>

<style scoped>
.info-button {
  @apply w-4 h-4 rounded-full m-0 p-0 overflow-hidden bg-transparent;
}

.info-button svg {
  @apply w-4 h-4;
}

@media screen and (max-width: 640px) {
  .info-button {
    @apply w-5 h-5;
  }

  .info-button svg {
    @apply w-5 h-5;
  }
}
</style>
