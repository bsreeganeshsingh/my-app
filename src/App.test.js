import { render, screen } from '@testing-library/react';
import App from './App';

test('renders React Components Example link', () => {
  render(<App />);
  const linkElement = screen.getByText(/React Components Example/i);
  expect(linkElement).toBeInTheDocument();
});
