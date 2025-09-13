import { DomCreator } from '@compiler/dom/DomCreator';
import { PageElement, PageElementStyle } from '@shared/typing';
import { extractFlex } from './extractFlex';
import { extractGridColumns, extractGridRows } from './extractGrid';
import { extractTransform } from './extractTransform';
import { extractZIndex } from './extractZIndex';

const STYLE_DEPENDENCY_GROUPS: Record<string, DependencyGroup> = {
  transform: {
    props: ['left', 'top', 'rotate', 'scaleX', 'scaleY'],
    extractor: (currentEl) => extractTransform(currentEl.style.transform)
  },
  zIndex: {
    props: ['zIndex'],
    extractor: (currentEl) => extractZIndex(currentEl.style)
  },
  flex: {
    props: ['display', 'flexDirection', 'alignItems', 'justifyContent'],
    extractor: (currentEl) => extractFlex(currentEl.style)
  },
  gridTemplateColumns: {
    props: ['columns', 'columnWidth'],
    extractor: (currentEl) => extractGridColumns(currentEl.style.gridTemplateColumns)
  },
  gridTemplateRows: {
    props: ['rows', 'rowHeight'],
    extractor: (currentEl) => extractGridRows(currentEl.style.gridTemplateRows)
  }
};

type StyleUpdates = {
  [K in keyof PageElementStyle]?: string | number;
};

type DependencyGroup = {
  props: (keyof PageElementStyle)[];
  extractor?: (currentEl: HTMLElement) => StyleUpdates;
};

export const resolveStyleDependencies = (style: StyleUpdates, el: HTMLElement | PageElement) => {
  const resolved: StyleUpdates = {};

  for (const { props, extractor } of Object.values(STYLE_DEPENDENCY_GROUPS)) {
    const isUpdated = props.some((prop) => prop in style);

    if (!isUpdated) {
      continue;
    }

    const currentValues = extractor?.(el instanceof HTMLElement ? el : new DomCreator(el).domElement) ?? {};

    for (const key of Object.keys(currentValues)) {
      resolved[key as keyof PageElementStyle] =
        style[key as keyof PageElementStyle] ?? currentValues[key as keyof PageElementStyle];
    }
  }

  return { ...style, ...resolved };
};
