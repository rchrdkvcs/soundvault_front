const API_BASE = import.meta.env.VITE_API_URL

function getToken(): string | null {
  return localStorage.getItem('token')
}

interface ApiError {
  status: number
  message?: string
  [key: string]: any
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)

  // Ne pas définir Content-Type si c'est FormData (le navigateur le fait automatiquement)
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      let errorData: any = {}
      try {
        errorData = await res.json()
      } catch {
        // Si la réponse n'est pas en JSON, on utilise le statusText
        errorData = { message: res.statusText }
      }

      throw {
        status: res.status,
        ...errorData,
      }
    }

    // Gérer les réponses sans contenu
    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return {} as T
    }

    // Vérifier si la réponse contient du JSON
    const contentType = res.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await res.json()
    }

    // Si ce n'est pas du JSON, retourner le texte
    return (await res.text()) as unknown as T
  } catch (error) {
    if (error instanceof TypeError) {
      // Erreur réseau (pas de connexion, etc.)
      throw {
        status: 0,
        message: 'Erreur réseau : impossible de contacter le serveur',
      } as ApiError
    }
    throw error
  }
}

export function useApi() {
  return {
    get: <T>(url: string, options?: Omit<RequestInit, 'method' | 'body'>) =>
      request<T>(url, { ...options, method: 'GET' }),

    post: <T>(url: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>) =>
      request<T>(url, {
        ...options,
        method: 'POST',
        body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
      }),

    put: <T>(url: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>) =>
      request<T>(url, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),

    patch: <T>(url: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>) =>
      request<T>(url, {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      }),

    delete: <T>(url: string, options?: Omit<RequestInit, 'method' | 'body'>) =>
      request<T>(url, { ...options, method: 'DELETE' }),
  }
}
