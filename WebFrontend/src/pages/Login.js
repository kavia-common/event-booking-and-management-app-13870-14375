import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form with email and password. */
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      const to = location.state?.from || "/";
      nav(to, { replace: true });
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Login</h1>
      {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <label>
          <span>Email</span>
          <input type="email" autoComplete="username" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        </label>
        <label>
          <span>Password</span>
          <input type="password" autoComplete="current-password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
        </label>
        <button className="btn" disabled={submitting}>{submitting ? "Signing in…" : "Login"}</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </section>
  );
}
