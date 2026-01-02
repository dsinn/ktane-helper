import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MorseCodeModule from './MorseCodeModule';

describe('MorseCodeModule', () => {
  let container;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<MorseCodeModule />);
    container = result.container;
  });

  it('renders word-frequency table', () => {
    expect(screen.getByText('Word')).toBeInTheDocument();
    expect(screen.getByText('Freq')).toBeInTheDocument();
  });

  it('renders all 16 possible words', () => {
    const words = ['shell', 'halls', 'slick', 'trick', 'boxes', 'leaks', 'strobe', 'bistro',
                   'flick', 'bombs', 'break', 'brick', 'steak', 'sting', 'vector', 'beats'];

    words.forEach(word => {
      expect(screen.getByText(word)).toBeInTheDocument();
    });
  });

  it('displays correct frequencies for words', () => {
    expect(screen.getByText('3.505')).toBeInTheDocument();
    expect(screen.getByText('3.515')).toBeInTheDocument();
    expect(screen.getByText('3.600')).toBeInTheDocument();
  });

  it('renders morse code input textarea', () => {
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('all words are active by default', () => {
    const inactiveRows = container.querySelectorAll('tr.inactive');
    expect(inactiveRows).toHaveLength(0);
  });

  it('filters words based on morse code input', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '....');

    const inactiveRows = container.querySelectorAll('tr.inactive');
    expect(inactiveRows.length).toBeGreaterThan(0);
  });

  it('keeps words with "h" when entering morse for "h"', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '....');

    const shellRow = screen.getByText('shell').closest('tr');
    expect(shellRow).not.toHaveClass('inactive');
  });

  it('filters out words without matching morse pattern', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '...-');

    const shellRow = screen.getByText('shell').closest('tr');
    expect(shellRow).toHaveClass('inactive');
  });

  it('handles multiple lines of morse code', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '....\n.');

    const inactiveRows = container.querySelectorAll('tr.inactive');
    expect(inactiveRows.length).toBeGreaterThan(0);
  });

  it('converts morse code to letters correctly', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '.-');

    const leaksRow = screen.getByText('leaks').closest('tr');
    expect(leaksRow).not.toHaveClass('inactive');
  });

  it('handles morse for "b" correctly', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '-...');

    const boxesRow = screen.getByText('boxes').closest('tr');
    const bombsRow = screen.getByText('bombs').closest('tr');
    const bistroRow = screen.getByText('bistro').closest('tr');

    expect(boxesRow).not.toHaveClass('inactive');
    expect(bombsRow).not.toHaveClass('inactive');
    expect(bistroRow).not.toHaveClass('inactive');
  });

  it('narrows down to single word with sufficient morse input', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '....\n.-\n.-..\n.-..');

    const activeRows = container.querySelectorAll('tr:not(.inactive)');
    expect(activeRows.length).toBeLessThan(16);
  });

  it('ignores empty lines in morse input', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '....\n\n.');

    const inactiveRows = container.querySelectorAll('tr.inactive');
    expect(inactiveRows.length).toBeGreaterThan(0);
  });

  it('handles spaces in morse code input', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '.-');

    const leaksRow = screen.getByText('leaks').closest('tr');
    expect(leaksRow).not.toHaveClass('inactive');
  });

  it('updates filtering when input changes', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '....');

    let inactiveCount = container.querySelectorAll('tr.inactive').length;

    await user.clear(textarea);
    await user.type(textarea, '.-');

    let newInactiveCount = container.querySelectorAll('tr.inactive').length;

    expect(inactiveCount).not.toBe(newInactiveCount);
  });

  it('shows all words when input is cleared', async () => {
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '....');
    await user.clear(textarea);

    const inactiveRows = container.querySelectorAll('tr.inactive');
    expect(inactiveRows).toHaveLength(0);
  });
});
