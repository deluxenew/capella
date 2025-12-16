<template>
  <div class="dao">
    <div class="px-2">
      <DAOPrices class="mt-2" />
    </div>

    <div class="flex flex-col lg:flex-row px-2 mt-2 wrapper border-t border-border">
      <div class="flex flex-col pt-2 left-column lg:border-r lg:border-border lg:pr-2 flex-[10_8_500px]">
        <AppBalance />
        <DailyRewards />
        <DAOGovernance class="mt-2" />
      </div>

      <div class="pt-3 right-column lg:pl-3 flex-[8_10_360px]">
        <!-- <Converter /> -->
        <DAOPersonalInfo />
        <DAOLiquidityPools class="mt-2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Устанавливаем layout
definePageMeta({
  layout: 'inner'
})

// Composable
const { t } = useI18n()
const { $utils } = useNuxtApp()

// Head
useHead({
  title: computed(() =>
    $utils?.hostToTitle?.(process.client ? window.location.host : '') || 'DAO'
  )
})
</script>

<style scoped>
/* Базовые стили для десктопа */
.dao .wrapper {
  display: flex;
  flex-wrap: wrap;
}

/* Мобильные стили */
@media screen and (max-width: 1015px) {
  .dao .wrapper .left-column {
    padding-right: 0;
    border-right: 0;
    flex: 1 1 100%;
  }

  .dao .wrapper .right-column {
    padding-left: 0;
    flex: 1 1 100%;
  }
}

/* Стили для expanded sidebar на десктопе */
@media screen and (max-width: 1395px) {
  .sidebar_expanded .dao .wrapper .left-column {
    padding-right: 0;
    border-right: 0;
  }

  .sidebar_expanded .dao .wrapper .right-column {
    padding-left: 0;
  }
}

/* Стили для AppBalance на мобильных */
@media screen and (max-width: 660px) {
  .dao :deep(.AppBalance) {
    @apply flex-col;
  }

  .dao :deep(.AppBalance .right) {
    @apply p-0 mt-2;
  }
}

/* Стили для AppBalance с expanded sidebar */
@media screen and (max-width: 980px) {
  .sidebar_expanded .dao :deep(.AppBalance) {
    @apply flex-col;
  }

  .sidebar_expanded .dao :deep(.AppBalance .right) {
    @apply p-0 mt-2;
  }
}
</style>
