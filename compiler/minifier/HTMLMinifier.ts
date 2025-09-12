import { FONTS_URL } from '@shared/constants';
import parserHtml from 'prettier/plugins/html';
import prettier from 'prettier/standalone';
import { OPTIONS_FONT } from '../../src/features/editor/panels/SettingsPanel';

/**
 * Constants
 */

const PRETTIER_PARSER = 'html';
const PRETTIER_PRINT_WIDTH = 80;

const TAG_BODY = 'BODY';
const SELECTOR_SPAN = 'button';
const SELECTOR_BUTTON = 'button';

const REGEX = {
  SCRIPT_MODULE_INLINE: /<script\s+type="module"[^>]*>[\s\S]*?<\/script>/g,
  SCRIPT_MODULE_SELF_CLOSING: /<script\s+type="module"[^>]*\/>/g,
  GOOGLE_FONTS_LINK: /<link[^>]+href="https:\/\/fonts\.googleapis\.com\/css2[^"]+"[^>]*>/,
  CLASS_ATTRIBUTE: /class="([^"]*)"/g,
  CONTENTEDITABLE: /\scontenteditable=["'][^"']*["']/g,
  HTML_COMMENTS: /<!--[\s\S]*?-->/g,
  LINEBREAKS: /\n/g,
  EXTRA_SPACES: /\s{2,}/g,
  TAG_GAPS: />\s+</g,
  WHITESPACE: /\s+/,
  STYLE_TAG_WITH_STYLE_ATTR: /<([a-z]+)([^>]*)\sstyle="[^"]*"([^>]*)>/gi,
  QUOTES_TRIM: /^['"]+|['"]+$/g,
  MULTIPLE_AMPERSANDS: /[&]{2,}/g,
  QUESTION_MARK_AMPERSAND: /\?&/,
  TRAILING_AMPERSAND: /&$/,
  ATTRS_TO_REMOVE:
    /\s(?:target|spellcheck|data-name|data-blob-id|data-not-moveable|data-focusable|data-content-editable|data-can-not-have-children)(?:=["'][^"']*["'])?/g
};

/**
 * Class definition
 */

export class HTMLMinifier {
  constructor(private html: string) {}

  // public
  async minify() {
    const cleaned = await this.cleanUp();

    return cleaned
      .replace(REGEX.HTML_COMMENTS, '')
      .replace(REGEX.LINEBREAKS, '')
      .replace(REGEX.EXTRA_SPACES, ' ')
      .replace(REGEX.TAG_GAPS, '><')
      .trim();
  }

  async cleanUp() {
    let fontsURL = FONTS_URL;
    const usedFonts = this.getUsedFonts();
    const unusedFonts = OPTIONS_FONT.filter((font) => !usedFonts.has(font));

    fontsURL = this.removeFonts(fontsURL, unusedFonts);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.html;

    this.removeButtonSpans(tempDiv);

    const cleanedHTML = tempDiv.innerHTML
      .replace(REGEX.SCRIPT_MODULE_INLINE, '')
      .replace(REGEX.SCRIPT_MODULE_SELF_CLOSING, '')
      .replace(REGEX.GOOGLE_FONTS_LINK, `<link href="${fontsURL}" rel="stylesheet">`)
      .replace(REGEX.CLASS_ATTRIBUTE, this.filterClasses)
      .replace(REGEX.CONTENTEDITABLE, '')
      .replace(REGEX.STYLE_TAG_WITH_STYLE_ATTR, this.removeInlineStyle)
      .replace(REGEX.ATTRS_TO_REMOVE, '');

    return await prettier.format(cleanedHTML, this.getPrettierOptions());
  }

  // private
  private filterClasses(_match: string, classes: string): string {
    const trimmedClasses = classes.split(REGEX.WHITESPACE).filter(Boolean).join(' ');
    return trimmedClasses ? `class="${trimmedClasses}"` : '';
  }

  private removeInlineStyle(match: string, tagName: string, beforeStyle: string, afterStyle: string): string {
    if (tagName === TAG_BODY) {
      return match;
    }

    return `<${tagName}${beforeStyle}${afterStyle}>`;
  }

  private getPrettierOptions() {
    return {
      parser: PRETTIER_PARSER,
      printWidth: PRETTIER_PRINT_WIDTH,
      plugins: [parserHtml]
    };
  }

  private removeButtonSpans(container: HTMLElement) {
    for (const btn of container.querySelectorAll(SELECTOR_BUTTON)) {
      for (const span of btn.querySelectorAll(SELECTOR_SPAN)) {
        btn.textContent = span.textContent;
        span.remove();
      }
    }
  }

  private removeFonts(url: string, fontsToRemove: string[]): string {
    if (fontsToRemove.length === 0) {
      return url;
    }

    const escapedFonts = fontsToRemove.map((font) => font.replace(' ', String.raw`\+`)).join('|');
    const pattern = new RegExp(`(&?family=(${escapedFonts})(:[^&]*)?)(?=&|$)`, 'g');

    let result = url.replace(pattern, '');
    result = result.replace(REGEX.MULTIPLE_AMPERSANDS, '&');
    result = result.replace(REGEX.QUESTION_MARK_AMPERSAND, '?');
    result = result.replace(REGEX.TRAILING_AMPERSAND, '');

    return result;
  }

  private getUsedFonts(): Set<string> {
    const fonts = new Set<string>();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.html;

    for (const el of tempDiv.querySelectorAll<HTMLElement>('*')) {
      const style = el.getAttribute('style');
      if (!style) continue;

      const fontMatch = style.match(/font-family\s*:\s*([^;]+)/i);
      if (fontMatch) {
        const fontFamilies = fontMatch[1].split(',');
        for (const f of fontFamilies) {
          const clean = f.trim().replace(REGEX.QUOTES_TRIM, '');
          if (clean) fonts.add(clean);
        }
      }
    }

    return fonts;
  }
}
