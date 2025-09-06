import { ElementsName } from '@shared/constants';
import { DeviceType, PageElement } from '@shared/typing';
import { DomCreator } from './DomCreator';

/**
 * Constants
 */

const TOP_LEVEL_PARENT_KEY = '__ROOT__';

/**
 * Class definition
 */

export class DomTreeBuilder {
  public domTree: HTMLElement[];
  private childrenByParent: Record<string, PageElement[]> = {};

  constructor(
    private elements: PageElement[],
    private device?: DeviceType
  ) {
    this.domTree = this.buildTree();
  }

  private buildTree(): HTMLElement[] {
    this.organizeByParent();
    return this.buildDomForParent(TOP_LEVEL_PARENT_KEY);
  }

  private organizeByParent() {
    const elementIds = new Set(this.elements.map((e) => e.id));

    for (const element of this.elements) {
      let parentId: string;

      if (element.name === ElementsName.Section) {
        parentId = TOP_LEVEL_PARENT_KEY;
      } else if (element.parentId && elementIds.has(element.parentId)) {
        parentId = element.parentId;
      } else {
        parentId = TOP_LEVEL_PARENT_KEY;
      }

      if (!this.childrenByParent[parentId]) {
        this.childrenByParent[parentId] = [];
      }

      this.childrenByParent[parentId].push(element);
    }
  }
  private buildDomForParent(parentId: string): HTMLElement[] {
    const childElements = this.childrenByParent[parentId] || [];
    const domElements: HTMLElement[] = [];

    for (const element of childElements) {
      const domEl = new DomCreator(element, this.device).domElement;
      const grandchildren = this.buildDomForParent(element.id);

      for (const grandchild of grandchildren) {
        domEl.append(grandchild);
      }

      domElements.push(domEl);
    }

    return domElements;
  }
}
