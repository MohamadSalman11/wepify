import { StyleGenerator } from '@compiler/style/StyleGenerator';
import { resolveStyleDependencies } from '@compiler/utils/resolveStyleDependencies';
import { SCREEN_SIZES } from '@shared/constants';
import { Page, PageElement, ResponsiveDeviceType } from '@shared/typing';

/**
 * Types
 */

type StyleObject = { [property: string]: string };
type SelectorStyles = { [selector: string]: StyleObject };
type MediaQuery = { maxWidth: number; styles: SelectorStyles };
type StyleMap = Record<string, SelectorStyles>;
type MediaMap = Record<number, SelectorStyles>;
type MediaQueriesMap = Record<string, MediaQuery[]>;
type PageCssMap = Record<string, { normalCSS: string; mediaCSS: string }>;

/**
 * Class definition
 */

export class CSSGenerator {
  private normalStylesMap: StyleMap = {};
  private mediaQueriesMap: MediaQueriesMap = {};

  constructor(private pages: Record<string, Page>) {
    this.buildAllPagesStyles();
  }

  // public
  buildPageCssMap() {
    const pageCssMap: PageCssMap = {};

    for (const pageId of Object.keys(this.pages)) {
      pageCssMap[pageId] = {
        normalCSS: this.generateNormalCSS(pageId),
        mediaCSS: this.generateMediaCSS(pageId)
      };
    }

    return pageCssMap;
  }

  // private
  private buildAllPagesStyles() {
    for (const [pageId, page] of Object.entries(this.pages)) {
      const normalStyles: SelectorStyles = {};

      for (const el of Object.values(page.elements)) {
        const { normalStyles: nStyles, mediaStylesMap } = this.extractStyles(el);

        normalStyles[`#${el.id}`] = nStyles;

        if (!this.mediaQueriesMap[pageId]) {
          this.mediaQueriesMap[pageId] = [];
        }

        this.mediaQueriesMap[pageId].push(...this.mergeMediaMapObjects(mediaStylesMap));
      }

      this.normalStylesMap[pageId] = normalStyles;
    }
  }

  private styleObjectToCSSBlock(styleObj: StyleObject, indent: string = '  '): string {
    return Object.entries(styleObj)
      .map(([key, value]) => `${indent}${key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}: ${value};`)
      .join('\n');
  }

  private generateSingleMediaCSS(maxWidth: number, stylesMap: SelectorStyles): string {
    const blocks = Object.entries(stylesMap)
      .map(([selector, styleObj]) => `  ${selector} {\n${this.styleObjectToCSSBlock(styleObj, '    ')}\n  }`)
      .join('\n\n');
    return `@media (max-width: ${maxWidth}px) {\n${blocks}\n}`;
  }

  private generateNormalCSS(pageId: string): string {
    const normalStyles = this.normalStylesMap[pageId];
    return Object.entries(normalStyles)
      .map(([selector, styleObj]) => `${selector} {\n${this.styleObjectToCSSBlock(styleObj, '  ')}\n}`)
      .join('\n\n');
  }

  private generateMediaCSS(pageId: string): string {
    const mediaQueries = this.mediaQueriesMap[pageId] || [];

    mediaQueries.sort((a, b) => b.maxWidth - a.maxWidth);

    return mediaQueries.map((mq) => this.generateSingleMediaCSS(mq.maxWidth, mq.styles)).join('\n\n');
  }

  private extractStyles(element: PageElement) {
    const normalStyles = new StyleGenerator(element.style).generate();
    const mediaStylesMap: MediaMap = {};

    if (element.responsive) {
      for (const [device, style] of Object.entries(element.responsive)) {
        const maxWidth = SCREEN_SIZES[device as ResponsiveDeviceType].width;

        if (!mediaStylesMap[maxWidth]) {
          mediaStylesMap[maxWidth] = {};
        }

        mediaStylesMap[maxWidth][`#${element.id}`] = new StyleGenerator(
          resolveStyleDependencies(style, element)
        ).generate();
      }
    }

    return { normalStyles, mediaStylesMap };
  }

  private mergeMediaMapObjects(mediaMap: MediaMap): MediaQuery[] {
    return Object.entries(mediaMap).map(([maxWidth, styles]) => ({
      maxWidth: Number(maxWidth),
      styles
    }));
  }
}
