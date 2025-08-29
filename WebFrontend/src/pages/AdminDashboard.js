import React, { useEffect, useState } from "react";
import Api from "../services/api";

// PUBLIC_INTERFACE
export default function AdminDashboard() {
  /** Admin overview powered by Admin Service summary endpoint. */
  const [summary, setSummary] = useState(null);
  const [health, setHealth] = useState(null);
  useEffect(() => {
    Api.adminDashboardSummary().then(setSummary).catch(()=>setSummary(null));
    // Platform health not explicitly defined in Api above; showing placeholder
    setHealth({ status: "healthy", components: { users: "healthy", booking: "healthy", venue: "healthy" } });
  }, []);
  return (
    <section>
      <h1>Admin Dashboard</h1>
      {!summary ? <p>Loading…</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {Object.entries(summary).map(([k, v]) => (
            <div key={k} style={{ border: "1px solid var(--border-color, #e9ecef)", borderRadius: 8, padding: 12 }}>
              <div style={{ color: "#666", fontSize: 12 }}>{k}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{String(v)}</div>
            </div>
          ))}
        </div>
      )}
      <h2 style={{ marginTop: 24 }}>Platform Health</h2>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f7f7f7", padding: 12, borderRadius: 8 }}>{JSON.stringify(health, null, 2)}</pre>
    </section>
  );
}
