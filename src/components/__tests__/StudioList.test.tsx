import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudioList from '../StudioList';
import useStudioList from '../../hooks/useStudioList';
import SeatMap from '../SeatMap';
import QRModal from '../QRModal';

vi.mock('../../hooks/useStudioList');
vi.mock('../SeatMap');
vi.mock('../QRModal');

describe('StudioList', () => {
  const mockSetSelectedStudio = vi.fn();
  const mockSetBookingResult = vi.fn();

  const mockStudios = [
    { id: 1, name: 'Studio A', total_seats: 50, created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 2, name: 'Studio B', total_seats: 100, created_at: '2024-01-02', updated_at: '2024-01-02' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(SeatMap).mockImplementation(({ studioId, token }) => (
      <div>SeatMap - Studio {studioId} - Token: {token || 'none'}</div>
    ));
    
    vi.mocked(QRModal).mockImplementation(({ booking, onClose }) => (
      <div>
        <div>QRModal - {booking.booking.booking_code}</div>
        <button onClick={onClose}>Close QR</button>
      </div>
    ));
  });

  it('should render studios heading', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: [],
      selectedStudio: null,
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    expect(screen.getByText('Studios')).toBeDefined();
  });

  it('should show loading when studios are empty', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: [],
      selectedStudio: null,
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('should render list of studios', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: null,
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    expect(screen.getByText('Studio A')).toBeDefined();
    expect(screen.getByText('Studio B')).toBeDefined();
  });

  it('should call setSelectedStudio when studio button is clicked', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: null,
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    const studioAButton = screen.getByText('Studio A');
    fireEvent.click(studioAButton);
    
    expect(mockSetSelectedStudio).toHaveBeenCalledWith(mockStudios[0]);
  });

  it('should apply selected class to selected studio', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: mockStudios[0],
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    const studioAButton = screen.getByText('Studio A');
    expect(studioAButton.className).toContain('selected');
  });

  it('should not apply selected class to unselected studios', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: mockStudios[0],
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    const studioBButton = screen.getByText('Studio B');
    expect(studioBButton.className).not.toContain('selected');
  });

  it('should show select studio message when no studio is selected', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: null,
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    expect(screen.getByText('Select a studio to view seats.')).toBeDefined();
  });

  it('should render SeatMap when studio is selected', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: mockStudios[0],
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    expect(screen.getByText('SeatMap - Studio 1 - Token: none')).toBeDefined();
  });

  it('should pass token to SeatMap', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: mockStudios[0],
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token="test-token" />);
    
    expect(screen.getByText('SeatMap - Studio 1 - Token: test-token')).toBeDefined();
  });

  it('should not render SeatMap when no studio is selected', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: null,
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    expect(screen.queryByText(/SeatMap - Studio/)).toBeNull();
  });

  it('should render QRModal when booking result exists', () => {
    const mockBookingResult = {
      booking: {
        id: 1,
        booking_code: 'ABC123',
        user_id: 1,
        user_name: 'Test User',
        user_email: 'test@example.com',
        studio_id: 1,
        seat_ids: [1, 2],
        qr_code: 'qr-code',
        booking_type: 'online' as const,
        status: 'active' as const,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      qrCode: 'qr-code-data',
    };

    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: null,
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: mockBookingResult,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    expect(screen.getByText('QRModal - ABC123')).toBeDefined();
  });

  it('should not render QRModal when booking result is null', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: null,
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    expect(screen.queryByText(/QRModal/)).toBeNull();
  });

  it('should call setBookingResult when QRModal is closed', () => {
    const mockBookingResult = {
      booking: {
        id: 1,
        booking_code: 'ABC123',
        user_id: 1,
        user_name: 'Test User',
        user_email: 'test@example.com',
        studio_id: 1,
        seat_ids: [1, 2],
        qr_code: 'qr-code',
        booking_type: 'online' as const,
        status: 'active' as const,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      qrCode: 'qr-code-data',
    };

    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: null,
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: mockBookingResult,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    const closeButton = screen.getByText('Close QR');
    fireEvent.click(closeButton);
    
    expect(mockSetBookingResult).toHaveBeenCalledWith(null);
  });

  it('should pass onBooked callback to SeatMap', () => {
    vi.mocked(useStudioList).mockReturnValue({
      studios: mockStudios,
      selectedStudio: mockStudios[0],
      setSelectedStudio: mockSetSelectedStudio,
      bookingResult: null,
      setBookingResult: mockSetBookingResult,
    });

    render(<StudioList token={null} />);
    
    expect(SeatMap).toHaveBeenCalledWith(
      expect.objectContaining({
        studioId: 1,
        token: null,
        onBooked: expect.any(Function),
      }),
      expect.anything()
    );
  });
});
