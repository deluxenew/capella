// plugins/formatting.ts

interface CurrencyOptions extends Intl.NumberFormatOptions {
  currency?: string
}

interface PercentOptions extends Intl.NumberFormatOptions {}

export default defineNuxtPlugin(() => {
  // Форматирование валюты
  const toCurrency = (value: number, options: CurrencyOptions = { currency: 'usd' }): string => {
    if (typeof value !== 'number') {
      console.warn('provided not a number!', value)
      return String(value)
    }

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: options.currency ?? 'usd',
      ...options,
    })

    // replace to add space after currency
    return formatter.format(value).replace(/^(\D+)/, '$1 ')
  }

  // Форматирование процентов
  const toPercent = (value: number, options: PercentOptions = {}): string => {
    if (typeof value !== 'number') {
      console.warn('provided not a number!', value)
      return String(value)
    }

    return new Intl.NumberFormat('default', {
      style: 'percent',
      ...options,
    })
      .format(value / 100)
      .replace(/%$/, ' %')
  }

  // Форматирование даты
  const toDate = (value: string | Date): string => {
    const date = new Date(value)

    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided:', value)
      return String(value)
    }

    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Предоставляем функции через $filters
  return {
    provide: {
      filters: {
        toCurrency,
        toPercent,
        toDate
      }
    }
  }
})
