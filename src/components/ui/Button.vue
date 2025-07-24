<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  to?: string
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
  fullWidth: false,
})

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

const variantClasses = computed(() => ({
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border bg-white border-blue-600 text-blue-600 hover:bg-blue-50',
  outline:
    'border border-gray-300 text-gray-700 hover:bg-white hover:border-blue-600 hover:text-blue-600',
  ghost: props.active
    ? 'font-semibold text-blue-500 hover:bg-gray-100'
    : 'text-gray-700 hover:bg-gray-100',
}))

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const buttonClasses = computed(() => [
  baseClasses,
  variantClasses.value[props.variant],
  sizeClasses[props.size],
  props.fullWidth ? 'w-full' : '',
])
</script>

<template>
  <button :class="buttonClasses" :type="props.type" :disabled="props.disabled" v-if="!props.to">
    <slot />
  </button>
  <RouterLink
    v-else
    :to="props.to"
    :class="buttonClasses"
    :aria-disabled="props.disabled ? 'true' : 'false'"
  >
    <slot />
  </RouterLink>
</template>
