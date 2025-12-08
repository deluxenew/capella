<template>
  <div class="sign-up">
    <div class="main-block">
      <div class="content">
        <h2 class="main-title to-registration">
            {{ t('AuthHeader.sign_up') }}
        </h2>
        <form
          class="custom-wrapper form sign-up-form"
        >
          <UiInput
            v-model="invite"
            type="text"
            label="Invite code"
            placeholder="Enter invite"
          />
        </form>

        <div class="line"></div>
        <div class="custom-wrapper wallet-connect">
          <h3 class="title">{{ t('signUp.or_connect') }}</h3>
          <UiButton
            :loading="!loadingLogin && loadingMetamask"
            :disabled="loadingMetamask || loadingLogin"
            class="wallet-btn box-shadow"
            size="xs"
            @click="connect"
          >
            {{ t('connect_wallet') }}
          </UiButton>
        </div>
      </div>
    </div>
    <MetamaskHolder ref="metamask" @onError="handleMetamaskError" />
  </div>
</template>

<script setup lang="ts">
import { useMetamaskStore } from "~/stores/metamask";
import {useAuthStore} from "#imports";

definePageMeta({
  layout: 'auth'
});

// Types
interface RegisterParams {
  login?: string;
  password?: string;
  address?: string;
  source?: string;
  invite?: string;
}

interface EthereumProvider {
  request: (args: { method: string }) => Promise<string[]>;
}

const { t } = useI18n();

// Composables
const { $device, $notify, $modal, $router, $route, $api, $web3Parser } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const metamaskStore = useMetamaskStore();

// Refs
const loadingMetamask = ref(false);
const loadingLogin = ref(false);
const invite = ref(route.query.invite?.toString() || '');

// Computed
const address = computed(() => {
  return metamaskStore.METAMASK_ADDRESS;
});

const isMetamaskConnected = computed(() => {
  return metamaskStore.IS_CONNECT;
});

// Methods
const handleMetamaskError = () => {
  loadingMetamask.value = false;
};

const register = async (params: RegisterParams): Promise<void> => {
  try {
    loadingLogin.value = true;
    // TODO: Добавьте вашу логику регистрации здесь
    // await $api.auth.register(params)
    console.log('Registration attempt with:', params);

    // Временный редирект для демонстрации
    await router.replace('/cabinet/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    $notify({
      title: 'Error',
      type: 'error',
      text: t('Auth.error.auth') || 'Registration failed',
    });
  } finally {
    loadingLogin.value = false;
    loadingMetamask.value = false;
  }
};

const connect = async (): Promise<void> => {
  loadingMetamask.value = true;

  if (!window.ethereum) {
    if ($device.isIos || $device.isAndroid || $device.isEdge || $device.isMobile) {
      $modal.open('openMetamaskBrowser');
    } else {
      $notify({
        title: 'Error',
        type: 'error',
        text: 'Need install metamask extension or open page in metamask browser',
      });
    }
    loadingMetamask.value = false;
    return;
  }

  try {
    await $web3Parser.connect();

    if (useAuthStore().loggedIn && isMetamaskConnected.value) {
      await router.replace('/cabinet/dashboard');
    } else if (isMetamaskConnected.value) {
      await register({
        address: address.value,
        source: '', // Add your UTM source logic here
        invite: invite.value,
      });
    } else {
      // If connected but not logged in
      // $notify({
      //   title: 'Info',
      //   type: 'info',
      //   text: 'Please complete registration',
      // });
      loadingMetamask.value = false;
    }
  } catch (error) {
    console.error('Connection failed:', error);
    loadingMetamask.value = false;
  }
};

// Head
useHead({
  title: 'Sign Up'
});
</script>

<style scoped>
.sign-up {
  @apply w-full;
}

.main-block {
  @apply flex justify-center items-center;
}

.content {
  @apply w-full max-w-sm;
}

.main-title {
  @apply text-center mb-6;
}

.to-registration {
  @apply text-2xl font-medium;
}

.form {
  @apply mb-6;
}

.line {
  @apply border-t border-gray-200 my-6;
}

.title {
  @apply text-lg font-medium mb-4 text-center;
}

.wallet-btn {
  @apply w-full;
}

.box-shadow {
  box-shadow: 0px 9px 24px rgba(66, 118, 246, 0.4);
}
</style>
