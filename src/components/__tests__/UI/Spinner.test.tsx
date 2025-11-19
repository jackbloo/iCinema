import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from '../../UI/Spinner';

describe('Spinner', () => {
  it('should render spinner element', () => {
    const { container } = render(<Spinner />);
    
    const spinner = container.querySelector('div');
    expect(spinner).toBeDefined();
  });

  it('should have animate-spin class', () => {
    const { container } = render(<Spinner />);
    
    const spinner = container.querySelector('div');
    expect(spinner?.className).toContain('animate-spin');
  });

  it('should have rounded-full class', () => {
    const { container } = render(<Spinner />);
    
    const spinner = container.querySelector('div');
    expect(spinner?.className).toContain('rounded-full');
  });

  it('should have border classes', () => {
    const { container } = render(<Spinner />);
    
    const spinner = container.querySelector('div');
    expect(spinner?.className).toContain('border-2');
    expect(spinner?.className).toContain('border-gray-300');
    expect(spinner?.className).toContain('border-t-transparent');
  });

  it('should have size classes', () => {
    const { container } = render(<Spinner />);
    
    const spinner = container.querySelector('div');
    expect(spinner?.className).toContain('w-6');
    expect(spinner?.className).toContain('h-6');
  });
});
