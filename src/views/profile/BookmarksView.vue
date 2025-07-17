<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { VST } from '@/types/vst'
import Container from '@/components/ui/Container.vue'
import Grid from '@/components/ui/Grid.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import VSTCard from '@/components/features/vst/VSTCard.vue'

const router = useRouter()

const bookmarks = ref<VST[]>([])
const loading = ref(true)
const sortBy = ref<'newest' | 'oldest' | 'name' | 'price'>('newest')
const filterCategory = ref('')
const searchQuery = ref('')

const categories = [
  { id: 'synth', name: 'Synthétiseurs' },
  { id: 'effects', name: 'Effets' },
  { id: 'drums', name: 'Drums' },
  { id: 'samples', name: 'Samples' },
  { id: 'utility', name: 'Utilitaires' }
]

const mockBookmarks: VST[] = [
  {
    id: '1',
    name: 'Serum Pro',
    description: 'Synthétiseur wavetable avancé avec des capacités de modulation infinies',
    version: '2.1.0',
    price: 199,
    category: { id: 'synth', name: 'Synthétiseurs', slug: 'synth' },
    tags: ['wavetable', 'synth', 'modulation'],
    author: { id: 'xfer', username: 'Xfer Records', avatar: '/avatars/xfer.png' },
    image: '/vst-images/serum.jpg',
    images: ['/vst-images/serum-1.jpg'],
    downloadCount: 45000,
    rating: 4.8,
    ratingCount: 1250,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    isFree: false
  },
  {
    id: '2',
    name: 'Vital Synth',
    description: 'Synthétiseur wavetable moderne et gratuit avec interface intuitive',
    version: '1.5.5',
    price: 0,
    category: { id: 'synth', name: 'Synthétiseurs', slug: 'synth' },
    tags: ['wavetable', 'free', 'modern'],
    author: { id: 'matt', username: 'Matt Tytel', avatar: '/avatars/matt.png' },
    image: '/vst-images/vital.jpg',
    images: ['/vst-images/vital-1.jpg'],
    downloadCount: 85000,
    rating: 4.6,
    ratingCount: 890,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    isFree: true
  },
  {
    id: '3',
    name: 'FabFilter Pro-Q 3',
    description: 'Égaliseur professionnel avec analyse spectrale en temps réel',
    version: '3.24',
    price: 179,
    salePrice: 119,
    category: { id: 'effects', name: 'Effets', slug: 'effects' },
    tags: ['eq', 'mastering', 'professional'],
    author: { id: 'fabfilter', username: 'FabFilter', avatar: '/avatars/fabfilter.png' },
    image: '/vst-images/proq3.jpg',
    images: ['/vst-images/proq3-1.jpg'],
    downloadCount: 32000,
    rating: 4.9,
    ratingCount: 567,
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-10T11:00:00Z',
    isFree: false
  }
]

const filteredBookmarks = computed(() => {
  let filtered = [...bookmarks.value]

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(vst => 
      vst.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      vst.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      vst.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // Filter by category
  if (filterCategory.value) {
    filtered = filtered.filter(vst => vst.category.id === filterCategory.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price':
        return a.price - b.price
      default:
        return 0
    }
  })

  return filtered
})

const removeBookmark = (vstId: string) => {
  bookmarks.value = bookmarks.value.filter(vst => vst.id !== vstId)
}

const clearAllBookmarks = () => {
  bookmarks.value = []
}

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    bookmarks.value = mockBookmarks
    loading.value = false
  }, 1000)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Container>
      <div class="py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-light text-gray-900 mb-2">Mes Favoris</h1>
          <p class="text-gray-600">Gérez votre collection de plugins VST favoris</p>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div class="flex flex-col lg:flex-row gap-4 mb-4">
            <!-- Search -->
            <div class="flex-1">
              <Input
                v-model="searchQuery"
                type="search"
                placeholder="Rechercher dans vos favoris..."
                variant="rounded"
                :full-width="true"
              />
            </div>

            <!-- Category Filter -->
            <div class="lg:w-48">
              <select 
                v-model="filterCategory"
                class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes catégories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Sort -->
            <div class="lg:w-48">
              <select 
                v-model="sortBy"
                class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="name">Nom A-Z</option>
                <option value="price">Prix croissant</option>
              </select>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              {{ filteredBookmarks.length }} plugin{{ filteredBookmarks.length > 1 ? 's' : '' }} favori{{ filteredBookmarks.length > 1 ? 's' : '' }}
            </p>
            <Button 
              v-if="bookmarks.length > 0" 
              variant="ghost" 
              @click="clearAllBookmarks"
              class="cursor-pointer"
            >
              Tout supprimer
            </Button>
          </div>
        </div>

        <!-- Content -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-4 text-gray-600">Chargement de vos favoris...</p>
        </div>

        <div v-else-if="bookmarks.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">💔</div>
          <h3 class="text-2xl font-light text-gray-900 mb-2">Aucun favori</h3>
          <p class="text-gray-600 mb-6">Vous n'avez pas encore ajouté de plugins à vos favoris</p>
          <Button @click="router.push('/vst-gallery')" class="cursor-pointer">
            Découvrir des plugins
          </Button>
        </div>

        <div v-else-if="filteredBookmarks.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-2xl font-light text-gray-900 mb-2">Aucun résultat</h3>
          <p class="text-gray-600 mb-6">Aucun favori ne correspond à vos critères de recherche</p>
          <Button @click="searchQuery = ''; filterCategory = ''" class="cursor-pointer">
            Effacer les filtres
          </Button>
        </div>

        <div v-else>
          <Grid cols="3" gap="6">
            <div v-for="vst in filteredBookmarks" :key="vst.id" class="relative">
              <VSTCard :vst="vst" />
              
              <!-- Remove button -->
              <button
                @click="removeBookmark(vst.id)"
                class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                title="Retirer des favoris"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Grid>
        </div>
      </div>
    </Container>
  </div>
</template>