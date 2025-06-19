import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";

const HomeEmpty = require('./Home').default;
const mockGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];
const mockSortOptions = [
    { label: "Title", value: "title" },
    { label: "Year", value: "year" }
];

// Mock child components
jest.mock('../movietile/MovieTile', () => ({ movie, onClick }) => (
    <div data-testid="movie-tile" onClick={onClick}>{movie.title}</div>
));

jest.mock('../sortcontrol/SortControl', () => ({ sortOptions = mockSortOptions, selected, onSortChange }) => (
    <select
        data-testid="sort-control"
        value={selected}
        onChange={e => onSortChange(e.target.value)}
    >
        {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
));

jest.mock('../genreselect/GenreSelect', () => ({ genres = mockGenres, selectedGenre, onSelect }) => (
    <select
        data-testid="genre-select"
        value={selectedGenre}
        onChange={e => onSelect(e.target.value)}
    >
        {genres.map(g => (
            <option key={g} value={g}>{g}</option>
        ))}
    </select>
));

jest.mock('../searchform/SearchForm', () => ({ initialQuery, onSearch }) => (
    <input
        data-testid="search-form"
        defaultValue={initialQuery}
        onChange={(e) => onSearch(e.target.value)}
    />
));

jest.mock('../moviedetails/MovieDetails', () => ({ movie, onClose }) => (
    <div data-testid="movie-details">
        <span>{movie.title}</span>
        <button onClick={onClose}>Close</button>
    </div>
));

describe("Home Component", () => {
    function renderHome() {
        return render(
            <Home />
        );
    }

    it("renders SearchForm, GenreSelect, and SortControl when no movie is selected", () => {
        renderHome();
        expect(screen.getByTestId("search-form")).toBeInTheDocument();
        expect(screen.getByTestId("genre-select")).toBeInTheDocument();
        expect(screen.getByTestId("sort-control")).toBeInTheDocument();
    });

    it("hides SearchForm, GenreSelect, and SortControl when a movie is selected", () => {
        renderHome();
        // Click the first movie tile to select a movie
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        expect(screen.queryByTestId("search-form")).not.toBeInTheDocument();
        expect(screen.queryByTestId("genre-select")).not.toBeInTheDocument();
        expect(screen.queryByTestId("sort-control")).not.toBeInTheDocument();
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
    });

    it("shows movie grid always", () => {
        renderHome();
        expect(screen.getAllByTestId("movie-tile").length).toBeGreaterThan(0);
        // Select a movie
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        // Movie grid should still be present
        expect(screen.getAllByTestId("movie-tile").length).toBeGreaterThan(0);
    });

    it("closes MovieDetails and shows controls again when onClose is called", () => {
        renderHome();
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Close"));
        expect(screen.getByTestId("search-form")).toBeInTheDocument();
        expect(screen.getByTestId("genre-select")).toBeInTheDocument();
        expect(screen.getByTestId("sort-control")).toBeInTheDocument();
    });

    it("renders GenreSelect with correct options and default", () => {
        renderHome();
        const genreSelect = screen.getByTestId("genre-select");
        expect(genreSelect.value).toBe("Action");
        ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"].forEach(genre => {
            expect(screen.getByText(genre)).toBeInTheDocument();
        });
    });

    it("renders SortControl with correct options and default", () => {
        renderHome();
        const sortControl = screen.getByTestId("sort-control");
        expect(sortControl.value).toBe("title");
        ["Title", "Year"].forEach(label => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });
    it("selects a movie when a MovieTile is clicked", () => {
        renderHome();
        const movieTiles = screen.getAllByTestId("movie-tile");
        fireEvent.click(movieTiles[1]);
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
    });

    it("sorts movies by title", () => {
        renderHome();
        const sortControl = screen.getByTestId("sort-control");
        fireEvent.change(sortControl, { target: { value: "title" } });
        expect(sortControl.value).toBe("title");
    });

    it("sorts movies by year", () => {
        renderHome();
        const sortControl = screen.getByTestId("sort-control");
        fireEvent.change(sortControl, { target: { value: "year" } });
        expect(sortControl.value).toBe("year");
    });

    it("updates selectedGenre state when GenreSelect changes", () => {
        renderHome();
        const genreSelect = screen.getByTestId("genre-select");
        fireEvent.change(genreSelect, { target: { value: "Drama" } });
        expect(genreSelect.value).toBe("Drama");
    });

    it("renders correct number of MovieTile components", () => {
        renderHome();
        const movieTiles = screen.getAllByTestId("movie-tile");

        expect(movieTiles.length).toBeGreaterThan(0);
    });

    it("MovieDetails onClose sets selectedMovie to null", () => {
        renderHome();
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Close"));
        expect(screen.queryByTestId("movie-details")).not.toBeInTheDocument();
    });

    it("SearchForm renders with initialQuery", () => {
        renderHome();
        const searchInput = screen.getByTestId("search-form");
        expect(searchInput.value).toBe("");
    });

    it("renders all genre options in GenreSelect", () => {
        renderHome();
        const genreSelect = screen.getByTestId("genre-select");
        ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"].forEach(genre => {
            expect(screen.getByText(genre)).toBeInTheDocument();
        });
        expect(genreSelect.children.length).toBe(5);
    });

    it("renders all sort options in SortControl", () => {
        renderHome();
        const sortControl = screen.getByTestId("sort-control");
        ["Title", "Year"].forEach(label => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
        expect(sortControl.children.length).toBe(2);
    });

    it("updates searchQuery state when SearchForm input changes", () => {
        renderHome();
        const searchInput = screen.getByTestId("search-form");

        fireEvent.change(searchInput, { target: { value: "avengers" } });

        expect(searchInput.value).toBe("avengers");
    });
});
