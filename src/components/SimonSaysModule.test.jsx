import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SimonSaysModule from './SimonSaysModule';

describe('SimonSaysModule', () => {
  let container;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<SimonSaysModule />);
    container = result.container;
  });

  it('renders vowel checkbox', () => {
    expect(screen.getByLabelText('Vowel')).toBeInTheDocument();
  });

  it('renders strike radio buttons', () => {
    expect(screen.getByLabelText('0 strikes')).toBeInTheDocument();
    expect(screen.getByLabelText('1 strikes')).toBeInTheDocument();
    expect(screen.getByLabelText('2 strikes')).toBeInTheDocument();
  });

  it('has 0 strikes selected by default', () => {
    const zeroStrikes = screen.getByLabelText('0 strikes');
    expect(zeroStrikes).toBeChecked();
  });

  it('renders Simon board with coloured sections', () => {
    expect(container.querySelector('.simonBlue')).toBeInTheDocument();
    expect(container.querySelector('.simonYellow')).toBeInTheDocument();
    expect(container.querySelector('.simonRed')).toBeInTheDocument();
    expect(container.querySelector('.simonGreen')).toBeInTheDocument();
  });

  it('displays arrows for 0 strikes without vowel', () => {
    expect(container.querySelector('#arrowRB')).toBeInTheDocument();
    expect(container.querySelector('#arrowBY')).toBeInTheDocument();
    expect(container.querySelector('#arrowYR')).toBeInTheDocument();
  });

  it('displays different arrows for 1 strike without vowel', async () => {
    await user.click(screen.getByLabelText('1 strikes'));

    expect(container.querySelector('#arrowGY')).toBeInTheDocument();
    expect(container.querySelector('#arrowYG')).toBeInTheDocument();
  });

  it('displays different arrows for 2 strikes without vowel', async () => {
    await user.click(screen.getByLabelText('2 strikes'));

    expect(container.querySelector('#arrowRY')).toBeInTheDocument();
    expect(container.querySelector('#arrowBG')).toBeInTheDocument();
    expect(container.querySelector('#arrowGB')).toBeInTheDocument();
    expect(container.querySelector('#arrowYR')).toBeInTheDocument();
  });

  it('displays different arrows with vowel', async () => {
    await user.click(screen.getByLabelText('Vowel'));

    expect(container.querySelector('#arrowRB')).toBeInTheDocument();
    expect(container.querySelector('#arrowBR')).toBeInTheDocument();
    expect(container.querySelector('#arrowGY')).toBeInTheDocument();
    expect(container.querySelector('#arrowYG')).toBeInTheDocument();
  });

  it('displays correct arrows for 1 strike with vowel', async () => {
    await user.click(screen.getByLabelText('Vowel'));
    await user.click(screen.getByLabelText('1 strikes'));

    expect(container.querySelector('#arrowRY')).toBeInTheDocument();
    expect(container.querySelector('#arrowBG')).toBeInTheDocument();
    expect(container.querySelector('#arrowGB')).toBeInTheDocument();
    expect(container.querySelector('#arrowYR')).toBeInTheDocument();
  });

  it('displays correct arrows for 2 strikes with vowel', async () => {
    await user.click(screen.getByLabelText('Vowel'));
    await user.click(screen.getByLabelText('2 strikes'));

    expect(container.querySelector('#arrowRG')).toBeInTheDocument();
    expect(container.querySelector('#arrowBR')).toBeInTheDocument();
    expect(container.querySelector('#arrowGY')).toBeInTheDocument();
    expect(container.querySelector('#arrowYB')).toBeInTheDocument();
  });

  it('toggles vowel checkbox', async () => {
    const vowelCheckbox = screen.getByLabelText('Vowel');
    expect(vowelCheckbox).not.toBeChecked();

    await user.click(vowelCheckbox);
    expect(vowelCheckbox).toBeChecked();

    await user.click(vowelCheckbox);
    expect(vowelCheckbox).not.toBeChecked();
  });

  it('updates arrows when changing both vowel and strikes', async () => {
    await user.click(screen.getByLabelText('Vowel'));
    await user.click(screen.getByLabelText('2 strikes'));

    expect(container.querySelector('#arrowRG')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Vowel'));

    expect(container.querySelector('#arrowRG')).not.toBeInTheDocument();
    expect(container.querySelector('#arrowRY')).toBeInTheDocument();
  });
});
