<script setup lang="ts">
import { nextTick } from 'vue';

defineProps<{
  opened: boolean;
}>();

const on = {
  beforeEnter(el: HTMLElement) {
    // Ensure consistent initial state
    el.style.height = '0';
    el.style.overflow = 'hidden';
    el.style.opacity = '0'; // Optional: for smoother start
  },

  enter(el: HTMLElement, done: () => void) {
    // Force layout to ensure styles are applied
    void el.offsetHeight;

    // Temporarily remove transitions to measure natural height
    const originalTransition = el.style.transition;
    el.style.transition = 'none';
    el.style.height = 'auto';

    const fullHeight = getComputedStyle(el).height;
    el.style.height = '0'; // Reset to 0 before animation
    el.style.opacity = '0';

    // Re-apply transition and trigger reflow
    el.style.transition = originalTransition || '';
    void el.offsetHeight; // Trigger reflow

    // Start animation
    requestAnimationFrame(() => {
      el.style.height = fullHeight;
      el.style.opacity = '1';

      // Listen for transition end event instead of using timeout
      const handleTransitionEnd = (e: TransitionEvent) => {
        if (e.target === el && e.propertyName === 'height') {
          el.removeEventListener('transitionend', handleTransitionEnd);
          done();
        }
      };

      el.addEventListener('transitionend', handleTransitionEnd);
    });
  },

  afterEnter(el: HTMLElement) {
    // Final state cleanup - height can be auto now
    el.style.height = 'auto';
    el.style.overflow = '';
    el.style.opacity = '';
  },

  leave(el: HTMLElement, done: () => void) {
    // Capture current height to animate from
    const fullHeight = getComputedStyle(el).height;
    el.style.height = fullHeight;
    el.style.overflow = 'hidden';

    // Force reflow
    void el.offsetHeight;

    requestAnimationFrame(() => {
      el.style.height = '0';
      el.style.opacity = '0';

      // Listen for transition end event
      const handleTransitionEnd = (e: TransitionEvent) => {
        if (e.target === el && e.propertyName === 'height') {
          el.removeEventListener('transitionend', handleTransitionEnd);
          done();
        }
      };

      el.addEventListener('transitionend', handleTransitionEnd);
    });
  },

  afterLeave(el: HTMLElement) {
    // Reset all styles after leaving
    el.style.height = '';
    el.style.overflow = '';
    el.style.opacity = '';
  }
};
</script>

<template>
  <Transition
    name="expand"
    @before-enter="(el) => on.beforeEnter(el as HTMLElement)"
    @enter="(el, done) => on.enter(el as HTMLElement, done)"
    @after-enter="(el) => on.afterEnter(el as HTMLElement)"
    @leave="(el, done) => on.leave(el as HTMLElement, done)"
    @after-leave="(el) => on.afterLeave(el as HTMLElement)"
  >
    <div v-show="opened">
      <slot />
    </div>
  </Transition>
</template>

<style>
.expand-enter-active,
.expand-leave-active {
  transition:
    height 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  height: 0 !important;
  opacity: 0;
}

/* Prevent child elements from inheriting unwanted transitions */
.expand-enter-active > *,
.expand-leave-active > * {
  transition: none !important;
}
</style>
