import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchSection from './SearchSection';
import { useOutletContext } from 'react-router-dom';

// Mock useOutletContext from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: jest.fn(),
  Outlet: () => <div data-testid="outlet" />,
}));

// Track props passed to the mocked SearchForm
const mockSearchForm = jest.fn();

// Mock SearchForm component
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
    render(<SearchSection />);
    const btn = screen.getByTestId('search-btn');
    fireEvent.click(btn);
    expect(mockHandleSearch).toHaveBeenCalledWith('Test Query');
  });

  test('renders Outlet as well', () => {
    render(<SearchSection />);
    const outlet = screen.getByTestId('outlet');
    expect(outlet).toBeInTheDocument();
  });

  test('uses default handleSearch when useOutletContext is undefined', () => {
  useOutletContext.mockReturnValue(undefined);
  render(<SearchSection />);
  
  const btn = screen.getByTestId('search-btn');
  expect(() => fireEvent.click(btn)).not.toThrow(); // should be safe
});
});
