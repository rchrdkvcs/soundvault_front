<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'vst-gallery', query: { search: searchQuery.value } })
  }
}

const features = [
  {
    title: 'Plugins Premium',
    description: 'Accédez à des VST de haute qualité créés par des professionnels',
    icon: 'M9 19V6l6 6-6 6z',
    highlight: true,
    stats: '1,250+',
  },
  {
    title: 'Recherche Avancée',
    description: 'Trouvez rapidement le plugin parfait avec nos filtres intelligents',
    icon: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    highlight: false,
    medium: true,
  },
  {
    title: 'Interface Moderne',
    description: 'Une expérience utilisateur fluide et intuitive',
    icon: 'M7 5h10v2H7V5zm0 4h10v2H7V9zm0 4h10v2H7v-2z',
    highlight: false,
  },
  {
    title: 'Téléchargement Rapide',
    description: 'Obtenez vos plugins instantanément après achat',
    icon: 'M5 20h14v-2H5v2zm7-18L7.41 6.59 8.83 8l2.17-2.17V15h2V5.83L15.17 8l1.41-1.41L12 2z',
    highlight: false,
  },
  {
    title: 'Communauté Active',
    description: 'Rejoignez une communauté de créateurs passionnés',
    icon: 'M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4.5c0-1.1.9-2 2-2s2 .9 2 2V18h2v-5.5c0-2.21-1.79-4-4-4s-4 1.79-4 4V18h2zm10-7c-1.1 0-2 .9-2 2V18h2v-5.5c0-.28.22-.5.5-.5s.5.22.5.5V18h2v-5.5c0-1.1-.9-2-2-2z',
    highlight: false,
  },
  {
    title: 'Support 24/7',
    description: 'Une assistance dédiée pour tous vos besoins',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    highlight: false,
  },
  {
    title: 'Sécurité Garantie',
    description: 'Tous nos plugins sont vérifiés et sécurisés',
    icon: 'M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z',
    highlight: false,
    medium: true,
  },
]

