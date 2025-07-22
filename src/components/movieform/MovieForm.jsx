import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { genres as genreOptions } from "../../utils/Constants";
import styles from "./MovieForm.module.scss";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  tagline: Yup.string().required("Tagline is required"),
  release_date: Yup.string().required("Release date is required"),
  runtime: Yup.number()
    .typeError("Must be a number")
    .required("Runtime is required"),
  vote_average: Yup.number()
    .typeError("Must be a number")
    .required("Rating is required"),
  budget: Yup.number()
    .typeError("Must be a number")
    .required("Budget is required"),
  overview: Yup.string().required("Description is required"),
  poster_path: Yup.string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
  genres: Yup.array().min(1, "Select at least one genre"),
});

const MovieForm = ({ initialData = {}, onSubmit, onReset }) => {
  const genresAsArray = Array.isArray(initialData?.genres)
    ? initialData.genres
    : (initialData?.genres || "")
        .split(", ")
        .map((g) => g.trim())
        .filter(Boolean);

  const [isGenreDropdownOpen, setGenreDropdownOpen] = useState(false);

  const initialValues = {
    title: "",
    tagline: "",
    release_date: "",
    runtime: "",
    vote_average: "",
    budget: "",
    overview: "",
    poster_path: "",
    genres: genresAsArray,
    ...initialData,
  };

  const toggleGenre = (genre, values, setFieldValue) => {
    const genres = values.genres.includes(genre)
      ? values.genres.filter((g) => g !== genre)
      : [...values.genres, genre];

    setFieldValue("genres", genres);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        const prepared = {
          ...values,
          vote_average: parseFloat(values.vote_average),
          runtime: parseInt(values.runtime, 10),
          budget: parseInt(values.budget, 10),
        };
        onSubmit(prepared);
        resetForm();
      }}
      onReset={() => {
        if (onReset) onReset();
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className={styles.form}>
          <label>
            TITLE
            <Field name="title" />
            <ErrorMessage
              name="title"
              component="div"
              className={styles.error}
            />
          </label>

          <label>
            RELEASE DATE
            <Field name="release_date" type="date" />
            <ErrorMessage
              name="release_date"
              component="div"
              className={styles.error}
            />
          </label>

          <label>
            TAGLINE
            <Field name="tagline" />
            <ErrorMessage
              name="tagline"
              component="div"
              className={styles.error}
            />
          </label>

          <label>
            RATING
            <Field name="vote_average" type="number" step="0.1" />
            <ErrorMessage
              name="vote_average"
              component="div"
              className={styles.error}
            />
          </label>

          <label>
            IMAGE URL
            <Field name="poster_path" />
            <ErrorMessage
              name="poster_path"
              component="div"
              className={styles.error}
            />
          </label>

          <label>
            DURATION
            <Field name="runtime" type="number" />
            <ErrorMessage
              name="runtime"
              component="div"
              className={styles.error}
            />
          </label>

          <div className={styles.genreField}>
            <label>GENRES</label>
            <div className={styles.dropdownContainer}>
              <div
                className={styles.dropdownHeader}
                data-testid="genre-dropdown-header"
                onClick={(e) => {
                  e.stopPropagation();
                  setGenreDropdownOpen((prev) => !prev);
                }}
              >
                {values.genres.length > 0
                  ? values.genres.join(", ")
                  : "Select Genre"}
              </div>
              {isGenreDropdownOpen && (
                <div className={styles.dropdownList}>
                  {genreOptions
                    .filter((g) => g !== "ALL")
                    .map((genre) => (
                      <label key={genre} className={styles.dropdownItem}>
                        <input
                          type="checkbox"
                          data-testid={`genre-${genre}`}
                          checked={values.genres.includes(genre)}
                          onChange={() =>
                            toggleGenre(genre, values, setFieldValue)
                          }
                        />
                        <span>{genre}</span>
                      </label>
                    ))}
                </div>
              )}
              <ErrorMessage
                name="genres"
                component="div"
                className={styles.error}
              />
            </div>
          </div>

          <label>
            BUDGET
            <Field name="budget" type="number" />
            <ErrorMessage
              name="budget"
              component="div"
              className={styles.error}
            />
          </label>

          <label>
            DESCRIPTION
            <Field name="overview" as="textarea" />
            <ErrorMessage
              name="overview"
              component="div"
              className={styles.error}
            />
          </label>

          <div className={styles.buttonGroup}>
            <button type="reset">RESET</button>
            <button type="submit">SUBMIT</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

MovieForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func,
};

export default MovieForm;
