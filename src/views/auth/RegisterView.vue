<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'

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
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <RouterLink to="/" class="flex items-center justify-center gap-2 mb-6">
          <img
            src="/src/assets/1203953.svg"
            alt="SoundVault logo"
            class="h-10 w-10"
          />
          <span class="text-2xl font-semibold text-gray-900">SoundVault</span>
        </RouterLink>
        <h2 class="text-3xl font-light text-gray-900">
          Créez votre compte
        </h2>
        <p class="mt-2 text-gray-600">
          Ou
          <RouterLink to="/login" class="text-blue-600 hover:text-blue-500 font-medium">
            connectez-vous à votre compte existant
          </RouterLink>
        </p>
      </div>

      <!-- Form -->
      <Card>
        <form @submit="handleSubmit" class="space-y-6">
          <div v-if="error || validationError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 text-sm">{{ validationError || error }}</p>
          </div>

          <Input
            v-model="form.username"
            type="text"
            label="Nom d'utilisateur"
            placeholder="votre-nom-utilisateur"
            :full-width="true"
            required
          />

          <Input
            v-model="form.email"
            type="email"
            label="Adresse email"
            placeholder="votre@email.com"
            :full-width="true"
            required
          />

          <Input
            v-model="form.password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            :full-width="true"
            required
          />

          <Input
            v-model="form.confirmPassword"
            type="password"
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            :full-width="true"
            required
          />

          <div class="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              J'accepte les
              <a href="#" class="text-blue-600 hover:text-blue-500">conditions d'utilisation</a>
              et la
              <a href="#" class="text-blue-600 hover:text-blue-500">politique de confidentialité</a>
            </label>
          </div>

          <Button
            type="submit"
            :disabled="isLoading"
            :full-width="true"
            size="lg"
          >
            <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            Créer mon compte
          </Button>
        </form>
      </Card>
    </div>
  </div>
</template>
