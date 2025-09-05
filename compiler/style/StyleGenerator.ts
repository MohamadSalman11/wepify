import { PageElementStyle } from '@shared/typing';

/**
 * Constants
 */

const OPTIONS_SPACE = new Set(['between', 'around', 'evenly']);

const FONT_WEIGHT_VALUES = {
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
};

/**
 * Class definition
 */

export class StyleGenerator {
  private styles: Partial<Record<keyof CSSStyleDeclaration, any>> = {};

  constructor(private style: PageElementStyle) {}

  generate() {
    this.applyBaseStyles();
    this.applyFlexStyles();
    this.applyTransform();
    this.applyGridStyles();

    return this.styles;
  }

  private applyBaseStyles() {
    const s = this.style;

    this.setIfDefined('width', s.width, true);
    this.setIfDefined('height', s.height, true);
    this.setIfDefined('color', s.color);
    this.setIfDefined('backgroundColor', s.backgroundColor);
    this.setIfDefined('fontSize', s.fontSize, true);
    this.setIfDefined('fontFamily', s.fontFamily);
    this.setIfDefined('fontWeight', FONT_WEIGHT_VALUES[s.fontWeight as keyof typeof FONT_WEIGHT_VALUES]);
    this.setIfDefined('textAlign', s.textAlign);
    this.setIfDefined('display', s.display);
    this.setIfDefined('flexDirection', s.flexDirection);
    this.setIfDefined('alignItems', s.alignItems);
    this.setIfDefined('columnGap', s.columnGap, true);
    this.setIfDefined('rowGap', s.rowGap, true);
    this.setIfDefined('paddingTop', s.paddingTop, true);
    this.setIfDefined('paddingRight', s.paddingRight, true);
    this.setIfDefined('paddingBottom', s.paddingBottom, true);
    this.setIfDefined('paddingLeft', s.paddingLeft, true);
    this.setIfDefined('marginTop', s.marginTop, true);
    this.setIfDefined('marginRight', s.marginRight, true);
    this.setIfDefined('marginBottom', s.marginBottom, true);
    this.setIfDefined('marginLeft', s.marginLeft, true);
    this.setIfDefined('borderTop', s.borderTop);
    this.setIfDefined('borderRight', s.borderRight);
    this.setIfDefined('borderBottom', s.borderBottom);
    this.setIfDefined('borderLeft', s.borderLeft);
    this.setIfDefined('borderColor', s.borderColor);
    this.setIfDefined('borderWidth', s.borderWidth, true);
    this.setIfDefined('borderRadius', s.borderRadius, true);
    this.setIfDefined('zIndex', s.zIndex);

    if (this.isDefined(s.zIndex)) this.styles.position = 'relative';
  }

  private applyFlexStyles() {
    const s = this.style;

    if (this.isDefined(s.justifyContent)) {
      this.styles['justifyContent'] = OPTIONS_SPACE.has(s.justifyContent)
        ? `space-${s.justifyContent}`
        : s.justifyContent;
    }
  }

  private applyTransform() {
    const s = this.style;

    if ([s.left, s.top, s.rotate, s.scaleX, s.scaleY].every((v) => this.isDefined(v))) {
      this.styles['transform'] =
        `translate(${s.left}px, ${s.top}px) rotate(${s.rotate}deg) scale(${s.scaleX}, ${s.scaleY})`;
    }
  }

  private applyGridStyles() {
    const s = this.style;

    if (this.isDefined(s.columns) && this.isDefined(s.columnWidth)) {
      this.styles['gridTemplateColumns'] =
        `repeat(${s.columns}, ${s.columnWidth}${typeof s.columnWidth === 'number' ? 'px' : ''})`;
    }

    if (this.isDefined(s.rows) && this.isDefined(s.rowHeight)) {
      this.styles['gridTemplateRows'] =
        `repeat(${s.rows}, ${s.rowHeight}${typeof s.rowHeight === 'number' ? 'px' : ''})`;
    }
  }

  private setIfDefined(key: keyof CSSStyleDeclaration, value: any, addPx = false) {
    const v = this.normalizeValue(value, addPx);
    if (v !== undefined) this.styles[key] = v;
  }

  private isDefined<T>(value: T | undefined): value is T {
    return value !== undefined;
  }

  private normalizeValue(value: any, addPx = true): string | undefined {
    if (value === undefined) return undefined;
    if (value === 'screen') return '100vh';
    if (value === 'fill') return '100%';
    if (value === 'auto') return 'fit-content';
    return addPx ? `${value}px` : String(value);
  }
}
