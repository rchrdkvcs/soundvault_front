<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
</script>

<template>
  <main class="w-full h-full flex flex-col justify-center items-center gap-8">
    <AppLogo />

    <form class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <h2 class="text-2xl font-semibold">Se connecter</h2>

      <label class="label">Email</label>
      <input type="email" class="input" placeholder="Email" />

      <label class="label">Password</label>
      <input type="password" class="input" placeholder="Password" />

      <button type="submit" class="btn btn-neutral mt-4">Login</button>

      <p class="text-center mt-4">
        Pas encore inscrit ?
        <RouterLink to="/register" class="link link-primary">S'inscrire</RouterLink>
      </p>
    </form>

    <p class="text-sm">
      Pas encore de compte ? <RouterLink to="/register" class="link">Créer un compte</RouterLink>
    </p>
  </main>
</template>
