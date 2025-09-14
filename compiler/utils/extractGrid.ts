const REGEX_REPEAT = /repeat\((\d+),\s*([^)]+)\)/;

export const extractGridColumns = (gridTemplateColumns: string) => {
  const match = gridTemplateColumns.match(REGEX_REPEAT);
  const width = match ? match[2].trim() : 'auto';

  return {
    columns: match ? Number(match[1]) : 0,
    columnWidth: width === '1fr' ? 'auto' : width
  };
};

export const extractGridRows = (gridTemplateRows: string) => {
  const match = gridTemplateRows.match(REGEX_REPEAT);
  const height = match ? match[2].trim() : 'auto';

  return {
    rows: match ? Number(match[1]) : 0,
    rowHeight: height === '1fr' ? 'auto' : height
  };
};
