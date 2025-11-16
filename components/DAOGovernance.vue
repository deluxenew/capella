<template>
  <AppCard class="governance text-center p-4">
    <p class="text-base font-medium mb-2">{{ t('governance') }}</p>
    <p class="text-gray text-sm">{{ t('coming_soon') }}</p>
  </AppCard>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
/* Дополнительные стили если нужны */
.governance {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
