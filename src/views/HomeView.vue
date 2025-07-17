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
    icon: '🎵',
    title: 'Plugins Premium',
    description: 'Accédez à des VST de haute qualité créés par des professionnels',
  },
  {
    icon: '🔍',
    title: 'Recherche Avancée',
    description: 'Trouvez rapidement le plugin parfait avec nos filtres intelligents',
  },
  {
    icon: '📱',
    title: 'Interface Moderne',
    description: 'Une expérience utilisateur fluide et intuitive',
  },
  {
    icon: '🚀',
    title: 'Téléchargement Rapide',
    description: 'Obtenez vos plugins instantanément après achat',
  },
]

const categories = [
  { name: 'Synthétiseurs', count: 245, color: 'from-purple-500 to-pink-500' },
  { name: 'Effets', count: 189, color: 'from-blue-500 to-cyan-500' },
  { name: 'Drums', count: 156, color: 'from-green-500 to-emerald-500' },
  { name: 'Samples', count: 312, color: 'from-orange-500 to-red-500' },
  { name: 'Instruments', count: 98, color: 'from-yellow-500 to-amber-500' },
  { name: 'Mixage', count: 67, color: 'from-teal-500 to-lime-500' },
]
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 py-20 min-h-screen h-full flex flex-col justify-center items-center"
    >
      <div class="container mx-auto px-4">
        <div class="text-center max-w-4xl mx-auto">
          <h1
            class="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6"
          >
            SoundVault
          </h1>
          <p class="text-xl md:text-2xl text-base-content/80 mb-8 max-w-2xl mx-auto">
            La marketplace ultime pour découvrir, acheter et partager des plugins VST de qualité
            professionnelle
          </p>

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto mb-12">
            <div class="join w-full">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Rechercher des plugins VST..."
                class="input input-bordered join-item flex-1 text-lg"
              />
              <button @click="handleSearch" class="btn btn-primary join-item">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink to="/vst-gallery" class="btn btn-primary btn-lg">
              Découvrir les VST
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="py-16 bg-base-200 mt-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center bg-base-100 ring-1 ring-base-content/10 rounded-xl p-4">
              <div class="text-4xl font-bold text-primary">1,250+</div>
              <div class="text-base-content/70">Plugins VST</div>
            </div>
            <div class="text-center bg-base-100 ring-1 ring-base-content/10 rounded-xl p-4">
              <div class="text-4xl font-bold text-primary">50,000+</div>
              <div class="text-base-content/70">Téléchargements</div>
            </div>
            <div class="text-center bg-base-100 ring-1 ring-base-content/10 rounded-xl p-4">
              <div class="text-4xl font-bold text-primary">2,500+</div>
              <div class="text-base-content/70">Utilisateurs</div>
            </div>
            <div class="text-center bg-base-100 ring-1 ring-base-content/10 rounded-xl p-4">
              <div class="text-4xl font-bold text-primary">150+</div>
              <div class="text-base-content/70">Créateurs</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 min-h-screen flex flex-col justify-center items-center">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-12">Catégories Populaires</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="category in categories"
            :key="category.name"
            class="card cursor-pointer group bg-base-200 hover:bg-base-300 transition duration-300 ease-in-out"
          >
            <div class="card-body text-center">
              <div
                :class="`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold transition-transform`"
              >
                {{ category.count }}
              </div>
              <h3 class="text-xl font-semibold">{{ category.name }}</h3>
              <p class="text-base-content/70">{{ category.count }} plugins disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-12">Pourquoi SoundVault ?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center">
            <div class="text-6xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-base-content/70">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary to-secondary">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">
          Prêt à créer votre prochaine production ?
        </h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers de producteurs qui utilisent SoundVault pour découvrir les
          meilleurs plugins VST
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/register" class="btn btn-primary btn-lg">
            Créer un compte gratuit
          </RouterLink>
          <RouterLink to="/vst-gallery" class="btn btn-secondary btn-lg text-white">
            Parcourir les VST
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
