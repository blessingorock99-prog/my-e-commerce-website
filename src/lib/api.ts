const BASE_URL = "/api/v1"


export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken")

  // Sync token to cookies for backend compatibility (localhost -> onrender.com)
  if (token && typeof document !== "undefined") {
    const secureCookie = window.location.protocol === "https:"
    const cookieBase = `; path=/; SameSite=${secureCookie ? "None" : "Lax"}${secureCookie ? "; Secure" : ""}`
    document.cookie = `accessToken=${token}${cookieBase}`
    document.cookie = `token=${token}${cookieBase}`
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  console.log(`[API] Requesting ${path}`, { 
    hasToken: !!token, 
    cookiesPresent: typeof document !== 'undefined' ? document.cookie.split(';').map(c => c.split('=')[0].trim()) : []
  });

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include", // This is the "withCredentials" equivalent
  })

  if (res.status === 204) return null
  const text = await res.text()
  const data = text ? (() => {
    try {
      return JSON.parse(text)
    } catch {
      return { message: text }
    }
  })() : null

  if (!res.ok) {
    console.error(`[API] Error ${res.status}:`, data)
    throw new Error(data?.message || text || `Request failed: ${res.status}`)
  }

  return data
}
