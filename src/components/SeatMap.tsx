import React from 'react';
import { BookingResponse } from 'src/types/Booking';
import useSeatMap from 'src/hooks/useSeatMap';


export default function SeatMap({ studioId, token, onBooked } : { studioId: number, token: string | null, onBooked: (r: BookingResponse)=>void }) {

  const { seats, selected, loading, name, setName, email, setEmail, toggle, bookOnline, bookOffline } = useSeatMap({ studioId, token, onBooked });

  return (
    <div>
      <h3>Studio #{studioId} — Seats</h3>
      <div className="seat-grid">
        {seats.map(s => (
          <button
            key={s.id}
            className={`seat ${s.is_available ? 'available' : 'booked'} ${selected.includes(s.id) ? 'selected' : ''}`}
            onClick={()=>toggle(s.id)}
            title={s.seat_number}
          >
            {s.seat_number}
          </button>
        ))}
      </div>

      <div className="card actions">
        <form onSubmit={bookOnline}>
          <h4>Online Booking</h4>
          <p>Selected: {selected.join(', ') || 'none'}</p>
          <button type="submit" disabled={loading}>Book Online (requires login)</button>
        </form>

        <form onSubmit={bookOffline} className="mt">
          <h4>Offline / Cashier</h4>
          <label>Customer Name <input value={name} onChange={e=>setName(e.target.value)} required /></label>
          <label>Customer Email <input value={email} onChange={e=>setEmail(e.target.value)} required /></label>
          <button type="submit" disabled={loading || !email || !name}>Create Offline Booking (Cashier)</button>
        </form>
      </div>
    </div>
  );
}
