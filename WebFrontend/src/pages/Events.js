import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Placeholder sample data for events (since EventService API spec file not present in this workspace)
const sampleEvents = [
  { id: "evt-1", title: "Jazz Night", city: "New York", date: "2025-09-20", category: "Music", summary: "Smooth jazz evening." },
  { id: "evt-2", title: "Tech Conference", city: "San Francisco", date: "2025-10-05", category: "Conference", summary: "Latest in tech." },
  { id: "evt-3", title: "Stand-up Comedy", city: "Chicago", date: "2025-11-12", category: "Comedy", summary: "Laugh out loud." },
];

// PUBLIC_INTERFACE
export default function Events() {
  /** Event discovery with keyword, city, category filters. */
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    return sampleEvents.filter((e) => {
      const matchesQ = q ? (e.title.toLowerCase().includes(q.toLowerCase()) || e.summary.toLowerCase().includes(q.toLowerCase())) : true;
      const matchesCity = city ? e.city === city : true;
      const matchesCat = category ? e.category === category : true;
      return matchesQ && matchesCity && matchesCat;
    });
  }, [q, city, category]);

  const cities = [...new Set(sampleEvents.map(e => e.city))];
  const categories = [...new Set(sampleEvents.map(e => e.category))];

  return (
    <section>
      <h1>Events</h1>
      <form style={{ display: "grid", gridTemplateColumns: "1fr 200px 200px auto", gap: 8, alignItems: "center" }} onSubmit={(e)=>e.preventDefault()}>
        <label className="sr-only" htmlFor="search">Search</label>
        <input id="search" placeholder="Search events" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select aria-label="Filter by city" value={city} onChange={(e)=>setCity(e.target.value)}>
          <option value="">All cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Filter by category" value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn" type="button" onClick={()=>{setQ("");setCity("");setCategory("");}}>Reset</button>
      </form>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {filtered.map(e => (
          <article key={e.id} style={{ border: "1px solid var(--border-color, #e9ecef)", borderRadius: 8, padding: 12 }}>
            <h3>{e.title}</h3>
            <p style={{ margin: "4px 0" }}>{e.summary}</p>
            <p style={{ margin: "4px 0", color: "#666" }}>{e.city} • {e.date} • {e.category}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Link className="btn small" to={`/events/${e.id}`}>Details</Link>
              <Link className="btn small outline" to={`/book/${e.id}`}>Book</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
