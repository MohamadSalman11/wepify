const REGEX_REPEAT = /repeat\((\d+),\s*([^)]+)\)/;

export const extractGridColumns = (gridTemplateColumns: string) => {
  const match = gridTemplateColumns.match(REGEX_REPEAT);

  return {
    columns: match ? Number(match[1]) : 0,
    columnWidth: match ? (match[2] as number | 'auto') : 'auto'
  };
};

export const extractGridRows = (gridTemplateRows: string) => {
  const match = gridTemplateRows.match(REGEX_REPEAT);

  return {
    rows: match ? Number(match[1]) : 0,
    rowHeight: match ? (match[2] as number | 'auto') : 'auto'
  };
};
