<template>
  <div class="referral">
    <!-- Header Section -->
    <div class="referral-header text-center mb-8 py-4">
      <h1 class="page-title text-4xl font-bold mb-2 text-color">
        {{ t('LeftSidebar.refferal') }}
      </h1>
      <p class="page-subtitle text-lg text-gray opacity-80">
        {{ t('referral_subtitle') || 'Earn rewards by inviting friends to join our platform' }}
      </p>
    </div>

    <!-- Earnings Overview Section -->
    <div class="earnings-section mb-12">
      <Earned />
    </div>

    <!-- Main Content Grid -->
    <div class="main-content-grid grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
      <div class="referral-flow-section xl:col-span-2">
        <RefferalHowItWorks />
      </div>
      <div class="referral-id-section">
        <RefferalID />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout
import Earned from "~/components/refferal/Earned.vue";

definePageMeta({
  layout: 'inner'
})

// Composable
const { t } = useI18n()
const { $utils } = useNuxtApp()

// Head
useHead({
  title: computed(() =>
    $utils?.hostToTitle?.(process.client ? window.location.host : '') || 'Referral Program'
  )
})
</script>

<style scoped>
.referral {
  @apply px-2 max-w-7xl mx-auto;
}

/* Tablet responsive design */
@media screen and (max-width: 1024px) {
  .referral {
    @apply px-2;
  }

  .referral-header {
    @apply py-3;
  }

  .referral-header .page-title {
    @apply text-3xl;
  }

  .referral-header .page-subtitle {
    @apply text-base;
  }
}

/* Mobile responsive design */
@media screen and (max-width: 768px) {
  .referral {
    @apply px-1;
  }

  .referral-header {
    @apply py-2 mb-4;
  }

  .referral-header .page-title {
    @apply text-2xl leading-tight;
  }

  .referral-header .page-subtitle {
    @apply text-sm leading-relaxed mt-2;
  }

  .earnings-section {
    @apply mb-6;
  }

  .main-content-grid {
    @apply gap-4 mb-6;
  }
}

/* Small mobile responsive design */
@media screen and (max-width: 480px) {
  .referral {
    @apply px-1;
  }

  .referral-header {
    @apply py-1;
  }

  .referral-header .page-title {
    @apply text-xl;
  }

  .referral-header .page-subtitle {
    @apply text-xs;
  }
}

/* Legacy mobile mixin for sidebar compatibility */
@media screen and (max-width: 1015px) {
  .referral .main-content-grid {
    @apply grid-cols-1;
  }
}

/* Expanded sidebar responsive design */
@media screen and (max-width: 1395px) {
  .sidebar_expanded .referral .main-content-grid {
    @apply grid-cols-1;
  }
}
</style>
