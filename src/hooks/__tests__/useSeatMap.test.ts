import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useSeatMap from '../useSeatMap';
import { api } from '../../lib/api';
import { useSnackbar } from '../../components/Snackbar';
import React from 'react';

vi.mock('../../lib/api');
vi.mock('../../components/Snackbar');

describe('useSeatMap', () => {
  const mockOnBooked = vi.fn();
  const mockSuccess = vi.fn();
  const mockError = vi.fn();

  const mockSeats = [
    { id: 1, seat_number: 'A10', is_available: true, studio_id: 1 },
    { id: 2, seat_number: 'A2', is_available: true, studio_id: 1 },
    { id: 3, seat_number: 'A5', is_available: false, studio_id: 1 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSnackbar).mockReturnValue({
      show: vi.fn(),
      success: mockSuccess,
      error: mockError,
    });
  });

  it('should initialize with default values', () => {
    vi.mocked(api.get).mockResolvedValue([]);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: null, onBooked: mockOnBooked })
    );

    expect(result.current.seats).toEqual([]);
    expect(result.current.selected).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.name).toBe('');
    expect(result.current.email).toBe('');
  });

  it('should fetch and sort seats on mount', async () => {
    vi.mocked(api.get).mockResolvedValue(mockSeats);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: null, onBooked: mockOnBooked })
    );

    await waitFor(() => {
      expect(result.current.seats.length).toBe(3);
    });

    expect(api.get).toHaveBeenCalledWith('/cinema/studios/1/seats');
    expect(result.current.seats[0].seat_number).toBe('A2');
    expect(result.current.seats[1].seat_number).toBe('A5');
    expect(result.current.seats[2].seat_number).toBe('A10');
  });

  it('should update name and email', async () => {
    vi.mocked(api.get).mockResolvedValue([]);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: null, onBooked: mockOnBooked })
    );

    act(() => {
      result.current.setName('John Doe');
      result.current.setEmail('john@example.com');
    });

    expect(result.current.name).toBe('John Doe');
    expect(result.current.email).toBe('john@example.com');
  });

  it('should toggle seat selection for available seats', async () => {
    vi.mocked(api.get).mockResolvedValue(mockSeats);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: null, onBooked: mockOnBooked })
    );

    await waitFor(() => {
      expect(result.current.seats.length).toBe(3);
    });

    act(() => {
      result.current.toggle(1);
    });

    expect(result.current.selected).toContain(1);

    act(() => {
      result.current.toggle(1);
    });

    expect(result.current.selected).not.toContain(1);
  });

  it('should not toggle unavailable seats', async () => {
    vi.mocked(api.get).mockResolvedValue(mockSeats);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: null, onBooked: mockOnBooked })
    );

    await waitFor(() => {
      expect(result.current.seats.length).toBe(3);
    });

    act(() => {
      result.current.toggle(3);
    });

    expect(result.current.selected).not.toContain(3);
  });

  it('should handle successful online booking', async () => {
    const mockBookingResponse = {
      booking: { id: 1, booking_code: 'ABC123' },
      qrCode: 'qr-code-data',
    };

    vi.mocked(api.get).mockResolvedValue(mockSeats);
    vi.mocked(api.post).mockResolvedValue(mockBookingResponse);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: 'test-token', onBooked: mockOnBooked })
    );

    await waitFor(() => {
      expect(result.current.seats.length).toBe(3);
    });

    act(() => {
      result.current.toggle(1);
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.bookOnline(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith(
      '/booking/online',
      { studioId: 1, seatIds: [1] },
      'test-token'
    );
    expect(mockOnBooked).toHaveBeenCalledWith(mockBookingResponse);
    expect(mockSuccess).toHaveBeenCalledWith('Booking successful!');
    expect(result.current.selected).toEqual([]);
  });

  it('should show error for online booking without token', async () => {
    vi.mocked(api.get).mockResolvedValue(mockSeats);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: null, onBooked: mockOnBooked })
    );

    await waitFor(() => {
      expect(result.current.seats.length).toBe(3);
    });

    act(() => {
      result.current.toggle(1);
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.bookOnline(mockEvent);
    });

    expect(mockError).toHaveBeenCalledWith('Login required for online booking');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('should show error for online booking without selected seats', async () => {
    vi.mocked(api.get).mockResolvedValue(mockSeats);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: 'test-token', onBooked: mockOnBooked })
    );

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.bookOnline(mockEvent);
    });

    expect(mockError).toHaveBeenCalledWith('Select seats');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('should handle successful offline booking', async () => {
    const mockBookingResponse = {
      booking: { id: 1, booking_code: 'ABC123' },
      qrCode: 'qr-code-data',
    };

    vi.mocked(api.get).mockResolvedValue(mockSeats);
    vi.mocked(api.post).mockResolvedValue(mockBookingResponse);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: null, onBooked: mockOnBooked })
    );

    await waitFor(() => {
      expect(result.current.seats.length).toBe(3);
    });

    act(() => {
      result.current.toggle(1);
      result.current.setName('John Doe');
      result.current.setEmail('john@example.com');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.bookOffline(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith('/booking/offline', {
      studioId: 1,
      seatIds: [1],
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
    });
    expect(mockOnBooked).toHaveBeenCalledWith(mockBookingResponse);
    expect(mockSuccess).toHaveBeenCalledWith('Booking successful!');
    expect(result.current.selected).toEqual([]);
  });

  it('should show error for offline booking without selected seats', async () => {
    vi.mocked(api.get).mockResolvedValue(mockSeats);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: null, onBooked: mockOnBooked })
    );

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.bookOffline(mockEvent);
    });

    expect(mockError).toHaveBeenCalledWith('Select seats');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('should handle online booking error', async () => {
    vi.mocked(api.get).mockResolvedValue(mockSeats);
    vi.mocked(api.post).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: 'test-token', onBooked: mockOnBooked })
    );

    await waitFor(() => {
      expect(result.current.seats.length).toBe(3);
    });

    act(() => {
      result.current.toggle(1);
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.bookOnline(mockEvent);
    });

    expect(mockError).toHaveBeenCalledWith('Booking failed');
    expect(result.current.loading).toBe(false);
  });

  it('should handle offline booking error', async () => {
    vi.mocked(api.get).mockResolvedValue(mockSeats);
    vi.mocked(api.post).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: null, onBooked: mockOnBooked })
    );

    await waitFor(() => {
      expect(result.current.seats.length).toBe(3);
    });

    act(() => {
      result.current.toggle(1);
      result.current.setName('John Doe');
      result.current.setEmail('john@example.com');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.bookOffline(mockEvent);
    });

    expect(mockError).toHaveBeenCalledWith('Offline booking failed');
    expect(result.current.loading).toBe(false);
  });

  it('should refetch seats after successful booking', async () => {
    const mockBookingResponse = {
      booking: { id: 1, booking_code: 'ABC123' },
      qrCode: 'qr-code-data',
    };

    vi.mocked(api.get).mockResolvedValue(mockSeats);
    vi.mocked(api.post).mockResolvedValue(mockBookingResponse);

    const { result } = renderHook(() =>
      useSeatMap({ studioId: 1, token: 'test-token', onBooked: mockOnBooked })
    );

    await waitFor(() => {
      expect(result.current.seats.length).toBe(3);
    });

    act(() => {
      result.current.toggle(1);
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.bookOnline(mockEvent);
    });

    expect(api.get).toHaveBeenCalledTimes(2);
  });
});
