import React, { useEffect, useState } from "react";
import Api from "../services/api";

// PUBLIC_INTERFACE
export default function OrganizerVenues() {
  /** Venue management list and simple create form. */
  const [venues, setVenues] = useState([]);
  const [form, setForm] = useState({ name: "", address: "", city: "", country: "", capacity: 100 });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Api.listVenues().then(setVenues).catch(()=>setVenues([])).finally(()=>setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await Api.createVenue(form);
    setForm({ name: "", address: "", city: "", country: "", capacity: 100 });
    load();
  };

  return (
    <section>
      <h1>Venues</h1>
      <form onSubmit={create} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <label><span>Name</span><input required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} /></label>
        <label><span>Address</span><input required value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})} /></label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <label><span>City</span><input required value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})} /></label>
          <label><span>Country</span><input required value={form.country} onChange={(e)=>setForm({...form, country: e.target.value})} /></label>
        </div>
        <label><span>Capacity</span><input type="number" min={1} required value={form.capacity} onChange={(e)=>setForm({...form, capacity: Number(e.target.value)})} /></label>
        <button className="btn">Create Venue</button>
      </form>
      <h2 style={{ marginTop: 24 }}>Your Venues</h2>
      {loading ? <p>Loading…</p> : (
        <ul>
          {venues.map(v => <li key={v.id}>{v.name} — {v.city}, {v.country} • Capacity {v.capacity}</li>)}
          {venues.length === 0 && <li>No venues yet.</li>}
        </ul>
      )}
    </section>
  );
}
