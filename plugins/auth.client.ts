// plugins/auth.client.ts
export default defineNuxtPlugin( (nuxt) => {
  const auth = useAuth()
console.log(auth)
  // Добавляем токен к каждому запросу
  // auth.onRequest((event) => {
  //   const token = auth.token
  //   if (token) {
  //     event.options.headers = {
  //       ...event.options.headers,
  //       Authorization: `Bearer ${token}`
  //     }
  //   }
  // })
})
