import './Components.css';

function GenreSelect({ genres, selectedGenre, onSelect }) {

  const handleSelect = (genre) => {
    onSelect(genre);
    window.alert(`Genre selected: ${genre}`);
  };

  return (
    <div className="container">
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