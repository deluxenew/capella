<template>
  <transition
    name="expand"
    @after-enter="afterEnter"
    @enter="enter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script setup lang="ts">
const afterEnter = (element: HTMLElement) => {
  element.style.height = 'auto'
}

const enter = (element: HTMLElement) => {
  const { width } = getComputedStyle(element)

  element.style.width = width
  element.style.position = 'absolute'
  element.style.visibility = 'hidden'
  element.style.height = 'auto'

  const { height } = getComputedStyle(element)

  element.style.width = ''
  element.style.position = ''
  element.style.visibility = ''
  element.style.height = '0'

  // Force repaint to make sure the animation is triggered correctly.
  getComputedStyle(element).height

  requestAnimationFrame(() => {
    element.style.height = height
  })
}

const leave = (element: HTMLElement) => {
  const { height } = getComputedStyle(element)

  element.style.height = height

  // Force repaint to make sure the animation is triggered correctly.
  getComputedStyle(element).height

  requestAnimationFrame(() => {
    element.style.height = '0'
  })
}
</script>

<style scoped>
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>
