import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders dashboard heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /dashboard/i });
  expect(heading).toBeInTheDocument();
});

test('can add, edit and delete an item', () => {
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText(/new pantry name/i), {
    target: { value: 'Test Pantry' },
  });
  fireEvent.click(screen.getByRole('button', { name: /add pantry/i }));

  fireEvent.click(screen.getByRole('button', { name: 'Test Pantry' }));

  fireEvent.change(screen.getByPlaceholderText(/new item/i), {
    target: { value: 'Apple' },
  });
  fireEvent.click(screen.getByRole('button', { name: /add item/i }));

  expect(screen.getByText('Apple')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /edit/i }));
  const editInput = screen.getByDisplayValue('Apple');
  fireEvent.change(editInput, { target: { value: 'Banana' } });
  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  expect(screen.getByText('Banana')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /delete/i }));
  expect(screen.queryByText('Banana')).not.toBeInTheDocument();
});
