<script lang="ts" setup>
import { RouterView } from 'vue-router'
import Header from '@/views/layout/Header.vue'
import Footer from './views/layout/Footer.vue'
import Sidebar from '@/views/layout/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    
    <div class="flex flex-1">
      <Sidebar />
      <div class="flex flex-col flex-1">
        <main class="flex-1">
          <RouterView />
        </main>
        <Footer />
      </div>
    </div>
  </div>
</template>
