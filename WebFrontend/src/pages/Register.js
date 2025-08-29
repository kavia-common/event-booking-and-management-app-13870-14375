import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form supporting attendee/organizer role selection. */
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("attendee");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register({ email, password, role });
      nav("/", { replace: true });
    } catch (e) {
      setError(e.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Create account</h1>
      {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <label>
          <span>Email</span>
          <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        </label>
        <label>
          <span>Password</span>
          <input type="password" required minLength={8} value={password} onChange={(e)=>setPassword(e.target.value)} />
        </label>
        <label>
          <span>Role</span>
          <select value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
          </select>
        </label>
        <button className="btn" disabled={submitting}>{submitting ? "Creating…" : "Register"}</button>
      </form>
    </section>
  );
}
