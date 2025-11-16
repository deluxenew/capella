<script setup lang="ts">
import {ModalsContainer} from 'vue-final-modal'

const {getSession} = useAuth()
await getSession({force: true})
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

<style >
body::-webkit-scrollbar, html::-webkit-scrollbar {
  width: 0px;
}
</style>
