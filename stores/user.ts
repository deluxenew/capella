import { defineStore } from 'pinia'

export interface User {
  name?: string
  email?: string
  login?: string
  id?: string
  coinBalance?: Record<string, number>
  withdrawRequest?: Record<string, string>
  address?: string
  addresses?: Record<string, Record<string, string>>
  role?: string
  confirmRegistration?: boolean
  referralCode?: boolean
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),

  actions: {
    setUser(user: User) {
      this.user = user
    },

    clearUser() {
      this.user = null
    }
  }
})
