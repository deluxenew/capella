<template>
  <div class="settings pl-5 pr-5">

    <div class="flex flex-col lg:flex-row gap-6 wrapper">
      <!-- Left Column -->
      <div class="flex flex-col left-column flex-1 lg:flex-[10_8_370px] lg:border-r lg:border-border lg:pr-2">
        <Avatar class="mt-2" />
        <PersonalInfo class="mt-2" />
      </div>

      <!-- Right Column -->
      <div class="flex flex-col right-column flex-1 lg:flex-[8_10_290px] lg:pl-2">
        <Wallets class="mt-2" />
      </div>
    </div>

    <UiButton
      class="connect-link mt-3 ml-5 px-0 text-xs uppercase font-medium transition-all duration-300 hover:opacity-80"
      size="sm"
      theme="transparent"
      @click="logout"
    >
      {{ t('log_out') }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
// Components
import Avatar from "~/components/settings/Avatar.vue";
import PersonalInfo from "~/components/settings/PersonalInfo.vue";
import Wallets from "~/components/settings/Wallets.vue";
import {useAuthStore} from "#imports";

// Composables
const { t } = useI18n()
const { $filters, $api, $notify, $utils } = useNuxtApp()
const auth = useAuth()
const router = useRouter()

// Head configuration
useHead({
  title: $utils.hostToTitle?.(window?.location?.host)
})

// Layout
definePageMeta({
  layout: 'inner'
})

// Methods
const logout = async (): Promise<void> => {
  try {
    await $api.user.logout()

    useAuthStore().logout()
    // Navigate to sign-in page
    await router.replace('/sign-in')

    // Show success notification after navigation
    setTimeout(() => {
      $notify({
        title: t('Success') || 'Success',
        type: 'success',
        text: t('Auth.logout') || 'Logged out successfully',
        duration: 3000,
        data: {
          icon: '✅',
          closable: true
        }
      })
    }, 50)
  } catch (error: any) {
    console.error('Logout error:', error)

    // Show error notification
    $notify({
      title: t('Error') || 'Error',
      type: 'error',
      text: error?.message || t('logout_error') || 'Logout failed',
      duration: 5000,
      data: {
        icon: '❌',
        closable: true
      }
    })
  }
}
</script>

<style scoped>
/* Base styles */
.settings {
  min-height: calc(100vh - 2rem);
}

.page-title {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* Expanded sidebar responsive design */
:global(.cabinet:not(.cabinet_mobile).sidebar_expanded) {
  @media screen and (max-width: calc(900px + 320px - 125px)) {
    .settings {
      .wrapper {
        @apply flex-col;

        .left-column {
          @apply border-r-0 pr-0;
        }

        .right-column {
          @apply pl-0;
        }
      }
    }
  }
}

/* Custom breakpoint for sidebar expanded state */
@media screen and (max-width: 1095px) {
  :global(.cabinet.sidebar_expanded) {
    .settings {
      .wrapper {
        @apply flex-col;

        .left-column {
          @apply border-r-0 pr-0;
        }

        .right-column {
          @apply pl-0;
        }
      }
    }
  }
}

/* Standard mobile breakpoint */
@media screen and (max-width: 900px) {
  .settings {
    .wrapper {
      @apply flex-col;

      .left-column {
        @apply border-r-0 pr-0;
      }

      .right-column {
        @apply pl-0;
      }
    }
  }
}

/* Small mobile devices */
@media screen and (max-width: 480px) {
  .settings {
    @apply pl-1 pr-1;
  }

  .page-title {
    @apply text-base mb-2;
  }

  .connect-link {
    @apply ml-2 mt-2;
  }
}

/* Animation for logout button */
.connect-link {
  position: relative;
  overflow: hidden;
}

.connect-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.connect-link:hover::before {
  left: 100%;
}
</style>
