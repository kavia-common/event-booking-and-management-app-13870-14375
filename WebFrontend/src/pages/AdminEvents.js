import React, { useEffect, useState } from "react";
import Api from "../services/api";

// PUBLIC_INTERFACE
export default function AdminEvents() {
  /** Admin event list. */
  const [items, setItems] = useState([]);
  useEffect(() => {
    Api.adminEvents().then(setItems).catch(()=>setItems([]));
  }, []);
  return (
    <section>
      <h1>Events</h1>
      <ul>
        {items.map(ev => <li key={ev.id}>{ev.title} — status: {ev.status}</li>)}
        {items.length === 0 && <li>No events found.</li>}
      </ul>
    </section>
  );
}
