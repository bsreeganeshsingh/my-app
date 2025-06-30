import React, { useState } from 'react';
import { genres, sortOptions } from '../../utils/Constants';
import { movies } from '../../utils/movieList';
import Dialog from '../dialog/Dialog';
import GenreSelect from '../genreselect/GenreSelect';
import MovieDetails from '../moviedetails/MovieDetails';
import MovieForm from '../movieform/MovieForm';
import MovieTile from '../movietile/MovieTile';
import SearchForm from '../searchform/SearchForm';
import SortControl from '../sortcontrol/SortControl';
import styles from './Home.module.scss';

function Home() {
    const [movieList, setMovieList] = useState(movies);
    const [sortOrder, setSortOrder] = useState('title');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMovie, setEditMovie] = useState(null);
    const [wasEdit, setWasEdit] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);

    const handleSortChange = (sortOrder) => {
        setSortOrder(sortOrder);
        const sortedMovies = [...movieList].sort((a, b) => {
            if (sortOrder === 'title') {
                return a.title.localeCompare(b.title);
            } else {
                return parseInt(a.releaseDate.substring(0, 4)) - parseInt(b.releaseDate.substring(0, 4));
            }
        });
        setMovieList(sortedMovies);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    }

    const filteredMovies = movieList.filter(movie =>
        (!selectedGenre || selectedGenre.toLocaleLowerCase() === "all" ||
            (movie.genres?.some(genre => genre.toLowerCase() === selectedGenre.toLowerCase()))) &&
        (!searchQuery || movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleMovieSubmit = (movieData) => {
        if (editMovie) {
            const updatedMovie = { ...editMovie, ...movieData };

            setMovieList((prev) =>
                prev.map((m) => (m.id === editMovie.id ? updatedMovie : m))
            );

            if (selectedMovie && selectedMovie.id === editMovie.id) {
                setSelectedMovie(updatedMovie);
            }
            setWasEdit(true);
        } else {
            const newMovie = {
                id: Date.now(),
                ...movieData,
            };
            setMovieList((prev) => [...prev, newMovie]);
            setWasEdit(false);
        }
        setDialogOpen(false);
        setEditMovie(null);

        // Show success dialog
        setSuccessDialogOpen(true);
        setTimeout(() => {
            setSuccessDialogOpen(false);
        }, 3000);
    };

    const handleDeleteMovie = () => {
        setMovieList((prev) => prev.filter((m) => m.id !== movieToDelete.id));

        if (selectedMovie && selectedMovie.id === movieToDelete.id) {
            setSelectedMovie(null);
        }

        setMovieToDelete(null);
    };

    return (
        <div className={styles.home}>
            {!selectedMovie && (
                <>
                    <div className={styles.searchSection}>
                        <div className={styles.header}>
                            <div className={styles.logo}>netflix<span>roulette</span></div>
                            <button onClick={() => setDialogOpen(true)} className={styles.addBtn}>+ ADD MOVIE</button>
                        </div>
                        <SearchForm initialQuery="" onSearch={(query) => handleSearch(query)} />
                    </div>
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
                    <MovieTile key={movie.id}
                        movie={movie}
                        onClick={() => setSelectedMovie(movie)}
                        onEdit={(movie) => {
                            setEditMovie(movie);
                            setDialogOpen(true);
                        }}
                        onDelete={(movie) => {
                            setMovieToDelete(movie);
                        }}
                    />
                ))}
            </div>
            {dialogOpen && (
                <Dialog
                    title={editMovie ? 'EDIT MOVIE' : 'ADD MOVIE'}
                    onClose={() => {
                        setDialogOpen(false);
                        setEditMovie(null);
                    }}
                >
                    <MovieForm initialData={editMovie} onSubmit={handleMovieSubmit} />
                </Dialog>
            )}
            {movieToDelete && (
                <Dialog onClose={() => setMovieToDelete(false)}>
                    <div className={styles.deleteDialog}>
                        <div><h2>DELETE MOVIE</h2></div>
                        <div>Are you sure you want to delete '{movieToDelete.title}' movie?</div>
                        <button className={styles.confirmButton} onClick={handleDeleteMovie}>CONFIRM</button>
                    </div>
                </Dialog>
            )}
            {successDialogOpen && (
                <Dialog onClose={() => setSuccessDialogOpen(false)}>
                    <div className={styles.successMessage}>
                        <div className={styles.tickMark}>✓</div>
                        <h2>Congratulations!</h2>
                        <p>The movie has been {wasEdit ? 'updated' : 'added'} to database successfully.</p>
                    </div>
                </Dialog>
            )}
        </div >
    );
}

export default Home;