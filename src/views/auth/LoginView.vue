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
    await router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left Side - Illustration -->
    <div class="hidden lg:flex lg:flex-1 relative bg-white">
      <div class="flex flex-col justify-center items-center w-full p-16">
        <!-- Logo -->
        <div class="mb-12">
          <img
            src="/src/assets/images/logo-256.png"
            alt="SoundVault"
            class="w-20 h-20 mx-auto"
          />
        </div>
        
        <!-- Illustration Area -->
        <div class="max-w-md mx-auto text-center">
          <div class="relative mb-8">
            <!-- Abstract music visualization -->
            <div class="flex items-end justify-center gap-2 h-32 mb-8">
              <div class="w-2 bg-blue-100 rounded-full animate-pulse" style="height: 25%; animation-delay: 0s; animation-duration: 2s;"></div>
              <div class="w-2 bg-blue-200 rounded-full animate-pulse" style="height: 60%; animation-delay: 0.2s; animation-duration: 2s;"></div>
              <div class="w-2 bg-blue-300 rounded-full animate-pulse" style="height: 40%; animation-delay: 0.4s; animation-duration: 2s;"></div>
              <div class="w-2 bg-blue-400 rounded-full animate-pulse" style="height: 85%; animation-delay: 0.6s; animation-duration: 2s;"></div>
              <div class="w-2 bg-blue-500 rounded-full animate-pulse" style="height: 70%; animation-delay: 0.8s; animation-duration: 2s;"></div>
              <div class="w-2 bg-blue-400 rounded-full animate-pulse" style="height: 50%; animation-delay: 1s; animation-duration: 2s;"></div>
              <div class="w-2 bg-blue-300 rounded-full animate-pulse" style="height: 90%; animation-delay: 1.2s; animation-duration: 2s;"></div>
              <div class="w-2 bg-blue-200 rounded-full animate-pulse" style="height: 35%; animation-delay: 1.4s; animation-duration: 2s;"></div>
              <div class="w-2 bg-blue-100 rounded-full animate-pulse" style="height: 45%; animation-delay: 1.6s; animation-duration: 2s;"></div>
            </div>
          </div>
          
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Votre univers musical vous attend
          </h2>
          <p class="text-gray-600 leading-relaxed">
            Découvrez, organisez et partagez votre musique avec SoundVault. 
            Une expérience simple et élégante pour tous vos morceaux préférés.
          </p>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 max-w-md lg:max-w-none mx-auto lg:mx-0">
      <div class="mx-auto w-full max-w-sm lg:max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <img
            src="/src/assets/images/logo-256.png"
            alt="SoundVault"
            class="w-16 h-16 mx-auto mb-4"
          />
        </div>

        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Se connecter</h1>
          <p class="mt-2 text-sm text-gray-600">
            Pas encore de compte ?
            <RouterLink to="/register" class="font-medium text-blue-600 hover:text-blue-500 ml-1">
              Créer un compte
            </RouterLink>
          </p>
        </div>

        <form @submit="handleSubmit" class="space-y-6">
          <!-- Error Message -->
          <div v-if="error" class="rounded-md bg-red-50 p-4 border border-red-200">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>

          <!-- Email -->
          <Input
            v-model="form.email"
            type="email"
            label="Adresse email"
            placeholder="votre@email.com"
            :full-width="true"
            size="lg"
            required
          />

          <!-- Password -->
          <Input
            v-model="form.password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            :full-width="true"
            size="lg"
            required
          />

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :disabled="isLoading"
            :full-width="true"
            size="lg"
            variant="primary"
          >
            <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>
