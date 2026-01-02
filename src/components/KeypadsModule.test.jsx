import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KeypadsModule from './KeypadsModule';

describe('KeypadsModule', () => {
  let container;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<KeypadsModule />);
    container = result.container;
  });

  it('renders reset button', () => {
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('renders 6 columns of symbols', () => {
    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(6);
  });

  it('renders 7 symbols per column', () => {
    const lists = screen.getAllByRole('list');
    lists.forEach(list => {
      expect(list.children).toHaveLength(7);
    });
  });

  it('renders symbol images', () => {
    const balloons = screen.getAllByAltText('balloon');
    expect(balloons.length).toBeGreaterThan(0);
    expect(balloons[0]).toHaveAttribute('src', 'keypads/balloon.png');
  });

  it('highlights a symbol when clicked', async () => {
    const balloons = screen.getAllByAltText('balloon');
    const listItem = balloons[0].closest('li');

    expect(listItem).not.toHaveClass('selected');

    await user.click(listItem);

    expect(listItem).toHaveClass('selected');
  });

  it('unhighlights a symbol when clicked again', async () => {
    const balloons = screen.getAllByAltText('balloon');
    const listItem = balloons[0].closest('li');

    await user.click(listItem);
    expect(listItem).toHaveClass('selected');

    await user.click(listItem);
    expect(listItem).not.toHaveClass('selected');
  });

  it('marks columns as matching when 4 symbols are selected', async () => {
    const lists = screen.getAllByRole('list');
    const firstColumn = lists[0];

    const symbols = Array.from(firstColumn.querySelectorAll('li'));
    await user.click(symbols[0]);
    await user.click(symbols[1]);
    await user.click(symbols[2]);

    expect(firstColumn).not.toHaveClass('matching');

    await user.click(symbols[3]);

    expect(firstColumn).toHaveClass('matching');
  });

  it('updates multiple columns when selecting symbols that appear in multiple columns', async () => {
    const balloons = screen.getAllByAltText('balloon');
    await user.click(balloons[0].closest('li'));

    const lists = screen.getAllByRole('list');
    expect(lists[0].querySelector('.selected')).toBeInTheDocument();
    expect(lists[1].querySelector('.selected')).toBeInTheDocument();
  });

  it('resets state when reset button is clicked', async () => {
    const balloons = screen.getAllByAltText('balloon');
    await user.click(balloons[0].closest('li'));

    expect(balloons[0].closest('li')).toHaveClass('selected');

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(balloons[0].closest('li')).not.toHaveClass('selected');
  });

  it('removes matching class when resetting', async () => {
    const lists = screen.getAllByRole('list');
    const firstColumn = lists[0];
    const symbols = Array.from(firstColumn.querySelectorAll('li'));

    await user.click(symbols[0]);
    await user.click(symbols[1]);
    await user.click(symbols[2]);
    await user.click(symbols[3]);

    expect(firstColumn).toHaveClass('matching');

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(firstColumn).not.toHaveClass('matching');
  });

  it('handles selecting and deselecting symbols across columns', async () => {
    const hookns = screen.getAllByAltText('hookn');
    await user.click(hookns[0].closest('li'));

    const lists = screen.getAllByRole('list');
    const columnsWithHookn = [lists[0], lists[1]];

    columnsWithHookn.forEach(column => {
      expect(column.querySelector('.selected')).toBeInTheDocument();
    });

    await user.click(hookns[0].closest('li'));

    columnsWithHookn.forEach(column => {
      expect(column.querySelector('.selected')).not.toBeInTheDocument();
    });
  });
});
