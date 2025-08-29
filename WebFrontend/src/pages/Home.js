import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Home() {
  /** Simple landing with primary navigation. */
  return (
    <section>
      <h1>Discover and Book Events</h1>
      <p>Browse events, select your seats in real-time, and get instant confirmation.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="btn" to="/events">Find Events</Link>
        <Link className="btn outline" to="/login">Login</Link>
        <Link className="btn outline" to="/register">Register</Link>
      </div>
    </section>
  );
}