const categories = [
  { name: 'Synthétiseurs', count: 245, icon: 'M9 19V6l6 6-6 6z' },
  { name: 'Effets', count: 189, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  {
    name: 'Drums',
    count: 156,
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
  {
    name: 'Samples',
    count: 312,
    icon: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
  },
  {
    name: 'Instruments',
    count: 98,
    icon: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  },
  {
    name: 'Mixage',
    count: 67,
    icon: 'M7 24h2v-2H7v2zm4 0h2v-2h-2v2zm-8-2h2v-2H3v2zm4 0h2v-2H7v2zm8 0h2v-2h-2v2zm4 0h2v-2h-2v2zm-8-4h2v-2h-2v2zm4 0h2v-2h-2v2zm-8-4h2v-2H7v2zm4 0h2v-2h-2v2z',
  },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center">
          <img src="/src/assets/images/logo-256.png" alt="Icon" class="mx-auto size-96" />
          <p
            class="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            La marketplace ultime pour découvrir, acheter et partager des plugins VST de qualité
            professionnelle
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink
              to="/vst-gallery"
              class="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Découvrir les VST
            </RouterLink>
            <RouterLink
              to="/register"
              class="border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              Créer un compte
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="bg-white py-16 border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-light text-gray-900 mb-1">1,250+</div>
              <div class="text-gray-600">Plugins VST</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-light text-gray-900 mb-1">50,000+</div>
              <div class="text-gray-600">Téléchargements</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-light text-gray-900 mb-1">2,500+</div>
              <div class="text-gray-600">Utilisateurs</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-light text-gray-900 mb-1">150+</div>
              <div class="text-gray-600">Créateurs</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 lg:py-32 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-light text-gray-900 mb-4">Catégories Populaires</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez notre collection soigneusement sélectionnée de plugins VST
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RouterLink
            v-for="category in categories"
            :key="category.name"
            to="/vst-gallery"
            class="group bg-white rounded-2xl p-6 hover:bg-gray-50 transition-all duration-300 cursor-pointer border border-gray-200"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors"
              >
                <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="category.icon" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-1">{{ category.name }}</h3>
                <p class="text-sm text-gray-600">{{ category.count }} plugins</p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 lg:py-32 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-light text-gray-900 mb-4">Pourquoi SoundVault ?</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Une plateforme conçue pour les créateurs, par les créateurs
          </p>
        </div>

        <!-- Bento Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Large highlight card -->
          <div
            class="lg:col-span-2 lg:row-span-2 bg-blue-50 rounded-3xl p-8 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all duration-300 cursor-pointer group"
          >
            <div class="h-full flex flex-col justify-between">
              <div>
                <div
                  class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300"
                >
                  <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="features[0].icon" />
                  </svg>
                </div>
                <h3
                  class="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-blue-800 transition-colors"
                >
                  {{ features[0].title }}
                </h3>
                <p
                  class="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors"
                >
                  {{ features[0].description }}
                  Notre catalogue soigneusement sélectionné vous garantit des plugins exceptionnels
                  pour tous vos projets musicaux.
                </p>
              </div>
              <div class="mt-8 flex items-center gap-4">
                <div
                  class="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors"
                >
                  {{ features[0].stats }}
                </div>
                <div class="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  Plugins disponibles
                </div>
              </div>
            </div>
          </div>

          <!-- Medium cards -->
          <div
            class="lg:col-span-2 bg-gray-50 rounded-3xl p-6 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 cursor-pointer group"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300"
              >
                <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="features[1].icon" />
                </svg>
              </div>
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors"
                >
                  {{ features[1].title }}
                </h3>
                <p class="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {{ features[1].description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Small cards Row 1 -->
          <div
            class="bg-white rounded-3xl p-6 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div
              class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300"
            >
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="features[2].icon" />
              </svg>
            </div>
            <h3
              class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-800 transition-colors"
            >
              {{ features[2].title }}
            </h3>
            <p class="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
              {{ features[2].description }}
            </p>
          </div>

          <div
            class="bg-white rounded-3xl p-6 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div
              class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 group-hover:scale-110 transition-all duration-300"
            >
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="features[3].icon" />
              </svg>
            </div>
            <h3
              class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-800 transition-colors"
            >
              {{ features[3].title }}
            </h3>
            <p class="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
              {{ features[3].description }}
            </p>
          </div>

          <!-- Medium card 2 -->
          <div
            class="lg:col-span-2 bg-gray-50 rounded-3xl p-6 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 cursor-pointer group"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300"
              >
                <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path :d="features[6].icon" />
                </svg>
              </div>
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors"
                >
                  {{ features[6].title }}
                </h3>
                <p class="text-gray-600 group-hover:text-gray-700 transition-colors">
                  {{ features[6].description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Small cards Row 2 -->
          <div
            class="bg-white rounded-3xl p-6 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div
              class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300"
            >
              <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="features[4].icon" />
              </svg>
            </div>
            <h3
              class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-800 transition-colors"
            >
              {{ features[4].title }}
            </h3>
            <p class="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
              {{ features[4].description }}
            </p>
          </div>

          <div
            class="bg-white rounded-3xl p-6 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div
              class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300"
            >
              <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path :d="features[5].icon" />
              </svg>
            </div>
            <h3
              class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-800 transition-colors"
            >
              {{ features[5].title }}
            </h3>
            <p class="text-gray-600 text-sm group-hover:text-gray-700 transition-colors">
              {{ features[5].description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 lg:py-32 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
          Prêt à créer votre prochaine production ?
        </h2>
        <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Rejoignez des milliers de producteurs qui utilisent SoundVault pour découvrir les
          meilleurs plugins VST
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/register"
            class="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Créer un compte gratuit
          </RouterLink>
          <RouterLink
            to="/vst-gallery"
            class="border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium text-lg"
          >
            Parcourir les VST
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
