import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface PoolData {
  addresses?: Record<string, string>
  estimate?: Record<string, number>
  [key: string]: any
}

export interface Coin {
  label: string
  toFiat: number
  address: string
}

export type PoolName = 'stable' | 'dex' | 'coin'

export const usePoolsStore = defineStore('pools', () => {
  // State
  const stable = ref<PoolData | null>(null)
  const dex = ref<PoolData | null>(null)
  const coin = ref<PoolData | null>(null)

  // Getters
  const COINS = computed(() => {
    return (pool: PoolName): Coin[] => {
      const poolData = getPoolData.value(pool)
      if (!poolData) {
        return [{ label: 'ETH', toFiat: 0, address: '0x0' }]
      }

      try {
        const addresses = poolData.addresses || {}
        return Object.keys(addresses).map((label) => ({
          label,
          toFiat: poolData.estimate?.[label] || 0,
          address: addresses[label]
        }))
      } catch (error) {
        console.error('Error getting coins:', error)
        return [{ label: 'ETH', toFiat: 0, address: '0x0' }]
      }
    }
  })

  const getPoolData = computed(() => {
    return (pool: PoolName): PoolData | null => {
      switch (pool) {
        case 'stable': return stable.value
        case 'dex': return dex.value
        case 'coin': return coin.value
        default: return null
      }
    }
  })

  const isPoolLoaded = computed(() => {
    return (pool: PoolName): boolean => {
      return getPoolData.value(pool) !== null
    }
  })

  // Actions
  const setPool = ({ pool, data }: { pool: PoolName; data: PoolData | null }) => {
    switch (pool) {
      case 'stable': stable.value = data; break
      case 'dex': dex.value = data; break
      case 'coin': coin.value = data; break
    }
  }

  const getPool = async ({ pool, currency }: { pool: PoolName; currency?: string }) => {
    try {
      const { $api } = useNuxtApp()
      const data  = await $api.dashboard.pool({ pool, currency })
      setPool({ pool, data })
      return data
    } catch (error) {
      console.error(`Error fetching pool ${pool}:`, error)
      throw error
    }
  }

  const getAllPools = async (currencies?: Record<PoolName, string>) => {
    try {
      const pools: PoolName[] = ['stable', 'dex', 'coin']
      const promises = pools.map(pool => {
        const currency = currencies?.[pool]
        return getPool({ pool, currency })
      })

      const results = await Promise.allSettled(promises)
      return results
    } catch (error) {
      console.error('Error fetching all pools:', error)
      throw error
    }
  }

  const clearPool = (pool: PoolName) => {
    setPool({ pool, data: null })
  }

  const clearAllPools = () => {
    stable.value = null
    dex.value = null
    coin.value = null
  }

  return {
    // State
    stable,
    dex,
    coin,

    // Getters
    COINS,
    getPoolData,
    isPoolLoaded,

    // Actions
    setPool,
    getPool,
    getAllPools,
    clearPool,
    clearAllPools
  }
})
