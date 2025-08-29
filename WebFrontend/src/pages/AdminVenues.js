import React, { useEffect, useState } from "react";
import Api from "../services/api";

// PUBLIC_INTERFACE
export default function AdminVenues() {
  /** Admin venue list. */
  const [items, setItems] = useState([]);
  useEffect(() => {
    Api.adminVenues().then(setItems).catch(()=>setItems([]));
  }, []);
  return (
    <section>
      <h1>Venues</h1>
      <ul>
        {items.map(v => <li key={v.id}>{v.name} — {v.city}, {v.country} • Capacity {v.capacity}</li>)}
        {items.length === 0 && <li>No venues found.</li>}
      </ul>
    </section>
  );
}
