export interface User {
  id: string
  name?: string
  login?: string
  email?: string
  role?: string
  confirmRegistration?: boolean
  metaMaskAddress?: string
  addresses?: {
    registrationFee: Record<string, string>
  }
}

export interface AuthState {
  user?: User
  loggedIn: boolean
}

export interface NuxtAppAuth {
  $state: AuthState
  loggedIn: boolean
  logout: () => Promise<void>
}

export interface LoginCredentials {
  login?: string
  password?: string
  metaMaskAddress?: string
  source?: string
  invite?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    role?: string
    metaMaskAddress?: string
  }
  token: string
}

export interface MetamaskState {
  metaMaskAddress: string | null
  isConnected: boolean
  balance: Record<string, number>
}
