import { useEffect, useState } from "react";
import { api } from "src/lib/api";
import { Studio } from "src/types/Studio";


export default function useStudioList() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(()=>{ api.get('/cinema/studios').then(s=>setStudios(s || [])); }, []);

  return { studios, selectedStudio, setSelectedStudio, bookingResult, setBookingResult };
}