import React from 'react';
import styles from './MovieDetails.module.scss';
import { Search } from 'lucide-react';

const MovieDetails = ({ movie, onClose }) => {

    const formattedGenres = movie.genres.length > 1
        ? movie.genres.slice(0, -1).join(', ') + ' & ' + movie.genres.slice(-1)
        : movie.genres[0];

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className={styles.movieDetails}>
            <div className={styles.header}>
                <div className={styles.logo}>netflixroulette</div>
                <button className={styles.searchButton} onClick={handleClose}>
                    <Search size={30} strokeWidth={2} />
                </button>
            </div>
            <div className={styles.content}>
                <img src={movie.poster_path} alt={movie.title} className={styles.poster} />
                <div className={styles.info}>
                    <div className={styles.titleRow}>
                        <h1>{movie.title}</h1>
                        <div className={styles.voteAverage}>{movie.vote_average}</div>
                    </div>
                    <div className={styles.genres}> {formattedGenres} </div>
                    <div className={styles.meta}>
                        <span className={styles.release_date}>{movie.release_date}</span>
                        <span>{movie.duration}</span>
                    </div>
                    <div className={styles.description}> {movie.overview} </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;
