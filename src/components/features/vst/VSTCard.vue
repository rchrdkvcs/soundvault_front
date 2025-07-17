<script setup lang="ts">
import { computed } from 'vue'
import type { VST } from '@/types/vst'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  vst: VST
}

const props = defineProps<Props>()

const formattedPrice = computed(() => {
  if (props.vst.price === 0) return 'Gratuit'
  return `${props.vst.price}€`
})

const isOnSale = computed(() => {
  return props.vst.salePrice !== undefined && props.vst.salePrice < props.vst.price
})

const displayPrice = computed(() => {
  if (isOnSale.value) return `${props.vst.salePrice}€`
  return formattedPrice.value
})
</script>

<template>
  <RouterLink :to="`/vst/${vst.id}`" class="block">
    <Card hover>
      <div class="space-y-4">
        <!-- Image -->
        <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <img 
            v-if="vst.image"
            :src="vst.image" 
            :alt="vst.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l6 6-6 6z" />
            </svg>
          </div>
        </div>

      <!-- Content -->
      <div class="space-y-3">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 truncate">{{ vst.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ vst.author.username }}</p>
          </div>
          <div class="flex items-center gap-2">
            <Badge v-if="isOnSale" variant="success" size="sm">-{{ Math.round((1 - vst.salePrice! / vst.price) * 100) }}%</Badge>
            <Badge variant="secondary" size="sm">{{ vst.category.name }}</Badge>
          </div>
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-600 line-clamp-2">{{ vst.description }}</p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="tag in vst.tags.slice(0, 3)" 
            :key="tag"
            class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-2">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-900">{{ displayPrice }}</span>
            <span v-if="isOnSale" class="text-sm text-gray-500 line-through">{{ formattedPrice }}</span>
          </div>
          <Button size="sm" variant="outline">
            Voir détails
          </Button>
        </div>
      </div>
    </div>
  </Card>
  </RouterLink>
</template>