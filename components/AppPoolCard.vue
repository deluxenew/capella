<template>
  <AppCard :id="`AppPoolCard_${pool}`" class="AppPoolCard overflow-visible">
    <section class="content flex flex-col">
      <!-- Header -->
      <div class="header flex items-center mb-3">
        <div
          class="marker h-5 w-2 rounded mr-2"
          :style="{ backgroundColor: markerColor }"
        />
        <div class="name text-2xl">{{ name }}</div>
        <UiButton
          theme="icon"
          class="ml-auto mr-5"
          @click="refreshPool()"
        >
          <UiSvgImage svg="refresh" class="refreshIcon w-4 h-4" />
        </UiButton>
        <AppInfoButton @click="showInfoPool = !showInfoPool" />
      </div>

      <!-- Content -->
      <transition name="fade" mode="out-in">
        <div
          v-if="!showInfoPool && !pending"
          key="contentSlot"
          class="content-data flex flex-row flex-wrap gap-4.5"
        >
          <!-- Pool Stats -->
          <div v-if="poolData" class="items w-full flex flex-row justify-between flex-wrap gap-3 py-2 border-t border-b border-border">
            <div class="flex flex-row flex-wrap">
              <span class="item-value text-lg leading-5.5 whitespace-nowrap w-full">
                {{ $filters.toCurrency(poolData.price, { minimumFractionDigits: 4 }) }}
              </span>
              <span class="item-name text-xs text-gray capitalize">{{ t('price') }}</span>
            </div>
            <div class="flex flex-row flex-wrap">
              <span class="item-value text-lg leading-5.5 whitespace-nowrap w-full">
                {{ $filters.toPercent(poolData.apy, { minimumFractionDigits: 2 }) }}
              </span>
              <span class="item-name text-xs text-gray capitalize">{{ t('apy') }}</span>
            </div>
            <div class="flex flex-row flex-wrap">
              <span class="item-value text-lg leading-5.5 whitespace-nowrap w-full">
                {{ $filters.toPercent(poolData.daily, { minimumFractionDigits: 2 }) }}
              </span>
              <span class="item-name text-xs text-gray capitalize">{{ t('daily') }}</span>
              <span
                v-if="poolData.daily"
                class="item-changeTo ml-2 text-xs"
                :class="{
                  'text-green': poolData.daily > 0,
                  'text-red': poolData.daily < 0
                }"
              >
                {{ $filters.toCurrency(poolData.daily) }}
              </span>
            </div>
            <div class="flex flex-row flex-wrap">
              <span class="item-value text-lg leading-5.5 whitespace-nowrap w-full">
                {{ $filters.toCurrency(poolData.tvl) }}
              </span>
              <span class="item-name text-xs text-gray">TVL</span>
            </div>
          </div>

          <!-- Chart -->
          <div class="chart h-10 flex-[5_0_180px]">
            <ClientOnly>
              <transition name="fade" mode="out-in">
                <UiChart
                  v-if="!pending"
                  :key="pool"
                  :items="chart"
                  :color="markerColor"
                  value-key="price"
                  :currency="poolData?.currency"
                />
                <AppLoader v-else :color="markerColor" />
              </transition>
            </ClientOnly>
          </div>

          <!-- Liquidity Button -->
          <UiButton
            theme="dark"
            class="button-liquidity flex-[5_0_180px] px-2 py-2 flex justify-between text-color"
            inset
            fill="fill-white"
            @click="showliquidity = !showliquidity"
          >
            {{ t('add_liquidity') }}
            <UiSvgImage
              :class="`transform ${showliquidity ? 'rotate-0' : 'rotate-180'}`"
              svg="arrow_up"
            />
          </UiButton>

          <!-- Liquidity Items -->
          <div class="liqudity-items_wrapper w-full">
            <UiTransitionExpand name="heightLiqudityItems">
              <div v-if="showliquidity" class="liqudity-items row flex flex-wrap gap-4.5">
                <!-- Balance Column -->
                <div class="column-wrapper flex flex-col gap-2 flex-[10_5_200px] min-w-[40%]">
                  <UiCurrencyInput
                    :config="balanceCurrencyConfig"
                    :value="max > 0 ? balance.value : 0"
                    :label="`${t('balance')}: ${balanceMax}`"
                    :disabled="max <= 0"
                    class="z-10"
                    @numberInput="balanceInput($event)"
                  >
                    <template #append>
                      <div class="append-input flex gap-3 items-center">
                        <UiSelect
                          v-model="coin"
                          :options="coins?.map((c) => c.label)"
                          class="button-crypto"
                        />
                        <UiButton
                          class="button_max h-7.5 px-1 py-1 text-xs text-gray mr-2"
                          theme="dark"
                          :disabled="balance.value === balanceMax"
                          @click="balanceInput(balanceMax)"
                        >
                          {{ t('max') }}
                        </UiButton>
                      </div>
                    </template>
                  </UiCurrencyInput>

                  <UiSlider
                    v-if="balanceMax > 0"
                    :value="balance.value"
                    :max="balanceMax"
                    label-type="value"
                    class="mb-5 max-w-full"
                    @input="balanceInput($event)"
                  />

                  <div v-if="balanceMax <= 0" class="hint-text text-xs min-w-full">
                    {{ t('no_balance_by_coin', { coin }) }}
                  </div>

                  <div class="footer-items mt-auto flex flex-col gap-1.25">
                    <UiButton
                      theme="outline"
                      outline
                      size="sm"
                      :disabled="!user?.confirmRegistration"
                      @click="sendDeposit"
                    >
                      {{ t('deposit') }}
                    </UiButton>
                    <p class="hint-text text-gray text-xs mt-0.25">
                      {{ t('deposit_fee') }}: 0%
                    </p>
                  </div>
                </div>

                <!-- Deposit Column -->
                <div class="column-wrapper flex flex-col gap-2 flex-[10_5_200px] min-w-[40%]">
                  <UiCurrencyInput
                    :config="depositCurrencyConfig"
                    :value="depositMax > 0 ? deposit.value : 0"
                    :disabled="depositMax <= 0 || !!userWithdrawRequestByPool"
                    :label="`${t('deposited')} : ${userCoinBalanceByPool - userWithdrawRequestByPool}`"
                    @numberInput="depositInput($event)"
                  >
                    <template #append>
                      <UiButton
                        class="button_max h-7.5 px-1 py-1 text-xs text-gray"
                        theme="dark"
                        :disabled="deposit.value === depositMax || !!userWithdrawRequestByPool"
                        @click="depositInput(depositMax)"
                      >
                        {{ t('max') }}
                      </UiButton>
                    </template>
                  </UiCurrencyInput>

                  <UiSlider
                    v-if="depositMax > 0"
                    :value="deposit.value"
                    :max="depositMax"
                    label-type="value"
                    class="mb-5 max-w-full"
                    :disabled="!!userWithdrawRequestByPool"
                    @input="depositInput($event)"
                  />

                  <div v-if="depositMax <= 0" class="hint-text text-xs min-w-full">
                    {{ t('no_balance_by_pool', { coin }) }}
                  </div>

                  <div class="footer-items mt-auto flex flex-col gap-1.25">
                    <UiButton
                      v-if="!userWithdrawRequestByPool"
                      theme="outline"
                      outline
                      size="sm"
                      :disabled="deposit.value == 0"
                      @click="withdraw"
                    >
                      {{ t('withdraw') }}
                    </UiButton>
                    <UiButton
                      v-else
                      theme="outline"
                      outline
                      class="withdraw_requested relative"
                      size="sm"
                      :disabled="true"
                      @click="withdraw"
                    >
                      {{ t('withdraw_request') }}
                      <AppLoader class="loader ml-3 w-7.5 gap-1.25" color="gray" size="5px" />
                    </UiButton>
                    <p class="hint-text text-gray text-xs mt-0.25">
                      {{ t('withdrawal_fee') }}: 0.01%
                    </p>
                  </div>
                </div>
              </div>
            </UiTransitionExpand>
          </div>
        </div>

        <AppLoader v-else-if="pending" :color="markerColor" />
        <div v-else key="infoSlot">
          {{ t(`pools_info.${pool}`) }}
        </div>
      </transition>
    </section>
  </AppCard>
