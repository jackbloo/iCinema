# Cinema Booking — Astro + React (TypeScript)

Minimal responsive frontend for a cinema ticket booking system built with Astro + React (TypeScript).
This project implements:
- Register / Login pages (supports JWT from provided backend endpoints)
- Studio list and seat map (5 studios, 20 seats each assumed from backend)
- Online booking (uses the backend endpoints you supplied)
- Offline booking (cashier)
- Generates QR code (uses `qrcode` lib) after successful booking for validation at theater
- Seats are locked after booking (backend responsibility) — frontend shows optimistic lock and fetches seats after booking

## Backend endpoints (provided by you)
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/cinema/studios
- GET  /api/cinema/studios/:id/seats
- POST /api/booking/online
- POST /api/booking/offline
- POST /api/booking/validate

## How to run
1. Install dependencies:
   ```
   npm install
   ```
2. Run dev:
   ```
   npm run dev
   ```
3. Open http://localhost:3000

## Notes
- This scaffold focuses on frontend flow; it expects the backend endpoints to behave as described in your spec.
- Replace `API_BASE` in `src/lib/api.ts` if your backend runs on a different host/port.
- This code is intentionally minimal and easy to adapt.
