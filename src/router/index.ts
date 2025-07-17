import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import ExploreView from '@/views/explore/ExploreView.vue'
import VSTGalleryView from '@/views/vst/VSTGalleryView.vue'
import VSTDetailView from '@/views/vst/VSTDetailView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import BookmarksView from '@/views/profile/BookmarksView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        requiresGuest: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresGuest: true,
      },
    },

    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'explore',
          name: 'explore',
          component: ExploreView,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'vst-gallery',
          name: 'vst-gallery',
          component: VSTGalleryView,
        },
        {
          path: 'vst/:id',
          name: 'vst-detail',
          component: VSTDetailView,
        },
        {
          path: 'profile/:id',
          name: 'profile',
          component: ProfileView,
        },
        {
          path: 'bookmarks',
          name: 'bookmarks',
          component: BookmarksView,
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Routes qui nécessitent l'authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Routes accessibles uniquement aux invités (non connectés)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }

  next()
})

export default router
