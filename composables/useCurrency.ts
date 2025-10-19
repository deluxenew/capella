// Конфигурации для различных типов валют
export interface CurrencyConfig {
  precision?: number
  currency?: {
    prefix?: string
    suffix?: string
    code?: string
  }
  valueRange?: {
    min?: number | string
    max?: number | string
  }
  distractionFree?: boolean
  allowNegative?: boolean
  parse?: boolean
  autoDecimalMode?: boolean
}

export const usdConfig: CurrencyConfig = {
  precision: 1,
  currency: {
    prefix: '$ ',
  },
  valueRange: {
    min: '0',
  },
  distractionFree: false,
  allowNegative: false,
  parse: true,
  autoDecimalMode: true,
}

export const eurConfig: CurrencyConfig = {
  precision: 2,
  currency: {
    prefix: '€ ',
  },
  valueRange: {
    min: '0',
  },
  distractionFree: false,
  allowNegative: false,
  parse: true,
}

export const percentConfig: CurrencyConfig = {
  precision: 2,
  currency: {
    suffix: ' %',
  },
  valueRange: {
    min: '0',
    max: '100'
  },
  distractionFree: false,
  allowNegative: false,
  parse: true,
}

export const numberConfig: CurrencyConfig = {
  precision: 0,
  currency: null,
  valueRange: {
    min: '0',
  },
  distractionFree: false,
  allowNegative: false,
  parse: true,
}

// Composable для работы с валютой
export const useCurrency = () => {
  const formatCurrency = (value: number, config: CurrencyConfig = usdConfig): string => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: config.precision,
      maximumFractionDigits: config.precision,
    })

    return formatter.format(value)
  }

  const parseCurrency = (value: string): number => {
    return parseFloat(value.replace(/[^\d.-]/g, ''))
  }

  return {
    usdConfig,
    eurConfig,
    percentConfig,
    numberConfig,
    formatCurrency,
    parseCurrency
  }
}
