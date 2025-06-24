import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import MovieTile from "./MovieTile";

describe("MovieTile Component", () => {
    beforeAll(() => {
        window.alert = jest.fn();
    });

    const movie = {
        title: "Inception",
        duration: "2h 28m",
        releaseDate: "2010-03-24",
        genres: ["ACTION", "SCI-FI", "ADVENTURE"],
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        imageUrl: "https://filmartgallery.com/cdn/shop/files/Inception-Vintage-Movie-Poster-Original.jpg?v=1738912645",
    };

    it("renders movie tile correctly", () => {
        render(<MovieTile movie={movie} />);

        expect(screen.getByText(movie.title)).toBeInTheDocument();
        expect(screen.getByText(movie.releaseDate.substring(0, 4))).toBeInTheDocument();
        expect(screen.getByText(movie.genres.join(", "))).toBeInTheDocument();
    });

    it("displays the movie poster", () => {
        render(<MovieTile movie={movie} />);

        const img = screen.getByAltText(movie.title);
        expect(img).toHaveAttribute("src", movie.imageUrl);
    });

    it("calls onClick when movie tile is clicked", () => {
        const onClick = jest.fn();
        render(<MovieTile movie={movie} onClick={onClick} />);

        fireEvent.click(screen.getByTestId("movie-tile"));

        expect(onClick).toHaveBeenCalled();
    });

    it("toggles menu visibility when menu icon is clicked", () => {
        render(<MovieTile movie={movie} />);

        const menuIcon = screen.getByText("⋮");
        fireEvent.click(menuIcon);

        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();

        fireEvent.click(menuIcon); // Close the menu
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    });

    it("calls onEdit when Edit is clicked", () => {
        const onEdit = jest.fn();
        render(<MovieTile movie={movie} onEdit={onEdit} />);

        fireEvent.click(screen.getByText("⋮"));
        fireEvent.click(screen.getByText("Edit"));

        expect(onEdit).toHaveBeenCalledWith(movie);
    });

    it("calls onDelete when Delete is clicked", () => {
        const onDelete = jest.fn();
        render(<MovieTile movie={movie} onDelete={onDelete} />);

        fireEvent.click(screen.getByText("⋮"));
        fireEvent.click(screen.getByText("Delete"));

        expect(onDelete).toHaveBeenCalledWith(movie);
    });

    it("does not crash when onClick, onEdit, or onDelete are not provided", () => {
        render(<MovieTile movie={movie} />);

        expect(() => {
            fireEvent.click(screen.getByTestId("movie-tile"));
        }).not.toThrow();
    });

    it("does not crash when menu icon is clicked without onEdit or onDelete", () => {
        render(<MovieTile movie={movie} />);

        fireEvent.click(screen.getByText("⋮"));

        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });
});