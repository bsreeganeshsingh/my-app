import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import EditMovieForm from "./EditMovieForm";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useEditMovie } from "../../hooks/useeditmovie/useEditMovie";
import { useMovies } from "../../hooks/usemovies/useMovies";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}));

jest.mock("../../hooks/useeditmovie/useEditMovie", () => ({
  useEditMovie: jest.fn(),
}));

jest.mock("../../hooks/usemovies/useMovies", () => ({
  useMovies: jest.fn(),
}));

jest.mock("../dialog/Dialog", () => ({ title, onClose, children }) => (
  <div data-testid="dialog">
    <h1>{title}</h1>
    <button onClick={onClose}>Close</button>
    {children}
  </div>
));

jest.mock("../movieform/MovieForm", () => ({ initialData, onSubmit }) => (
  <div data-testid="movie-form">
    <p>{initialData?.title}</p>
    <button onClick={() => onSubmit({ title: "Updated Title" })}>Submit</button>
  </div>
));

describe("EditMovieForm", () => {
  const navigateMock = jest.fn();
  const invalidateQueriesMock = jest.fn();
  const mutateMock = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
    useLocation.mockReturnValue({ search: "?sort=rating" });
    useQueryClient.mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });
    useEditMovie.mockReturnValue({ mutate: mutateMock });

    jest.clearAllMocks();
  });

  it("returns null when movie not found", () => {
    useParams.mockReturnValue({ movieId: "99" });
    useMovies.mockReturnValue({
      data: { movies: [{ id: 1, title: "Inception" }] },
    });

    const { container } = render(<EditMovieForm />);
    expect(container.firstChild).toBeNull();
  });

  it("renders MovieForm when initialMovie is found", () => {
    useParams.mockReturnValue({ movieId: "1" });
    useMovies.mockReturnValue({
      data: { movies: [{ id: 1, title: "Inception" }] },
    });

    render(<EditMovieForm />);
    expect(screen.getByText("EDIT MOVIE")).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByTestId("movie-form")).toBeInTheDocument();
  });

  it("submits updated movie data on form submit", () => {
    useParams.mockReturnValue({ movieId: "1" });
    useMovies.mockReturnValue({
      data: { movies: [{ id: 1, title: "Inception", genre: "Sci-Fi" }] },
    });

    render(<EditMovieForm />);

    fireEvent.click(screen.getByText("Submit"));

    const expectedData = {
      id: 1,
      title: "Updated Title",
      genre: "Sci-Fi",
    };

    const [, { onSuccess }] = mutateMock.mock.calls[0];
    expect(mutateMock).toHaveBeenCalledWith(expectedData, expect.any(Object));

    act(() => {
      onSuccess();
    });

    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ["movies"],
    });
    expect(navigateMock).toHaveBeenCalledWith("/?sort=rating");
  });

  it("handles error during mutation", () => {
    console.error = jest.fn();

    useParams.mockReturnValue({ movieId: "1" });
    useMovies.mockReturnValue({
      data: { movies: [{ id: 1, title: "Inception", genre: "Sci-Fi" }] },
    });

    render(<EditMovieForm />);
    fireEvent.click(screen.getByText("Submit"));

    const error = new Error("Update failed");
    const [, { onError }] = mutateMock.mock.calls[0];

    act(() => {
      onError(error);
    });

    expect(console.error).toHaveBeenCalledWith(
      "Failed to update movie:",
      error
    );
  });

  it("calls onClose when dialog is closed", () => {
    useParams.mockReturnValue({ movieId: "1" });
    useMovies.mockReturnValue({
      data: { movies: [{ id: 1, title: "Inception" }] },
    });

    render(<EditMovieForm />);
    fireEvent.click(screen.getByText("Close"));

    expect(navigateMock).toHaveBeenCalledWith("/?sort=rating");
  });
});
