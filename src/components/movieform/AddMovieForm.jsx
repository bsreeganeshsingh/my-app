import React, { useState } from "react";
import Dialog from "../dialog/Dialog";
import MovieForm from "../movieform/MovieForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAddMovie } from "../../hooks/useaddmovie/useAddMovie";
import styles from "./MovieForm.module.scss";

const AddMovieForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const addMovieMutation = useAddMovie();

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const searchParams = location.search;

  const handleSubmit = (movieData) => {
    addMovieMutation.mutate(movieData, {
      onSuccess: () => {
        setSuccessDialogOpen(true);
        setTimeout(() => {
          setSuccessDialogOpen(false);
          navigate(`/${searchParams}`);
        }, 3000);

        queryClient.invalidateQueries({ queryKey: ["movies"] });
      },
      onError: (error) => {
        console.error("Failed to add movie:", error);
      },
    });
  };

  const handleClose = () => navigate(`/${searchParams}`);

  return successDialogOpen ? (
    <Dialog onClose={() => setSuccessDialogOpen(false)}>
      <div className={styles.successMessage}>
        <div className={styles.tickMark}>✓</div>
        <h2>Congratulations!</h2>
        <p>The movie has been added to database successfully.</p>
      </div>
    </Dialog>
  ) : (
    <Dialog title="ADD MOVIE" onClose={handleClose}>
      <MovieForm onSubmit={handleSubmit} />
    </Dialog>
  );
};

export default AddMovieForm;
