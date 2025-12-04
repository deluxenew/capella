<template>
  <header class="auth-header">
    <div class="wrapper">
      <a href="#" class="logo">{{ wltitle }}</a>
      <div class="right-block">
        <!-- TODO Включить переключатель языков-->
        <!-- <AppSelectLocale /> -->
        <div class="buttons ml-auto">
          <div class="auth-buttons">
            <UiButton theme="outline" to="/sign-in">
              {{ t('AuthHeader.sign_in') }}
            </UiButton>
            <UiButton theme="outline" to="/sign-up">
              {{ t('AuthHeader.sign_up') }}
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Composables
const {$utils} = useNuxtApp()
const {t, locales} = useI18n()

// Computed
const wltitle = computed(() => {
  return $utils.hostToTitle?.(window?.location?.host) || 'Capella Finance'
})

const availableLocales = computed(() => {
  return locales.value?.map((i: any) => i.code) || []
})
</script>

<style>
.auth-header {
  @apply border-b border-border-color h-15 px-5;
}

.auth-header .logo {
  @apply font-semibold ;
}

.auth-header .wrapper {
  @apply flex items-center h-full;
}

.auth-header .right-block {
  @apply flex items-center justify-between w-full;
}

.auth-header .right-block .buttons {
  @apply flex;
}

.auth-header .right-block .buttons .auth-buttons {
  @apply flex;
}

.auth-header .right-block .buttons .auth-buttons .UiButton {
  @apply rounded py-3 px-4;
}

.auth-header .right-block .buttons .auth-buttons .UiButton:first-of-type {
  @apply rounded-tr-none rounded-br-none;
}

.auth-header .right-block .buttons .auth-buttons .router-link-active.UiButton:first-of-type {
  color: var(--color_blue);
  background: rgba(66, 118, 246, .2);
  @apply rounded-tr-none rounded-br-none border-transparent ;
}

.auth-header .right-block .buttons .auth-buttons .UiButton:last-of-type {
  @apply rounded-tl-none rounded-bl-none;
}

.auth-header .right-block .buttons .auth-buttons .router-link-active.UiButton:last-of-type {
  color: var(--color_blue);
  background: rgba(66, 118, 246, .2);
  @apply border-transparent;
}

.auth-header .sign-in-btn:hover {
  box-shadow: unset;
  @apply rounded-r-none
}

.auth-header .select-lang {
  @apply text-gray;
}

/* Mobile styles */
@media screen and (max-width: 600px) {
  .auth-header .right-block .buttons .connectWallet {
    @apply hidden;
  }
}
</style>
