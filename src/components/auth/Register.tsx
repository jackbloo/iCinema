import React from 'react';
import useRegister from 'src/hooks/useRegister';
import Input from '../UI/Input';

export default function Register({onAuth}: {onAuth: (token: string, name: string)=>void}) {
  const { open, setOpen, email, password, name, errorMessage, handleChange, doRegister } = useRegister({onAuth});
  return (
    <>
      <button className="small" onClick={()=>setOpen(true)}>Register</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={doRegister} className="card">
            <h3>Register</h3>
            <label>Name <Input value={name} onChange={e=>handleChange('name', e.target.value)} required placeholder="John Doe" error={errorMessage['name']}/></label>
            <label>Email <Input value={email} type="email" onChange={e=>handleChange('email', e.target.value)} required placeholder="johndoe@gmail.com" error={errorMessage['email']} /></label>
            <label>Password <Input type="password" value={password} onChange={e=>handleChange('password', e.target.value)} required placeholder="Password" error={errorMessage['password']} /></label>
            <div className="row">
              <button type="submit" disabled={!name || !email || !password || Boolean(errorMessage['name']) || Boolean(errorMessage['email']) || Boolean(errorMessage['password'])}>Create</button>
              <button type="button" onClick={()=>setOpen(false)}>Close</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
