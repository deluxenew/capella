<script lang="ts" setup>
defineOptions({
  name: "PopupNotification",
})
</script>

<template>
  <notifications :duration="3000"
                 animation-name="slide-up" :close-on-click="true" :max="3"
                 class="notifications-wrapper">
    <template #body="props">
      <div
        class="notification mb-2 flex items-start justify-start gap-2 rounded-4 p-2 shadow  border-l-4 border-gray-200"
        :class="[
          ['dark', 'error', 'warn'].includes(props.item?.type || '') ? 'bg-dark' : 'bg-green',
        ]"
        @click="props.close"
      >
        <div class="flex flex-1 flex-col gap-1">
          <div
            v-if="props.item.title"
            class="text-xs"
            :class="[
              ['dark', 'error', 'warn'].includes(props.item?.type || '')
                ? 'text-white'
                : 'text-headline',
            ]"
          >
            {{ props.item.title }}
          </div>
          <div
            v-if="props.item.text"
            class="text-sm"
            :class="[
              ['dark', 'error', 'warn'].includes(props.item?.type || '')
                ? 'text-white'
                : 'text-headline',
            ]"
          >
            {{ props.item.text }}
          </div>
        </div>
      </div>
    </template>
  </notifications>
</template>

<style>
.notifications-wrapper {
  top: 0 !important;
  right: 8px !important;
  bottom: auto !important;
  left: 8px !important;
  width: auto !important;
}

.notifications-wrapper .vue-notification-wrapper {
  overflow: visible;
}
</style>
