<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { UserProfile, VST } from '@/types/user'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
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
      images: ['/vst-images/analog-warmth.jpg'],
      fileSize: 8 * 1024 * 1024,
      requirements: {
        os: ['Windows', 'macOS'],
        vstVersion: ['VST3', 'AU'],
        memory: '2GB RAM',
        disk: '100MB',
      },
      ratings: { average: 4.6, count: 340 },
      downloads: 8500,
      isBookmarked: false,
      isFree: false,
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-10T14:20:00Z',
    },
    {
      id: '2',
      name: 'Bass Synth Pro',
      description: 'Synthétiseur de basse professionnel',
      version: '2.0.1',
      price: 0,
      category: { id: 'synth', name: 'Synthétiseurs', slug: 'synth' },
      tags: ['bass', 'synth', 'electronic'],
      author: { id: 'user1', username: 'BeatMaker2024', avatar: '/avatars/beatmaker.jpg' },
      images: ['/vst-images/bass-synth.jpg'],
      fileSize: 15 * 1024 * 1024,
      requirements: {
        os: ['Windows', 'macOS'],
        vstVersion: ['VST3', 'AU'],
        memory: '4GB RAM',
        disk: '200MB',
      },
      ratings: { average: 4.8, count: 890 },
      downloads: 15000,
      isBookmarked: true,
      isFree: true,
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-05T09:15:00Z',
    },
  ],
  bookmarks: [],
  isFollowing: false,
}

const isOwnProfile = computed(() => {
  return authStore.user?.id === profile.value?.id
})

const toggleFollow = async () => {
  if (!profile.value) return

  followLoading.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (profile.value.isFollowing) {
      profile.value.stats!.followers--
      profile.value.isFollowing = false
    } else {
      profile.value.stats!.followers++
      profile.value.isFollowing = true
    }
  } finally {
    followLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  const userId = route.params.id as string

  setTimeout(() => {
    profile.value = mockProfile
    loading.value = false
  }, 500)
})
</script>

