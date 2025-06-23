import React, { useState } from 'react';
import styles from './MovieForm.module.scss';
import PropTypes from 'prop-types';

const MovieForm = ({ initialData = {}, onSubmit, onReset }) => {
    const genresAsString = Array.isArray(initialData?.genres)
        ? initialData.genres.join(', ')
        : initialData?.genres || '';
    const [form, setForm] = useState({
        title: '',
        year: '',
        duration: '',
        rating: '',
        description: '',
        imageUrl: '',
        ...initialData,
        genres: genresAsString,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prepared = {
            ...form,
            rating: parseFloat(form.rating),
            genres: form.genres.split(',').map((g) => g.trim()),
        };
        onSubmit(prepared);
    };

    const handleReset = () => {
        setForm({
            title: '',
            year: '',
            duration: '',
            rating: '',
            description: '',
            imageUrl: '',
            ...initialData,
            genres: genresAsString,
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
                YEAR
                <input
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    required
                />
            </label>
            <label> DURATION <input name="duration" value={form.duration} onChange={handleChange} required /></label>
            <label> RATING <input name="rating" value={form.rating} onChange={handleChange} required /></label>
            <label> DESCRIPTION <input name="description" value={form.description} onChange={handleChange} required /></label>
            <label> GENRES <input name="genres" value={form.genres} onChange={handleChange} required /></label>
            <label> IMAGE URL <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required /></label>
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
