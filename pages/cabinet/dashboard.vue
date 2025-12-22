<template>
  <div class="dashboard">
    <div class="pl-3">
      <AppBalance class="w-full" />
    </div>
    <div class="flex mt-3 pl-3 wrapper">
      <div class="flex pt-3 flex-col left-column">
        <AppPoolCard
          class="w-full mt-0"
          marker-color="#AAFFCB"
          :name="t('stable_pool')"
          :is-expanded="true"
          pool="stable"
          :currencies="currencies"
          @deposit="deposit"
        />
        <AppPoolCard
          class="w-full mt-2"
          marker-color="#9FE0FF"
          :name="t('coin_pool')"
          pool="coin"
          :currencies="currencies"
          @deposit="deposit"
        />
        <AppPoolCard
          marker-color="#DD7C37"
          :name="t('dex_pool')"
          class="w-full mt-2"
          pool="dex"
          :currencies="currencies"
          @deposit="deposit"
        />
      </div>
      <div class="pt-3 right-column">
        <AppYieldCard />
        <CapellaLearn class="w-full mt-2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


definePageMeta({
  layout: 'inner',
  auth: true
})

// Types
import {useMetamaskStore} from "~/stores/metamask";

interface Currency {
  label: string
  toFiat: number
}

interface DepositParams {
  pool: string
  amount: number
  currency: string
  address: string
}

// Composables
const { $notify, $utils } = useNuxtApp()
const { t } = useI18n()
useHead({
  title: $utils.hostToTitle?.(window?.location?.host) || 'Dashboard'
})
// Data
const curs = ref<Record<number, Currency[]>>({
  1: [
    {
      label: 'ETH',
      toFiat: 1825.28706433,
    },
    {
      label: 'USDT',
      toFiat: 0.99996915,
    },
    {
      label: 'USDC',
      toFiat: 1.00080798,
    },
    {
      label: 'MATIC',
      toFiat: 0.60826543,
    },
    {
      label: 'FTM',
      toFiat: 0.37413356,
    },
  ],
  56: [
    {
      label: 'BNB',
      toFiat: 304.51745223,
    },
  ],
  137: [
    {
      label: 'MATIC',
      toFiat: 0.60891373,
    },
  ],
  250: [
    {
      label: 'FTM',
      toFiat: 0.37413356,
    },
  ],
})

const store = useMetamaskStore()
// Computed
const isConnected = computed(() => {
  return store.IS_CONNECT as boolean
})

const network = computed(() => {
  return store.METAMASK_NET_ID as number
})

const currencies = computed(() => {
  return curs.value[network.value] || []
})

// Methods
const deposit = async ({ pool, amount, currency, address }: DepositParams) => {
  if (amount <= 0 || !isConnected.value) {
    $notify({
      title: 'Warning',
      text: 'Deposit must be > 0 and metamask connected',
      type: 'warn',
    })
    return
  }

  console.log({ currency, pool, amount, address })

  // Emit metamask send event
  // await $nuxt.$emit('metamaskSend', {
  //   currency,
  //   pool,
  //   amount,
  //   address,
  // })
}

// Fetch data
const fetchData = async () => {
  // TODO: Uncomment when API is ready
  // try {
  //   const { data } = await $api.currencies.list()
  //   curs.value = data
  // } catch (e) {
  //   console.log('fetch curr error', e)
  // }
}

// Head

// Fetch on server side
// await fetchData()
</script>

<style scoped>
.dashboard {
  @apply py-2 pr-2;
}

.dashboard .wrapper {
  @apply flex flex-wrap border-t border-border-color;
}

.dashboard .wrapper .left-column {
  @apply flex-1 min-w-0 border-r border-border-color pr-2;
  flex: 10 8 470px;
}

.dashboard .wrapper .right-column {
  @apply flex-1 min-w-0 pl-2;
  flex: 8 10 390px;
}

/* Mobile styles */
@media screen and (max-width: 750px) {
  .dashboard .wrapper {
    @apply flex-col;
  }

  .dashboard .wrapper .left-column {
    @apply min-w-full border-r-0 pr-0;
  }

  .dashboard .wrapper .right-column {
    @apply pl-0;
  }
}

/* Specific breakpoints for sidebar states */
:global(.cabinet:not(.cabinet_mobile).sidebar_expanded) {
  @media screen and (max-width: 1254px) { /* 1004px + 320px - 125px */
    .dashboard .wrapper .left-column {
      @apply pr-0 border-r-0;
    }

    .dashboard .wrapper .right-column {
      @apply pl-0;
    }
  }
}

@media screen and (max-width: 1004px) {
  .dashboard .wrapper .left-column {
    @apply pr-0 border-r-0;
  }

  .dashboard .wrapper .right-column {
    @apply pl-0;
  }
}

/* Wallet mobile styles */
:global(.cabinet:not(.cabinet_mobile)) {
  @media screen and (max-width: 600px) {
    :global(.AppBalance .right) {
      @apply max-w-full mx-0 my-0 bg-secondary py-1 rounded-lg;
    }
  }
}

:global(.cabinet_mobile) {
  :global(.AppBalance .right) {
    @apply max-w-full mx-0 my-0 bg-secondary py-1 rounded-lg;
  }
}
</style>
