import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { api } from '../api';

describe('api', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('get', () => {
    it('should make GET request with correct URL', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await api.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should throw error on failed GET request', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        text: async () => 'Not found',
      });

      await expect(api.get('/test')).rejects.toThrow('Not found');
    });

    it('should throw generic error when no error text', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        text: async () => '',
      });

      await expect(api.get('/test')).rejects.toThrow('API error');
    });
  });

  describe('post', () => {
    it('should make POST request with body', async () => {
      const mockData = { success: true };
      const requestBody = { email: 'test@example.com', password: 'password' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await api.post('/auth/login', requestBody);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should make POST request with token', async () => {
      const mockData = { success: true };
      const requestBody = { studioId: 1 };
      const token = 'test-token';
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await api.post('/booking', requestBody, token);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/booking',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          body: JSON.stringify(requestBody),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should throw error on failed POST request', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        text: async () => 'Bad request',
      });

      await expect(api.post('/test', {})).rejects.toThrow('Bad request');
    });

    it('should handle POST without body', async () => {
      const mockData = { success: true };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      await api.post('/test', undefined);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test',
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      );
    });
  });

  describe('request headers', () => {
    it('should include Authorization header when token is provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await api.post('/test', {}, 'my-token');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer my-token',
          }),
        })
      );
    });

    it('should not include Authorization header when token is not provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await api.get('/test');

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers).not.toHaveProperty('Authorization');
    });
  });

  describe('response parsing', () => {
    it('should parse JSON response', async () => {
      const mockData = { users: [{ id: 1 }, { id: 2 }] };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await api.get('/users');

      expect(result).toEqual(mockData);
    });

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => null,
      });

      const result = await api.get('/test');

      expect(result).toBeNull();
    });
  });
});
