<script setup lang="ts">
const currentYear = new Date().getFullYear()

const footerLinks = {
  product: [
    { name: 'Galerie VST', href: '/vst-gallery' },
    { name: 'Catégories', href: '/vst-gallery' },
    { name: 'Nouveautés', href: '/vst-gallery?sort=recent' },
    { name: 'Populaires', href: '/vst-gallery?sort=popular' }
  ],
  company: [
    { name: 'À propos', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carrières', href: '/careers' },
    { name: 'Contact', href: '/contact' }
  ],
  legal: [
    { name: 'Politique de confidentialité', href: '/privacy' },
    { name: 'Conditions d\'utilisation', href: '/terms' },
    { name: 'Cookies', href: '/cookies' }
  ]
}
</script>

<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <img
              src="/src/assets/1203953.svg"
              alt="SoundVault logo"
              class="h-8 w-8"
            />
            <span class="text-xl font-semibold text-gray-900">SoundVault</span>
          </div>
          <p class="text-gray-600 max-w-md leading-relaxed">
            La marketplace ultime pour découvrir, acheter et partager des plugins VST de qualité professionnelle.
          </p>
        </div>

        <!-- Product Links -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">Produit</h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.product" :key="link.name">
              <RouterLink 
                :to="link.href"
                class="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">Entreprise</h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.company" :key="link.name">
              <RouterLink 
                :to="link.href"
                class="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <div class="text-gray-600 text-sm">
          © {{ currentYear }} SoundVault. Tous droits réservés.
        </div>
        
        <div class="flex space-x-6 mt-4 sm:mt-0">
          <RouterLink 
            v-for="link in footerLinks.legal" 
            :key="link.name"
            :to="link.href"
            class="text-gray-600 hover:text-gray-900 transition-colors text-sm"
          >
            {{ link.name }}
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
