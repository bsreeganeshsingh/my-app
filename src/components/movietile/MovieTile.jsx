import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./MovieTile.module.scss";

const MovieTile = ({ movie, onClick, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(prev => !prev);
    };

    const onClickHandler = (e) => {
        setShowMenu(false); // Close menu on click
        onClick?.(movie);
    }

    const onEditHandler = (e) => {
        e.stopPropagation(); // Prevent click from propagating to the tile
        setShowMenu(false); // Close menu on edit
        onEdit?.(movie);
    }

    const onDeleteHandler = (e) => {
        e.stopPropagation(); // Prevent click from propagating to the tile
        setShowMenu(false); // Close menu on delete
        onDelete?.(movie);
    }

    return (
        <div data-testid="movie-tile" className={styles.movieTile} onClick={onClickHandler}>
            <div className={styles.imageContainer}>
                <img src={movie.poster_path} alt={movie.title} className={styles.poster} />
                <div className={styles.menuIcon} onClick={toggleMenu}>
                    ⋮
                    {showMenu && (
                        <ul className={styles.menu}>
                            <li onClick={onEditHandler}>Edit</li>
                            <li onClick={onDeleteHandler}>Delete</li>
                        </ul>
                    )}
                </div>
            </div>
            <div className={styles.info}>
                <div className={styles.titleRow}>
                    <h3 className={styles.title}>{movie.title}</h3>
                    <span className={styles.release_date}>{movie.release_date.substring(0, 4)}</span>
                </div>
                <p className={styles.genres}>{movie.genres.join(', ')}</p>
            </div>
        </div>
    );
};

MovieTile.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        release_date: PropTypes.string.isRequired,
        poster_path: PropTypes.string.isRequired,
        genres: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default MovieTile;

