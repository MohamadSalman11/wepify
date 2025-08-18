export const assignUniqueIdsToDomElementTree = (elementNode: HTMLElement) => {
  const baseName = elementNode.dataset.name;
  if (!baseName) return;

  const sameElements = [...document.querySelectorAll(`[id^="${baseName}-"]`)];

  let index = 1;
  for (const sameElement of sameElements) {
    sameElement.id = `${baseName}-${index++}`;
  }

  for (const child of [...elementNode.children] as HTMLElement[]) {
    assignUniqueIdsToDomElementTree(child);
  }
};
