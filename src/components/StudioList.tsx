import React from 'react';
import SeatMap from './SeatMap';
import QRModal from './QRModal';
import useStudioList from 'src/hooks/useStudioList';
import Spinner from './UI/Spinner';


export default function StudioList({ token }: { token: string | null }) {
  const { studios, selectedStudio, setSelectedStudio, bookingResult, setBookingResult } = useStudioList();

  return (
    <div className="studio-wrap">
      <aside className="sidebar">
        <h2>Studios</h2>
        <ul>
          {studios.length === 0 && <div className='flex w-full items-center justify-center'><Spinner/></div>}
          {studios.map(st => (
            <li key={st.id}>
              <button onClick={()=>setSelectedStudio(st)} className={`studio-btn ${selectedStudio?.id === st.id ? 'selected' : ''}`}>{st.name}</button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="content">
        {!selectedStudio ? (
          <div className="card">Select a studio to view seats.</div>
        ) : (
          <SeatMap studioId={selectedStudio.id} token={token} onBooked={(res)=>{ setBookingResult(res); }} />
        )}
      </section>

      {bookingResult && <QRModal booking={bookingResult} onClose={()=>setBookingResult(null)} />}
    </div>
  );
}
