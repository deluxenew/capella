<template>
  <div class="AppLoader flex w-full gap-5 justify-center py-1">
    <span
      v-for="(item, index) in 4"
      :key="index"
      class="rounded-full bg-blue animate-bounce-loader"
      :class="`delay-${(index + 1) * 100}`"
      :style="{
        width: size,
        height: size,
        backgroundColor: color
      }"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '15px',
  color: 'rgb(66, 118, 246)'
})
</script>
