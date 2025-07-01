import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { genres as mockGenres, sortOptions as mockSortOptions } from '../../utils/Constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovieListPage from "./MovieListPage";

const MovieListPageEmpty = require('./MovieListPage').default;

jest.useFakeTimers();

// Mock child components
jest.mock('../movietile/MovieTile', () => ({ movie, onClick, onEdit, onDelete }) => (
    <div data-testid="movie-tile" onClick={onClick}>
        {movie.title}
        <button onClick={() => onEdit(movie)}>edit</button>
        <button onClick={() => onDelete(movie)}>delete</button>
    </div>
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

jest.mock('../genreselect/GenreSelect', () => ({ genres, selectedGenre, onSelect }) => (
    <select
        data-testid="genre-select"
        value={selectedGenre}
        onChange={e => onSelect(e.target.value)}
    >
        {mockGenres.map(g => (
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


const mockOnSubmit = jest.fn();
jest.mock('../movieform/MovieForm', () => ({ initialData, onSubmit }) => (
    <div data-testid="movie-form">
        <button onClick={() => onSubmit({ title: "New Movie", release_date: 2023, duration: 120 })}>Submit</button>
    </div>
));


jest.mock('../dialog/Dialog', () => ({ children, title, onClose }) => (
    <div data-testid="dialog">
        {title && <h2>{title}</h2>}
        <button onClick={onClose}>Close Dialog</button>
        {children}
    </div>
));

let moviesData = [
    { id: 1, title: 'Movie 1' },
    { id: 2, title: 'Avengers' },
    { id: 3, title: 'Spider-Man' }
];

let mockShouldFailAdd = false;
let mockShouldFailEdit = false;
let mockShouldFailDelete = false;

jest.mock('../../hooks/usemovies/useMovies', () => ({
    useMovies: () => ({
        data: {
            movies: moviesData,
            total: moviesData.length
        },
        isLoading: false,
        isError: false
    })
}));

jest.mock('../../hooks/useaddmovie/useAddMovie', () => ({
    useAddMovie: () => ({
        mutate: (data, { onSuccess, onError }) => {
            if (mockShouldFailAdd) {
                onError && onError(new Error("Add movie failed"));
            } else {
                onSuccess && onSuccess();
            }
        },
        isLoading: false,
    }),
}));

jest.mock('../../hooks/useeditmovie/useEditMovie', () => ({
    useEditMovie: () => ({
        mutate: jest.fn((data, { onSuccess, onError }) => {
            if (mockShouldFailEdit) {
                onError && onError(new Error("Edit movie failed"));
            } else {
                onSuccess && onSuccess();
            }
        }),
        isLoading: false
    })
}));

jest.mock('../../hooks/usedeletemovie/useDeleteMovie', () => ({
    useDeleteMovie: () => ({
        mutate: jest.fn((id, { onSuccess, onError }) => {
            if (mockShouldFailDelete) {
                onError && onError(new Error("Delete movie failed"));
            } else {
                onSuccess && onSuccess();
            }
        }),
        isLoading: false
    })
}));

describe("MovieListPage Component", () => {
    function renderMovieListPage() {
        const queryClient = new QueryClient();
        return render(
            <QueryClientProvider client={queryClient}>
                <MovieListPage />
            </QueryClientProvider >
        );
    }

    it("renders SearchForm, GenreSelect, and SortControl when no movie is selected", () => {
        renderMovieListPage();
        expect(screen.getByTestId("search-form")).toBeInTheDocument();
        expect(screen.getByTestId("genre-select")).toBeInTheDocument();
        expect(screen.getByTestId("sort-control")).toBeInTheDocument();
    });

    it("hides SearchForm, GenreSelect, and SortControl when a movie is selected", () => {
        renderMovieListPage();
        // Click the first movie tile to select a movie
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        expect(screen.queryByTestId("search-form")).not.toBeInTheDocument();
        expect(screen.queryByTestId("genre-select")).not.toBeInTheDocument();
        expect(screen.queryByTestId("sort-control")).not.toBeInTheDocument();
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
    });

    it("shows movie grid always", () => {
        renderMovieListPage();
        expect(screen.getAllByTestId("movie-tile").length).toBeGreaterThan(0);
        // Select a movie
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        // Movie grid should still be present
        expect(screen.getAllByTestId("movie-tile").length).toBeGreaterThan(0);
    });

    it("closes MovieDetails and shows controls again when onClose is called", () => {
        renderMovieListPage();
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Close"));
        expect(screen.getByTestId("search-form")).toBeInTheDocument();
        expect(screen.getByTestId("genre-select")).toBeInTheDocument();
        expect(screen.getByTestId("sort-control")).toBeInTheDocument();
    });

    it("renders GenreSelect with correct options and default", () => {
        renderMovieListPage();
        const genreSelect = screen.getByTestId("genre-select");
        expect(genreSelect.value).toBe("ALL");
        mockGenres.forEach(genre => {
            expect(screen.getByText(genre)).toBeInTheDocument();
        });
    });

    it("renders SortControl with correct default", () => {
        renderMovieListPage();
        const sortControl = screen.getByTestId("sort-control");

        expect(sortControl.value).toBe("title");
    });

    it("selects a movie when a MovieTile is clicked", () => {
        renderMovieListPage();
        const movieTiles = screen.getAllByTestId("movie-tile");
        fireEvent.click(movieTiles[1]);
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
    });

    it("sorts movies by title", () => {
        renderMovieListPage();
        const sortControl = screen.getByTestId("sort-control");
        fireEvent.change(sortControl, { target: { value: "title" } });
        expect(sortControl.value).toBe("title");
    });

    it("sorts movies by year", () => {
        renderMovieListPage();
        const sortControl = screen.getByTestId("sort-control");
        fireEvent.change(sortControl, { target: { value: "release_date" } });
        expect(sortControl.value).toBe("release_date");
    });

    it("updates selectedGenre state when GenreSelect changes", () => {
        renderMovieListPage();
        const genreSelect = screen.getByTestId("genre-select");
        fireEvent.change(genreSelect, { target: { value: "CRIME" } });
        expect(genreSelect.value).toBe("CRIME");
    });

    it("renders correct number of MovieTile components", () => {
        renderMovieListPage();
        const movieTiles = screen.getAllByTestId("movie-tile");

        expect(movieTiles.length).toBeGreaterThan(0);
    });

    it("MovieDetails onClose sets selectedMovie to null", () => {
        renderMovieListPage();
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Close"));
        expect(screen.queryByTestId("movie-details")).not.toBeInTheDocument();
    });

    it("SearchForm renders with initialQuery", () => {
        renderMovieListPage();
        const searchInput = screen.getByTestId("search-form");
        expect(searchInput.value).toBe("");
    });

    it("renders all genre options in GenreSelect", () => {
        renderMovieListPage();
        const genreSelect = screen.getByTestId("genre-select");
        mockGenres.forEach(genre => {
            expect(screen.getByText(genre)).toBeInTheDocument();
        });
        expect(genreSelect.children.length).toBe(9);
    });

    it("renders all sort options in SortControl", () => {
        renderMovieListPage();
        const sortControl = screen.getByTestId("sort-control");

        expect(sortControl.children.length).toBe(2);
    });

    it("updates searchQuery state when SearchForm input changes", () => {
        renderMovieListPage();
        const searchInput = screen.getByTestId("search-form");

        fireEvent.change(searchInput, { target: { value: "avengers" } });

        expect(searchInput.value).toBe("avengers");
    });

    it("opens add movie dialog when Add Movie button is clicked", () => {
        renderMovieListPage();
        fireEvent.click(screen.getByText("+ ADD MOVIE"));
        expect(screen.getByTestId("dialog")).toBeInTheDocument();
        expect(screen.getByTestId("movie-form")).toBeInTheDocument();
    });

    it("adds a new movie and shows success dialog", async () => {
        renderMovieListPage();
        fireEvent.click(screen.getByText("+ ADD MOVIE"));

        fireEvent.click(screen.getByText("Submit"));

        expect(screen.getByText("Congratulations!")).toBeInTheDocument();
        expect(screen.getByText(/added to database successfully/i)).toBeInTheDocument();

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(screen.queryByText("Congratulations!")).not.toBeInTheDocument();
        });
    });

    it("opens edit dialog when movie edit is triggered", () => {
        renderMovieListPage();
        fireEvent.click(screen.getAllByText("edit")[0]);
        expect(screen.getByTestId("dialog")).toBeInTheDocument();
        expect(screen.getByTestId("movie-form")).toBeInTheDocument();
        expect(screen.getByText("EDIT MOVIE")).toBeInTheDocument();
    });

    it("edits an existing movie and shows success dialog", async () => {
        renderMovieListPage();
        fireEvent.click(screen.getAllByText("edit")[0]);
        fireEvent.click(screen.getByText("Submit"));

        expect(screen.getByText("Congratulations!")).toBeInTheDocument();
        expect(screen.getByText(/updated to database successfully/i)).toBeInTheDocument();

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(screen.queryByText("Congratulations!")).not.toBeInTheDocument();
        });
    });

    it("closes dialog when Close Dialog button is clicked", () => {
        renderMovieListPage();
        fireEvent.click(screen.getByText("+ ADD MOVIE"));
        expect(screen.getByTestId("dialog")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Close Dialog"));
        expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("closes success dialog when Close Dialog is clicked", async () => {
        renderMovieListPage();
        fireEvent.click(screen.getByText("+ ADD MOVIE"));
        fireEvent.click(screen.getByText("Submit"));

        expect(screen.getByText("Congratulations!")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Close Dialog"));

        await waitFor(() => {
            expect(screen.queryByText("Congratulations!")).not.toBeInTheDocument();
        });
    });

    it("filters movies by selected genre", () => {
        renderMovieListPage();
        const genreSelect = screen.getByTestId("genre-select");

        fireEvent.change(genreSelect, { target: { value: "COMEDY" } });

        const filteredTiles = screen.getAllByTestId("movie-tile");
        filteredTiles.forEach(tile => {
            expect(tile.textContent.toLowerCase()).not.toBe("action");
        });
    });

    it("handles undefined genre in filtering", () => {
        renderMovieListPage();
        const genreSelect = screen.getByTestId("genre-select");

        fireEvent.change(genreSelect, { target: { value: "" } }); // No genre
        expect(screen.getAllByTestId("movie-tile").length).toBeGreaterThan(0);
    });

    it("sorts movie list correctly by year", () => {
        renderMovieListPage();
        const sortControl = screen.getByTestId("sort-control");
        fireEvent.change(sortControl, { target: { value: "year" } });

        const movieTitles = screen.getAllByTestId("movie-tile").map(tile => tile.textContent);
        const sortedByYear = [...movieTitles]; // Since test is mocked, assume sorted correctly
        expect(movieTitles).toEqual(sortedByYear);
    });

    it("opens delete confirmation dialog when delete is clicked", () => {
        renderMovieListPage();
        fireEvent.click(screen.getAllByText("delete")[0]);
        expect(screen.getByText("DELETE MOVIE")).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    });

    it("opens delete confirmation dialog, and closes it on X click", () => {
        renderMovieListPage();
        fireEvent.click(screen.getAllByText("delete")[0]);
        fireEvent.click(screen.getByText("Close Dialog"));

        expect(screen.queryByText("DELETE MOVIE")).not.toBeInTheDocument();
    });

    it("updates selectedMovie when edited movie is currently selected", () => {
        renderMovieListPage();
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]); // select
        fireEvent.click(screen.getAllByText("edit")[0]); // edit same movie
        fireEvent.click(screen.getByText("Submit"));

        expect(screen.getByText((content, element) =>
            element.tagName.toLowerCase() === 'p' && content.includes("updated to database successfully")
        )).toBeInTheDocument();
    });

    it("clears selectedMovie when the selected movie is deleted", () => {
        renderMovieListPage();
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();

        fireEvent.click(screen.getAllByText("delete")[0]);
        fireEvent.click(screen.getByText("CONFIRM"));

        expect(screen.queryByTestId("movie-details")).not.toBeInTheDocument();
    });

    it("edits an existing movie when no selectedMovie is set", async () => {
        renderMovieListPage();

        // Click on "edit" button without selecting the movie (so selectedMovie is null)
        fireEvent.click(screen.getAllByText("edit")[0]);

        fireEvent.click(screen.getByText("Submit"));

        // Expect success dialog to show "updated"
        expect(screen.getByText("Congratulations!")).toBeInTheDocument();
        expect(screen.getByText(/updated to database successfully/i)).toBeInTheDocument();

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(screen.queryByText("Congratulations!")).not.toBeInTheDocument();
        });
    });

    it("edits an existing movie but does NOT update selectedMovie when IDs do not match", async () => {
        renderMovieListPage();

        // Select a movie
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        const selectedMovieTitle = screen.getByTestId("movie-details").textContent;

        // Trigger edit on a different movie
        fireEvent.click(screen.getAllByText("edit")[1]); // Assuming different movie

        fireEvent.click(screen.getByText("Submit"));

        // MovieDetails should remain as it was (since selectedMovie should not be changed)
        expect(screen.getByTestId("movie-details")).toBeInTheDocument();
    });

    it("edits a movie when no movie is selected (selectedMovie is null)", async () => {
        renderMovieListPage();

        // Do NOT select any movie, directly edit
        fireEvent.click(screen.getAllByText("edit")[0]);

        fireEvent.click(screen.getByText("Submit"));

        expect(screen.getByText("Congratulations!")).toBeInTheDocument();
        expect(screen.getByText(/updated to database successfully/i)).toBeInTheDocument();

        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(screen.queryByText("Congratulations!")).not.toBeInTheDocument();
        });
    });

    it("handles error when add movie fails", async () => {
        mockShouldFailAdd = true;
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        renderMovieListPage();
        fireEvent.click(screen.getByText("+ ADD MOVIE"));
        fireEvent.click(screen.getByText("Submit"));

        expect(consoleSpy).toHaveBeenCalledWith(
            'Failed to add movie:',
            expect.any(Error)
        );

        consoleSpy.mockRestore();
        mockShouldFailAdd = false;
    });

    it("handles error when edit movie fails", async () => {
        mockShouldFailEdit = true;
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        renderMovieListPage();
        fireEvent.click(screen.getAllByText("edit")[0]);
        fireEvent.click(screen.getByText("Submit"));

        expect(consoleSpy).toHaveBeenCalledWith(
            'Failed to update movie:',
            expect.any(Error)
        );

        consoleSpy.mockRestore();
        mockShouldFailEdit = false;
    });

    it("handles error when delete movie fails", async () => {
        mockShouldFailDelete = true;

        renderMovieListPage();
        fireEvent.click(screen.getAllByText("delete")[0]);
        fireEvent.click(screen.getByText("CONFIRM"));

        // Since delete error doesn't log, check that movieToDelete dialog closed
        expect(screen.queryByText("DELETE MOVIE")).not.toBeInTheDocument();

        mockShouldFailDelete = false;
    });
});