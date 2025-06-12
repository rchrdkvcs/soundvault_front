<script lang="ts" setup></script>

<template>
  <main class="flex flex-col p-8 gap-8">
    <!-- Catégories -->
    <div class="flex gap-2 items-center">
      <a href="#" class="badge badge-ghost badge-xl">#Effets</a>
      <a href="#" class="badge badge-ghost badge-xl">#Sons</a>
      <a href="#" class="badge badge-ghost badge-xl">#Vst</a>
    </div>

    <!-- Sélection de VST -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="(item, index) in 20"
        :key="index"
        class="card border border-base-content/15 overflow-hidden"
      >
        <img src="../assets/serum2.webp" alt="VST" class="w-full h-48 object-cover object-top" />

        <div class="card-body">
          <h2 class="card-title">
            Card Title
            <span class="badge badge-success badge-soft">Nouveau</span>
          </h2>
          <p>
            A card component has a figure, a body part, and inside body there are title and actions
            parts
          </p>

          <div class="card-actions justify-end">
            <a href="#" class="btn btn-ghost btn-sm">Voir plus</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
