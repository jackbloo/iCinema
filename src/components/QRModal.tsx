import React from 'react';
import { BookingResponse } from 'src/types/Booking';

export default function QRModal({ booking, onClose } : { booking: BookingResponse, onClose: ()=>void }) {

  return (
    <div className="modal">
      <div className="card">
        <h3>Booking Confirmed</h3>
        <p>Booking code: <strong>{booking?.booking?.booking_code ?? '—'}</strong></p>
        <img src={booking.qrCode} alt="QR Code" />
        <div className="row">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
