import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useStudioList from '../useStudioList';
import { api } from '../../lib/api';

vi.mock('../../lib/api');

describe('useStudioList', () => {
  const mockStudios = [
    { id: 1, name: 'Studio A', total_seats: 50, created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 2, name: 'Studio B', total_seats: 100, created_at: '2024-01-02', updated_at: '2024-01-02' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    vi.mocked(api.get).mockResolvedValue([]);

    const { result } = renderHook(() => useStudioList());

    expect(result.current.studios).toEqual([]);
    expect(result.current.selectedStudio).toBeNull();
    expect(result.current.bookingResult).toBeNull();
  });

  it('should fetch studios on mount', async () => {
    vi.mocked(api.get).mockResolvedValue(mockStudios);

    const { result } = renderHook(() => useStudioList());

    await waitFor(() => {
      expect(result.current.studios.length).toBe(2);
    });

    expect(api.get).toHaveBeenCalledWith('/cinema/studios');
    expect(result.current.studios).toEqual(mockStudios);
  });

  it('should handle empty studios response', async () => {
    vi.mocked(api.get).mockResolvedValue(null);

    const { result } = renderHook(() => useStudioList());

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    expect(result.current.studios).toEqual([]);
  });

  it('should set selected studio', async () => {
    vi.mocked(api.get).mockResolvedValue(mockStudios);

    const { result } = renderHook(() => useStudioList());

    await waitFor(() => {
      expect(result.current.studios.length).toBe(2);
    });

    act(() => {
      result.current.setSelectedStudio(mockStudios[0]);
    });

    expect(result.current.selectedStudio).toEqual(mockStudios[0]);
  });

  it('should clear selected studio', async () => {
    vi.mocked(api.get).mockResolvedValue(mockStudios);

    const { result } = renderHook(() => useStudioList());

    await waitFor(() => {
      expect(result.current.studios.length).toBe(2);
    });

    act(() => {
      result.current.setSelectedStudio(mockStudios[0]);
    });

    expect(result.current.selectedStudio).toEqual(mockStudios[0]);

    act(() => {
      result.current.setSelectedStudio(null);
    });

    expect(result.current.selectedStudio).toBeNull();
  });

  it('should set booking result', async () => {
    vi.mocked(api.get).mockResolvedValue(mockStudios);

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

    const { result } = renderHook(() => useStudioList());

    act(() => {
      result.current.setBookingResult(mockBookingResult);
    });

    expect(result.current.bookingResult).toEqual(mockBookingResult);
  });

  it('should clear booking result', async () => {
    vi.mocked(api.get).mockResolvedValue(mockStudios);

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

    const { result } = renderHook(() => useStudioList());

    act(() => {
      result.current.setBookingResult(mockBookingResult);
    });

    expect(result.current.bookingResult).toEqual(mockBookingResult);

    act(() => {
      result.current.setBookingResult(null);
    });

    expect(result.current.bookingResult).toBeNull();
  });
});
