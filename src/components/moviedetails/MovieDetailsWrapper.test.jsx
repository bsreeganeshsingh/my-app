import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieDetailsWrapper from './MovieDetailsWrapper';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useMovieById } from '../../hooks/usemovies/useMovieById';

jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

jest.mock('../../hooks/usemovies/useMovieById');

jest.mock('./MovieDetails', () => ({ movie, onClose }) => (
    <div data-testid="movie-details">
        <p>{movie.title}</p>
        <button onClick={onClose}>Close</button>
    </div>
));

describe('MovieDetailsWrapper', () => {
    const mockNavigate = jest.fn();
    const mockMovie = {
        id: 1,
        title: 'Test Movie'
    };

    beforeEach(() => {
        jest.clearAllMocks();

        useParams.mockReturnValue({ movieId: '1' });
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue({ search: '?query=Avengers' });
    });

    it('renders loading state when movie is loading', () => {
        useMovieById.mockReturnValue({
            data: null,
            isLoading: true,
            isError: false
        });

        render(<MovieDetailsWrapper />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders error message when movie is not found or errored', () => {
        useMovieById.mockReturnValue({
            data: null,
            isLoading: false,
            isError: true
        });

        render(<MovieDetailsWrapper />);
        expect(screen.getByText(/no longer exists/i)).toBeInTheDocument();
    });

    it('renders error when movie is missing id', () => {
        useMovieById.mockReturnValue({
            data: { title: 'No ID Movie' },
            isLoading: false,
            isError: false
        });

        render(<MovieDetailsWrapper />);
        expect(screen.getByText(/no longer exists/i)).toBeInTheDocument();
    });

    it('renders movie details when data is available', () => {
        useMovieById.mockReturnValue({
            data: mockMovie,
            isLoading: false,
            isError: false
        });

        render(<MovieDetailsWrapper />);
        expect(screen.getByTestId('movie-details')).toBeInTheDocument();
        expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    it('calls navigate with correct search params on close', () => {
        useMovieById.mockReturnValue({
            data: mockMovie,
            isLoading: false,
            isError: false
        });

        render(<MovieDetailsWrapper />);
        fireEvent.click(screen.getByText('Close'));
        expect(mockNavigate).toHaveBeenCalledWith('/?query=Avengers');
    });
});
