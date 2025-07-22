import React, { useState } from "react";
import { genres, sortOptions } from "../../utils/Constants";
import { useDeleteMovie } from "../../hooks/usedeletemovie/useDeleteMovie";
import { useMovies } from "../../hooks/usemovies/useMovies";
import {
  useNavigate,
  useParams,
  useSearchParams,
  Outlet,
} from "react-router-dom";
import Dialog from "../dialog/Dialog";
import GenreSelect from "../genreselect/GenreSelect";
import MovieTile from "../movietile/MovieTile";
import SortControl from "../sortcontrol/SortControl";
import styles from "./MovieListPage.module.scss";
import { useQueryClient } from "@tanstack/react-query";

function MovieListPage() {
  const [movieToDelete, setMovieToDelete] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { movieId } = useParams();

  const searchQuery = searchParams.get("query") ?? "A";
  const selectedGenre = searchParams.get("genre") ?? "ALL";
  const sortBy = searchParams.get("sortBy") ?? "title";
  const sortOrder = searchParams.get("sortOrder") ?? "asc";

  // delete movuie hook
  const deleteMovieMutation = useDeleteMovie();

  // movies list from useMovies hook.
  const { data, isLoading, isError } = useMovies({
    search: searchQuery,
    genre: selectedGenre === "ALL" ? "" : selectedGenre,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });
  const movieList = data?.movies || [];

  const handleSearch = (query) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("query", query);
      return newParams;
    });
  };

  const handleSortChange = (by) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sortBy", by);
      return newParams;
    });
  };

  const handleDeleteMovie = () => {
    deleteMovieMutation.mutate(movieToDelete.id, {
      onSuccess: () => {
        // Remove the deleted movie from the query cache
        queryClient.removeQueries(["movie", movieToDelete.id]);

        // Invalidate movie list (to refetch updated list)
        queryClient.invalidateQueries({ queryKey: ["movies"] });

        // Navigate away if user is viewing this movie
        navigate("/", { replace: true });

        setMovieToDelete(null);
      },
      onError: (error) => {
        setMovieToDelete(null);
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Movies not found</div>;

  return (
    <div className={styles.home}>
      {!movieId && (
        <div className={styles.searchSection}>
          <div className={styles.header}>
            <div className={styles.logo}>
              netflix<span>roulette</span>
            </div>
            <button
              onClick={() => navigate(`/new?${searchParams.toString()}`)}
              className={styles.addBtn}
            >
              + ADD MOVIE
            </button>
          </div>
          <Outlet context={{ handleSearch }} />
        </div>
      )}
      {movieId && <Outlet />}
      <div className={styles.controlsRow}>
        <GenreSelect
          genres={genres}
          selectedGenre={selectedGenre}
          onSelect={(genre) => {
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev);
              newParams.set("genre", genre);
              return newParams;
            });
          }}
        />
        <SortControl
          sortOptions={sortOptions}
          selected={sortBy}
          onSortChange={handleSortChange}
        />
      </div>
      <div className={styles.movieGrid}>
        {Array.isArray(movieList) && movieList.length > 0 ? (
          movieList.map((movie) => (
            <MovieTile
              key={movie.id}
              movie={movie}
              onClick={() =>
                navigate(`/${movie.id}?${searchParams.toString()}`)
              }
              onEdit={(movie) => {
                navigate(`/${movie.id}/edit?${searchParams.toString()}`);
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
      {movieToDelete && (
        <Dialog onClose={() => setMovieToDelete(null)}>
          <div className={styles.deleteDialog}>
            <div>
              <h2>DELETE MOVIE</h2>
            </div>
            <div>
              Are you sure you want to delete '{movieToDelete.title}' movie?
            </div>
            <button
              className={styles.confirmButton}
              onClick={handleDeleteMovie}
            >
              CONFIRM
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default MovieListPage;
