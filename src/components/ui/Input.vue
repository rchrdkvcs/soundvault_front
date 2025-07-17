<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'search'
  disabled?: boolean
  error?: string
  label?: string
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'rounded'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  fullWidth: false,
  size: 'md',
  variant: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const baseClasses = 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const variantClasses = {
  default: 'rounded-md',
  rounded: 'rounded-full'
}

const inputClasses = computed(() => [
  baseClasses,
  sizeClasses[props.size],
  variantClasses[props.variant],
  props.fullWidth ? 'w-full' : '',
  props.error ? 'border-red-500 focus:ring-red-500' : ''
])
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
    />
    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>