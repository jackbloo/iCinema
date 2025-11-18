import { useState } from "react";
import { useSnackbar } from "src/components/Snackbar";
import { api } from "src/lib/api";
import { RegisterResponse } from "src/types/Register";


export default function useRegister({onAuth}: {onAuth: (token: string, name: string)=>void}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const {  success, error } = useSnackbar();

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
  return { open, setOpen, email, setEmail, password, setPassword, name, setName, doRegister };
}