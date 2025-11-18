import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuth from '../useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with null token and userName', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.token).toBeNull();
    expect(result.current.userName).toBeNull();
  });

  it('should load token and userName from localStorage on mount', () => {
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('userName', 'John Doe');

    const { result } = renderHook(() => useAuth());

    expect(result.current.token).toBe('test-token');
    expect(result.current.userName).toBe('John Doe');
  });

  it('should handle login correctly', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.setToken('new-token', 'Jane Doe');
    });

    expect(result.current.token).toBe('new-token');
    expect(result.current.userName).toBe('Jane Doe');
    expect(localStorage.getItem('authToken')).toBe('new-token');
    expect(localStorage.getItem('userName')).toBe('Jane Doe');
  });

  it('should handle logout correctly', () => {
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('userName', 'John Doe');

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.userName).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userName')).toBeNull();
  });
});
