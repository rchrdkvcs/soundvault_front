<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { name: 'Accueil', path: '/', icon: 'home' },
  { name: 'Explorer', path: '/explore', icon: 'compass' },
  { name: 'Bibliothèque', path: '/library', icon: 'library' },
]
</script>

<template>
  <aside class="size-full hidden md:block px-4">
    <ul class="space-y-2">
      <li v-for="item in menuItems" :key="item.name">
        <RouterLink
          :to="item.path"
          class="btn btn-ghost btn-block justify-start"
          :class="{ 'btn-active': route.path === item.path }"
        >
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>
