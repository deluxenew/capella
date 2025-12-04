import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useCookie('auth._token.local').value,
    refreshToken: useCookie('auth._refresh_token.local').value,
    user: null as any | null,
    loggedIn: false
  }),

  actions: {
    setToken(token: string, refreshToken: string) {
      this.token = token
      this.refreshToken = refreshToken
      this.loggedIn = true

      // Сохраняем в localStorage для persistence
      if (process.client) {
        localStorage.setItem('auth_token', token)
      }
    },

    setUser(user: any) {
      this.user = user

      if (process.client) {
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.loggedIn = false

      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    },

    initialize() {
      // Восстанавливаем состояние из localStorage
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const user = localStorage.getItem('auth_user')

        if (token) {
          this.token = token
          this.loggedIn = true
        }

        if (user) {
          this.user = JSON.parse(user)
        }
      }
    }
  }
})
