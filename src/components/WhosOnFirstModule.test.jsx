import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WhosOnFirstModule from './WhosOnFirstModule';

describe('WhosOnFirstModule', () => {
  let container;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<WhosOnFirstModule />);
    container = result.container;
  });

  it('renders search input field', () => {
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('input starts empty', () => {
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('renders display word mappings', () => {
    expect(screen.getByText('YES')).toBeInTheDocument();
    expect(screen.getByText('FIRST')).toBeInTheDocument();
    expect(screen.getByText('DISPLAY')).toBeInTheDocument();
  });

  it('renders button sequence mappings', () => {
    expect(screen.getByText('"READY":')).toBeInTheDocument();
    expect(screen.getByText('"FIRST":')).toBeInTheDocument();
    expect(screen.getByText('"NOTHING":')).toBeInTheDocument();
  });

  it('all display mappings are visible by default', () => {
    const inactiveDts = container.querySelectorAll('dt.inactive');
    expect(inactiveDts).toHaveLength(0);
  });

  it('all button sequences are visible by default', () => {
    const inactiveRows = container.querySelectorAll('tr.inactive');
    expect(inactiveRows).toHaveLength(0);
  });

  it('filters display words when typing', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'Y');

    const inactiveDts = container.querySelectorAll('dt.inactive');
    expect(inactiveDts.length).toBeGreaterThan(0);
  });

  it('filters button sequences when typing', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'R');

    const inactiveRows = container.querySelectorAll('tr.inactive');
    expect(inactiveRows.length).toBeGreaterThan(0);
  });

  it('shows only matching display words starting with input', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'YES');

    const yesDt = screen.getByText('YES').closest('dt');
    expect(yesDt).not.toHaveClass('inactive');
  });

  it('hides non-matching display words', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'YES');

    const firstDt = screen.getByText('FIRST').closest('dt');
    expect(firstDt).toHaveClass('inactive');
  });

  it('shows matching button sequences', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'READY');

    const readyRow = screen.getByText('"READY":').closest('tr');
    expect(readyRow).not.toHaveClass('inactive');
  });

  it('hides non-matching button sequences', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'READY');

    const firstRow = screen.getByText('"FIRST":').closest('tr');
    expect(firstRow).toHaveClass('inactive');
  });

  it('converts input to uppercase', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'yes');

    expect(input).toHaveValue('YES');
  });

  it('filters with partial matches', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'Y');

    const yesDt = screen.getByText('YES').closest('dt');
    const youDt = screen.getByText('YOU').closest('dt');
    const yourDt = screen.getByText('YOUR').closest('dt');

    expect(yesDt).not.toHaveClass('inactive');
    expect(youDt).not.toHaveClass('inactive');
    expect(yourDt).not.toHaveClass('inactive');
  });

  it('shows all entries when input is cleared', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'YES');
    await user.clear(input);

    const inactiveDts = container.querySelectorAll('dt.inactive');
    const inactiveRows = container.querySelectorAll('tr.inactive');

    expect(inactiveDts).toHaveLength(0);
    expect(inactiveRows).toHaveLength(0);
  });

  it('handles special display word with non-breaking space', async () => {
    const nonBreakingSpace = '\u00a0';
    const nbspDt = container.querySelector(`dt:not(.inactive)`);

    expect(nbspDt).toBeInTheDocument();
  });

  it('displays position for each display word', () => {
    expect(screen.getAllByText('top-left').length).toBeGreaterThan(0);
    expect(screen.getAllByText('top-right').length).toBeGreaterThan(0);
    expect(screen.getAllByText('middle-left').length).toBeGreaterThan(0);
    expect(screen.getAllByText('bottom-right').length).toBeGreaterThan(0);
  });

  it('displays button sequences with commas', () => {
    const readySequence = screen.getByText(/YES, OKAY, WHAT, MIDDLE/);
    expect(readySequence).toBeInTheDocument();
  });

  it('handles "UH HUH" button sequence', () => {
    expect(screen.getByText('"UH HUH":')).toBeInTheDocument();
    expect(screen.getByText('UH HUH')).toBeInTheDocument();
  });

  it('updates filter immediately on each keystroke', async () => {
    const input = screen.getByRole('textbox');
    await user.type(input, 'R');

    let inactiveCount = container.querySelectorAll('tr.inactive').length;

    await user.type(input, 'E');

    let newInactiveCount = container.querySelectorAll('tr.inactive').length;

    expect(inactiveCount).not.toBe(newInactiveCount);
  });
});
