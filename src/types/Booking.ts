export interface Booking {
  id: number;
  booking_code: string;
  user_id: number;
  user_name: string;
  user_email: string;
  studio_id: number;
  seat_ids: number[];
  qr_code: string;        
  booking_type: "online" | "offline";
  status: "active" | "used" | "cancelled";
  created_at: string;    
  updated_at: string;     
}

export interface BookingResponse {
  booking: Booking;
  qrCode: string;        
}
