<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { redirectToAppropriatePage } = useAuth()

onMounted(() => {
  redirectToAppropriatePage()
})
</script>
