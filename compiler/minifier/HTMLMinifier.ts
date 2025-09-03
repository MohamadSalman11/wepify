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
  A_TAG_ATTRS_TO_REMOVE: /\s(?:target|spellcheck|data-name)(?:=["'][^"']*["'])?/g
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

  public async cleanUp() {
    let fontsURL = FONTS_URL;
    const usedFonts = this.getUsedFonts();
    const unusedFonts = OPTIONS_FONT.filter((font) => !usedFonts.has(font));

    fontsURL = this.removeFonts(fontsURL, unusedFonts);

    const cleanedHTML = this.html
      .replace(REGEX.SCRIPT_MODULE_INLINE, '')
      .replace(REGEX.SCRIPT_MODULE_SELF_CLOSING, '')
      .replace(REGEX.GOOGLE_FONTS_LINK, `<link href="${fontsURL}" rel="stylesheet">`)
      .replace(REGEX.CLASS_ATTRIBUTE, this.filterClasses)
      .replace(REGEX.CONTENTEDITABLE, '')
      .replace(REGEX.A_TAG_ATTRS_TO_REMOVE, '')
      .replace(REGEX.STYLE_TAG_WITH_STYLE_ATTR, this.removeInlineStyle);

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

  private getUsedFonts() {
    const fonts = new Set<string>();

    for (const el of document.querySelectorAll<HTMLElement>('*')) {
      const style = getComputedStyle(el);

      if (style.fontFamily) {
        const fontFamilies = style.fontFamily.split(',');

        for (const f of fontFamilies) {
          const clean = f.trim().replace(REGEX.QUOTES_TRIM, '');

          if (clean) {
            fonts.add(clean);
          }
        }
      }
    }

    return fonts;
  }
}
