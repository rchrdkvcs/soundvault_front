<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  hover?: boolean
  border?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  hover: false,
  border: true,
  padding: 'md',
})

const baseClasses = 'bg-white rounded-2xl transition-all duration-200'

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const cardClasses = computed(() => [
  baseClasses,
  paddingClasses[props.padding],
  props.border ? 'border border-gray-200' : '',
  props.hover ? 'hover:border-gray-300' : '',
])
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>
