import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AddMovieForm from "./AddMovieForm";
import "@testing-library/jest-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAddMovie } from "../../hooks/useaddmovie/useAddMovie";

// Mocks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}));

jest.mock("../../hooks/useaddmovie/useAddMovie", () => ({
  useAddMovie: jest.fn(),
}));

jest.mock("../dialog/Dialog", () => ({ title, children, onClose }) => (
  <div data-testid="dialog">
    {title && <h1>{title}</h1>}
    <button onClick={onClose}>Close</button>
    {children}
  </div>
));

jest.mock("../movieform/MovieForm", () => ({ onSubmit }) => (
  <div>
    <button onClick={() => onSubmit({ title: "Test Movie" })}>
      Submit Movie
    </button>
  </div>
));

describe("AddMovieForm", () => {
  const navigateMock = jest.fn();
  const invalidateQueriesMock = jest.fn();
  let mutateFn;

  beforeEach(() => {
    jest.useFakeTimers();
    useNavigate.mockReturnValue(navigateMock);
    useQueryClient.mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    });

    mutateFn = jest.fn();
    useAddMovie.mockReturnValue({ mutate: mutateFn });

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the MovieForm initially", () => {
    useLocation.mockReturnValue({ search: "?sort=release_date" });

    render(<AddMovieForm />);
    expect(screen.getByText("ADD MOVIE")).toBeInTheDocument();
    expect(screen.getByText("Submit Movie")).toBeInTheDocument();
  });

  it("calls mutate and shows success dialog on success", () => {
    useLocation.mockReturnValue({ search: "?sort=release_date" });
    render(<AddMovieForm />);

    fireEvent.click(screen.getByText("Submit Movie"));

    const [, { onSuccess }] = mutateFn.mock.calls[0];

    act(() => {
      onSuccess();
    });

    expect(screen.getByText("Congratulations!")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(navigateMock).toHaveBeenCalledWith("/?sort=release_date");
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ["movies"],
    });
  });

  it("handles error during movie add", () => {
    useLocation.mockReturnValue({ search: "?sort=release_date" });
    const error = new Error("API failed");
    console.error = jest.fn();

    render(<AddMovieForm />);
    fireEvent.click(screen.getByText("Submit Movie"));

    const [, { onError }] = mutateFn.mock.calls[0];

    act(() => {
      onError(error);
    });

    expect(console.error).toHaveBeenCalledWith("Failed to add movie:", error);
  });

  it("closes the success dialog manually", () => {
    useLocation.mockReturnValue({ search: "?sort=release_date" });

    render(<AddMovieForm />);
    fireEvent.click(screen.getByText("Submit Movie"));

    const [, { onSuccess }] = mutateFn.mock.calls[0];
    act(() => {
      onSuccess();
    });

    expect(screen.getByText("Congratulations!")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
  });

  it("closes the form dialog via onClose", () => {
    useLocation.mockReturnValue({ search: "?sort=release_date" });

    render(<AddMovieForm />);
    fireEvent.click(screen.getByText("Close"));

    expect(navigateMock).toHaveBeenCalledWith("/?sort=release_date");
  });

  it("navigates correctly with empty searchParams", () => {
    useLocation.mockReturnValue({ search: "" });

    render(<AddMovieForm />);
    fireEvent.click(screen.getByText("Close"));

    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
