export interface RegExpPatterns {
  user?: {
    password?: string
    login?: string
    email?: string
  }
  // Добавьте другие паттерны по необходимости
}

export interface SystemState {
  regExp: RegExpPatterns | null
  loading: boolean
  error:  string | null
}
