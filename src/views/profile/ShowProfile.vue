<script setup lang="ts">
import { useRoute } from 'vue-router'

const params = useRoute().params
</script>

<template>
  <main class="flex justify-center items-center size-full">
    <h1 class="capitalize">Profile {{ params.username }}</h1>
  </main>
</template>
