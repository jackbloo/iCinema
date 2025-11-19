import { useState } from "react";
import { useSnackbar } from "src/components/Snackbar";
import { api } from "src/lib/api";
import { RegisterResponse } from "src/types/Register";
import { validateField } from "src/utils";


export default function useRegister({onAuth}: {onAuth: (token: string, name: string)=>void}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const {  success, error } = useSnackbar();
  const [errorMessage, setErrorMessage] = useState<Record<string, string | null>>({
    email: null,
    password: null,
    name: null,
  });

  const handleChange = (type: 'email' | 'password' | 'name', value: string) => {
    if (type === 'email') setEmail(value);
    else if (type === 'password') setPassword(value);
    else if (type === 'name') setName(value);
    setErrorMessage(prev => ({ ...prev, [type]: validateField(type, value) }));
  };

  async function doRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res:RegisterResponse = await api.post('/auth/register', { email, password, name });
      if(res?.token){
        onAuth(res.token, res.user.name);
        setOpen(false);
        success("Registration successful!");
        return res;
      }
    } catch (err) {
      error("Register error");
    }
  }
  return { open, setOpen, email, password, name, errorMessage, handleChange, doRegister };
}