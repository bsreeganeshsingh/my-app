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
        year: 2010,
        genres: ["Action", "Sci-Fi", "Adventure"],
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        imageUrl: "https://filmartgallery.com/cdn/shop/files/Inception-Vintage-Movie-Poster-Original.jpg?v=1738912645",
    };

    it("renders movie tile correctly", () => {
        render(<MovieTile movie={movie} />);

        expect(screen.getByText(movie.title)).toBeInTheDocument();
        expect(screen.getByText(movie.year)).toBeInTheDocument();
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

    it("calls window.alert when movie tile is clicked", () => {
        render(<MovieTile movie={movie} />);

        fireEvent.click(screen.getByTestId("movie-tile"));

        expect(window.alert).toHaveBeenCalledWith(`Movie '${movie.title}' is clicked.`);
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
        expect(window.alert).toHaveBeenCalledWith(`Edit '${movie.title}' is clicked.`);
    });

    it("calls onDelete when Delete is clicked", () => {
        const onDelete = jest.fn();
        render(<MovieTile movie={movie} onDelete={onDelete} />);

        fireEvent.click(screen.getByText("⋮"));
        fireEvent.click(screen.getByText("Delete"));

        expect(onDelete).toHaveBeenCalledWith(movie);
        expect(window.alert).toHaveBeenCalledWith(`Delete '${movie.title}' is clicked.`);
    });

    it("does not crash when onClick, onEdit, or onDelete are not provided", () => {
        render(<MovieTile movie={movie} />);

        fireEvent.click(screen.getByTestId("movie-tile"));
        expect(window.alert).toHaveBeenCalledWith(`Movie '${movie.title}' is clicked.`);
    });

    it("does not crash when menu icon is clicked without onEdit or onDelete", () => {
        render(<MovieTile movie={movie} />);

        fireEvent.click(screen.getByText("⋮"));

        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("does not crash when Edit is clicked and onEdit is not provided", () => {
        render(<MovieTile movie={movie} />);

        fireEvent.click(screen.getByText("⋮"));
        fireEvent.click(screen.getByText("Edit"));

        expect(window.alert).toHaveBeenCalledWith(`Edit '${movie.title}' is clicked.`);
    });

    it("does not crash when Delete is clicked and onDelete is not provided", () => {
        render(<MovieTile movie={movie} />);

        fireEvent.click(screen.getByText("⋮"));
        fireEvent.click(screen.getByText("Delete"));

        expect(window.alert).toHaveBeenCalledWith(`Delete '${movie.title}' is clicked.`);
    });
});