<template>
  <VueFinalModal
    class="UiModal"
    v-bind="$attrs"
    v-on="getEventListeners()"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
    @closed="handleClosed"
  >
    <template
      v-for="(_, name) in $slots"
      #[name]="slotData"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useAttrs, onUnmounted } from 'vue'

interface Props {
  disableBodyScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disableBodyScroll: true
})

const attrs = useAttrs()

// Emits для обработки событий
const emit = defineEmits<{
  (e: 'before-open'): void
  (e: 'before-close'): void
}>()

// Methods
const bodyScrollOn = (): void => {
  document.body.style.overflow = ''
}

const bodyScrollOff = (): void => {
  document.body.style.overflow = 'hidden'
}

const handleBeforeOpen = (): void => {
  if (props.disableBodyScroll) {
    bodyScrollOff()
  }
  emit('before-open')
}

const handleBeforeClose = (): void => {
  emit('before-close')
}

const handleClosed = (): void => {
  // Гарантированно восстанавливаем скролл при полном закрытии
  if (props.disableBodyScroll) {
    bodyScrollOn()
  }
}

// Восстанавливаем скролл при размонтировании компонента (на всякий случай)
onUnmounted(() => {
  if (props.disableBodyScroll) {
    bodyScrollOn()
  }
})

// Получаем все обработчики событий из attrs
const getEventListeners = () => {
  const listeners: Record<string, any> = {}
  Object.keys(attrs).forEach(key => {
    if (key.startsWith('on') && typeof attrs[key] === 'function') {
      listeners[key] = attrs[key]
    }
  })
  return listeners
}
</script>

<style scoped>
.UiModal {
  color: var(--color);
}
</style>

<style>
.vfm {
  color: #1c2027;
  box-sizing: border-box;
  height: 100dvh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.vfm__content {
  background-color: #fff;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  width: 670px;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
}

/* Анимация появления снизу */
.vfm-enter-active .vfm__content,
.vfm-leave-active .vfm__content {
  transition: transform 0.3s ease;
}

.vfm-enter-from .vfm__content,
.vfm-leave-to .vfm__content {
  transform: translateY(100%);
}

.vfm-enter-to .vfm__content,
.vfm-leave-from .vfm__content {
  transform: translateY(0);
}

/* Стили для позиционирования по центру снизу */
.vfm--fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.vfm--absolute {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.UiModal .header {
  @apply text-lg mb-4 font-semibold flex items-center;
}

.UiModal .content {
  @apply p-5 px-7 h-full;
}

/* VueJS Modal default styles customization */
.UiModal.vm--container {
  @apply flex items-end justify-center;
  align-items: flex-end;
}

.UiModal .vm--modal {
  @apply bg-white dark:bg-dark rounded-t-lg overflow-hidden;
  color: var(--color);
  border-radius: 4px 4px 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  margin: 0 !important;
  position: relative;
  bottom: 0;
  width: 100%;
}

/* Анимация для vm--modal */
.UiModal.vm--container.vm--overlay[aria-hidden="false"] .vm--modal {
  transform: translateY(0);
}

.UiModal.vm--container.vm--overlay[aria-hidden="true"] .vm--modal {
  transform: translateY(100%);
}

.UiModal .vm--overlay {
  @apply bg-black bg-opacity-50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* Адаптивные стили */
@media (min-width: 768px) {
  .vfm__content {
    border-radius: 4px;
    transform: translateY(0) scale(0.9);
    box-shadow: 0 20px 60px -2px rgba(27, 33, 58, 0.4);
  }

  .vfm-enter-from .vfm__content,
  .vfm-leave-to .vfm__content {
    transform: translateY(0) scale(0.9);
    opacity: 0;
  }

  .vfm-enter-to .vfm__content,
  .vfm-leave-from .vfm__content {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  .UiModal .vm--modal {
    border-radius: 4px;
    transform: translateY(0) scale(0.9);
    bottom: auto;
  }

  .UiModal.vm--container.vm--overlay[aria-hidden="false"] .vm--modal {
    transform: translateY(0) scale(1);
  }

  .UiModal.vm--container.vm--overlay[aria-hidden="true"] .vm--modal {
    transform: translateY(0) scale(0.9);
    opacity: 0;
  }

  .UiModal .vm--overlay {
    align-items: center;
  }

  .vfm,
  .vfm--fixed,
  .vfm--absolute {
    align-items: center;
  }
}
</style>
