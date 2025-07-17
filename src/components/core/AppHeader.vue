<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const showMobileSearch = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'vst-gallery', query: { search: searchQuery.value } })
    showMobileSearch.value = false
  }
}

const toggleMobileSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
}
</script>

<template>
  <header>
    <div class="grid grid-cols-3 items-center gap-4 px-4 py-2">
      <!-- Logo -->
      <div class="justify-start w-fit">
        <RouterLink to="/" class="flex items-center gap-2">
          <img
            src="../../assets/1203953.svg"
            alt="Soundvault logo"
            height="100"
            width="100"
            class="h-12 w-fit"
          />
          <span
            class="hidden lg:block text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            SoundVault
          </span>
        </RouterLink>
      </div>

      <!-- Search -->
      <div class="flex justify-center w-full">
        <div class="join hidden md:flex w-full max-w-md">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Recherchez des plugins, créateurs..."
            class="input input-bordered join-item flex-1"
          />
          <button @click="handleSearch" class="btn btn-primary join-item">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Search Button -->
        <button @click="toggleMobileSearch" class="btn btn-square md:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      <!-- User Actions -->
      <div class="flex gap-2 justify-end items-center">
        <!-- Authenticated User -->
        <template v-if="authStore.isAuthenticated">
          <!-- Bookmarks -->
          <RouterLink to="/bookmarks" class="btn btn-ghost btn-sm hidden sm:flex">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span class="hidden lg:inline">Favoris</span>
          </RouterLink>

          <!-- User Dropdown -->
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost gap-2">
              <div class="avatar">
                <div class="w-6 h-6 rounded-full">
                  <img
                    :src="authStore.user?.avatar || '/default-avatar.png'"
                    :alt="authStore.user?.username"
                  />
                </div>
              </div>
              <span class="hidden sm:inline">{{ authStore.user?.username }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50"
            >
              <li>
                <RouterLink :to="`/profile/${authStore.user?.id}`" class="gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Mon Profil
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/bookmarks" class="gap-2 sm:hidden">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  Mes Favoris
                </RouterLink>
              </li>
              <div class="divider my-1"></div>
              <li>
                <button @click="authStore.logout()" class="text-error gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        </template>

        <!-- Guest User -->
        <template v-else>
          <RouterLink to="/vst-gallery" class="btn btn-ghost btn-sm hidden sm:flex">
            Galerie
          </RouterLink>
          <RouterLink to="/login" class="btn btn-primary btn-sm"> Connexion </RouterLink>
        </template>
      </div>
    </div>

    <!-- Mobile Search Bar -->
    <div v-if="showMobileSearch" class="md:hidden p-4 border-t border-base-300">
      <div class="join w-full">
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Recherchez des plugins..."
          class="input input-bordered join-item flex-1"
          autofocus
        />
        <button @click="handleSearch" class="btn btn-primary join-item">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
