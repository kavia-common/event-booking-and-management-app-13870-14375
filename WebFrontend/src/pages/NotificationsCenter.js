import React, { useEffect, useState } from "react";
import Api from "../services/api";

// PUBLIC_INTERFACE
export default function NotificationsCenter() {
  /** List notifications from Notification Service and allow manual trigger. */
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ channel: "email", to: "", subject: "", message: "" });

  const load = () => {
    Api.listNotifications().then((data) => {
      // API returns { items: [...], total, page, size } per spec
      setItems(data.items || []);
    }).catch(()=>setItems([]));
  };

  useEffect(() => { load(); }, []);

  const send = async (e) => {
    e.preventDefault();
    await Api.sendNotification({ ...form, metadata: { source: "web-demo" } });
    setForm({ channel: "email", to: "", subject: "", message: "" });
    load();
  };

  return (
    <section>
      <h1>Notifications</h1>
      <form onSubmit={send} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <label><span>Channel</span>
          <select value={form.channel} onChange={(e)=>setForm({ ...form, channel: e.target.value })}>
            <option value="email">email</option>
            <option value="sms">sms</option>
          </select>
        </label>
        <label><span>To</span><input required value={form.to} onChange={(e)=>setForm({ ...form, to: e.target.value })} /></label>
        {form.channel === "email" && (
          <label><span>Subject</span><input value={form.subject} onChange={(e)=>setForm({ ...form, subject: e.target.value })} /></label>
        )}
        <label><span>Message</span><textarea required value={form.message} onChange={(e)=>setForm({ ...form, message: e.target.value })} /></label>
        <button className="btn">Send</button>
      </form>
      <h2 style={{ marginTop: 24 }}>Recent</h2>
      <ul>
        {items.map(n => (
          <li key={n.id}>
            [{n.channel}] to {n.to} — {n.status} — {n.subject ? `${n.subject}: ` : ""}{n.message}
          </li>
        ))}
        {items.length === 0 && <li>No notifications.</li>}
      </ul>
    </section>
  );
}
