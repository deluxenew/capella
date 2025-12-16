// server/api/capella/[...].ts
export default defineEventHandler(async (event) => {
  const targetBaseUrl = 'https://app.liquidnow.me'

  // Получаем полный путь запроса
  const fullPath = event.path

  // Убираем префикс /api/capella из пути
  const path = fullPath.replace(/^\/api\/capella/, '')

  // Формируем целевой URL
  const targetUrl = `${targetBaseUrl}${path}`

  // Получаем метод запроса
  const method = event.method

  // Получаем query параметры
  const query = getQuery(event)

  // Получаем заголовки
  const headers: Record<string, string> = {}
  const incomingHeaders = event.headers

  // Копируем заголовки, исключая ненужные
  const excludeHeaders = ['host', 'connection', 'content-length']

  for (const [key, value] of incomingHeaders.entries()) {
    if (!excludeHeaders.includes(key.toLowerCase())) {
      headers[key] = value
    }
  }

  // Добавляем CORS заголовки если нужно
  headers['Access-Control-Allow-Origin'] = '*'

  // Для методов с телом получаем тело
  let body: any = undefined
  if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
    try {
      body = await readBody(event)
    } catch (e) {
      console.warn('Could not read body:', e)
    }
  }

  console.log(`Proxying ${method} ${fullPath} -> ${targetUrl}`)

  try {
    // Выполняем запрос к целевому серверу
    const response = await $fetch(targetUrl, {
      method,
      params: method === 'GET' ? query : undefined,
      body: method !== 'GET' ? body : undefined,
      headers,
      // Не выбрасывать исключение при ошибках HTTP
      ignoreResponseError: true,
    })

    return response

  } catch (error: any) {
    console.error('Proxy request failed:', {
      url: targetUrl,
      method,
      error: error.message,
      status: error.statusCode
    })

    // Пробрасываем ошибку с корректным статусом
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Proxy request failed',
      data: error.data || error.message,
    })
  }
})
