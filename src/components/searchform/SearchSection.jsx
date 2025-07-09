import React from 'react';
import SearchForm from './SearchForm';
import { useOutletContext } from 'react-router-dom';

function SearchSection() {
    const { handleSearch } = useOutletContext();

    return <SearchForm initialQuery="" onSearch={handleSearch} />;
}

export default SearchSection;