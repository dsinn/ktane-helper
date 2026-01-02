import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonModule from './ButtonModule';

describe('ButtonModule', () => {
  let container;
  let user;
  let bigButton;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<ButtonModule />);
    container = result.container;
    bigButton = container.querySelector('.bigButton');
  });

  it('renders with default blue button and Abort text', () => {
    expect(bigButton).toHaveTextContent('Abort');
    expect(bigButton).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('renders all colour options', () => {
    expect(container.querySelector('input[value="blue"]')).toBeInTheDocument();
    expect(container.querySelector('input[value="white"]')).toBeInTheDocument();
    expect(container.querySelector('input[value="yellow"]')).toBeInTheDocument();
    expect(container.querySelector('input[value="red"]')).toBeInTheDocument();
  });

  it('renders all text options', () => {
    expect(screen.getByLabelText('Abort')).toBeInTheDocument();
    expect(screen.getByLabelText('Detonate')).toBeInTheDocument();
    expect(screen.getByLabelText('Hold')).toBeInTheDocument();
    expect(screen.getByLabelText('Press')).toBeInTheDocument();
  });

  it('changes button colour when selecting different colour', async () => {
    const redRadio = container.querySelector('input[value="red"]');
    await user.click(redRadio);

    expect(bigButton).toHaveStyle({ backgroundColor: 'red' });
  });

  it('changes button text when selecting different text', async () => {
    const detonateRadio = screen.getByLabelText('Detonate');
    await user.click(detonateRadio);

    expect(bigButton).toHaveTextContent('Detonate');
  });

  it('shows correct instruction for Detonate text', async () => {
    await user.click(screen.getByLabelText('Detonate'));

    expect(screen.getByText(/If 2\+ 🔋, press and release/)).toBeInTheDocument();
  });

  it('shows correct instruction for blue + abort combination', () => {
    // Default is blue + Abort
    expect(screen.getByText('Hold button.')).toBeInTheDocument();
  });

  it('shows correct instruction for red + hold combination', async () => {
    await user.click(container.querySelector('input[value="red"]'));
    await user.click(screen.getByLabelText('Hold'));

    expect(screen.getByText('Press and release.')).toBeInTheDocument();
  });

  it('shows strip colour release instructions', () => {
    const text = container.textContent;
    expect(text).toMatch(/Blue.*4/);
    expect(text).toMatch(/Yellow.*5/);
    expect(text).toMatch(/Other.*1/);
  });

  it('applies correct text colour for white button', async () => {
    await user.click(container.querySelector('input[value="white"]'));

    const buttonText = bigButton.querySelector('span');
    expect(buttonText).toHaveStyle({ color: 'black' });
  });

  it('applies correct text colour for blue button', () => {
    const buttonText = bigButton.querySelector('span');
    expect(buttonText).toHaveStyle({ color: 'white' });
  });
});
