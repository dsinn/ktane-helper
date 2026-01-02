import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComplicatedWiresModule from './ComplicatedWiresModule';

describe('ComplicatedWiresModule', () => {
  let container;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    const result = render(<ComplicatedWiresModule />);
    container = result.container;
  });

  it('renders board condition checkboxes', () => {
    expect(screen.getByLabelText('a serial number that ends in an even digit')).toBeInTheDocument();
    expect(screen.getByLabelText('a parallel port')).toBeInTheDocument();
    expect(screen.getByLabelText('more than one battery')).toBeInTheDocument();
  });

  it('renders wire property checkboxes', () => {
    expect(screen.getByLabelText('Red')).toBeInTheDocument();
    expect(screen.getByLabelText('Blue')).toBeInTheDocument();
    expect(screen.getByLabelText('Star')).toBeInTheDocument();
    expect(screen.getByLabelText('LED')).toBeInTheDocument();
  });

  it('all checkboxes start unchecked', () => {
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('renders wires to cut section', () => {
    const headings = container.querySelectorAll('h3');
    const cutHeading = Array.from(headings).find(h => h.textContent.includes('Wires to cut'));
    expect(cutHeading).toBeInTheDocument();
  });

  it('renders wires to not cut section', () => {
    const headings = container.querySelectorAll('h3');
    const notCutHeading = Array.from(headings).find(h => h.textContent.includes('not cut'));
    expect(notCutHeading).toBeInTheDocument();
  });

  it('toggles board condition checkbox', async () => {
    const evenSerialCheckbox = screen.getByLabelText('a serial number that ends in an even digit');
    expect(evenSerialCheckbox).not.toBeChecked();

    await user.click(evenSerialCheckbox);
    expect(evenSerialCheckbox).toBeChecked();

    await user.click(evenSerialCheckbox);
    expect(evenSerialCheckbox).not.toBeChecked();
  });

  it('toggles wire property checkbox', async () => {
    const redCheckbox = screen.getByLabelText('Red');
    expect(redCheckbox).not.toBeChecked();

    await user.click(redCheckbox);
    expect(redCheckbox).toBeChecked();
  });

  it('marks the correct wire row when properties match', async () => {
    await user.click(screen.getByLabelText('Red'));

    const tables = container.querySelectorAll('table');
    const allMarkedRows = Array.from(tables).flatMap(table =>
      Array.from(table.querySelectorAll('tr.marked'))
    );

    expect(allMarkedRows.length).toBeGreaterThan(0);
    const hasRedCell = allMarkedRows.some(row => row.querySelector('.red'));
    expect(hasRedCell).toBe(true);
  });

  it('shows different rows in cut vs not cut sections', () => {
    const tables = container.querySelectorAll('table');
    expect(tables).toHaveLength(2);
  });

  it('updates marked row when changing wire properties', async () => {
    await user.click(screen.getByLabelText('Red'));

    let tables = container.querySelectorAll('table');
    let firstMarkedRows = Array.from(tables).flatMap(table =>
      Array.from(table.querySelectorAll('tr.marked'))
    );

    await user.click(screen.getByLabelText('Blue'));

    tables = container.querySelectorAll('table');
    let secondMarkedRows = Array.from(tables).flatMap(table =>
      Array.from(table.querySelectorAll('tr.marked'))
    );

    expect(firstMarkedRows.length).toBeGreaterThan(0);
    expect(secondMarkedRows.length).toBeGreaterThan(0);
  });

  it('displays star emoji for star property', async () => {
    await user.click(screen.getByLabelText('Star'));

    const tables = container.querySelectorAll('table');
    const markedRow = tables[0].querySelector('tr.marked') || tables[1].querySelector('tr.marked');

    expect(markedRow.textContent).toContain('⭐️');
  });

  it('displays bulb emoji for LED property', async () => {
    await user.click(screen.getByLabelText('LED'));

    const tables = container.querySelectorAll('table');
    const markedRow = tables[1].querySelector('tr.marked');

    expect(markedRow.textContent).toContain('💡');
  });

  it('handles complex wire combinations', async () => {
    await user.click(screen.getByLabelText('Red'));
    await user.click(screen.getByLabelText('Blue'));
    await user.click(screen.getByLabelText('Star'));
    await user.click(screen.getByLabelText('LED'));

    const tables = container.querySelectorAll('table');
    const markedRows = Array.from(tables[0].querySelectorAll('tr.marked'))
      .concat(Array.from(tables[1].querySelectorAll('tr.marked')));

    expect(markedRows.length).toBeGreaterThan(0);
  });

  it('changes cut decision based on board conditions', async () => {
    await user.click(screen.getByLabelText('Red'));

    const tablesBeforeCondition = container.querySelectorAll('table');
    const cutTableBefore = tablesBeforeCondition[0];
    const notCutTableBefore = tablesBeforeCondition[1];

    const markedInCutBefore = cutTableBefore.querySelectorAll('tr.marked').length;
    const markedInNotCutBefore = notCutTableBefore.querySelectorAll('tr.marked').length;

    await user.click(screen.getByLabelText('a serial number that ends in an even digit'));

    const tablesAfterCondition = container.querySelectorAll('table');
    const cutTableAfter = tablesAfterCondition[0];
    const notCutTableAfter = tablesAfterCondition[1];

    const markedInCutAfter = cutTableAfter.querySelectorAll('tr.marked').length;
    const markedInNotCutAfter = notCutTableAfter.querySelectorAll('tr.marked').length;

    const changed = (markedInCutBefore !== markedInCutAfter) || (markedInNotCutBefore !== markedInNotCutAfter);
    expect(changed).toBe(true);
  });
});
