<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'
import Container from '@/components/ui/Container.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const router = useRouter()
const authStore = useAuthStore()
const { post, get } = useApi()

const currentStep = ref(1)
const isSubmitting = ref(false)
const error = ref('')

const formData = reactive({
  // Step 1: Basic Info
  name: '',
  description: '',
  version: '',
  category: '',
  tags: [] as string[],

  // Step 2: Pricing & Files
  price: 0,
  isFree: true,
  vstFile: null as File | null,
  presetFiles: [] as File[],

  // Step 3: Media & Details
  coverImage: null as File | null,
  screenshots: [] as File[],
  demoTrack: null as File | null,

  // Step 4: Additional Info
  requirements: '',
  features: [] as string[],
  changelog: '',
})

const categories = ref<any[]>([])

const fetchCategories = async () => {
  try {
    const response = await get<any>('/categories')
    if (response.success) {
      categories.value = response.data.map((cat: any) => ({
        id: cat.id,
        name: cat.label,
      }))
    }
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

onMounted(() => {
  fetchCategories()
})

const tagInput = ref('')
const featureInput = ref('')

const canProceedToStep = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.name.trim() && formData.description.trim() && formData.category
    case 2:
      return formData.vstFile || formData.presetFiles.length > 0
    case 3:
      return formData.coverImage
    case 4:
      return true
    default:
      return false
  }
})

const addTag = () => {
  if (tagInput.value.trim() && !formData.tags.includes(tagInput.value.trim())) {
    formData.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  formData.tags = formData.tags.filter((t) => t !== tag)
}

const addFeature = () => {
  if (featureInput.value.trim() && !formData.features.includes(featureInput.value.trim())) {
    formData.features.push(featureInput.value.trim())
    featureInput.value = ''
  }
}

const removeFeature = (feature: string) => {
  formData.features = formData.features.filter((f) => f !== feature)
}

const handleFileUpload = (event: Event, field: keyof typeof formData) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return

  if (field === 'presetFiles' || field === 'screenshots') {
    formData[field] = Array.from(files) as any
  } else {
    ;(formData as any)[field] = files[0]
  }
}

