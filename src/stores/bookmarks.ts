import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarkedVsts = ref<string[]>([])

  // Load bookmarks from localStorage on store creation
  const loadBookmarks = () => {
    const saved = localStorage.getItem('vst-bookmarks')
    if (saved) {
      try {
        bookmarkedVsts.value = JSON.parse(saved)
      } catch (error) {
        console.error('Error loading bookmarks:', error)
        bookmarkedVsts.value = []
      }
    }
  }

  // Save bookmarks to localStorage
  const saveBookmarks = () => {
    localStorage.setItem('vst-bookmarks', JSON.stringify(bookmarkedVsts.value))
  }

  // Add VST to bookmarks
  const addBookmark = (vstId: string) => {
    if (!bookmarkedVsts.value.includes(vstId)) {
      bookmarkedVsts.value.push(vstId)
      saveBookmarks()
    }
  }

  // Remove VST from bookmarks
  const removeBookmark = (vstId: string) => {
    const index = bookmarkedVsts.value.indexOf(vstId)
    if (index > -1) {
      bookmarkedVsts.value.splice(index, 1)
      saveBookmarks()
    }
  }

  // Toggle bookmark status
  const toggleBookmark = (vstId: string) => {
    if (isBookmarked(vstId)) {
      removeBookmark(vstId)
    } else {
      addBookmark(vstId)
    }
  }

  // Check if VST is bookmarked
  const isBookmarked = (vstId: string) => {
    return bookmarkedVsts.value.includes(vstId)
  }

  // Get count of bookmarks
  const bookmarkCount = computed(() => bookmarkedVsts.value.length)

  // Clear all bookmarks
  const clearBookmarks = () => {
    bookmarkedVsts.value = []
    saveBookmarks()
  }

  // Initialize store
  loadBookmarks()

  return {
    bookmarkedVsts,
    bookmarkCount,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
    loadBookmarks,
  }
})
