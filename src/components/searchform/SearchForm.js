import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm({ initialQuery = '', onSearch }) {
  const [query, setQuery] = useState(initialQuery);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const triggerSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  return (
    <div className="container">
      <input
        type="text"
        className="search-input"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter search query"
      /><button className="search-button" onClick={triggerSearch} aria-label="Search">
        Search
      </button>
    </div>
  );
}

export default SearchForm;
