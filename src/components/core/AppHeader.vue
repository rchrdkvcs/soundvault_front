<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const authStore = useAuthStore()

const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 w-full h-16">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="flex items-center gap-2 w-fit hover:scale-105 transition-transform"
        >
          <img src="/src/assets/images/icon.png" alt="Sound vault logo" class="h-8" />
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex justify-center items-center">
          <Button to="/" variant="ghost" :active="isActive('/')">Accueil</Button>
          <Button to="/explore" variant="ghost" :active="isActive('/explore')">Explorer</Button>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center justify-end gap-3">
          <template v-if="authStore.isAuthenticated">
            <!-- Publish CTA -->
            <Button to="/publish">Partager un plugins</Button>

            <!-- User Profile -->
            <Button :to="`/profile/${authStore.user?.id}`" variant="secondary">
              {{ authStore.user?.username?.charAt(0).toUpperCase() }}
            </Button>
          </template>

          <template v-else>
            <Button to="/login" variant="secondary">Se connecter</Button>
          </template>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
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
            :class="[
              'py-2 px-3 rounded-lg transition-all font-medium',
              isActive('home')
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
            ]"
            @click="showMobileMenu = false"
          >
            Accueil
          </RouterLink>
          <RouterLink
            to="/explore"
            :class="[
              'py-2 px-3 rounded-lg transition-all font-medium',
              isActive('explore')
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
            ]"
            @click="showMobileMenu = false"
          >
            Explorer
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/publish"
            class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-3 rounded-lg font-semibold mt-2"
            @click="showMobileMenu = false"
          >
            Publier
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/bookmarks"
            :class="[
              'py-2 px-3 rounded-lg transition-all font-medium flex items-center gap-2',
              isActive('bookmarks')
                ? 'bg-red-100 text-red-600 font-semibold'
                : 'text-gray-700 hover:text-red-500 hover:bg-red-50',
            ]"
            @click="showMobileMenu = false"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            Favoris
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>

  <svg
    viewBox="0 0 1440 181"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="pointer-events-none absolute w-full top-[65px] transition-all text-blue-500 shrink-0 z-0 duration-[400ms]"
  >
    <mask id="path-1-inside-1_414_5526" fill="white"><path d="M0 0H1440V181H0V0Z"></path></mask>
    <path d="M0 0H1440V181H0V0Z" fill="url(#paint0_linear_414_5526)" fill-opacity="0.15"></path>
    <path
      d="M0 2H1440V-2H0V2Z"
      fill="url(#paint1_linear_414_5526)"
      mask="url(#path-1-inside-1_414_5526)"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_414_5526"
        x1="720"
        y1="0"
        x2="720"
        y2="181"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="currentColor" offset=""></stop>
        <stop offset="1" stop-color="currentColor" stop-opacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_414_5526"
        x1="0"
        y1="90.5"
        x2="1440"
        y2="90.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="currentColor" stop-opacity="0" offset=""></stop>
        <stop offset="0.395" stop-color="currentColor"></stop>
        <stop offset="1" stop-color="currentColor" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
  </svg>
</template>
