import type { PageElement } from './typing';

export const APP_SHORT_NAME = 'wp';
export const PAGE_PADDING = 60;
export const PAGE_PADDING_X = PAGE_PADDING * 2;
export const FONTS_URL = `https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Oswald:wght@200..700&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,800&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Savate:ital,wght@0,200..900;1,200..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Amatic+SC:wght@400;700&family=Anta&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap`;

export enum Device {
  Monitor = 'monitor',
  Laptop = 'laptop',
  Tablet = 'tablet',
  Smartphone = 'smartphone'
}

export enum ElementsName {
  Section = 'section',
  Container = 'container',
  Grid = 'grid',
  GridItem = 'gridItem',
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

export const SCREEN_SIZES = {
  monitor: { width: 1920, height: 1080 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  smartphone: { width: 375, height: 667 }
} as const;

export enum EditorToIframe {
  RenderPage = 'RENDER_PAGE',
  UpdatePage = 'UPDATE_PAGE',
  ZoomInPage = 'ZOOM_IN_PAGE',
  ZoomOutPage = 'ZOOM_OUT_PAGE',
  DeviceChanged = 'DEVICE_CHANGED',
  InsertElement = 'INSERT_ELEMENT',
  InsertElements = 'INSERT_ELEMENTS',
  UpdateElement = 'EDITOR_UPDATE_ELEMENT',
  ChangeElementPosition = 'CHANGE_ELEMENT_POSITION',
  SelectElement = 'EDITOR_SELECT_ELEMENT'
}

export enum IframeToEditor {
  IframeReady = 'IFRAME_READY',
  PageUpdated = 'PAGE_UPDATED',
  PageRendered = 'PAGE_RENDERED',
  StoreElement = 'STORE_ELEMENT',
  ElementPositionChanged = 'ELEMENT_POSITION_CHANGED',
  UpdateElement = 'IFRAME_UPDATE_ELEMENT',
  SelectElement = 'IFRAME_SELECT_ELEMENT',
  CopyElement = 'COPY_ELEMENT',
  PasteElement = 'PASTE_ELEMENT',
  DeleteElement = 'DELETE_ELEMENT'
}

export const ELEMENTS_TEMPLATE: Record<string, PageElement> = {
  section: {
    id: '',
    tag: 'section',
    name: ElementsName.Section,
    moveable: false,
    focusable: false,
    canHaveChildren: true,
    contentEditable: false,
    style: {
      width: 'fill',
      height: 'screen',
      fontSize: 20,
      fontFamily: 'Inter',
      backgroundColor: '#fff'
    }
  },
  container: {
    id: '',
    tag: 'div',
    name: ElementsName.Container,
    moveable: true,
    focusable: false,
    canHaveChildren: true,
    contentEditable: false,
    style: {
      width: 150,
      height: 100,
      fontFamily: 'Inherit',
      fontSize: 20,
      backgroundColor: '#313334'
    }
  },
  grid: {
    id: '',
    tag: 'div',
    name: ElementsName.Grid,
    moveable: true,
    focusable: false,
    canHaveChildren: true,
    contentEditable: false,
    style: {
      width: 500,
      height: 250,
      fontSize: 20,
      fontFamily: 'Inherit',
      backgroundColor: '#343C44',
      display: 'grid',
      columnGap: 12,
      rowGap: 12,
      columnWidth: 'auto',
      rowHeight: 'auto',
      columns: 2,
      rows: 2,
      paddingTop: 12,
      paddingRight: 12,
      paddingBottom: 12,
      paddingLeft: 12
    }
  },
  gridItem: {
    id: '',
    tag: 'div',
    name: ElementsName.GridItem,
    moveable: false,
    focusable: false,
    canHaveChildren: true,
    contentEditable: false,
    style: {
      fontFamily: 'Inherit',
      fontWeight: 'Inherit',
      fontSize: 'Inherit',
      backgroundColor: '#b8e986'
    }
  },
  list: {
    id: '',
    tag: 'ul',
    name: ElementsName.List,
    moveable: true,
    focusable: false,
    canHaveChildren: true,
    contentEditable: false,
    style: {
      fontSize: 20,
      fontFamily: 'Inherit',
      width: 'auto',
      height: 'auto',
      paddingTop: 24,
      paddingRight: 32,
      paddingLeft: 32,
      paddingBottom: 24
    }
  },
  listItem: {
    id: '',
    tag: 'li',
    name: ElementsName.ListItem,
    moveable: false,
    focusable: true,
    canHaveChildren: false,
    contentEditable: true,
    content: 'list item',
    style: {
      fontFamily: 'Inherit',
      fontWeight: 'Inherit',
      fontSize: 'Inherit'
    }
  },
  heading: {
    id: '',
    tag: 'span',
    name: ElementsName.Heading,
    moveable: true,
    focusable: true,
    canHaveChildren: false,
    contentEditable: true,
    content: 'First heading',
    style: {
      fontSize: 32,
      fontFamily: 'Inherit',
      fontWeight: 'Bold',
      width: 'auto',
      height: 'auto'
    }
  },
  text: {
    id: '',
    tag: 'p',
    name: ElementsName.Text,
    moveable: true,
    focusable: true,
    canHaveChildren: false,
    contentEditable: true,
    content: 'Your description goes here',
    style: {
      width: 'auto',
      height: 'auto',
      fontSize: 18,
      fontFamily: 'Inherit'
    }
  },
  link: {
    id: '',
    tag: 'a',
    name: ElementsName.Link,
    moveable: true,
    focusable: true,
    canHaveChildren: false,
    contentEditable: true,
    content: 'Your text link',
    style: {
      fontSize: 20,
      fontFamily: 'Inherit',
      color: '#1352F1',
      width: 'auto',
      height: 'auto'
    },
    attrs: {
      href: ''
    }
  },
  button: {
    id: '',
    tag: 'button',
    name: ElementsName.Button,
    moveable: true,
    focusable: true,
    canHaveChildren: false,
    contentEditable: true,
    content: 'text',
    style: {
      fontSize: 18,
      fontFamily: 'Inherit',
      width: 150,
      height: 'auto',
      backgroundColor: '#3e7df5',
      color: '#ffffff',
      borderRadius: 16,
      paddingTop: 12,
      paddingRight: 12,
      paddingLeft: 12,
      paddingBottom: 12
    }
  },
  input: {
    id: '',
    tag: 'input',
    name: ElementsName.Input,
    moveable: true,
    focusable: true,
    canHaveChildren: false,
    contentEditable: false,
    style: {
      fontSize: 14,
      fontFamily: 'Inherit',
      width: 150,
      height: 'auto',
      borderRadius: 12,
      paddingTop: 6,
      paddingRight: 6,
      paddingLeft: 6,
      paddingBottom: 6,
      borderColor: '#3e7df5',
      borderWidth: 2,
      borderTop: '2px solid #3e7df5',
      borderRight: '2px solid #3e7df5',
      borderBottom: '2px solid #3e7df5',
      borderLeft: '2px solid #3e7df5'
    },
    attrs: {
      type: 'email',
      placeholder: 'E-Mail'
    }
  },
  image: {
    id: '',
    tag: 'img',
    name: ElementsName.Image,
    moveable: true,
    focusable: false,
    canHaveChildren: false,
    contentEditable: false,
    style: {
      width: 'auto',
      height: 'auto'
    }
  }
} as const;
