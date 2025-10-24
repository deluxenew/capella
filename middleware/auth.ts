interface MiddlewareContext {
  to: any
  from: any
}
const { $auth } = useNuxtApp()
export default defineNuxtRouteMiddleware((to: any, from: any) => {
  // Runtime проверки для TypeScript
  if (!$auth || typeof $auth.loggedIn === 'undefined') {
    console.warn('Auth plugin not properly initialized')
    return navigateTo('/sign-in')
  }

  if (!$auth.loggedIn) {
    return navigateTo('/sign-in')
  }

  if (!$auth.user?.role) {
    return navigateTo('/registration-confirm')
  }

  if (to.path === '/cabinet') {
    return navigateTo('/cabinet/dashboard')
  }
})
