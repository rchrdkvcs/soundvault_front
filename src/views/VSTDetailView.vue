<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { VST, VSTReview } from '@/types/vst'

const route = useRoute()
const router = useRouter()

const vst = ref<VST | null>(null)
const reviews = ref<VSTReview[]>([])
const loading = ref(true)
const currentImageIndex = ref(0)
const showFullDescription = ref(false)

const newReview = ref({
  rating: 5,
  comment: ''
})

const mockVST: VST = {
  id: '1',
  name: 'Serum Pro',
  description: 'Serum Pro est un synthétiseur wavetable révolutionnaire qui redéfinit les possibilités de la synthèse moderne. Avec ses capacités de modulation infinies, ses filtres de haute qualité et son interface utilisateur intuitive, Serum Pro est devenu l\'outil de choix pour les producteurs du monde entier.\n\nCaractéristiques principales :\n• Synthèse wavetable avancée avec plus de 450 presets\n• Oscillateurs haute qualité avec anti-aliasing\n• Filtres multimode avec distorsion intégrée\n• Matrix de modulation flexible\n• Effets intégrés de qualité studio\n• Interface utilisateur moderne et responsive',
  version: '2.1.0',
  price: 199,
  category: { id: 'synth', name: 'Synthétiseurs', slug: 'synth' },
  tags: ['wavetable', 'synth', 'modulation', 'edm', 'professional'],
  author: { 
    id: 'xfer', 
    username: 'Xfer Records',
    avatar: '/avatars/xfer.png'
  },
  images: [
    '/vst-images/serum-1.jpg',
    '/vst-images/serum-2.jpg',
    '/vst-images/serum-3.jpg'
  ],
  downloadUrl: '/downloads/serum-pro-2.1.0.zip',
  demoUrl: '/demos/serum-demo.mp3',
  fileSize: 45 * 1024 * 1024,
  requirements: {
    os: ['Windows 10/11', 'macOS 10.15+'],
    vstVersion: ['VST3', 'AU', 'AAX'],
    memory: '4GB RAM minimum, 8GB recommandé',
    disk: '500MB d\'espace libre'
  },
  ratings: { average: 4.8, count: 1250 },
  downloads: 45000,
  isBookmarked: false,
  isFree: false,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
}

const mockReviews: VSTReview[] = [
  {
    id: '1',
    vstId: '1',
    userId: 'user1',
    user: { username: 'BeatMaker2024', avatar: '/avatars/user1.png' },
    rating: 5,
    comment: 'Incroyable ! Ce VST a complètement transformé ma production. La qualité sonore est exceptionnelle et les possibilités de modulation sont infinies.',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    vstId: '1',
    userId: 'user2',
    user: { username: 'ProducerX', avatar: '/avatars/user2.png' },
    rating: 4,
    comment: 'Très bon synthétiseur avec une interface claire. Quelques bugs mineurs mais rien de bloquant. Je recommande !',
    createdAt: '2024-01-18T09:15:00Z'
  },
  {
    id: '3',
    vstId: '1',
    userId: 'user3',
    user: { username: 'StudioMaster', avatar: '/avatars/user3.png' },
    rating: 5,
    comment: 'Un must-have pour tout producteur sérieux. La documentation est excellente et le support client réactif.',
    createdAt: '2024-01-16T16:45:00Z'
  }
]

const toggleBookmark = () => {
  if (vst.value) {
    vst.value.isBookmarked = !vst.value.isBookmarked
  }
}

const downloadVST = () => {
  if (vst.value?.downloadUrl) {
    window.open(vst.value.downloadUrl, '_blank')
  }
}

const playDemo = () => {
  if (vst.value?.demoUrl) {
    window.open(vst.value.demoUrl, '_blank')
  }
}

const submitReview = () => {
  const review: VSTReview = {
    id: Date.now().toString(),
    vstId: vst.value!.id,
    userId: 'current-user',
    user: { username: 'Vous', avatar: '/avatars/current-user.png' },
    rating: newReview.value.rating,
    comment: newReview.value.comment,
    createdAt: new Date().toISOString()
  }
  
  reviews.value.unshift(review)
  newReview.value.comment = ''
  newReview.value.rating = 5
}

