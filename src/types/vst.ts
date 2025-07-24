export interface VST {
  id: string
  name: string
  description: string
  version: string
  price: number
  salePrice?: number
  category: VSTCategory
  tags: string[]
  author: {
    id: string
    username: string
    avatar?: string
  }
  image?: string
  images: string[]
  downloadUrl?: string
  demoUrl?: string
  fileSize?: number
  requirements?: {
    os: string[]
    vstVersion: string[]
    memory: string
    disk: string
  }
  rating?: number
  ratings?: {
    average: number
    count: number
  }
  ratingCount?: number
  downloads?: number
  downloadCount?: number
  isBookmarked?: boolean
  isFree: boolean
  createdAt: string
  updatedAt: string
}

export interface VSTCategory {
  id: string
  name: string
  slug: string
  description?: string
}

export interface VSTReview {
  id: string
  vstId: string
  userId: string
  user: {
    username: string
    avatar?: string
  }
  rating: number
  comment: string
  createdAt: string
}

export interface VSTFilter {
  category?: string
  priceRange?: {
    min: number
    max: number
  }
  isFree?: boolean
  tags?: string[]
  author?: string
  sortBy?: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'rating' | 'downloads'
  search?: string
}
