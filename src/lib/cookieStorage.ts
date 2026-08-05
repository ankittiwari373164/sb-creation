// Cookie-based storage utilities.
// The project previously relied on localStorage (via zustand's `persist`
// middleware and manual localStorage calls). Per request, localStorage is no
// longer used anywhere — everything that needs to survive a page reload
// (cart contents, checkout shipping details) is now saved in cookies
// instead.

const isBrowser = typeof document !== 'undefined'

export function setCookie(name: string, value: string, days = 30) {
  if (!isBrowser) return
  const maxAge = days * 24 * 60 * 60
  // Encode so JSON / special characters survive safely inside a cookie.
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`
}

export function getCookie(name: string): string | null {
  if (!isBrowser) return null
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
  if (!match) return null
  try {
    return decodeURIComponent(match.split('=').slice(1).join('='))
  } catch {
    return null
  }
}

export function deleteCookie(name: string) {
  if (!isBrowser) return
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

// Storage adapter compatible with zustand's `persist` middleware
// (implements getItem/setItem/removeItem like the Web Storage API).
export const cookieStorageAdapter = {
  getItem: (name: string): string | null => getCookie(name),
  setItem: (name: string, value: string): void => setCookie(name, value, 30),
  removeItem: (name: string): void => deleteCookie(name),
}