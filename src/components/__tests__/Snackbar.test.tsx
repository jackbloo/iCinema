import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SnackbarProvider, useSnackbar } from '../Snackbar';
import React from 'react';

function TestComponent() {
  const { show, success, error } = useSnackbar();

  return (
    <div>
      <button onClick={() => show('Test message')}>Show</button>
      <button onClick={() => success('Success message')}>Success</button>
      <button onClick={() => error('Error message')}>Error</button>
    </div>
  );
}

describe('Snackbar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('SnackbarProvider', () => {
    it('should render children', () => {
      render(
        <SnackbarProvider>
          <div>Test Content</div>
        </SnackbarProvider>
      );

      expect(screen.getByText('Test Content')).toBeDefined();
    });

    it('should render snackbar container', () => {
      render(
        <SnackbarProvider>
          <div>Test</div>
        </SnackbarProvider>
      );

      const snackbarContainer = document.querySelector('.fixed.top-5.right-5');
      expect(snackbarContainer).toBeDefined();
    });

    it('should initially render snackbar as hidden', () => {
      render(
        <SnackbarProvider>
          <div>Test</div>
        </SnackbarProvider>
      );

      const snackbarContainer = document.querySelector('.fixed.top-5.right-5');
      expect(snackbarContainer?.className).toContain('opacity-0');
    });
  });

  describe('useSnackbar', () => {
    it('should throw error when used outside provider', () => {
      const TestComponentWithoutProvider = () => {
        useSnackbar();
        return <div>Test</div>;
      };

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useSnackbar must be used inside SnackbarProvider');
    });

    it('should provide show, success, and error functions', () => {
      render(
        <SnackbarProvider>
          <TestComponent />
        </SnackbarProvider>
      );

      expect(screen.getByText('Show')).toBeDefined();
      expect(screen.getByText('Success')).toBeDefined();
      expect(screen.getByText('Error')).toBeDefined();
    });

    it('should display message when show is called', () => {
      render(
        <SnackbarProvider>
          <TestComponent />
        </SnackbarProvider>
      );

      const showButton = screen.getByText('Show');
      
      act(() => {
        fireEvent.click(showButton);
      });

      expect(screen.getByText('Test message')).toBeDefined();
    });

    it('should display success message with green background', () => {
      render(
        <SnackbarProvider>
          <TestComponent />
        </SnackbarProvider>
      );

      const successButton = screen.getByText('Success');
      
      act(() => {
        fireEvent.click(successButton);
      });

      expect(screen.getByText('Success message')).toBeDefined();
      const snackbarContainer = document.querySelector('.fixed.top-5.right-5');
      expect(snackbarContainer?.className).toContain('bg-green-600');
    });

    it('should display error message with red background', () => {
      render(
        <SnackbarProvider>
          <TestComponent />
        </SnackbarProvider>
      );

      const errorButton = screen.getByText('Error');
      
      act(() => {
        fireEvent.click(errorButton);
      });

      expect(screen.getByText('Error message')).toBeDefined();
      const snackbarContainer = document.querySelector('.fixed.top-5.right-5');
      expect(snackbarContainer?.className).toContain('bg-red-600');
    });

    it('should show snackbar with opacity-100 when displayed', () => {
      render(
        <SnackbarProvider>
          <TestComponent />
        </SnackbarProvider>
      );

      const showButton = screen.getByText('Show');
      
      act(() => {
        fireEvent.click(showButton);
      });

      const snackbarContainer = document.querySelector('.fixed.top-5.right-5');
      expect(snackbarContainer?.className).toContain('opacity-100');
    });

    it('should hide snackbar after timeout', () => {
      render(
        <SnackbarProvider>
          <TestComponent />
        </SnackbarProvider>
      );

      const showButton = screen.getByText('Show');
      
      act(() => {
        fireEvent.click(showButton);
      });

      const snackbarContainer = document.querySelector('.fixed.top-5.right-5');
      expect(snackbarContainer?.className).toContain('opacity-100');

      act(() => {
        vi.advanceTimersByTime(2500);
      });

      expect(snackbarContainer?.className).toContain('opacity-0');
    });

    it('should update message when show is called multiple times', () => {
      render(
        <SnackbarProvider>
          <TestComponent />
        </SnackbarProvider>
      );

      const showButton = screen.getByText('Show');
      
      act(() => {
        fireEvent.click(showButton);
      });
      
      expect(screen.getByText('Test message')).toBeDefined();

      const successButton = screen.getByText('Success');
      
      act(() => {
        fireEvent.click(successButton);
      });
      
      expect(screen.getByText('Success message')).toBeDefined();
    });

    it('should show message with default success variant', () => {
      render(
        <SnackbarProvider>
          <TestComponent />
        </SnackbarProvider>
      );

      const showButton = screen.getByText('Show');
      
      act(() => {
        fireEvent.click(showButton);
      });

      const snackbarContainer = document.querySelector('.fixed.top-5.right-5');
      expect(snackbarContainer?.className).toContain('bg-green-600');
    });
  });
});
