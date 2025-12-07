import type {
  Api,
  UserApi,
  DashboardApi,
  CurrenciesApi,
  SystemApi,
  PoolApi,
  DaoApi,
  RegisterCredentials,
  LoginCredentials,
  BalanceParams,
  WithdrawParams,
  DepositParams,
  ReferralWithdrawParams
} from '~/types/api'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  // Функция для получения headers с авторизацией
  const getAuthHeaders = (): HeadersInit => {
    const authStore = useAuthStore()
    const headers: HeadersInit = {}

    if (authStore.token) {
      headers.Authorization = 'Bearer ' + `${authStore.token}`
    }

    return headers
  }



  const user = (): UserApi => {
    return {
      register(credentials: RegisterCredentials) {
        return $fetch('/api/v1/register', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: credentials
        })
      },

      logout() {
        return $fetch('/api/v1/logout', {
          method: 'POST',
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      getUser() {
        return $fetch('/api/v1/profile', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      updateUser(user: any) {
        return $fetch('/api/v1/user/update', {
          method: 'PUT',
          baseURL: config.public.apiBase,
          body: user,
          headers: getAuthHeaders()
        })
      },

      login(credentials: LoginCredentials) {
        return $fetch('/api/v1/login-v2', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: credentials
        })
      },

      sendPasswordRecovery({login}) {
        return $fetch('/api/v1/send-password-recovery', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: {login}
        })
      },

      sendApproveEmail({login}) {
        return $fetch('/api/v1/send-approve-email', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: {login}
        })
      },

      connectMM({id, metaMaskAddress}) {
        return $fetch('/api/v1/connect-mm', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: {id, metaMaskAddress},
          headers: getAuthHeaders()
        })
      },

      confirmLogin({login, code}) {
        return $fetch('/api/v1/confirm-login', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: {login, code}
        })
      },

      changePasswordByCode({login, password, code}) {
        return $fetch('/api/v1/change-password-by-code', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: {login, password, code}
        })
      },

      getBalance({from, to, pool}: BalanceParams) {
        return $fetch('/api/v1/balance', {
          baseURL: config.public.apiBase,
          params: {from, to, pool},
          headers: getAuthHeaders()
        })
      },

      referrals() {
        return $fetch('/api/v1/referrals', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      harvest() {
        return $fetch('/api/v1/referrals/harvest', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      progress() {
        return $fetch('/api/v1/referrals/progress', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      levels() {
        return $fetch('/api/v1/referrals/levels', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      referralWithdraw({pool, amount}: ReferralWithdrawParams) {
        return $fetch('/api/v1/referrals/withdraw', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: {pool, amount},
          headers: getAuthHeaders()
        })
      }
    }
  }

  const dashboard = (): DashboardApi => {
    return {
      pool({pool, currency = 'usd'}) {
        return $fetch(`/api/v1/dashboard/pools/${pool}`, {
          baseURL: config.public.apiBase,
          params: {currency},
          headers: getAuthHeaders()
        })
      },

      refreshPool({pool, currency = 'usd'}) {
        return $fetch(`/api/v1/dashboard/refresh-pools/${pool}`, {
          method: 'POST',
          baseURL: config.public.apiBase,
          params: {currency},
          headers: getAuthHeaders()
        })
      },

      yield() {
        return $fetch('/api/v1/dashboard/yield', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      getFaq() {
        return $fetch('/api/v1/faq', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      getRegistrationFee() {
        return $fetch('/api/v1/registration-fee', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      withdraw({pool, amount, currency}: WithdrawParams) {
        return $fetch('/api/v1/dashboard/withdraw', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: {pool, amount, currency},
          headers: getAuthHeaders()
        })
      },

      deposit({pool, amount, currency, transaction}: DepositParams) {
        return $fetch('/api/v1/dashboard/deposit', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: {pool, amount, currency, transaction},
          headers: getAuthHeaders()
        })
      }
    }
  }

  const currencies = (): CurrenciesApi => {
    return {
      list() {
        return $fetch('/api/v1/currencies', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      }
    }
  }

  const pool = (): PoolApi => {
    return {
      assets(pool: string) {
        return $fetch(`/api/v1/pools/${pool}/assets`, {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      strategy(pool: string) {
        return $fetch(`/api/v1/pools/${pool}/strategy`, {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      graph(pool: string) {
        return $fetch(`/api/v1/pools/${pool}/graph`, {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      }
    }
  }

  const dao = (): DaoApi => {
    return {
      personal() {
        return $fetch('/api/v1/dao/personal', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      pools() {
        return $fetch('/api/v1/dao/pools', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      values() {
        return $fetch('/api/v1/dao/values', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      },

      rewards() {
        return $fetch('/api/v1/dao/rewards', {
          baseURL: config.public.apiBase,
          headers: getAuthHeaders()
        })
      }
    }
  }

  const system = (): SystemApi => {
    return {
      async getRegExp() {
        try {
          const response = await $fetch('/api/v1/system/regexp', {
            method: 'GET',
            baseURL: config.public.apiBase,
            headers: getAuthHeaders()
          })
          return { data: response }
        } catch (error) {
          console.error('API Error in getRegExp:', error)
          throw error
        }
      }
    }
  }

  const api: Api = {
    user: user(),
    dashboard: dashboard(),
    currencies: currencies(),
    system: system(),
    pool: pool(),
    dao: dao()
  }

  return {
    provide: {
      api
    }
  }
})


declare module '#app' {
  interface NuxtApp {
    $api: Api
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $api: Api
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: Api
  }
}