const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  const vstId = route.params.id as string
  // Simulation d'un appel API
  setTimeout(() => {
    vst.value = mockVST
    reviews.value = mockReviews
    loading.value = false
  }, 500)
})
</script>

<template>
  <div v-if="loading" class="container mx-auto px-4 py-8">
    <div class="skeleton h-8 w-64 mb-4"></div>
    <div class="skeleton h-64 w-full mb-8"></div>
    <div class="skeleton h-32 w-full"></div>
  </div>
  
  <div v-else-if="!vst" class="container mx-auto px-4 py-8 text-center">
    <div class="text-6xl mb-4">😕</div>
    <h2 class="text-2xl font-bold mb-2">VST non trouvé</h2>
    <p class="text-base-content/70 mb-4">Le plugin demandé n'existe pas ou a été supprimé</p>
    <RouterLink to="/vst-gallery" class="btn btn-primary">Retour à la galerie</RouterLink>
  </div>
  
  <div v-else class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <div class="breadcrumbs text-sm mb-6">
      <ul>
        <li><RouterLink to="/">Accueil</RouterLink></li>
        <li><RouterLink to="/vst-gallery">Galerie VST</RouterLink></li>
        <li>{{ vst.name }}</li>
      </ul>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <!-- Images -->
        <div class="mb-8">
          <div class="relative">
            <img 
              :src="vst.images[currentImageIndex] || '/placeholder-vst.jpg'"
              :alt="vst.name"
              class="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            
            <!-- Image Navigation -->
            <div v-if="vst.images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div class="flex gap-2">
                <button 
                  v-for="(image, index) in vst.images" 
                  :key="index"
                  @click="currentImageIndex = index"
                  :class="['w-3 h-3 rounded-full', currentImageIndex === index ? 'bg-white' : 'bg-white/50']"
                ></button>
              </div>
            </div>
          </div>
          
          <!-- Image Thumbnails -->
          <div v-if="vst.images.length > 1" class="flex gap-2 mt-4">
            <button 
              v-for="(image, index) in vst.images" 
              :key="index"
              @click="currentImageIndex = index"
              :class="['w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors', 
                      currentImageIndex === index ? 'border-primary' : 'border-transparent']"
            >
              <img :src="image" :alt="`${vst.name} ${index + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
        
        <!-- Description -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Description</h2>
          <div class="prose prose-lg max-w-none">
            <div v-if="!showFullDescription" class="line-clamp-6">
              {{ vst.description.split('\n')[0] }}
            </div>
            <div v-else class="whitespace-pre-line">
              {{ vst.description }}
            </div>
            <button 
              @click="showFullDescription = !showFullDescription"
              class="btn btn-link p-0 mt-2"
            >
              {{ showFullDescription ? 'Voir moins' : 'Voir plus' }}
            </button>
          </div>
        </div>
        
        <!-- System Requirements -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Configuration requise</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="font-semibold mb-2">Système d'exploitation</h3>
                <ul class="list-disc list-inside">
                  <li v-for="os in vst.requirements.os" :key="os">{{ os }}</li>
                </ul>
              </div>
            </div>
            
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="font-semibold mb-2">Formats supportés</h3>
                <ul class="list-disc list-inside">
                  <li v-for="format in vst.requirements.vstVersion" :key="format">{{ format }}</li>
                </ul>
              </div>
            </div>
            
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="font-semibold mb-2">Mémoire</h3>
                <p>{{ vst.requirements.memory }}</p>
              </div>
            </div>
            
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="font-semibold mb-2">Espace disque</h3>
                <p>{{ vst.requirements.disk }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Reviews -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Avis ({{ reviews.length }})</h2>
          
          <!-- Add Review Form -->
          <div class="card bg-base-200 mb-6">
            <div class="card-body">
              <h3 class="font-semibold mb-4">Laisser un avis</h3>
              
              <div class="form-control mb-4">
                <label class="label">
                  <span class="label-text">Note</span>
                </label>
                <div class="rating">
                  <input 
                    v-for="i in 5" 
                    :key="i"
                    v-model="newReview.rating"
                    type="radio" 
                    :value="i"
                    class="mask mask-star-2 bg-orange-400"
                  />
                </div>
              </div>
              
              <div class="form-control mb-4">
                <label class="label">
                  <span class="label-text">Commentaire</span>
                </label>
                <textarea 
                  v-model="newReview.comment"
                  class="textarea textarea-bordered h-24"
                  placeholder="Partagez votre expérience avec ce VST..."
                ></textarea>
              </div>
              
              <button 
                @click="submitReview"
                :disabled="!newReview.comment.trim()"
                class="btn btn-primary"
              >
                Publier l'avis
              </button>
            </div>
          </div>
          
          <!-- Reviews List -->
          <div class="space-y-4">
            <div v-for="review in reviews" :key="review.id" class="card bg-base-100 shadow">
              <div class="card-body">
                <div class="flex items-center gap-3 mb-3">
                  <div class="avatar">
                    <div class="w-10 h-10 rounded-full">
                      <img :src="review.user.avatar || '/default-avatar.png'" :alt="review.user.username" />
                    </div>
                  </div>
                  <div>
                    <div class="font-semibold">{{ review.user.username }}</div>
                    <div class="text-sm text-base-content/70">{{ formatDate(review.createdAt) }}</div>
                  </div>
                  <div class="rating rating-sm ml-auto">
                    <div class="mask mask-star-2 bg-orange-400" :style="`width: ${review.rating * 20}%`"></div>
                  </div>
                </div>
                <p>{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="sticky top-4">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <h1 class="text-3xl font-bold">{{ vst.name }}</h1>
                <button @click="toggleBookmark" class="btn btn-ghost">
                  <svg class="w-6 h-6" :class="{ 'fill-current text-warning': vst.isBookmarked }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                </button>
              </div>
              
              <div class="flex items-center gap-2 mb-4">
                <div class="avatar">
                  <div class="w-8 h-8 rounded-full">
                    <img :src="vst.author.avatar || '/default-avatar.png'" :alt="vst.author.username" />
                  </div>
                </div>
                <RouterLink :to="`/profile/${vst.author.id}`" class="text-primary hover:underline">
                  {{ vst.author.username }}
                </RouterLink>
              </div>
              
              <div class="stats stats-vertical shadow mb-6">
                <div class="stat">
                  <div class="stat-title">Prix</div>
                  <div class="stat-value text-primary">
                    {{ vst.isFree ? 'Gratuit' : `${vst.price}€` }}
                  </div>
                </div>
                
                <div class="stat">
                  <div class="stat-title">Note</div>
                  <div class="stat-value">{{ vst.ratings.average }}/5</div>
                  <div class="stat-desc">{{ vst.ratings.count }} avis</div>
                </div>
                
                <div class="stat">
                  <div class="stat-title">Téléchargements</div>
                  <div class="stat-value">{{ vst.downloads.toLocaleString() }}</div>
                </div>
              </div>
              
              <div class="space-y-2 mb-6">
                <div class="badge badge-primary">{{ vst.category.name }}</div>
                <div v-if="vst.isFree" class="badge badge-success">Gratuit</div>
                <div v-for="tag in vst.tags" :key="tag" class="badge badge-outline">
                  {{ tag }}
                </div>
              </div>
              
              <div class="space-y-3">
                <button 
                  @click="downloadVST"
                  class="btn btn-primary w-full"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  {{ vst.isFree ? 'Télécharger gratuitement' : 'Acheter et télécharger' }}
                </button>
                
                <button 
                  v-if="vst.demoUrl"
                  @click="playDemo"
                  class="btn btn-outline w-full"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h10M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"/>
                  </svg>
                  Écouter la démo
                </button>
              </div>
              
              <div class="divider"></div>
              
              <div class="text-sm text-base-content/70 space-y-1">
                <div>Version: {{ vst.version }}</div>
                <div>Taille: {{ formatFileSize(vst.fileSize) }}</div>
                <div>Ajouté le: {{ formatDate(vst.createdAt) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-6 {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>