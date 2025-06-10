// Counter.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('initializes with value passed via props', () => {
  render(<Counter initialValue={10} />);
  expect(screen.getByText(/Count: 10/i)).toBeInTheDocument();
});

test('increments when + button clicked', async () => {
  render(<Counter initialValue={1} />);
  await userEvent.click(screen.getByRole('button', { name: '+' }));
  expect(screen.getByText(/Count: 2/i)).toBeInTheDocument();
});

test('decrements when - button clicked', async () => {
  render(<Counter initialValue={2} />);
  await userEvent.click(screen.getByRole('button', { name: '-' }));
  expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
});
