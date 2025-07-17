<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { VST, VSTFilter } from '@/types/vst'
import Container from '@/components/ui/Container.vue'
import Grid from '@/components/ui/Grid.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Input from '@/components/ui/Input.vue'
import VSTCard from '@/components/features/vst/VSTCard.vue'

const route = useRoute()
const router = useRouter()

const vsts = ref<VST[]>([])
const loading = ref(false)
const showFilters = ref(false)

const filters = reactive<VSTFilter>({
  search: (route.query.search as string) || '',
  category: (route.query.category as string) || '',
  isFree: route.query.free === 'true' ? true : undefined,
  priceRange: {
    min: parseInt(route.query.minPrice as string) || 0,
    max: parseInt(route.query.maxPrice as string) || 200
  },
  sortBy: (route.query.sortBy as VSTFilter['sortBy']) || 'newest'
})

const categories = [
  { id: 'synth', name: 'Synthétiseurs', count: 245 },
  { id: 'effects', name: 'Effets', count: 189 },
  { id: 'drums', name: 'Drums', count: 156 },
  { id: 'samples', name: 'Samples', count: 312 },
  { id: 'utility', name: 'Utilitaires', count: 87 }
]

const sortOptions = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'downloads', label: 'Plus téléchargés' }
]

const mockVSTs: VST[] = [
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
    images: ['/vst-images/serum.jpg'],
    downloadCount: 15420,
    rating: 4.8,
    ratingCount: 1240,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-12-10T14:30:00Z',
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
    images: ['/vst-images/vital.jpg'],
    downloadCount: 25680,
    rating: 4.6,
    ratingCount: 890,
    createdAt: '2023-02-20T09:00:00Z',
    updatedAt: '2023-11-15T16:45:00Z',
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
    images: ['/vst-images/proq3.jpg'],
    downloadCount: 12340,
    rating: 4.9,
    ratingCount: 567,
    createdAt: '2023-03-10T11:00:00Z',
    updatedAt: '2023-12-05T13:20:00Z',
    isFree: false
  }
]

const filteredVSTs = computed(() => {
  return mockVSTs.filter(vst => {
    // Search filter
    if (filters.search && filters.search.trim() && !vst.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !vst.description.toLowerCase().includes(filters.search.toLowerCase()) &&
        !vst.tags.some(tag => tag.toLowerCase().includes(filters.search?.toLowerCase() || ''))) {
      return false
    }

    // Category filter
    if (filters.category && vst.category.id !== filters.category) {
      return false
    }

    // Free filter
    if (filters.isFree && !vst.isFree) {
      return false
    }

    // Price range filter
    if (filters.priceRange) {
      const price = vst.salePrice || vst.price
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false
      }
    }

    return true
  })
})

const applyFilters = () => {
  // Update URL with filters
  const query: Record<string, string> = {}
  
  if (filters.search) query.search = filters.search
  if (filters.category) query.category = filters.category
  if (filters.isFree) query.free = 'true'
  if (filters.priceRange) {
    query.minPrice = filters.priceRange.min.toString()
    query.maxPrice = filters.priceRange.max.toString()
  }
  if (filters.sortBy) query.sortBy = filters.sortBy

  router.push({ query })
}

const clearFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.isFree = undefined
  filters.priceRange = { min: 0, max: 200 }
  filters.sortBy = 'newest'
  router.push({ query: {} })
}

onMounted(() => {
  vsts.value = mockVSTs
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Container>
      <div class="py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-light text-gray-900 mb-2">Galerie VST</h1>
          <p class="text-gray-600">Découvrez et téléchargez les meilleurs plugins VST</p>
        </div>

        <!-- Filters Bar -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
              <Input
                v-model="filters.search"
                @input="applyFilters"
                type="search"
                placeholder="Rechercher des plugins..."
                variant="rounded"
                :full-width="true"
              />
            </div>

            <!-- Category Filter -->
            <div class="lg:w-48">
              <select 
                v-model="filters.category" 
                @change="applyFilters"
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
                v-model="filters.sortBy" 
                @change="applyFilters"
                class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Filters Toggle -->
            <Button 
              variant="outline" 
              @click="showFilters = !showFilters"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filtres
            </Button>
          </div>

          <!-- Advanced Filters -->
          <div v-if="showFilters" class="mt-6 pt-6 border-t border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Price Range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Prix</label>
                <div class="flex gap-2">
                  <input 
                    v-model.number="filters.priceRange!.min"
                    @change="applyFilters"
                    type="number" 
                    min="0"
                    placeholder="Min"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input 
                    v-model.number="filters.priceRange!.max"
                    @change="applyFilters"
                    type="number" 
                    min="0"
                    placeholder="Max"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Free Only -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div class="flex items-center">
                  <input 
                    v-model="filters.isFree"
                    @change="applyFilters"
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 text-sm text-gray-600">Gratuit uniquement</label>
                </div>
              </div>

              <!-- Clear Filters -->
              <div class="flex items-end">
                <Button variant="ghost" @click="clearFilters">
                  Effacer les filtres
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="filters.search || filters.category || filters.isFree" class="flex flex-wrap gap-2 mb-6">
          <Badge v-if="filters.search" variant="primary">
            Recherche: {{ filters.search }}
          </Badge>
          <Badge v-if="filters.category" variant="secondary">
            {{ categories.find(c => c.id === filters.category)?.name }}
          </Badge>
          <Badge v-if="filters.isFree" variant="success">
            Gratuit
          </Badge>
        </div>

        <!-- Results -->
        <div class="flex items-center justify-between mb-6">
          <p class="text-gray-600">
            {{ filteredVSTs.length }} plugin{{ filteredVSTs.length > 1 ? 's' : '' }} trouvé{{ filteredVSTs.length > 1 ? 's' : '' }}
          </p>
        </div>

        <!-- VST Grid -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-4 text-gray-600">Chargement...</p>
        </div>

        <div v-else-if="filteredVSTs.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-2xl font-light text-gray-900 mb-2">Aucun plugin trouvé</h3>
          <p class="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
          <Button @click="clearFilters">Effacer les filtres</Button>
        </div>

        <Grid v-else cols="3" gap="6">
          <VSTCard 
            v-for="vst in filteredVSTs" 
            :key="vst.id" 
            :vst="vst"
          />
        </Grid>
      </div>
    </Container>
  </div>
</template>