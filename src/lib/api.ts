const API_BASE = import.meta.env.PUBLIC_API_BASE || 'http://localhost:3000/api';

async function request(path:string, method='GET', body?:any, token?:string) {
  const headers:any = { 'Content-Type': 'application/json' };
  if(token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if(!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API error');
  }
  return res.json();
}

export const api = {
  get: (path:string)=>request(path,'GET'),
  post: (path:string, body:any, token?:string)=>request(path,'POST',body,token)
};
