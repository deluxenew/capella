<script setup lang="ts">
import {ModalsContainer} from 'vue-final-modal'

onMounted(async () => {
  const {getSession, refresh} = useAuth()
  // await  refresh()
  await getSession({force: true, onUnauthenticated: () => refresh()})

})


</script>

<template>
  <Html lang="ru">
  <Body>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
  <ModalsContainer/>
  </Body>
  </Html>
</template>

<style>
body::-webkit-scrollbar, html::-webkit-scrollbar {
  width: 0;
}
</style>
