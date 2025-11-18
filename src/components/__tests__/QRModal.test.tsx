import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QRModal from '../QRModal';
import { BookingResponse } from '../../types/Booking';

describe('QRModal', () => {
  const mockOnClose = vi.fn();
  
  const mockBooking: BookingResponse = {
    booking: {
      id: 1,
      booking_code: 'ABC123',
      user_id: 1,
      user_name: 'Test User',
      user_email: 'test@example.com',
      studio_id: 1,
      seat_ids: [1, 2],
      qr_code: 'qr-code-data',
      booking_type: 'online',
      status: 'active',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    qrCode: 'data:image/png;base64,test-qr-code',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal with booking confirmation', () => {
    render(<QRModal booking={mockBooking} onClose={mockOnClose} />);
    
    expect(screen.getByText('Booking Confirmed')).toBeDefined();
  });

  it('should display booking code', () => {
    render(<QRModal booking={mockBooking} onClose={mockOnClose} />);
    
    expect(screen.getByText('ABC123')).toBeDefined();
  });

  it('should render QR code image', () => {
    render(<QRModal booking={mockBooking} onClose={mockOnClose} />);
    
    const img = screen.getByAltText('QR Code');
    expect(img).toBeDefined();
    expect(img.getAttribute('src')).toBe('data:image/png;base64,test-qr-code');
  });

  it('should render close button', () => {
    render(<QRModal booking={mockBooking} onClose={mockOnClose} />);
    
    expect(screen.getByText('Close')).toBeDefined();
  });

  it('should call onClose when close button is clicked', () => {
    render(<QRModal booking={mockBooking} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should display fallback when booking code is missing', () => {
    const bookingWithoutCode: BookingResponse = {
      booking: null as any,
      qrCode: 'data:image/png;base64,test-qr-code',
    };

    render(<QRModal booking={bookingWithoutCode} onClose={mockOnClose} />);
    
    expect(screen.getByText('—')).toBeDefined();
  });

  it('should handle undefined booking object', () => {
    const bookingWithUndefined: BookingResponse = {
      booking: undefined as any,
      qrCode: 'data:image/png;base64,test-qr-code',
    };

    render(<QRModal booking={bookingWithUndefined} onClose={mockOnClose} />);
    
    expect(screen.getByText('—')).toBeDefined();
  });
});
