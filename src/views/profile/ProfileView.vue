<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { VST } from '@/types/vst'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'
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

const route = useRoute()
const authStore = useAuthStore()
const { get, post, delete: deleteRequest } = useApi()

const profile = ref<UserProfile | null>(null)
const loading = ref(true)
const activeTab = ref('vsts')
const followLoading = ref(false)
const error = ref<string | null>(null)

// Fetch user profile data
const fetchProfile = async (userId: string) => {
  try {
    loading.value = true
    error.value = null

    const response = await get<any>(`/users/${userId}`)
    if (response.success) {
      profile.value = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email || '', // Non fourni par l'API publique
        bio: response.data.bio || '',
        avatar: response.data.avatarUrl || '',
        website: response.data.website || '',
        location: response.data.location || '',
        createdAt: response.data.joinedAt,
        stats: {
          vstCount: response.data.pluginCount || 0,
          downloads: 0, // Non fourni par l'API actuelle
          followers: 0, // Non fourni par l'API actuelle
          following: 0, // Non fourni par l'API actuelle
        },
        vsts: (response.data.plugins || []).map((plugin: any) => ({
          id: plugin.id,
          name: plugin.name,
          description: plugin.description,
          version: plugin.version,
          price: 0, // Non fourni par l'API actuelle
          category: plugin.category || { id: '', name: '', slug: '' },
          tags: [], // Non fourni par l'API actuelle
          author: {
            id: response.data.id,
            username: response.data.username,
            avatar: response.data.avatarUrl,
          },
          image: plugin.thumbnailUrl,
          images: plugin.thumbnailUrl ? [plugin.thumbnailUrl] : [],
          downloadCount: 0, // Non fourni par l'API actuelle
          rating: 0, // Non fourni par l'API actuelle
          ratingCount: 0, // Non fourni par l'API actuelle
          createdAt: plugin.createdAt,
          updatedAt: plugin.updatedAt,
          isFree: true, // Défaut pour l'instant
        })),
        isFollowing: false, // Non fourni par l'API actuelle
      }
    } else {
      error.value = 'Profil non trouvé'
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement du profil:', err)
    console.error('URL appelée:', `/users/${userId}`)
    console.error('Réponse complète:', err.response?.data)
    error.value = err.response?.data?.message || 'Erreur lors du chargement du profil'
  } finally {
    loading.value = false
  }
}

// Les VSTs sont déjà inclus dans la réponse du profil
// Pas besoin d'un appel séparé

const isOwnProfile = computed(() => {
  return authStore.user?.id === profile.value?.id
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
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
  try {
    const endpoint = profile.value.isFollowing
      ? `/users/${profile.value.id}/unfollow`
      : `/users/${profile.value.id}/follow`

    const response = profile.value.isFollowing
      ? await deleteRequest<any>(endpoint)
      : await post<any>(endpoint, {})

    if (response.success) {
      profile.value.isFollowing = !profile.value.isFollowing
      if (profile.value.isFollowing) {
        profile.value.stats.followers++
      } else {
        profile.value.stats.followers--
      }
    }
  } catch (err) {
    console.error('Erreur lors du suivi:', err)
  } finally {
    followLoading.value = false
  }
}

onMounted(() => {
  const userId = route.params.id as string
  console.log("ID utilisateur dans l'URL:", userId)
  if (userId) {
    fetchProfile(userId)
  } else {
    error.value = 'ID utilisateur manquant'
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Container>
      <div class="py-8">
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">Chargement du profil...</p>
        </div>

        <div v-else-if="error || !profile" class="text-center py-12">
          <svg
            class="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-2xl font-light text-gray-900 mb-2">{{ error || 'Profil non trouvé' }}</h3>
          <p class="text-gray-600">Ce profil n'existe pas ou a été supprimé</p>
        </div>

        <div v-else class="space-y-8">
          <!-- Profile Header -->
          <Card>
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <span
                  class="rounded-full bg-gray-200 w-24 h-24 flex items-center justify-center text-4xl font-bold text-gray-600"
                >
                  {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                </span>
              </div>

              <!-- Info -->
              <div class="flex-1">
                <div
                  class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"
                >
                  <div>
                    <h1 class="text-2xl font-semibold text-gray-900">{{ profile.username }}</h1>
                    <p v-if="profile.location" class="text-gray-600 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
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
                      <span
                        v-if="followLoading"
                        class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
                      ></span>
                      {{ profile.isFollowing ? 'Se désabonner' : 'Suivre' }}
                    </Button>
                    <Button v-if="isOwnProfile" variant="outline"> Modifier le profil </Button>
                  </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div class="text-center">
                    <div class="text-xl font-semibold text-gray-900">
                      {{ formatNumber(profile.stats.vstCount) }}
                    </div>
                    <div class="text-sm text-gray-600">Plugins</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-semibold text-gray-900">
                      {{ formatNumber(profile.stats.downloads) }}
                    </div>
                    <div class="text-sm text-gray-600">Téléchargements</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-semibold text-gray-900">
                      {{ formatNumber(profile.stats.followers) }}
                    </div>
                    <div class="text-sm text-gray-600">Abonnés</div>
                  </div>
                  <div class="text-center">
                    <div class="text-xl font-semibold text-gray-900">
                      {{ formatNumber(profile.stats.following) }}
                    </div>
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
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
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
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
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
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
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
                  <svg
                    class="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                    />
                  </svg>
                  <h3 class="text-2xl font-light text-gray-900 mb-2">Aucun plugin</h3>
                  <p class="text-gray-600">
                    {{ profile.username }} n'a pas encore publié de plugins
                  </p>
                </div>

                <Grid v-else cols="3" gap="6">
                  <VSTCard v-for="vst in profile.vsts" :key="vst.id" :vst="vst" />
                </Grid>
              </div>

              <!-- Reviews Tab -->
              <div v-if="activeTab === 'reviews'" class="text-center py-12">
                <svg
                  class="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
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
