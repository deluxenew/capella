<template>
  <slot v-bind="processedProps" />
</template>

<script setup lang="ts">
interface Props {
  // Динамические пропсы - можно конкретизировать если известны ожидаемые пропсы
 'item-in-sub-page'?: boolean
  [key: string]: any

}

const props = defineProps<Props>()

// Обработка kebab-case в camelCase для slot props
const processedProps = computed(() => {
  const result: Record<string, any> = {}

  Object.keys(props).forEach(key => {
    const camelCaseKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelCaseKey] = props[key]
  })

  return result
})
</script>
