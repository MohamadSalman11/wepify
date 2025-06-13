import type { GridElement } from '../../../types';

export function getSynchronizedGridUpdates(propName: string, selection: GridElement) {
  const updates = {} as any;

  if (propName === 'columnWidth') {
    updates.columns = selection.columns;
  }

  if (propName === 'columns') {
    updates.columnWidth = selection.columns;
  }

  if (propName === 'rowHeight') {
    updates.rows = selection.rows;
  }

  if (propName === 'rows') {
    updates.rowHeight = selection.rowHeight;
  }

  return updates;
}
