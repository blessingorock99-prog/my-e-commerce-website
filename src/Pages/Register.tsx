import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError("");
    setLoading(true);
    try {
      await apiRequest("/users/create-account", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      // Registration successful → go to login
      navigate("/login");
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
        <div className="auth-sub">Create your account to get started.</div>

        {/* ← shows API error messages */}
        {error && <p style={{ color: "red", fontSize: ".85rem" }}>{error}</p>}

        {/* Split into two fields to match what the API expects */}
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="input"
            placeholder="John"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="input"
            placeholder="Doe"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="joe@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="******"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%" }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </div>
    </div>
  );
}
