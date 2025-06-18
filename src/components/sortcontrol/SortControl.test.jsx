import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import SortControl from "./SortControl";

describe("SortControl Component", () => {
    const sortOptions = [
        { label: "Title", value: "title" },
        { label: "Rating", value: "rating" },
        { label: "Year", value: "year" }
    ];
    const mockOnSort = jest.fn();

    beforeEach(() => {
        cleanup();
        render(<SortControl sortOptions={sortOptions} selected="" onSortChange={mockOnSort} />);
    });

    it("renders sort options", () => {
        expect(screen.getByText("Sort by:")).toBeInTheDocument();
        expect(screen.getByText("Title")).toBeInTheDocument();
        expect(screen.getByText("Rating")).toBeInTheDocument();
        expect(screen.getByText("Year")).toBeInTheDocument();
    });

    it("calls onSort with correct parameters when sort option is selected", () => {
        // Open the dropdown and select "Title"
        fireEvent.change(screen.getByTestId("sortSelected"), { target: { value: "title" } });
        expect(mockOnSort).toHaveBeenCalledWith("title");
        mockOnSort.mockClear();

        // Open the dropdown and select "Rating"
        fireEvent.change(screen.getByTestId("sortSelected"), { target: { value: "rating" } });
        expect(mockOnSort).toHaveBeenCalledWith("rating");
        mockOnSort.mockClear();

        // Open the dropdown and select "Year"
        fireEvent.change(screen.getByTestId("sortSelected"), { target: { value: "year" } });
        expect(mockOnSort).toHaveBeenCalledWith("year");
        mockOnSort.mockClear();
    });

    it("does not throw if onSortChange is not provided", () => {
        cleanup();
        render(<SortControl sortOptions={sortOptions} onSortChange="" />);
        expect(() => {
            fireEvent.change(screen.getByTestId("sortSelected"), { target: { value: "title" } });
        }).not.toThrow();
    });
});