<script setup lang="ts">
import {ModalsContainer} from 'vue-final-modal'
const PopupNotifications = defineAsyncComponent(() => import('~/components/PopupNotification.vue'))
</script>

<template>
  <Html lang="ru">
  <Body>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
  <ModalsContainer/>
<client-only>
  <popup-notification/>
</client-only>

  </Body>
  </Html>
</template>

<style>
body::-webkit-scrollbar, html::-webkit-scrollbar {
  width: 0;
}
</style>
