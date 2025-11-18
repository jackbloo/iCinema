import React, { useState } from 'react';
import { api } from '../../lib/api';
import useRegister from 'src/hooks/useRegister';

export default function Register({onAuth}: {onAuth: (token: string, name: string)=>void}) {
  const { open, setOpen, email, setEmail, password, setPassword, name, setName, doRegister } = useRegister({onAuth});
  return (
    <>
      <button className="small" onClick={()=>setOpen(true)}>Register</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={doRegister} className="card">
            <h3>Register</h3>
            <label>Name <input value={name} onChange={e=>setName(e.target.value)} required /></label>
            <label>Email <input value={email} onChange={e=>setEmail(e.target.value)} required /></label>
            <label>Password <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
            <div className="row">
              <button type="submit" disabled={!name || !email || !password}>Create</button>
              <button type="button" onClick={()=>setOpen(false)}>Close</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
