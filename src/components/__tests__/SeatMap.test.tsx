import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SeatMap from '../SeatMap';
import useSeatMap from '../../hooks/useSeatMap';

vi.mock('../../hooks/useSeatMap');

describe('SeatMap', () => {
  const mockOnBooked = vi.fn();
  const mockToggle = vi.fn();
  const mockSetName = vi.fn();
  const mockSetEmail = vi.fn();
  const mockBookOnline = vi.fn();
  const mockBookOffline = vi.fn();

  const mockSeats = [
    {
      id: 1,
      seat_number: 'A1',
      is_available: true,
      studio_id: 1,
      studio: { id: 1, name: 'Studio 1', total_seats: 10, created_at: '2024-01-01', updated_at: '2024-01-01' },
      studio_name: 'Studio 1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 2,
      seat_number: 'A2',
      is_available: true,
      studio_id: 1,
      studio: { id: 1, name: 'Studio 1', total_seats: 10, created_at: '2024-01-01', updated_at: '2024-01-01' },
      studio_name: 'Studio 1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 3,
      seat_number: 'A3',
      is_available: false,
      studio_id: 1,
      studio: { id: 1, name: 'Studio 1', total_seats: 10, created_at: '2024-01-01', updated_at: '2024-01-01' },
      studio_name: 'Studio 1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSeatMap).mockReturnValue({
      seats: mockSeats,
      selected: [],
      loading: false,
      name: '',
      setName: mockSetName,
      email: '',
      setEmail: mockSetEmail,
      toggle: mockToggle,
      bookOnline: mockBookOnline,
      bookOffline: mockBookOffline,
    });
  });

  it('should render studio header', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    expect(screen.getByText(/Studio #1/)).toBeDefined();
  });

  it('should render all seats', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    expect(screen.getByText('A1')).toBeDefined();
    expect(screen.getByText('A2')).toBeDefined();
    expect(screen.getByText('A3')).toBeDefined();
  });

  it('should apply available class to available seats', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const seatA1 = screen.getByText('A1');
    expect(seatA1.className).toContain('available');
  });

  it('should apply booked class to unavailable seats', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const seatA3 = screen.getByText('A3');
    expect(seatA3.className).toContain('booked');
  });

  it('should apply selected class to selected seats', () => {
    vi.mocked(useSeatMap).mockReturnValue({
      seats: mockSeats,
      selected: [1],
      loading: false,
      name: '',
      setName: mockSetName,
      email: '',
      setEmail: mockSetEmail,
      toggle: mockToggle,
      bookOnline: mockBookOnline,
      bookOffline: mockBookOffline,
    });

    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const seatA1 = screen.getByText('A1');
    expect(seatA1.className).toContain('selected');
  });

  it('should call toggle when seat is clicked', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const seatA1 = screen.getByText('A1');
    fireEvent.click(seatA1);
    
    expect(mockToggle).toHaveBeenCalledWith(1);
  });

  it('should display selected seats', () => {
    vi.mocked(useSeatMap).mockReturnValue({
      seats: mockSeats,
      selected: [1, 2],
      loading: false,
      name: '',
      setName: mockSetName,
      email: '',
      setEmail: mockSetEmail,
      toggle: mockToggle,
      bookOnline: mockBookOnline,
      bookOffline: mockBookOffline,
    });

    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    expect(screen.getByText(/Selected: 1, 2/)).toBeDefined();
  });

  it('should display none when no seats selected', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    expect(screen.getByText(/Selected: none/)).toBeDefined();
  });

  it('should render online booking form', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    expect(screen.getByText('Online Booking')).toBeDefined();
    expect(screen.getByText('Book Online (requires login)')).toBeDefined();
  });

  it('should render offline booking form', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    expect(screen.getByText('Offline / Cashier')).toBeDefined();
    expect(screen.getByLabelText(/Customer Name/)).toBeDefined();
    expect(screen.getByLabelText(/Customer Email/)).toBeDefined();
  });

  it('should call bookOnline on online form submit', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const onlineForm = screen.getByText('Online Booking').closest('form');
    fireEvent.submit(onlineForm!);
    
    expect(mockBookOnline).toHaveBeenCalled();
  });

  it('should call bookOffline on offline form submit', () => {
    vi.mocked(useSeatMap).mockReturnValue({
      seats: mockSeats,
      selected: [1],
      loading: false,
      name: 'John Doe',
      setName: mockSetName,
      email: 'john@example.com',
      setEmail: mockSetEmail,
      toggle: mockToggle,
      bookOnline: mockBookOnline,
      bookOffline: mockBookOffline,
    });

    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const offlineForm = screen.getByText('Offline / Cashier').closest('form');
    fireEvent.submit(offlineForm!);
    
    expect(mockBookOffline).toHaveBeenCalled();
  });

  it('should update customer name on input change', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const nameInput = screen.getByLabelText(/Customer Name/);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(mockSetName).toHaveBeenCalledWith('John Doe');
  });

  it('should update customer email on input change', () => {
    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const emailInput = screen.getByLabelText(/Customer Email/);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(mockSetEmail).toHaveBeenCalledWith('john@example.com');
  });

  it('should disable online booking button when loading', () => {
    vi.mocked(useSeatMap).mockReturnValue({
      seats: mockSeats,
      selected: [1],
      loading: true,
      name: '',
      setName: mockSetName,
      email: '',
      setEmail: mockSetEmail,
      toggle: mockToggle,
      bookOnline: mockBookOnline,
      bookOffline: mockBookOffline,
    });

    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const onlineButton = screen.getByText('Book Online (requires login)');
    expect(onlineButton.getAttribute('disabled')).toBeDefined();
  });

  it('should disable offline booking button when loading', () => {
    vi.mocked(useSeatMap).mockReturnValue({
      seats: mockSeats,
      selected: [1],
      loading: true,
      name: 'John Doe',
      setName: mockSetName,
      email: 'john@example.com',
      setEmail: mockSetEmail,
      toggle: mockToggle,
      bookOnline: mockBookOnline,
      bookOffline: mockBookOffline,
    });

    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const offlineButton = screen.getByText('Create Offline Booking (Cashier)');
    expect(offlineButton.getAttribute('disabled')).toBeDefined();
  });

  it('should disable offline booking button when name is empty', () => {
    vi.mocked(useSeatMap).mockReturnValue({
      seats: mockSeats,
      selected: [1],
      loading: false,
      name: '',
      setName: mockSetName,
      email: 'john@example.com',
      setEmail: mockSetEmail,
      toggle: mockToggle,
      bookOnline: mockBookOnline,
      bookOffline: mockBookOffline,
    });

    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const offlineButton = screen.getByText('Create Offline Booking (Cashier)');
    expect(offlineButton.getAttribute('disabled')).toBeDefined();
  });

  it('should disable offline booking button when email is empty', () => {
    vi.mocked(useSeatMap).mockReturnValue({
      seats: mockSeats,
      selected: [1],
      loading: false,
      name: 'John Doe',
      setName: mockSetName,
      email: '',
      setEmail: mockSetEmail,
      toggle: mockToggle,
      bookOnline: mockBookOnline,
      bookOffline: mockBookOffline,
    });

    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const offlineButton = screen.getByText('Create Offline Booking (Cashier)');
    expect(offlineButton.getAttribute('disabled')).toBeDefined();
  });

  it('should enable offline booking button when all fields are filled', () => {
    vi.mocked(useSeatMap).mockReturnValue({
      seats: mockSeats,
      selected: [1],
      loading: false,
      name: 'John Doe',
      setName: mockSetName,
      email: 'john@example.com',
      setEmail: mockSetEmail,
      toggle: mockToggle,
      bookOnline: mockBookOnline,
      bookOffline: mockBookOffline,
    });

    render(<SeatMap studioId={1} token={null} onBooked={mockOnBooked} />);
    
    const offlineButton = screen.getByText('Create Offline Booking (Cashier)');
    expect(offlineButton.getAttribute('disabled')).toBeNull();
  });
});
