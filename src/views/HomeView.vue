<script lang="ts" setup></script>

<template>
  <main class="flex flex-col p-4 md:p-6">

    <!-- Catégories -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-7">

      <a href="#">
        <div class="card w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title">Effets</h2>        
          </div>
        </div>
      </a>

      <a href="#">
        <div class="card w-96 bg-base-100 card-sm shadow-sm">
          <div class="card-body">
            <h2 class="card-title">Instruments</h2>
          </div>
        </div>
      </a>

     </div>
    
    <!-- Sélection de VST -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="(item, index) in 20" :key="index" class="card bg-base-100 shadow-sm">
        <figure>
          <img
            src="../assets/serum2.webp"
            alt="VST" 
            class="w-full h-48 object-cover object-top"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">
            Card Title
            <div class="badge badge-secondary">NEW</div>
          </h2>
          <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
          <div class="card-actions justify-end">
            <div class="badge badge-outline">Instrument</div>
            <div class="badge badge-outline">Products</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
