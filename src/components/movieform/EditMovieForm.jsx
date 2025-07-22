import React from "react";
import Dialog from "../dialog/Dialog";
import MovieForm from "../movieform/MovieForm";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useEditMovie } from "../../hooks/useeditmovie/useEditMovie";
import { useMovies } from "../../hooks/usemovies/useMovies";

const EditMovieForm = () => {
  const { movieId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const editMovieMutation = useEditMovie();

  const searchParams = location.search;

  const { data } = useMovies({});
  const initialMovie = data?.movies?.find((m) => m.id === Number(movieId));

  const handleSubmit = (movieData) => {
    const updatedMovie = { ...initialMovie, ...movieData };
    editMovieMutation.mutate(updatedMovie, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["movies"] });
        navigate(`/${searchParams}`);
      },
      onError: (error) => {
        console.error("Failed to update movie:", error);
      },
    });
  };

  const handleClose = () => navigate(`/${searchParams}`);

  if (!initialMovie) return null;

  return (
    <Dialog title="EDIT MOVIE" onClose={handleClose}>
      <MovieForm initialData={initialMovie} onSubmit={handleSubmit} />
    </Dialog>
  );
};

export default EditMovieForm;
