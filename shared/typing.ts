import type { ChangeEvent, InputHTMLAttributes } from 'react';

export type SpaceOption = 'between' | 'around' | 'evenly';
export type AlignmentName = 'alignItems' | 'justifyContent';
export type AlignmentValue = 'flex-start' | 'flex-end' | 'center';
export type FlexDirectionOption = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type DeviceType = 'monitor' | 'laptop' | 'tablet' | 'smartphone';

export type InputChangeEvent = ChangeEvent<HTMLInputElement>;

type Responsive<T> = Partial<{
  monitor: T;
  laptop: T;
  tablet: T;
  smartphone: T;
}>;

export interface BaseElement {
  id: string;
  tag: string;
  name: string;
  width?: Responsive<number | 'fill' | 'auto'>;
  height?: Responsive<number | 'fill' | 'auto'>;
  left?: Responsive<number>;
  top?: Responsive<number>;
  color?: string;
  backgroundColor?: string;
  fontSize?: Responsive<number | 'Inherit'>;
  fontFamily?: string;
  fontWeight?:
    | 'Inherit'
    | 'Thin'
    | 'ExtraLight'
    | 'Light'
    | 'Regular'
    | 'Medium'
    | 'SemiBold'
    | 'Bold'
    | 'ExtraBold'
    | 'Black';
  rotate?: Responsive<number>;
  scaleY?: number;
  scaleX?: number;
  textAlign?: Responsive<string>;
  flexDirection?: Responsive<FlexDirectionOption>;
  justifyContent?: Responsive<string>;
  alignItems?: Responsive<string>;
  paddingTop?: Responsive<number>;
  paddingRight?: Responsive<number>;
  paddingBottom?: Responsive<number>;
  paddingLeft?: Responsive<number>;
  marginTop?: Responsive<number>;
  marginRight?: Responsive<number>;
  marginBottom?: Responsive<number>;
  marginLeft?: Responsive<number>;
  display?: string;
  columnGap?: Responsive<number>;
  rowGap?: Responsive<number>;
  content?: string;
  borderWidth?: number;
  borderColor?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: number;
  zIndex?: number;
  children?: BaseElement[];
}

export interface GridElement extends BaseElement {
  display: 'grid';
  columnWidth: Responsive<number | 'auto'>;
  rowHeight: Responsive<number | 'auto'>;
  columns: Responsive<number>;
  rows: Responsive<number>;
}

export interface LinkElement extends BaseElement {
  link: string;
}

export interface ImageElement extends BaseElement {
  src: string;
}

export interface InputElement extends BaseElement {
  type: InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder: string;
}

export type PageElement =
  | BaseElement
  | (BaseElement & Partial<Omit<GridElement, keyof BaseElement>>)
  | (BaseElement & Partial<Omit<LinkElement, keyof BaseElement>>)
  | (BaseElement & Partial<Omit<ImageElement, keyof BaseElement>>)
  | (BaseElement & Partial<Omit<InputElement, keyof BaseElement>>);

export type LastDeletedElement = { parentId: string; domIndex?: number };

export interface SitePage {
  id: string;
  name: string;
  title: string;
  elements: PageElement[];
  isIndex: boolean;
  backgroundColor: string;
}

export type PageMetadata = Omit<SitePage, 'elements'>;

export interface Site {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  lastModified: number;
  isStarred: boolean;
  pages: SitePage[];
}

export type SiteMetadata = Omit<Site, 'pages'> & {
  sizeKb: number;
  pagesCount: number;
  firstPageId: string;
};

export interface Image {
  id: string;
  dataUrl: string;
}

export enum MessageFromIframe {
  IframeReady = 'IFRAME_READY',
  SelectionChanged = 'SELECTION_CHANGED',
  ElementUpdated = 'ELEMENT_UPDATED',
  ElementInserted = 'ELEMENT_INSERTED',
  ElementDeleted = 'ELEMENT_DELETED',
  SiteDownloaded = 'SITE_DOWNLOADED',
  BreakpointChanged = 'BREAKPOINT_CHANGED',
  PageUpdated = 'PAGE_UPDATED',
  CopyElement = 'COPY_ELEMENT',
  PasteElement = 'PASTE_ELEMENT',
  NavigateToPage = 'NAVIGATE_TO_PAGE'
}

export enum MessageToIframe {
  RenderElements = 'RENDER_ELEMENTS',
  InsertElement = 'INSERT_ELEMENT',
  UpdateElement = 'UPDATE_ELEMENT',
  DeleteElement = 'DELETE_ELEMENT',
  ChangeSelection = 'CHANGE_SELECTION',
  DownloadSite = 'DOWNLOAD_SITE',
  UpdatePage = 'UPDATE_PAGE',
  InitializeState = 'INITIALIZE_STATE'
}

export type MessageToIframePayloadMap = {
  [MessageToIframe.RenderElements]: {
    elements: PageElement[];
    isPreview: boolean;
    deviceType: DeviceType;
    scaleFactor: number;
    backgroundColor: string;
  };
  [MessageToIframe.UpdateElement]: { updates: Partial<PageElement> };
  [MessageToIframe.UpdatePage]: { updates: { backgroundColor: string } };
  [MessageToIframe.InsertElement]: { name?: string; element?: PageElement; additionalProps?: Record<string, any> };
  [MessageToIframe.DeleteElement]: undefined;
  [MessageToIframe.ChangeSelection]: string;
  [MessageToIframe.DownloadSite]: { site: Site; shouldMinify: boolean };
  [MessageToIframe.InitializeState]: undefined;
};

export type MessageFromIframeData =
  | { type: MessageFromIframe.IframeReady }
  | { type: MessageFromIframe.SelectionChanged; payload: PageElement }
  | {
      type: MessageFromIframe.ElementUpdated;
      payload: { id: string; fields: Partial<PageElement> };
    }
  | { type: MessageFromIframe.ElementInserted; payload: { element: PageElement; parentId: string; domIndex?: number } }
  | { type: MessageFromIframe.ElementDeleted; payload: { id: string } & LastDeletedElement }
  | { type: MessageFromIframe.SiteDownloaded }
  | { type: MessageFromIframe.BreakpointChanged; payload: { newDeviceType: DeviceType } }
  | { type: MessageFromIframe.PageUpdated; payload: { updates: Record<string, any> } }
  | { type: MessageFromIframe.CopyElement }
  | { type: MessageFromIframe.PasteElement }
  | { type: MessageFromIframe.NavigateToPage; payload: string };

export type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, any> extends Pick<T, K> ? never : K;
}[keyof T];
