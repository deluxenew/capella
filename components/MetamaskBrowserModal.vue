<template>
  <UiModal modal-id="openMetamaskBrowser" width="350" height="auto">
    <div class="content">
      <div class="header">
        {{ t('switch_metamask') }}
        <UiButton
          class="ml-auto"
          theme="icon"
          @click="$modal.close('openMetamaskBrowser')"
        >
          <UiSvgImage svg="close" />
        </UiButton>
      </div>
      <p>
        {{ t('switch_metamask_description') }}
      </p>

      <UiButton class="w-100 mt-10" @click="openMetamaskBrowser()">
        {{ t('switch_metamask') }}
      </UiButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
// Composables
const { $modal } = useNuxtApp()
const { t } = useI18n()

// Methods
const openMetamaskBrowser = (): void => {
  window.location.href = `https://metamask.app.link/dapp/${window.location.href}`
}
</script>

<style scoped>
.content {
  @apply p-6;
}

.header {
  @apply flex items-center mb-4 text-lg font-semibold;
}

p {
  @apply mb-6 text-gray-600;
}

.w-100 {
  @apply w-full;
}

</style>
