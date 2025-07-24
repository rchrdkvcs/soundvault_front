<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import type { VST, VSTFilter } from '@/types/vst'
import Container from '@/components/ui/Container.vue'
import Grid from '@/components/ui/Grid.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import VSTCard from '@/components/features/vst/VSTCard.vue'
import Input from '@/components/ui/Input.vue'

const route = useRoute()
const router = useRouter()
const { get } = useApi()

const vsts = ref<VST[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const viewMode = ref<'explore' | 'gallery'>('explore')

const filters = reactive<VSTFilter>({
  search: (route.query.search as string) || '',
  category: (route.query.category as string) || '',
  isFree: route.query.free === 'true' ? true : undefined,
  priceRange: {
    min: parseInt(route.query.minPrice as string) || 0,
    max: parseInt(route.query.maxPrice as string) || 200,
  },
  sortBy: (route.query.sortBy as VSTFilter['sortBy']) || 'newest',
})

const sortOptions = [
  { value: 'date', label: 'Plus récents' },
  { value: 'name', label: 'Nom' },
  { value: 'downloads', label: 'Plus téléchargés' },
]

const collections = [
  {
    id: 'studio-essentials',
    title: 'Essentiels Studio',
    description: 'Les plugins indispensables pour votre home studio',
    count: 12,
    categoryFilter: 'essential',
  },
  {
    id: 'mastering-tools',
    title: 'Outils de Mastering',
    description: 'Perfectionnez vos mix avec ces plugins professionnels',
    count: 8,
    categoryFilter: 'mastering',
  },
  {
    id: 'synth-collection',
    title: 'Collection Synthé',
    description: 'Les meilleurs synthétiseurs virtuels du moment',
    count: 15,
    categoryFilter: 'synth',
  },
]

const quickCategories = [
  { id: 'trending', name: 'Tendances', filter: { sortBy: 'downloads' } },
  { id: 'new', name: 'Nouveautés', filter: { sortBy: 'newest' } },
  { id: 'featured', name: 'Sélection', filter: { isFree: false } },
  { id: 'free', name: 'Gratuits', filter: { isFree: true } },
]

const fetchPlugins = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.sortBy) params.append('sort', filters.sortBy)
    if (filters.isFree !== undefined) params.append('free', filters.isFree.toString())
    params.append('page', currentPage.value.toString())
    params.append('limit', '12')

    const response = await get<any>(`/plugins?${params.toString()}`)

    if (response.success) {
      vsts.value = response.data
      totalCount.value = response.meta.total
      totalPages.value = response.meta.lastPage
    }
  } catch (error) {
    console.error('Erreur lors du chargement des plugins:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await get<any>('/categories')
    if (response.success) {
      categories.value = response.data.map((cat: any) => ({
        id: cat.id,
        name: cat.label,
        count: cat.pluginCount,
        icon: getIconForCategory(cat.label),
      }))
    }
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

const getIconForCategory = (name: string) => {
  const iconMap: { [key: string]: string } = {
    Synthétiseur:
      'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
    Mastering:
      'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    Compresseur: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    Reverb:
      'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    Delay:
      'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    Filtre:
      'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z',
    Distorsion: 'M13 10V3L4 14h7v7l9-11h-7z',
    Drums:
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  }
  return iconMap[name] || 'M9 19V6l6 6-6 6z'
}

const filteredVSTs = computed(() => {
  let filtered = vsts.value

  if (filters.isFree !== undefined) {
    filtered = filtered.filter((vst) => vst.isFree === filters.isFree)
  }

  if (filters.priceRange) {
    filtered = filtered.filter((vst) => {
      const price = vst.salePrice || vst.price
      return price >= filters.priceRange!.min && price <= filters.priceRange!.max
    })
  }

  return filtered
})

const applyFilters = async () => {
  const query: Record<string, string> = {}

  if (filters.search) query.search = filters.search
  if (filters.category) query.category = filters.category
  if (filters.isFree !== undefined) query.free = filters.isFree.toString()
  if (filters.priceRange) {
    query.minPrice = filters.priceRange.min.toString()
    query.maxPrice = filters.priceRange.max.toString()
  }
  if (filters.sortBy) query.sortBy = filters.sortBy

  router.push({ query })

  currentPage.value = 1
  await fetchPlugins()
}

const applyQuickFilter = async (quickFilter: any) => {
  Object.assign(filters, quickFilter.filter)
  await applyFilters()
  viewMode.value = 'gallery'
}

const applyCollectionFilter = async (collection: any) => {
  filters.category = collection.categoryFilter
  await applyFilters()
  viewMode.value = 'gallery'
}

const clearFilters = async () => {
  filters.search = ''
  filters.category = ''
  filters.isFree = undefined
  filters.priceRange = { min: 0, max: 200 }
  filters.sortBy = 'newest'
  router.push({ query: {} })
  currentPage.value = 1
  viewMode.value = 'explore'
  await fetchPlugins()
}

const changePage = async (page: number) => {
  currentPage.value = page
  await fetchPlugins()
}

const switchToGalleryView = () => {
  viewMode.value = 'gallery'
}

const switchToExploreView = () => {
  viewMode.value = 'explore'
  clearFilters()
}

// Plugins populaires pour la page d'exploration
const popularPlugins = ref<VST[]>([])
const popularLoading = ref(false)

// Fetch popular plugins
const fetchPopularPlugins = async () => {
  popularLoading.value = true
  try {
    const response = await get<any>('/plugins?sort=downloads&limit=6')
    if (response.success) {
      popularPlugins.value = response.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement des plugins populaires:', error)
  } finally {
    popularLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchPlugins(), fetchPopularPlugins()])
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Container>
      <div class="py-8">
        <!-- Header with View Toggle -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-light text-gray-900 mb-2">
              {{ viewMode === 'explore' ? 'Explorer les VST' : 'Galerie VST' }}
            </h1>
            <p class="text-gray-600">Découvrez et téléchargez les meilleurs plugins VST</p>
          </div>

          <div class="flex gap-2">
            <Button
              :variant="viewMode === 'explore' ? 'primary' : 'outline'"
              @click="switchToExploreView"
            >
              Explorer
            </Button>
            <Button
              :variant="viewMode === 'gallery' ? 'primary' : 'outline'"
              @click="switchToGalleryView"
            >
              Galerie
            </Button>
          </div>
        </div>

        <!-- Explore Mode -->
        <div v-if="viewMode === 'explore'">
          <!-- Quick Categories -->
          <div class="flex flex-wrap gap-3 mb-8">
            <Button
              v-for="category in quickCategories"
              :key="category.id"
              variant="outline"
              @click="applyQuickFilter(category)"
            >
              {{ category.name }}
            </Button>
          </div>

          <!-- Featured Collections -->
          <div class="mb-12">
            <h2 class="text-2xl font-light text-gray-900 mb-6">Collections mises en avant</h2>
            <Grid cols="3" gap="6">
              <div
                v-for="collection in collections"
                :key="collection.id"
                @click="applyCollectionFilter(collection)"
                class="block cursor-pointer"
              >
                <Card hover>
                  <div class="space-y-4">
                    <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                      <div
                        class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      >
                        <span class="text-white text-2xl font-light">{{ collection.title }}</span>
                      </div>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-2">{{ collection.title }}</h3>
                      <p class="text-sm text-gray-600 mb-3">{{ collection.description }}</p>
                      <div class="flex items-center justify-between">
                        <Badge variant="secondary">{{ collection.count }} plugins</Badge>
                        <Button size="sm" variant="outline">Explorer</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </Grid>
          </div>

          <!-- Trending VSTs (Static) -->
          <div class="mb-12">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-light text-gray-900">Plugins populaires</h2>
              <Button variant="ghost" @click="switchToGalleryView">Voir tout</Button>
            </div>

            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-if="popularLoading" class="text-center py-8">
                  <div
                    class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                  ></div>
                  <p class="mt-2 text-gray-600 text-sm">Chargement...</p>
                </div>

                <div v-else-if="popularPlugins.length === 0" class="text-center py-8">
                  <p class="text-gray-600">Aucun plugin populaire disponible</p>
                </div>

                <RouterLink
                  v-else
                  v-for="plugin in popularPlugins"
                  :key="plugin.id"
                  :to="`/vst/${plugin.id}`"
                  class="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <div
                      class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                    >
                      <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">{{ plugin.name }}</h3>
                    <p class="text-sm text-gray-600">{{ plugin.author.username }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-sm font-medium text-gray-900">
                        {{ plugin.isFree ? 'Gratuit' : `${plugin.price}€` }}
                      </span>
                      <span v-if="plugin.downloadCount" class="text-xs text-gray-500">
                        {{ plugin.downloadCount }} téléchargements
                      </span>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Categories Grid -->
          <div>
            <h2 class="text-2xl font-light text-gray-900 mb-6">Catégories populaires</h2>
            <Grid cols="2" gap="4">
              <div
                v-for="category in categories.slice(0, 6)"
                :key="category.id"
                class="block cursor-pointer"
                @click="router.push({ name: 'Explore', query: { category: category.id } })"
              >
                <Card hover class="hover:bg-gray-50 group transition ease-in-out duration-200">
                  <div class="flex items-center gap-4 p-4">
                    <div
                      class="w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                      <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path :d="getIconForCategory(category.name)" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
                      <p class="text-sm text-gray-600">{{ category.count }} plugins</p>
                    </div>
                  </div>
                </Card>
              </div>
            </Grid>
          </div>
        </div>

        <!-- Gallery Mode -->
        <div v-else>
          <!-- Search Bar -->
          <div class="mb-8">
            <div class="max-w-2xl mx-auto">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    class="h-5 w-5 text-gray-500"
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
                </div>
                <input
                  v-model="filters.search"
                  @input="applyFilters"
                  type="search"
                  placeholder="Rechercher des plugins..."
                  class="block w-full pl-12 pr-4 py-4 text-lg border-0 bg-white rounded-full ring-1 ring-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Filter Pills -->
          <div class="flex flex-wrap gap-3 mb-8 justify-center">
            <!-- Category Pills -->
            <div class="flex flex-wrap gap-2">
              <button
                @click="clearFilters"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  !filters.category && !filters.isFree && !filters.search
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
              >
                Tous
              </button>

              <button
                v-for="category in categories.slice(0, 5)"
                :key="category.id"
                @click="
                  () => {
                    filters.category = category.id
                    applyFilters()
                  }
                "
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  filters.category === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
              >
                {{ category.name }}
              </button>

              <button
                @click="
                  () => {
                    filters.isFree = true
                    applyFilters()
                  }
                "
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  filters.isFree
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
              >
                Gratuit
              </button>
            </div>

            <!-- Sort dropdown -->
            <div class="relative">
              <select
                v-model="filters.sortBy"
                @change="applyFilters"
                class="appearance-none bg-gray-100 hover:bg-gray-200 px-4 py-2 pr-8 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Results -->
          <div class="flex items-center justify-between mb-6">
            <p class="text-gray-600">
              {{ totalCount }} plugin{{ totalCount > 1 ? 's' : '' }} trouvé{{
                totalCount > 1 ? 's' : ''
              }}
              {{ currentPage > 1 ? `(page ${currentPage}/${totalPages})` : '' }}
            </p>
          </div>

          <!-- VST Grid -->
          <div v-if="loading" class="text-center py-12">
            <div
              class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
            ></div>
            <p class="mt-4 text-gray-600">Chargement...</p>
          </div>

          <div v-else-if="filteredVSTs.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-2xl font-light text-gray-900 mb-2">Aucun plugin trouvé</h3>
            <p class="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
            <Button @click="clearFilters">Effacer les filtres</Button>
          </div>

          <div v-else>
            <Grid cols="3" gap="6">
              <VSTCard v-for="vst in filteredVSTs" :key="vst.id" :vst="vst" />
            </Grid>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center mt-8">
              <div class="flex gap-2">
                <Button
                  v-if="currentPage > 1"
                  @click="changePage(currentPage - 1)"
                  variant="outline"
                  size="sm"
                >
                  Précédent
                </Button>

                <Button
                  v-for="page in Math.min(5, totalPages)"
                  :key="page"
                  @click="changePage(page)"
                  :variant="page === currentPage ? 'primary' : 'outline'"
                  size="sm"
                >
                  {{ page }}
                </Button>

                <Button
                  v-if="currentPage < totalPages"
                  @click="changePage(currentPage + 1)"
                  variant="outline"
                  size="sm"
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>
