import { defineStore } from 'pinia'
import type {SessionData} from "#auth";



export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as SessionData | null,
  }),

  actions: {
    setUser(user: SessionData) {
      this.user = user
    },

    clearUser() {
      this.user = null
    }
  }
})
