export function flattenElements(elements) {
  const result = [];

  function traverse(elList) {
    for (const el of elList) {
      result.push(el);
      if (el.children && el.children.length > 0) {
        traverse(el.children);
      }
    }
  }

  traverse(elements);

  return result;
}
