import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieForm from "./MovieForm";

describe("MovieForm", () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onReset: jest.fn(),
  };

  const initialData = {
    title: "Inception",
    release_date: "2010-12-24",
    runtime: 148,
    vote_average: 8.8,
    overview: "A mind-bending thriller",
    poster_path: "http://example.com/image.jpg",
    tagline: "Your mind is the scene of the crime",
    budget: 160000000,
    genres: ["COMEDY", "CRIME"],
  };

  const fillForm = async (
    getByLabelText,
    getByText,
    getByTestId,
    queryByTestId
  ) => {
    fireEvent.change(getByLabelText(/TITLE/i), {
      target: { value: "The Matrix" },
    });
    fireEvent.change(getByLabelText(/RELEASE DATE/i), {
      target: { value: "2001-03-31" },
    });
    fireEvent.change(getByLabelText(/DURATION/i), {
      target: { value: "136" },
    });
    fireEvent.change(getByLabelText(/RATING/i), {
      target: { value: "9.0" },
    });
    fireEvent.change(getByLabelText(/DESCRIPTION/i), {
      target: { value: "Neo discovers the truth" },
    });
    fireEvent.change(getByLabelText(/IMAGE URL/i), {
      target: { value: "http://matrix.com/image.png" },
    });
    fireEvent.change(getByLabelText(/BUDGET/i), {
      target: { value: "63000000" },
    });
    fireEvent.change(getByLabelText(/TAGLINE/i), {
      target: { value: "Free your mind" },
    });

    // Open the dropdown
    const dropdownHeader = getByTestId("genre-dropdown-header");
    fireEvent.click(dropdownHeader);

    // Click checkboxes safely
    const comedyCheckbox = await waitFor(() => getByTestId("genre-COMEDY"));
    const crimeCheckbox = await waitFor(() => getByTestId("genre-CRIME"));

    fireEvent.click(comedyCheckbox);
    fireEvent.click(crimeCheckbox);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default empty values", () => {
    const { getByLabelText, getByText } = render(
      <MovieForm {...defaultProps} />
    );
    expect(getByLabelText(/TITLE/i).value).toBe("");
    expect(getByText(/Select Genre/i)).toBeInTheDocument();
  });

  it("handles input changes", async () => {
    const { getByLabelText } = render(<MovieForm {...defaultProps} />);
    await waitFor(() => {
      fireEvent.change(getByLabelText(/TITLE/i), {
        target: { value: "Tenet" },
      });
    });
    expect(getByLabelText(/TITLE/i).value).toBe("Tenet");
  });

  it("calls onSubmit with parsed values", async () => {
    const handleSubmit = jest.fn();
    const { getByLabelText, getByText, getByTestId, queryByTestId } = render(
      <MovieForm onSubmit={handleSubmit} />
    );
    await fillForm(getByLabelText, getByText, getByTestId, queryByTestId);

    await waitFor(() => {
      fireEvent.click(getByText(/SUBMIT/i));
    });

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        title: "The Matrix",
        release_date: "2001-03-31",
        runtime: 136,
        vote_average: 9.0,
        tagline: "Free your mind",
        budget: 63000000,
        overview: "Neo discovers the truth",
        genres: ["COMEDY", "CRIME"],
        poster_path: "http://matrix.com/image.png",
      })
    );
  });

  it("resets to initialData", async () => {
    const { getByLabelText, getByText } = render(
      <MovieForm {...defaultProps} initialData={initialData} />
    );

    const titleInput = getByLabelText(/TITLE/i);
    await waitFor(() => {
      fireEvent.change(titleInput, { target: { value: "Changed TITLE" } });
      fireEvent.click(getByText(/RESET/i));
    });

    expect(titleInput.value).toBe("Inception");
  });

  it("handles empty genres string gracefully", () => {
    const emptyGenresData = { ...initialData, genres: "" };
    const { getByText } = render(
      <MovieForm {...defaultProps} initialData={emptyGenresData} />
    );
    expect(getByText(/Select Genre/i)).toBeInTheDocument();
  });

  it("resets without crashing when onReset not provided", async () => {
    const { getByLabelText, getByText } = render(
      <MovieForm onSubmit={jest.fn()} />
    );

    await waitFor(() => {
      fireEvent.change(getByLabelText(/TITLE/i), {
        target: { value: "Some Title" },
      });
      fireEvent.click(getByText(/RESET/i));
    });

    expect(getByLabelText(/TITLE/i).value).toBe("");
  });

  it("toggles genre checkbox", async () => {
    const { getByTestId } = render(
      <MovieForm
        {...defaultProps}
        initialData={{ ...initialData, genres: ["COMEDY"] }}
      />
    );

    const dropdownHeader = getByTestId("genre-dropdown-header");

    await waitFor(() => {
      fireEvent.click(dropdownHeader);
    });

    const checkbox = getByTestId("genre-COMEDY");

    expect(checkbox.checked).toBe(true);

    await waitFor(() => {
      fireEvent.click(checkbox);
    });

    expect(checkbox.checked).toBe(false);
  });
});
