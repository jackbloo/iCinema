import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useLogin from '../useLogin';
import { api } from '../../lib/api';
import { useSnackbar } from '../../components/Snackbar';
import React from 'react';

vi.mock('../../lib/api');
vi.mock('../../components/Snackbar');

describe('useLogin', () => {
  const mockOnAuth = vi.fn();
  const mockSuccess = vi.fn();
  const mockError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSnackbar).mockReturnValue({
      show: vi.fn(),
      success: mockSuccess,
      error: mockError,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLogin({ onAuth: mockOnAuth }));

    expect(result.current.open).toBe(false);
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.errorMessage).toEqual({
      email: null,
      password: null,
    });
  });

  it('should update email and password', () => {
    const { result } = renderHook(() => useLogin({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    expect(result.current.email).toBe('test@example.com');
    expect(result.current.password).toBe('password123');
  });

  it('should toggle open state', () => {
    const { result } = renderHook(() => useLogin({ onAuth: mockOnAuth }));

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(true);

    act(() => {
      result.current.setOpen(false);
    });

    expect(result.current.open).toBe(false);
  });

  it('should handle successful login', async () => {
    const mockToken = 'test-token';
    const mockName = 'Test User';
    
    vi.mocked(api.post).mockResolvedValue({
      token: mockToken,
      name: mockName,
    });

    const { result } = renderHook(() => useLogin({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.doLogin(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(mockOnAuth).toHaveBeenCalledWith(mockToken, mockName);
    expect(result.current.loading).toBe(false);
  });

  it('should use email as name when name is not provided', async () => {
    const mockToken = 'test-token';
    const mockEmail = 'test@example.com';
    
    vi.mocked(api.post).mockResolvedValue({
      token: mockToken,
    });

    const { result } = renderHook(() => useLogin({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', mockEmail);
      result.current.handleChange('password', 'password123');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.doLogin(mockEvent);
    });

    expect(mockOnAuth).toHaveBeenCalledWith(mockToken, mockEmail);
  });

  it('should show success message when login fails without token', async () => {
    vi.mocked(api.post).mockResolvedValue({});

    const { result } = renderHook(() => useLogin({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.doLogin(mockEvent);
    });

    expect(mockSuccess).toHaveBeenCalledWith('Login failed');
    expect(mockOnAuth).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('should handle login error', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLogin({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.doLogin(mockEvent);
    });

    expect(mockError).toHaveBeenCalledWith('Login error');
    expect(mockOnAuth).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('should set loading state during login', async () => {
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    vi.mocked(api.post).mockReturnValue(loginPromise as any);

    const { result } = renderHook(() => useLogin({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    act(() => {
      result.current.doLogin(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      resolveLogin!({ token: 'test-token', name: 'Test' });
      await loginPromise;
    });

    expect(result.current.loading).toBe(false);
  });
});
