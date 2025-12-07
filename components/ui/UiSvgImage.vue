<template>
  <client-only>
    <img
      :src="`${base}/icons/${svg}.svg`"
      :alt="svg"
      class="svg-image"
    />
  </client-only>
</template>

<script setup lang="ts">
interface Props {
  svg: string
  directory?: string
}

const props = withDefaults(defineProps<Props>(), {
  directory: 'icons'
})
const appConfig = useAppConfig()
const base = appConfig.app?.baseURL || ''
</script>
