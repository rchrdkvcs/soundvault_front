<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { VST, VSTFilter } from '@/types/vst'

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
    images: ['/vst-images/serum-1.jpg', '/vst-images/serum-2.jpg'],
    fileSize: 45 * 1024 * 1024,
    requirements: {
      os: ['Windows', 'macOS'],
      vstVersion: ['VST3', 'AU'],
      memory: '4GB RAM',
      disk: '500MB'
    },
    ratings: { average: 4.8, count: 1250 },
    downloads: 45000,
    isBookmarked: false,
    isFree: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Reverb Space',
    description: 'Plugin de réverbération avec des espaces acoustiques réalistes',
    version: '1.5.2',
    price: 0,
    category: { id: 'effects', name: 'Effets', slug: 'effects' },
    tags: ['reverb', 'space', 'effects'],
    author: { id: 'audio-dev', username: 'Audio Developer', avatar: '/avatars/audio-dev.png' },
    images: ['/vst-images/reverb-1.jpg'],
    fileSize: 12 * 1024 * 1024,
    requirements: {
      os: ['Windows', 'macOS', 'Linux'],
      vstVersion: ['VST3', 'AU', 'LV2'],
      memory: '2GB RAM',
      disk: '100MB'
    },
    ratings: { average: 4.2, count: 890 },
    downloads: 12000,
    isBookmarked: true,
    isFree: true,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  }
]

const filteredVSTs = computed(() => {
  let result = [...mockVSTs]
  
  if (filters.search) {
    result = result.filter(vst => 
      vst.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
      vst.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
      vst.tags.some(tag => tag.toLowerCase().includes(filters.search!.toLowerCase()))
    )
  }
  
  if (filters.category) {
    result = result.filter(vst => vst.category.id === filters.category)
  }
  
  if (filters.isFree !== undefined) {
    result = result.filter(vst => vst.isFree === filters.isFree)
  }
  
  if (filters.priceRange) {
    result = result.filter(vst => 
      vst.price >= filters.priceRange!.min && vst.price <= filters.priceRange!.max
    )
  }
  
  // Tri
  switch (filters.sortBy) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.ratings.average - a.ratings.average)
      break
    case 'downloads':
      result.sort((a, b) => b.downloads - a.downloads)
      break
  }
  
  return result
})

const toggleBookmark = (vst: VST) => {
  vst.isBookmarked = !vst.isBookmarked
}

const applyFilters = () => {
  const query: Record<string, string> = {}
  
  if (filters.search) query.search = filters.search
  if (filters.category) query.category = filters.category
  if (filters.isFree !== undefined) query.free = filters.isFree.toString()
  if (filters.priceRange?.min !== 0) query.minPrice = filters.priceRange.min.toString()
  if (filters.priceRange?.max !== 200) query.maxPrice = filters.priceRange.max.toString()
  if (filters.sortBy !== 'newest') query.sortBy = filters.sortBy
  
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
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold mb-2">Galerie VST</h1>
        <p class="text-base-content/70">Découvrez {{ filteredVSTs.length }} plugins disponibles</p>
      </div>
      
      <div class="flex gap-2 mt-4 md:mt-0">
        <button @click="showFilters = !showFilters" class="btn btn-outline">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
          </svg>
          Filtres
        </button>
        
        <select v-model="filters.sortBy" @change="applyFilters" class="select select-bordered">
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Filters -->
      <div v-if="showFilters" class="w-full lg:w-80">
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Filtres</h2>
              <button @click="clearFilters" class="btn btn-ghost btn-sm">Effacer</button>
            </div>
            
            <!-- Search -->
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Recherche</span>
              </label>
              <input 
                v-model="filters.search"
                @input="applyFilters"
                type="text" 
                placeholder="Nom, description, tags..." 
                class="input input-bordered"
              />
            </div>
            
            <!-- Category -->
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Catégorie</span>
              </label>
              <select v-model="filters.category" @change="applyFilters" class="select select-bordered">
                <option value="">Toutes les catégories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }} ({{ category.count }})
                </option>
              </select>
            </div>
            
            <!-- Price Filter -->
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Prix</span>
              </label>
              <div class="flex gap-2">
                <input 
                  v-model.number="filters.priceRange.min"
                  @change="applyFilters"
                  type="number" 
                  min="0"
                  placeholder="Min"
                  class="input input-bordered flex-1"
                />
                <input 
                  v-model.number="filters.priceRange.max"
                  @change="applyFilters"
                  type="number" 
                  min="0"
                  placeholder="Max"
                  class="input input-bordered flex-1"
                />
              </div>
            </div>
            
            <!-- Free Filter -->
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Gratuit uniquement</span>
                <input 
                  v-model="filters.isFree"
                  @change="applyFilters"
                  type="checkbox" 
                  class="checkbox checkbox-primary"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- VST Grid -->
      <div class="flex-1">
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <div class="skeleton h-4 w-3/4 mb-2"></div>
              <div class="skeleton h-4 w-1/2 mb-4"></div>
              <div class="skeleton h-32 w-full mb-4"></div>
              <div class="skeleton h-4 w-full"></div>
            </div>
          </div>
        </div>
        
        <div v-else-if="filteredVSTs.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-2xl font-semibold mb-2">Aucun VST trouvé</h3>
          <p class="text-base-content/70 mb-4">Essayez de modifier vos filtres de recherche</p>
          <button @click="clearFilters" class="btn btn-primary">Effacer les filtres</button>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="vst in filteredVSTs" :key="vst.id" class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <figure class="px-6 pt-6">
              <img 
                :src="vst.images[0] || '/placeholder-vst.jpg'" 
                :alt="vst.name"
                class="rounded-xl h-48 w-full object-cover"
              />
            </figure>
            
            <div class="card-body">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="card-title text-lg">{{ vst.name }}</h3>
                  <p class="text-sm text-base-content/70 mb-2">par {{ vst.author.username }}</p>
                </div>
                
                <button @click="toggleBookmark(vst)" class="btn btn-ghost btn-sm">
                  <svg class="w-5 h-5" :class="{ 'fill-current text-warning': vst.isBookmarked }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                </button>
              </div>
              
              <p class="text-sm text-base-content/80 mb-3 line-clamp-2">{{ vst.description }}</p>
              
              <div class="flex items-center gap-2 mb-3">
                <div class="badge badge-primary">{{ vst.category.name }}</div>
                <div v-if="vst.isFree" class="badge badge-success">Gratuit</div>
              </div>
              
              <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center gap-1">
                  <div class="rating rating-sm">
                    <div class="mask mask-star-2 bg-orange-400" style="width: 80%"></div>
                  </div>
                  <span class="text-sm">{{ vst.ratings.average }}</span>
                </div>
                <span class="text-sm text-base-content/70">{{ vst.downloads.toLocaleString() }} téléchargements</span>
              </div>
              
              <div class="card-actions justify-between items-center">
                <span class="text-xl font-bold">
                  {{ vst.isFree ? 'Gratuit' : `${vst.price}€` }}
                </span>
                
                <div class="flex gap-2">
                  <RouterLink :to="`/vst/${vst.id}`" class="btn btn-primary btn-sm">
                    Détails
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>