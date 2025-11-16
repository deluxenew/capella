<template>
  <UiModal modal-id="terms" classes="modal-terms" height="80%" width="80%" clossable>


    <div class="modal-content" v-html="terms" />
  </UiModal>
</template>

<script setup lang="ts">
// Composables
const { $utils } = useNuxtApp()
const { t } = useI18n()

// Computed
const terms = computed(() => {

  return t('ModalTermsConditions')
})
</script>

<style scoped>
.modal-content {
  padding: 20px;
  height: 100%;
  overflow: auto;
}
.modal-terms.vm--modal {
  @apply text-black;
}

.modal-terms.vm--modal .modal-content {
  @apply p-2 h-full overflow-auto;
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
