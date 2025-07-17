<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Card from '@/components/ui/Card.vue'

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
          Connectez-vous à votre compte
        </h2>
        <p class="mt-2 text-gray-600">
          Ou
          <RouterLink to="/register" class="text-blue-600 hover:text-blue-500 font-medium">
            créez un nouveau compte
          </RouterLink>
        </p>
      </div>

      <!-- Form -->
      <Card>
        <form @submit="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 text-sm">{{ error }}</p>
          </div>

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

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            :disabled="isLoading"
            :full-width="true"
            size="lg"
          >
            <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            Se connecter
          </Button>
        </form>
      </Card>
    </div>
  </div>
</template>
