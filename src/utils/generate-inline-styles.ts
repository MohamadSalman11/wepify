import type { CSSProperties } from 'react';

type ElementProps = {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  display?: string;
  columns?: number;
  gap?: number;
  flexDir?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
  borderPosition?: 'top' | 'bottom' | 'left' | 'right' | 'all';
};

const generateInlineStyles = (el: ElementProps): React.CSSProperties => {
  const style: CSSProperties = {};

  if (el.width !== undefined) style.width = `${el.width}px`;
  if (el.height !== undefined) style.height = `${el.height}px`;
  if (el.x !== undefined) style.left = `${el.x}px`;
  if (el.y !== undefined) style.top = `${el.y}px`;
  if (el.x !== undefined || el.y !== undefined) style.position = 'absolute';
  if (el.backgroundColor !== undefined) style.backgroundColor = el.backgroundColor;
  if (el.color !== undefined) style.color = el.color;
  if (el.fontFamily !== undefined) style.fontFamily = el.fontFamily;
  if (el.fontWeight !== undefined) style.fontWeight = el.fontWeight as React.CSSProperties['fontWeight'];
  if (el.fontSize !== undefined) style.fontSize = `${el.fontSize}px`;
  if (el.display !== undefined) style.display = el.display as React.CSSProperties['display'];
  if (el.columns !== undefined) style.gridTemplateColumns = `repeat(${el.columns}, minmax(0, 1fr))`;
  if (el.gap !== undefined) style.gap = `${el.gap}px`;
  if (el.flexDir !== undefined) style.flexDirection = el.flexDir as React.CSSProperties['flexDirection'];

  if (el.borderWidth !== undefined && el.borderColor !== undefined) {
    const styleVal = el.borderStyle || 'solid';
    const widthVal = `${el.borderWidth}px`;
    const colorVal = el.borderColor;

    switch (el.borderPosition) {
      case 'top':
        style.borderTopWidth = widthVal;
        style.borderTopColor = colorVal;
        style.borderTopStyle = styleVal;
        break;
      case 'bottom':
        style.borderBottomWidth = widthVal;
        style.borderBottomColor = colorVal;
        style.borderBottomStyle = styleVal;
        break;
      case 'left':
        style.borderLeftWidth = widthVal;
        style.borderLeftColor = colorVal;
        style.borderLeftStyle = styleVal;
        break;
      case 'right':
        style.borderRightWidth = widthVal;
        style.borderRightColor = colorVal;
        style.borderRightStyle = styleVal;
        break;
      case 'all':
      default:
        style.borderWidth = widthVal;
        style.borderColor = colorVal;
        style.borderStyle = styleVal;
        break;
    }
  }

  return style;
};

export default generateInlineStyles;
