<template>
  <footer class="AuthFooter">
    <div class="terms" @click="showModal">
      <span class="terms-text">
        {{ t('signUp.terms_of_service') }}
      </span>
    </div>

    <ModalTermsConditions />
  </footer>
</template>

<script setup lang="ts">
// Composables
const { $modal } = useNuxtApp()
const { t } = useI18n()

// Methods
const showModal = (): void => {
  $modal.open('terms')
  console.log($modal)
}

const hideModal = (): void => {
  $modal.close('terms')
}
</script>

<style scoped>
.AuthFooter {
  @apply text-center;
}

.AuthFooter .terms {
  @apply mb-2 cursor-pointer;
}

.AuthFooter .terms-text {
  @apply text-base underline text-gray;
}
</style>
