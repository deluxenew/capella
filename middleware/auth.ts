import type { NuxtAppAuth } from '~/types/auth'

declare module '#app' {
  interface NuxtApp {
    $auth: NuxtAppAuth
  }
}

interface MiddlewareContext {
  to: any
  from: any
}

export default defineNuxtRouteMiddleware((to: any, from: any) => {
  const { $auth } = useNuxtApp()

  // Runtime проверки для TypeScript
  if (!$auth || typeof $auth.loggedIn === 'undefined') {
    console.warn('Auth plugin not properly initialized')
    return navigateTo('/sign-in')
  }

  if (!$auth.loggedIn) {
    return navigateTo('/sign-in')
  }

  if (!$auth.$state?.user?.role) {
    return navigateTo('/registration-confirm')
  }

  if (to.path === '/cabinet') {
    return navigateTo('/cabinet/dashboard')
  }
})
