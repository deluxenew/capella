<template>
  <div class="cabinet-page">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'inner',
  auth: true
})
onMounted(async () => {
  await navigateTo('/cabinet/dashboard')
})
</script>

<style scoped>
.cabinet-page {
  min-height: 100vh;
}
</style>
