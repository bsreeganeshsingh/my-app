import React from 'react';
import styles from './MovieDetails.module.scss';

const MovieDetails = ({ movie, onClose }) => {

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className={styles.movieDetails}>
            <button className={styles.closeButton} onClick={handleClose}>X</button>
            <img src={movie.imageUrl} alt={movie.title} className={styles.poster} />
            <div className={styles.info}>
                <div className={styles.titleRow}>
                    <h2>{movie.title}</h2>
                    <span className={styles.rating}>{movie.rating}</span>
                </div>
                <div className={styles.meta}>
                    <span className={styles.year}>{movie.year}</span>
                    <span>{movie.duration}</span>
                </div>
                <div className={styles.detailsList}>
                    <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
                    <p><strong>Description:</strong> {movie.description}</p>
                    <p><strong>Director:</strong> {movie.director || 'N/A'}</p>
                    <p><strong>Cast:</strong> {movie.cast ? movie.cast.join(', ') : 'N/A'}</p>
                    <p><strong>Box Office:</strong> {movie.boxOffice || 'N/A'}</p>
                    <p><strong>Awards:</strong> {movie.awards || 'N/A'}</p>
                    <p><strong>Language:</strong> {movie.language || 'N/A'}</p>
                    <p><strong>Country:</strong> {movie.country || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;
