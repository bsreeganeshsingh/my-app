import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import MovieDetails from "./MovieDetails";

describe("MovieDetails Component", () => {
    beforeAll(() => {
        window.alert = jest.fn();
    });

    const movie = {
        title: "Inception",
        rating: 8.8,
        duration: "2h 28m",
        year: 2010,
        genres: ["Action", "Sci-Fi", "Adventure"],
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        imageUrl: "https://filmartgallery.com/cdn/shop/files/Inception-Vintage-Movie-Poster-Original.jpg?v=1738912645",
    };

    it("renders movie details correctly", () => {
        render(<MovieDetails movie={movie} />);

        expect(screen.getByText(movie.title)).toBeInTheDocument();
        expect(screen.getByText(movie.rating)).toBeInTheDocument();
        expect(screen.getByText(movie.year)).toBeInTheDocument();
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

    it("calls window.alert when close button is clicked", () => {
        render(<MovieDetails movie={movie} />);

        fireEvent.click(screen.getByRole("button"));

        expect(window.alert).toHaveBeenCalledWith("'Inception' is closed.");
    });

    it("does not crash when onClose is not provided", () => {
        render(<MovieDetails movie={movie} />);

        fireEvent.click(screen.getByRole("button"));

        expect(window.alert).toHaveBeenCalledWith("'Inception' is closed.");
    });
});