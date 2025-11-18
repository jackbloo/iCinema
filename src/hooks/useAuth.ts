import { useEffect, useState } from "react";



export default function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const stoedToken = localStorage.getItem('authToken');
    const storedName = localStorage.getItem('userName'); 
    if (stoedToken) setToken(stoedToken);
    if (storedName) setUserName(storedName);
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUserName(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
  };

  const handleLogin = (newToken: string, name: string) => {
    setToken(newToken);
    setUserName(name);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userName', name);
  }

  return { token, userName, setToken: handleLogin, setUserName, logout: handleLogout };
}