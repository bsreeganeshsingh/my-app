import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import MovieDetails from "./MovieDetails";


describe("MovieDetails Component", () => {
    const movie = {
        title: "Inception",
        vote_average: 8.8,
        duration: "2h 28m",
        release_date: "2010-10-12",
        genres: ["COMEDY", "DOCUMENTARY", "CRIME"],
        overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        poster_path: "https://filmartgallery.com/cdn/shop/files/Inception-Vintage-Movie-Poster-Original.jpg?v=1738912645",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders movie details correctly", () => {
        render(<MovieDetails movie={movie} />);
        expect(screen.getByText(movie.title)).toBeInTheDocument();
        expect(screen.getByText(String(movie.vote_average))).toBeInTheDocument();
        expect(screen.getByText(String(movie.release_date))).toBeInTheDocument();
        expect(screen.getByText(movie.duration)).toBeInTheDocument();
        expect(screen.getByText("COMEDY, DOCUMENTARY & CRIME")).toBeInTheDocument();
        expect(screen.getByText(movie.overview)).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
        const onClose = jest.fn();
        render(<MovieDetails movie={movie} onClose={onClose} />);
        fireEvent.click(screen.getByRole("button"));
        expect(onClose).toHaveBeenCalled();
    });

    it("displays the movie poster", () => {
        render(<MovieDetails movie={movie} />);
        const img = screen.getByAltText(movie.title);
        expect(img).toHaveAttribute("src", movie.poster_path);
    });

    it("handles missing description gracefully", () => {
        const movieWithoutDescription = { ...movie, overview: "" };
        render(<MovieDetails movie={movieWithoutDescription} />);
        expect(screen.queryByText(movie.overview)).not.toBeInTheDocument();
    });

    it("renders movie details correctly inside MemoryRouter", () => {
        render(
            <MovieDetails movie={movie} />
        );
        expect(screen.getByText(movie.title)).toBeInTheDocument();
        expect(screen.getByText(String(movie.vote_average))).toBeInTheDocument();
        expect(screen.getByText(String(movie.release_date))).toBeInTheDocument();
        expect(screen.getByText(movie.duration)).toBeInTheDocument();
        expect(screen.getByText("COMEDY, DOCUMENTARY & CRIME")).toBeInTheDocument();
        expect(screen.getByText(movie.overview)).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked inside MemoryRouter", () => {
        const onClose = jest.fn();
        render(
            < MovieDetails movie={movie} onClose={onClose} />
        );
        fireEvent.click(screen.getByRole("button"));
        expect(onClose).toHaveBeenCalled();
    });

    it("does not crash when onClose is not provided", () => {
        render(<MovieDetails movie={movie} />);
        fireEvent.click(screen.getByRole("button")); // Should not throw error
        expect(screen.getByRole("button")).toBeInTheDocument(); // Confirm button exists
    });
});