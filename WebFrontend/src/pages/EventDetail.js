import React from "react";
import { useParams, Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function EventDetail() {
  /** Basic event detail using sample data lookup from Events page for demo. */
  const { eventId } = useParams();
  return (
    <section>
      <h1>Event Detail</h1>
      <p>Event ID: {eventId}</p>
      <p>This page would fetch event details and pricing tiers via the API Gateway (Event Service).</p>
      <Link className="btn" to={`/book/${eventId}`}>Select Seats</Link>
    </section>
  );
}
