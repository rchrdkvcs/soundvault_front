<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLogo from '@/components/AppLogo.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const isLoading = ref(false)
const validationError = ref('')
const error = computed(() => authStore.error)

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  validationError.value = ''

  // Validation
  if (form.value.password !== form.value.confirmPassword) {
    validationError.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (form.value.password.length < 6) {
    validationError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  isLoading.value = true
  await authStore.register({
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    confirmPassword: form.value.confirmPassword,
  })
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
      <h2 class="text-2xl font-semibold mb-4">Créer un compte</h2>

      <div v-if="error || validationError" class="alert alert-error mb-4">
        {{ validationError || error }}
      </div>

      <label class="label">Nom d'utilisateur</label>
      <input
        v-model="form.username"
        type="text"
        class="input w-full"
        placeholder="Nom d'utilisateur"
        required
      />

      <label class="label">Email</label>
      <input v-model="form.email" type="email" class="input w-full" placeholder="Email" required />

      <label class="label">Mot de passe</label>
      <input
        v-model="form.password"
        type="password"
        class="input w-full"
        placeholder="Mot de passe"
        required
      />

      <label class="label">Confirmer le mot de passe</label>
      <input
        v-model="form.confirmPassword"
        type="password"
        class="input w-full"
        placeholder="Confirmer le mot de passe"
        required
      />

      <button type="submit" class="btn btn-neutral mt-4 w-full" :disabled="isLoading">
        <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
        S'inscrire
      </button>

      <p class="text-center mt-4">
        Déjà un compte ?
        <RouterLink to="/login" class="link link-primary">Se connecter</RouterLink>
      </p>
    </form>
  </main>
</template>
