<template>
  <div class="registration-confirm sign-in flex flex-col items-center justify-center min-h-[600px]">
    <div class="w-full max-w-md">
      <h2 class="main-title text-2xl font-semibold text-center mb-4">
        {{ t('RegistrationConfirm.title') }}
      </h2>
      <p class="description text-center text-gray-600 mb-10">
        {{ t('RegistrationConfirm.description') }}
      </p>
    </div>
    <div class="mt-10 w-full max-w-md">
      <span class="not_recieved text-sm text-gray-500 block text-center mb-4">
        {{ t('RegistrationConfirm.not_recieved') }}
      </span>
      <UiButton
        class="registration-confirm__send-code mx-auto mt-6"
        :disabled="disabled"
        :loading="loading"
        @click="resend"
      >
        {{ t('RegistrationConfirm.resend') }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "~/stores/user";
import {useAuth, useAuthStore} from "#imports";

definePageMeta({
  layout: 'auth'
});

// Composables
const { t } = useI18n();
const { $auth, $api, $notify, $router, $route, $store } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Refs
const loading = ref(false);
const disabled = ref(false);

// Computed
const recoveryEmail = computed(() => {
  return route.query.email as string;
});

const recoveryCode = computed(() => {
  return route.query.recoveryCode as string;
});

// Methods
const resend = async () => {
  disabled.value = true;
  loading.value = true;

  try {
    await $api.user.sendApproveEmail({
      login: useAuthStore().user.login,
    });

    $notify({
      text: t('RegistrationConfirm.email_sent'),
      type: 'Success',
    });
  } catch (error) {
    console.error('Resend error:', error);
  } finally {
    loading.value = false;
    setTimeout(() => {
      disabled.value = false;
    }, 1000 * 60); // 1 minute cooldown
  }
};

// Middleware logic moved to onMounted
onMounted(async () => {
  if (route.query.email && route.query.code) {
    try {
      const { data } = await $api.user.confirmLogin({
        login: route.query.email as string,
        code: route.query.code as string,
      });

      if (data) {
        await useAuthStore().setUser(data);
        await useAuthStore().setToken(data.token, data.refreshToken);
        await router.replace('/cabinet/dashboard');
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      // Optionally redirect to sign-in on error
      // await router.replace('/sign-in');
    }
  } else if (!$auth.loggedIn) {
    await router.replace('/sign-in');
  }
});

// Head
useHead({
  title: 'Registration Confirm'
});
</script>

<style scoped>
/* Additional custom styles if needed */
.registration-confirm {
  margin-top: 40px;
}

.registration-confirm__send-code {
  display: flex;
  margin-top: 24px;
}
</style>
