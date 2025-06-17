import React from 'react';
import PropTypes from 'prop-types';
import styles from './MovieDetails.module.scss';

const MovieDetails = ({ movie, onClose }) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        window.alert(`'${movie.title}' is closed.`);
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
                <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
                <p><strong>Description:</strong> {movie.description}</p>
            </div>
        </div>
    );
}

MovieDetails.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        duration: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        genres: PropTypes.arrayOf(PropTypes.string).isRequired,
        description: PropTypes.string,
        imageUrl: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func,
};

export default MovieDetails;
