<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  // TODO: Add validation and API call
  console.log(form.value)
}
</script>

<template>
  <main class="w-full h-full flex flex-col justify-center items-center gap-8">
    <h1 class="text-4xl font-bold">SoundVault</h1>
    
    <form @submit="handleSubmit" class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <h2 class="text-2xl font-semibold">Créer un compte</h2>

      <label class="label">Nom d'utilisateur</label>
      <input 
        v-model="form.username"
        type="text" 
        class="input" 
        placeholder="Nom d'utilisateur" 
        required 
      />

      <label class="label">Email</label>
      <input 
        v-model="form.email"
        type="email" 
        class="input" 
        placeholder="Email" 
        required 
      />

      <label class="label">Mot de passe</label>
      <input 
        v-model="form.password"
        type="password" 
        class="input" 
        placeholder="Mot de passe" 
        required 
      />

      <label class="label">Confirmer le mot de passe</label>
      <input 
        v-model="form.confirmPassword"
        type="password" 
        class="input" 
        placeholder="Confirmer le mot de passe" 
        required 
      />

      <button type="submit" class="btn btn-neutral mt-4 w-full">S'inscrire</button>

      <p class="text-center mt-4">
        Déjà un compte ? 
        <RouterLink to="/login" class="link link-primary">Se connecter</RouterLink>
      </p>
    </form>
  </main>
</template>
