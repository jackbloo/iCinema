import React from 'react';
import Login from './auth/Login';
import Register from './auth/Register';
import StudioList from './StudioList';
import './styles.css';
import useAuth from 'src/hooks/useAuth';

export default function App() {
  const {} = useAuth();
  const { token, setToken, userName, logout } = useAuth();

  return (
    <div className="container">
      <header className="header">
        <h1>🎬 iCinema Booking</h1>
        <div>
          {token ? (
            <>
              <span className="muted">Hi, {userName}</span>
              <button className="small" onClick={() => { logout(); }}>Logout</button>
            </>
          ) : (
            <div>
              <Login onAuth={(t, name) => { setToken(t, name); }} />
              <Register onAuth={(t, name) => { setToken(t, name); }}  />
            </div>
          )}
        </div>
      </header>

      <main>
        <StudioList token={token} />
      </main>

      <footer className="footer">Best Cinema Ever.</footer>
    </div>
  );
}
