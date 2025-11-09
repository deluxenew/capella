import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Инициализируем auth store первым
  const authStore = useAuthStore()
  authStore.initialize()

  // Затем system store
  const systemStore = useSystemStore()
  await systemStore.initialize()

  console.log('All stores initialized successfully')
})
