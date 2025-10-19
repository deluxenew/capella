declare module '@/api' {
  interface DashboardAPI {
    deposit(params: { pool: string; amount: number; currency: string }): Promise<any>
    // добавьте другие методы по необходимости
  }

  interface API {
    dashboard: DashboardAPI
  }
}
// types/api.ts

// User types
export interface LoginCredentials {
  login?: string
  password?: string
  address?: string
  source?: string
  invite?: string
}

export interface RegisterCredentials {
  login: string
  address?: string
  password: string
  source?: string
  invite?: string
}

export interface User {
  id: string
  email: string
  name: string
  role?: string
  address?: string
  confirmRegistration?: boolean
  addresses?: {
    registrationFee: Record<string, string>
  }
}

export interface BalanceParams {
  from?: string | null
  to?: string
  pool?: string[]
}

export interface WithdrawParams {
  pool: string
  amount: number
  currency: string
}

export interface DepositParams {
  pool: string
  amount: number
  currency: string
  transaction: string
}

export interface ReferralWithdrawParams {
  pool: string
  amount: number
}

// API interfaces
export interface UserApi {
  register(credentials: RegisterCredentials): Promise<any>
  logout(): Promise<any>
  getUser(): Promise<{ data: User }>
  updateUser(user: Partial<User>): Promise<any>
  login(credentials: LoginCredentials): Promise<any>
  sendPasswordRecovery(params: { login: string }): Promise<any>
  sendApproveEmail(params: { login: string }): Promise<any>
  connectMM(params: { id: string; address: string }): Promise<any>
  confirmLogin(params: { login: string; code: string }): Promise<any>
  changePasswordByCode(params: { login: string; password: string; code: string }): Promise<any>
  getBalance(params: BalanceParams): Promise<any>
  referrals(): Promise<any>
  harvest(): Promise<any>
  progress(): Promise<any>
  levels(): Promise<any>
  referralWithdraw(params: ReferralWithdrawParams): Promise<any>
}

export interface DashboardApi {
  pool(params: { pool: string; currency?: string }): Promise<any>
  refreshPool(params: { pool: string; currency?: string }): Promise<any>
  yield(): Promise<any>
  getFaq(): Promise<any>
  getRegistrationFee(): Promise<any>
  withdraw(params: WithdrawParams): Promise<any>
  deposit(params: DepositParams): Promise<any>
}

export interface CurrenciesApi {
  list(): Promise<any>
}

export interface SystemApi {
  getRegExp(): Promise<any>
}

export interface PoolApi {
  assets(pool: string): Promise<any>
  strategy(pool: string): Promise<any>
  graph(pool: string): Promise<any>
}

export interface DaoApi {
  personal(): Promise<any>
  pools(): Promise<any>
  values(): Promise<any>
  rewards(): Promise<any>
}

export interface Api {
  user: UserApi
  dashboard: DashboardApi
  currencies: CurrenciesApi
  system: SystemApi
  pool: PoolApi
  dao: DaoApi
}
