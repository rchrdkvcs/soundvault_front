<script setup lang="ts">
const menuItems = [
    { name: 'Accueil', path: '/', icon: 'home' },
    { name: 'Explorer', path: '/explore', icon: 'compass' },
    { name: 'Bibliothèque', path: '/library', icon: 'library' },
]
</script>

<template>
    <aside class="bg-base-200 w-100 min-h-full hidden md:block">
        <nav class="p-4 sticky top-16">
            <ul class="space-y-2">
                <li v-for="item in menuItems" :key="item.name">
                    <RouterLink 
                        :to="item.path"
                        class="flex items-center p-2 rounded-lg bg-primary hover:bg-primary"
                        :class="{ 'bg-base-300': $route.path === item.path }"
                    >
                        {{ item.name }}
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </aside>
</template>