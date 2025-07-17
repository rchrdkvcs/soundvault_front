<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const menuItems = [
  {
    name: 'Accueil',
    path: '/',
    icon: '🏠',
    requiresAuth: false
  },
  {
    name: 'Galerie VST',
    path: '/vst-gallery',
    icon: '🎵',
    requiresAuth: false
  },
  {
    name: 'Mes Favoris',
    path: '/bookmarks',
    icon: '📖',
    requiresAuth: true
  },
  {
    name: 'Explorer',
    path: '/explore',
    icon: '🔍',
    requiresAuth: true
  },
]

const isRouteActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="size-full hidden md:block px-4 py-6">
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-base-content/80 mb-4">Navigation</h2>
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.name">
          <RouterLink
            v-if="!item.requiresAuth || authStore.isAuthenticated"
            :to="item.path"
            class="btn btn-ghost btn-block justify-start gap-3"
            :class="{ 'btn-active': isRouteActive(item.path) }"
          >
            <span class="text-lg">{{ item.icon }}</span>
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- Categories Section -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold text-base-content/80 mb-4">Catégories</h2>
      <ul class="space-y-1">
        <li>
          <RouterLink
            to="/vst-gallery?category=synth"
            class="btn btn-ghost btn-sm btn-block justify-start gap-2"
          >
            <span class="w-3 h-3 rounded-full bg-purple-500"></span>
            Synthétiseurs
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/vst-gallery?category=effects"
            class="btn btn-ghost btn-sm btn-block justify-start gap-2"
          >
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            Effets
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/vst-gallery?category=drums"
            class="btn btn-ghost btn-sm btn-block justify-start gap-2"
          >
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            Drums
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/vst-gallery?category=samples"
            class="btn btn-ghost btn-sm btn-block justify-start gap-2"
          >
            <span class="w-3 h-3 rounded-full bg-orange-500"></span>
            Samples
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>
