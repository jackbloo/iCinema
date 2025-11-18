import { useEffect, useState } from "react";
import { useSnackbar } from "src/components/Snackbar";
import { api } from "src/lib/api";
import {  BookingResponse } from "src/types/Booking";
import { Seat } from "src/types/Seats";



export default function useSeatMap({ studioId, token, onBooked }: { studioId: number, token: string | null, onBooked: (r: BookingResponse) => void }) {
const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { success, error } = useSnackbar();

  useEffect(()=>{ fetchSeats(); }, [studioId]);

  async function fetchSeats() {
    const data: Seat[] = await api.get(`/cinema/studios/${studioId}/seats`);
    const sortedData = data?.sort((a, b) => {
      const numA = parseInt(a.seat_number.replace(/\D/g, ''), 10);
      const numB = parseInt(b.seat_number.replace(/\D/g, ''), 10);
      return numA - numB;
    }) || [];
    setSeats(sortedData || []);
  }

  function toggle(id:number){
    const s = seats.find(x=>x.id===id);
    if(!s || !s.is_available) return;
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  }

  async function bookOnline(e:React.FormEvent) {
    e.preventDefault();
    if(!token){ error('Login required for online booking'); return; }
    if(selected.length===0){ error('Select seats'); return; }
    setLoading(true);
    try{
      const res: BookingResponse = await api.post('/booking/online', { studioId, seatIds: selected }, token);
      if(res?.qrCode){
      onBooked(res);
      success('Booking successful!');      
      await fetchSeats();
      setSelected([]);
      return;
      }

    }catch(err){ error('Booking failed'); }
    setLoading(false);
  }

  async function bookOffline(e:React.FormEvent){
    e.preventDefault();
    if(selected.length===0){ error('Select seats'); return; }
    setLoading(true);
    try{
      const res: BookingResponse = await api.post('/booking/offline', { studioId, seatIds: selected, customerName: name, customerEmail: email });
      if(res?.qrCode){
      onBooked(res);
      success('Booking successful!');      
      await fetchSeats();
      setSelected([]);
      return
      }

    }catch(err){ error('Offline booking failed'); }
    setLoading(false);
  }

 return {
    seats,
    selected,
    loading,
    name,
    setName,
    email,
    setEmail,
    toggle,
    bookOnline,
    bookOffline,
  }

}