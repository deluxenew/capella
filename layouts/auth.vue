<template>
  <div class="AuthLayout">
    <AuthHeader />
    <div class="content">
      <slot />
    </div>
    <ClientOnly>
      <notifications
        position="top center"
        width="100%"
        :duration="3000"
        :max="3"
      />
    </ClientOnly>
    <AuthFooter />
    <MetamaskBrowserModal />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.AuthLayout {
  @apply min-h-screen flex flex-col;
}

.AuthLayout .content {
  max-height: calc(100dvh - 60px);
  @apply flex-grow flex flex-col mx-auto;
}
</style>

<style>
.AuthLayout .sign-in,
.AuthLayout .sign-up {
  @apply w-full;
}

.AuthLayout .sign-in .main-block,
.AuthLayout .sign-up .main-block {
  @apply w-full flex items-center flex-col justify-between;
}

/* Используем стандартные классы вместо w-85 */
.AuthLayout .sign-in .content,
.AuthLayout .sign-up .content {
  @apply mt-14 w-full max-w-[calc(100%_-_20px)] ;
}

/* Используем CSS variables напрямую для кастомных цветов */
.AuthLayout .sign-in .custom-wrapper,
.AuthLayout .sign-up .custom-wrapper {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
  @apply rounded-lg p-5 mb-4 mt-4 border-0;
}

.AuthLayout .sign-in .custom-wrapper .title,
.AuthLayout .sign-up .custom-wrapper .title {
  color: var(--color_gray);
  @apply text-xs leading-4 mb-2;
}

.AuthLayout .sign-in .main-title,
.AuthLayout .sign-up .main-title {
  font-family: 'TT Commons', sans-serif;
  color: var(--color);
  @apply text-3xl text-center;
}

.AuthLayout .sign-in .custom-wrapper.form,
.AuthLayout .sign-up .custom-wrapper.form {
  @apply mt-5;
}

.AuthLayout .sign-in .custom-wrapper.sign-up-form input,
.AuthLayout .sign-up .custom-wrapper.sign-up-form input {
  @apply py-2;
}

.AuthLayout .sign-in .email-wrap,
.AuthLayout .sign-up .email-wrap {
  border-color: var(--border-color);
  @apply w-full border rounded-lg flex px-2 py-1 pl-3 items-center;
}

.AuthLayout .sign-in input,
.AuthLayout .sign-up input {
  color: var(--color);
  @apply w-full h-full bg-transparent;
}

.AuthLayout .sign-in .wallet-connect .wallet-btn,
.AuthLayout .sign-up .wallet-connect .wallet-btn {
  @apply w-full h-11;
}

.AuthLayout .sign-in .sign-up-btn,
.AuthLayout .sign-up .sign-up-btn {
  @apply w-full mt-2 h-11;
}

.AuthLayout .sign-in .main-title .UiButton {
  color: var(--color_svg);
  @apply p-0 text-3xl normal-case whitespace-nowrap;
}

.AuthLayout .sign-in .main-title .UiButton.nuxt-link-active {
  color: var(--color);
}

.AuthLayout .sign-in .to-registration {
  @apply hidden;
}

.AuthLayout .sign-up .to-auth {
  @apply hidden;
}

@media screen and (max-width: 600px) {
  .AuthLayout {
    @apply flex flex-col;
  }

  .AuthLayout .content {
    @apply flex-grow w-full max-w-none px-1;
  }

  .AuthLayout .sign-in .main-block .content,
  .AuthLayout .sign-up .main-block .content {
    @apply w-full mt-7 pb-0;
  }

  .AuthLayout .sign-in .main-block .content .main-title,
  .AuthLayout .sign-up .main-block .content .main-title {
    @apply text-left ml-4;
  }

  .AuthLayout .sign-in .main-block .content .main-title .to-registration,
  .AuthLayout .sign-up .main-block .content .main-title .to-auth {
    @apply inline;
  }

  .AuthLayout .sign-in .main-block .custom-wrapper.form,
  .AuthLayout .sign-up .main-block .custom-wrapper.form {
    @apply mt-2;
  }
}
</style>
