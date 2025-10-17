<template>
  <UiModal modal-id="terms" classes="modal-terms" height="80%" width="80%">
    <div class="modal-content" v-html="terms" />
  </UiModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
// Composables
const { $utils } = useNuxtApp()
const { t } = useI18n()

// Computed
const terms = computed(() => {
  return $utils.replaceHostToTitle?.(window?.location?.host, t('ModalTermsConditions'))
})
</script>

<style scoped>
.modal-terms.vm--modal {
  @apply text-black;
}

.modal-terms.vm--modal .modal-content {
  @apply p-5 h-full overflow-auto;
}
</style>

<style>
.modal-terms h2 {
  @apply font-bold text-2xl;
}

.modal-terms h3 {
  @apply text-lg;
}

.modal-terms a {
  @apply text-blue-600 text-base;
}
</style>
