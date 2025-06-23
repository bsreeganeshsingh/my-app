import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MovieForm from './MovieForm';

describe('MovieForm', () => {
    const defaultProps = {
        onSubmit: jest.fn(),
        onReset: jest.fn(),
    };

    const initialData = {
        title: 'Inception',
        year: '2010',
        duration: '148',
        rating: '8.8',
        description: 'A mind-bending thriller',
        imageUrl: 'http://example.com/image.jpg',
        genres: ['Sci-Fi', 'Thriller'],
    };

    const fillForm = (getByLabelText) => {
        fireEvent.change(getByLabelText(/TITLE/i), { target: { value: 'The Matrix' } });
        fireEvent.change(getByLabelText(/YEAR/i), { target: { value: '1999' } });
        fireEvent.change(getByLabelText(/DURATION/i), { target: { value: '136' } });
        fireEvent.change(getByLabelText(/RATING/i), { target: { value: '9.0' } });
        fireEvent.change(getByLabelText(/DESCRIPTION/i), { target: { value: 'Neo discovers the truth' } });
        fireEvent.change(getByLabelText(/GENRES/i), { target: { value: 'ACTION, SCI-FI' } });
        fireEvent.change(getByLabelText(/IMAGE URL/i), { target: { value: 'http://matrix.com/image.png' } });
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default empty values when no initialData is provided', () => {
        const { getByLabelText } = render(<MovieForm {...defaultProps} />);
        expect(getByLabelText(/TITLE/i).value).toBe('');
        expect(getByLabelText(/Genres/i).value).toBe('');
    });

    it('renders with initialData and converts genres array to string', () => {
        const { getByLabelText } = render(<MovieForm {...defaultProps} initialData={initialData} />);
        expect(getByLabelText(/TITLE/i).value).toBe('Inception');
        expect(getByLabelText(/GENRES/i).value).toBe('Sci-Fi, Thriller');
    });

    it('handles input changes', () => {
        const { getByLabelText } = render(<MovieForm {...defaultProps} />);
        fireEvent.change(getByLabelText(/TITLE/i), { target: { value: 'Tenet' } });
        expect(getByLabelText(/TITLE/i).value).toBe('Tenet');
    });

    it('calls onSubmit with parsed values when form is submitted', () => {
        const handleSubmit = jest.fn();
        const { getByLabelText, getByText } = render(<MovieForm onSubmit={handleSubmit} />);
        fillForm(getByLabelText);
        fireEvent.click(getByText(/SUBMIT/i));

        expect(handleSubmit).toHaveBeenCalledWith({
            title: 'The Matrix',
            year: '1999',
            duration: '136',
            rating: 9.0,
            description: 'Neo discovers the truth',
            genres: ['ACTION', 'SCI-FI'],
            imageUrl: 'http://matrix.com/image.png',
        });
    });

    it('calls handleReset and resets to initialData', () => {
        const { getByLabelText, getByText } = render(
            <MovieForm {...defaultProps} initialData={initialData} />
        );

        const titleInput = getByLabelText(/TITLE/i);
        fireEvent.change(titleInput, { target: { value: 'Changed TITLE' } });
        expect(titleInput.value).toBe('Changed TITLE');

        fireEvent.click(getByText(/RESET/i));
        expect(titleInput.value).toBe('Inception');
    });

    it('parses genres string properly even if it was passed as a string', () => {
        const stringGenresData = { ...initialData, genres: 'SCI-FI, ACTION' };
        const { getByText, getByLabelText } = render(
            <MovieForm {...defaultProps} initialData={stringGenresData} />
        );

        fireEvent.change(getByLabelText(/TITLE/i), { target: { value: 'Interstellar' } });
        fireEvent.click(getByText(/SUBMIT/i));

        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                genres: ['SCI-FI', 'ACTION'],
            })
        );
    });

    it('handles empty genres and non-array types correctly', () => {
        const emptyGenresData = { ...initialData, genres: '' };
        const { getByLabelText } = render(
            <MovieForm {...defaultProps} initialData={emptyGenresData} />
        );
        expect(getByLabelText(/GENRES/i).value).toBe('');
    });

    it('resets the form without crashing when onReset is undefined', () => {
        const { getByText, getByLabelText } = render(
            <MovieForm onSubmit={jest.fn()} />
        );

        fireEvent.change(getByLabelText(/TITLE/i), { target: { value: 'Some Title' } });
        fireEvent.click(getByText(/RESET/i));

        expect(getByLabelText(/TITLE/i).value).toBe('');
    });
});
