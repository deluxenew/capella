/* eslint-disable camelcase */

// Типы
export interface UtmData {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
}

export interface UtmPlugin {
  getUtm: () => UtmData
  parse: (query: Record<string, string>) => void
}

const utm: UtmData = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
}

let filled = false

const cookieOptions = {
  domain: 'capella.finance',
  path: '/',
  maxAge: 2147483647,
} as const

export default defineNuxtPlugin(() => {
  const route = useRoute()
  const utmCookie = useCookie<string| null>('utm', { default: () => null, ...cookieOptions })

  const parse = function (query: Record<string, string> = {}): void {
    if (filled || utmCookie.value) return

    const { utm_source, utm_medium, utm_campaign, utm_content, utm_term } = query

    utm.utm_source = utm_source || null
    utm.utm_medium = utm_medium || null
    utm.utm_campaign = utm_campaign || null
    utm.utm_content = utm_content || null
    utm.utm_term = utm_term || null

    filled = true

    if (
      utm.utm_source ||
      utm.utm_medium ||
      utm.utm_campaign ||
      utm.utm_content ||
      utm.utm_term
    ) {
      utmCookie.value = JSON.stringify(utm)
    }
  }

  const getUtm = function (): UtmData {
    if (utmCookie.value) {
      try {
        return JSON.parse(utmCookie.value) as UtmData
      } catch {
        return utm
      }
    } else {
      return utm
    }
  }

  // Парсим начальные параметры из маршрута
  parse(route.query as Record<string, string>)

  const utmPlugin: UtmPlugin = {
    getUtm,
    parse
  }

  return {
    provide: {
      utm: utmPlugin
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $utm: UtmPlugin
  }
}

declare module '~/node_modules/nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $utm: UtmPlugin
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $utm: UtmPlugin
  }
}
