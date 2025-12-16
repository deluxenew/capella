<template>
  <div class="cabinet-page">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Устанавливаем layout
definePageMeta({
  layout: 'inner',
  // middleware: ['auth'] // если нужен middleware
})

// Composable
const { $utils } = useNuxtApp()

// Head
useSeoMeta({
  title: computed(() =>
    $utils?.hostToTitle?.(process.client ? window?.location?.host : '') || 'Cabinet'
  ),
  description: 'User cabinet dashboard'
})

// Можно добавить дополнительную логику для cabinet страницы
const route = useRoute()

// Например, отслеживание изменения роута
watch(() => route.path, (newPath) => {
  console.log('Cabinet route changed:', newPath)
})
</script>

<style scoped>
.cabinet-page {
  min-height: 100vh;
}
</style>
