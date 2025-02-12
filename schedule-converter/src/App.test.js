import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('test for renders - heading', () => {
  render(<App />);
  const heading = screen.getByRole("heading", { name: /Schedule to Google Calendar/i });
  expect(heading).toBeInTheDocument();
});

test('test for renders - button', () => {
  render(<App />);
  const sign_in_button = screen.getByRole("button", { name: /Sign in with Google/i });
  const sign_out_button = screen.getByRole("button", { name: /Sign out/i });
  const test_button = screen.getByRole("button", { name: /Test GCAL/i });
  const search_button = screen.getByRole("button", { name: /Search/i });
  const convert_button = screen.getByRole("button", { name: /Convert Schedule to Google Calendar/i });
  expect(sign_in_button).toBeInTheDocument();
  expect(sign_out_button).toBeInTheDocument();
  expect(test_button).toBeInTheDocument();
  expect(search_button).toBeInTheDocument();
  expect(convert_button).toBeInTheDocument();
});

test('test for renders - text', () => {
  render(<App />);
  const text1 = screen.getByText(/Enter Perm Number:/i);
  expect(text1).toBeInTheDocument();
});

test('test for render - placeholders', () => {
  render(<App />);
  const perm_input = screen.getByPlaceholderText('Perm Number');
  const quarter_input = screen.getByPlaceholderText('Quarter (YYYYQ)');
  expect(perm_input).toBeInTheDocument();
  expect(quarter_input).toBeInTheDocument();
});