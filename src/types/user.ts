import type { VST } from './vst'

export interface User {
  id: string
  username: string
  email: string
  bio?: string
  avatar?: string
  website?: string
  location?: string
  createdAt: string
  updatedAt?: string | null
  stats?: {
    vstCount: number
    downloads: number
    followers: number
    following: number
  }
}

export interface UserProfile extends User {
  vsts: VST[]
  bookmarks: VST[]
  isFollowing?: boolean
}

export interface Bookmark {
  id: string
  userId: string
  vstId: string
  createdAt: string
  vst: VST
}
