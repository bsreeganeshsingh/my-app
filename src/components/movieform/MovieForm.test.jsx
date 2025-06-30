import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieForm from './MovieForm';

describe('MovieForm', () => {
    const defaultProps = {
        onSubmit: jest.fn(),
        onReset: jest.fn(),
    };

    const initialData = {
        title: 'Inception',
        releaseDate: '2010-12-24',
        duration: '2h 28m',
        rating: '8.8',
        description: 'A mind-bending thriller',
        imageUrl: 'http://example.com/image.jpg',
        genres: ['COMEDY', 'CRIME'],
    };

    const fillForm = (getByLabelText, getByText) => {
        fireEvent.change(getByLabelText(/TITLE/i), { target: { value: 'The Matrix' } });
        fireEvent.change(getByLabelText(/RELEASE DATE/i), { target: { value: '2001-03-31' } });
        fireEvent.change(getByLabelText(/DURATION/i), { target: { value: '2h 16m' } });
        fireEvent.change(getByLabelText(/RATING/i), { target: { value: '9.0' } });
        fireEvent.change(getByLabelText(/DESCRIPTION/i), { target: { value: 'Neo discovers the truth' } });
        // Click to open genres dropdown
        const dropdownHeader = getByText(/Select Genre/i);
        fireEvent.click(dropdownHeader);
        fireEvent.click(getByText('COMEDY').previousSibling);
        fireEvent.click(getByText('HORROR').previousSibling);
        fireEvent.change(getByLabelText(/IMAGE URL/i), { target: { value: 'http://matrix.com/image.png' } });
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default empty values when no initialData is provided', () => {
        const { getByLabelText, getByText } = render(<MovieForm {...defaultProps} />);
        expect(getByLabelText(/TITLE/i).value).toBe('');
        expect(getByText(/Select Genre/i)).toBeInTheDocument();
    });

    it('handles input changes', () => {
        const { getByLabelText } = render(<MovieForm {...defaultProps} />);
        fireEvent.change(getByLabelText(/TITLE/i), { target: { value: 'Tenet' } });
        expect(getByLabelText(/TITLE/i).value).toBe('Tenet');
    });

    it('calls onSubmit with parsed values when form is submitted', () => {
        const handleSubmit = jest.fn();
        const { getByLabelText, getByText } = render(<MovieForm onSubmit={handleSubmit} />);
        fillForm(getByLabelText, getByText);
        fireEvent.click(getByText(/SUBMIT/i));

        expect(handleSubmit).toHaveBeenCalledWith({
            title: 'The Matrix',
            releaseDate: '2001-03-31',
            duration: '2h 16m',
            rating: 9.0,
            description: 'Neo discovers the truth',
            genres: ['COMEDY', 'HORROR'],
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
        const { getByText } = render(
            <MovieForm {...defaultProps} initialData={emptyGenresData} />
        );
        expect(getByText(/Select Genre/i)).toBeInTheDocument();
    });

    it('resets the form without crashing when onReset is undefined', () => {
        const { getByText, getByLabelText } = render(
            <MovieForm onSubmit={jest.fn()} />
        );

        fireEvent.change(getByLabelText(/TITLE/i), { target: { value: 'Some Title' } });
        fireEvent.click(getByText(/RESET/i));

        expect(getByLabelText(/TITLE/i).value).toBe('');
    });

    it('removes a genre when it is unchecked', () => {
        const { getByLabelText, getByTestId } = render(
            <MovieForm {...defaultProps} initialData={{ ...initialData, genres: ['COMEDY'] }} />
        );

        // Open dropdown
        const dropdownHeader = getByTestId('genre-dropdown-header');
        fireEvent.click(dropdownHeader);

        // Genre COMEDY should be checked, uncheck it
        const comedyCheckbox = getByLabelText('genre-COMEDY');
        expect(comedyCheckbox.checked).toBe(true);

        fireEvent.click(comedyCheckbox);
        expect(comedyCheckbox.checked).toBe(false);

        // Check if the dropdown header reflects the removal
        expect(getByTestId('genre-dropdown-header')).toHaveTextContent('Select Genre');
    });
});
