<script setup lang="ts">
import {ModalsContainer} from 'vue-final-modal'
const PopupNotifications = defineAsyncComponent(() => import('~/components/PopupNotification.vue'))
const resizing = function () {
  usePageStore().setWindowSize({
    width: window.innerWidth,
    height: window.innerHeight,
  })
}
onMounted(() => {


  window.addEventListener('resize', resizing, false)
  resizing()
})
onBeforeUnmount(() =>{
  window.removeEventListener('resize', resizing, false)
} )
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
