# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` or `bun dev`
- **Build for production**: `npm run build` or `bun build`
- **Type checking**: `npm run type-check` or `bun type-check`
- **Linting**: `npm run lint` (runs oxlint and eslint in sequence)
- **Code formatting**: `npm run format`
- **Preview production build**: `npm run preview`

Note: The project uses both npm and bun (based on bun.lock presence). Commands should work with either package manager.

## Project Architecture

This is a Vue 3 + TypeScript + Vite frontend application for SoundVault with the following key architectural components:

### Tech Stack
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.x + DaisyUI
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Type Safety**: TypeScript with vue-tsc

### Core Architecture

**Layout System**: 
- Uses nested routing with `AppLayout.vue` as the main layout wrapper
- Layout includes: `AppHeader` and `AppFooter` components
- Simple responsive layout with main content area for RouterView

**Authentication Flow**:
- Pinia store in `stores/auth.ts` manages authentication state
- Route guards in `router/index.ts` protect routes with `requiresAuth` and `requiresGuest` meta
- JWT token stored in localStorage with automatic logout on token expiry
- API composable `useApi.ts` automatically attaches Bearer token to requests

**API Integration**:
- Centralized API client in `composables/useApi.ts`
- Uses `VITE_API_URL` environment variable for base URL
- Automatic error handling and token management
- Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)

**File Structure**:
- `components/core/`: Layout components (header, footer)
- `components/ui/`: Reusable UI components (Button, Card, Input, etc.)
- `components/features/`: Feature-specific components (e.g., VST components)
- `views/`: Page components organized by feature (auth/, profile/, vst/, etc.)
- `stores/`: Pinia state management
- `composables/`: Reusable Vue composables
- `types/`: TypeScript type definitions
- `layouts/`: Layout wrapper components

### Key Features
- Protected routes with authentication guards
- Responsive layout with Tailwind CSS
- Type-safe API calls with error handling
- Automatic token refresh and logout handling