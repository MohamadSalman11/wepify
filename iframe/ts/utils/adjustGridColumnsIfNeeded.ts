import { MessageFromIframe } from '@shared/typing';
import { maybeWrapWithBreakpoint } from './maybeWrapWithBreakpoint';
import { parseGridRepeat } from './parseGridRepeat';
import { postMessageToApp } from './postMessageToApp';

export const adjustGridColumnsIfNeeded = (gridElement: HTMLDivElement) => {
  const { size, count: columns } = parseGridRepeat(gridElement.style.gridTemplateColumns);
  const { count: rows } = parseGridRepeat(gridElement.style.gridTemplateRows);
  const maxItems = columns * rows;
  const childrenCount = gridElement.children.length;
  const newColumns = columns + 1;

  if (childrenCount > maxItems) {
    gridElement.style.gridTemplateColumns = `repeat(${newColumns}, ${size === 'auto' ? '1fr' : `${size}px`})`;

    postMessageToApp({
      type: MessageFromIframe.ElementUpdated,
      payload: { id: gridElement.id, fields: { ...maybeWrapWithBreakpoint({ columns: newColumns }) } }
    });
  }
};
