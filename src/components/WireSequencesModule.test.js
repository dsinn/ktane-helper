import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WireSequencesModule from './WireSequencesModule';

describe('WireSequencesModule', () => {
  let container;
  let user;
  let sequenceOptions;
  let instructionList;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<WireSequencesModule />);
    container = result.container;
    sequenceOptions = container.querySelector('#sequenceOptions');
    instructionList = container.querySelector('#sequenceInstruction');
  });

  it('renders wire options for all colors and letters', () => {
    ['A', 'B', 'C'].forEach(letter => {
      ['red', 'blue', 'black'].forEach(color => {
        const buttons = screen.getAllByText(letter);
        const colorButton = buttons.find(btn =>
          btn.classList.contains(color)
        );
        expect(colorButton).toBeInTheDocument();
      });
    });
  });

  it('starts with no wires in the sequence', () => {
    expect(instructionList.children).toHaveLength(0);
  });

  it('adds a wire to the sequence when button is clicked', async () => {
    const redAButton = sequenceOptions.querySelector('button.red[data-letter="A"]');
    await user.click(redAButton);

    expect(instructionList.children).toHaveLength(1);
  });

  it('displays correct cut instruction for first red wire to A', async () => {
    const redAButton = sequenceOptions.querySelector('button.red[data-letter="A"]');
    await user.click(redAButton);

    expect(screen.getByText('Ignore')).toBeInTheDocument();
  });

  it('displays correct cut instruction for first red wire to C', async () => {
    const redCButton = sequenceOptions.querySelector('button.red[data-letter="C"]');
    await user.click(redCButton);

    expect(screen.getByText('Cut')).toBeInTheDocument();
  });

  it('displays correct instruction for first blue wire to B', async () => {
    const blueBButton = sequenceOptions.querySelector('button.blue[data-letter="B"]');
    await user.click(blueBButton);

    expect(screen.getByText('Cut')).toBeInTheDocument();
  });

  it('displays correct instruction for first black wire to A', async () => {
    const blackAButton = sequenceOptions.querySelector('button.black[data-letter="A"]');
    await user.click(blackAButton);

    expect(screen.getByText('Cut')).toBeInTheDocument();
  });

  it('tracks wire count per colour independently', async () => {
    const redCButton = sequenceOptions.querySelector('button.red[data-letter="C"]');
    const blueBButton = sequenceOptions.querySelector('button.blue[data-letter="B"]');

    await user.click(redCButton);
    await user.click(blueBButton);

    expect(instructionList.children).toHaveLength(2);
  });

  it('applies different rules for second occurrence of same colour', async () => {
    const redCButton = sequenceOptions.querySelector('button.red[data-letter="C"]');
    const redBButton = sequenceOptions.querySelector('button.red[data-letter="B"]');

    await user.click(redCButton);
    await user.click(redBButton);

    const instructions = screen.getAllByText(/Cut|Ignore/);
    expect(instructions).toHaveLength(2);
  });

  it('removes wire and all subsequent wires when clicked', async () => {
    const redCButton = sequenceOptions.querySelector('button.red[data-letter="C"]');
    const blueBButton = sequenceOptions.querySelector('button.blue[data-letter="B"]');
    const blackAButton = sequenceOptions.querySelector('button.black[data-letter="A"]');

    await user.click(redCButton);
    await user.click(blueBButton);
    await user.click(blackAButton);

    expect(instructionList.children).toHaveLength(3);

    const blueWireButton = instructionList.querySelector('button.blue');
    await user.click(blueWireButton);

    expect(instructionList.children).toHaveLength(1);
  });

  it('prevents adding more than 9 wires of same colour', async () => {
    const redAButton = sequenceOptions.querySelector('button.red[data-letter="A"]');

    for (let i = 0; i < 10; i++) {
      await user.click(redAButton);
    }

    expect(instructionList.children).toHaveLength(9);
  });

  it('recalculates instructions after wire removal', async () => {
    const redCButton = sequenceOptions.querySelector('button.red[data-letter="C"]');
    const redBButton = sequenceOptions.querySelector('button.red[data-letter="B"]');

    await user.click(redCButton);
    await user.click(redBButton);

    const firstWireButton = instructionList.querySelector('button.red');
    await user.click(firstWireButton);

    expect(instructionList.children).toHaveLength(0);
  });

  it('maintains correct colour counts across additions and removals', async () => {
    const redCButton = sequenceOptions.querySelector('button.red[data-letter="C"]');
    const blueBButton = sequenceOptions.querySelector('button.blue[data-letter="B"]');

    await user.click(redCButton);
    await user.click(blueBButton);
    await user.click(redCButton);

    expect(instructionList.children).toHaveLength(3);

    const secondWire = instructionList.children[1].querySelector('button');
    await user.click(secondWire);

    expect(instructionList.children).toHaveLength(1);
  });
});
