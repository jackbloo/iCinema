import React from 'react';
import useLogin from 'src/hooks/useLogin';
import Input from '../UI/Input';

export default function Login({ onAuth } : { onAuth: (token: string, name: string) => void }) {

  const { open, setOpen, email, password, loading, doLogin, errorMessage, handleChange } = useLogin({ onAuth });

  return (
    <span className="auth-inline">
      <button className="small" onClick={() => setOpen(true)}>Login</button>
      {open && (
        <div  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={doLogin} className="card">
            <h3>Login</h3>
            <label>Email <Input value={email} onChange={e=>handleChange('email', e.target.value)} placeholder="johndoe@gmail.com" required error={errorMessage['email']} /></label>
            <label>Password <Input type="password" value={password} onChange={e=>handleChange('password', e.target.value)} placeholder="Password" required error={errorMessage['password']} /></label>
            <div className="row">
              <button type="submit" disabled={loading || !email || !password || Boolean(errorMessage['email']) || Boolean(errorMessage['password'])}>Sign in</button>
              <button type="button" onClick={() => setOpen(false)}>Close</button>
            </div>
          </form>
        </div>
      )}
    </span>
  );
}
