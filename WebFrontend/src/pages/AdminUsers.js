import React, { useEffect, useState } from "react";
import Api from "../services/api";

// PUBLIC_INTERFACE
export default function AdminUsers() {
  /** Admin user list with basic details. */
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Api.adminUsers().then(setItems).catch(()=>setItems([])).finally(()=>setLoading(false));
  }, []);
  return (
    <section>
      <h1>Users</h1>
      {loading ? <p>Loading…</p> : (
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr><th align="left">Email</th><th align="left">Roles</th><th align="left">Active</th><th align="left">Verified</th></tr>
          </thead>
          <tbody>
            {items.map(u => (
              <tr key={u.id} style={{ borderTop: "1px solid var(--border-color, #e9ecef)" }}>
                <td>{u.email}</td>
                <td>{(u.roles || []).join(", ")}</td>
                <td>{String(u.is_active)}</td>
                <td>{String(u.is_verified)}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan="4">No users.</td></tr>}
          </tbody>
        </table>
      )}
    </section>
  );
}
