<template>
  <div class="password-recovery sign-in flex flex-col items-center justify-center min-h-[600px]">
    <div class="w-full max-w-md">
      <h2 class="main-title text-2xl font-semibold text-center mb-6">
        {{ t('Auth.recover_password') }}
      </h2>

      <!-- Form 1: Email Input -->
      <form
        v-if="!recoveryEmail"
        class="custom-wrapper form sign-up-form"
        @submit.prevent="recovery"
      >
        <UiInput
          v-model="email"
          type="text"
          :disabled="disabled"
          autocomplete="current-email"
          :label="t('signUp.enter_email')"
          :placeholder="t('signUp.your_email')"
          class="mb-6"
        />

        <UiButton
          type="submit"
          :loading="loading"
          :disabled="disabled"
          class="wallet-btn sign-up-btn box-shadow w-full"
        >
          {{ t('Auth.recover') }}
        </UiButton>
      </form>

      <!-- Form 2: Password Change -->
      <form
        v-else
        class="custom-wrapper form sign-up-form"
        @submit.prevent="changePassword"
      >
        <UiInput
          v-model="password"
          :disabled="disabled"
          type="password"
          autocomplete="new-password"
          :label="t('Auth.enter_new_password')"
          :placeholder="t('Auth.new_password')"
          class="mb-6"
        />

        <UiInput
          v-model="confirmPassword"
          :disabled="disabled"
          type="password"
          autocomplete="new-password"
          :label="t('Auth.confirm_password')"
          :placeholder="t('Auth.confirm_password')"
          class="mb-6"
        />

        <UiButton
          type="submit"
          :loading="loading"
          :disabled="disabled"
          class="wallet-btn sign-up-btn box-shadow w-full"
        >
          {{ t('Auth.change_password') }}
        </UiButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useSystemStore} from "~/stores/system";
import {useAuthStore} from "#imports";

definePageMeta({
  layout: 'auth'
});

// Composables
const { t } = useI18n();
const { $api, $notify, $router, $route, $store } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Refs
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const disabled = ref(false);
const loading = ref(false);

// Computed
const recoveryEmail = computed(() => {
  return route.query.email as string;
});

const recoveryCode = computed(() => {
  return route.query.recoveryCode as string;
});

const passwordRegExp = computed(() => {
  return new RegExp(useSystemStore().regExp?.user?.password || '');
});

// Validation helpers
const isPasswordValid = (value: string): boolean => {
  return passwordRegExp.value.test(value);
};

const isPasswordConfirmed = (value: string): boolean => {
  return value === password.value;
};

// Methods
const recovery = async () => {
  // Simple validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value || !emailRegex.test(email.value)) {
    $notify({
      text: 'Please enter a valid email address',
      type: 'error',
    });
    return;
  }

  loading.value = true;
  disabled.value = true;

  try {
    await $api.user.sendPasswordRecovery({ login: email.value });

    $notify({
      text: t('Auth.password_recovery_sent'),
      type: 'success',
    });
  } catch (error) {
    console.error('Recovery error:', error);
    $notify({
      text: 'Failed to send recovery email',
      type: 'error',
    });
  } finally {
    loading.value = false;
    disabled.value = false;
  }
};

const changePassword = async () => {
  // Simple validation
  if (!password.value) {
    $notify({
      text: 'Please enter a new password',
      type: 'error',
    });
    return;
  }

  if (!confirmPassword.value) {
    $notify({
      text: 'Please confirm your password',
      type: 'error',
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    $notify({
      text: 'Passwords do not match',
      type: 'error',
    });
    return;
  }

  if (!isPasswordValid(password.value)) {
    $notify({
      text: 'Password does not meet requirements',
      type: 'error',
    });
    return;
  }

  loading.value = true;
  disabled.value = true;

  try {
    const { data } = await $api.user.changePasswordByCode({
      login: recoveryEmail.value,
      code: recoveryCode.value,
      password: password.value,
    });

    $notify({
      text: t('Auth.password_chagne_success'),
      type: 'success',
    });

    await useAuthStore().setUser(data);
    await useAuthStore().setToken(data.token, data.refreshToken);
    await router.replace('/cabinet/dashboard');
  } catch (error) {
    console.error('Change password error:', error);
    $notify({
      text: 'Failed to change password',
      type: 'error',
    });
  } finally {
    loading.value = false;
    disabled.value = false;
  }
};

// Head
useHead({
  title: 'Password Recovery'
});
</script>

<style scoped>
/* Additional custom styles if needed */
.password-recovery {
  margin-top: 40px;
}

.wallet-btn {
  box-shadow: 0px 9px 24px rgba(66, 118, 246, 0.4);
}

.sign-up-btn {
  @apply mt-4;
}
</style>
