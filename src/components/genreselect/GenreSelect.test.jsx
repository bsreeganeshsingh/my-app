import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { genres } from "../../utils/Constants"
import GenreSelect from './GenreSelect';

test('renders all genres as buttons', () => {
    render(<GenreSelect genres={genres} selectedGenre="" onSelect={() => { }} />);

    genres.forEach(genre => {
        expect(screen.getByRole('button', { name: genre })).toBeInTheDocument();
    });
});

test('component highlights selected genre', () => {
    render(<GenreSelect genres={genres} selectedGenre="COMEDY" onSelect={() => { }} />);

    genres.forEach(genre => {
        const button = screen.getByRole('button', { name: genre });
        if (genre === 'COMEDY') {
            expect(button).toHaveClass('selected');
        } else {
            expect(button).not.toHaveClass('selected');
        }
    });
});

test('click on genre button calls onSelect with genre', async () => {
    const mockOnSelect = jest.fn();
    render(<GenreSelect genres={genres} selectedGenre="" onSelect={mockOnSelect} />);
    const button = screen.getByRole('button', { name: 'CRIME' });

    fireEvent.click(button);

    expect(mockOnSelect).toHaveBeenCalledWith('CRIME');
});

test('does not call onSelect if it is not a function', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    render(<GenreSelect genres={['ACTION', 'COMEDY']} selectedGenre="" onSelect={null} />);

    const button = screen.getByRole('button', { name: 'ACTION' });
    fireEvent.click(button);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
});

test('click on already selected genre does not change anything', () => {
    const mockOnSelect = jest.fn();
    render(<GenreSelect genres={['COMEDY', 'DRAMA']} selectedGenre="COMEDY" onSelect={mockOnSelect} />);

    const button = screen.getByRole('button', { name: 'COMEDY' });
    fireEvent.click(button);

    expect(mockOnSelect).toHaveBeenCalledWith("COMEDY");
});