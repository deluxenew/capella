import type { LoginCredentials } from '~/types/auth'
const { $api, $auth } = useNuxtApp()
export const useAuth = () => {
  const login = async (credentials: LoginCredentials): Promise<any> => {
    try {
      const response = await $api.user.login(credentials)
      return response.data
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const redirectToAppropriatePage = () => {
    if (!$auth.loggedIn) {
      return navigateTo('/sign-in')
    } else if ($auth.loggedIn && !$auth.user?.role) {
      return navigateTo('/registration-confirm')
    }
    return navigateTo('/cabinet/dashboard')
  }

  return {
    login,
    redirectToAppropriatePage
  }
}
