<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const form = ref({
  email: '',
  password: '',
})
const isLoading = ref(false)

const error = computed(() => authStore.error)

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  isLoading.value = true
  await authStore.login(form.value.email, form.value.password)
  isLoading.value = false

  if (authStore.isAuthenticated) {
    router.push('/')
  }
}
</script>

<template>
  <main class="w-full h-full flex flex-col justify-center items-center gap-8">
    <AppLogo />

    <form
      @submit="handleSubmit"
      class="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4"
    >
      <h2 class="text-2xl font-semibold mb-4">Se connecter</h2>

      <div v-if="error" class="alert alert-error mb-4">{{ error }}</div>

      <label class="label">Email</label>
      <input
        v-model="form.email"
        type="email"
        class="input w-full"
        placeholder="some@email.com"
        required
      />

      <label class="label">Mot de passe</label>
      <input
        v-model="form.password"
        type="password"
        class="input w-full"
        placeholder="*********"
        required
      />

      <button type="submit" class="btn btn-neutral mt-4 w-full" :disabled="isLoading">
        <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
        Se connecter
      </button>

      <p class="text-center mt-4">
        Pas encore inscrit ?
        <RouterLink to="/register" class="link link-primary">S'inscrire</RouterLink>
      </p>
    </form>
  </main>
</template>
