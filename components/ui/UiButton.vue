<template>
  <Component
    :is="tag"
    v-bind="componentProps"
    :class="buttonClasses"
    :disabled="loading || disabled"
  >
    <slot v-if="!loading" />

    <div v-else class="flex items-center justify-center">
      <AppLoader :size="loaderSize" />
    </div>
  </Component>
</template>

<script setup lang="ts">
// Types
interface Props {
  to?: string
  theme?: 'primary' | 'dark' | 'outline' | 'transparent' | 'gray' | 'icon' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  fill?: string
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  theme: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fill: '',
  external: false
})

// Computed
const tag = computed(() => {
  if (!props.to) return 'button'
  return props.external ? 'a' : 'nuxt-link'
})

const componentProps = computed(() => {
  if (!props.to) return {}

  if (props.external) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }

  return { to: props.to }
})

const loaderSize = computed(() => {
  const sizeMap = {
    xs: '5px',
    sm: '6px',
    md: '7px',
    lg: '12px',
    xl: '14px'
  }
  return sizeMap[props.size] || '7px'
})

// Classes
const baseClasses = 'inline-flex justify-center items-center transition-all duration-300 '

const themeClasses = computed(() => {
  const classes = {
    primary: 'bg-blue text-white hover:bg-blue-darken focus:ring-blue shadow-lg hover:shadow-blue disabled:bg-gray-lighten disabled:text-gray disabled:cursor-not-allowed',
    dark: 'bg-dark text-gray hover:text-blue hover:bg-blue/20 focus:ring-blue disabled:bg-gray-lighten disabled:text-gray-semi-lighten',
    outline: 'bg-transparent border border-border-color text-color hover:border-gray focus:ring-gray disabled:border-gray-lighten disabled:text-gray',
    transparent: 'bg-transparent text-color hover:bg-white/10 focus:ring-blue disabled:text-gray',
    gray: 'bg-color text-gray hover:text-blue focus:ring-blue disabled:bg-gray-lighten',
    icon: 'bg-transparent p-0 hover:bg-white/10 focus:ring-blue',
    link: 'bg-transparent p-0 text-color hover:text-blue focus:ring-blue underline disabled:text-gray'
  }
  return classes[props.theme] || classes.primary
})

const sizeClasses = computed(() => {
  const classes = {
    xs: 'px-2 py-1 text-xs font-medium rounded',
    sm: 'px-2 py-1 text-sm font-medium rounded-md',
    md: 'px-3 py-2 text-base font-medium rounded-lg',
    lg: 'px-3 py-2 text-base font-medium rounded-lg',
    xl: 'px-3 py-2 text-base font-medium rounded-lg',
  }
  return classes[props.size] || classes.md
})

const fillClasses = computed(() => {
  if (!props.fill) return ''
  return props.fill === 'white' ? 'fill-white' : ''
})

const buttonClasses = computed(() => [
  baseClasses,
  themeClasses.value,
  sizeClasses.value,
  fillClasses.value,
  { 'cursor-not-allowed opacity-50': props.loading || props.disabled }
])
</script>
