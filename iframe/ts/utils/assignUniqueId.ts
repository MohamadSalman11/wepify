import { PageElement } from '@shared/typing';

export const assignUniqueId = (elementNode: HTMLElement, pageElement?: Partial<PageElement>) => {
  const obj: Record<string, number> = {};

  const assignIdRecursive = (node: HTMLElement, el?: Partial<PageElement>) => {
    const baseName = node.dataset.name;
    if (!baseName) return;

    obj[baseName] = (obj[baseName] ?? document.querySelectorAll(`[id^="${baseName}-"]`).length) + 1;
    const newId = `${baseName}-${obj[baseName]}`;

    node.id = newId;

    if (el) {
      el.id = newId;
    }

    const nodeChildren = [...node.children] as HTMLElement[];

    if (el?.children && el.children.length > 0) {
      for (const [i, childNode] of nodeChildren.entries()) {
        assignIdRecursive(childNode, el.children[i]);
      }
    } else {
      for (const child of nodeChildren) {
        assignIdRecursive(child);
      }
    }
  };

  assignIdRecursive(elementNode, pageElement);
};
