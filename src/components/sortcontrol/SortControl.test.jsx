import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import SortControl from "./SortControl";

describe("SortControl Component", () => {
    const sortOptions = [
        { label: "TITLE", value: "title" },
        { label: "YEAR", value: "year" }
    ];
    const mockOnSort = jest.fn();

    beforeEach(() => {
        cleanup();
        render(<SortControl sortOptions={sortOptions} selected="" onSortChange={mockOnSort} />);
    });

    it("renders sort options", () => {
        expect(screen.getByText("SORT BY:")).toBeInTheDocument();
        expect(screen.getByText("TITLE")).toBeInTheDocument();
        expect(screen.getByText("YEAR")).toBeInTheDocument();
    });

    it("calls onSort with correct parameters when sort option is selected", () => {
        // Open the dropdown and select "TITLE"
        fireEvent.change(screen.getByTestId("sortSelected"), { target: { value: "title" } });
        expect(mockOnSort).toHaveBeenCalledWith("title");
        mockOnSort.mockClear();

        // Open the dropdown and select "YEAR"
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