import React, { useEffect, useState } from "react";
import Api from "../services/api";

// PUBLIC_INTERFACE
export default function OrganizerDashboard() {
  /** Organizer analytics summary using Admin or Booking analytics stubs. */
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Api.listVenues().then(setVenues).catch(()=>setVenues([])).finally(()=>setLoading(false));
  }, []);
  return (
    <section>
      <h1>Organizer Dashboard</h1>
      <p>Quick look at your venues and events.</p>
      {loading ? <p>Loading…</p> : (
        <ul>
          {venues.map(v => <li key={v.id}>{v.name} - Capacity: {v.capacity}</li>)}
          {venues.length === 0 && <li>No venues available.</li>}
        </ul>
      )}
    </section>
  );
}
