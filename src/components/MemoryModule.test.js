import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MemoryModule from './MemoryModule';

describe('MemoryModule', () => {
  let container;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<MemoryModule />);
    container = result.container;
  });

  it('renders reset button', () => {
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('renders table with 5 stages', () => {
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(6);
  });

  it('renders table headers', () => {
    expect(screen.getByText('Stage')).toBeInTheDocument();
    expect(screen.getByText('Display')).toBeInTheDocument();
    expect(screen.getByText('Pos.')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('renders input fields for each stage', () => {
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(15);
  });

  it('all inputs start empty', () => {
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveValue('');
    });
  });

  it('accepts valid number input (1-4)', async () => {
    const firstDisplayInput = screen.getByLabelText('Stage 1 display');
    await user.type(firstDisplayInput, '1');

    expect(firstDisplayInput).toHaveValue('1');
  });

  it('rejects invalid number input', async () => {
    const firstDisplayInput = screen.getByLabelText('Stage 1 display');
    await user.type(firstDisplayInput, '5');

    expect(firstDisplayInput).toHaveValue('');
  });

  it('rejects letter input', async () => {
    const firstDisplayInput = screen.getByLabelText('Stage 1 display');
    await user.type(firstDisplayInput, 'a');

    expect(firstDisplayInput).toHaveValue('');
  });

  it('auto-fills position or label when display is entered for stage 1', async () => {
    const stage1Display = screen.getByLabelText('Stage 1 display');
    await user.type(stage1Display, '1');

    const stage1Position = screen.getByLabelText('Stage 1 position');
    expect(stage1Position).toHaveValue('2');
  });

  it('auto-fills correctly for stage 1 display value 2', async () => {
    const stage1Display = screen.getByLabelText('Stage 1 display');
    await user.type(stage1Display, '2');

    const stage1Position = screen.getByLabelText('Stage 1 position');
    expect(stage1Position).toHaveValue('2');
  });

  it('auto-fills correctly for stage 1 display value 3', async () => {
    const stage1Display = screen.getByLabelText('Stage 1 display');
    await user.type(stage1Display, '3');

    const stage1Position = screen.getByLabelText('Stage 1 position');
    expect(stage1Position).toHaveValue('3');
  });

  it('auto-fills correctly for stage 1 display value 4', async () => {
    const stage1Display = screen.getByLabelText('Stage 1 display');
    await user.type(stage1Display, '4');

    const stage1Position = screen.getByLabelText('Stage 1 position');
    expect(stage1Position).toHaveValue('4');
  });

  it('allows manual input for the remaining field after auto-fill', async () => {
    const stage1Display = screen.getByLabelText('Stage 1 display');
    await user.type(stage1Display, '1');

    const stage1Label = screen.getByLabelText('Stage 1 label');
    await user.type(stage1Label, '3');

    expect(stage1Label).toHaveValue('3');
  });

  it('resets all fields when reset button is clicked', async () => {
    const stage1Display = screen.getByLabelText('Stage 1 display');
    await user.type(stage1Display, '1');

    const stage1Label = screen.getByLabelText('Stage 1 label');
    await user.type(stage1Label, '2');

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(stage1Display).toHaveValue('');
    expect(stage1Label).toHaveValue('');
  });

  it('limits input to single character', async () => {
    const stage1Display = screen.getByLabelText('Stage 1 display');
    await user.type(stage1Display, '123');

    expect(stage1Display).toHaveValue('1');
  });

  it('handles stage 2 logic based on stage 1 data', async () => {
    const stage1Display = screen.getByLabelText('Stage 1 display');
    const stage1Position = screen.getByLabelText('Stage 1 position');
    const stage1Label = screen.getByLabelText('Stage 1 label');

    await user.type(stage1Display, '1');
    await user.type(stage1Label, '3');

    const stage2Display = screen.getByLabelText('Stage 2 display');
    await user.type(stage2Display, '2');

    const stage2Position = screen.getByLabelText('Stage 2 position');
    expect(stage2Position).toHaveValue('2');
  });

  it('maintains data across multiple stages', async () => {
    await user.type(screen.getByLabelText('Stage 1 display'), '1');
    await user.type(screen.getByLabelText('Stage 1 label'), '2');

    await user.type(screen.getByLabelText('Stage 2 display'), '3');
    await user.type(screen.getByLabelText('Stage 2 label'), '4');

    expect(screen.getByLabelText('Stage 1 display')).toHaveValue('1');
    expect(screen.getByLabelText('Stage 1 label')).toHaveValue('2');
    expect(screen.getByLabelText('Stage 2 label')).toHaveValue('4');
  });
});
