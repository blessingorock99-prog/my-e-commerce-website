import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'

export default function AdminAuth() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleAdminLogin() {
    setError("")
    setLoading(true)
    try {
      const data = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      console.log("Admin login response:", data)

      const token = data.user?.tokens?.accessToken || data.user?.tokens?.access_token || data.user?.tokens?.token
      const refreshToken = data.user?.tokens?.refreshToken

      if (!token) throw new Error("No token returned from API")

      localStorage.setItem("adminToken", token)
      if (refreshToken) localStorage.setItem("adminRefreshToken", refreshToken)
      
      // Set multiple cookie names for backend compatibility
      const secureCookie = window.location.protocol === "https:"
      const cookieBase = `; path=/; SameSite=${secureCookie ? "None" : "Lax"}${secureCookie ? "; Secure" : ""}`
      document.cookie = `accessToken=${token}${cookieBase}`;
      document.cookie = `token=${token}${cookieBase}`;
      window.dispatchEvent(new Event("auth-changed"))
      
      navigate("/admin/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Sneak<span>Tech</span></div>
        <div className="auth-sub">Admin authentication</div>

        {error && <p style={{ color: "red", fontSize: ".85rem", marginBottom: "1rem" }}>{error}</p>}

        <div className="form-group">
          <label className="form-label">Admin Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="admin@swiftdrop.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter secure password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={handleAdminLogin}
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Access Dashboard"}
        </button>

        <p style={{ color: 'var(--muted)', fontSize: '.85rem', textAlign: 'center', marginTop: '1rem' }}>
          Store customer account?{" "}
          <Link to="/login" style={{ color: 'var(--teal-mid)' }}>Use customer login</Link>
        </p>
      </div>
    </main>
  )
}
