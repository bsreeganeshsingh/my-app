import React from 'react';
import Counter from './Counter';
import SearchForm from './SearchForm';
import GenreSelect from './GenreSelect';
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

  return React.createElement('div', { className: 'App' },
    React.createElement('header', { className: 'App-header' },
      React.createElement('h1', null, 'Welcome to the Core Concepts Demo App'),
      React.createElement(Counter, { initialValue: 5 }),
      React.createElement(SearchForm, { initialQuery: 'Tare Jameen Par', onSearch: handleSearch }),
      React.createElement(GenreSelect, {
        genres: genres,
        selectedGenre: selectedGenre,
        onSelect: handleGenreSelect
      })
    )
  );
}

export default App;
