import { genres as genreOptions } from '../../utils/Constants';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './MovieForm.module.scss';

const MovieForm = ({ initialData = {}, onSubmit, onReset }) => {
    const genresAsArray = Array.isArray(initialData?.genres)
        ? initialData.genres
        : (initialData?.genres || '').split(', ').map((g) => g.trim()).filter(Boolean);
    const [form, setForm] = useState({
        title: '',
        releaseDate: '',
        duration: '',
        rating: '',
        description: '',
        imageUrl: '',
        ...initialData,
        genres: genresAsArray,
    });
    const [isGenreDropdownOpen, setGenreDropdownOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleGenreChange = (genre) => {
        setForm((f) => {
            const hasGenre = f.genres.includes(genre);
            const genres = hasGenre
                ? f.genres.filter((g) => g !== genre)
                : [...f.genres, genre];
            return { ...f, genres };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prepared = {
            ...form,
            rating: parseFloat(form.rating),
            genres: form.genres,
        };
        onSubmit(prepared);
    };

    const handleReset = () => {
        setForm({
            title: '',
            releaseDate: '',
            duration: '',
            rating: '',
            description: '',
            imageUrl: '',
            ...initialData,
            genres: genresAsArray,
        });

        if (onReset) {
            onReset();
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
            <label>
                TITLE
                <input name="title" value={form.title} onChange={handleChange} required />
            </label>
            <label>
                RELEASE DATE
                <input
                    name="releaseDate"
                    type="date"
                    value={form.releaseDate}
                    onChange={handleChange}
                    required
                />
            </label>
            <label> IMAGE URL <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required /></label>
            <label> RATING <input name="rating" value={form.rating} onChange={handleChange} required /></label>
            <div className={styles.genreField}>
                <label>GENRES</label>
                <div className={styles.dropdownContainer}>
                    <div className={styles.dropdownHeader}
                        data-testid="genre-dropdown-header"
                        onClick={(e) => {
                            e.stopPropagation();
                            setGenreDropdownOpen(prev => !prev);
                        }}
                    >
                        {form.genres.length > 0 ? form.genres.join(', ') : 'Select Genre'}
                    </div>
                    {isGenreDropdownOpen && (
                        <div className={styles.dropdownList}>
                            {genreOptions.filter((genre) => genre !== 'ALL').map((genre) => (
                                <label key={genre} className={styles.dropdownItem}>
                                    <input type="checkbox"
                                        aria-label={`genre-${genre}`}
                                        checked={form.genres.includes(genre)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleGenreChange(genre);
                                        }}
                                    />
                                    <span>{genre}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <label> DURATION <input name="duration" value={form.duration} onChange={handleChange} required /></label>
            <label> DESCRIPTION <textarea name="description" value={form.description} onChange={handleChange} required /></label>
            <div className={styles.buttonGroup}>
                <button type="reset">RESET</button>
                <button type="submit">SUBMIT</button>
            </div>
        </form>
    );
};

MovieForm.propTypes = {
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func,
};

MovieForm.defaultProps = {
    initialData: {},
};

export default MovieForm;
