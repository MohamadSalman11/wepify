const REGEX = {
  COMMENTS: /\/\*[\s\S]*?\*\//g,
  WHITESPACE_AROUND_SYMBOLS: /\s*([{}:;,>])\s*/g,
  TRAILING_SEMICOLON: /;}/g,
  MULTIPLE_SPACES: /\s+/g
};

export function minifyCSS(css: string): string {
  return css
    .replace(REGEX.COMMENTS, '')
    .replace(REGEX.WHITESPACE_AROUND_SYMBOLS, '$1')
    .replace(REGEX.TRAILING_SEMICOLON, '}')
    .replace(REGEX.MULTIPLE_SPACES, ' ')
    .trim();
}
