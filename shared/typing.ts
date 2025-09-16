import { FlexDirectionOption, FONT_WEIGHT_VALUES, OPTIONS_CURSOR } from '../src/features/editor/panels/SettingsPanel';
import { Device, ElementsName } from './constants';

export type DeviceType = Lowercase<keyof typeof Device>;
export type ResponsiveDeviceType = Exclude<DeviceType, `${Device.Monitor}`>;
export type DeviceSimulator = { type: DeviceType; width: number; height: number };

export interface Site {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  lastModified: number;
  isStarred: boolean;
  pages: Record<string, Page>;
}

export interface Page {
  id: string;
  name: string;
  title: string;
  elements: Record<string, PageElement>;
  isIndex: boolean;
  backgroundColor: string;
}

export type SiteMetadata = Omit<Site, 'pages'> & {
  firstPageId: string;
  sizeKb: number;
  pagesCount: number;
};

export type PageMetadata = Omit<Page, 'elements'>;

export interface PageElement {
  id: string;
  parentId?: string;
  tag: string;
  name: ElementsName;
  contentEditable: boolean;
  focusable: boolean;
  moveable: boolean;
  canHaveChildren: boolean;
  domIndex: number;
  content?: string;
  style: PageElementStyle;
  attrs?: PageElementAttrs;
  responsive?: Partial<Record<ResponsiveDeviceType, PageElementStyle>>;
}

export interface ImageElement extends PageElement {
  blobId: string;
  url?: string;
}

export type PageElementStyle = Partial<{
  position: 'absolute' | 'relative' | '';
  width: number | 'fill' | 'fit' | 'auto';
  height: number | 'screen' | 'fill' | 'fit' | 'auto';
  left: number;
  top: number;
  color: string;
  backgroundColor: string;
  fontSize: number | 'Inherit';
  fontFamily: string;
  fontWeight: keyof typeof FONT_WEIGHT_VALUES;
  lineHeight: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  textAlign: string;
  opacity: number;
  display: string;
  flexDirection: FlexDirectionOption;
  flexWrap: 'wrap' | 'nowrap';
  justifyContent: string;
  alignItems: string;
  columnGap: number;
  rowGap: number;
  columns: number;
  rows: number;
  columnWidth: number | 'auto';
  rowHeight: number | 'auto';
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  borderWidth: number;
  borderColor: string;
  borderTop: string;
  borderRight: string;
  borderBottom: string;
  borderLeft: string;
  borderRadius: number;
  cursor: (typeof OPTIONS_CURSOR)[number];
  zIndex: number;
}>;

export type PageElementAttrs = Partial<{
  type: string;
  placeholder: string;
  href: string;
}>;

export interface CopiedPageElement extends PageElement {
  isRoot?: boolean;
}

export type JsType = 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function' | 'symbol' | 'bigint';

export type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, any> extends Pick<T, K> ? never : K;
}[keyof T];
