/**
 * Constants
 */

const REGEX = {
  COMMENTS: /\/\*[\s\S]*?\*\//g,
  WHITESPACE_AROUND_SYMBOLS: /\s*([{}:;,>])\s*/g,
  MULTIPLE_SPACES: /\s+/g,
  NEWLINES: /\n/g,
  SPACE_AFTER_COMMA: /,\s+/g
};

/**
 * Class definition
 */

export class CSSMinifier {
  constructor(private css: string) {}

  minify() {
    return this.css
      .replace(REGEX.COMMENTS, '')
      .replace(REGEX.NEWLINES, '')
      .replace(REGEX.WHITESPACE_AROUND_SYMBOLS, '$1')
      .replace(REGEX.SPACE_AFTER_COMMA, ',')
      .replace(REGEX.MULTIPLE_SPACES, ' ')
      .trim();
  }
}
