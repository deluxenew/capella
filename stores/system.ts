import { defineStore } from 'pinia'
import type { RegExpPatterns, SystemState } from '~/types/system'

export const useSystemStore = defineStore('system', {
  state: (): SystemState => ({
    regExp: null,
    loading: false,
    error: null
  }),

  getters: {
    userRegExp: (state) => state.regExp?.user || {},

    passwordRegExp: (state): RegExp | null => {
      const pattern = state.regExp?.user?.password
      return pattern ? new RegExp(pattern) : null
    },

    isPasswordValid: (state) => (password: string): boolean => {
      const pattern = state.regExp?.user?.password
      return pattern ? new RegExp(pattern).test(password) : false
    }
  },

  actions: {
    setRegExp(payload: RegExpPatterns) {
      this.regExp = payload
      this.error = null
    },

    setError(error: string | null) {
      this.error = error
    },

    async getRegExp(): Promise<RegExpPatterns | null> {
      if (this.loading) {
        return null
      }

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()

        if (!$api) {
          throw new Error('API plugin not available')
        }

        const response = await $api.system.getRegExp()
        this.setRegExp(response.data)
        return response.data
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to load regexp patterns'
        this.setError(errorMessage)
        console.error('Failed to load regexp patterns:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async initialize() {
      if (this.regExp || this.loading) {
        return
      }

      await this.getRegExp()
    }
  }
})
