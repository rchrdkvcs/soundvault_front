<script lang="ts" setup></script>

<template>
  <main class="min-h-[calc(100vh-64px)] w-full flex items-center justify-center">
    <div class="w-full max-w-6xl px-6 py-20 flex flex-col items-center text-center">
      <div class="mb-10 relative">
        <h1 class="text-5xl md:text-7xl font-bold relative text-base-content">SoundVault</h1>
      </div>

      <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12">
        Explorez, découvrez et partagez des plugins audio avec la communauté.
      </p>

      <div class="flex flex-col md:flex-row gap-2">
        <RouterLink to="/explore" class="btn btn-active hover:scale-105 transition-transform">
          Explorer les plugins
        </RouterLink>
        <RouterLink
          to="/library"
          class="btn btn-ghost btn-neutral hover:scale-105 transition-transform"
        >
          Ma bibliothèque
        </RouterLink>
      </div>

      <div
        class="mt-20 w-full max-w-3xl rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-3"
      >
        <div class="w-full h-16 flex items-center justify-center">
          <p class="text-base-content/75">Accédez à plus de 1000+ plugins audio professionnels</p>
        </div>
      </div>
    </div>
  </main>
</template>
