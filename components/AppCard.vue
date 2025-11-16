<template>
  <div class="AppCard" v-bind="$attrs">
    <slot />
  </div>
</template>

<style scoped>
.AppCard {
  @apply p-2 rounded-lg bg-secondary overflow-hidden;
}
</style>
