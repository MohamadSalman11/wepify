import { createElTemplate } from './helpers';
import type { PageElement } from './typing';

export const TARGET_ORIGIN = '*';
export const DEFAULT_BORDER_WIDTH = 2;
export const DEFAULT_BORDER_COLOR = '#4a90e2';
export const DEFAULT_PAGE_BACKGROUND_COLOR = '#343c44';
export const DEFAULT_SCALE_FACTOR = 100;
export const PAGE_PADDING = 60;
export const PAGE_PADDING_X = PAGE_PADDING * 2;
export const ID_FIRST_SECTION = 'section-1';
export const TAGS_WITHOUT_CHILDREN = new Set(['input', 'img', 'hr', 'br']);
export const SPACE_VALUES = ['between', 'around', 'evenly'];
export const UNSAVED_CHANGES_MESSAGE = 'Changes you made may not be saved.';

export enum Tags {
  Section = 'SECTION',
  Ul = 'UL',
  Li = 'LI',
  Input = 'INPUT',
  Span = 'SPAN',
  Button = 'BUTTON',
  A = 'A'
}

export enum ElementsName {
  Grid = 'grid',
  GridItem = 'gridItem',
  Section = 'section',
  Container = 'container',
  Item = 'item',
  Image = 'image',
  Input = 'input',
  Link = 'link',
  A = 'a',
  List = 'list',
  ListItem = 'listItem',
  Heading = 'heading',
  Text = 'text',
  Button = 'button'
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

export const SCREEN_SIZES = {
  monitor: { width: 1920, height: 1080 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  smartphone: { width: 375, height: 667 }
} as const;

export const RESPONSIVE_PROPS = new Set([
  'width',
  'height',
  'left',
  'top',
  'fontSize',
  'rotate',
  'scaleY',
  'scaleX',
  'textAlign',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'columns',
  'columnWidth',
  'columnGap',
  'rows',
  'rowHeight',
  'rowGap'
]);

export const ELEMENTS_TEMPLATE: Record<string, Partial<PageElement>> = {
  section: createElTemplate({
    tag: 'section',
    name: 'section',
    left: { monitor: 0 },
    top: { monitor: 0 },
    width: { monitor: 'fill' },
    height: { monitor: 'fill' },
    backgroundColor: '#fff'
  }),
  container: createElTemplate({
    tag: 'div',
    name: 'container',
    width: { monitor: 150 },
    height: { monitor: 100 },
    backgroundColor: '#313334'
  }),
  grid: createElTemplate({
    tag: 'div',
    name: 'grid',
    width: { monitor: 500 },
    height: { monitor: 250 },
    backgroundColor: '#343C44',
    display: 'grid',
    columnGap: { monitor: 12 },
    rowGap: { monitor: 12 },
    columnWidth: { monitor: 'auto' },
    rowHeight: { monitor: 'auto' },
    columns: { monitor: 2 },
    rows: { monitor: 2 },
    paddingTop: { monitor: 12 },
    paddingRight: { monitor: 12 },
    paddingBottom: { monitor: 12 },
    paddingLeft: { monitor: 12 }
  }),
  gridItem: createElTemplate({
    tag: 'div',
    name: 'item',
    fontFamily: 'Inherit',
    fontWeight: 'Inherit',
    fontSize: { monitor: 'Inherit' },
    backgroundColor: '#b8e986'
  }),
  list: createElTemplate({
    tag: 'ul',
    name: 'list',
    width: { monitor: 'auto' },
    height: { monitor: 'auto' },
    paddingTop: { monitor: 24 },
    paddingRight: { monitor: 32 },
    paddingLeft: { monitor: 32 },
    paddingBottom: { monitor: 24 }
  }),
  listItem: createElTemplate({
    tag: 'li',
    name: 'item',
    fontFamily: 'Inherit',
    fontWeight: 'Inherit',
    fontSize: { monitor: 'Inherit' },
    content: 'li 1'
  }),
  heading: createElTemplate({
    tag: 'span',
    name: 'heading',
    fontWeight: 'Bold',
    width: { monitor: 'auto' },
    height: { monitor: 'auto' },
    fontSize: { monitor: 32 },
    paddingTop: { monitor: 12 },
    paddingRight: { monitor: 16 },
    paddingLeft: { monitor: 16 },
    paddingBottom: { monitor: 12 },
    content: 'First heading'
  }),
  text: createElTemplate({
    tag: 'p',
    name: 'text',
    width: { monitor: 'auto' },
    height: { monitor: 'auto' },
    fontSize: { monitor: 18 },
    paddingTop: { monitor: 12 },
    paddingRight: { monitor: 16 },
    paddingLeft: { monitor: 16 },
    paddingBottom: { monitor: 12 },
    content: 'Your description goes here'
  }),
  link: createElTemplate({
    tag: 'a',
    name: 'link',
    color: '#1352F1',
    width: { monitor: 'auto' },
    height: { monitor: 'auto' },
    paddingTop: { monitor: 12 },
    paddingRight: { monitor: 16 },
    paddingLeft: { monitor: 16 },
    paddingBottom: { monitor: 12 },
    link: '',
    content: 'Your text link'
  }),
  button: createElTemplate({
    tag: 'button',
    name: 'button',
    fontSize: { monitor: 18 },
    width: { monitor: 150 },
    height: { monitor: 'auto' },
    content: 'text',
    backgroundColor: '#f4f8f8',
    borderRadius: 12,
    borderTop: '2px solid #6597f7',
    borderRight: '2px solid #6597f7',
    borderBottom: '2px solid #6597f7',
    borderLeft: '2px solid #6597f7',
    paddingTop: { monitor: 6 },
    paddingRight: { monitor: 6 },
    paddingLeft: { monitor: 6 },
    paddingBottom: { monitor: 6 }
  }),
  input: createElTemplate({
    tag: 'input',
    name: 'input',
    type: 'email',
    placeholder: 'E-Mail',
    width: { monitor: 150 },
    height: { monitor: 'auto' },
    fontSize: { monitor: 14 },
    paddingTop: { monitor: 6 },
    paddingRight: { monitor: 6 },
    paddingLeft: { monitor: 6 },
    paddingBottom: { monitor: 6 }
  }),
  image: {
    tag: 'img',
    name: 'image',
    width: { monitor: 'auto' },
    height: { monitor: 'auto' },
    left: { monitor: 0 },
    top: { monitor: 0 }
  }
};
