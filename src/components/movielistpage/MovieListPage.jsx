import React, { useState } from 'react';
import { genres, sortOptions } from '../../utils/Constants';
import { useAddMovie } from '../../hooks/useaddmovie/useAddMovie';
import { useDeleteMovie } from '../../hooks/usedeletemovie/useDeleteMovie'
import { useEditMovie } from '../../hooks/useeditmovie/useEditMovie';
import { useMovies } from '../../hooks/usemovies/useMovies';
import Dialog from '../dialog/Dialog';
import GenreSelect from '../genreselect/GenreSelect';
import MovieDetails from '../moviedetails/MovieDetails';
import MovieForm from '../movieform/MovieForm';
import MovieTile from '../movietile/MovieTile';
import SearchForm from '../searchform/SearchForm';
import SortControl from '../sortcontrol/SortControl';
import styles from './MovieListPage.module.scss';

function MovieListPage() {
    const [sortBy, setSortBy] = useState('title');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('A');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMovie, setEditMovie] = useState(null);
    const [wasEdit, setWasEdit] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);

    // add movie hook
    const addMovieMutation = useAddMovie();

    // edit movie hook
    const editMovieMutation = useEditMovie();

    // delete movuie hook
    const deleteMovieMutation = useDeleteMovie();

    // movies list from useMovies hook.
    const { data, isLoading, isError } = useMovies({
        search: searchQuery,
        genre: selectedGenre === 'ALL' ? '' : selectedGenre,
        sortBy: sortBy,
    });
    const movieList = data?.movies || [];

    const handleSearch = (query) => {
        setSearchQuery(query);
    }

    const handleSortChange = (by) => {
        setSortBy(by);
    };

    const handleMovieSubmit = (movieData) => {
        if (editMovie) {
            const updatedMovie = { ...editMovie, ...movieData };

            editMovieMutation.mutate(updatedMovie, {
                onSuccess: () => {
                    if (selectedMovie && selectedMovie.id === editMovie.id) {
                        setSelectedMovie(updatedMovie);
                    }
                    setWasEdit(true);
                    setDialogOpen(false);
                    setEditMovie(null);
                    setSuccessDialogOpen(true);
                    setTimeout(() => setSuccessDialogOpen(false), 3000);
                },
                onError: (error) => {
                    console.error('Failed to update movie:', error);
                }
            });
        } else {
            addMovieMutation.mutate(movieData, {
                onSuccess: () => {
                    setWasEdit(false);
                    setDialogOpen(false);
                    setEditMovie(null);
                    setSuccessDialogOpen(true);
                    setTimeout(() => setSuccessDialogOpen(false), 3000);
                },
                onError: (error) => {
                    console.error('Failed to add movie:', error);
                }
            });
        }
    };

    const handleDeleteMovie = () => {

        if (!movieToDelete) return;

        deleteMovieMutation.mutate(movieToDelete.id, {
            onSuccess: () => {
                if (selectedMovie && selectedMovie.id === movieToDelete.id) {
                    setSelectedMovie(null);
                }
                setMovieToDelete(null);
            },
            onError: (error) => {
                setMovieToDelete(null);
            }
        })
    };

    return (
        <div className={styles.home}>
            {!selectedMovie && (
                <>
                    <div className={styles.searchSection}>
                        <div className={styles.header}>
                            <div className={styles.logo}>netflix<span>roulette</span></div>
                            <button
                                onClick={() => setDialogOpen(true)}
                                className={styles.addBtn}
                                disabled={addMovieMutation.isLoading}
                            >
                                {addMovieMutation.isLoading ? 'Adding...' : '+ ADD MOVIE'}
                            </button>
                        </div>
                        <SearchForm initialQuery="" onSearch={(query) => handleSearch(query)} />
                    </div>
                    <div className={styles.controlsRow}>
                        <GenreSelect
                            genres={genres}
                            selectedGenre={selectedGenre}
                            onSelect={setSelectedGenre}
                        />
                        <SortControl sortOptions={sortOptions} selected={sortBy} onSortChange={handleSortChange} />
                    </div>
                </>
            )}
            {selectedMovie && (<MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />)}
            <div className={styles.movieGrid}>
                {Array.isArray(movieList) && movieList.length > 0 ? (
                    movieList.map(movie => (
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
                    ))
                ) : (
                    <p>No movies found.</p>
                )}
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

export default MovieListPage;