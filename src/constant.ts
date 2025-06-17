import type { PageElement } from './types';
import { createElTemplate } from './utils/createElTemplate';

export const TARGET_ORIGIN = '*';
export const TOAST_DURATION = 5000;
export const TAGS_WITHOUT_CHILDREN = new Set(['input', 'img', 'hr', 'br']);

export const ELEMENTS_TEMPLATE: Record<string, PageElement> = {
  section: createElTemplate({
    tag: 'section',
    name: 'section',
    left: 0,
    top: 0,
    width: 'fill',
    height: 'screen',
    backgroundColor: '#ecf2fe'
  }),
  container: createElTemplate({
    tag: 'div',
    name: 'container',
    width: 150,
    height: 100,
    content: 'Hi',
    backgroundColor: '#343C44'
  }),
  grid: createElTemplate({
    tag: 'div',
    name: 'grid',
    width: 400,
    height: 200,
    backgroundColor: '#343C44',
    display: 'grid',
    columnGap: 12,
    rowGap: 12,
    columnWidth: 'auto',
    rowHeight: 'auto',
    columns: 2,
    rows: 2,
    padding: { x: 12, y: 12 }
  }),
  gridItem: createElTemplate({
    left: 0,
    top: 0,
    tag: 'div',
    name: 'item',
    backgroundColor: '#b8e986'
  }),
  list: createElTemplate({
    tag: 'ul',
    name: 'list',
    width: 150,
    height: 110,
    backgroundColor: '#b8e986',
    padding: { x: 24, y: 24 }
  }),
  listItem: createElTemplate({
    left: 0,
    top: 0,
    tag: 'li',
    name: 'item',
    content: 'li 1'
  }),
  heading: createElTemplate({
    tag: 'span',
    name: 'heading',
    fontWeight: 'Bold',
    width: 215,
    fontSize: 32,
    content: 'First heading'
  }),
  text: createElTemplate({
    tag: 'p',
    name: 'text',
    width: 215,
    fontSize: 20,
    content: ''
  }),
  link: createElTemplate({
    tag: 'a',
    name: 'link',
    color: '#1352F1',
    width: 150,
    link: '',
    content: 'Your text link'
  }),
  button: createElTemplate({
    tag: 'button',
    name: 'button',
    width: 150,
    padding: { x: 6, y: 6 },
    content: 'text'
  }),
  input: createElTemplate({
    tag: 'input',
    name: 'input',
    type: 'text',
    placeholder: 'E-Mail',
    width: 150,
    padding: { x: 6, y: 6 },
    fontSize: 14
  }),
  image: createElTemplate({
    tag: 'img',
    name: 'img'
  })
};

export enum Path {
  Dashboard = '/dashboard',
  Editor = '/editor/sites/:site/pages/:page'
}

export enum ElementNames {
  Grid = 'grid',
  Section = 'Section'
}
