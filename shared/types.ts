import type { ChangeEvent, InputHTMLAttributes } from 'react';

export type InputChangeEvent = ChangeEvent<HTMLInputElement>;

export interface BaseElement {
  id: string;
  tag: string;
  name: string;
  width?: number | 'screen' | 'fill' | 'fit';
  height?: number | 'screen' | 'fill' | 'fit';
  left: number;
  top: number;
  color: string;
  backgroundColor: string;
  fontSize: number | 'Inherit';
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
  rotate?: number;
  scaleY?: number;
  scaleX?: number;
  textAlign?: string;
  justifyContent?: string;
  alignItems?: string;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  content?: string;
  borderWidth?: number;
  borderColor?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  children?: BaseElement[];
}

export interface GridElement extends BaseElement {
  display: 'grid';
  columnGap: number;
  rowGap: number;
  columnWidth: number | 'auto';
  rowHeight: number | 'auto';
  columns: number;
  rows: number;
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
  pagesCount: number;
  createdAt: number;
  lastModified: number;
  isStarred: boolean;
  pages: SitePage[];
}

export enum MessageFromIframe {
  IframeReady = 'IFRAME_READY',
  SelectionChanged = 'SELECTION_CHANGED',
  ElementUpdated = 'ELEMENT_UPDATED',
  ElementInserted = 'ELEMENT_INSERTED',
  ElementDeleted = 'ELEMENT_DELETED'
}

export enum MessageToIframe {
  RenderElements = 'RENDER_ELEMENTS',
  InsertElement = 'INSERT_ELEMENT',
  UpdateElement = 'UPDATE_ELEMENT',
  DeleteElement = 'DELETE_ELEMENT',
  ChangeSelection = 'CHANGE_SELECTION',
  SearchElement = 'SEARCH_ELEMENT',
  DownloadSite = 'DOWNLOAD_SITE'
}

export type MessageFromIframeData =
  | { type: MessageFromIframe.IframeReady }
  | { type: MessageFromIframe.SelectionChanged; payload: PageElement }
  | { type: MessageFromIframe.ElementUpdated; payload: { id: string; fields: Partial<PageElement> } }
  | { type: MessageFromIframe.ElementInserted; payload: { parentId: string; element: PageElement } }
  | { type: MessageFromIframe.ElementDeleted; payload: { targetId: string; parentId: string } };
