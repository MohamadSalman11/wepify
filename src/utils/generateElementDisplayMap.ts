export const generateElementDisplayMap = (elements: { id: string; name: string }[]): Record<string, string> => {
  const elementTypeCount: Record<string, number> = {};
  const displayMap: Record<string, string> = {};

  const sortedElements = [...elements].sort((a, b) => a.name.localeCompare(b.name));

  for (const el of sortedElements) {
    const type = el.name;
    elementTypeCount[type] = (elementTypeCount[type] || 0) + 1;
    const displayName = `${type}-${elementTypeCount[type]}`;
    displayMap[displayName] = el.id;
  }

  return displayMap;
};
