<template>
  <div class="AppCard" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.AppCard {
  @apply p-5 rounded-lg bg-bg-secondary overflow-hidden;
}
</style>
