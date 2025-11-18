import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import useAuth from '../../hooks/useAuth';
import Login from '../auth/Login';
import Register from '../auth/Register';
import StudioList from '../StudioList';

vi.mock('../../hooks/useAuth');
vi.mock('../auth/Login');
vi.mock('../auth/Register');
vi.mock('../StudioList');

describe('App', () => {
  const mockSetToken = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(Login).mockImplementation(({ onAuth }) => (
      <button onClick={() => onAuth('token', 'Test User')}>Login Mock</button>
    ));
    
    vi.mocked(Register).mockImplementation(({ onAuth }) => (
      <button onClick={() => onAuth('token', 'Test User')}>Register Mock</button>
    ));
    
    vi.mocked(StudioList).mockImplementation(({ token }) => (
      <div>StudioList Mock - Token: {token || 'none'}</div>
    ));
  });

  it('should render app header', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: null,
      userName: null,
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    expect(screen.getByText('🎬 iCinema Booking')).toBeDefined();
  });

  it('should render footer', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: null,
      userName: null,
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    expect(screen.getByText('Best Cinema Ever.')).toBeDefined();
  });

  it('should render Login and Register when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: null,
      userName: null,
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    expect(screen.getByText('Login Mock')).toBeDefined();
    expect(screen.getByText('Register Mock')).toBeDefined();
  });

  it('should not render Login and Register when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: 'test-token',
      userName: 'John Doe',
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    expect(screen.queryByText('Login Mock')).toBeNull();
    expect(screen.queryByText('Register Mock')).toBeNull();
  });

  it('should display user name when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: 'test-token',
      userName: 'John Doe',
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    expect(screen.getByText(/Hi, John Doe/)).toBeDefined();
  });

  it('should render logout button when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: 'test-token',
      userName: 'John Doe',
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    expect(screen.getByText('Logout')).toBeDefined();
  });

  it('should call logout when logout button is clicked', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: 'test-token',
      userName: 'John Doe',
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('should pass token to StudioList', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: 'test-token',
      userName: 'John Doe',
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    expect(screen.getByText('StudioList Mock - Token: test-token')).toBeDefined();
  });

  it('should pass null token to StudioList when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: null,
      userName: null,
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    expect(screen.getByText('StudioList Mock - Token: none')).toBeDefined();
  });

  it('should call setToken when Login onAuth is triggered', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: null,
      userName: null,
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    const loginButton = screen.getByText('Login Mock');
    fireEvent.click(loginButton);
    
    expect(mockSetToken).toHaveBeenCalledWith('token', 'Test User');
  });

  it('should call setToken when Register onAuth is triggered', () => {
    vi.mocked(useAuth).mockReturnValue({
      token: null,
      userName: null,
      setToken: mockSetToken,
      setUserName: vi.fn(),
      logout: mockLogout,
    });

    render(<App />);
    
    const registerButton = screen.getByText('Register Mock');
    fireEvent.click(registerButton);
    
    expect(mockSetToken).toHaveBeenCalledWith('token', 'Test User');
  });
});
