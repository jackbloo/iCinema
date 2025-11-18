export interface Studio {
  id: number;
  name: string;
  total_seats: number;
  created_at: string;  
  updated_at: string;  
}

export interface Seat {
  id: number;
  studio_id: number;
  seat_number: string;   
  is_available: boolean;
  studio: Studio;        
  studio_name: string;  
  created_at: string;    
  updated_at: string;    
}
