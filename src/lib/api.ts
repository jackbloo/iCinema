const API_BASE = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000/api';

async function request<T>(path: string, method = 'GET', body?: unknown, token?: string): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API error');
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path, 'GET'),
  post: <T>(path: string, body: unknown, token?: string) => request<T>(path, 'POST', body, token)
};
