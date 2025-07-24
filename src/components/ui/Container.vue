<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
})

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-full',
}

const containerClasses = `${sizeClasses[props.size]} mx-auto px-4 sm:px-6 lg:px-8`
</script>

<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>
