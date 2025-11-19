import React from 'react';
import { BookingResponse } from 'src/types/Booking';
import useSeatMap from 'src/hooks/useSeatMap';
import Input from './UI/Input';
import Tabs from './UI/Tabs';
import Spinner from './UI/Spinner';


export default function SeatMap({ studioId, token, onBooked } : { studioId: number, token: string | null, onBooked: (r: BookingResponse)=>void }) {

  const { seats, selected, loading, name, email, toggle, bookOnline, bookOffline, handleChange, errorMessage, activeTab, setActiveTab, selectedSeats } = useSeatMap({ studioId, token, onBooked });

  return (
    <div>
      <h3>Studio #{studioId} — Seats</h3>
      <div className="flex flex-col gap-4">
        {
          loading && <div className="flex w-full items-center justify-center"><Spinner/></div>
        }
        {
          !loading && seats.length === 0 && <div className="card">No seats available.</div>
        }
        {
          !loading && seats.length > 0 && (
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
          )
        }

      <div className="w-full flex justify-center items-center">
        <div className="border border-b-[1px] py-2 px-40 bg-gray-200 text-center rounded-xl">
          <b>Screen</b>
        </div>
      </div>
      </div>

      <div className="card actions">
        <p>Selected: {selectedSeats || 'none'}</p>
        <Tabs
          tabs={['Online Booking', 'Offline / Cashier']}
          onChange={(index) => setActiveTab(index)}
        />
        {
          activeTab === 0 ? (        <form onSubmit={bookOnline}>
          <h4>Online Booking</h4>
          <button type="submit" disabled={loading}>Book Online (requires login)</button>
        </form>) : (
        <form onSubmit={bookOffline} className="mt">
          <h4>Offline / Cashier</h4>
          <label>Customer Name <Input value={name} onChange={e=>handleChange('name', e.target.value)} required error={errorMessage['name']} /></label>
          <label>Customer Email <Input value={email} onChange={e=>handleChange('email', e.target.value)} required error={errorMessage['email']} /></label>
          <button type="submit" disabled={loading || Boolean(errorMessage['email']) || Boolean(errorMessage['name'])}>Create Offline Booking (Cashier)</button>
        </form>
        )
        }
      </div>
    </div>
  );
}
