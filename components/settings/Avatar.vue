<template>
  <AppCard class="Avatar p-6">
    <div class="wrapper flex items-center justify-between gap-5">
      <h2 class="text-lg font-semibold text-color">
        {{ t('avatar') }}
      </h2>

      <div class="buttons flex gap-2 ml-auto">
        <div class="WIP">
          <UiButton
            v-if="!avatar"
            :title="t('SettingsAvatar.hint.add')"
            class="mr-2"
            theme="outline"
            size="sm"
            @click="$modal.open('avatar')"
          >
            <UiSvgImage svg="camera2" class="w-5 h-5" />
          </UiButton>
        </div>

        <UiButton
          v-if="avatar"
          class="mr-2"
          theme="outline"
          size="sm"
          @click="handleRefresh"
        >
          <UiSvgImage svg="refresh" class="w-5 h-5" />
        </UiButton>

        <UiButton
          v-if="avatar"
          theme="outline"
          size="sm"
          @click="handleDelete"
        >
          <UiSvgImage svg="trash" class="w-5 h-5" />
        </UiButton>
      </div>

      <div class="smile flex-shrink-0 bg-white dark:bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center border border-border">
        <UiSvgImage
          :svg="avatar || 'smile'"
          class="w-6 h-6 text-color-svg"
        />
      </div>
    </div>

    <ModalAvatar />
  </AppCard>
</template>

<script setup lang="ts">
// Components

// Composables
import ModalAvatar from "~/components/settings/ModalAvatar.vue";

const { t } = useI18n()
const { $modal, $notify } = useNuxtApp()

// Props
interface Props {
  avatar?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  avatar: null
})

// Emits
const emit = defineEmits<{
  refresh: []
  delete: []
}>()

// Methods
const handleRefresh = (): void => {
  // TODO: Implement refresh avatar logic
  console.log('Refresh avatar')
  emit('refresh')

  $notify({
    text: t('SettingsAvatar.refresh_message') || 'Refreshing avatar...',
    type: 'info',
    data: { icon: '🔄' }
  })
}

const handleDelete = (): void => {
  // TODO: Implement delete avatar logic
  console.log('Delete avatar')
  emit('delete')

  $notify({
    text: t('SettingsAvatar.delete_message') || 'Avatar deleted successfully',
    type: 'success',
    data: { icon: '🗑️' }
  })
}
</script>

<style scoped>
/* Custom button styles */
.Avatar {
  :deep(.UiButton) {
    @apply rounded-xl p-2 border-border transition-all duration-300;

    &:hover {
      @apply transform -translate-y-1 shadow-md;
    }

    svg {
      path {
        stroke: var(--color);
        fill: transparent;
      }
    }
  }
}

/* Dark mode support */
:global(.dark) {
  .smile {
    @apply bg-raisin-black border-onyx;
  }
}

/* Animation for avatar container */
.smile {
  transition: all 0.3s ease;

  &:hover {
    @apply transform scale-110 shadow-lg;
  }
}

/* Loading state for buttons */
.Avatar {
  :deep(.UiButton[disabled]) {
    @apply opacity-50 cursor-not-allowed;

    &:hover {
      @apply transform-none shadow-none;
    }
  }
}
</style>
