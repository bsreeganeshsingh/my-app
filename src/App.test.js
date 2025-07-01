import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

test('renders React Components Example link', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>);
  const inputElement = screen.getByPlaceholderText('What do you want to watch?');
  expect(inputElement).toBeInTheDocument();
});