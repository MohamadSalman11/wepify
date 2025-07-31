import type { ChangeEvent, InputHTMLAttributes } from 'react';

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
  left: Responsive<number>;
  top: Responsive<number>;
  color: string;
  backgroundColor: string;
  fontSize: Responsive<number | 'Inherit'>;
  fontFamily: string;
  fontWeight:
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
  scaleY?: Responsive<number>;
  scaleX?: Responsive<number>;
  textAlign?: Responsive<string>;
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
  columnGap: Responsive<number>;
  rowGap: Responsive<number>;
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

export interface SitePage {
  id: string;
  name: string;
  title: string;
  elements: PageElement[];
  isIndex: boolean;
}

export interface Site {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  lastModified: number;
  isStarred: boolean;
  pages: SitePage[];
}

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
  NavigateToPage = 'NAVIGATE_TO_PAGE'
}

export enum MessageToIframe {
  RenderElements = 'RENDER_ELEMENTS',
  InsertElement = 'INSERT_ELEMENT',
  UpdateElement = 'UPDATE_ELEMENT',
  DeleteElement = 'DELETE_ELEMENT',
  ChangeSelection = 'CHANGE_SELECTION',
  SearchElement = 'SEARCH_ELEMENT',
  DownloadSite = 'DOWNLOAD_SITE',
  UpdatePage = 'UPDATE_PAGE'
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
  [MessageToIframe.InsertElement]: { name: string; additionalProps?: Record<string, any> };
  [MessageToIframe.DeleteElement]: undefined;
  [MessageToIframe.ChangeSelection]: string;
  [MessageToIframe.SearchElement]: string;
  [MessageToIframe.DownloadSite]: { site: Site; shouldMinify: boolean };
};

export type MessageFromIframeData =
  | { type: MessageFromIframe.IframeReady }
  | { type: MessageFromIframe.SelectionChanged; payload: PageElement }
  | {
      type: MessageFromIframe.ElementUpdated;
      payload: { id: string; fields: Partial<PageElement> };
    }
  | { type: MessageFromIframe.ElementInserted; payload: { parentId: string; element: PageElement } }
  | { type: MessageFromIframe.ElementDeleted; payload: { targetId: string; parentId: string } }
  | { type: MessageFromIframe.SiteDownloaded }
  | { type: MessageFromIframe.BreakpointChanged; payload: { newDeviceType: DeviceType } }
  | { type: MessageFromIframe.PageUpdated; payload: { updates: Record<string, any> } }
  | { type: MessageFromIframe.NavigateToPage; payload: string };
