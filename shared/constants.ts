import { createElTemplate } from './helpers';
import type { PageElement } from './types';

export const TAGS_WITHOUT_CHILDREN = new Set(['input', 'img', 'hr', 'br']);

export enum Tags {
  Section = 'SECTION',
  Ul = 'UL',
  Input = 'INPUT',
  Span = 'SPAN',
  Button = 'BUTTON',
  A = 'A'
}

export enum ElementNames {
  Grid = 'grid',
  Section = 'section',
  Item = 'item',
  Image = 'image'
}

export const OPTIONS_FONT = [
  'Inherit',
  'Inter',
  'JetBrains Mono',
  'Fira Code',
  'Lato',
  'Lora',
  'Merriweather',
  'Montserrat',
  'Nunito',
  'Open Sans',
  'Oswald',
  'Pacifico',
  'Playfair Display',
  'Poppins',
  'Raleway',
  'Roboto Slab',
  'Roboto',
  'Rubik',
  'Savate',
  'Source Code Pro',
  'Ubuntu'
];

export const FONT_WEIGHT_VALUES = {
  Inherit: 'inherit',
  Thin: '100',
  ExtraLight: '200',
  Light: '300',
  Regular: '400',
  Medium: '500',
  SemiBold: '600',
  Bold: '700',
  ExtraBold: '800',
  Black: '900'
} as const;

export const FONT_WEIGHT_NAMES = {
  inherit: 'Inherit',
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black'
} as const;

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
    backgroundColor: '#313334'
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
    fontFamily: 'Inherit',
    fontWeight: 'Inherit',
    fontSize: 'Inherit',
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
    fontFamily: 'Inherit',
    fontWeight: 'Inherit',
    fontSize: 'Inherit',
    content: 'li 1'
  }),
  heading: createElTemplate({
    tag: 'span',
    name: 'heading',
    fontWeight: 'Bold',
    width: 'fit',
    height: 'fit',
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
    content: 'text',
    backgroundColor: '#f4f8f8'
  }),
  input: createElTemplate({
    tag: 'input',
    name: 'input',
    type: 'text',
    placeholder: 'E-Mail',
    width: 155,
    padding: { x: 6, y: 6 },
    fontSize: 14
  }),
  image: createElTemplate({
    tag: 'img',
    name: 'image'
  })
};
