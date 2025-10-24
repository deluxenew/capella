<template>
  <UiModal
    height="480"
    name="avatar"
    classes="modal-avatar"
    adaptive
  >
    <div class="modal-content flex flex-col h-full p-5">
      <!-- Modal Header -->
      <div class="modal-title flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-color">
          {{ t('SettingsAvatar.modal.title') }}
        </h2>
        <UiButton
          theme="icon"
          class="p-2 hover:bg-bg-secondary rounded-lg transition-colors duration-200"
          @click="$modal.close('avatar')"
        >
          <UiSvgImage
            svg="close"
            class="w-5 h-5 text-color-svg"
          />
        </UiButton>
      </div>

      <!-- Dropzone Area -->
      <UiDropzone
        v-model="avatars"
        class="flex-1 min-h-0"
        cropp-image
      />

      <!-- Save Button -->
      <UiButton
        class="save-avatar mt-5 mx-auto w-40 py-3 rounded-xl font-semibold transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        :disabled="!canSave"
        @click="handleSave"
      >
        {{ t('save') }}
      </UiButton>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
// Composables
const { t } = useI18n()
const { $modal, $notify } = useNuxtApp()

// Reactive data
const avatars = ref<File[]>([])

// Computed
const canSave = computed((): boolean => {
  return avatars.value.length > 0
})

// Methods
const handleSave = async (): Promise<void> => {
  if (!canSave.value) return

  try {
    // TODO: Implement avatar upload logic
    console.log('Saving avatars:', avatars.value)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show success notification
    $notify({
      title: t('success') || 'Success',
      text: t('SettingsAvatar.upload_success') || 'Avatar uploaded successfully',
      type: 'success',
      data: {
        icon: '✅',
        closable: true
      }
    })

    // Close modal
    $modal.close('avatar')

    // Reset avatars
    avatars.value = []

  } catch (error: any) {
    console.error('Avatar upload error:', error)

    // Show error notification
    $notify({
      title: t('error') || 'Error',
      text: error?.message || t('SettingsAvatar.upload_error') || 'Failed to upload avatar',
      type: 'error',
      data: {
        icon: '❌',
        closable: true
      }
    })
  }
}

// Watch for avatars changes
watch(avatars, (newAvatars) => {
  console.log('Selected avatars:', newAvatars)
}, { deep: true })

// Modal lifecycle
const handleModalOpen = () => {
  console.log('Avatar modal opened')
}

const handleModalClose = () => {
  console.log('Avatar modal closed')
  // Reset avatars when modal closes without saving
  avatars.value = []
}

// You can use modal events if your modal component supports them
// onMounted(() => {
//   $modal.on('open:avatar', handleModalOpen)
//   $modal.on('close:avatar', handleModalClose)
// })

// onUnmounted(() => {
//   $modal.off('open:avatar', handleModalOpen)
//   $modal.off('close:avatar', handleModalClose)
// })
</script>

<style scoped>
/* Modal content styles */
.modal-content {
  background: var(--bg-secondary);
  border-radius: 12px;
}

/* Save button styles */
.save-avatar {
  background: linear-gradient(135deg, var(--blue) 0%, var(--blue-darken) 100%);
  color: white;
  border: 1px solid var(--blue);
}

.save-avatar:not(:disabled):hover {
  background: linear-gradient(135deg, var(--blue-darken) 0%, var(--blue) 100%);
}

/* Dark mode support */
:global(.dark) {
  .modal-content {
    background: var(--raisin-black);
  }
}

/* Animation for modal content */
.modal-content {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom styles for UiDropzone */
:deep(.UiDropzone) {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--blue);
    background-color: rgba(66, 118, 246, 0.05);
  }
}

:deep(.UiDropzone.active) {
  border-color: var(--blue);
  background-color: rgba(66, 118, 246, 0.1);
}
</style>

<!--<style lang="scss">-->
<!--/* Global modal styles */-->
<!--.modal-avatar {-->
<!--  padding: 20px;-->

<!--  @media screen and (max-width: 768px) {-->
<!--    padding: 16px;-->
<!--  }-->

<!--  @media screen and (max-width: 480px) {-->
<!--    padding: 12px;-->
<!--  }-->

<!--  .modal-content {-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    height: 100%;-->

<!--    .modal-title {-->
<!--      font-size: 18px;-->
<!--      display: flex;-->
<!--      justify-content: space-between;-->
<!--      margin-bottom: 16px;-->

<!--      @media screen and (max-width: 768px) {-->
<!--        font-size: 16px;-->
<!--        margin-bottom: 12px;-->
<!--      }-->
<!--    }-->

<!--    .save-avatar {-->
<!--      margin: 20px auto 0 auto;-->
<!--      width: 160px;-->

<!--      @media screen and (max-width: 768px) {-->
<!--        margin-top: 16px;-->
<!--        width: 140px;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
