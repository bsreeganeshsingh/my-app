import React from 'react';
import styles from './GenreSelect.module.scss';

function GenreSelect({ genres, selectedGenre, onSelect }) {
  const handleSelect = (genre) => {
    onSelect?.(genre);
  };

  return (
    <div className={styles.genreSelectRow}>
      {genres.map((genre) => (
        <button
          key={genre}
          className={`${styles.button} ${genre === selectedGenre ? styles.selected : ''
            }`}
          onClick={() => handleSelect(genre)}
        >
          {genre}
          {genre === selectedGenre && <div className={styles.underline} />}
        </button>
      ))}
    </div>
  );
}

export default GenreSelect;
