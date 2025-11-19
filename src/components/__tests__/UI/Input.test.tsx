import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Input from '../../UI/Input';

describe('Input', () => {
  it('should render input element', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDefined();
  });

  it('should render label when provided', () => {
    render(<Input label="Username" />);
    
    expect(screen.getByText('Username')).toBeDefined();
  });

  it('should not render label when not provided', () => {
    const { container } = render(<Input />);
    
    const label = container.querySelector('label');
    expect(label).toBeNull();
  });

  it('should render error message when provided', () => {
    render(<Input error="This field is required" />);
    
    expect(screen.getByText('This field is required')).toBeDefined();
  });

  it('should not render error message when null', () => {
    const { container } = render(<Input error={null} />);
    
    const errorText = container.querySelector('.text-red-500');
    expect(errorText).toBeNull();
  });

  it('should not render error message when not provided', () => {
    const { container } = render(<Input />);
    
    const errorText = container.querySelector('.text-red-500');
    expect(errorText).toBeNull();
  });

  it('should apply error styles when error is provided', () => {
    const { container } = render(<Input error="Error" />);
    
    const input = container.querySelector('input');
    expect(input?.className).toContain('border-red-500');
  });

  it('should apply default styles when no error', () => {
    const { container } = render(<Input />);
    
    const input = container.querySelector('input');
    expect(input?.className).toContain('border-gray-300');
  });

  it('should pass through input props', () => {
    render(<Input placeholder="Enter text" type="email" required />);
    
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input.type).toBe('email');
    expect(input.required).toBe(true);
  });

  it('should apply custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    
    const input = container.querySelector('input');
    expect(input?.className).toContain('custom-class');
  });

  it('should render with value', () => {
    render(<Input value="test value" onChange={() => {}} />);
    
    const input = screen.getByDisplayValue('test value');
    expect(input).toBeDefined();
  });
});
