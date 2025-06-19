import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders React Components Example link', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText('Enter search query');
  expect(inputElement).toBeInTheDocument();
});