<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarksStore } from '@/stores/bookmarks'
import { useApi } from '@/composables/useApi'
import type { VST } from '@/types/vst'
import Container from '@/components/ui/Container.vue'
import Grid from '@/components/ui/Grid.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import VSTCard from '@/components/features/vst/VSTCard.vue'

const router = useRouter()
const bookmarksStore = useBookmarksStore()
const { get } = useApi()

const bookmarkedVsts = ref<VST[]>([])
const loading = ref(true)
const sortBy = ref<'newest' | 'oldest' | 'name' | 'price'>('newest')
const filterCategory = ref('')
const searchQuery = ref('')

const categories = ref<any[]>([])

const filteredBookmarks = computed(() => {
  let filtered = [...bookmarkedVsts.value]

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(
      (vst) =>
        vst.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        vst.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        vst.tags.some((tag) => tag.toLowerCase().includes(searchQuery.value.toLowerCase())),
    )
  }

  // Filter by category
  if (filterCategory.value) {
    filtered = filtered.filter((vst) => vst.category.id === filterCategory.value)
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
  bookmarksStore.removeBookmark(vstId)
  // Remove from local array too
  bookmarkedVsts.value = bookmarkedVsts.value.filter((vst) => vst.id !== vstId)
}

const clearAllBookmarks = () => {
  bookmarksStore.clearBookmarks()
  bookmarkedVsts.value = []
}

// Fetch VST details for bookmarked IDs
const fetchBookmarkedVsts = async () => {
  loading.value = true
  try {
    const bookmarkedIds = bookmarksStore.bookmarkedVsts
    if (bookmarkedIds.length === 0) {
      bookmarkedVsts.value = []
      return
    }

    // Fetch details for each bookmarked VST
    const vstPromises = bookmarkedIds.map((id) => get<any>(`/plugins/${id}`))
    const responses = await Promise.allSettled(vstPromises)

    bookmarkedVsts.value = responses
      .filter((result) => result.status === 'fulfilled' && (result.value as any).success)
      .map((result) => ((result as any).value as any).data)
  } catch (error) {
    console.error('Erreur lors du chargement des favoris:', error)
  } finally {
    loading.value = false
  }
}

// Fetch categories for filtering
const fetchCategories = async () => {
  try {
    const response = await get<any>('/categories')
    if (response.success) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchBookmarkedVsts()])
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
              {{ filteredBookmarks.length }} plugin{{
                filteredBookmarks.length > 1 ? 's' : ''
              }}
              favori{{ filteredBookmarks.length > 1 ? 's' : '' }}
            </p>
            <Button v-if="bookmarkedVsts.length > 0" variant="ghost" @click="clearAllBookmarks">
              Tout supprimer
            </Button>
          </div>
        </div>

        <!-- Content -->
        <div v-if="loading" class="text-center py-12">
          <div
            class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="mt-4 text-gray-600">Chargement de vos favoris...</p>
        </div>

        <div v-else-if="bookmarkedVsts.length === 0" class="text-center py-12">
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 class="text-2xl font-light text-gray-900 mb-2">Aucun favori</h3>
          <p class="text-gray-600 mb-6">Vous n'avez pas encore ajouté de plugins à vos favoris</p>
          <Button @click="router.push('/explore')"> Découvrir des plugins </Button>
        </div>

        <div v-else-if="filteredBookmarks.length === 0" class="text-center py-12">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 class="text-2xl font-light text-gray-900 mb-2">Aucun résultat</h3>
          <p class="text-gray-600 mb-6">Aucun favori ne correspond à vos critères de recherche</p>
          <Button
            @click="
              () => {
                searchQuery = ''
                filterCategory = ''
              }
            "
          >
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </Grid>
        </div>
      </div>
    </Container>
  </div>
</template>
