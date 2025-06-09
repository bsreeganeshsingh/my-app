import React from 'react';
import './Components.css';

function GenreSelect({ genres, selectedGenre, onSelect }) {
  return (
    <div className="container">
      {genres.map((genre) => (
        <button
          key={genre}
          className={`button ${genre === selectedGenre ? 'selected' : ''}`}
          onClick={() => onSelect(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreSelect;