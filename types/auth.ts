export interface LoginCredentials {
  login?: string
  password?: string
  metaMaskAddress?: string
  source?: string
  invite?: string
}

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

export interface RegisterCredentials {
  login: string
  password: string
  metaMaskAddress?: string
  source?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  loggedIn: boolean
}

export interface ApiError {
  response?: {
    data?: {
      message: string
    }
  }
  message: string
}
