import { OPTIONS_FONT } from '@shared/constants';
import parserHtml from 'prettier/plugins/html';
import prettier from 'prettier/standalone';
import { SELECTOR_TARGET } from '../constants';

const REGEX = {
  SCRIPT_MODULE_INLINE: /<script\s+type="module"[^>]*>[\s\S]*?<\/script>/g,
  SCRIPT_MODULE_SELF_CLOSING: /<script\s+type="module"[^>]*\/>/g,
  GOOGLE_FONTS_LINK: /<link[^>]+href="https:\/\/fonts\.googleapis\.com\/css2[^"]+"[^>]*>/,
  CLASS_ATTRIBUTE: /class="([^"]*)"/g,
  MOVEABLE_CSS_LINK: /<link\s+rel=["']stylesheet["']\s+href=["']\.\/moveable\.css["']\s*\/?>/g,
  CONTENTEDITABLE: /\scontenteditable=["'][^"']*["']/g,
  STYLED_COMPONENT: /<style[^>]*data-styled-id="rCS1w3zcxh"[^>]*>[\s\S]*?<\/style>/gi,
  HTML_COMMENTS: /<!--[\s\S]*?-->/g,
  LINEBREAKS: /\n/g,
  EXTRA_SPACES: /\s{2,}/g,
  TAG_GAPS: />\s+</g,
  WHITESPACE: /\s+/,
  STYLE_INLINE: /style="([^"]*)"/g,
  STYLE_COLON_SPACES: /\s*:\s*/g,
  STYLE_SEMICOLON_SPACES: /\s*;\s*/g,
  STYLE_COMMA_SPACES: /\s*,\s*/g,
  QUOTES_TRIM: /^['"]+|['"]+$/g,
  MULTIPLE_AMPERSANDS: /[&]{2,}/g,
  QUESTION_MARK_AMPERSAND: /\?&/,
  TRAILING_AMPERSAND: /&$/
};

const PRETTIER_PARSER = 'html';
const PRETTIER_PRINT_WIDTH = 80;
const FONTS_URL = `https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Oswald:wght@200..700&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,800&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Savate:ital,wght@0,200..900;1,200..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap`;

const removeFonts = (url: string, fontsToRemove: string[]) => {
  if (fontsToRemove.length === 0) return url;

  const escapedFonts = fontsToRemove.map((font) => font.replace(' ', String.raw`\+`)).join('|');
  const pattern = new RegExp(`(&?family=(${escapedFonts})(:[^&]*)?)(?=&|$)`, 'g');

  let result = url.replace(pattern, '');

  result = result.replace(REGEX.MULTIPLE_AMPERSANDS, '&');
  result = result.replace(REGEX.QUESTION_MARK_AMPERSAND, '?');
  result = result.replace(REGEX.TRAILING_AMPERSAND, '');

  return result;
};

const getUsedFonts = () => {
  const fonts = new Set<string>();

  for (const el of document.querySelectorAll<HTMLElement>('*')) {
    const style = getComputedStyle(el);
    if (style.fontFamily) {
      const fontFamilies = style.fontFamily.split(',');
      for (const f of fontFamilies) {
        const clean = f.trim().replace(REGEX.QUOTES_TRIM, '');
        if (clean) fonts.add(clean);
      }
    }
  }

  return fonts;
};

export const cleanUpHTML = async (html: string) => {
  let fontsURL = FONTS_URL;
  const usedFonts = getUsedFonts();
  const unusedFonts = OPTIONS_FONT.filter((font) => !usedFonts.has(font));

  fontsURL = removeFonts(fontsURL, unusedFonts);

  const cleanedHTML = html
    .replace(REGEX.SCRIPT_MODULE_INLINE, '')
    .replace(REGEX.SCRIPT_MODULE_SELF_CLOSING, '')
    .replace(REGEX.GOOGLE_FONTS_LINK, `<link href="${fontsURL}" rel="stylesheet">`)
    .replace(REGEX.CLASS_ATTRIBUTE, (_match, classes) => {
      const filtered = classes
        .split(REGEX.WHITESPACE)
        .filter((cls: string) => cls !== SELECTOR_TARGET.replace('.', ''))
        .join(' ');
      return filtered ? `class="${filtered}"` : '';
    })
    .replace(REGEX.MOVEABLE_CSS_LINK, '')
    .replace(REGEX.CONTENTEDITABLE, '')
    .replace(REGEX.STYLED_COMPONENT, '');

  const options = {
    parser: PRETTIER_PARSER,
    printWidth: PRETTIER_PRINT_WIDTH,
    plugins: [parserHtml]
  };

  return await prettier.format(cleanedHTML, options);
};

export const minifyHTML = async (html: string) => {
  const cleaned = await cleanUpHTML(html);

  return cleaned
    .replace(REGEX.HTML_COMMENTS, '')
    .replace(REGEX.LINEBREAKS, '')
    .replace(REGEX.EXTRA_SPACES, ' ')
    .replace(REGEX.TAG_GAPS, '><')
    .replace(REGEX.STYLE_INLINE, (_, css: string) => {
      const minifiedCss = css
        .replace(REGEX.STYLE_COLON_SPACES, ':')
        .replace(REGEX.STYLE_SEMICOLON_SPACES, ';')
        .replace(REGEX.STYLE_COMMA_SPACES, ',')
        .trim();
      return `style="${minifiedCss}"`;
    })
    .trim();
};
