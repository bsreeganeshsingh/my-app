import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockOnSearch).toHaveBeenCalledWith('Bahubali');
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Search triggered for: Bahubali');
});