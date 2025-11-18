import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Root from '../Root';
import App from '../App';
import { SnackbarProvider } from '../Snackbar';

vi.mock('../App');
vi.mock('../Snackbar');

describe('Root', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(App).mockImplementation(() => <div>App Component</div>);
    
    vi.mocked(SnackbarProvider).mockImplementation(({ children }) => (
      <div data-testid="snackbar-provider">{children}</div>
    ));
  });

  it('should render SnackbarProvider', () => {
    render(<Root />);
    
    expect(screen.getByTestId('snackbar-provider')).toBeDefined();
  });

  it('should render App component', () => {
    render(<Root />);
    
    expect(screen.getByText('App Component')).toBeDefined();
  });

  it('should wrap App with SnackbarProvider', () => {
    render(<Root />);
    
    const provider = screen.getByTestId('snackbar-provider');
    const app = screen.getByText('App Component');
    
    expect(provider.contains(app)).toBe(true);
  });

  it('should call SnackbarProvider with children', () => {
    render(<Root />);
    
    expect(SnackbarProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.anything(),
      }),
      expect.anything()
    );
  });

  it('should render App inside SnackbarProvider', () => {
    render(<Root />);
    
    expect(App).toHaveBeenCalled();
    expect(SnackbarProvider).toHaveBeenCalled();
  });
});
