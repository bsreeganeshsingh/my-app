import React, { useState } from 'react';
import './Components.css';

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
    <div className="search-form-container">
      <input
        type="text"
        className="search-input"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter search query"
      />
      <button className="button" onClick={triggerSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchForm;
