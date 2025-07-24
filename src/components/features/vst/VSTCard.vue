<script setup lang="ts">
import { computed } from 'vue'
import type { VST } from '@/types/vst'
import { useBookmarksStore } from '@/stores/bookmarks'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  vst: VST
}

const props = defineProps<Props>()
const bookmarksStore = useBookmarksStore()

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

const isBookmarked = computed(() => {
  return bookmarksStore.isBookmarked(props.vst.id)
})

const toggleBookmark = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  bookmarksStore.toggleBookmark(props.vst.id)
}
</script>

<template>
  <RouterLink :to="`/vst/${vst.id}`" class="block h-full">
    <Card hover class="h-full flex flex-col relative">
      <!-- Bookmark Button -->
      <button
        @click="toggleBookmark"
        class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        :class="[
          isBookmarked
            ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
            : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500 shadow-md',
        ]"
        :title="isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </button>

      <div class="space-y-4 flex-1 flex flex-col">
        <!-- Image -->
        <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <img
            v-if="
              (vst.image && vst.image.trim() !== '') ||
              (vst.images && vst.images.length > 0 && vst.images[0] && vst.images[0].trim() !== '')
            "
            :src="vst.image || vst.images[0]"
            :alt="vst.name"
            class="w-full h-full object-cover"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          />
          <div
            v-if="
              !(
                (vst.image && vst.image.trim() !== '') ||
                (vst.images &&
                  vst.images.length > 0 &&
                  vst.images[0] &&
                  vst.images[0].trim() !== '')
              )
            "
            class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
          >
            <div class="text-center text-white">
              <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                />
              </svg>
              <span class="text-lg font-light">{{ vst.name.substring(0, 8) }}</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-3 flex-1 flex flex-col">
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">{{ vst.name }}</h3>
              <p class="text-sm text-gray-600 mt-1 truncate">{{ vst.author.username }}</p>
            </div>
            <div class="flex items-center gap-2 ml-2">
              <Badge v-if="isOnSale" variant="success" size="sm"
                >-{{ Math.round((1 - vst.salePrice! / vst.price) * 100) }}%</Badge
              >
              <Badge v-if="vst.category" variant="secondary" size="sm">{{
                vst.category.name
              }}</Badge>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-600 line-clamp-2 flex-1">{{ vst.description }}</p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1" v-if="vst.tags && vst.tags.length > 0">
            <span
              v-for="tag in vst.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-2 mt-auto">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-900">{{ displayPrice }}</span>
              <span v-if="isOnSale" class="text-sm text-gray-500 line-through">{{
                formattedPrice
              }}</span>
            </div>
            <Button size="sm" variant="outline"> Voir </Button>
          </div>
        </div>
      </div>
    </Card>
  </RouterLink>
</template>
