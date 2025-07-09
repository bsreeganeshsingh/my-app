import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

jest.mock('./components/searchform/SearchForm', () => () => (
  <input placeholder="What do you want to watch?" />
));

jest.mock('./components/searchform/SearchSection', () => () => (
  <div>
    <input placeholder="What do you want to watch?" />
  </div>
));

jest.mock('./components/movielistpage/MovieListPage', () => {
  const React = require('react');
  const { Outlet } = require('react-router-dom');
  return () => (
    <div>
      <Outlet />
    </div>
  );
});

jest.mock('./components/moviedetails/MovieDetailsWrapper', () => () => <div>Movie Details</div>);

jest.mock('./hooks/usemovies/useMovies', () => ({
  useMovies: () => ({
    data: { movies: [] },
    isLoading: false,
    isError: false
  }),
}));

const queryClient = new QueryClient();

test('renders input with placeholder text', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
  const inputElement = await screen.findByPlaceholderText('What do you want to watch?');
  expect(inputElement).toBeInTheDocument();
});