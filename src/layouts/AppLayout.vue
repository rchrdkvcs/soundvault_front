<script setup lang="ts">
import AppHeader from '@/components/core/AppHeader.vue'
import AppSidebar from '@/components/core/AppSidebar.vue'
import AppFooter from '@/components/core/AppFooter.vue'
</script>

<template>
  <div class="h-screen w-full grid grid-rows-[64px_1fr] overflow-hidden">
    <AppHeader />

    <div class="grid grid-cols-[256px_1fr] overflow-hidden">
      <AppSidebar />

      <div
        class="overflow-y-auto h-full bg-base-100 rounded-tl-xl border border-base-content/15 shadow-xl"
      >
        <RouterView />
        <AppFooter />
      </div>
    </div>
  </div>
</template>
