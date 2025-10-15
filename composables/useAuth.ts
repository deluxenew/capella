// composables/useAuth.ts
import type { LoginCredentials } from '~/types/auth'

export const useAuth = () => {
  const { $api, $auth } = useNuxtApp()

  const login = async (credentials: LoginCredentials): Promise<any> => {
    try {
      const response = await $api.auth.login(credentials)
      return response.data
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const redirectToAppropriatePage = () => {
    if (!$auth.loggedIn) {
      return navigateTo('/sign-in')
    } else if ($auth.loggedIn && !$auth.$state?.user?.role) {
      return navigateTo('/registration-confirm')
    }
    return navigateTo('/cabinet/dashboard')
  }

  return {
    login,
    redirectToAppropriatePage
  }
}
