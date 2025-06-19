import React from 'react';
import './GenreSelect.css';

function GenreSelect({ genres = [], selectedGenre, onSelect }) {

  const handleSelect = (genre) => {
    if (typeof onSelect === 'function') {
      onSelect(genre === selectedGenre ? null : genre);
    }
  };

  return (
    <div className="genreSelectRow">
      {genres.map((genre) => (
        <button
          key={genre}
          className={`button ${genre === selectedGenre ? 'selected' : ''}`}
          onClick={() => handleSelect(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreSelect;