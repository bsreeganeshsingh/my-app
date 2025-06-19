import React, { useState } from 'react';
import MovieTile from '../movietile/MovieTile';
import SortControl from '../sortcontrol/SortControl';
import GenreSelect from '../genreselect/GenreSelect';
import SearchForm from '../searchform/SearchForm';
import MovieDetails from '../moviedetails/MovieDetails';
import { movies } from '../../utils/movieList';
import { genres, sortOptions } from '../../utils/Constants';
import styles from './Home.module.scss';

function Home() {
    const [movieList, setMovieList] = useState(movies);
    const [sortOrder, setSortOrder] = useState('title');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('Action');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSortChange = (sortOrder) => {
        setSortOrder(sortOrder);
        const sortedMovies = [...movieList].sort((a, b) => {
            if (sortOrder === 'title') {
                return a.title.localeCompare(b.title);
            } else {
                return a.year - b.year;
            }
        });
        setMovieList(sortedMovies);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    }

    const filteredMovies = movieList.filter(movie =>
        (!selectedGenre || (movie.genres && movie.genres.includes(selectedGenre))) &&
        (!searchQuery || movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className={styles.home}>
            {!selectedMovie && (
                <>
                    <SearchForm initialQuery="" onSearch={(query) => handleSearch(query)} />
                    <div className={styles.controlsRow}>
                        <GenreSelect
                            genres={genres}
                            selectedGenre={selectedGenre}
                            onSelect={setSelectedGenre}
                        />
                        <SortControl sortOptions={sortOptions} selected={sortOrder} onSortChange={handleSortChange} />
                    </div>
                </>
            )}
            {selectedMovie && (<MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />)}
            <div className={styles.movieGrid}>
                {filteredMovies.map(movie => (
                    <MovieTile key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
                ))}
            </div>
        </div>
    );
}

export default Home;