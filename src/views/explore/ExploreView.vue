<script lang="ts" setup>
import { ref } from 'vue'
import Container from '@/components/ui/Container.vue'
import Grid from '@/components/ui/Grid.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const categories = [
  { id: 'trending', name: 'Tendances', icon: '🔥' },
  { id: 'new', name: 'Nouveautés', icon: '✨' },
  { id: 'featured', name: 'Sélection', icon: '🎯' },
  { id: 'popular', name: 'Populaires', icon: '⭐' }
]

const collections = [
  {
    id: 'studio-essentials',
    title: 'Essentiels Studio',
    description: 'Les plugins indispensables pour votre home studio',
    count: 12,
    image: '/collections/studio.jpg'
  },
  {
    id: 'mastering-tools',
    title: 'Outils de Mastering',
    description: 'Perfectionnez vos mix avec ces plugins professionnels',
    count: 8,
    image: '/collections/mastering.jpg'
  },
  {
    id: 'synth-collection',
    title: 'Collection Synthé',
    description: 'Les meilleurs synthétiseurs virtuels du moment',
    count: 15,
    image: '/collections/synth.jpg'
  }
]

const activeCategory = ref('trending')
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Container>
      <div class="py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-light text-gray-900 mb-2">Explorer</h1>
          <p class="text-gray-600">Découvrez de nouveaux plugins et collections</p>
        </div>

        <!-- Categories -->
        <div class="flex flex-wrap gap-3 mb-8">
          <Button
            v-for="category in categories"
            :key="category.id"
            :variant="activeCategory === category.id ? 'primary' : 'outline'"
            @click="activeCategory = category.id"
          >
            <span class="mr-2">{{ category.icon }}</span>
            {{ category.name }}
          </Button>
        </div>

        <!-- Featured Collections -->
        <div class="mb-12">
          <h2 class="text-2xl font-light text-gray-900 mb-6">Collections mises en avant</h2>
          <Grid cols="3" gap="6">
            <RouterLink 
              v-for="collection in collections"
              :key="collection.id"
              to="/vst-gallery"
              class="block"
            >
              <Card hover>
                <div class="space-y-4">
                  <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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
            </RouterLink>
          </Grid>
        </div>

        <!-- Trending VSTs -->
        <div class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-light text-gray-900">Plugins tendances</h2>
            <Button variant="ghost">Voir tout</Button>
          </div>
          
          <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RouterLink 
                v-for="n in 6" 
                :key="n"
                to="/vst-gallery"
                class="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l6 6-6 6z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">Plugin Name</h3>
                  <p class="text-sm text-gray-600">Author Name</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-sm font-medium text-gray-900">29€</span>
                    <Badge variant="success" size="sm">Nouveau</Badge>
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
            <RouterLink 
              v-for="category in categories.slice(0, 4)" 
              :key="category.id"
              to="/vst-gallery"
              class="block"
            >
              <Card hover>
                <div class="flex items-center gap-4 p-2">
                  <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {{ category.icon }}
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
                    <p class="text-sm text-gray-600">Explorer cette catégorie</p>
                  </div>
                </div>
              </Card>
            </RouterLink>
          </Grid>
        </div>
      </div>
    </Container>
  </div>
</template>