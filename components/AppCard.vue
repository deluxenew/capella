<template>
  <div class="AppCard" v-bind="$attrs">
    <slot />
  </div>
</template>

<style >
.AppCard {
  @apply p-5 rounded-lg bg-secondary overflow-hidden;
}
</style>