</template>

<script setup lang="ts">
import { usdConfig } from '~/composables/useCurrency'

import {type PoolName, usePoolsStore, type Coin } from "~/stores/pools";
import {useUserStore} from "~/stores/user";
import {useMetamaskStore} from "~/stores/metamask";

interface Props {
  name?: string
  pool: PoolName
  markerColor?: string
  isExpanded?: boolean
}

const {t} = useI18n()

const props = withDefaults(defineProps<Props>(), {
  name: () => useI18n().t('stable_pool'),
  markerColor: '#9FE0FF',
  isExpanded: false
})

const emit = defineEmits<{
  (e: 'deposit', value:{ pool: string; amount: number; currency: string; address: string }): void
}>()

// Reactive state
const showliquidity = ref(props.isExpanded)
const deposit = ref({ value: 0 })
const balance = ref({ value: 0 })
const coin = ref<string>('')
const showInfoPool = ref(false)

// Composable
const { $api, $auth, $filters, $notify } = useNuxtApp()
const store = usePoolsStore()
const metamaskStore = useMetamaskStore()
const userStore = useUserStore()
const route = useRoute()

// Data fetching
const { data: poolData, pending, refresh } = await useAsyncData(
  `pool-${props.pool}`,
  async () => {
    try {
      await store.getPool({ pool: props.pool })
      return store.getPoolData(props.pool)
    } catch (error) {
      console.error('Error fetching pool data:', error)
      return null
    }
  }
)

// Computed
const balanceMax = computed(() =>
  metamaskStore?.BALANCE(coin.value)
)

