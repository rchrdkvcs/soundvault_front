<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import type { VST, VSTFilter } from '@/types/vst'
import Container from '@/components/ui/Container.vue'
import Grid from '@/components/ui/Grid.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Input from '@/components/ui/Input.vue'
import VSTCard from '@/components/features/vst/VSTCard.vue'

const route = useRoute()
const router = useRouter()
const { get } = useApi()

const vsts = ref<VST[]>([])
const categories = ref<any[]>([])
const loading = ref(false)
const showFilters = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)

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

const fetchPlugins = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()

    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    if (filters.sortBy) params.append('sort', filters.sortBy)
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
      }))
    }
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

const filteredVSTs = computed(() => {
  let filtered = vsts.value

  // Free filter (client-side for immediate feedback)
  if (filters.isFree) {
    filtered = filtered.filter((vst) => vst.isFree)
  }

  // Price range filter (client-side)
  if (filters.priceRange) {
    filtered = filtered.filter((vst) => {
      const price = vst.salePrice || vst.price
      return price >= filters.priceRange!.min && price <= filters.priceRange!.max
    })
  }

  return filtered
})

const applyFilters = async () => {
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

  // Reset page and fetch new data
  currentPage.value = 1
  await fetchPlugins()
}

const clearFilters = async () => {
  filters.search = ''
  filters.category = ''
  filters.isFree = undefined
  filters.priceRange = { min: 0, max: 200 }
  filters.sortBy = 'newest'
  router.push({ query: {} })
  currentPage.value = 1
  await fetchPlugins()
}

const changePage = async (page: number) => {
  currentPage.value = page
  await fetchPlugins()
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchPlugins()])
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
            <Button variant="outline" @click="showFilters = !showFilters">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                />
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
                <Button variant="ghost" @click="clearFilters"> Effacer les filtres </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Filters -->
        <div
          v-if="filters.search || filters.category || filters.isFree"
          class="flex flex-wrap gap-2 mb-6"
        >
          <Badge v-if="filters.search" variant="primary"> Recherche: {{ filters.search }} </Badge>
          <Badge v-if="filters.category" variant="secondary">
            {{ categories.find((c) => c.id === filters.category)?.name }}
          </Badge>
          <Badge v-if="filters.isFree" variant="success"> Gratuit </Badge>
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
    </Container>
  </div>
</template>
