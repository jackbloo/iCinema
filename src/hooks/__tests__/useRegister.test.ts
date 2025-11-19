import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useRegister from '../useRegister';
import { api } from '../../lib/api';
import { useSnackbar } from '../../components/Snackbar';
import React from 'react';

vi.mock('../../lib/api');
vi.mock('../../components/Snackbar');

describe('useRegister', () => {
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
    const { result } = renderHook(() => useRegister({ onAuth: mockOnAuth }));

    expect(result.current.open).toBe(false);
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.name).toBe('');
    expect(result.current.errorMessage).toEqual({
      email: null,
      password: null,
      name: null,
    });
  });

  it('should update email, password, and name', () => {
    const { result } = renderHook(() => useRegister({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
      result.current.handleChange('name', 'Test User');
    });

    expect(result.current.email).toBe('test@example.com');
    expect(result.current.password).toBe('password123');
    expect(result.current.name).toBe('Test User');
  });

  it('should toggle open state', () => {
    const { result } = renderHook(() => useRegister({ onAuth: mockOnAuth }));

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(true);

    act(() => {
      result.current.setOpen(false);
    });

    expect(result.current.open).toBe(false);
  });

  it('should handle successful registration', async () => {
    const mockToken = 'test-token';
    const mockUserName = 'Test User';
    
    vi.mocked(api.post).mockResolvedValue({
      token: mockToken,
      user: { name: mockUserName },
    });

    const { result } = renderHook(() => useRegister({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
      result.current.handleChange('name', mockUserName);
      result.current.setOpen(true);
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.doRegister(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      email: 'test@example.com',
      password: 'password123',
      name: mockUserName,
    });
    expect(mockOnAuth).toHaveBeenCalledWith(mockToken, mockUserName);
    expect(mockSuccess).toHaveBeenCalledWith('Registration successful!');
    expect(result.current.open).toBe(false);
  });

  it('should handle registration error', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRegister({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
      result.current.handleChange('name', 'Test User');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.doRegister(mockEvent);
    });

    expect(mockError).toHaveBeenCalledWith('Register error');
    expect(mockOnAuth).not.toHaveBeenCalled();
    expect(mockSuccess).not.toHaveBeenCalled();
  });

  it('should not call onAuth when response has no token', async () => {
    vi.mocked(api.post).mockResolvedValue({});

    const { result } = renderHook(() => useRegister({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
      result.current.handleChange('name', 'Test User');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.doRegister(mockEvent);
    });

    expect(mockOnAuth).not.toHaveBeenCalled();
    expect(mockSuccess).not.toHaveBeenCalled();
  });

  it('should return response on successful registration', async () => {
    const mockResponse = {
      token: 'test-token',
      user: { name: 'Test User' },
    };
    
    vi.mocked(api.post).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegister({ onAuth: mockOnAuth }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
      result.current.handleChange('name', 'Test User');
    });

    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    let response;
    await act(async () => {
      response = await result.current.doRegister(mockEvent);
    });

    expect(response).toEqual(mockResponse);
  });
});
