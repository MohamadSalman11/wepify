export const generateElementDisplayMap = (elements: { id: string; name: string }[]): Record<string, string> => {
  const elementTypeCount: Record<string, number> = {};
  const displayMap: Record<string, string> = {};

  for (const el of elements) {
    const type = el.name;
    elementTypeCount[type] = (elementTypeCount[type] || 0) + 1;
    const displayName = `${type}-${elementTypeCount[type]}`;
    displayMap[displayName] = el.id;
  }

  return displayMap;
};