const user = computed(() => userStore?.user)

const max = computed(() => balanceMax.value * 0.95)

const userCoinBalanceByPool = computed(() =>
  parseFloat(userStore.user?.coinBalance?.[props.pool].toFixed(4) || '0')
)

const userWithdrawRequestByPool = computed(() =>
  parseInt(userStore.user?.withdrawRequest?.[props.pool] || '0')
)

const depositMax = computed(() => poolData.value?.balance || 0)

const balanceCurrencyConfig = computed(() => ({
  ...usdConfig,
  precision: 3,
  currency: { prefix: '' },
  valueRange: {
    min: 0,
    max: balanceMax.value,
  },
}))

const depositCurrencyConfig = computed(() => ({
  ...usdConfig,
  precision: 3,
  currency: { prefix: '$ ' },
  valueRange: {
    min: 0,
    max: depositMax.value,
  },
}))

const coins = computed(() =>
  store.COINS(props.pool)
)

const chart = computed(() =>
  poolData.value?.chart?.filter((item: any) => item.price >= 0) || []
)

const metamaskAddress = computed(() =>
  metamaskStore.account
)

const currentCoin = computed(() =>
  coins.value?.find((c: Coin) => c.label === coin.value)
)

const address = computed(() =>
  coins.value?.find((it: Coin) => it.label === coin.value)?.address || '0x0'
)

// Watchers
watch(coins, (items) => {
  if (items?.[0]?.label) {
    coin.value = items[0].label
  }
}, { immediate: true })

watch(currentCoin, () => {
  balanceInput(balance.value.value)
})

// Methods
const balanceInput = (value?: number) => {
  value = +(value || 0)
  balance.value.value = value > max.value ? max.value : value
}

const depositInput = (value?: number) => {
  value = +(value || 0)
  deposit.value.value = value > depositMax.value ? depositMax.value : value
}

const sendDeposit = () => {
  emit('deposit', {
    pool: props.pool,
    amount: balance.value.value,
    currency: currentCoin.value?.label || '',
    address: address.value,
  })
}

const refreshPool = async () => {
  try {
    await $api.dashboard.refreshPool({ pool: props.pool })
    await refresh()
  } catch (error) {
    console.error('Error refreshing pool:', error)
  }
}

const withdraw = async () => {
  try {
    await $api.dashboard.withdraw({
      pool: props.pool,
      amount: deposit.value.value,
      currency: coin.value,
    })

    const userData  = await $api.user.getUser()
    if (userData) userStore.setUser(userData)

    deposit.value.value = 0

    $notify({
      title: 'Success',
      type: 'success',
      text: 'Withdrawal successfully requested',
    })
  } catch (error) {
    $notify({
      title: 'Warning',
      type: 'warn',
      text: 'Something wrong',
    })
  }
}
</script>

<style scoped>
.refreshIcon :deep(g) path {

}

.heightLiqudityItems-enter-active,
.heightLiqudityItems-leave-active {
  transition: 0.8s;
  margin-top: 18px;
  max-height: 170px;
}

.heightLiqudityItems-enter,
.heightLiqudityItems-leave-to {
  opacity: 0;
  margin-top: 0 !important;
  max-height: 0px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile styles */
@media (max-width: 640px) {
  .AppPoolCard .content .content-data {
    flex-direction: column;
  }

  .AppPoolCard .content .content-data .chart {
    order: 1;
    margin: 26px 0 30px 0 !important;
    width: 100%;
    flex-basis: 0;
  }

  .AppPoolCard .content .content-data .items {
    order: 2;
    flex-wrap: wrap;
    gap: 20px 0;
  }

  .AppPoolCard .content .content-data .items > div {
    width: 50%;
  }

  .AppPoolCard .content .content-data .items > div:nth-of-type(1),
  .AppPoolCard .content .content-data .items > div:nth-of-type(2) {
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
  }

  .AppPoolCard .content .content-data .button-liquidity {
    order: 3;
    width: 100%;
    margin: 0;
    flex-basis: 0;
    margin-bottom: 10px;
    justify-content: center;
    gap: 14px;
  }

  .AppPoolCard .content .content-data .liqudity-items_wrapper {
    order: 4;
  }

  .AppPoolCard .content .content-data .liqudity-items_wrapper .liqudity-items {
    flex-direction: column;
  }

  .AppPoolCard .content .content-data .liqudity-items_wrapper .liqudity-items .column-wrapper:first-of-type {
    padding-bottom: 20px;
    border-bottom: 2px solid ;
  }

  .AppPoolCard .content .content-data .liqudity-items_wrapper .liqudity-items > div {
    width: 100%;
    flex: unset;
  }
}

/* Tablet styles for sidebar_expanded */
@media (max-width: 798px) {
  .sidebar_expanded .column-wrapper:first-of-type {
    padding-bottom: 20px;
    border-bottom: 2px solid ;
  }
}
</style>
