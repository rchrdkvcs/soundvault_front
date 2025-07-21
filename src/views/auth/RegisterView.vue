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
            <!-- Abstract music circles -->
            <div class="relative w-48 h-48 mx-auto mb-8">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-60 animate-pulse" style="animation-duration: 3s;"></div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-24 h-24 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-80 animate-pulse" style="animation-duration: 2.5s; animation-delay: 0.5s;"></div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 bg-gradient-to-br from-green-300 to-green-400 rounded-full animate-pulse" style="animation-duration: 2s; animation-delay: 1s;"></div>
              </div>
              <div class="absolute top-8 right-8">
                <div class="w-4 h-4 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.3s;"></div>
              </div>
              <div class="absolute bottom-8 left-8">
                <div class="w-3 h-3 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.6s;"></div>
              </div>
              <div class="absolute top-16 left-12">
                <div class="w-2 h-2 bg-green-600 rounded-full animate-bounce" style="animation-delay: 0.9s;"></div>
              </div>
            </div>
          </div>
          
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Commencez votre aventure musicale
          </h2>
          <p class="text-gray-600 leading-relaxed">
            Rejoignez SoundVault et accédez à un univers de possibilités musicales. 
            Simple, élégant, et conçu pour les passionnés de musique.
          </p>
        </div>
      </div>
    </div>

    <!-- Right Side - Register Form -->
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
          <h1 class="text-3xl font-bold text-gray-900">Créer un compte</h1>
          <p class="mt-2 text-sm text-gray-600">
            Vous avez déjà un compte ?
            <RouterLink to="/login" class="font-medium text-green-600 hover:text-green-500 ml-1">
              Se connecter
            </RouterLink>
          </p>
        </div>

        <form @submit="handleSubmit" class="space-y-5">
          <!-- Error Message -->
          <div v-if="error || validationError" class="rounded-md bg-red-50 p-4 border border-red-200">
            <p class="text-sm text-red-800">{{ validationError || error }}</p>
          </div>

          <!-- Username -->
          <Input
            v-model="form.username"
            type="text"
            label="Nom d'utilisateur"
            placeholder="votre-nom-utilisateur"
            :full-width="true"
            size="lg"
            required
          />

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

          <!-- Confirm Password -->
          <Input
            v-model="form.confirmPassword"
            type="password"
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            :full-width="true"
            size="lg"
            required
          />

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-gray-700">
                J'accepte les
                <a href="#" class="font-medium text-green-600 hover:text-green-500">
                  conditions d'utilisation
                </a>
                et la
                <a href="#" class="font-medium text-green-600 hover:text-green-500">
                  politique de confidentialité
                </a>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :disabled="isLoading"
            :full-width="true"
            size="lg"
            variant="secondary"
            class="!bg-green-600 hover:!bg-green-700 focus:!ring-green-500"
          >
            <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            Créer mon compte
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>
