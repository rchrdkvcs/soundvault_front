<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Bookmark, VST } from '@/types/user'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const bookmarks = ref<Bookmark[]>([])
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

const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    userId: 'current-user',
    vstId: '1',
    createdAt: '2024-01-20T10:30:00Z',
    vst: {
      id: '1',
      name: 'Serum Pro',
      description: 'Synthétiseur wavetable avancé avec des capacités de modulation infinies',
      version: '2.1.0',
      price: 199,
      category: { id: 'synth', name: 'Synthétiseurs', slug: 'synth' },
      tags: ['wavetable', 'synth', 'modulation'],
      author: { id: 'xfer', username: 'Xfer Records', avatar: '/avatars/xfer.png' },
      images: ['/vst-images/serum-1.jpg'],
      fileSize: 45 * 1024 * 1024,
      requirements: {
        os: ['Windows', 'macOS'],
        vstVersion: ['VST3', 'AU'],
        memory: '4GB RAM',
        disk: '500MB'
      },
      ratings: { average: 4.8, count: 1250 },
      downloads: 45000,
      isBookmarked: true,
      isFree: false,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    }
  },
  {
    id: '2',
    userId: 'current-user',
    vstId: '2',
    createdAt: '2024-01-18T14:20:00Z',
    vst: {
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
  },
  {
    id: '3',
    userId: 'current-user',
    vstId: '3',
    createdAt: '2024-01-15T09:45:00Z',
    vst: {
      id: '3',
      name: 'Drum Machine X',
      description: 'Machine à rythmes vintage avec samples authentiques',
      version: '3.0.1',
      price: 89,
      category: { id: 'drums', name: 'Drums', slug: 'drums' },
      tags: ['drums', 'vintage', 'samples'],
      author: { id: 'rhythm-labs', username: 'Rhythm Labs', avatar: '/avatars/rhythm-labs.png' },
      images: ['/vst-images/drum-machine.jpg'],
      fileSize: 200 * 1024 * 1024,
      requirements: {
        os: ['Windows', 'macOS'],
        vstVersion: ['VST3', 'AU'],
        memory: '8GB RAM',
        disk: '1GB'
      },
      ratings: { average: 4.5, count: 650 },
      downloads: 25000,
      isBookmarked: true,
      isFree: false,
      createdAt: '2024-01-12T16:30:00Z',
      updatedAt: '2024-01-12T16:30:00Z'
    }
  }
]

