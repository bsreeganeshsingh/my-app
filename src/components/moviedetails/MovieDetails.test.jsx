import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import MovieDetails from "./MovieDetails";


describe("MovieDetails Component", () => {
    const movie = {
        title: "Inception",
        rating: 8.8,
        duration: "2h 28m",
        year: 2010,
        genres: ["Action", "Sci-Fi", "Adventure"],
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        imageUrl: "https://filmartgallery.com/cdn/shop/files/Inception-Vintage-Movie-Poster-Original.jpg?v=1738912645",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders movie details correctly", () => {
        render(<MovieDetails movie={movie} />);
        expect(screen.getByText(movie.title)).toBeInTheDocument();
        expect(screen.getByText(String(movie.rating))).toBeInTheDocument();
        expect(screen.getByText(String(movie.year))).toBeInTheDocument();
        expect(screen.getByText(movie.duration)).toBeInTheDocument();
        expect(screen.getByText(movie.genres.join(", "))).toBeInTheDocument();
        expect(screen.getByText(movie.description)).toBeInTheDocument();
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
        expect(img).toHaveAttribute("src", movie.imageUrl);
    });

    it("handles missing description gracefully", () => {
        const movieWithoutDescription = { ...movie, description: "" };
        render(<MovieDetails movie={movieWithoutDescription} />);
        expect(screen.queryByText(movie.description)).not.toBeInTheDocument();
    });

    it("renders movie details correctly inside MemoryRouter", () => {
        render(
            <MovieDetails movie={movie} />
        );
        expect(screen.getByText(movie.title)).toBeInTheDocument();
        expect(screen.getByText(String(movie.rating))).toBeInTheDocument();
        expect(screen.getByText(String(movie.year))).toBeInTheDocument();
        expect(screen.getByText(movie.duration)).toBeInTheDocument();
        expect(screen.getByText(movie.genres.join(", "))).toBeInTheDocument();
        expect(screen.getByText(movie.description)).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked inside MemoryRouter", () => {
        const onClose = jest.fn();
        render(
            < MovieDetails movie={movie} onClose={onClose} />
        );
        fireEvent.click(screen.getByRole("button"));
        expect(onClose).toHaveBeenCalled();
    });
});