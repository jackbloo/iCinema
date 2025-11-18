import React from 'react';
import useLogin from 'src/hooks/useLogin';

export default function Login({ onAuth } : { onAuth: (token: string, name: string) => void }) {

  const { open, setOpen, email, setEmail, password, setPassword, loading, doLogin } = useLogin({ onAuth });

  return (
    <span className="auth-inline">
      <button className="small" onClick={() => setOpen(true)}>Login</button>
      {open && (
        <div  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={doLogin} className="card">
            <h3>Login</h3>
            <label>Email <input value={email} onChange={e=>setEmail(e.target.value)} required /></label>
            <label>Password <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
            <div className="row">
              <button type="submit" disabled={loading || !email || !password}>Sign in</button>
              <button type="button" onClick={() => setOpen(false)}>Close</button>
            </div>
          </form>
        </div>
      )}
    </span>
  );
}