const filteredBookmarks = computed(() => {
  let result = [...bookmarks.value]
  
  // Filtrer par recherche
  if (searchQuery.value) {
    result = result.filter(bookmark =>
      bookmark.vst.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      bookmark.vst.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      bookmark.vst.author.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Filtrer par catégorie
  if (filterCategory.value) {
    result = result.filter(bookmark => bookmark.vst.category.id === filterCategory.value)
  }
  
  // Trier
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'name':
      result.sort((a, b) => a.vst.name.localeCompare(b.vst.name))
      break
    case 'price':
      result.sort((a, b) => a.vst.price - b.vst.price)
      break
  }
  
  return result
})

const removeBookmark = (bookmarkId: string) => {
  bookmarks.value = bookmarks.value.filter(bookmark => bookmark.id !== bookmarkId)
}

const removeAllBookmarks = () => {
  bookmarks.value = []
}

const toggleBookmark = (vst: VST) => {
  vst.isBookmarked = !vst.isBookmarked
  if (!vst.isBookmarked) {
    removeBookmark(bookmarks.value.find(b => b.vstId === vst.id)?.id || '')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const clearFilters = () => {
  searchQuery.value = ''
  filterCategory.value = ''
  sortBy.value = 'newest'
}

onMounted(() => {
  // Vérifier si l'utilisateur est connecté
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' })
    return
  }
  
  // Simuler le chargement des bookmarks
  setTimeout(() => {
    bookmarks.value = mockBookmarks
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold mb-2">Mes Favoris</h1>
        <p class="text-base-content/70">{{ filteredBookmarks.length }} VST en favoris</p>
      </div>
      
      <div class="flex gap-2 mt-4 md:mt-0">
        <button 
          v-if="bookmarks.length > 0"
          @click="removeAllBookmarks"
          class="btn btn-outline btn-error"
        >
          Supprimer tout
        </button>
        <RouterLink to="/vst-gallery" class="btn btn-primary">
          Découvrir des VST
        </RouterLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="card bg-base-200 shadow-lg mb-8">
      <div class="card-body">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="form-control flex-1">
            <div class="input-group">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Rechercher dans vos favoris..." 
                class="input input-bordered flex-1"
              />
              <button class="btn btn-square">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Category Filter -->
          <div class="form-control">
            <select v-model="filterCategory" class="select select-bordered">
              <option value="">Toutes les catégories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- Sort -->
          <div class="form-control">
            <select v-model="sortBy" class="select select-bordered">
              <option value="newest">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="name">Nom A-Z</option>
              <option value="price">Prix croissant</option>
            </select>
          </div>
          
          <!-- Clear Filters -->
          <button @click="clearFilters" class="btn btn-outline">
            Effacer
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
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

    <!-- Empty State -->
    <div v-else-if="bookmarks.length === 0" class="text-center py-16">
      <div class="text-8xl mb-6">📖</div>
      <h2 class="text-3xl font-bold mb-4">Aucun favori</h2>
      <p class="text-lg text-base-content/70 mb-8 max-w-md mx-auto">
        Vous n'avez pas encore ajouté de VST à vos favoris. Explorez la galerie pour découvrir des plugins intéressants !
      </p>
      <RouterLink to="/vst-gallery" class="btn btn-primary btn-lg">
        Découvrir des VST
      </RouterLink>
    </div>

    <!-- No Results -->
    <div v-else-if="filteredBookmarks.length === 0" class="text-center py-16">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-2xl font-semibold mb-2">Aucun résultat</h3>
      <p class="text-base-content/70 mb-4">Aucun favori ne correspond à vos critères de recherche</p>
      <button @click="clearFilters" class="btn btn-primary">Effacer les filtres</button>
    </div>

    <!-- Bookmarks Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="bookmark in filteredBookmarks" :key="bookmark.id" class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
        <figure class="px-6 pt-6">
          <img 
            :src="bookmark.vst.images[0] || '/placeholder-vst.jpg'" 
            :alt="bookmark.vst.name"
            class="rounded-xl h-48 w-full object-cover"
          />
        </figure>
        
        <div class="card-body">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="card-title text-lg">{{ bookmark.vst.name }}</h3>
              <p class="text-sm text-base-content/70 mb-2">par {{ bookmark.vst.author.username }}</p>
            </div>
            
            <div class="dropdown dropdown-left">
              <label tabindex="0" class="btn btn-ghost btn-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button @click="toggleBookmark(bookmark.vst)" class="text-error">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Supprimer des favoris
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <p class="text-sm text-base-content/80 mb-3 line-clamp-2">{{ bookmark.vst.description }}</p>
          
          <div class="flex items-center gap-2 mb-3">
            <div class="badge badge-primary">{{ bookmark.vst.category.name }}</div>
            <div v-if="bookmark.vst.isFree" class="badge badge-success">Gratuit</div>
            <div class="badge badge-warning">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              Favori
            </div>
          </div>
          
          <div class="flex items-center gap-2 mb-4">
            <div class="flex items-center gap-1">
              <div class="rating rating-sm">
                <div class="mask mask-star-2 bg-orange-400" :style="`width: ${bookmark.vst.ratings.average * 20}%`"></div>
              </div>
              <span class="text-sm">{{ bookmark.vst.ratings.average }}</span>
            </div>
            <span class="text-sm text-base-content/70">{{ bookmark.vst.downloads.toLocaleString() }} DL</span>
          </div>
          
          <div class="text-xs text-base-content/60 mb-4">
            Ajouté le {{ formatDate(bookmark.createdAt) }}
          </div>
          
          <div class="card-actions justify-between items-center">
            <span class="text-xl font-bold">
              {{ bookmark.vst.isFree ? 'Gratuit' : `${bookmark.vst.price}€` }}
            </span>
            
            <div class="flex gap-2">
              <RouterLink :to="`/vst/${bookmark.vst.id}`" class="btn btn-primary btn-sm">
                Voir détails
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="bookmarks.length > 0" class="mt-12">
      <div class="stats stats-horizontal shadow w-full">
        <div class="stat">
          <div class="stat-title">Total des favoris</div>
          <div class="stat-value text-primary">{{ bookmarks.length }}</div>
        </div>
        
        <div class="stat">
          <div class="stat-title">VST gratuits</div>
          <div class="stat-value text-success">{{ bookmarks.filter(b => b.vst.isFree).length }}</div>
        </div>
        
        <div class="stat">
          <div class="stat-title">VST payants</div>
          <div class="stat-value text-warning">{{ bookmarks.filter(b => !b.vst.isFree).length }}</div>
        </div>
        
        <div class="stat">
          <div class="stat-title">Valeur totale</div>
          <div class="stat-value text-secondary">
            {{ bookmarks.reduce((sum, b) => sum + b.vst.price, 0) }}€
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