<script setup lang="ts">
interface Props {
  cols?: '1' | '2' | '3' | '4' | '5' | '6' | '12'
  gap?: '2' | '4' | '6' | '8' | '12'
  responsive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cols: '3',
  gap: '6',
  responsive: true
})

const baseClasses = 'grid'

const colsClasses = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
  '6': 'grid-cols-6',
  '12': 'grid-cols-12'
}

const gapClasses = {
  '2': 'gap-2',
  '4': 'gap-4',
  '6': 'gap-6',
  '8': 'gap-8',
  '12': 'gap-12'
}

const responsiveClasses = props.responsive ? 'grid-cols-1 md:grid-cols-2 lg:' : ''

const gridClasses = `${baseClasses} ${responsiveClasses}${colsClasses[props.cols]} ${gapClasses[props.gap]}`
</script>

<template>
  <div :class="gridClasses">
    <slot />
  </div>
</template>