import type { ChangeEvent, InputHTMLAttributes } from 'react';

export type InputChangeEvent = ChangeEvent<HTMLInputElement>;

export interface BaseElement {
  id: string;
  tag: string;
  name: string;
  width?: number | 'screen' | 'fill';
  height?: number | 'screen' | 'fill';
  left: number;
  top: number;
  color: string;
  backgroundColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'Thin' | 'ExtraLight' | 'Light' | 'Regular' | 'Medium' | 'SemiBold' | 'Bold' | 'ExtraBold' | 'Black';
  padding: { x: number; y: number };
  margin: { x: number; y: number };
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

export interface InputElement extends BaseElement {
  type: InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder: string;
}

export type PageElement =
  | BaseElement
  | (BaseElement & Partial<Omit<GridElement, keyof BaseElement>>)
  | (BaseElement & Partial<Omit<LinkElement, keyof BaseElement>>)
  | (BaseElement & Partial<Omit<InputElement, keyof BaseElement>>);

export interface SitePage {
  id: string;
  name: string;
  elements: PageElement[];
}

export interface Site {
  id: string;
  name: string;
  description: string;
  pagesCount: number;
  createdAt: Date;
  lastModified: Date;
  isStarred: boolean;
  pages: SitePage[];
}
