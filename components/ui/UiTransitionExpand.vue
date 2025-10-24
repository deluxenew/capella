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
const afterEnter = (element: Element) => {
  const el = element as HTMLElement
  el.style.height = 'auto'
}
const enter = (element: Element, done: () => void) => {
  const { width } = getComputedStyle(element)
  const el = element as HTMLElement
  el.style.width = width
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.style.height = 'auto'

  const { height } = getComputedStyle(element)

  el.style.width = ''
  el.style.position = ''
  el.style.visibility = ''
  el.style.height = '0'

  // Force repaint to make sure the animation is triggered correctly.
  getComputedStyle(element).height

  requestAnimationFrame(() => {
    el.style.height = height
  })
  done()
}

const leave = (element: Element) => {
  const { height } = getComputedStyle(element)
  const el = element as HTMLElement
  el.style.height = height

  // Force repaint to make sure the animation is triggered correctly.
  getComputedStyle(element).height

  requestAnimationFrame(() => {
    el.style.height = '0'
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
