declare module '@/api' {
  interface DashboardAPI {
    deposit(params: { pool: string; amount: number; currency: string }): Promise<any>
    // добавьте другие методы по необходимости
  }

  interface API {
    dashboard: DashboardAPI
  }
}
