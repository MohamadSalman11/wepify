import { parseGridRepeat } from './parseGridRepeat';

export const adjustGridColumnsIfNeeded = (gridElement: HTMLElement) => {
  const { size, count: columns } = parseGridRepeat(gridElement.style.gridTemplateColumns);
  const { count: rows } = parseGridRepeat(gridElement.style.gridTemplateRows);
  const maxItems = columns * rows;
  const childrenCount = gridElement.children.length;

  if (childrenCount > maxItems) {
    gridElement.style.gridTemplateColumns = `repeat(${columns + 1}, ${size === 'auto' ? '1fr' : `${size}px`})`;
  }
};