<template>
  <div v-if="loading" class="container mx-auto px-4 py-8">
    <div class="flex items-center gap-6 mb-8">
      <div class="skeleton w-32 h-32 rounded-full"></div>
      <div class="flex-1">
        <div class="skeleton h-8 w-48 mb-2"></div>
        <div class="skeleton h-4 w-32 mb-4"></div>
        <div class="skeleton h-20 w-full"></div>
      </div>
    </div>

    <div class="skeleton h-64 w-full"></div>
  </div>

  <div v-else-if="!profile" class="container mx-auto px-4 py-8 text-center">
    <div class="text-6xl mb-4">👤</div>
    <h2 class="text-2xl font-bold mb-2">Profil non trouvé</h2>
    <p class="text-base-content/70 mb-4">L'utilisateur demandé n'existe pas</p>
    <RouterLink to="/" class="btn btn-primary">Retour à l'accueil</RouterLink>
  </div>

  <div v-else class="container mx-auto px-4 py-8">
    <!-- Profile Header -->
    <div class="card bg-base-200 mb-8">
      <div class="card-body">
        <div class="flex flex-col md:flex-row items-start gap-6">
          <!-- Avatar -->
          <div class="avatar">
            <div class="w-32 h-32 rounded-full">
              <img :src="profile.avatar || '/default-avatar.png'" :alt="profile.username" />
            </div>
          </div>

          <!-- Profile Info -->
          <div class="flex-1">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <div class="flex gap-4 justify-center items-center">
                  <h1 class="text-3xl font-bold">{{ profile.username }}</h1>
                  <button
                    v-if="!isOwnProfile"
                    @click="toggleFollow"
                    :disabled="followLoading"
                    :class="['btn', profile.isFollowing ? 'bg-base-100' : 'btn-primary']"
                  >
                    <span v-if="followLoading" class="loading loading-spinner loading-sm"></span>
                    {{ profile.isFollowing ? 'Ne plus suivre' : 'Suivre' }}
                  </button>
                </div>
                <p v-if="profile.location" class="text-base-content/70 flex items-center gap-1">
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

              <div class="flex gap-2 mt-4 md:mt-0">
                <a
                  v-if="profile.website"
                  :href="profile.website"
                  target="_blank"
                  class="btn btn-outline btn-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Site web
                </a>

                <RouterLink v-if="isOwnProfile" to="/profile/edit" class="btn btn-outline">
                  Modifier le profil
                </RouterLink>
              </div>
            </div>

            <!-- Bio -->
            <p v-if="profile.bio" class="text-base-content/80 mb-4 max-w-1/2">{{ profile.bio }}</p>

            <!-- Stats -->
            <div class="stats stats-horizontal mb-4 bg-base-100">
              <div class="stat">
                <div class="stat-title">VST créés</div>
                <div class="stat-value text-base-content/75">
                  {{ profile.stats?.vstCount || 0 }}
                </div>
              </div>

              <div class="stat">
                <div class="stat-title">Téléchargements</div>
                <div class="stat-value text-base-content/75">
                  {{ (profile.stats?.downloads || 0).toLocaleString() }}
                </div>
              </div>

              <div class="stat">
                <div class="stat-title">Followers</div>
                <div class="stat-value text-base-content/75">
                  {{ (profile.stats?.followers || 0).toLocaleString() }}
                </div>
              </div>

              <div class="stat">
                <div class="stat-title">Following</div>
                <div class="stat-value text-base-content/75">
                  {{ (profile.stats?.following || 0).toLocaleString() }}
                </div>
              </div>
            </div>

            <!-- Member since -->
            <div class="text-sm text-base-content/70">
              Membre depuis {{ formatDate(profile.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs tabs-boxed mb-8">
      <button @click="activeTab = 'vsts'" :class="['tab', { 'tab-active': activeTab === 'vsts' }]">
        VST créés ({{ profile.vsts.length }})
      </button>
      <button
        @click="activeTab = 'bookmarks'"
        :class="['tab', { 'tab-active': activeTab === 'bookmarks' }]"
      >
        Favoris ({{ profile.bookmarks.length }})
      </button>
    </div>

    <!-- VST Tab -->
    <div v-if="activeTab === 'vsts'">
      <div v-if="profile.vsts.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🎵</div>
        <h3 class="text-2xl font-semibold mb-2">Aucun VST créé</h3>
        <p class="text-base-content/70">
          {{
            isOwnProfile
              ? "Vous n'avez pas encore créé de VST"
              : "Cet utilisateur n'a pas encore créé de VST"
          }}
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="vst in profile.vsts" :key="vst.id" class="card bg-base-200">
          <figure class="px-6 pt-6">
            <img
              :src="vst.images[0] || '/placeholder-vst.jpg'"
              :alt="vst.name"
              class="rounded-xl h-48 w-full object-cover"
            />
          </figure>

          <div class="card-body">
            <h3 class="card-title text-lg">{{ vst.name }}</h3>
            <p class="text-sm text-base-content/80 mb-3 line-clamp-2">{{ vst.description }}</p>

            <div class="flex items-center gap-2 mb-3">
              <div class="badge badge-primary">{{ vst.category.name }}</div>
              <div v-if="vst.isFree" class="badge badge-success">Gratuit</div>
            </div>

            <div class="flex items-center gap-2 mb-4">
              <div class="flex items-center gap-1">
                <div class="rating rating-sm">
                  <div
                    class="mask mask-star-2 bg-orange-400"
                    :style="`width: ${vst.ratings.average * 20}%`"
                  ></div>
                </div>
                <span class="text-sm">{{ vst.ratings.average }}</span>
              </div>
              <span class="text-sm text-base-content/70"
                >{{ vst.downloads.toLocaleString() }} DL</span
              >
            </div>

            <div class="card-actions justify-between items-center">
              <span class="text-xl font-bold">
                {{ vst.isFree ? 'Gratuit' : `${vst.price}€` }}
              </span>

              <RouterLink :to="`/vst/${vst.id}`" class="btn btn-primary btn-sm">
                Voir détails
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bookmarks Tab -->
    <div v-if="activeTab === 'bookmarks'">
      <div v-if="profile.bookmarks.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📖</div>
        <h3 class="text-2xl font-semibold mb-2">Aucun favori</h3>
        <p class="text-base-content/70">
          {{
            isOwnProfile
              ? "Vous n'avez pas encore de VST en favoris"
              : "Cet utilisateur n'a pas de VST en favoris"
          }}
        </p>
        <RouterLink v-if="isOwnProfile" to="/vst-gallery" class="btn btn-primary mt-4">
          Découvrir des VST
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="vst in profile.bookmarks"
          :key="vst.id"
          class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
        >
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

              <div class="badge badge-warning">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>

            <p class="text-sm text-base-content/80 mb-3 line-clamp-2">{{ vst.description }}</p>

            <div class="flex items-center gap-2 mb-3">
              <div class="badge badge-primary">{{ vst.category.name }}</div>
              <div v-if="vst.isFree" class="badge badge-success">Gratuit</div>
            </div>

            <div class="card-actions justify-between items-center">
              <span class="text-xl font-bold">
                {{ vst.isFree ? 'Gratuit' : `${vst.price}€` }}
              </span>

              <RouterLink :to="`/vst/${vst.id}`" class="btn btn-primary btn-sm">
                Voir détails
              </RouterLink>
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
