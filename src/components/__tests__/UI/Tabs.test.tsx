import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Tabs from '../../UI/Tabs';

describe('Tabs', () => {
  const mockTabs = ['Tab 1', 'Tab 2', 'Tab 3'];

  it('should render all tabs', () => {
    render(<Tabs tabs={mockTabs} />);
    
    expect(screen.getByText('Tab 1')).toBeDefined();
    expect(screen.getByText('Tab 2')).toBeDefined();
    expect(screen.getByText('Tab 3')).toBeDefined();
  });

  it('should activate first tab by default', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const firstTab = screen.getByText('Tab 1');
    expect(firstTab.className).toContain('text-blue-600');
    expect(firstTab.className).toContain('border-blue-600');
  });

  it('should activate tab based on defaultIndex', () => {
    render(<Tabs tabs={mockTabs} defaultIndex={1} />);
    
    const secondTab = screen.getByText('Tab 2');
    expect(secondTab.className).toContain('text-blue-600');
  });

  it('should apply inactive styles to non-active tabs', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const secondTab = screen.getByText('Tab 2');
    expect(secondTab.className).toContain('text-gray-500');
  });

  it('should change active tab on click', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const secondTab = screen.getByText('Tab 2');
    fireEvent.click(secondTab);
    
    expect(secondTab.className).toContain('text-blue-600');
  });

  it('should call onChange when tab is clicked', () => {
    const mockOnChange = vi.fn();
    render(<Tabs tabs={mockTabs} onChange={mockOnChange} />);
    
    const secondTab = screen.getByText('Tab 2');
    fireEvent.click(secondTab);
    
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('should call onChange with correct index', () => {
    const mockOnChange = vi.fn();
    render(<Tabs tabs={mockTabs} onChange={mockOnChange} />);
    
    const thirdTab = screen.getByText('Tab 3');
    fireEvent.click(thirdTab);
    
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('should deactivate previously active tab', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const firstTab = screen.getByText('Tab 1');
    const secondTab = screen.getByText('Tab 2');
    
    fireEvent.click(secondTab);
    
    expect(firstTab.className).toContain('text-gray-500');
    expect(firstTab.className).not.toContain('text-blue-600');
  });

  it('should render with empty tabs array', () => {
    const { container } = render(<Tabs tabs={[]} />);
    
    const tabsContainer = container.querySelector('.flex');
    expect(tabsContainer).toBeDefined();
  });

  it('should render single tab', () => {
    render(<Tabs tabs={['Only Tab']} />);
    
    const tab = screen.getByText('Only Tab');
    expect(tab).toBeDefined();
    expect(tab.className).toContain('text-blue-600');
  });

  it('should not call onChange if not provided', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const secondTab = screen.getByText('Tab 2');
    expect(() => fireEvent.click(secondTab)).not.toThrow();
  });

  it('should have cursor-pointer class on tabs', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const firstTab = screen.getByText('Tab 1');
    expect(firstTab.className).toContain('cursor-pointer');
  });
});
