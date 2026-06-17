import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      console.log("Login response:", data);
      
      const token = data.user?.tokens?.accessToken || data.user?.tokens?.access_token || data.user?.tokens?.token
      const refreshToken = data.user?.tokens?.refreshToken

      if (token) {
        localStorage.setItem("token", token)
        const secureCookie = window.location.protocol === "https:"
        const cookieBase = `; path=/; SameSite=${secureCookie ? "None" : "Lax"}${secureCookie ? "; Secure" : ""}`
        document.cookie = `accessToken=${token}${cookieBase}`;
        document.cookie = `token=${token}${cookieBase}`;
        window.dispatchEvent(new Event("auth-changed"))
      }
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
      const loggedInUser = data.user?.user || data.user?.data || data.user
      if (loggedInUser) {
        localStorage.setItem("user", JSON.stringify(loggedInUser))
      }

      console.log("Stored token:", token)
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Sneak<span>Tech</span></div>
        <div className="auth-sub">Welcome back! Sign in to continue.</div>

        {/* ← shows API error messages */}
        {error && <p style={{ color: "red", fontSize: ".85rem" }}>{error}</p>}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="or-divider">or continue with</div>
        <div className="auth-social">
          <button className="social-btn">Continue with Facebook</button>
          <button className="social-btn">Continue with Google</button>
        </div>
        <p style={{ color: "var(--muted)", fontSize: ".85rem", textAlign: "center", marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--teal-mid)" }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
