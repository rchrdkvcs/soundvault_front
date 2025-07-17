<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import type { VST } from '@/types/vst'
import { useAuthStore } from '@/stores/auth'
import Container from '@/components/ui/Container.vue'
import Grid from '@/components/ui/Grid.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import VSTCard from '@/components/features/vst/VSTCard.vue'

interface UserProfile {
  id: string
  username: string
  email: string
  bio: string
  avatar: string
  website?: string
  location?: string
  createdAt: string
  stats: {
    vstCount: number
    downloads: number
    followers: number
    following: number
  }
  vsts: VST[]
  isFollowing?: boolean
}

const authStore = useAuthStore()

const profile = ref<UserProfile | null>(null)
const loading = ref(true)
const activeTab = ref('vsts')
const followLoading = ref(false)

const mockProfile: UserProfile = {
  id: 'user1',
  username: 'BeatMaker2024',
  email: 'beatmaker@example.com',
  bio: "Producteur de musique électronique passionné depuis 10 ans. Spécialisé dans la création de synthétiseurs et d'effets innovants. Mes VST ont été téléchargés plus de 100,000 fois !",
  avatar: '/avatars/beatmaker.jpg',
  website: 'https://beatmaker2024.com',
  location: 'Paris, France',
  createdAt: '2020-03-15T10:30:00Z',
  stats: {
    vstCount: 15,
    downloads: 125000,
    followers: 2400,
    following: 180,
  },
  vsts: [
    {
      id: '1',
      name: 'Analog Warmth',
      description: 'Un plugin de saturation analogique chaleureux',
      version: '1.2.0',
      price: 29,
      category: { id: 'effects', name: 'Effets', slug: 'effects' },
      tags: ['analog', 'warmth', 'saturation'],
      author: { id: 'user1', username: 'BeatMaker2024', avatar: '/avatars/beatmaker.jpg' },
      image: '/vst-images/analog-warmth.jpg',
      images: ['/vst-images/analog-warmth.jpg'],
      downloadCount: 8500,
      rating: 4.6,
      ratingCount: 340,
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2023-01-15T10:00:00Z',
      isFree: false
    },
    {
      id: '2',
      name: 'Digital Reverb',
      description: 'Reverb numérique avec algorithmes avancés',
      version: '2.0.1',
      price: 39,
      category: { id: 'effects', name: 'Effets', slug: 'effects' },
      tags: ['reverb', 'digital', 'ambient'],
      author: { id: 'user1', username: 'BeatMaker2024', avatar: '/avatars/beatmaker.jpg' },
      image: '/vst-images/digital-reverb.jpg',
      images: ['/vst-images/digital-reverb.jpg'],
      downloadCount: 12200,
      rating: 4.8,
      ratingCount: 456,
      createdAt: '2023-02-20T10:00:00Z',
      updatedAt: '2023-02-20T10:00:00Z',
      isFree: false
    }
  ],
  isFollowing: false
}

const isOwnProfile = computed(() => {
  return authStore.user?.id === profile.value?.id
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long'
  })
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const toggleFollow = async () => {
  if (!profile.value) return
  
  followLoading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  profile.value.isFollowing = !profile.value.isFollowing
  if (profile.value.isFollowing) {
    profile.value.stats.followers++
  } else {
    profile.value.stats.followers--
  }
  
  followLoading.value = false
}

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    profile.value = mockProfile
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
          <p class="mt-4 text-gray-600">Chargement du profil...</p>
        </div>

        <div v-else-if="!profile" class="text-center py-12">
          <div class="text-6xl mb-4">😔</div>
          <h3 class="text-2xl font-light text-gray-900 mb-2">Profil non trouvé</h3>
          <p class="text-gray-600">Ce profil n'existe pas ou a été supprimé</p>
        </div>

        <div v-else class="space-y-8">
          <!-- Profile Header -->
          <Card>
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <img
                  :src="profile.avatar"
                  :alt="profile.username"
                  class="w-32 h-32 rounded-full object-cover"
                />
              </div>

              <!-- Info -->
              <div class="flex-1">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 class="text-2xl font-semibold text-gray-900">{{ profile.username }}</h1>
                    <p v-if="profile.location" class="text-gray-600 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {{ profile.location }}
                    </p>
                  </div>

                  <div class="flex gap-2">
                    <Button
                      v-if="!isOwnProfile"
                      @click="toggleFollow"
                      :disabled="followLoading"
                      :variant="profile.isFollowing ? 'outline' : 'primary'"
                    >
                      <span v-if="followLoading" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                      {{ profile.isFollowing ? 'Se désabonner' : 'Suivre' }}
                    </Button>
                    <Button v-if="isOwnProfile" variant="outline">
                      Modifier le profil
                    </Button>
                  </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div class="text-center">
                    <div class="text-xl font-semibold text-gray-900">{{ formatNumber(profile.stats.vstCount) }}</div>
                    <div class="text-sm text-gray-600">Plugins</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-semibold text-gray-900">{{ formatNumber(profile.stats.downloads) }}</div>
                    <div class="text-sm text-gray-600">Téléchargements</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-semibold text-gray-900">{{ formatNumber(profile.stats.followers) }}</div>
                    <div class="text-sm text-gray-600">Abonnés</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-semibold text-gray-900">{{ formatNumber(profile.stats.following) }}</div>
                    <div class="text-sm text-gray-600">Abonnements</div>
                  </div>
                </div>

                <!-- Bio -->
                <div class="space-y-3">
                  <p class="text-gray-700 leading-relaxed">{{ profile.bio }}</p>
                  <div class="flex items-center gap-4 text-sm text-gray-600">
                    <span>Membre depuis {{ formatDate(profile.createdAt) }}</span>
                    <a 
                      v-if="profile.website" 
                      :href="profile.website" 
                      target="_blank" 
                      class="text-blue-600 hover:text-blue-500 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                      Site web
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Tabs -->
          <div class="bg-white rounded-2xl border border-gray-200">
            <div class="border-b border-gray-200">
              <nav class="flex space-x-8 px-6">
                <button
                  @click="activeTab = 'vsts'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'vsts' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Plugins VST ({{ profile.stats.vstCount }})
                </button>
                <button
                  @click="activeTab = 'reviews'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'reviews' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Avis
                </button>
              </nav>
            </div>

            <div class="p-6">
              <!-- VST Tab -->
              <div v-if="activeTab === 'vsts'">
                <div v-if="profile.vsts.length === 0" class="text-center py-12">
                  <div class="text-6xl mb-4">🎵</div>
                  <h3 class="text-2xl font-light text-gray-900 mb-2">Aucun plugin</h3>
                  <p class="text-gray-600">{{ profile.username }} n'a pas encore publié de plugins</p>
                </div>

                <Grid v-else cols="3" gap="6">
                  <VSTCard 
                    v-for="vst in profile.vsts" 
                    :key="vst.id" 
                    :vst="vst"
                  />
                </Grid>
              </div>

              <!-- Reviews Tab -->
              <div v-if="activeTab === 'reviews'" class="text-center py-12">
                <div class="text-6xl mb-4">💬</div>
                <h3 class="text-2xl font-light text-gray-900 mb-2">Aucun avis</h3>
                <p class="text-gray-600">{{ profile.username }} n'a pas encore laissé d'avis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>