<template>
  <AppCard class="flex flex-col h-full p-6">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-color mb-2">
        {{ t('refferal_id') }}
      </h2>
      <p class="text-sm text-gray-400">
        {{ t('referral_id_subtitle') || 'Share your unique referral link' }}
      </p>
    </div>

    <!-- Referral Link Section -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <UiInput
          :model-value="referralLink"
          readonly
          disabled
          class="flex-1"
          input-class="px-4 py-3 text-sm bg-bg-secondary border-border rounded-lg text-color"
        />
        <UiButton
          :class="[
            'flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium',
            copySuccess
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700'
          ]"
          size="sm"
          @click="handleCopy"
        >
          <svg
            v-if="copySuccess"
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6 9 17l-5-5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="14"
              height="14"
              x="8"
              y="8"
              rx="2"
              ry="2"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          {{ copySuccess ? t('copied') || 'Copied!' : t('copy') }}
        </UiButton>
      </div>

      <!-- Referral Code Display -->
      <div class="bg-bg-secondary border border-border rounded-lg p-4 text-center">
        <span class="block text-xl font-bold text-blue-600 mb-1">
          {{ userReferralCode || '---' }}
        </span>
        <span class="block text-xs text-gray-400 uppercase tracking-wider">
          {{ t('your_code') || 'Your Code' }}
        </span>
      </div>
    </div>

    <!-- Sharing Options -->
    <div class="mt-auto">
      <h3 class="text-lg font-semibold text-color text-center mb-4">
        {{ t('share_via') || 'Share via' }}
      </h3>
      <div class="flex justify-center gap-3 flex-wrap">
        <button
          v-for="platform in sharingPlatforms"
          :key="platform.name"
          :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg',
            platform.bgColor
          ]"
          :title="platform.title"
          @click="shareVia(platform.name)"
        >
          <svg
            class="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <component :is="platform.icon" />
          </svg>
        </button>

        <!-- Copy Link Button -->
        <button
          class="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          :title="t('copy_link') || 'Copy Link'"
          @click="handleCopy"
        >
          <svg
            class="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { SharingPlatform, ReferralData } from '~/types/referral'
const {$api} = useNuxtApp()
const { t } = useI18n()
const auth = useUserStore()

// Reactive state
const copySuccess = ref<boolean>(false)
const totalReferrals = ref<number>(0)
const windowOptions = ref<string>('')

// Computed properties
const referralLink = computed<string>(() => {
  return `${window.location.protocol}//${window.location.host}/sign-up?invite=${userReferralCode.value}`
})

const userReferralCode = computed(() => {
  return auth.user?.referralCode || '---'
})

// Sharing platforms configuration
const sharingPlatforms = computed<SharingPlatform[]>(() => [
  {
    name: 'telegram',
    title: t('share_telegram') || 'Share on Telegram',
    bgColor: 'bg-gradient-to-br from-[#0088cc] to-[#229ED9]',
    icon: 'path',
    pathProps: {
      d: 'm3 3 3 9-3 9 19-9Z M6 12 13-9',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }
  },
  {
    name: 'twitter',
    title: t('share_twitter') || 'Share on Twitter',
    bgColor: 'bg-gradient-to-br from-[#1DA1F2] to-[#0d8bd9]',
    icon: 'path',
    pathProps: {
      d: 'M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.01z',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }
  },
  {
    name: 'facebook',
    title: t('share_facebook') || 'Share on Facebook',
    bgColor: 'bg-gradient-to-br from-[#1877F2] to-[#166fe5]',
    icon: 'path',
    pathProps: {
      d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }
  },
  {
    name: 'whatsapp',
    title: t('share_whatsapp') || 'Share on WhatsApp',
    bgColor: 'bg-gradient-to-br from-[#25D366] to-[#128C7E]',
    icon: 'path',
    pathProps: {
      d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }
  }
])

// Methods
const handleCopy = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    copySuccess.value = true

    // Reset success state after 2 seconds
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy referral link:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = referralLink.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)

    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}

const shareVia = (platform: string): void => {
  const shareText = t('referral_share_text') || 'Join me on this amazing platform!'
  const shareUrl = encodeURIComponent(referralLink.value)
  const shareTextEncoded = encodeURIComponent(shareText)

  const urls: Record<string, string> = {
    telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareTextEncoded}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTextEncoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareTextEncoded}%20${shareUrl}`
  }

  if (urls[platform]) {
    window.open(urls[platform], '_blank', windowOptions.value)
  }
}

// Fetch referral data
const fetchReferralData = async (): Promise<void> => {
  try {
    const data = await $api.user.referrals()
    totalReferrals.value = data?.totalCount || 0
  } catch (error) {
    console.error('Failed to fetch referral data:', error)
  }
}

// Lifecycle
onMounted(() => {
  const width = 500
  const height = 500
  const left = (window.screen.width / 2) - (width / 2)
  const top = (window.screen.height / 2) - (height / 2)

  windowOptions.value = `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`

  // Fetch initial data
  fetchReferralData()
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
