import type { GridElement } from '../types';

export function calculateNewGridColumns(selection: GridElement, childrenCount: number) {
  const { columns, rows } = selection;

  const maxItems = columns * rows;

  if (childrenCount >= maxItems) {
    return columns + 1;
  }

  return columns;
}
