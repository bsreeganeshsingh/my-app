import { genres as genreOptions } from '../../utils/Constants';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './MovieForm.module.scss';

const MovieForm = ({ initialData = {}, onSubmit, onReset }) => {
    const genresAsArray = Array.isArray(initialData?.genres)
        ? initialData.genres
        : (initialData?.genres || '')
            .split(', ')
            .map((g) => g.trim())
            .filter(Boolean);

    const [form, setForm] = useState({
        title: '',
        tagline: '',
        release_date: '',
        runtime: '',
        vote_average: '',
        budget: '',
        overview: '',
        poster_path: '',
        ...initialData,
        genres: genresAsArray,
    });

    const [isGenreDropdownOpen, setGenreDropdownOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenreChange = (genre) => {
        setForm((prev) => {
            const hasGenre = prev.genres.includes(genre);
            const genres = hasGenre
                ? prev.genres.filter((g) => g !== genre)
                : [...prev.genres, genre];
            return { ...prev, genres };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prepared = {
            ...form,
            vote_average: parseFloat(form.vote_average),
            runtime: parseInt(form.runtime, 10),
            budget: parseInt(form.budget, 10),
            genres: form.genres,
        };
        onSubmit(prepared);
    };

    const handleReset = () => {
        setForm({
            title: '',
            tagline: '',
            release_date: '',
            runtime: '',
            vote_average: '',
            budget: '',
            overview: '',
            poster_path: '',
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
                    name="release_date"
                    type="date"
                    value={form.release_date}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                TAGLINE
                <input name="tagline" value={form.tagline} onChange={handleChange} required />
            </label>
            <label>
                RATING
                <input name="vote_average" type="number" step="0.1" value={form.vote_average} onChange={handleChange} required />
            </label>
            <label>
                IMAGE URL
                <input name="poster_path" value={form.poster_path} onChange={handleChange} required />
            </label>
            <label>
                DURATION
                <input name="runtime" type="number" value={form.runtime} onChange={handleChange} required />
            </label>
            <div className={styles.genreField}>
                <label>GENRES</label>
                <div className={styles.dropdownContainer}>
                    <div
                        className={styles.dropdownHeader}
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
                                    <input
                                        type="checkbox"
                                        aria-label={`genre-${genre}`}
                                        checked={form.genres.some(g => g.toLowerCase() === genre.toLowerCase())}
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
            <label>
                BUDGET
                <input name="budget" type="number" value={form.budget} onChange={handleChange} required />
            </label>
            <label>
                DESCRIPTION
                <textarea name="overview" value={form.overview} onChange={handleChange} required />
            </label>
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
