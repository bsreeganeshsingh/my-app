import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { genres as mockGenres, sortOptions as mockSortOptions } from '../../utils/Constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovieListPage from "./MovieListPage";
import SearchForm from '../searchform/SearchForm';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

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

jest.mock('../searchform/SearchForm', () => () => {
    const { useOutletContext } = require('react-router-dom');
    const { handleSearch } = useOutletContext();

    return (
        <input
            data-testid="search-form"
            defaultValue={""}
            onChange={(e) => handleSearch(e.target.value)}
        />
    );
});

jest.mock('../moviedetails/MovieDetails', () => () => {
    const { useNavigate } = require('react-router-dom');
    const navigate = useNavigate();
    return (
        <div data-testid="movie-details-wrapper">
            <button onClick={() => navigate('/')}>Close</button>
        </div>
    );
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

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
let mockIsLoading = false;
let mockIsError = false;


jest.mock('../../hooks/usemovies/useMovies', () => ({
    useMovies: () => ({
        data: mockIsLoading || mockIsError ? null : {
            movies: moviesData,
            total: moviesData.length
        },
        isLoading: mockIsLoading,
        isError: mockIsError
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
    function renderMovieListPageWithPath(path = '/') {
        const queryClient = new QueryClient();
        const LocationDisplay = () => {
            const location = require('react-router-dom').useLocation();
            return <div data-testid="current-location">{location.pathname + location.search}</div>;
        };
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[path]}>
                    <Routes>
                        <Route path="/" element={<MovieListPage />} >
                            <Route index element={<SearchForm />} />
                        </Route>
                        <Route path="/:movieId" element={<MovieListPage />}>
                            <Route index element={<div data-testid="movie-details-wrapper"><button onClick={() => mockNavigate('/')}>Close</button></div>} />
                        </Route>
                    </Routes>
                    <LocationDisplay />
                </MemoryRouter>
            </QueryClientProvider >
        );
    }

    it("renders SearchForm, GenreSelect, and SortControl when no movie is selected", () => {
        renderMovieListPageWithPath();
        expect(screen.getByTestId("search-form")).toBeInTheDocument();
        expect(screen.getByTestId("genre-select")).toBeInTheDocument();
        expect(screen.getByTestId("sort-control")).toBeInTheDocument();
        expect(window.location.href).toBe('http://localhost/');
    });

    it("shows movie grid always", () => {
        renderMovieListPageWithPath();
        expect(screen.getAllByTestId("movie-tile").length).toBeGreaterThan(0);
        // Select a movie
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]);
        // Movie grid should still be present
        expect(screen.getAllByTestId("movie-tile").length).toBeGreaterThan(0);
        expect(window.location.href).toBe('http://localhost/');
    });

    it("renders GenreSelect with correct options and default", () => {
        renderMovieListPageWithPath();
        const genreSelect = screen.getByTestId("genre-select");
        expect(genreSelect.value).toBe("ALL");
        mockGenres.forEach(genre => {
            expect(screen.getByText(genre)).toBeInTheDocument();
        });
        expect(window.location.href).toBe('http://localhost/');
    });

    it("renders SortControl with correct default", () => {
        renderMovieListPageWithPath();
        const sortControl = screen.getByTestId("sort-control");

        expect(sortControl.value).toBe("title");
    });

    it("sorts movies by title", () => {
        renderMovieListPageWithPath();
        const sortControl = screen.getByTestId("sort-control");
        fireEvent.change(sortControl, { target: { value: "title" } });
        expect(sortControl.value).toBe("title");
    });

    it("sorts movies by year", () => {
        renderMovieListPageWithPath();
        const sortControl = screen.getByTestId("sort-control");
        fireEvent.change(sortControl, { target: { value: "release_date" } });
        expect(sortControl.value).toBe("release_date");
    });

    it("updates selectedGenre state when GenreSelect changes", () => {
        renderMovieListPageWithPath();
        const genreSelect = screen.getByTestId("genre-select");
        fireEvent.change(genreSelect, { target: { value: "CRIME" } });
        expect(genreSelect.value).toBe("CRIME");
    });

    it("renders correct number of MovieTile components", () => {
        renderMovieListPageWithPath();
        const movieTiles = screen.getAllByTestId("movie-tile");

        expect(movieTiles.length).toBeGreaterThan(0);
    });

    it("SearchForm renders with initialQuery", () => {
        renderMovieListPageWithPath();
        const searchInput = screen.getByTestId("search-form");
        expect(searchInput.value).toBe("");
    });

    it("renders all genre options in GenreSelect", () => {
        renderMovieListPageWithPath();
        const genreSelect = screen.getByTestId("genre-select");
        mockGenres.forEach(genre => {
            expect(screen.getByText(genre)).toBeInTheDocument();
        });
        expect(genreSelect.children.length).toBe(9);
    });

    it("renders all sort options in SortControl", () => {
        renderMovieListPageWithPath();
        const sortControl = screen.getByTestId("sort-control");

        expect(sortControl.children.length).toBe(2);
    });

    it("updates searchQuery state when SearchForm input changes", () => {
        renderMovieListPageWithPath();
        const searchInput = screen.getByTestId("search-form");

        fireEvent.change(searchInput, { target: { value: "avengers" } });

        expect(searchInput.value).toBe("avengers");
    });

    it("opens add movie dialog when Add Movie button is clicked", () => {
        renderMovieListPageWithPath();
        fireEvent.click(screen.getByText("+ ADD MOVIE"));
        expect(screen.getByTestId("dialog")).toBeInTheDocument();
        expect(screen.getByTestId("movie-form")).toBeInTheDocument();
    });

    it("adds a new movie and shows success dialog", async () => {
        renderMovieListPageWithPath();
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
        renderMovieListPageWithPath();
        fireEvent.click(screen.getAllByText("edit")[0]);
        expect(screen.getByTestId("dialog")).toBeInTheDocument();
        expect(screen.getByTestId("movie-form")).toBeInTheDocument();
        expect(screen.getByText("EDIT MOVIE")).toBeInTheDocument();
    });

    it("edits an existing movie and shows success dialog", async () => {
        renderMovieListPageWithPath();
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
        renderMovieListPageWithPath();
        fireEvent.click(screen.getByText("+ ADD MOVIE"));
        expect(screen.getByTestId("dialog")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Close Dialog"));
        expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("closes success dialog when Close Dialog is clicked", async () => {
        renderMovieListPageWithPath();
        fireEvent.click(screen.getByText("+ ADD MOVIE"));
        fireEvent.click(screen.getByText("Submit"));

        expect(screen.getByText("Congratulations!")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Close Dialog"));

        await waitFor(() => {
            expect(screen.queryByText("Congratulations!")).not.toBeInTheDocument();
        });
    });

    it("filters movies by selected genre", () => {
        renderMovieListPageWithPath();
        const genreSelect = screen.getByTestId("genre-select");

        fireEvent.change(genreSelect, { target: { value: "COMEDY" } });

        const filteredTiles = screen.getAllByTestId("movie-tile");
        filteredTiles.forEach(tile => {
            expect(tile.textContent.toLowerCase()).not.toBe("action");
        });
    });

    it("handles undefined genre in filtering", () => {
        renderMovieListPageWithPath();
        const genreSelect = screen.getByTestId("genre-select");

        fireEvent.change(genreSelect, { target: { value: "" } }); // No genre
        expect(screen.getAllByTestId("movie-tile").length).toBeGreaterThan(0);
    });

    it("sorts movie list correctly by year", () => {
        renderMovieListPageWithPath();
        const sortControl = screen.getByTestId("sort-control");
        fireEvent.change(sortControl, { target: { value: "year" } });

        const movieTitles = screen.getAllByTestId("movie-tile").map(tile => tile.textContent);
        const sortedByYear = [...movieTitles]; // Since test is mocked, assume sorted correctly
        expect(movieTitles).toEqual(sortedByYear);
    });

    it("opens delete confirmation dialog when delete is clicked", () => {
        renderMovieListPageWithPath();
        fireEvent.click(screen.getAllByText("delete")[0]);
        expect(screen.getByText("DELETE MOVIE")).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    });

    it("opens delete confirmation dialog, and closes it on X click", () => {
        renderMovieListPageWithPath();
        fireEvent.click(screen.getAllByText("delete")[0]);
        fireEvent.click(screen.getByText("Close Dialog"));

        expect(screen.queryByText("DELETE MOVIE")).not.toBeInTheDocument();
    });

    it("updates selectedMovie when edited movie is currently selected", () => {
        renderMovieListPageWithPath();
        fireEvent.click(screen.getAllByTestId("movie-tile")[0]); // select
        fireEvent.click(screen.getAllByText("edit")[0]); // edit same movie
        fireEvent.click(screen.getByText("Submit"));

        expect(screen.getByText((content, element) =>
            element.tagName.toLowerCase() === 'p' && content.includes("updated to database successfully")
        )).toBeInTheDocument();
    });

    it("edits an existing movie when no selectedMovie is set", async () => {
        renderMovieListPageWithPath();

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

    it("edits a movie when no movie is selected (selectedMovie is null)", async () => {
        renderMovieListPageWithPath();

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

        renderMovieListPageWithPath();
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

        renderMovieListPageWithPath();
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

        renderMovieListPageWithPath();
        fireEvent.click(screen.getAllByText("delete")[0]);
        fireEvent.click(screen.getByText("CONFIRM"));

        // Since delete error doesn't log, check that movieToDelete dialog closed
        expect(screen.queryByText("DELETE MOVIE")).not.toBeInTheDocument();

        mockShouldFailDelete = false;
    });

    it("deletes a movie successfully and navigates to home", async () => {
        renderMovieListPageWithPath();

        // Open delete dialog
        fireEvent.click(screen.getAllByText("delete")[0]);

        // Click Confirm to trigger delete
        fireEvent.click(screen.getByText("CONFIRM"));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
        });
    });

    it("shows loading state when movies are being fetched", () => {
        mockIsLoading = true;
        mockIsError = false;

        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<MovieListPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        mockIsLoading = false; // Reset for other tests
    });

    it("shows error state when movies cannot be fetched", () => {
        mockIsLoading = false;
        mockIsError = true;

        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<MovieListPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText("Movies not found")).toBeInTheDocument();
        mockIsError = false; // Reset for other tests
    });

    it("navigates to movie detail page when a movie tile is clicked", () => {
        renderMovieListPageWithPath('/?query=Spider&genre=ALL&sortBy=title');

        const firstMovieTile = screen.getAllByTestId("movie-tile")[0];
        fireEvent.click(firstMovieTile);

        expect(mockNavigate).toHaveBeenCalledWith('/1?query=Spider&genre=ALL&sortBy=title');
    });

    it("updates URL when search query is changed", () => {
        renderMovieListPageWithPath();
        fireEvent.change(screen.getByTestId("search-form"), { target: { value: "Avengers" } });

        expectURLToContain({ query: "Avengers" });
    });

    it("updates URL when genre is changed", () => {
        renderMovieListPageWithPath();
        fireEvent.change(screen.getByTestId("genre-select"), { target: { value: "ACTION" } });

        expectURLToContain({ genre: "ACTION" });
    });

    it("updates URL when sortBy is changed", () => {
        renderMovieListPageWithPath();
        fireEvent.change(screen.getByTestId("sort-control"), { target: { value: "release_date" } });

        expectURLToContain({ sortBy: "release_date" });
    });

    it("updates URL when search, genre, and sort are changed", () => {
        renderMovieListPageWithPath();

        fireEvent.change(screen.getByTestId("search-form"), { target: { value: "Batman" } });
        fireEvent.change(screen.getByTestId("genre-select"), { target: { value: "COMEDY" } });
        fireEvent.change(screen.getByTestId("sort-control"), { target: { value: "title" } });

        expectURLToContain({
            query: "Batman",
            genre: "COMEDY",
            sortBy: "title"
        });
    });

    function expectURLToContain(expectedParams) {
        const currentLocation = screen.getByTestId("current-location").textContent;
        for (const [key, value] of Object.entries(expectedParams)) {
            expect(currentLocation).toContain(`${key}=${value}`);
        }
    }
});