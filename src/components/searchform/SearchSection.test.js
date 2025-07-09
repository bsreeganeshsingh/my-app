import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchSection from './SearchSection';
import { useOutletContext } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useOutletContext: jest.fn(),
}));

const mockSearchForm = jest.fn();
jest.mock('./SearchForm', () => (props) => {
    mockSearchForm(props);
    const { onSearch } = props;
    return (
        <div data-testid="search-form">
            Mocked SearchForm
            <button data-testid="search-btn" onClick={() => onSearch('Test Query')}>
                Trigger Search
            </button>
        </div>
    );
});

describe('SearchSection', () => {
    const mockHandleSearch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useOutletContext.mockReturnValue({ handleSearch: mockHandleSearch });
    });

    test('renders SearchForm component', () => {
        render(<SearchSection />);
        const form = screen.getByTestId('search-form');
        expect(form).toBeInTheDocument();
    });

    test('passes correct props to SearchForm', () => {
        render(<SearchSection />);
        expect(mockSearchForm).toHaveBeenCalledWith(
            expect.objectContaining({
                initialQuery: '',
                onSearch: mockHandleSearch,
            }),
        );
    });

    test('calls handleSearch when onSearch is triggered', () => {
        // Redefine the mock
        jest.resetModules();
        const mockHandleSearch = jest.fn();
        jest.doMock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useOutletContext: () => ({ handleSearch: mockHandleSearch }),
        }));

        const TestSearchForm = ({ onSearch }) => (
            <button onClick={() => onSearch('Test Query')} data-testid="search-btn">Search</button>
        );
        jest.doMock('./SearchForm', () => TestSearchForm);

        const { default: SearchSection } = require('./SearchSection');

        render(<SearchSection />);
        fireEvent.click(screen.getByTestId('search-btn'));

        expect(mockHandleSearch).toHaveBeenCalledWith('Test Query');
    });
});
