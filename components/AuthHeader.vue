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
const { $utils } = useNuxtApp()
const { t, locales } = useI18n()

// Computed
const wltitle = computed(() => {
  return $utils.hostToTitle?.(window?.location?.host) || 'Capella Finance'
})

const availableLocales = computed(() => {
  return locales.value?.map((i: any) => i.code) || []
})
</script>

<style scoped>
.auth-header {
  border-bottom: 1px solid var(--border-color);
  height: 60px;
  padding: 0 20px;
}

.auth-header .logo {
  font-weight: 600;
  font-size: 18px;
}

.auth-header .wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}

.auth-header .right-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.auth-header .right-block .buttons {
  display: flex;
}

.auth-header .right-block .buttons .auth-buttons {
  display: flex;
}

.auth-header .right-block .buttons .auth-buttons .UiButton {
  border-radius: 6px;
  padding: 12px 18px;
}

.auth-header .right-block .buttons .auth-buttons .UiButton:first-of-type {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.auth-header .right-block .buttons .auth-buttons .UiButton:last-of-type {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.auth-header .sign-in-btn:hover {
  box-shadow: unset;
}

.auth-header .select-lang {
  color: #787b89;
}

/* Mobile styles */
@media screen and (max-width: 600px) {
  .auth-header .right-block .buttons .connectWallet {
    display: none;
  }
}
</style>
