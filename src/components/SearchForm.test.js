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

test('onSearch is called with input value when button clicked', async () => {
    const mockOnSearch = jest.fn();
    window.alert = jest.fn(); // Mock window.alert
    render(<SearchForm initialQuery="" onSearch={mockOnSearch} />);

    fireEvent.change(screen.getByPlaceholderText(/Enter search query/i), {
        target: { value: 'Titanic' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    expect(mockOnSearch).toHaveBeenCalledWith('Titanic');
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Search triggered for: Titanic');
});

test('onSearch is called with input value when Enter key pressed', async () => {
    const mockOnSearch = jest.fn();
    window.alert = jest.fn(); // Mock window.alert
    render(<SearchForm initialQuery="" onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/Enter search query/i);

    fireEvent.change(input, {
        target: { value: 'Bahubali' },
    });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });

    expect(mockOnSearch).toHaveBeenCalledWith('Bahubali');
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Search triggered for: Bahubali');
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

    expect(window.alert).toHaveBeenCalledWith('Search triggered for: Test');
});