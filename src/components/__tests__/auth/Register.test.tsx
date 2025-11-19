import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from '../../auth/Register';
import useRegister from '../../../hooks/useRegister';

vi.mock('../../../hooks/useRegister');

describe('Register', () => {
  const mockOnAuth = vi.fn();
  const mockSetOpen = vi.fn();
  const mockHandleChange = vi.fn();
  const mockDoRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRegister).mockReturnValue({
      open: false,
      setOpen: mockSetOpen,
      email: '',
      password: '',
      name: '',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });
  });

  it('should render register button', () => {
    render(<Register onAuth={mockOnAuth} />);
    
    expect(screen.getByText('Register')).toBeDefined();
  });

  it('should open modal when register button is clicked', () => {
    render(<Register onAuth={mockOnAuth} />);
    
    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);
    
    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });

  it('should render modal when open is true', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      password: '',
      name: '',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    expect(screen.getByRole('heading', { name: 'Register' })).toBeDefined();
    expect(screen.getByLabelText(/Name/)).toBeDefined();
    expect(screen.getByLabelText(/Email/)).toBeDefined();
    expect(screen.getByLabelText(/Password/)).toBeDefined();
  });

  it('should update name on input change', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      password: '',
      name: '',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    const nameInput = screen.getByLabelText(/Name/);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(mockHandleChange).toHaveBeenCalledWith('name', 'John Doe');
  });

  it('should update email on input change', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      password: '',
      name: '',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    const emailInput = screen.getByLabelText(/Email/);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(mockHandleChange).toHaveBeenCalledWith('email', 'test@example.com');
  });

  it('should update password on input change', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      password: '',
      name: '',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    const passwordInput = screen.getByLabelText(/Password/);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(mockHandleChange).toHaveBeenCalledWith('password', 'password123');
  });

  it('should call doRegister on form submit', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    const form = screen.getByRole('heading', { name: 'Register' }).closest('form');
    fireEvent.submit(form!);
    
    expect(mockDoRegister).toHaveBeenCalled();
  });

  it('should close modal when close button is clicked', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      password: '',
      name: '',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('should disable submit button when name is empty', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: 'test@example.com',
      password: 'password123',
      name: '',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    const submitButton = screen.getByText('Create');
    expect(submitButton.getAttribute('disabled')).toBeDefined();
  });

  it('should disable submit button when email is empty', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: '',
      password: 'password123',
      name: 'John Doe',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    const submitButton = screen.getByText('Create');
    expect(submitButton.getAttribute('disabled')).toBeDefined();
  });

  it('should disable submit button when password is empty', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: 'test@example.com',
      password: '',
      name: 'John Doe',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    const submitButton = screen.getByText('Create');
    expect(submitButton.getAttribute('disabled')).toBeDefined();
  });

  it('should enable submit button when all fields are filled', () => {
    vi.mocked(useRegister).mockReturnValue({
      open: true,
      setOpen: mockSetOpen,
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      doRegister: mockDoRegister,
      errorMessage: { email: null, password: null, name: null },
      handleChange: mockHandleChange,
    });

    render(<Register onAuth={mockOnAuth} />);
    
    const submitButton = screen.getByText('Create');
    expect(submitButton.getAttribute('disabled')).toBeNull();
  });

  it('should not render modal when open is false', () => {
    render(<Register onAuth={mockOnAuth} />);
    
    expect(screen.queryByRole('heading', { name: 'Register' })).toBeNull();
  });
});
