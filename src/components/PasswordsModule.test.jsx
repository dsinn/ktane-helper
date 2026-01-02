import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordsModule from './PasswordsModule';

describe('PasswordsModule', () => {
  let container;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<PasswordsModule />);
    container = result.container;
  });

  it('renders reset button', () => {
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('renders 5 column input fields', () => {
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(5);
  });

  it('all inputs start empty', () => {
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveValue('');
    });
  });

  it('renders word table', () => {
    expect(screen.getByText('about')).toBeInTheDocument();
    expect(screen.getByText('after')).toBeInTheDocument();
    expect(screen.getByText('write')).toBeInTheDocument();
  });

  it('all words are active by default', () => {
    const inactiveCells = container.querySelectorAll('td.inactive');
    expect(inactiveCells).toHaveLength(0);
  });

  it('filters words based on single column input', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'a');

    const inactiveCells = container.querySelectorAll('td.inactive');
    expect(inactiveCells.length).toBeGreaterThan(0);
  });

  it('keeps matching words active', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'a');

    const aboutCell = screen.getByText('about').closest('td');
    expect(aboutCell).not.toHaveClass('inactive');
  });

  it('marks non-matching words as inactive', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'e');

    const aboutCell = screen.getByText('about').closest('td');
    expect(aboutCell).toHaveClass('inactive');
  });

  it('filters based on multiple columns', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    const secondInput = screen.getByLabelText('Column 2 letters');

    await user.type(firstInput, 'a');
    await user.type(secondInput, 'b');

    const inactiveCells = container.querySelectorAll('td.inactive');
    expect(inactiveCells.length).toBeGreaterThan(0);
  });

  it('converts input to lowercase', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'ABC');

    expect(firstInput).toHaveValue('abc');
  });

  it('filters out non-alphabetic characters', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'a1b2c3');

    expect(firstInput).toHaveValue('abc');
  });

  it('resets all inputs when reset button is clicked', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'abc');

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(firstInput).toHaveValue('');
  });

  it('shows all words after reset', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'a');

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    const inactiveCells = container.querySelectorAll('td.inactive');
    expect(inactiveCells).toHaveLength(0);
  });

  it('handles multiple possible letters per column', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'aef');

    const aboutCell = screen.getByText('about').closest('td');
    const everyCell = screen.getByText('every').closest('td');
    const firstCell = screen.getByText('first').closest('td');

    expect(aboutCell).not.toHaveClass('inactive');
    expect(everyCell).not.toHaveClass('inactive');
    expect(firstCell).not.toHaveClass('inactive');
  });

  it('narrows results with each column filled', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'a');

    const inactiveCountOne = container.querySelectorAll('td.inactive').length;

    const secondInput = screen.getByLabelText('Column 2 letters');
    await user.type(secondInput, 'b');

    const inactiveCountTwo = container.querySelectorAll('td.inactive').length;

    expect(inactiveCountTwo).toBeGreaterThan(inactiveCountOne);
  });

  it('allows clearing individual column inputs', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    await user.type(firstInput, 'a');

    const inactiveWithInput = container.querySelectorAll('td.inactive').length;

    await user.clear(firstInput);

    const inactiveAfterClear = container.querySelectorAll('td.inactive').length;

    expect(inactiveAfterClear).toBeLessThan(inactiveWithInput);
  });

  it('handles all 5 columns correctly', async () => {
    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'a');
    await user.type(inputs[1], 'b');
    await user.type(inputs[2], 'o');
    await user.type(inputs[3], 'u');
    await user.type(inputs[4], 't');

    const aboutCell = screen.getByText('about').closest('td');
    expect(aboutCell).not.toHaveClass('inactive');
  });

  it('uses regex pattern matching for filtering', async () => {
    const firstInput = screen.getByLabelText('Column 1 letters');
    const secondInput = screen.getByLabelText('Column 2 letters');

    await user.type(firstInput, 'a');
    await user.type(secondInput, 'fg');

    const afterCell = screen.getByText('after').closest('td');
    const againCell = screen.getByText('again').closest('td');

    expect(afterCell).not.toHaveClass('inactive');
    expect(againCell).not.toHaveClass('inactive');
  });

  it('displays 7 rows of 5 words each', () => {
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(7);

    rows.forEach(row => {
      expect(row.children).toHaveLength(5);
    });
  });
});
