import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Counter from './Counter';

test('initializes with value passed via props', () => {
  render(<Counter initialValue={10} />);
  expect(screen.getByText(/Count: 10/i)).toBeInTheDocument();
});

test('increments when + button clicked', async () => {
  render(<Counter initialValue={1} />);

  fireEvent.click(screen.getByRole('button', { name: '+' }));

  expect(screen.getByText(/Count: 2/i)).toBeInTheDocument();
});

test('decrements when - button clicked', async () => {
  render(<Counter initialValue={2} />);

  fireEvent.click(screen.getByRole('button', { name: '-' }));

  expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
});

test('does not decrement below zero', async () => {
  render(<Counter initialValue={0} />);

  fireEvent.click(screen.getByRole('button', { name: '-' }));

  expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
});

test('increments and decrements correctly with multiple clicks', async () => {
  render(<Counter initialValue={5} />);

  fireEvent.click(screen.getByRole('button', { name: '+' }));
  expect(screen.getByText(/Count: 6/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '-' }));
  expect(screen.getByText(/Count: 5/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '-' }));
  expect(screen.getByText(/Count: 4/i)).toBeInTheDocument();
});
