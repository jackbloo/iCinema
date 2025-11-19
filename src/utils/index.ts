import { emailRegex } from "src/constants";

export const validateField = (field: string, value: string): string | null => {
  if(!value) return 'This field is required';
  switch (field) {
    case 'email': 
        return emailRegex.test(value) ? null : 'Invalid email address';
    case 'password':
        return value.length >= 6 ? null : 'Password must be at least 6 characters long';    
    case 'name':
        return value.trim() !== '' ? null : 'Name cannot be empty';
    default:
        return null;
  }
};