const nextStep = () => {
  if (canProceedToStep.value && currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const submitVST = async () => {
  if (!canProceedToStep.value) return

  isSubmitting.value = true
  error.value = ''

  try {
    const formDataToSend = new FormData()

    // Basic info
    formDataToSend.append('name', formData.name.trim())
    formDataToSend.append('description', formData.description.trim())
    if (formData.version.trim()) formDataToSend.append('version', formData.version.trim())
    formDataToSend.append('categoryId', formData.category)
    if (formData.tags.length > 0) {
      formData.tags.forEach((tag) => formDataToSend.append('tags[]', tag))
    }

    // Pricing
    formDataToSend.append('price', formData.price.toString())
    formDataToSend.append('isFree', formData.isFree.toString())

    // Files
    if (formData.vstFile) formDataToSend.append('vstFile', formData.vstFile)
    if (formData.coverImage) formDataToSend.append('coverImage', formData.coverImage)
    if (formData.demoTrack) formDataToSend.append('demoTrack', formData.demoTrack)

    formData.presetFiles.forEach((file) => {
      formDataToSend.append('presets[]', file)
    })

    formData.screenshots.forEach((file) => {
      formDataToSend.append('screenshots[]', file)
    })

    // Additional info
    if (formData.requirements.trim())
      formDataToSend.append('requirements', formData.requirements.trim())
    if (formData.features.length > 0) {
      formData.features.forEach((feature) => formDataToSend.append('features[]', feature))
    }
    if (formData.changelog.trim()) formDataToSend.append('changelog', formData.changelog.trim())

    const response = await post<any>('/plugins', formDataToSend)

    if (response?.success) {
      router.push('/explore')
    } else {
      error.value = response?.message || 'Erreur lors de la publication'
    }
  } catch (e: any) {
    console.error('Erreur lors de la publication:', e)
    error.value = e?.message || e?.error || 'Erreur lors de la publication du VST'
  } finally {
    isSubmitting.value = false
  }
}

const stepTitles = [
  'Informations de base',
  'Fichiers et tarification',
  'Médias et présentation',
  'Finalisation',
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Container>
      <div class="py-8 max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-light text-gray-900 mb-2">Publier un VST</h1>
          <p class="text-gray-600">Partagez vos créations avec la communauté</p>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <span
              v-for="(title, index) in stepTitles"
              :key="index"
              :class="[
                'text-sm font-medium',
                index + 1 === currentStep
                  ? 'text-blue-600'
                  : index + 1 < currentStep
                    ? 'text-green-600'
                    : 'text-gray-400',
              ]"
            >
              {{ title }}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(currentStep / 4) * 100}%` }"
            />
          </div>
        </div>

        <!-- Form Steps -->
        <Card padding="lg">
          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="space-y-4">
              <Input
                v-model="formData.name"
                label="Nom du VST *"
                placeholder="Ex: Serum Pro"
                :full-width="true"
              />

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  v-model="formData.description"
                  rows="4"
                  placeholder="Décrivez votre VST, ses fonctionnalités principales..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  v-model="formData.version"
                  label="Version"
                  placeholder="Ex: 1.0.0"
                  :full-width="true"
                />

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                  <select
                    v-model="formData.category"
                    class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div class="flex gap-2 mb-2">
                  <Input
                    v-model="tagInput"
                    placeholder="Ajouter un tag"
                    @keyup.enter="addTag"
                    class="flex-1"
                  />
                  <Button @click="addTag" size="sm">Ajouter</Button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in formData.tags"
                    :key="tag"
                    class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {{ tag }}
                    <button @click="removeTag(tag)" class="ml-2 text-blue-600 hover:text-blue-800">
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Pricing & Files -->
          <div v-else-if="currentStep === 2" class="space-y-6">
            <div class="space-y-4">
              <div>
                <div class="flex items-center gap-4 mb-4">
                  <label class="flex items-center">
                    <input
                      v-model="formData.isFree"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">VST gratuit</span>
                  </label>
                </div>

                <div v-if="!formData.isFree">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prix (€)</label>
                  <input
                    v-model.number="formData.price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Fichier VST principal *</label
                >
                <input
                  type="file"
                  accept=".vst,.vst3,.dll"
                  @change="handleFileUpload($event, 'vstFile')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Presets (optionnel)</label
                >
                <input
                  type="file"
                  multiple
                  accept=".fxp,.fxb,.preset"
                  @change="handleFileUpload($event, 'presetFiles')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Step 3: Media -->
          <div v-else-if="currentStep === 3" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Image de couverture *</label
                >
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload($event, 'coverImage')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Captures d'écran</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleFileUpload($event, 'screenshots')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Démo audio (optionnel)</label
                >
                <input
                  type="file"
                  accept="audio/*"
                  @change="handleFileUpload($event, 'demoTrack')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Step 4: Final Details -->
          <div v-else-if="currentStep === 4" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Fonctionnalités principales</label
                >
                <div class="flex gap-2 mb-2">
                  <Input
                    v-model="featureInput"
                    placeholder="Ajouter une fonctionnalité"
                    @keyup.enter="addFeature"
                    class="flex-1"
                  />
                  <Button @click="addFeature" size="sm">Ajouter</Button>
                </div>
                <div class="space-y-2">
                  <div
                    v-for="feature in formData.features"
                    :key="feature"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span class="text-sm">{{ feature }}</span>
                    <button
                      @click="removeFeature(feature)"
                      class="text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Configuration requise</label
                >
                <textarea
                  v-model="formData.requirements"
                  rows="3"
                  placeholder="Ex: Windows 10+, DAW compatible VST3..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notes de version</label>
                <textarea
                  v-model="formData.changelog"
                  rows="3"
                  placeholder="Nouvelles fonctionnalités, corrections..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button v-if="currentStep > 1" @click="prevStep" variant="outline"> Précédent </Button>
            <div v-else></div>

            <div class="flex gap-3">
              <Button v-if="currentStep < 4" @click="nextStep" :disabled="!canProceedToStep">
                Suivant
              </Button>
              <Button v-else @click="submitVST" :disabled="isSubmitting || !canProceedToStep">
                {{ isSubmitting ? 'Publication...' : 'Publier le VST' }}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  </div>
</template>
