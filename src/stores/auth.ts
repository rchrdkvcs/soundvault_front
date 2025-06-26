import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

import type { User } from '@/types/user.ts'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const token = ref<string | null>(localStorage.getItem('token'))
  const error = ref<string | null>(null)

  const { get, post, delete: del } = useApi()

  async function login(email: string, password: string) {
    error.value = null
    try {
      const res = await post<{ token: { token: string } }>('/auth/login', { email, password })
      token.value = res.token.token
      localStorage.setItem('token', token.value)
      await fetchUser()
      isAuthenticated.value = true
    } catch (e: any) {
      error.value = e.message || 'Erreur de connexion'
      logout()
    }
  }

  async function register(payload: {
    email: string
    password: string
    username: string
    confirmPassword: string
  }) {
    error.value = null
    try {
      await post('/auth/register', payload)
      await login(payload.email, payload.password)
    } catch (e: any) {
      error.value = e.message || "Erreur d'inscription"
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const res = await get<User>('/auth/me')
      user.value = res
      isAuthenticated.value = true
    } catch (e) {
      logout()
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await del('/auth/logout')
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion sur le serveur', error)
    } finally {
      user.value = null
      isAuthenticated.value = false
      token.value = null
      localStorage.removeItem('token')
    }
  }

  if (token.value) fetchUser()

  return { user, isAuthenticated, token, error, login, register, logout, fetchUser }
})
