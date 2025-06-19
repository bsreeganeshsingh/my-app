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
        if (onClick) {
            onClick(movie);
        }
    }

    const onEditHandler = (e) => {
        e.stopPropagation(); // Prevent click from propagating to the tile
        setShowMenu(false); // Close menu on edit
        if (onEdit) {
            onEdit(movie);
        }
        window.alert(`Edit '${movie.title}' is clicked.`);
    }

    const onDeleteHandler = (e) => {
        e.stopPropagation(); // Prevent click from propagating to the tile
        setShowMenu(false); // Close menu on delete
        if (onDelete) {
            onDelete(movie);
        }
        window.alert(`Delete '${movie.title}' is clicked.`);
    }

    return (
        <div data-testid="movie-tile" className={styles.movieTile} onClick={onClickHandler}>
            <img src={movie.imageUrl} alt={movie.title} className={styles.poster} />
            <div className={styles.info}>
                <div className={styles.titleRow}>
                    <h3>{movie.title}</h3>
                    <span className={styles.year}>{movie.year}</span>
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
                <p className={styles.genres}>{movie.genres.join(', ')}</p>
            </div>
        </div>
    );
};

MovieTile.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
        genres: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default MovieTile;

