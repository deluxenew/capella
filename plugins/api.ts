// plugins/api.ts
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

export default defineNuxtPlugin(() => {
  const user = (): UserApi => {
    return {
      register(credentials: RegisterCredentials) {
        return $fetch('/api/v1/register', {
          method: 'POST',
          body: credentials
        })
      },

      logout() {
        return $fetch('/api/v1/logout', {
          method: 'POST'
        })
      },

      getUser() {
        return $fetch('/api/v1/profile')
      },

      updateUser(user: any) {
        return $fetch('/api/v1/user/update', {
          method: 'PUT',
          body: user
        })
      },

      login(credentials: LoginCredentials) {
        return $fetch('/api/v1/login-v2', {
          method: 'POST',
          body: credentials
        })
      },

      sendPasswordRecovery({ login }) {
        return $fetch('/api/v1/send-password-recovery', {
          method: 'POST',
          body: { login }
        })
      },

      sendApproveEmail({ login }) {
        return $fetch('/api/v1/send-approve-email', {
          method: 'POST',
          body: { login }
        })
      },

      connectMM({ id, address }) {
        return $fetch('/api/v1/connect-mm', {
          method: 'POST',
          body: { id, address }
        })
      },

      confirmLogin({ login, code }) {
        return $fetch('/api/v1/confirm-login', {
          method: 'POST',
          body: { login, code }
        })
      },

      changePasswordByCode({ login, password, code }) {
        return $fetch('/api/v1/change-password-by-code', {
          method: 'POST',
          body: { login, password, code }
        })
      },

      getBalance({ from, to, pool }: BalanceParams) {
        return $fetch('/api/v1/balance', {
          params: { from, to, pool: pool?.join(',') }
        })
      },

      referrals() {
        return $fetch('/api/v1/referrals')
      },

      harvest() {
        return $fetch('/api/v1/referrals/harvest')
      },

      progress() {
        return $fetch('/api/v1/referrals/progress')
      },

      levels() {
        return $fetch('/api/v1/referrals/levels')
      },

      referralWithdraw({ pool, amount }: ReferralWithdrawParams) {
        return $fetch('/api/v1/referrals/withdraw', {
          method: 'POST',
          body: { pool, amount }
        })
      }
    }
  }

  const dashboard = (): DashboardApi => {
    return {
      pool({ pool, currency = 'usd' }) {
        return $fetch(`/api/v1/dashboard/pools/${pool}`, {
          params: { currency }
        })
      },

      refreshPool({ pool, currency = 'usd' }) {
        return $fetch(`/api/v1/dashboard/refresh-pools/${pool}`, {
          method: 'POST',
          params: { currency }
        })
      },

      yield() {
        return $fetch('/api/v1/dashboard/yield')
      },

      getFaq() {
        return $fetch('/api/v1/faq')
      },

      getRegistrationFee() {
        return $fetch('/api/v1/registration-fee')
      },

      withdraw({ pool, amount, currency }: WithdrawParams) {
        return $fetch('/api/v1/dashboard/withdraw', {
          method: 'POST',
          body: { pool, amount, currency }
        })
      },

      deposit({ pool, amount, currency, transaction }: DepositParams) {
        return $fetch('/api/v1/dashboard/deposit', {
          method: 'POST',
          body: { pool, amount, currency, transaction }
        })
      }
    }
  }

  const currencies = (): CurrenciesApi => {
    return {
      list() {
        return $fetch('/api/v1/currencies')
      }
    }
  }

  const system = (): SystemApi => {
    return {
      getRegExp() {
        return $fetch('/api/v1/system/regexp')
      }
    }
  }

  const pool = (): PoolApi => {
    return {
      assets(pool: string) {
        return $fetch(`/api/v1/pools/${pool}/assets`)
      },

      strategy(pool: string) {
        return $fetch(`/api/v1/pools/${pool}/strategy`)
      },

      graph(pool: string) {
        return $fetch(`/api/v1/pools/${pool}/graph`)
      }
    }
  }

  const dao = (): DaoApi => {
    return {
      personal() {
        return $fetch('/api/v1/dao/personal')
      },

      pools() {
        return $fetch('/api/v1/dao/pools')
      },

      values() {
        return $fetch('/api/v1/dao/values')
      },

      rewards() {
        return $fetch('/api/v1/dao/rewards')
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
