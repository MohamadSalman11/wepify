export const assignUniqueId = (el: HTMLElement) => {
  const obj: Record<string, number> = {};

  const assignIdRecursive = (element: HTMLElement) => {
    const baseName = element.dataset.name;
    if (!baseName) return;

    obj[baseName] = (obj[baseName] ?? document.querySelectorAll(`[id^="${baseName}-"]`).length) + 1;

    const newId = `${baseName}-${obj[baseName]}`;
    element.id = newId;

    for (const child of element.children) {
      assignIdRecursive(child as HTMLElement);
    }
  };

  assignIdRecursive(el);
};
