<template>
  <AppCard class="SettingsPersonalInfo p-6">
    <h2 class="text-lg font-semibold text-color mb-4">
      {{ t('personal_info') }}
    </h2>

    <form
      class="SettingsPersonalInfo__inputs flex flex-col gap-4"
      @submit="handleUpdateUser"
    >
      <!-- Name Input -->
      <Field name="name" v-slot="{ field, errorMessage, meta } = {}">
        <UiInput
          v-bind="field"
          class="relative"
          :placeholder="t('your_name')"
          :label="t('change_name')"
          :error="errorMessage"
          @blur="field?.onBlur"
        />
      </Field>

      <!-- Phone Input -->
      <Field name="phone" v-slot="{ field, errorMessage, meta } = {}">
        <UiInput
          :placeholder="t('your_phone')"
          :label="t('your_phone')"
          :error="errorMessage"
        >
          <!-- PhoneMaskInput will be integrated here -->
          <input
            v-bind="field"
            type="tel"
            class="w-full h-full bg-transparent border-none outline-none text-color"
            :placeholder="t('your_phone')"
            @blur="field?.onBlur"
          />
        </UiInput>
      </Field>

      <!-- Telegram Input -->
      <Field name="telegram" v-slot="{ field, errorMessage, meta } = {}">
        <UiInput
          v-bind="field"
          placeholder="@nickname"
          label="Telegram"
          :error="errorMessage"
          @blur="field?.onBlur"
        />
      </Field>

      <!-- Buttons -->
      <div class="buttons flex justify-between items-center flex-wrap gap-5 mt-5 min-h-10">
        <UiButton
          v-if="!isMetamaskConnected"
          class="connect-link px-0 text-sm font-medium transition-all duration-300 hover:opacity-80"
          size="sm"
          theme="transparent"
          type="button"
          @click="connectMetamask"
        >
          {{ t('AppWallet.connect_via') }}
        </UiButton>

        <UiButton
          v-if="isDataChanged"
          size="sm"
          class="py-3 px-6 rounded-xl font-semibold ml-auto flex-1 max-w-60 bg-blue-600 text-white border-blue-600 transition-all duration-300 hover:bg-blue-700 hover:border-blue-700 hover:transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          :disabled="!meta.valid || loading"
          :loading="loading"
          type="submit"
        >
          {{ t('save') }}
        </UiButton>
      </div>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
// Types
import {Field, useField, useForm} from "vee-validate";

interface User {
  name: string
  phone: string
  telegram?: string
  media?: {
    telegram?: string
  }
}

interface FormData {
  name: string
  phone: string
  telegram: string
}

// Composables
const { t } = useI18n()
const { $api, $auth, $notify } = useNuxtApp()
const store = useMetamaskStore()
const userStore = useUserStore()

// Refs
const loading = ref<boolean>(false)

// Form setup with manual validation
const { handleSubmit, meta, values, setValues, resetForm } = useForm<FormData>({
  initialValues: {
    name: '',
    phone: '',
    telegram: ''
  }
})

// Define fields with useField for individual field control
const { value: name, errorMessage: nameError } = useField<string>('name',
  (value) => {
    if (!value || value.trim() === '') {
      return t('validation.required') || 'Name is required'
    }
    return true
  }
)

const { value: phone, errorMessage: phoneError } = useField<string>('phone',
  (value) => {
    if (!value) return true
    if (value.length < 10) {
      return t('validation.phone_invalid') || 'Phone number is invalid'
    }
    return true
  }
)

const { value: telegram, errorMessage: telegramError } = useField<string>('telegram',
  (value) => {
    if (!value) return true
    const telegramRegex = /^@[a-zA-Z0-9_]{5,32}$/
    if (!telegramRegex.test(value)) {
      return t('validation.telegram_invalid') || 'Telegram username is invalid'
    }
    return true
  }
)

// Computed
const isMetamaskConnected = computed((): boolean => {
  return store.IS_CONNECT || false
})

