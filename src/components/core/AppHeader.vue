<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 w-full h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <img src="/src/assets/images/icon.png" alt="Soundvault logo" class="h-8" />
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8 flex-1 justify-center">
          <RouterLink
            to="/"
            class="text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            Accueil
          </RouterLink>
          <RouterLink
            to="/vst-gallery"
            class="text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            Galerie
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/explore"
            class="text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            Explorer
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/bookmarks"
            class="text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            Favoris
          </RouterLink>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center justify-end gap-4">
          <template v-if="authStore.isAuthenticated">
            <!-- User Profile -->
            <div class="relative">
              <RouterLink
                :to="`/profile/${authStore.user?.id}`"
                class="flex items-center gap-2 hover:bg-gray-100 rounded-full p-2 transition-colors cursor-pointer"
              >
                <img
                  v-if="authStore.user?.avatar"
                  :src="authStore.user?.avatar"
                  :alt="authStore.user?.username"
                  class="w-8 h-8 rounded-full"
                />
                <div v-else class="w-8 h-8 rounded-full bg-gray-100 ring ring-gray-200" />
                <span class="hidden sm:block text-sm font-medium text-gray-700">
                  {{ authStore.user?.username }}
                </span>
              </RouterLink>
            </div>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Connexion
            </RouterLink>
            <RouterLink
              to="/register"
              class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
            >
              S'inscrire
            </RouterLink>
          </template>

          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-md hover:bg-gray-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
        <nav class="flex flex-col gap-2">
          <RouterLink
            to="/"
            class="text-gray-700 hover:text-gray-900 py-2 font-medium"
            @click="showMobileMenu = false"
          >
            Accueil
          </RouterLink>
          <RouterLink
            to="/vst-gallery"
            class="text-gray-700 hover:text-gray-900 py-2 font-medium"
            @click="showMobileMenu = false"
          >
            Galerie
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/explore"
            class="text-gray-700 hover:text-gray-900 py-2 font-medium"
            @click="showMobileMenu = false"
          >
            Explorer
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/bookmarks"
            class="text-gray-700 hover:text-gray-900 py-2 font-medium"
            @click="showMobileMenu = false"
          >
            Favoris
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>
