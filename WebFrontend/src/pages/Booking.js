import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../services/api";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Booking() {
  /** Booking flow with simple seat grid and selection interactions. */
  const { eventId } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const [seatMap, setSeatMap] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Api.getSeatMap(eventId)
      .then((data) => {
        if (cancelled) return;
        // Expecting { event_id, seats: [{id,label,price,status}] }
        setSeatMap(data);
      })
      .catch(() => {
        // Fallback demo seat grid if API not available
        if (cancelled) return;
        const seats = [];
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 10; c++) {
            const id = `S-${r}-${c}`;
            seats.push({ id, label: `R${r+1}C${c+1}`, price: 25 + (r*5), status: Math.random() < 0.1 ? "allocated" : "available" });
          }
        }
        setSeatMap({ event_id: eventId, seats });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [eventId]);

  const total = useMemo(() => {
    return selected.reduce((acc, sid) => {
      const seat = seatMap?.seats?.find(s => s.id === sid);
      return acc + (seat?.price || 0);
    }, 0);
  }, [selected, seatMap]);

  const toggleSeat = (sid) => {
    const seat = seatMap?.seats?.find(s => s.id === sid);
    if (!seat || seat.status !== "available") return;
    setSelected((prev) => prev.includes(sid) ? prev.filter(x => x !== sid) : [...prev, sid]);
  };

  const book = async () => {
    if (selected.length === 0) return;
    setError("");
    setCreating(true);
    try {
      // Create reservation first (optional demo)
      await Api.createReservation({ event_id: eventId, seat_ids: selected, hold_minutes: 10 });
      // Then create booking
      const booking = await Api.createBooking({ event_id: eventId, seat_ids: selected, auto_pay: true });
      nav(`/events/${eventId}`, { state: { bookingId: booking.id } });
    } catch (e) {
      setError(e.message || "Booking failed");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p>Loading seat map…</p>;

  const groupedRows = {};
  (seatMap?.seats || []).forEach((s) => {
    // Simple grouping by first 2 chars of label to simulate a row
    const rowKey = s.label.split("C")[0];
    if (!groupedRows[rowKey]) groupedRows[rowKey] = [];
    groupedRows[rowKey].push(s);
  });

  return (
    <section>
      <h1>Book Seats</h1>
      <p>Event: {eventId}</p>
      <p>User: {user?.email}</p>
      {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}
      <div style={{ display: "grid", gap: 10 }}>
        {Object.entries(groupedRows).map(([row, seats]) => (
          <div key={row} style={{ display: "grid", gridTemplateColumns: `repeat(${seats.length}, 1fr)`, gap: 6, alignItems: "center" }}>
            {seats.map(seat => {
              const isSel = selected.includes(seat.id);
              const disabled = seat.status !== "available";
              return (
                <button
                  key={seat.id}
                  onClick={() => toggleSeat(seat.id)}
                  disabled={disabled}
                  aria-pressed={isSel}
                  aria-label={`${seat.label}, $${seat.price}, ${disabled ? seat.status : "available"}`}
                  style={{
                    padding: "8px 6px",
                    borderRadius: 6,
                    border: "1px solid var(--border-color, #e9ecef)",
                    background: disabled ? "#eee" : isSel ? "#198754" : "white",
                    color: disabled ? "#666" : isSel ? "white" : "inherit",
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  {seat.label}
                  <div style={{ fontSize: 12 }}>${seat.price}</div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <strong>Total: ${total.toFixed(2)}</strong>
        <button className="btn" onClick={book} disabled={creating || selected.length === 0} aria-disabled={creating || selected.length === 0}>
          {creating ? "Processing…" : "Confirm Booking"}
        </button>
      </div>
    </section>
  );
}
