<template>
  <div>

  </div>
</template>

<script setup lang="ts">
// Store автоматически инициализируется через plugin
// но при необходимости можно вызвать инициализацию здесь
const systemStore = useSystemStore()

onMounted(async () => {
  // Дополнительная инициализация если нужно
  // await systemStore.initialize()
})
</script>
