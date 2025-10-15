<template>
  <div role="button" class="ui-btn">
    <slot />
  </div>
</template>

<script setup>
defineOptions({
  name: "UiButton"
})
</script>

<style scoped>
.ui-btn {
  @apply inline-flex justify-center items-center w-fit bg-blue text-white font-medium text-base text-center transition duration-300 rounded-xl py-3 px-8;
}

.ui-btn:hover {
  @apply shadow-blue;
}
</style>
