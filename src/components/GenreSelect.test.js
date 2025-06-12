import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenreSelect from './GenreSelect';

test('renders all genres as buttons', () => {
    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];
    render(<GenreSelect genres={genres} selectedGenre="" onSelect={() => { }} />);

    genres.forEach(genre => {
        expect(screen.getByRole('button', { name: genre })).toBeInTheDocument();
    });
});

test('component highlights selected genre', () => {
    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];
    render(<GenreSelect genres={genres} selectedGenre="Comedy" onSelect={() => { }} />);

    genres.forEach(genre => {
        const button = screen.getByRole('button', { name: genre });
        if (genre === 'Comedy') {
            expect(button).toHaveClass('selected');
        } else {
            expect(button).not.toHaveClass('selected');
        }
    });
});

test('click on genre button calls onSelect with genre', async () => {
    const mockOnSelect = jest.fn();
    window.alert = jest.fn(); // Mock window.alert
    render(<GenreSelect genres={['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi']} selectedGenre="" onSelect={mockOnSelect} />);
    const button = screen.getByRole('button', { name: 'Sci-Fi' });

    fireEvent.click(button);

    expect(mockOnSelect).toHaveBeenCalledWith('Sci-Fi');
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Genre selected: Sci-Fi');
});
