import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const systemStore = useSystemStore()

  // Используем nuxtApp для доступа к $api
  const initializeSystem = async () => {
    try {
      // Проверяем, инициализирован ли $api
      if (nuxtApp.$api) {
        await systemStore.initialize()
      } else {
        // Если $api еще не доступен, ждем следующего тика
        setTimeout(() => {
          initializeSystem()
        }, 100)
      }
    } catch (error) {
      console.error('Failed to initialize system store:', error)
    }
  }

  // Запускаем инициализацию
  await initializeSystem()

  return {
    provide: {
      system: {
        get passwordRegExp() {
          return systemStore.passwordRegExp
        },

        get userRegExp() {
          return systemStore.userRegExp
        },

        isPasswordValid: (password: string) => systemStore.isPasswordValid(password),

        async refreshRegExp() {
          return await systemStore.getRegExp()
        }
      }
    }
  }
})
