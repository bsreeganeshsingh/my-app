import React, { useState } from 'react';
import styles from './SearchForm.module.scss';

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
    <div className={styles.container}>
      <h1 className={styles.searchTitle}>FIND YOUR MOVIE</h1>
      <div className={styles.searchForm}>
        <input
          type="text"
          className={styles.searchInput}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to watch?"
        />
        <button
          className={styles.searchButton}
          onClick={triggerSearch}
          aria-label="Search"
        >
          SEARCH
        </button>
      </div>
    </div>
  );
}

export default SearchForm;
