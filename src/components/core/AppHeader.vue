<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <header class="grid grid-cols-3 items-center gap-4 px-4">
    <div class="justify-start w-fit">
      <RouterLink to="/">
        <img
          src="../../assets/1203953.svg"
          alt="Soundvault logo"
          height="100"
          width="100"
          class="h-12 w-fit"
        />
      </RouterLink>
    </div>

    <div class="flex justify-center w-full">
      <input
        type="text"
        placeholder="Recherchez des plugins, créateurs, et plus !"
        class="hidden md:flex input input-bordered w-full"
      />

      <!-- Bouton loupe mobile -->
      <button class="btn btn-square md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>

    <div class="flex gap-4 justify-end items-center">
      <!-- Utilisateur connecté -->
      <template v-if="authStore.isAuthenticated">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost">
            {{ authStore.user?.username || 'Mon compte' }}
          </label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10 gap-1"
          >
            <li><RouterLink to="/profile">Profil</RouterLink></li>
            <li><RouterLink to="/settings">Paramètres</RouterLink></li>
            <li>
              <button @click="authStore.logout()" class="btn btn-sm btn-error">Déconnexion</button>
            </li>
          </ul>
        </div>
      </template>

      <!-- Utilisateur non connecté -->
      <template v-else>
        <RouterLink to="/login" class="btn btn-primary">Connexion</RouterLink>
      </template>
    </div>
  </header>
</template>
