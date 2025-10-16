<template>
  <component
    :is="svgComponent"
  />
</template>

<script setup lang="ts">
interface Props {
  svg: string
  directory?: string
}

const props = withDefaults(defineProps<Props>(), {
  directory: 'icons'
})

// Динамический импорт SVG
const svgComponent = computed(() => {
  try {
    // Для Nuxt 3 используем import.meta.glob для динамических импортов
    const modules = import.meta.glob('~/assets/**/*.svg', {
      eager: true,
      import: 'default'
    })

    const path = `~/assets/${props.directory}/${props.svg}.svg`
    const module = modules[path]

    if (module) {
      return module
    }

    console.warn(`SVG not found: ${path}`)
    return null
  } catch (error) {
    console.error('Error loading SVG:', error)
    return null
  }
})
</script>
