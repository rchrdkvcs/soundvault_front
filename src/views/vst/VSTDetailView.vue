<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { VST, VSTReview } from '@/types/vst'
import Container from '@/components/ui/Container.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'


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
  salePrice: 149,
  category: { id: 'synth', name: 'Synthétiseurs', slug: 'synth' },
  tags: ['wavetable', 'synth', 'modulation', 'edm', 'professional'],
  author: { 
    id: 'xfer', 
    username: 'Xfer Records',
    avatar: '/avatars/xfer.png'
  },
  image: '/vst-images/serum-1.jpg',
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
  rating: 4.8,
  ratingCount: 1250,
  downloadCount: 45000,
  isBookmarked: false,
  isFree: false,
  createdAt: '2023-01-15T10:00:00Z',
  updatedAt: '2023-12-10T14:30:00Z'
}

const mockReviews: VSTReview[] = [
  {
    id: '1',
    vstId: '1',
    userId: 'user1',
    user: {
      username: 'ProducerMax',
      avatar: '/avatars/producer.jpg'
    },
    rating: 5,
    comment: 'Incroyable synthétiseur ! Les possibilités sont infinies. J\'utilise Serum depuis des années et cette version Pro est encore meilleure.',
    createdAt: '2023-12-01T14:30:00Z'
  },
  {
    id: '2',
    vstId: '1',
    userId: 'user2',
    user: {
      username: 'BeatMaker',
      avatar: '/avatars/beatmaker.jpg'
    },
    rating: 4,
    comment: 'Très bon plugin, interface intuitive et son de qualité. Le seul bémol est la consommation CPU qui peut être importante.',
    createdAt: '2023-11-28T09:15:00Z'
  }
]

const isOnSale = ref(false)

const formatPrice = (price: number) => {
  return price === 0 ? 'Gratuit' : `${price}€`
}

const formatFileSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(0)} MB`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const renderStars = (rating: number) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= rating ? '★' : '☆')
  }
  return stars.join('')
}

const nextImage = () => {
  if (vst.value && currentImageIndex.value < vst.value.images.length - 1) {
    currentImageIndex.value++
  }
}

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const toggleBookmark = () => {
  if (vst.value) {
    vst.value.isBookmarked = !vst.value.isBookmarked
  }
}

const addReview = () => {
  if (newReview.value.comment.trim()) {
    const review: VSTReview = {
      id: Date.now().toString(),
      vstId: vst.value?.id || '',
      userId: 'current-user',
      user: {
        username: 'Vous',
        avatar: '/avatars/default.png'
      },
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      createdAt: new Date().toISOString()
    }
    
    reviews.value.unshift(review)
    newReview.value.comment = ''
    newReview.value.rating = 5
  }
}

onMounted(() => {
  setTimeout(() => {
    vst.value = mockVST
    reviews.value = mockReviews
    isOnSale.value = mockVST.salePrice !== undefined && mockVST.salePrice < mockVST.price
    loading.value = false
  }, 1000)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Container>
      <div class="py-8">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-4 text-gray-600">Chargement...</p>
        </div>

        <div v-else-if="!vst" class="text-center py-12">
          <div class="text-6xl mb-4">😔</div>
          <h3 class="text-2xl font-light text-gray-900 mb-2">Plugin non trouvé</h3>
          <p class="text-gray-600">Ce plugin n'existe pas ou a été supprimé</p>
        </div>

        <div v-else class="space-y-8">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-sm text-gray-600">
            <RouterLink to="/" class="hover:text-gray-900">Accueil</RouterLink>
            <span>›</span>
            <RouterLink to="/vst-gallery" class="hover:text-gray-900">Galerie</RouterLink>
            <span>›</span>
            <RouterLink :to="`/vst-gallery?category=${vst.category.id}`" class="hover:text-gray-900">
              {{ vst.category.name }}
            </RouterLink>
            <span>›</span>
            <span class="text-gray-900">{{ vst.name }}</span>
          </nav>

          <!-- Main Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Images and Info -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Image Gallery -->
              <Card>
                <div class="relative">
                  <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      :src="vst.images[currentImageIndex]"
                      :alt="`${vst.name} - Image ${currentImageIndex + 1}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  
                  <!-- Image Navigation -->
                  <button
                    v-if="currentImageIndex > 0"
                    @click="prevImage"
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  
                  <button
                    v-if="currentImageIndex < vst.images.length - 1"
                    @click="nextImage"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <!-- Image Indicators -->
                  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <button
                      v-for="(_, index) in vst.images"
                      :key="index"
                      @click="currentImageIndex = index"
                      :class="[
                        'w-2 h-2 rounded-full transition-colors',
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      ]"
                    />
                  </div>
                </div>
              </Card>

              <!-- Description -->
              <Card>
                <div class="space-y-4">
                  <h2 class="text-xl font-semibold text-gray-900">Description</h2>
                  <div class="prose prose-gray max-w-none">
                    <div v-if="showFullDescription || vst.description.length <= 300">
                      <p class="whitespace-pre-line text-gray-700 leading-relaxed">{{ vst.description }}</p>
                    </div>
                    <div v-else>
                      <p class="text-gray-700 leading-relaxed">{{ vst.description.substring(0, 300) }}...</p>
                      <button
                        @click="showFullDescription = true"
                        class="text-blue-600 hover:text-blue-500 font-medium mt-2"
                      >
                        Voir plus
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- Specifications -->
              <Card>
                <div class="space-y-4">
                  <h2 class="text-xl font-semibold text-gray-900">Spécifications</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 class="font-medium text-gray-900 mb-2">Système</h3>
                      <ul class="space-y-1 text-gray-600">
                        <li v-for="os in vst.requirements?.os" :key="os">{{ os }}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900 mb-2">Formats</h3>
                      <ul class="space-y-1 text-gray-600">
                        <li v-for="format in vst.requirements?.vstVersion" :key="format">{{ format }}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900 mb-2">Mémoire</h3>
                      <p class="text-gray-600">{{ vst.requirements?.memory }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900 mb-2">Espace disque</h3>
                      <p class="text-gray-600">{{ vst.requirements?.disk }}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Right Column - Purchase and Info -->
            <div class="space-y-6">
              <!-- Purchase Card -->
              <Card>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h1 class="text-2xl font-semibold text-gray-900">{{ vst.name }}</h1>
                      <RouterLink
                        :to="`/profile/${vst.author.id}`"
                        class="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        {{ vst.author.username }}
                      </RouterLink>
                    </div>
                    <button
                      @click="toggleBookmark"
                      :class="[
                        'p-2 rounded-full transition-colors',
                        vst.isBookmarked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'
                      ]"
                    >
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Rating -->
                  <div class="flex items-center gap-2">
                    <div class="flex text-yellow-400">
                      <span class="text-lg">{{ renderStars(Math.round(vst.rating || 0)) }}</span>
                    </div>
                    <span class="text-sm text-gray-600">{{ vst.rating }} ({{ vst.ratingCount }} avis)</span>
                  </div>

                  <!-- Price -->
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="text-3xl font-bold text-gray-900">
                        {{ formatPrice(vst.salePrice || vst.price) }}
                      </span>
                      <span v-if="isOnSale" class="text-lg text-gray-500 line-through">
                        {{ formatPrice(vst.price) }}
                      </span>
                    </div>
                    <Badge v-if="isOnSale" variant="success">
                      -{{ Math.round((1 - (vst.salePrice || 0) / vst.price) * 100) }}%
                    </Badge>
                  </div>

                  <!-- Actions -->
                  <div class="space-y-3">
                    <Button :full-width="true" size="lg">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L3 3m4 10h10"/>
                      </svg>
                      Acheter maintenant
                    </Button>
                    <Button variant="outline" :full-width="true">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      Télécharger démo
                    </Button>
                  </div>
                </div>
              </Card>

              <!-- Stats -->
              <Card>
                <div class="space-y-4">
                  <h3 class="font-semibold text-gray-900">Statistiques</h3>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Téléchargements</span>
                      <span class="font-medium">{{ vst.downloadCount?.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Version</span>
                      <span class="font-medium">{{ vst.version }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Taille</span>
                      <span class="font-medium">{{ formatFileSize(vst.fileSize || 0) }}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- Tags -->
              <Card>
                <div class="space-y-4">
                  <h3 class="font-semibold text-gray-900">Tags</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in vst.tags"
                      :key="tag"
                      class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- Reviews Section -->
          <Card>
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">
                Avis ({{ reviews.length }})
              </h2>

              <!-- Add Review -->
              <div class="border-t pt-6">
                <h3 class="font-medium text-gray-900 mb-4">Laisser un avis</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Note</label>
                    <div class="flex gap-1">
                      <button
                        v-for="rating in 5"
                        :key="rating"
                        @click="newReview.rating = rating"
                        :class="[
                          'text-2xl transition-colors',
                          rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                        ]"
                      >
                        ★
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                    <textarea
                      v-model="newReview.comment"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Partagez votre expérience avec ce plugin..."
                    />
                  </div>
                  <Button @click="addReview" :disabled="!newReview.comment.trim()">
                    Publier l'avis
                  </Button>
                </div>
              </div>

              <!-- Reviews List -->
              <div v-if="reviews.length > 0" class="space-y-4 border-t pt-6">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="flex gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    :src="review.user.avatar"
                    :alt="review.user.username"
                    class="w-10 h-10 rounded-full"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-gray-900">{{ review.user.username }}</span>
                      <span class="text-yellow-400">{{ renderStars(review.rating) }}</span>
                      <span class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</span>
                    </div>
                    <p class="text-gray-700">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  </div>
</template>