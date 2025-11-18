import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../auth/Login';
import useLogin from '../../hooks/useLogin';

vi.mock('../../hooks/useLogin');

describe('Login', () => {
  const mockOnAuth = vi.fn();
  const mockSetOpen = vi.fn();
  const mockSetEmail = vi.fn();
  const mockSetPassword = vi.fn();
  const mockDoLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogin).mockReturnValue({
      open: false,
      setOpen: mockSetOpen,
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      loading: false,
      doLogin: mockDoLogin,
    });
  });

  it('should render login button', () => {
    render(<Login onAuth={mockOnAuth} />);
    
    expect(screen.getByText('Login')).toBeDefined();
  });

  it('should open modal when login button is clicked', () => {
    render(<Login onAuth={mockOnAuth} />);
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });

  it('should render modal when open is true', () => {
    vi.mocked(useLogin).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      loading: false,
      doLogin: mockDoLogin,
    });

    render(<Login onAuth={mockOnAuth} />);
    
    expect(screen.getByRole('heading', { name: 'Login' })).toBeDefined();
    expect(screen.getByLabelText(/Email/)).toBeDefined();
    expect(screen.getByLabelText(/Password/)).toBeDefined();
  });

  it('should update email on input change', () => {
    vi.mocked(useLogin).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      loading: false,
      doLogin: mockDoLogin,
    });

    render(<Login onAuth={mockOnAuth} />);
    
    const emailInput = screen.getByLabelText(/Email/);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should update password on input change', () => {
    vi.mocked(useLogin).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      loading: false,
      doLogin: mockDoLogin,
    });

    render(<Login onAuth={mockOnAuth} />);
    
    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(mockSetPassword).toHaveBeenCalledWith('password123');
  });

  it('should call doLogin on form submit', () => {
    vi.mocked(useLogin).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: 'test@example.com',
      setEmail: mockSetEmail,
      password: 'password123',
      setPassword: mockSetPassword,
      loading: false,
      doLogin: mockDoLogin,
    });

    render(<Login onAuth={mockOnAuth} />);
    
    const form = screen.getByRole('heading', { name: 'Login' }).closest('form');
    fireEvent.submit(form!);
    
    expect(mockDoLogin).toHaveBeenCalled();
  });

  it('should close modal when close button is clicked', () => {
    vi.mocked(useLogin).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      loading: false,
      doLogin: mockDoLogin,
    });

    render(<Login onAuth={mockOnAuth} />);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('should disable submit button when loading', () => {
    vi.mocked(useLogin).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: 'test@example.com',
      setEmail: mockSetEmail,
      password: 'password123',
      setPassword: mockSetPassword,
      loading: true,
      doLogin: mockDoLogin,
    });

    render(<Login onAuth={mockOnAuth} />);
    
    const submitButton = screen.getByText('Sign in');
    expect(submitButton.getAttribute('disabled')).toBeDefined();
  });

  it('should disable submit button when email is empty', () => {
    vi.mocked(useLogin).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      setEmail: mockSetEmail,
      password: 'password123',
      setPassword: mockSetPassword,
      loading: false,
      doLogin: mockDoLogin,
    });

    render(<Login onAuth={mockOnAuth} />);
    
    const submitButton = screen.getByText('Sign in');
    expect(submitButton.getAttribute('disabled')).toBeDefined();
  });

  it('should disable submit button when password is empty', () => {
    vi.mocked(useLogin).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: 'test@example.com',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      loading: false,
      doLogin: mockDoLogin,
    });

    render(<Login onAuth={mockOnAuth} />);
    
    const submitButton = screen.getByText('Sign in');
    expect(submitButton.getAttribute('disabled')).toBeDefined();
  });

  it('should enable submit button when all fields are filled', () => {
    vi.mocked(useLogin).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: 'test@example.com',
      setEmail: mockSetEmail,
      password: 'password123',
      setPassword: mockSetPassword,
      loading: false,
      doLogin: mockDoLogin,
    });

    render(<Login onAuth={mockOnAuth} />);
    
    const submitButton = screen.getByText('Sign in');
    expect(submitButton.getAttribute('disabled')).toBeNull();
  });

  it('should not render modal when open is false', () => {
    render(<Login onAuth={mockOnAuth} />);
    
    expect(screen.queryByRole('heading', { name: 'Login' })).toBeNull();
  });
});
