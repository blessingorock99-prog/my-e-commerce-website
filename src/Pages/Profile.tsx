import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface User {
  firstName: string
  lastName: string
  email: string
  createdAt: string
}

function getUserFromToken(): User | null {
  const token = localStorage.getItem("token")
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    console.log("Full token payload:", payload)
    return {
      firstName: payload.firstName || payload.first_name || payload.name?.split(" ")[0] || "User",
      lastName: payload.lastName || payload.last_name || payload.name?.split(" ")[1] || "",
      email: payload.email || "",
      createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = getUserFromToken()
    if (!userData) {
      navigate("/login")
      return
    }
    setUser(userData)
  }, [])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  if (!user) return null

  return (
    <div className="section" style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h1 className="section-title">My Profile</h1>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem', marginTop: '1.5rem' }}>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginBottom: '1rem' }}>Account details and recent activity.</p>
        <div className="spec-row">
          <span className="spec-label">Name</span>
          <span>{user.firstName} {user.lastName}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Email</span>
          <span>{user.email}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Member since</span>
          <span>{formatDate(user.createdAt)}</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Wishlist</span>
          <span>12 items</span>
        </div>
        <div className="spec-row">
          <span className="spec-label">Orders</span>
          <span>4 completed</span>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link className="btn-primary" to="/shop">Continue Shopping</Link>
      </div>
    </div>
  )
}