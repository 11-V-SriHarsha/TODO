import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders todo list', async () => {
  render(<App />);
  const todoList = await screen.findByRole('list');
  expect(todoList).toBeInTheDocument();
});
