import React from 'react';
import Counter from './components/counter/Counter';
import SearchForm from './components/searchform/SearchForm';
import GenreSelect from './components/genreselect/GenreSelect';
import './App.css';

function App() {
  const [selectedGenre, setSelectedGenre] = React.useState('Action');
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Components Example</h1>
        <h3>Counter Component</h3>
        <Counter initialValue={10} />
        <h3>Search Form Component</h3>
        <SearchForm initialQuery="Tare Zameen Par" />
        <h3>Genre Select Component</h3>
        <GenreSelect
          genres={genres}
          selectedGenre={selectedGenre}
          onSelect={setSelectedGenre}
        />
        <div className="container">
          <p>Selected Genre: {selectedGenre}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
