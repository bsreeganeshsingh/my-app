import React from 'react';
import Counter from './components/Counter';
import SearchForm from './components/SearchForm';
import GenreSelect from './components/GenreSelect';
import './App.css';

function App() {
  const [selectedGenre, setSelectedGenre] = React.useState('Action');
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

  const handleSearch = (query) => {
    alert(`Search triggered for: ${query}`);
  };

  const handleGenreSelect = (genre) => {
    alert(`Genre selected: ${genre}`);
    setSelectedGenre(genre);
  };

  return (
    <div className="App">
      <h1>React Components Example</h1>
      <hr/>
      <h2>Counter Component</h2>
      <Counter initialValue={10} />
      <hr/>
      <h2>Search Form Component</h2>
      <SearchForm initialQuery="Tare Jameen Par" onSearch={handleSearch} /> 
      <hr/>
      <h2>Genre Select Component</h2>
      <GenreSelect
        genres={genres}
        selectedGenre={selectedGenre}
        onSelect={handleGenreSelect}
      />
      <div className="container">
        <p>Selected Genre: {selectedGenre}</p>
      </div>
    </div>
  );
}

export default App;
