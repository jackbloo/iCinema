import { useEffect, useState } from "react";
import { api } from "src/lib/api";
import { BookingResponse } from "src/types/Booking";
import { Studio } from "src/types/Studio";


export default function useStudioList() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);

  useEffect(()=>{ api.get<Studio[]>('/cinema/studios').then((s)=>setStudios(s || [])); }, []);

  return { studios, selectedStudio, setSelectedStudio, bookingResult, setBookingResult };
}