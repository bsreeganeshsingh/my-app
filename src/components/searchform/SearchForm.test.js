import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from './SearchForm';

test('component renders with initial value passed in', () => {
    render(<SearchForm initialQuery="Tare Zameen Par" onSearch={() => { }} />);
    expect(screen.getByDisplayValue(/Tare Zameen Par/i)).toBeInTheDocument();
});

test('onChange updates input value when typing', async () => {
    render(<SearchForm initialQuery="" onSearch={() => { }} />);
    const input = screen.getByPlaceholderText(/Enter search query/i);

    fireEvent.change(input, {
        target: { value: 'Interstellar' },
    });

    expect(input).toHaveValue('Interstellar');
});

test('does not call onSearch if it is not a function', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    render(<SearchForm initialQuery="" onSearch={null} />);

    const input = screen.getByPlaceholderText(/Enter search query/i);
    fireEvent.change(input, {
        target: { value: 'Avatar' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
});

test('does not trigger search on non-Enter key press', () => {
    const mockOnSearch = jest.fn();
    window.alert = jest.fn();
    render(<SearchForm initialQuery="" onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Enter search query/i);

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.keyDown(input, { key: 'a', code: 'KeyA', keyCode: 65 });

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
});

test('does not call onSearch if it is a falsy non-null value', () => {
    const mockOnSearch = false;
    window.alert = jest.fn();
    render(<SearchForm initialQuery="Test" onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Enter search query/i);

    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    expect(window.alert).not.toHaveBeenCalled();
});

test('calls onSearch with current query when Enter key is pressed', () => {
    const mockOnSearch = jest.fn();
    render(<SearchForm initialQuery="Initial" onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Enter search query/i);

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

    expect(mockOnSearch).toHaveBeenCalledWith('Initial');
});

test('input value updates when initialQuery prop changes', () => {
    // This test is for completeness, but note: useState does not update from prop after mount
    // So this test will show that input does NOT update if initialQuery changes after mount
    const { rerender } = render(<SearchForm initialQuery="First" onSearch={() => { }} />);
    const input = screen.getByPlaceholderText(/Enter search query/i);
    expect(input).toHaveValue('First');

    rerender(<SearchForm initialQuery="Second" onSearch={() => { }} />);

    expect(input).toHaveValue('First'); // Should still be 'First'
});

test('renders input and button with correct classes and attributes', () => {
    render(<SearchForm />);
    const input = screen.getByPlaceholderText(/Enter search query/i);
    const button = screen.getByRole('button', { name: /Search/i });

    expect(input).toHaveClass('search-input');
    expect(button).toHaveClass('search-button');
    expect(button).toHaveAttribute('aria-label', 'Search');
});

test('does not crash if onSearch is undefined', () => {
    render(<SearchForm initialQuery="Test" />);

    const button = screen.getByRole('button', { name: /Search/i });

    expect(() => fireEvent.click(button)).not.toThrow();
});

test('input is empty if no initialQuery is provided', () => {
    render(<SearchForm />);
    const input = screen.getByPlaceholderText(/Enter search query/i);
    expect(input).toHaveValue('');
});

test('does not trigger search on non-Enter key press', () => {
    const mockOnSearch = jest.fn();
    window.alert = jest.fn();
    render(<SearchForm initialQuery="" onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Enter search query/i);

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.keyDown(input, { key: 'a', code: 'KeyA', keyCode: 65 });

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
});

test('does not call onSearch if it is a falsy non-null value', () => {
    const mockOnSearch = false;
    window.alert = jest.fn();
    render(<SearchForm initialQuery="Test" onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Enter search query/i);

    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    expect(window.alert).not.toHaveBeenCalled();
});