const user = computed((): User | null => {
  // Adjust this based on your actual user store structure
  const storeUser = userStore.user as any
  if (!storeUser) return null

  return {
    name: storeUser.name || '',
    phone: storeUser.phone || '',
    telegram: storeUser.media?.telegram || storeUser.telegram || ''
  }
})

const formData = computed<FormData>(() => ({
  name: name.value,
  phone: phone.value,
  telegram: telegram.value
}))

const isDataChanged = computed((): boolean => {
  if (!user.value) return false

  return (
    user.value.name !== name.value ||
    user.value.phone !== phone.value ||
    user.value.telegram !== telegram.value
  )
})

// Methods
const connectMetamask = (): void => {
  // Use alternative method to emit event
  const event = new CustomEvent('connectMetamask')
  useNuxtApp().$modal.open('openMetamaskBrowser')
  window.dispatchEvent(event)
}

const handleUpdateUser = handleSubmit(async (values: FormData): Promise<void> => {
  // Confirm changes
  const confirmed = window.confirm(t('confirm_user_update') || 'Are you sure to update the user?')
  if (!confirmed) return

  try {
    loading.value = true

    // Prepare data for API
    const updateData = {
      name: values.name,
      phone: values.phone,
      media: {
        telegram: values.telegram || undefined
      }
    }

    // Update user via API
    await $api.user.updateUser(updateData)

    // Update auth user
    if ($auth.user) {
      const updatedUser = {
        ...$auth.user,
        ...updateData
      }
      await $auth.setUser(updatedUser)
    }

    // Update user store
    if (userStore.user) {
      userStore.setUser({
        ...userStore.user,
        ...updateData
      })
    }

    // Show success notification
    $notify({
      title: t('success') || 'Success',
      text: t('user_updated') || 'User updated successfully',
      type: 'success',
      data: {
        icon: '✅',
        closable: true
      }
    })

  } catch (error: any) {
    console.error('User update error:', error)

    $notify({
      title: t('error') || 'Error',
      text: error?.response?.data?.message || t('update_error') || 'Failed to update user',
      type: 'error',
      data: {
        icon: '❌',
        closable: true
      }
    })
  } finally {
    loading.value = false
  }
})

const initializeForm = (): void => {
  if (user.value) {
    setValues({
      name: user.value.name || '',
      phone: user.value.phone || '',
      telegram: user.value.telegram || ''
    })
  }
}

// Watchers
watch(user, (newUser) => {
  if (newUser) {
    initializeForm()
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
/* Custom styles for form elements */
.SettingsPersonalInfo {
  :deep(.UiInput) {
    .input-wrapper {
      @apply transition-all duration-300;
    }

    &.error {
      .input-wrapper {
        @apply border-red-500;
      }
    }
  }
}

/* Expanded sidebar responsive design */
:global(.sidebar_expanded) {
  @media screen and (max-width: 780px) {
    .SettingsPersonalInfo {
      .buttons {
        @apply flex-col-reverse;

        & > * {
          @apply min-w-full;
        }

        .connect-link {
          @apply w-full text-center;
        }

        .sign-up-btn {
          @apply w-full max-w-none;
        }
      }
    }
  }
}

:global(.cabinet:not(.cabinet_mobile)) {
  @media screen and (max-width: 500px) {
    .SettingsPersonalInfo {
      .buttons {
        @apply flex-col-reverse;

        & > * {
          @apply min-w-full;
        }

        .connect-link {
          @apply w-full text-center;
        }

        .sign-up-btn {
          @apply w-full max-w-none;
        }
      }
    }
  }
}

:global(.cabinet_mobile) {
  .SettingsPersonalInfo {
    .buttons {
      @apply flex-col-reverse;

      & > * {
        @apply min-w-full;
      }

      .connect-link {
        @apply w-full text-center;
      }

      .sign-up-btn {
        @apply w-full max-w-none;
      }
    }
  }
}

/* Animation for save button */
.sign-up-btn {
  position: relative;
  overflow: hidden;
}

.sign-up-btn:not(:disabled)::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.sign-up-btn:not(:disabled):hover::before {
  left: 100%;
}

/* Validation error styles */
:deep(.error-message) {
  @apply text-red-500 text-xs mt-1;
}
</style>
