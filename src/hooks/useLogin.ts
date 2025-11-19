import { useState } from "react";
import { useSnackbar } from "src/components/Snackbar";
import { api } from "src/lib/api";
import { validateField } from "src/utils";


export default function useLogin({onAuth}: {onAuth: (token: string, name: string)=>void}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {  success, error } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState<Record<string, string | null>>({
  email: null,
  password: null,
});

  const handleChange = (type: 'email' | 'password', value: string) => {
    if (type === 'email') setEmail(value);
    else if (type === 'password') setPassword(value);
    setErrorMessage(prev => ({ ...prev, [type]: validateField(type, value) }));
  };

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res: { token: string; name?: string } = await api.post('/auth/login', { email, password });
      if (res.token) {
        onAuth(res.token, res.name ?? email);
      } else {
        success('Login failed');
      }
    } catch (err) {
      error('Login error');
    } finally { setLoading(false); }
  }

  return { open, setOpen, email, password, loading, doLogin, errorMessage, handleChange };
}