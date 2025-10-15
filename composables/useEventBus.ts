// composables/useEventBus.ts
import { ref, onUnmounted } from 'vue'

type EventHandler = (...args: any[]) => void

export const useEventBus = () => {
  const events = ref<Record<string, EventHandler[]>>({})

  const $on = (event: string, handler: EventHandler) => {
    if (!events.value[event]) {
      events.value[event] = []
    }
    events.value[event].push(handler)
  }

  const $off = (event: string, handler?: EventHandler) => {
    if (!events.value[event]) return

    if (handler) {
      const index = events.value[event].indexOf(handler)
      if (index > -1) {
        events.value[event].splice(index, 1)
      }
    } else {
      events.value[event] = []
    }
  }

  const $emit = (event: string, ...args: any[]) => {
    if (events.value[event]) {
      events.value[event].forEach(handler => handler(...args))
    }
  }

  return {
    $on,
    $off,
    $emit
  }
}
