import { defineStore } from 'pinia'

export interface WindowSize {
  width: number
  height: number
}

export interface AppState {
  scrollY: number
  windowSize: WindowSize
}

export const usePageStore = defineStore('page', {
  state: (): AppState => ({
    scrollY: 0,
    windowSize: {
      width: 0,
      height: 0,
    },
  }),

  actions: {
    setScrollY(scrollY: number) {
      this.scrollY = scrollY
    },

    async setWindowSize({ width, height }: { width: number; height: number }) {
      await nextTick().then(() => {
        this.windowSize.width = width
        this.windowSize.height = height
      })

    },
  },
})
