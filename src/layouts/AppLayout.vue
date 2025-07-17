<script setup lang="ts">
import AppHeader from '@/components/core/AppHeader.vue'
import AppFooter from '@/components/core/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen w-full bg-white">
    <AppHeader />
    
    <main class="w-full">
      <RouterView />
    </main>
    
    <AppFooter />
  </div>
</template>
