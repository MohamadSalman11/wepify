import { RESPONSIVE_PROPS } from '@shared/constants';
import { Site } from '@shared/types';
import { generateInlineStyles } from './dom/generateInlineStyles';
import { mergeStyles } from './mergeStyle';

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
  element: any,
  baseStyles: Record<string, Partial<Record<string, string | number>>>,
  laptopStyles: Record<string, Partial<Record<string, string | number>>>,
  tabletStyles: Record<string, Partial<Record<string, string | number>>>,
  phoneStyles: Record<string, Partial<Record<string, string | number>>>
) {
  if (!element.id) return;
  const id = `#${element.id}`;
  const baseStyle = mergeStyles(generateInlineStyles({ element, deviceType: 'monitor' }));
  const laptopStyle = mergeStyles(generateInlineStyles({ element, deviceType: 'laptop' }));
  const tabletStyle = mergeStyles(generateInlineStyles({ element, deviceType: 'tablet' }));
  const phoneStyle = mergeStyles(generateInlineStyles({ element, deviceType: 'smartphone' }));

  baseStyles[id] = baseStyle;

  const diffs = [
    { style: laptopStyle, target: laptopStyles },
    { style: tabletStyle, target: tabletStyles },
    { style: phoneStyle, target: phoneStyles }
  ];

  for (const { style, target } of diffs) {
    const diffStyle: Partial<Record<string, string | number>> = {};
    for (const key in style) {
      if (RESPONSIVE_PROPS.has(key) && style[key] !== baseStyle[key]) {
        diffStyle[key] = style[key];
      }
    }
    if (Object.keys(diffStyle).length > 0) {
      target[id] = diffStyle;
    }
  }

  if (Array.isArray(element.children)) {
    for (const child of element.children) {
      processElement(child, baseStyles, laptopStyles, tabletStyles, phoneStyles);
    }
  }
}

export const generateCssFiles = (site: Site) => {
  const baseStyles: Record<string, Partial<Record<string, string | number>>> = {};
  const laptopStyles: Record<string, Partial<Record<string, string | number>>> = {};
  const tabletStyles: Record<string, Partial<Record<string, string | number>>> = {};
  const phoneStyles: Record<string, Partial<Record<string, string | number>>> = {};

  for (const page of site.pages) {
    for (const elem of page.elements) {
      processElement(elem, baseStyles, laptopStyles, tabletStyles, phoneStyles);
    }
  }

  const indexCss = buildCss(baseStyles);
  const responsiveCss = [
    buildMediaQuery(1280, laptopStyles),
    buildMediaQuery(768, tabletStyles),
    buildMediaQuery(375, phoneStyles)
  ]
    .filter(Boolean)
    .join('\n\n');

  return { indexCss, responsiveCss };
};
