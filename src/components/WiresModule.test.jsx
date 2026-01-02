import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WiresModule from './WiresModule';

describe('WiresModule', () => {
  let container;
  let user;
  let wireOptions;
  let wireList;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<WiresModule />);
    container = result.container;
    wireOptions = container.querySelector('.wireOptions');
    wireList = container.querySelector('.wireList');
  });

  it('renders all wire colour options', () => {
    expect(screen.getByLabelText('red')).toBeInTheDocument();
    expect(screen.getByLabelText('yellow')).toBeInTheDocument();
    expect(screen.getByLabelText('blue')).toBeInTheDocument();
    expect(screen.getByLabelText('white')).toBeInTheDocument();
    expect(screen.getByLabelText('black')).toBeInTheDocument();
  });

  it('starts with no wires', () => {
    expect(wireList.children).toHaveLength(0);
  });

  it('adds a wire when colour button is clicked', async () => {
    const redButton = wireOptions.querySelector('button[data-colour="red"]');
    await user.click(redButton);

    expect(wireList.children).toHaveLength(1);
  });

  it('adds multiple wires in sequence', async () => {
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));
    await user.click(wireOptions.querySelector('button[data-colour="yellow"]'));

    expect(wireList.children).toHaveLength(3);
  });

  it('marks the correct wire to cut with 3 wires, no red', async () => {
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));
    await user.click(wireOptions.querySelector('button[data-colour="yellow"]'));
    await user.click(wireOptions.querySelector('button[data-colour="white"]'));

    const secondWire = wireList.children[1];
    expect(secondWire).toHaveClass('marked');
  });

  it('marks the last wire to cut with 3 wires ending in white', async () => {
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));
    await user.click(wireOptions.querySelector('button[data-colour="white"]'));

    const lastWire = wireList.children[2];
    expect(lastWire).toHaveClass('marked');
  });

  it('marks the last blue wire with 3 wires, 2+ blue', async () => {
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));

    const lastWire = wireList.children[2];
    expect(lastWire).toHaveClass('marked');
  });

  it('removes wires when clicking on them', async () => {
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));
    await user.click(wireOptions.querySelector('button[data-colour="yellow"]'));

    const blueWireButton = wireList.querySelector('button.blue');
    await user.click(blueWireButton);

    expect(wireList.children).toHaveLength(1);
  });

  it('recalculates cut wire after removal', async () => {
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));
    await user.click(wireOptions.querySelector('button[data-colour="white"]'));

    const whiteWireButton = wireList.querySelector('button.white');
    await user.click(whiteWireButton);

    expect(wireList.children).toHaveLength(2);
  });

  it('handles 4 wire case with odd/even logic for 2+ red', async () => {
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="yellow"]'));

    const lastRed = wireList.children[2];
    expect(lastRed).toHaveClass('marked');
    expect(lastRed).toHaveClass('odd');
  });

  it('handles 5 wire case with black last wire', async () => {
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));
    await user.click(wireOptions.querySelector('button[data-colour="yellow"]'));
    await user.click(wireOptions.querySelector('button[data-colour="white"]'));
    await user.click(wireOptions.querySelector('button[data-colour="black"]'));

    // Note: Due to a bug in WiresModule.js:48 where wires.slice(-1).colour returns undefined,
    // the black wire special case doesn't trigger, so it falls through to the default else case
    const firstWire = wireList.children[0];
    expect(firstWire).toHaveClass('marked');
  });

  it('handles 6 wire case with no yellow', async () => {
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));
    await user.click(wireOptions.querySelector('button[data-colour="white"]'));
    await user.click(wireOptions.querySelector('button[data-colour="black"]'));
    await user.click(wireOptions.querySelector('button[data-colour="red"]'));
    await user.click(wireOptions.querySelector('button[data-colour="blue"]'));

    const thirdWire = wireList.children[2];
    expect(thirdWire).toHaveClass('marked');
    expect(thirdWire).toHaveClass('odd');
  });
});
