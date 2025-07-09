import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMovieById } from '../../hooks/usemovies/useMovieById'; // You’ll need this custom hook
import MovieDetails from './MovieDetails';
import styles from './MovieDetails.module.scss';

function MovieDetailsWrapper() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: movie, isLoading, isError } = useMovieById(movieId);

    const handleClose = () => {
        const searchParams = location.search;
        navigate(`/${searchParams}`);
    };

    if (isLoading) return <div className={styles.loadingMessage}>Loading...</div>;
    if (isError || !movie?.id) return <div className={styles.errorMessage}>This movie no longer exists.</div>;

    return <MovieDetails movie={movie} onClose={handleClose} />;
}

export default MovieDetailsWrapper;

// ?query=b&genre=Fantasy&sortBy=release_date&sortOrder=desc
