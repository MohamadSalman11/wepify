import { Site } from '@shared/types';
import { generateInlineStyles } from './dom/generateInlineStyles';

function toCssProp(prop: string): string {
  return prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}

function styleObjectToCssDeclarations(styleObj: Partial<Record<string, string | number>>): string[] {
  return Object.entries(styleObj)
    .map(([key, value]) => {
      if (value === undefined || value === null) return '';
      const cssKey = toCssProp(key);
      return `${cssKey}: ${value};`;
    })
    .filter(Boolean);
}

function buildCss(selectorsStyles: Record<string, Partial<Record<string, string | number>>>) {
  return Object.entries(selectorsStyles)
    .map(([selector, styles]) => {
      const decls = styleObjectToCssDeclarations(styles);
      if (decls.length === 0) return '';
      return `${selector} {\n  ${decls.join('\n  ')}\n}`;
    })
    .filter(Boolean)
    .join('\n\n');
}

function buildMediaQuery(maxWidth: number, selectorsStyles: Record<string, Partial<Record<string, string | number>>>) {
  const css = buildCss(selectorsStyles);
  if (!css) return '';
  return `@media (max-width: ${maxWidth}px) {\n${css.replace(/^/gm, '  ')}\n}`;
}

function processElement(
  elem: any,
  baseStyles: Record<string, Partial<Record<string, string | number>>>,
  tabletStyles: Record<string, Partial<Record<string, string | number>>>
) {
  if (!elem.id) return;
  const id = `#${elem.id}`;
  const baseStyle = generateInlineStyles(elem, false);
  const tabletStyle = generateInlineStyles(elem, true);

  baseStyles[id] = baseStyle as Partial<Record<string, string | number>>;

  const tabletDiffStyle: Partial<Record<string, string | number>> = {};

  for (const key in tabletStyle) {
    if (tabletStyle[key] !== baseStyle[key]) {
      tabletDiffStyle[key] = tabletStyle[key];
    }
  }

  if (Object.keys(tabletDiffStyle).length > 0) {
    tabletStyles[id] = tabletDiffStyle;
  }

  if (Array.isArray(elem.children)) {
    for (const key in elem.children) {
      processElement(elem.children[key], baseStyles, tabletStyles);
    }
  }
}

export const generateCssFiles = (site: Site) => {
  const baseStyles: Record<string, Partial<Record<string, string | number>>> = {};
  const tabletStyles: Record<string, Partial<Record<string, string | number>>> = {};

  for (const pageIndex in site.pages) {
    const page = site.pages[pageIndex];
    for (const elemIndex in page.elements) {
      const elem = page.elements[elemIndex];
      processElement(elem, baseStyles, tabletStyles);
    }
  }

  const indexCss = buildCss(baseStyles);
  const responsiveCss = buildMediaQuery(768, tabletStyles);

  return { indexCss, responsiveCss };
};
